import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { reservationAPI } from '../services/reservationAPI';

const PRIMARY = '#E23744';
const PAPER = '#F7F5F2';
const INK = '#1A1A1A';
const BORDER = '#EBEBEB';

const fallbackReservation = {
  id: 'preview-reservation',
  restaurantId: 'preview-restaurant',
  restaurant: { name: 'The Rooftop Kitchen' },
  date: new Date().toISOString(),
  time: '19:00',
  partySize: 2,
  status: 'pending',
  specialRequests: 'Window table if available',
};

const BookingsScreen = ({ navigation }: any) => {
  const { user } = useContext(AuthContext) || {};
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      if (!user) {
        setReservations([fallbackReservation]);
        return;
      }

      const result = await reservationAPI.getUserReservations({ upcoming: true });
      setReservations(result.success && result.reservations?.length ? result.reservations : []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReservations();
  };

  const statusTone = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#00A86B';
      case 'cancelled':
        return '#8A8A8A';
      default:
        return PRIMARY;
    }
  };

  const displayReservations = reservations.length ? reservations : [];

  return (
    <View style={styles.shell}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />}
      >
        <View style={styles.header}>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>9:41</Text>
            <Ionicons name="battery-half" size={15} color="#FFFFFF" />
          </View>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Bookings</Text>
              <Text style={styles.headerSubtitle}>Reservations and table requests</Text>
            </View>
            <TouchableOpacity style={styles.headerCircle} onPress={() => navigation.navigate('Home')}>
              <Ionicons name="home-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.stepStrip}>
          {['Pick time', 'Details', 'Confirmed'].map((label, index) => (
            <View key={label} style={styles.stepItem}>
              <View style={[styles.stepCircle, index < 3 && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, index < 3 && styles.stepNumberActive]}>{index + 1}</Text>
              </View>
              <Text style={styles.stepLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        ) : displayReservations.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.confirmIcon}><Ionicons name="calendar-outline" size={30} color={PRIMARY} /></View>
            <Text style={styles.emptyTitle}>No reservations yet</Text>
            <Text style={styles.emptySub}>Book a table from any restaurant page and it will show here.</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('AllRestaurants')}>
              <Text style={styles.primaryButtonText}>Find restaurants</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>Upcoming reservations</Text>
            {displayReservations.map((reservation) => {
              const date = new Date(reservation.date);
              const tone = statusTone(reservation.status);
              return (
                <TouchableOpacity key={reservation.id} style={styles.bookingCard} onPress={() => navigation.navigate('Restaurant', { id: reservation.restaurantId })}>
                  <View style={styles.cardTop}>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateDay}>{date.getDate()}</Text>
                      <Text style={styles.dateMonth}>{date.toLocaleDateString('en-US', { month: 'short' })}</Text>
                    </View>
                    <View style={styles.bookingInfo}>
                      <Text style={styles.bookingTitle}>{reservation.restaurant?.name || 'Restaurant'}</Text>
                      <Text style={styles.bookingMeta}>{reservation.time} · {reservation.partySize || 2} guests</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${tone}18` }]}>
                      <Text style={[styles.statusBadgeText, { color: tone }]}>{reservation.status || 'pending'}</Text>
                    </View>
                  </View>
                  <View style={styles.summaryCard}>
                    <SummaryRow label="Date" value={date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} />
                    <SummaryRow label="Time" value={reservation.time || '19:00'} />
                    <SummaryRow label="Guests" value={String(reservation.partySize || 2)} />
                    <SummaryRow label="Status" value={reservation.status || 'pending'} red />
                  </View>
                  {!!reservation.specialRequests && <Text style={styles.specialText}>{reservation.specialRequests}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 88 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          ['home', 'Home', 'Home'],
          ['search', 'Discover', 'AllRestaurants'],
          ['calendar', 'Events', 'Events'],
          ['pricetag', 'Deals', 'Home'],
          ['person', 'Profile', 'Profile'],
        ].map(([icon, label, target]) => (
          <TouchableOpacity key={label} style={styles.navItem} onPress={() => navigation.navigate(target)}>
            <Ionicons name={icon as any} size={22} color={label === 'Home' ? PRIMARY : '#BDBDBD'} />
            <Text style={[styles.navLabel, label === 'Home' && styles.navLabelActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const SummaryRow = ({ label, value, red }: { label: string; value: string; red?: boolean }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryValue, red && styles.summaryValueRed]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: PAPER },
  container: { flex: 1, backgroundColor: PAPER },
  header: { backgroundColor: PRIMARY, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  headerSubtitle: { color: 'rgba(255,255,255,0.72)', fontSize: 13, marginTop: 2 },
  headerCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  stepStrip: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: PRIMARY, paddingBottom: 13, paddingHorizontal: 12 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: '#FFFFFF' },
  stepNumber: { color: '#FFFFFF', fontWeight: '900' },
  stepNumberActive: { color: PRIMARY },
  stepLabel: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  listContainer: { padding: 16 },
  sectionTitle: { color: INK, fontSize: 17, fontWeight: '900', marginBottom: 10 },
  bookingCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: BORDER, padding: 12, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dateBox: { backgroundColor: '#FFF4F4', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, alignItems: 'center', marginRight: 10 },
  dateDay: { color: PRIMARY, fontSize: 20, fontWeight: '900', lineHeight: 22 },
  dateMonth: { color: PRIMARY, fontSize: 11, textTransform: 'uppercase' },
  bookingInfo: { flex: 1 },
  bookingTitle: { color: INK, fontSize: 15, fontWeight: '900' },
  bookingMeta: { color: '#888888', fontSize: 12, marginTop: 3 },
  statusBadge: { borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  statusBadgeText: { fontSize: 11, fontWeight: '900', textTransform: 'capitalize' },
  summaryCard: { borderWidth: 1, borderColor: '#F2F2F2', borderRadius: 10, paddingHorizontal: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  summaryLabel: { color: '#888888', fontSize: 12 },
  summaryValue: { color: INK, fontSize: 12, fontWeight: '900', textTransform: 'capitalize' },
  summaryValueRed: { color: PRIMARY },
  specialText: { color: '#888888', fontSize: 12, fontStyle: 'italic', marginTop: 9 },
  emptyCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: BORDER, margin: 16, padding: 20 },
  confirmIcon: { width: 58, height: 58, borderRadius: 29, borderWidth: 2, borderColor: PRIMARY, backgroundColor: '#FFF4F4', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { color: INK, fontSize: 18, fontWeight: '900' },
  emptySub: { color: '#888888', fontSize: 13, textAlign: 'center', lineHeight: 19, marginTop: 5, marginBottom: 14 },
  primaryButton: { backgroundColor: PRIMARY, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 12 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '900' },
  loadingContainer: { alignItems: 'center', paddingVertical: 70 },
  loadingText: { color: '#888888', marginTop: 12 },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 8, paddingBottom: 14 },
  navItem: { alignItems: 'center', gap: 3 },
  navLabel: { color: '#BDBDBD', fontSize: 11 },
  navLabelActive: { color: PRIMARY, fontWeight: '900' },
});

export default BookingsScreen;
