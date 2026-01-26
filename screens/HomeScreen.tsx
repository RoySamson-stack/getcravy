import React, { useContext, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import * as Location from 'expo-location';
import { eventAPI, Event } from '../services/eventAPI';
import { dealAPI, Deal } from '../services/dealAPI';
import { restaurantAPI } from '../services/api';
import { Restaurant } from '../types/navigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Vibe categories
const vibes = [
  { id: 'party', name: 'Party', icon: 'wine' },
  { id: 'date', name: 'Date Night', icon: 'heart' },
  { id: 'casual', name: 'Casual', icon: 'cafe' },
  { id: 'fine', name: 'Fine Dining', icon: 'restaurant' },
  { id: 'family', name: 'Family', icon: 'people' },
  { id: 'brunch', name: 'Brunch', icon: 'sunny' },
];

const HomeScreen = ({ navigation }: any) => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }
  const { user } = authContext;
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors } = theme;

  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [todayDeals, setTodayDeals] = useState<Deal[]>([]);
  const [weekendEvents, setWeekendEvents] = useState<Event[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Nairobi');

  // Get user's location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          const geocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          });
          if (geocode.length > 0) {
            const address = geocode[0];
            setLocationName(address.city || address.district || 'Nairobi');
          }
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured events
        const eventsResponse = await eventAPI.getAll({ featured: true, limit: 10 });
        if (eventsResponse.success) {
          setFeaturedEvents(eventsResponse.data.slice(0, 5));
        }

        // Fetch today's deals
        const dealsResponse = await dealAPI.getToday();
        if (dealsResponse.success) {
          setTodayDeals(dealsResponse.data.slice(0, 5));
        }

        // Fetch weekend events (next 7 days)
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const weekendResponse = await eventAPI.getAll({
          dateFrom: today.toISOString().split('T')[0],
          dateTo: nextWeek.toISOString().split('T')[0],
          limit: 10
        });
        if (weekendResponse.success) {
          setWeekendEvents(weekendResponse.data);
        }

        // Fetch featured restaurants
        const restaurantsResponse = await restaurantAPI.getAll({ featured: true, limit: 10 });
        if (restaurantsResponse.success && restaurantsResponse.restaurants) {
          setFeaturedRestaurants(restaurantsResponse.restaurants.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderEventCard = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
    >
      {item.imageUrl ? (
        <View style={styles.eventImagePlaceholder}>
          <Ionicons name="calendar" size={40} color={colors.primary} />
        </View>
      ) : (
        <View style={[styles.eventImagePlaceholder, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="calendar" size={40} color={colors.primary} />
        </View>
      )}
      <View style={styles.eventCardContent}>
        <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.eventDate, { color: colors.textLight }]}>
          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {item.time.substring(0, 5)}
        </Text>
        <View style={styles.eventFooter}>
          <Text style={[styles.eventLocation, { color: colors.textLight }]} numberOfLines={1}>
            <Ionicons name="location" size={12} /> {item.location}
          </Text>
          {item.price ? (
            <Text style={[styles.eventPrice, { color: colors.primary }]}>
              KES {item.price}
            </Text>
          ) : (
            <Text style={[styles.eventPrice, { color: colors.success }]}>Free</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDealCard = ({ item }: { item: Deal }) => (
    <TouchableOpacity
      style={[styles.dealCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => navigation.navigate('Restaurant', { id: item.restaurantId })}
    >
      <View style={styles.dealContent}>
        <Text style={[styles.dealTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.dealDiscount, { color: colors.primary }]}>
          {item.discount || 'Special Deal'}
        </Text>
        <Text style={[styles.dealRestaurant, { color: colors.textLight }]} numberOfLines={1}>
          {item.restaurant?.name || 'Restaurant'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderVibeItem = ({ item }: { item: typeof vibes[0] }) => (
    <TouchableOpacity
      style={[styles.vibeItem, { backgroundColor: colors.cardBackground }]}
      onPress={() => navigation.navigate('Events', { vibe: item.id })}
    >
      <Ionicons name={item.icon as any} size={24} color={colors.primary} />
      <Text style={[styles.vibeText, { color: colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={[styles.restaurantCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => navigation.navigate('Restaurant', { id: item.id })}
    >
      <View style={styles.restaurantImagePlaceholder}>
        <Ionicons name="restaurant" size={30} color={colors.primary} />
      </View>
      <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.restaurantCategory, { color: colors.textLight }]}>
        {item.category}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textLight }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Hello, {user?.name || 'Guest'}
          </Text>
          <Text style={[styles.locationText, { color: colors.textLight }]}>
            <Ionicons name="location" size={14} color={colors.primary} /> {locationName}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Bookings')}
          >
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={[styles.searchBar, { backgroundColor: colors.cardBackground }]}
        onPress={() => navigation.navigate('Search')}
      >
        <Ionicons name="search" size={20} color={colors.textLight} />
        <Text style={[styles.searchPlaceholder, { color: colors.textLight }]}>
          Search restaurants, events...
        </Text>
      </TouchableOpacity>

      {/* Featured Events Carousel */}
      {featuredEvents.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredEvents}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        </View>
      )}

      {/* Today's Deals */}
      {todayDeals.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Deals</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={todayDeals}
            renderItem={renderDealCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        </View>
      )}

      {/* Browse by Vibe */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Browse by Vibe</Text>
        <FlatList
          data={vibes}
          renderItem={renderVibeItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        />
      </View>

      {/* This Weekend */}
      {weekendEvents.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>This Weekend</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={weekendEvents.slice(0, 5)}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        </View>
      )}

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Restaurants</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllRestaurants')}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredRestaurants}
            renderItem={renderRestaurantCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 14,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  eventCard: {
    width: SCREEN_WIDTH * 0.75,
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventImagePlaceholder: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCardContent: {
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    marginBottom: 8,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventLocation: {
    fontSize: 12,
    flex: 1,
  },
  eventPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  dealCard: {
    width: 140,
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  dealContent: {
    alignItems: 'center',
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  dealDiscount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dealRestaurant: {
    fontSize: 12,
    textAlign: 'center',
  },
  vibeItem: {
    width: 100,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vibeText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  restaurantCard: {
    width: 120,
    alignItems: 'center',
  },
  restaurantImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  restaurantCategory: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});

export default HomeScreen;
