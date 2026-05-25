import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../services/eventAPI';
import { Deal } from '../services/dealAPI';
import { Restaurant } from '../types/navigation';

const budgetChips = ['Under 500', 'Under 1,500', 'Under 2,500', 'Under 3,000', 'Under 5,000'];
const filterChips = ['All', 'Rooftop', 'Brunch', 'Nyama', 'Date night'];
const HEADER_TOP_PADDING = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 14 : 56;

const fallbackRestaurants: Restaurant[] = [
  { id: 'rooftop-kitchen', name: 'The Rooftop Kitchen', image: null, rating: 4.6, category: 'Grill & Bar', deliveryTime: '20-30 min', price: 'KES 800-1,200', neighborhood: 'Westlands' },
  { id: 'mamas-kitchen', name: "Mama's Kitchen", image: null, rating: 4.8, category: 'Local cuisine', deliveryTime: '25-35 min', price: 'KES 1,000-1,500', neighborhood: 'Karen' },
];

const fallbackDeals: Deal[] = [
  { id: 'deal-lunch', title: '2-for-1 lunch combo', description: 'Today only', discount: 'Save 50%', restaurantId: 'rooftop-kitchen', isActive: true, featured: true, restaurant: { id: 'rooftop-kitchen', name: 'The Rooftop Kitchen' } },
  { id: 'deal-brunch', title: 'Free dessert with brunch', description: 'Weekend special', discount: 'Free dessert', restaurantId: 'mamas-kitchen', isActive: true, featured: false, restaurant: { id: 'mamas-kitchen', name: "Mama's Kitchen" } },
];

const fallbackEvents: Event[] = [
  { id: 'food-festival', title: 'Nairobi Food Festival', description: 'Street food, chef pop-ups, and music.', date: new Date().toISOString(), time: '18:00', price: 500, location: 'Uhuru Gardens', attendeesCount: 148, eventType: 'festival', userId: 'preview', featured: true, isActive: true },
  { id: 'brunch-popup', title: 'Sunday Brunch Pop-up', description: 'Curated brunch with DJs.', date: new Date(Date.now() + 86400000).toISOString(), time: '11:00', price: 1200, location: 'Kilimani', attendeesCount: 42, eventType: 'popup', userId: 'preview', featured: false, isActive: true },
];

