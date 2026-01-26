import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { reservationAPI } from '../services/reservationAPI';
import { eventAPI, Event } from '../services/eventAPI';

const BookingsScreen = ({ navigation }: any) => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors } = theme;
  const { user } = useContext(AuthContext) || {};

  const [activeTab, setActiveTab] = useState<'reservations' | 'events'>('reservations');
  const [reservations, setReservations] = useState<any[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'reservations') {
        const result = await reservationAPI.getUserReservations({ upcoming: true });
        if (result.success && result.reservations) {
          setReservations(result.reservations);
        }
      } else {
        // Fetch events user is attending
        // Note: This would require a new API endpoint: GET /api/users/me/events
        // For now, we'll show a placeholder
        setEvents([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderReservation = (reservation: any) => (
    <TouchableOpacity
      style={[styles.bookingCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => navigation.navigate('Restaurant', { id: reservation.restaurantId })}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.bookingIconContainer}>
          <Ionicons name="restaurant" size={24} color={colors.primary} />
        </View>
        <View style={styles.bookingInfo}>
          <Text style={[styles.bookingTitle, { color: colors.text }]}>
            {reservation.restaurant?.name || 'Restaurant'}
          </Text>
          <View style={styles.bookingMeta}>
            <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
            <Text style={[styles.bookingMetaText, { color: colors.textLight }]}>
              {new Date(reservation.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
            <Ionicons name="time-outline" size={14} color={colors.textLight} style={styles.bookingMetaIcon} />
            <Text style={[styles.bookingMetaText, { color: colors.textLight }]}>
              {reservation.time}
            </Text>
            <Ionicons name="people-outline" size={14} color={colors.textLight} style={styles.bookingMetaIcon} />
            <Text style={[styles.bookingMetaText, { color: colors.textLight }]}>
              {reservation.partySize} guests
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(reservation.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(reservation.status) }]}>
            {reservation.status}
          </Text>
        </View>
      </View>
      {reservation.specialRequests && (
        <Text style={[styles.specialRequests, { color: colors.textLight }]}>
          {reservation.specialRequests}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderEvent = (event: Event) => (
    <TouchableOpacity
      style={[styles.bookingCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.bookingIconContainer}>
          <Ionicons name="calendar" size={24} color={colors.primary} />
        </View>
        <View style={styles.bookingInfo}>
          <Text style={[styles.bookingTitle, { color: colors.text }]}>{event.title}</Text>
          <View style={styles.bookingMeta}>
            <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
            <Text style={[styles.bookingMetaText, { color: colors.textLight }]}>
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
            <Ionicons name="time-outline" size={14} color={colors.textLight} style={styles.bookingMetaIcon} />
            <Text style={[styles.bookingMetaText, { color: colors.textLight }]}>
              {event.time.substring(0, 5)}
            </Text>
            <Ionicons name="location-outline" size={14} color={colors.textLight} style={styles.bookingMetaIcon} />
            <Text style={[styles.bookingMetaText, { color: colors.textLight }]} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        </View>
        {event.userAttendance && (
          <View style={[styles.statusBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.statusText, { color: colors.primary }]}>
              {event.userAttendance.status}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textLight;
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={64} color={colors.textLight} />
          <Text style={[styles.emptyText, { color: colors.text }]}>Please login to view bookings</Text>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'reservations' && [styles.activeTab, { borderBottomColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('reservations')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'reservations' ? colors.primary : colors.textLight },
            ]}
          >
            Reservations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'events' && [styles.activeTab, { borderBottomColor: colors.primary }],
          ]}
          onPress={() => setActiveTab('events')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'events' ? colors.primary : colors.textLight },
            ]}
          >
            Events
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textLight }]}>Loading...</Text>
          </View>
        ) : activeTab === 'reservations' ? (
          reservations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color={colors.textLight} />
              <Text style={[styles.emptyText, { color: colors.text }]}>No reservations</Text>
              <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
                Book a table at your favorite restaurant
              </Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {reservations.map((reservation) => (
                <View key={reservation.id}>{renderReservation(reservation)}</View>
              ))}
            </View>
          )
        ) : events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.textLight} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No events</Text>
            <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
              Discover and attend exciting food events
            </Text>
            <TouchableOpacity
              style={[styles.browseButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Events')}
            >
              <Text style={styles.browseButtonText}>Browse Events</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {events.map((event) => (
              <View key={event.id}>{renderEvent(event)}</View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
  },
  bookingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bookingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  bookingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  bookingMetaText: {
    fontSize: 12,
    marginLeft: 4,
  },
  bookingMetaIcon: {
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  specialRequests: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  loginButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingsScreen;


