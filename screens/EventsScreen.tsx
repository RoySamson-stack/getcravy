import React, { useEffect, useState } from 'react';
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
import { eventAPI, Event } from '../services/eventAPI';

const PRIMARY = '#E23744';
const PAPER = '#F7F5F2';
const INK = '#1A1A1A';

const eventTypeFilters = [
  { id: 'all', label: 'All' },
  { id: 'festival', label: 'Festival' },
  { id: 'popup', label: 'Pop-up' },
  { id: 'restaurant_event', label: 'Chef table' },
  { id: 'entertainment', label: 'Live Music' },
];

const weekDays = [
  { day: 'Mon', date: '20' },
  { day: 'Tue', date: '21' },
  { day: 'Wed', date: '22' },
  { day: 'Thu', date: '23' },
  { day: 'Fri', date: '24', active: true },
  { day: 'Sat', date: '25' },
  { day: 'Sun', date: '26' },
];

const fallbackEvents: Event[] = [
  {
    id: 'fallback-food-festival',
    title: 'Nairobi Food Festival',
    description: 'Street food, chef pop-ups, and music in one place.',
    location: 'Uhuru Gardens',
    date: new Date().toISOString(),
    time: '18:00:00',
    price: 500,
    eventType: 'festival',
    imageUrl: '',
    attendeesCount: 148,
    restaurantId: '',
    userId: 'system',
    featured: true,
    restaurant: undefined,
    isActive: true,
  },
  {
    id: 'fallback-brunch-popup',
    title: 'Sunday Brunch Pop-up',
    description: 'A curated brunch with live DJs and guest chefs.',
    location: 'Kilimani',
    date: new Date(Date.now() + 86400000).toISOString(),
    time: '11:00:00',
    price: 1200,
    eventType: 'popup',
    imageUrl: '',
    attendeesCount: 42,
    restaurantId: '',
    userId: 'system',
    featured: true,
    restaurant: undefined,
    isActive: true,
  },
];

