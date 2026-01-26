import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { eventAPI, Event } from '../services/eventAPI';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const eventTypeFilters = [
  { id: 'all', label: 'All Events' },
  { id: 'thisWeek', label: 'This Week' },
  { id: 'festival', label: 'Festivals' },
  { id: 'restaurant_event', label: 'Restaurant Events' },
  { id: 'entertainment', label: 'Live Music' },
  { id: 'special', label: 'Specials' },
];

const EventsScreen = ({ navigation, route }: any) => {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors } = theme;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(route?.params?.vibe || 'all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = async (filter: string, pageNum: number = 1, reset: boolean = false) => {
    try {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      let filters: any = {
        page: pageNum,
        limit: 20,
        sortBy: 'date',
        sortOrder: 'ASC',
      };

      switch (filter) {
        case 'thisWeek':
          filters.dateFrom = today.toISOString().split('T')[0];
          filters.dateTo = nextWeek.toISOString().split('T')[0];
          break;
        case 'festival':
        case 'restaurant_event':
        case 'entertainment':
        case 'special':
        case 'popup':
          filters.eventType = filter;
          break;
        default:
          // All events - future events only
          filters.dateFrom = today.toISOString().split('T')[0];
          break;
      }

      const response = await eventAPI.getAll(filters);
      
      if (response.success) {
        if (reset) {
          setEvents(response.data);
        } else {
          setEvents(prev => [...prev, ...response.data]);
        }
        setHasMore(response.data.length === 20);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchEvents(selectedFilter, 1, true);
  }, [selectedFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchEvents(selectedFilter, 1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEvents(selectedFilter, nextPage, false);
    }
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={[styles.eventItem, { backgroundColor: colors.cardBackground }]}
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
    >
      <View style={styles.eventImageContainer}>
        {item.imageUrl ? (
          <View style={styles.eventImagePlaceholder}>
            <Ionicons name="calendar" size={32} color={colors.primary} />
          </View>
        ) : (
          <View style={[styles.eventImagePlaceholder, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="calendar" size={32} color={colors.primary} />
          </View>
        )}
      </View>
      <View style={styles.eventContent}>
        <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.eventMeta}>
          <View style={styles.eventMetaRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
            <Text style={[styles.eventMetaText, { color: colors.textLight }]}>
              {new Date(item.date).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.eventMetaRow}>
            <Ionicons name="time-outline" size={14} color={colors.textLight} />
            <Text style={[styles.eventMetaText, { color: colors.textLight }]}>
              {item.time.substring(0, 5)}
            </Text>
          </View>
        </View>
        <View style={styles.eventMeta}>
          <View style={styles.eventMetaRow}>
            <Ionicons name="location-outline" size={14} color={colors.textLight} />
            <Text style={[styles.eventLocation, { color: colors.textLight }]} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
        <View style={styles.eventFooter}>
          <View style={styles.attendeesBadge}>
            <Ionicons name="people-outline" size={14} color={colors.primary} />
            <Text style={[styles.attendeesCount, { color: colors.primary }]}>
              {item.attendeesCount} going
            </Text>
          </View>
          {item.price ? (
            <Text style={[styles.eventPrice, { color: colors.primary }]}>
              KES {item.price}
            </Text>
          ) : (
            <Text style={[styles.eventPrice, { color: colors.success }]}>Free</Text>
          )}
        </View>
        {item.restaurant && (
          <View style={styles.restaurantBadge}>
            <Ionicons name="restaurant" size={12} color={colors.textLight} />
            <Text style={[styles.restaurantName, { color: colors.textLight }]}>
              {item.restaurant.name}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterItem = ({ item }: { item: typeof eventTypeFilters[0] }) => {
    const isSelected = selectedFilter === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          {
            backgroundColor: isSelected ? colors.primary : colors.cardBackground,
          },
        ]}
        onPress={() => setSelectedFilter(item.id)}
      >
        <Text
          style={[
            styles.filterChipText,
            { color: isSelected ? '#FFFFFF' : colors.text },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading && events.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textLight }]}>Loading events...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={eventTypeFilters}
          renderItem={renderFilterItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        />
      </View>

      {/* Events List */}
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.textLight} />
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              No events found
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
              Try selecting a different filter
            </Text>
          </View>
        }
        ListFooterComponent={
          loading && events.length > 0 ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filtersList: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventsList: {
    padding: 20,
  },
  eventItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  eventImageContainer: {
    width: 100,
  },
  eventImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  eventContent: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  eventMeta: {
    marginBottom: 6,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventMetaText: {
    fontSize: 12,
    marginLeft: 6,
  },
  eventLocation: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  attendeesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesCount: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  eventPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  restaurantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  restaurantName: {
    fontSize: 12,
    marginLeft: 4,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  footerLoading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default EventsScreen;