const HomeScreen = ({ navigation }: any) => {
  const colors = { primary: '#E23744' };

  const [todayDeals, setTodayDeals] = useState<Deal[]>(fallbackDeals);
  const [weekendEvents, setWeekendEvents] = useState<Event[]>(fallbackEvents);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>(fallbackRestaurants);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('Nairobi');
  const [selectedBudget, setSelectedBudget] = useState('Under 1,500');

  useEffect(() => {
    setLoading(false);
  }, []);

  const renderRestaurantCard = ({ item, index }: { item: Restaurant; index: number }) => (
    <TouchableOpacity style={styles.restaurantCard} onPress={() => navigation.navigate('Restaurant', { id: item.id })}>
      <View style={[styles.restaurantArt, { backgroundColor: index % 2 === 0 ? '#F5ECE0' : '#EDF3EC' }]}>
        <View style={styles.dealBadge}><Text style={styles.dealBadgeText}>{index === 0 ? 'Happy hour' : 'Open now'}</Text></View>
        <View style={styles.priceBadge}><Text style={styles.priceBadgeText}>KES 800-1,500</Text></View>
        <Ionicons name="business" size={36} color={index % 2 === 0 ? '#C4A882' : '#8AAB86'} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => navigation.toggleSavedRestaurant?.(item.name)}
          >
            <Ionicons
              name={navigation.savedRestaurants?.includes(item.name) ? 'heart' : 'heart-outline'}
              size={21}
              color="#E23744"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardMeta} numberOfLines={1}>{((item as any).city || item.neighborhood || locationName)} · {item.category || 'Restaurant'} · 1.2km</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.ratingText}><Ionicons name="star" size={12} color={colors.primary} /> {item.rating || '4.6'} · 212</Text>
          <View style={styles.reserveButton}><Text style={styles.reserveButtonText}>Reserve</Text></View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDealCard = ({ item }: { item: Deal }) => (
    <TouchableOpacity style={styles.dealRow} onPress={() => navigation.navigate('Restaurant', { id: item.restaurantId })}>
      <View style={styles.dealIcon}><Ionicons name="business" size={20} color="#8AAB86" /></View>
      <View style={styles.dealInfo}>
        <Text style={styles.dealTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.dealRestaurant} numberOfLines={1}>{item.restaurant?.name || 'Restaurant'}</Text>
        <View style={styles.dealFooter}>
          <Text style={styles.savePill}>{item.discount || 'Special offer'}</Text>
          <Text style={styles.claimText}>Claim</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item }: { item: Event }) => {
    const date = new Date(item.date);
    return (
      <TouchableOpacity style={styles.eventRow} onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}>
        <View style={styles.eventDateBox}>
          <Text style={styles.eventDay}>{date.getDate()}</Text>
          <Text style={styles.eventMonth}>{date.toLocaleDateString('en-US', { month: 'short' })}</Text>
        </View>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.eventLocation} numberOfLines={1}>{item.location}</Text>
        </View>
        <Text style={styles.eventPrice}>{item.price ? `KES ${item.price}` : 'Free'}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.shell}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerCopy}>
              <Text style={styles.goodMorning} numberOfLines={1}>Good morning</Text>
              <Text style={styles.headerTitle} numberOfLines={2}>Where to eat today?</Text>
            </View>
            <TouchableOpacity style={styles.headerCircle} onPress={() => navigation.navigate('Bookings')}>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.searchBox} onPress={() => navigation.navigate('AllRestaurants')}>
            <Ionicons name="search" size={18} color="#AAAAAA" />
            <Text style={styles.searchText}>Search restaurants, cuisines...</Text>
            <Ionicons name="options-outline" size={18} color="#AAAAAA" style={styles.searchFilterIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.budgetStrip}>
          <Text style={styles.budgetLabel}>Budget per person</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.budgetChips}>
            {budgetChips.map((chip) => (
              <TouchableOpacity key={chip} style={[styles.budgetChip, selectedBudget === chip && styles.budgetChipActive]} onPress={() => setSelectedBudget(chip)}>
                <Text style={[styles.budgetChipText, selectedBudget === chip && styles.budgetChipTextActive]}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filterChips.map((chip, index) => (
            <TouchableOpacity key={chip} style={[styles.filterChip, index === 0 && styles.filterChipActive]}>
              <Text style={[styles.filterText, index === 0 && styles.filterTextActive]}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Discover</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllRestaurants')}><Text style={styles.sectionAction}>See all</Text></TouchableOpacity>
          </View>
          <FlatList data={featuredRestaurants} renderItem={renderRestaurantCard} keyExtractor={(item) => item.id} scrollEnabled={false} ListEmptyComponent={<Text style={styles.emptyText}>No restaurants available yet.</Text>} />
        </View>

        <View style={{ height: 84 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        {[
          ['home', 'Home', 'Home'],
          ['search', 'Discover', 'AllRestaurants'],
          ['calendar', 'Events', 'Events'],
          ['pricetag', 'Deals', 'Deals'],
          ['person', 'Profile', 'Profile'],
        ].map(([icon, label, route]) => (
          <TouchableOpacity key={label} style={styles.navItem} onPress={() => navigation.navigate(route)}>
            <Ionicons name={icon as any} size={22} color={label === 'Home' ? colors.primary : '#BDBDBD'} />
            <Text style={[styles.navLabel, label === 'Home' && styles.navLabelActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: '#F7F5F2' },
  container: { flex: 1, backgroundColor: '#F7F5F2' },
  header: { backgroundColor: '#E23744', paddingHorizontal: 16, paddingTop: HEADER_TOP_PADDING, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12 },
  headerCopy: { flex: 1, minWidth: 0 },
  goodMorning: { color: 'rgba(255,255,255,0.82)', fontSize: 13, marginBottom: 3, fontWeight: '600' },
  headerTitle: { color: '#FFFFFF', fontSize: 17, lineHeight: 22, fontWeight: '700' },
  headerCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, minHeight: 44 },
  searchText: { color: '#AAAAAA', fontSize: 14, flex: 1 },
  searchFilterIcon: { marginLeft: 'auto' },
  budgetStrip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF4F4', borderBottomWidth: 1, borderBottomColor: '#FCD5D5', paddingHorizontal: 16, paddingVertical: 9 },
  budgetLabel: { color: '#A32D2D', fontSize: 12, fontWeight: '700', flexShrink: 0 },
  budgetChips: { flexDirection: 'row', gap: 8, paddingRight: 28 },
  budgetChip: { borderWidth: 1, borderColor: '#E23744', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: '#FFFFFF', flexShrink: 0 },
  budgetChipActive: { backgroundColor: '#E23744' },
  budgetChipText: { color: '#E23744', fontSize: 11, fontWeight: '600' },
  budgetChipTextActive: { color: '#FFFFFF' },
  filterRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterChip: { borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#FFFFFF' },
  filterChipActive: { backgroundColor: '#1A1A1A', borderColor: '#1A1A1A' },
  filterText: { color: '#444444', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { color: '#1A1A1A', fontSize: 17, fontWeight: '700' },
  sectionAction: { color: '#E23744', fontSize: 13, fontWeight: '700' },
  restaurantCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EBEBEB', borderRadius: 12, overflow: 'hidden', marginBottom: 10 },
  restaurantArt: { height: 92, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dealBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#1A1A1A', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  dealBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  priceBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#E23744', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  priceBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  cardBody: { padding: 12 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 3 },
  cardTitle: { color: '#1A1A1A', fontSize: 16, fontWeight: '700', flex: 1 },
  saveButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF4F4' },
  cardMeta: { color: '#888888', fontSize: 13, marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingText: { color: '#444444', fontSize: 13, fontWeight: '600' },
  reserveButton: { backgroundColor: '#E23744', borderRadius: 7, paddingHorizontal: 14, paddingVertical: 6 },
  reserveButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  happyHourBand: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF4F4', borderWidth: 1, borderColor: '#FCD5D5', borderRadius: 10, padding: 12, marginBottom: 12 },
  happyHourCopy: { flex: 1 },
  happyHourTitle: { color: '#A32D2D', fontSize: 14, fontWeight: '700' },
  happyHourSub: { color: '#C04040', fontSize: 12 },
  livePill: { backgroundColor: '#E23744', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  livePillText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  featuredDeal: { backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14, marginBottom: 10 },
  featuredDealTag: { alignSelf: 'flex-start', backgroundColor: '#E23744', color: '#FFFFFF', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, fontSize: 12, fontWeight: '700', marginBottom: 8 },
  featuredDealTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  featuredDealRest: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2, marginBottom: 10 },
  featuredDealFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredDealPrice: { color: '#E23744', fontSize: 22, fontWeight: '800' },
  featuredDealWas: { color: 'rgba(255,255,255,0.4)', fontSize: 12, textDecorationLine: 'line-through' },
  featuredDealButton: { backgroundColor: '#E23744', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  featuredDealButtonText: { color: '#FFFFFF', fontWeight: '700' },
  dealRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#EBEBEB', overflow: 'hidden', marginBottom: 9 },
  dealIcon: { width: 62, backgroundColor: '#EDF3EC', alignItems: 'center', justifyContent: 'center' },
  dealInfo: { flex: 1, padding: 12 },
  dealTitle: { color: '#1A1A1A', fontSize: 14, fontWeight: '700' },
  dealRestaurant: { color: '#888888', fontSize: 12, marginTop: 2, marginBottom: 8 },
  dealFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  savePill: { backgroundColor: '#FFF4F4', color: '#A32D2D', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4, fontSize: 12, overflow: 'hidden' },
  claimText: { color: '#E23744', fontSize: 13, fontWeight: '800' },
  eventRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#EBEBEB', padding: 10, marginBottom: 8 },
  eventDateBox: { backgroundColor: '#FFF4F4', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center', minWidth: 48 },
  eventDay: { color: '#E23744', fontSize: 18, fontWeight: '800', lineHeight: 20 },
  eventMonth: { color: '#E23744', fontSize: 11 },
  eventInfo: { flex: 1, marginLeft: 10 },
  eventName: { color: '#1A1A1A', fontSize: 14, fontWeight: '700' },
  eventLocation: { color: '#888888', fontSize: 12, marginTop: 2 },
  eventPrice: { color: '#E23744', fontSize: 13, fontWeight: '800' },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#EBEBEB', paddingTop: 10, paddingBottom: 14 },
  navItem: { alignItems: 'center', gap: 3 },
  navLabel: { color: '#BDBDBD', fontSize: 11 },
  navLabelActive: { color: '#E23744', fontWeight: '700' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F5F2' },
  loadingText: { marginTop: 12, color: '#888888' },
  emptyText: { color: '#888888', paddingVertical: 16 },
});

export default HomeScreen;