const EventsScreen = ({ navigation, route }: any) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(route?.params?.vibe || 'all');

  const fetchEvents = async (filter: string) => {
    try {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const filters: any = {
        limit: 20,
        sortBy: 'date',
        sortOrder: 'ASC',
        dateFrom: today.toISOString().split('T')[0],
      };

      if (filter !== 'all') {
        filters.eventType = filter;
      }

      filters.dateTo = nextWeek.toISOString().split('T')[0];

      const response = await eventAPI.getAll(filters);
      setEvents(response.success && response.data.length > 0 ? response.data : fallbackEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(fallbackEvents);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchEvents(selectedFilter);
  }, [selectedFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents(selectedFilter);
  };

  const formatDate = (dateValue: string) => {
    const date = new Date(dateValue);
    return {
      day: String(date.getDate()).padStart(2, '0'),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    };
  };

  const featuredEvent = events[0] || fallbackEvents[0];

  if (loading && events.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

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
              <Text style={styles.headerTitle}>Events</Text>
              <Text style={styles.headerSubtitle}>What's happening in Nairobi</Text>
            </View>
            <TouchableOpacity style={styles.headerCircle} onPress={() => navigation.navigate('Bookings')}>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#AAAAAA" />
            <Text style={styles.searchText}>Search events...</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekStrip}>
          {weekDays.map((item) => (
            <View key={`${item.day}-${item.date}`} style={[styles.weekDay, item.active && styles.weekDayActive]}>
              <Text style={[styles.weekLabel, item.active && styles.weekTextActive]}>{item.day}</Text>
              <Text style={[styles.weekDate, item.active && styles.weekTextActive]}>{item.date}</Text>
              {item.active && <View style={styles.weekDot} />}
            </View>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {eventTypeFilters.map((item) => {
            const active = selectedFilter === item.id;
            return (
              <TouchableOpacity key={item.id} style={[styles.filterChip, active && styles.filterChipActive]} onPress={() => setSelectedFilter(item.id)}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured event</Text>
          <TouchableOpacity style={styles.featuredCard} onPress={() => navigation.navigate('EventDetail', { eventId: featuredEvent.id })}>
            <View style={styles.featuredTop}>
              <View style={styles.featuredBadge}>
                <Ionicons name="flame" size={12} color="#FFFFFF" />
                <Text style={styles.featuredBadgeText}>Trending</Text>
              </View>
              <Text style={styles.featuredTitle} numberOfLines={1}>{featuredEvent.title}</Text>
              <Text style={styles.featuredLocation} numberOfLines={1}>{featuredEvent.location}</Text>
            </View>
            <View style={styles.featuredBottom}>
              <Text style={styles.featuredPrice}>{featuredEvent.price ? `KES ${featuredEvent.price}` : 'Free'}</Text>
              <View style={styles.featuredButton}><Text style={styles.featuredButtonText}>Get ticket</Text></View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Coming up</Text>
            <Text style={styles.sectionAction}>{events.length} events</Text>
          </View>
          {events.map((event) => {
            const date = formatDate(event.date);
            return (
              <TouchableOpacity key={event.id} style={styles.eventRow} onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}>
                <View style={styles.eventDateBox}>
                  <Text style={styles.eventDay}>{date.day}</Text>
                  <Text style={styles.eventMonth}>{date.month}</Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventName} numberOfLines={1}>{event.title}</Text>
                  <Text style={styles.eventLocation} numberOfLines={1}>{date.label} · {event.location}</Text>
                  <View style={styles.eventFooter}>
                    <Text style={styles.eventPrice}>{event.price ? `KES ${event.price}` : 'Free'}</Text>
                    <Text style={styles.eventType}>{event.eventType?.replace('_', ' ') || 'Event'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

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
            <Ionicons name={icon as any} size={22} color={label === 'Events' ? PRIMARY : '#BDBDBD'} />
            <Text style={[styles.navLabel, label === 'Events' && styles.navLabelActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: PAPER },
  container: { flex: 1, backgroundColor: PAPER },
  header: { backgroundColor: PRIMARY, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  headerSubtitle: { color: 'rgba(255,255,255,0.72)', fontSize: 13, marginTop: 2 },
  headerCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 },
  searchText: { color: '#AAAAAA', fontSize: 14 },
  weekStrip: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EBEBEB', paddingHorizontal: 10 },
  weekDay: { alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  weekDayActive: { borderBottomColor: PRIMARY },
  weekLabel: { color: '#AAAAAA', fontSize: 12, fontWeight: '600' },
  weekDate: { color: '#444444', fontSize: 15, fontWeight: '800', marginTop: 2 },
  weekTextActive: { color: PRIMARY },
  weekDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: PRIMARY, marginTop: 4 },
  filterRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: { borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#FFFFFF' },
  filterChipActive: { backgroundColor: INK, borderColor: INK },
  filterText: { color: '#444444', fontSize: 13, fontWeight: '700' },
  filterTextActive: { color: '#FFFFFF' },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { color: INK, fontSize: 17, fontWeight: '800', marginBottom: 10 },
  sectionAction: { color: PRIMARY, fontSize: 13, fontWeight: '800' },
  featuredCard: { backgroundColor: INK, borderRadius: 14, overflow: 'hidden', marginBottom: 8 },
  featuredTop: { backgroundColor: '#2D1A1E', padding: 16 },
  featuredBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: PRIMARY, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8 },
  featuredBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  featuredTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  featuredLocation: { color: 'rgba(255,255,255,0.62)', fontSize: 13, marginTop: 3 },
  featuredBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  featuredPrice: { color: PRIMARY, fontSize: 22, fontWeight: '900' },
  featuredButton: { backgroundColor: PRIMARY, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  featuredButtonText: { color: '#FFFFFF', fontWeight: '800' },
  eventRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#EBEBEB', overflow: 'hidden', marginBottom: 9 },
  eventDateBox: { backgroundColor: '#FFF4F4', paddingHorizontal: 13, alignItems: 'center', justifyContent: 'center', minWidth: 58 },
  eventDay: { color: PRIMARY, fontSize: 22, fontWeight: '900', lineHeight: 24 },
  eventMonth: { color: PRIMARY, fontSize: 11, textTransform: 'uppercase' },
  eventInfo: { flex: 1, padding: 12 },
  eventName: { color: INK, fontSize: 15, fontWeight: '800' },
  eventLocation: { color: '#888888', fontSize: 12, marginTop: 3, marginBottom: 8 },
  eventFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eventPrice: { color: PRIMARY, fontSize: 13, fontWeight: '900' },
  eventType: { backgroundColor: '#F5F5F5', color: '#666666', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, fontSize: 11, overflow: 'hidden', textTransform: 'capitalize' },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EBEBEB', paddingTop: 8, paddingBottom: 14 },
  navItem: { alignItems: 'center', gap: 3 },
  navLabel: { color: '#BDBDBD', fontSize: 11 },
  navLabelActive: { color: PRIMARY, fontWeight: '800' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: PAPER },
  loadingText: { marginTop: 12, color: '#888888' },
});

export default EventsScreen;
