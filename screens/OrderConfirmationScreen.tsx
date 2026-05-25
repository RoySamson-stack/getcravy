import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const OrderConfirmationScreen = ({ route, navigation }: any) => {
  const { orderId, total, status, restaurantName } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={96} color="#10b981" />
      </View>
      <Text style={styles.title}>Order Confirmed</Text>
      <Text style={styles.subtitle}>
        Your order has been placed successfully and is now tracked in the backend.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Restaurant</Text>
        <Text style={styles.value}>{restaurantName || 'cravyapp Partner'}</Text>

        <Text style={styles.label}>Order ID</Text>
        <Text style={styles.value}>{orderId || '-'}</Text>

        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{status || 'pending'}</Text>

        <Text style={styles.label}>Total</Text>
        <Text style={styles.total}>KES {Number(total || 0).toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Home')}>
        <LinearGradient colors={['#E23744', '#E23744']} style={styles.gradient}>
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('AllRestaurants')}>
        <Text style={styles.secondaryButtonText}>Continue Ordering</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconWrap: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 14,
  },
  total: {
    fontSize: 22,
    fontWeight: '800',
    color: '#E23744',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#E23744',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default OrderConfirmationScreen;
