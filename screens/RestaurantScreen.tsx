import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { restaurantAPI } from '../services/api';
import { menuAPI } from '../services/menuAPI';
import { reviewAPI } from '../services/reviewAPI';
import { dealAPI, Deal } from '../services/dealAPI';
import { reservationAPI } from '../services/reservationAPI';
import { useCart } from '../context/CartContext';
import { dummyMenuItems, dummyReviews, dummyRestaurants } from '../constants/dummyData';

const PRIMARY = '#E23744';
const PAPER = '#F7F5F2';
const INK = '#1A1A1A';
const BORDER = '#EBEBEB';

type TabKey = 'menu' | 'info' | 'reviews' | 'deals';

const normalizePrice = (value: any) => Number.parseFloat(String(value || 0)) || 0;

const RestaurantScreen = ({ route, navigation }: any) => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('menu');
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationStep, setReservationStep] = useState(1);
  const [reservationDetails, setReservationDetails] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    guests: '2',
    specialRequests: '',
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const result = await restaurantAPI.getById(route.params.id);
        if (result.success && result.restaurant) {
          const r = result.restaurant;
          setRestaurant({
            id: r.id,
            name: r.name,
            rating: Number.parseFloat(r.rating) || 4.6,
            category: r.category || 'Restaurant',
            price: r.priceRange || 'KES 800-1,500',
            address: r.address || 'Westlands, Nairobi',
            phone: r.phone || '+254700000000',
            hoursFormatted: typeof r.hours === 'string' ? r.hours : 'Open today · 10:00 - 23:00',
            description: r.description || 'A curated Nairobi dining spot for reservations, deals, and table bookings.',
            neighborhood: r.neighborhood || 'Westlands',
          });
        } else {
          const fallback = dummyRestaurants.find((r) => r.id === route.params.id) || dummyRestaurants[0];
          setRestaurant({ ...fallback, address: fallback?.address || 'Westlands, Nairobi', phone: '+254700000000' });
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        const fallback = dummyRestaurants.find((r) => r.id === route.params.id) || dummyRestaurants[0];
        setRestaurant({ ...fallback, id: route.params.id, name: route.params.name || fallback?.name || 'The Rooftop Kitchen', address: 'Westlands, Nairobi', phone: '+254700000000' });
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [route.params.id, route.params.name]);

  useEffect(() => {
    if (!restaurant?.id) return;

    const fetchSupportingData = async () => {
      try {
        const menuResult = await menuAPI.getRestaurantMenu(restaurant.id);
        setMenuItems(menuResult.success && menuResult.menuItems?.length ? menuResult.menuItems : dummyMenuItems);
      } catch (error) {
        console.error('Error fetching menu:', error);
        setMenuItems(dummyMenuItems);
      }

      try {
        const reviewResult = await reviewAPI.getRestaurantReviews(restaurant.id, 1, 8);
        setReviews(reviewResult.success && reviewResult.reviews?.length ? reviewResult.reviews.map((review: any) => ({
          id: review.id,
          user: review.user?.name || 'Guest',
          rating: review.rating || 5,
          date: new Date(review.createdAt || Date.now()).toLocaleDateString(),
          comment: review.comment || '',
        })) : dummyReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews(dummyReviews);
      }

      try {
        const dealResult = await dealAPI.getByRestaurant(restaurant.id);
        setDeals(dealResult.success ? dealResult.data : []);
      } catch (error) {
        console.error('Error fetching deals:', error);
        setDeals([]);
      }
    };

    fetchSupportingData();
  }, [restaurant?.id]);

  const menuByCategory = menuItems.reduce<Record<string, any[]>>((groups, item) => {
    const category = item.category || 'Mains';
    groups[category] = groups[category] || [];
    groups[category].push(item);
    return groups;
  }, {});

  const addMenuItem = async (item: any) => {
    if (!restaurant) return;
    await addItem({
      menuItemId: item.id,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      name: item.name,
      price: normalizePrice(item.price),
      quantity: 1,
      image: typeof item.image === 'string' ? item.image : undefined,
    });
    Alert.alert('Added to Cart', `${item.name} has been added.`, [
      { text: 'Keep browsing', style: 'cancel' },
      { text: 'Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const handleReservation = async () => {
    if (!user) {
      setReservationStep(3);
      return;
    }

    try {
      const result = await reservationAPI.createReservation(restaurant.id, {
        date: reservationDetails.date,
        time: reservationDetails.time,
        partySize: Number.parseInt(reservationDetails.guests, 10) || 2,
        specialRequests: reservationDetails.specialRequests,
      });

      if (!result.success) {
        Alert.alert('Reservation Failed', result.message || 'Unable to create reservation.');
        return;
      }
      setReservationStep(3);
    } catch (error) {
      console.error('Reservation error:', error);
      setReservationStep(3);
    }
  };

  const callRestaurant = () => {
    if (!restaurant?.phone) return;
    Linking.openURL(`tel:${restaurant.phone}`).catch(() => Alert.alert('Error', 'Failed to open phone app'));
  };

  const openReservation = () => {
    setReservationStep(1);
    setShowReservationModal(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={styles.loadingText}>Loading restaurant...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Restaurant not found.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.shell}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>9:43</Text>
            <Ionicons name="battery-half" size={15} color="#FFFFFF" />
          </View>
          <View style={styles.backRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerCopy}>
              <Text style={styles.headerTitle} numberOfLines={1}>{restaurant.name}</Text>
              <Text style={styles.headerSubtitle}>{restaurant.neighborhood || restaurant.address} · 1.2km away</Text>
            </View>
            <TouchableOpacity style={styles.headerCircle}>
              <Ionicons name={user?.favorites?.includes(restaurant.id) ? 'heart' : 'heart-outline'} size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabBar}>
          {[
            ['menu', 'Menu'],
            ['info', 'Info'],
            ['reviews', 'Reviews'],
            ['deals', 'Deals'],
          ].map(([key, label]) => (
            <TouchableOpacity key={key} style={[styles.tab, activeTab === key && styles.tabActive]} onPress={() => setActiveTab(key as TabKey)}>
              <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.content}>
          {activeTab === 'menu' && (
            <>
              {Object.entries(menuByCategory).slice(0, 4).map(([category, items]) => (
                <View key={category} style={styles.menuCard}>
                  <Text style={styles.menuSection}>{category}</Text>
                  {items.slice(0, 4).map((item) => (
                    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => addMenuItem(item)}>
                      <View style={styles.menuItemCopy}>
                        <Text style={styles.menuItemName}>{item.name}</Text>
                        <Text style={styles.menuItemDesc} numberOfLines={1}>{item.description || 'Freshly prepared by the kitchen'}</Text>
                      </View>
                      <Text style={styles.menuPrice}>KES {normalizePrice(item.price).toLocaleString()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
              <View style={styles.budgetEstimate}>
                <Ionicons name="calculator-outline" size={22} color={PRIMARY} />
                <View>
                  <Text style={styles.budgetTitle}>Budget estimate</Text>
                  <Text style={styles.budgetValue}>Starter + main ≈ KES 1,250 / person</Text>
                </View>
              </View>
            </>
          )}

          {activeTab === 'info' && (
            <View style={styles.menuCard}>
              <InfoRow icon="location-outline" title="Address" value={restaurant.address} />
              <InfoRow icon="time-outline" title="Hours" value={restaurant.hoursFormatted || 'Open today · 10:00 - 23:00'} />
              <InfoRow icon="restaurant-outline" title="Cuisine" value={`${restaurant.category || 'Restaurant'} · ${restaurant.price || 'KES 800-1,500'}`} />
              <Text style={styles.aboutText}>{restaurant.description}</Text>
              <TouchableOpacity style={styles.secondaryButton} onPress={callRestaurant}>
                <Ionicons name="call" size={18} color={PRIMARY} />
                <Text style={styles.secondaryButtonText}>Call restaurant</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'reviews' && (
            <>
              <View style={styles.ratingPanel}>
                <Text style={styles.ratingBig}>{Number(restaurant.rating || 4.6).toFixed(1)}</Text>
                <Text style={styles.ratingMeta}>{reviews.length} reviews · Loved by diners</Text>
              </View>
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUser}>{review.user}</Text>
                    <Text style={styles.reviewStars}>★ {review.rating}</Text>
                  </View>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                  <Text style={styles.reviewComment}>{review.comment || 'Great food and smooth booking experience.'}</Text>
                </View>
              ))}
            </>
          )}

          {activeTab === 'deals' && (
            <>
              <View style={styles.happyHourBand}>
                <Text style={styles.livePill}>Live</Text>
                <View>
                  <Text style={styles.happyTitle}>Happy hour available</Text>
                  <Text style={styles.happySub}>Ask for today’s table-only offer before checkout.</Text>
                </View>
              </View>
              {(deals.length ? deals : [{ id: 'fallback', title: '2-for-1 lunch combo', description: 'Save on a meal for two.', discount: 'Save 50%' } as any]).map((deal) => (
                <View key={deal.id} style={styles.dealCard}>
                  <View>
                    <Text style={styles.dealTitle}>{deal.title}</Text>
                    <Text style={styles.dealDesc}>{deal.description || 'Limited time restaurant offer.'}</Text>
                  </View>
                  <Text style={styles.dealDiscount}>{deal.discount || 'Claim'}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        <View style={{ height: 104 }} />
      </ScrollView>

      <View style={styles.stickyCta}>
        <TouchableOpacity style={styles.primaryButton} onPress={openReservation}>
          <Text style={styles.primaryButtonText}>Reserve a table</Text>
        </TouchableOpacity>
      </View>

      <ReservationModal
        visible={showReservationModal}
        step={reservationStep}
        restaurantName={restaurant.name}
        details={reservationDetails}
        setDetails={setReservationDetails}
        onClose={() => setShowReservationModal(false)}
        onNext={() => setReservationStep(2)}
        onConfirm={handleReservation}
        onDone={() => {
          setShowReservationModal(false);
          navigation.navigate('Bookings');
        }}
      />
    </View>
  );
};

const InfoRow = ({ icon, title, value }: { icon: any; title: string; value: string }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={22} color={PRIMARY} />
    <View style={styles.infoCopy}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const ReservationModal = ({ visible, step, restaurantName, details, setDetails, onClose, onNext, onConfirm, onDone }: any) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        <View style={styles.stepBar}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.stepGroup}>
              <View style={[styles.stepCircle, step >= item && styles.stepCircleActive]}><Text style={[styles.stepText, step >= item && styles.stepTextActive]}>{item}</Text></View>
              <Text style={styles.stepLabel}>{item === 1 ? 'Time' : item === 2 ? 'Details' : 'Done'}</Text>
            </View>
          ))}
        </View>

        {step === 1 && (
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>Reserve a table</Text>
            <Text style={styles.modalSub}>{restaurantName}</Text>
            <TextInput style={styles.input} value={details.date} onChangeText={(date) => setDetails({ ...details, date })} placeholder="YYYY-MM-DD" />
            <TextInput style={styles.input} value={details.time} onChangeText={(time) => setDetails({ ...details, time })} placeholder="19:00" />
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Guests</Text>
              <TextInput style={styles.guestInput} value={details.guests} onChangeText={(guests) => setDetails({ ...details, guests })} keyboardType="numeric" />
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={onNext}><Text style={styles.primaryButtonText}>Continue</Text></TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>Booking details</Text>
            <View style={styles.summaryCard}>
              <SummaryRow label="Restaurant" value={restaurantName} />
              <SummaryRow label="Date" value={details.date} />
              <SummaryRow label="Time" value={details.time} />
              <SummaryRow label="Guests" value={details.guests} />
            </View>
            <TextInput style={[styles.input, styles.textArea]} value={details.specialRequests} onChangeText={(specialRequests) => setDetails({ ...details, specialRequests })} placeholder="Special requests" multiline />
            <Text style={styles.cancelNote}>Free cancellation before the restaurant confirms.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={onConfirm}><Text style={styles.primaryButtonText}>Confirm reservation</Text></TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.confirmBody}>
            <View style={styles.confirmIcon}><Ionicons name="checkmark" size={30} color={PRIMARY} /></View>
            <Text style={styles.modalTitle}>Reservation requested</Text>
            <Text style={styles.modalSub}>Your table request for {restaurantName} is ready to review in bookings.</Text>
            <View style={styles.summaryCard}>
              <SummaryRow label="Date" value={details.date} />
              <SummaryRow label="Time" value={details.time} />
              <SummaryRow label="Guests" value={details.guests} />
              <SummaryRow label="Status" value="Pending" red />
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={onDone}><Text style={styles.primaryButtonText}>View booking</Text></TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.closeModal} onPress={onClose}><Text style={styles.closeModalText}>Close</Text></TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const SummaryRow = ({ label, value, red }: { label: string; value: string; red?: boolean }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryValue, red && styles.summaryValueRed]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: PAPER },
  container: { flex: 1, backgroundColor: PAPER },
  header: { backgroundColor: PRIMARY, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 14 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.16)' },
  headerCopy: { flex: 1 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  headerSubtitle: { color: 'rgba(255,255,255,0.72)', fontSize: 12, marginTop: 2 },
  headerCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.16)' },
  tabBar: { flexDirection: 'row', backgroundColor: PAPER, borderBottomWidth: 1, borderBottomColor: BORDER },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 13, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: PRIMARY },
  tabText: { color: '#888888', fontSize: 14, fontWeight: '800' },
  tabTextActive: { color: PRIMARY },
  content: { padding: 16 },
  menuCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: BORDER, padding: 14, marginBottom: 12 },
  menuSection: { color: '#888888', fontSize: 12, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuItemCopy: { flex: 1, paddingRight: 10 },
  menuItemName: { color: INK, fontSize: 15, fontWeight: '800' },
  menuItemDesc: { color: '#888888', fontSize: 12, marginTop: 3 },
  menuPrice: { color: PRIMARY, fontSize: 14, fontWeight: '900' },
  budgetEstimate: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF4F4', borderWidth: 1, borderColor: '#FCD5D5', borderRadius: 12, padding: 13, marginBottom: 12 },
  budgetTitle: { color: '#A32D2D', fontSize: 14, fontWeight: '900' },
  budgetValue: { color: '#C04040', fontSize: 12, marginTop: 2 },
  infoRow: { flexDirection: 'row', gap: 12, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  infoCopy: { flex: 1 },
  infoTitle: { color: INK, fontSize: 14, fontWeight: '900' },
  infoValue: { color: '#777777', fontSize: 13, marginTop: 2, lineHeight: 18 },
  aboutText: { color: '#666666', fontSize: 14, lineHeight: 20, marginTop: 12 },
  secondaryButton: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: PRIMARY, borderRadius: 10, paddingVertical: 12 },
  secondaryButtonText: { color: PRIMARY, fontSize: 14, fontWeight: '900' },
  ratingPanel: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: BORDER, padding: 16, alignItems: 'center', marginBottom: 12 },
  ratingBig: { color: INK, fontSize: 38, fontWeight: '900' },
  ratingMeta: { color: '#888888', fontSize: 13, marginTop: 3 },
  reviewCard: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: BORDER, padding: 13, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewUser: { color: INK, fontSize: 14, fontWeight: '900' },
  reviewStars: { color: PRIMARY, fontSize: 13, fontWeight: '900' },
  reviewDate: { color: '#AAAAAA', fontSize: 11, marginTop: 3 },
  reviewComment: { color: '#666666', fontSize: 13, marginTop: 8, lineHeight: 18 },
  happyHourBand: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF4F4', borderWidth: 1, borderColor: '#FCD5D5', borderRadius: 12, padding: 13, marginBottom: 12 },
  livePill: { backgroundColor: PRIMARY, color: '#FFFFFF', borderRadius: 999, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 4, fontSize: 12, fontWeight: '900' },
  happyTitle: { color: '#A32D2D', fontSize: 14, fontWeight: '900' },
  happySub: { color: '#C04040', fontSize: 12, marginTop: 2 },
  dealCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: BORDER, padding: 13, marginBottom: 10 },
  dealTitle: { color: INK, fontSize: 15, fontWeight: '900' },
  dealDesc: { color: '#888888', fontSize: 12, marginTop: 3 },
  dealDiscount: { color: '#A32D2D', backgroundColor: '#FFF4F4', borderRadius: 6, overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 4, fontSize: 12, fontWeight: '900' },
  stickyCta: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: BORDER, padding: 14 },
  primaryButton: { backgroundColor: PRIMARY, borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: PAPER, padding: 20 },
  loadingText: { color: '#888888', marginTop: 12 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.36)' },
  modalCard: { backgroundColor: PAPER, borderTopLeftRadius: 22, borderTopRightRadius: 22, overflow: 'hidden' },
  stepBar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: PRIMARY, paddingVertical: 14 },
  stepGroup: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: '#FFFFFF' },
  stepText: { color: '#FFFFFF', fontWeight: '900' },
  stepTextActive: { color: PRIMARY },
  stepLabel: { color: 'rgba(255,255,255,0.82)', fontSize: 11, fontWeight: '800' },
  modalBody: { padding: 18 },
  confirmBody: { alignItems: 'center', padding: 18 },
  modalTitle: { color: INK, fontSize: 20, fontWeight: '900', marginBottom: 4 },
  modalSub: { color: '#888888', fontSize: 13, marginBottom: 14, textAlign: 'center' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 10, color: INK },
  textArea: { minHeight: 82, textAlignVertical: 'top' },
  guestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: BORDER, borderRadius: 10, padding: 12, marginBottom: 12 },
  guestLabel: { color: INK, fontWeight: '900' },
  guestInput: { color: INK, fontWeight: '900', minWidth: 44, textAlign: 'center' },
  summaryCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 12, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  summaryLabel: { color: '#888888', fontSize: 13 },
  summaryValue: { color: INK, fontSize: 13, fontWeight: '900' },
  summaryValueRed: { color: PRIMARY },
  cancelNote: { color: '#888888', fontSize: 12, marginBottom: 12 },
  confirmIcon: { width: 58, height: 58, borderRadius: 29, borderWidth: 2, borderColor: PRIMARY, backgroundColor: '#FFF4F4', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  closeModal: { alignItems: 'center', paddingBottom: 18 },
  closeModalText: { color: PRIMARY, fontWeight: '900' },
});

export default RestaurantScreen;
