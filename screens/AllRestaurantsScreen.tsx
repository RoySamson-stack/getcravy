import React, { useState, useEffect, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { restaurantAPI } from '../services/api';
import { Restaurant } from '../types/navigation';

// Additional restaurants that don't appear on the home page
const additionalRestaurants = [
  {
    id: '7',
    name: 'Mediterranean Delight',
    image: require('../assets/food.png'),
    rating: 4.7,
    category: 'Mediterranean',
    deliveryTime: '25-35 min',
    price: 'Ksh'
  },
  {
    id: '8',
    name: 'BBQ King',
    image: require('../assets/food.png'),
    rating: 4.5,
    category: 'American',
    deliveryTime: '30-45 min',
    price: 'Ksh'
  },
  {
    id: '9',
    name: 'Vegetarian Heaven',
    image: require('../assets/food.png'),
    rating: 4.6,
    category: 'Vegetarian',
    deliveryTime: '20-30 min',
    price: 'Ksh'
  },
  {
    id: '10',
    name: 'Seafood Palace',
    image: require('../assets/food.png'),
    rating: 4.8,
    category: 'Seafood',
    deliveryTime: '25-40 min',
    price: 'Ksh'
  },
];

const neighborhoods = [
  { id: 'all', name: 'All Areas' },
  { id: 'Westlands', name: 'Westlands' },
  { id: 'Kilimani', name: 'Kilimani' },
  { id: 'CBD', name: 'CBD' },
  { id: 'Karen', name: 'Karen' },
  { id: 'Lavington', name: 'Lavington' },
  { id: 'Parklands', name: 'Parklands' },
];

const AllRestaurantsScreen = ({ navigation, route }) => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors } = theme;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const result = await restaurantAPI.getAll({ limit: 100 });
        if (result.success && result.restaurants) {
          const mapped = result.restaurants.map((r: any) => ({
            id: r.id,
            name: r.name,
            image: r.images && r.images.length > 0 ? { uri: r.images[0] } : require('../assets/food.png'),
            rating: parseFloat(r.rating) || 0,
            category: r.category,
            deliveryTime: r.deliveryTime || '20-30 min',
            price: r.priceRange || 'Ksh',
            neighborhood: r.neighborhood,
          }));
          setAllRestaurants(mapped);
          setFilteredRestaurants(mapped);
        } else {
          // Fallback to route params
          const homeRestaurants = route.params?.homeRestaurants || [];
          setAllRestaurants(homeRestaurants);
          setFilteredRestaurants(homeRestaurants);
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        const homeRestaurants = route.params?.homeRestaurants || [];
        setAllRestaurants(homeRestaurants);
        setFilteredRestaurants(homeRestaurants);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Filter restaurants based on search query and neighborhood
  useEffect(() => {
    let filtered = [...allRestaurants];
    
    // Filter by neighborhood
    if (selectedNeighborhood !== 'all') {
      filtered = filtered.filter(r => r.neighborhood === selectedNeighborhood);
    }
    
    // Filter by search query
    if (searchQuery !== '') {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (restaurant.neighborhood && restaurant.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedNeighborhood, allRestaurants]);

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => navigation.navigate('Restaurant', { 
        id: item.id, 
        name: item.name,
        image: item.image,
        rating: item.rating,
        category: item.category,
        deliveryTime: item.deliveryTime,
        price: item.price
      })}
    >
      <Image source={item.image} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantHeader}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#E23744" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.restaurantDetails}>
          <Text style={styles.detailText}>{item.category}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.detailText}>{item.price}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.detailText}>{item.deliveryTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E23744" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Restaurants</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, cuisines, or areas..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Neighborhood Filters */}
      <View style={styles.neighborhoodContainer}>
        <FlatList
          data={neighborhoods}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.neighborhoodChip,
                {
                  backgroundColor: selectedNeighborhood === item.id ? colors.primary : colors.cardBackground,
                },
              ]}
              onPress={() => setSelectedNeighborhood(item.id)}
            >
              <Text
                style={[
                  styles.neighborhoodChipText,
                  { color: selectedNeighborhood === item.id ? '#FFFFFF' : colors.text },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.neighborhoodList}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading restaurants...</Text>
        </View>
      ) : (
        <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.restaurantList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={50} color="#999" />
            <Text style={styles.emptyText}>No restaurants found</Text>
            <Text style={styles.emptySubtext}>Try a different search term or area</Text>
          </View>
        }
      />
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 10,
  },
  restaurantList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 3,
    fontSize: 14,
    color: '#333',
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  dot: {
    marginHorizontal: 5,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  neighborhoodContainer: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  neighborhoodList: {
    paddingHorizontal: 20,
  },
  neighborhoodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  neighborhoodChipText: {
    fontSize: 14,
    fontWeight: '500',
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
    color: '#666',
  },
});

export default AllRestaurantsScreen;