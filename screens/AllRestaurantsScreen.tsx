import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

const AllRestaurantsScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allRestaurants, setAllRestaurants] = useState<{ 
    id: string; 
    name: string; 
    image: any; 
    rating: number; 
    category: string; 
    deliveryTime: string; 
    price: string; 
  }[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<{ 
    id: string; 
    name: string; 
    image: any; 
    rating: number; 
    category: string; 
    deliveryTime: string; 
    price: string; 
  }[]>([]);

  // Combined restaurants when component mounts
  useEffect(() => {
    // Get restaurants passed from HomeScreen (or use empty array if not provided)
    const homeRestaurants = route.params?.homeRestaurants || [];
    
    // Combine with additional restaurants
    const combined = [...homeRestaurants, ...additionalRestaurants];
    
    // Remove duplicates based on id
    const uniqueRestaurants = Array.from(
      new Map(combined.map(item => [item.id, item])).values()
    );
    
    setAllRestaurants(uniqueRestaurants);
    setFilteredRestaurants(uniqueRestaurants);
  }, [route.params?.homeRestaurants]);

  // Filter restaurants based on search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredRestaurants(allRestaurants);
    } else {
      setFilteredRestaurants(
        allRestaurants.filter(restaurant => 
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, allRestaurants]);

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
          placeholder="Search restaurants or cuisines..."
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
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        }
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
});

export default AllRestaurantsScreen;