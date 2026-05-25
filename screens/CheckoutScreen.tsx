import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/orderAPI';

WebBrowser.maybeCompleteAuthSession();

const CheckoutScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { items, summary, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const restaurantName = useMemo(() => items[0]?.restaurantName || 'Restaurant', [items]);

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login before placing an order.');
      navigation.navigate('Login');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Add items before placing an order.');
      navigation.goBack();
      return;
    }

    if (!deliveryAddress.trim()) {
      Alert.alert('Address Required', 'Please enter a delivery address.');
      return;
    }

    try {
      setPlacingOrder(true);
      const result = await orderAPI.createOrder({
        restaurantId: items[0].restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
        paymentMethod,
        deliveryAddress: deliveryAddress.trim(),
        deliveryInstructions: deliveryInstructions.trim() || undefined,
        contactPhone: user.phone,
      });

      if (!result.success || !result.order) {
        Alert.alert('Order Failed', result.message || 'Unable to place order.');
        return;
      }

      if (paymentMethod === 'cash') {
        await clearCart();
        navigation.replace('OrderConfirmation', {
          orderId: result.order.id,
          total: String(result.order.total),
          status: result.order.status,
          restaurantName: result.order.restaurant?.name || restaurantName,
        });
        return;
      }

      if (!result.checkout?.authorizationUrl) {
        Alert.alert('Payment Failed', 'Unable to initialize Paystack checkout.');
        return;
      }

      const redirectUrl = Linking.createURL('paystack-callback');
      const browserResult = await WebBrowser.openAuthSessionAsync(
        result.checkout.authorizationUrl,
        redirectUrl
      );

      if (browserResult.type !== 'success' || !browserResult.url) {
        Alert.alert('Payment Cancelled', 'The Paystack checkout was not completed.');
        return;
      }

      const parsed = Linking.parse(browserResult.url);
      const callbackReference =
        typeof parsed.queryParams?.reference === 'string'
          ? parsed.queryParams.reference
          : result.checkout.reference;

      const verification = await orderAPI.verifyPayment(result.order.id, callbackReference);
      if (!verification.success || !verification.order) {
        Alert.alert('Verification Failed', verification.message || 'Unable to verify Paystack payment.');
        return;
      }

      await clearCart();
      navigation.replace('OrderConfirmation', {
        orderId: verification.order.id,
        total: String(verification.order.total),
        status: verification.order.status,
        restaurantName: verification.order.restaurant?.name || restaurantName,
      });
    } catch (error) {
      console.error('Place order error:', error);
      Alert.alert('Order Failed', 'An unexpected error occurred while placing your order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Ionicons name="location-outline" size={20} color="#E23744" />
              <Text style={styles.addressTitle}>Delivery Address</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            {[
              { key: 'card', icon: 'card-outline', label: 'Paystack' },
              { key: 'cash', icon: 'cash-outline', label: 'Cash on Delivery' },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.paymentMethod,
                  paymentMethod === option.key && styles.selectedPaymentMethod
                ]}
                onPress={() => setPaymentMethod(option.key as 'card' | 'cash')}
              >
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={paymentMethod === option.key ? '#E23744' : '#666'}
                />
                <Text style={[
                  styles.paymentMethodText,
                  paymentMethod === option.key && styles.selectedPaymentMethodText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {paymentMethod === 'card' && (
            <View style={styles.paystackNotice}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#E23744" />
              <Text style={styles.paystackNoticeText}>
                You will complete this payment securely on Paystack.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Instructions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any special instructions for delivery?"
            value={deliveryInstructions}
            onChangeText={setDeliveryInstructions}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {items.map((item) => (
            <View key={item.menuItemId} style={styles.orderItem}>
              <Text style={styles.orderItemName}>{item.quantity}x {item.name}</Text>
              <Text style={styles.orderItemPrice}>KES {(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>KES {summary.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>KES {summary.deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>KES {summary.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>KES {summary.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder} disabled={placingOrder || items.length === 0}>
        <LinearGradient colors={['#E23744', '#E23744']} style={[styles.gradient, (placingOrder || items.length === 0) && styles.disabledButton]}>
          <Text style={styles.placeOrderButtonText}>
            {placingOrder ? 'Placing Order...' : `Place Order - KES ${summary.total.toFixed(2)}`}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  addressCard: {
    backgroundColor: '#FFF9F2',
    borderRadius: 10,
    padding: 15,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentMethod: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 5,
  },
  selectedPaymentMethod: {
    borderColor: '#E23744',
    backgroundColor: '#FFF9F2',
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  selectedPaymentMethodText: {
    color: '#E23744',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  paystackNotice: {
    marginTop: 8,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FFF9F2',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paystackNoticeText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderItemName: {
    fontSize: 14,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E23744',
  },
  placeOrderButton: {
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  gradient: {
    padding: 18,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
