import React, { useContext, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  FlatList,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import * as Location from 'expo-location';

const restaurants = [
  {
    id: '1',
    name: 'Delicious Bistro',
    image: require('../assets/food.png'),
    rating: 4.8,
    category: 'Italian',
    deliveryTime: '20-30 min',
    price: 'Ksh'
  },
  {
    id: '2',
    name: 'Taco Heaven',
    image: require('../assets/food.png'),
    rating: 4.5,
    category: 'Mexican',
    deliveryTime: '15-25 min',
    price: 'Ksh'
  },
  {
    id: '3',
    name: 'Sushi Express',
    image: require('../assets/food.png'),
    rating: 4.7,
    category: 'Japanese',
    deliveryTime: '25-35 min',
    price: 'Ksh'
  },
  {
    id: '4',
    name: 'Burger Joint',
    image: require('../assets/food.png'),
    rating: 4.4,
    category: 'American',
    deliveryTime: '10-20 min',
    price: 'Ksh'
  },
  {
    id: '5',
    name: 'Curry House',
    image: require('../assets/food.png'),
    rating: 4.6,
    category: 'Indian',
    deliveryTime: '30-40 min',
    price: 'Ksh'
  },
  {
    id: '6',
    name: 'Pho Corner',
    image: require('../assets/food.png'),
    rating: 4.3,
    category: 'Vietnamese',
    deliveryTime: '20-30 min',
    price: 'Ksh'
  },
];

// Categories
const categories = [
  { id: '1', name: 'All', icon: 'restaurant' },
  { id: '2', name: 'Italian', icon: 'pizza' },
  { id: '3', name: 'Mexican', icon: 'fast-food' },
  { id: '4', name: 'Japanese', icon: 'fish' },
  { id: '5', name: 'American', icon: 'nutrition' },
  { id: '6', name: 'Indian', icon: 'flame' },
  { id: '7', name: 'Vietnamese', icon: 'cafe' },
];

export default HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('1'); // Default to 'All'
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationName, setLocationName] = useState('Loading location...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Get user's location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocationName('Location access denied');
        return;
      }

      try {
        // Get the current location coordinates
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Reverse geocode to get the location name
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        if (geocode.length > 0) {
          // Format the location name (you can customize this format)
          const address = geocode[0];
          const locName = address.city || address.district || address.subregion || 'Unknown location';
          setLocationName(locName);
        } else {
          setLocationName('Unknown location');
        }
      } catch (error) {
        console.error("Error getting location:", error);
        setErrorMsg('Error getting location');
        setLocationName('Location unavailable');
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedCategory === '1') {
      // 'All' category
      setFilteredRestaurants(
        restaurants.filter(restaurant => 
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      // Filter by both category and search query
      const categoryName = categories.find(cat => cat.id === selectedCategory)?.name;
      setFilteredRestaurants(
        restaurants.filter(restaurant => 
          restaurant.category === categoryName && 
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [selectedCategory, searchQuery]);

  const renderRestaurantItem = ({ item}) => (
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
      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons 
          name={user?.favorites?.includes(item.id) ? "heart" : "heart-outline"} 
          size={24} 
          color={user?.favorites?.includes(item.id) ? "#E23744" : "#666"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategoryItem
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={22} 
        color={selectedCategory === item.id ? "#fff" : "#E23744"} 
      />
      <Text 
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hello, {user?.name}</Text>
          <Text style={styles.locationText}>
            <Ionicons name="location" size={16} color="#E23744" /> {locationName}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-circle-outline" size={36} color="#E23744" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#E23744" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, dishes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#E23744" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <View style={styles.promotionContainer}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/400x150/E23744/FFFFFF' }} 
          style={styles.promotionImage}
        />
        <View style={styles.promotionContent}>
          <Text style={styles.promotionTitle}>50% OFF</Text>
          <Text style={styles.promotionSubtitle}>On your first order</Text>
          <TouchableOpacity style={styles.promotionButton}>
            <Text style={styles.promotionButtonText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Popular Restaurants</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllRestaurants', {homeRestaurants: filteredRestaurants})}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.restaurantList}
      />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  locationText: {
    fontSize: 14,
    color: '#E23744 ',
    marginTop: 2,
  },
  profileButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 15,
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
  filterButton: {
    padding: 5,
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selectedCategoryItem: {
    backgroundColor: '#E23744',
  },
  categoryText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  promotionContainer: {
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  promotionImage: {
    width: '100%',
    height: 120,
  },
  promotionContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 15,
    justifyContent: 'center',
  },
  promotionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  promotionSubtitle: {
    fontSize: 16,
    color: '#111',
    marginBottom: 10,
  },
  promotionButton: {
    backgroundColor: '#E23744',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promotionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#E23744',
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
    fontSize: 12,
    color: '#666',
  },
  dot: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 5,
  }
});