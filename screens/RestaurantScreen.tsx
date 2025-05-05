import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

// Mock data for menu items
const menuItems = [
    {
        id: '1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 1299, // Changed to a number
        category: 'Pizza',
        image: 'https://via.placeholder.com/300',
        rating: 4.7
    },
    {
        id: '2',
        name: 'Pasta Carbonara',
        description: 'Spaghetti with creamy sauce, pancetta, and parmesan',
        price: 1499, // Changed to a number
        category: 'Pasta',
        image: 'https://via.placeholder.com/300',
        rating: 4.5
    },
    {
        id: '3',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers',
        price: 799, // Changed to a number
        category: 'Dessert',
        image: 'https://via.placeholder.com/300',
        rating: 4.8
    },
    {
        id: '4',
        name: 'Bruschetta',
        description: 'Toasted bread topped with tomatoes, garlic, and basil',
        price: 699, // Changed to a number
        category: 'Appetizer',
        image: 'https://via.placeholder.com/300',
        rating: 4.3
    },
    {
        id: '5',
        name: 'Chicken Parmesan',
        description: 'Breaded chicken topped with marinara and mozzarella',
        price: 1699, // Changed to a number
        category: 'Main Course',
        image: 'https://via.placeholder.com/300',
        rating: 4.6
    },
];

// Mock reviews
const reviews = [
  {
    id: '1',
    user: 'John D.',
    rating: 5,
    date: '2 days ago',
    comment: 'Amazing food and great service! Will definitely come back.'
  },
  {
    id: '2',
    user: 'Sarah M.',
    rating: 4,
    date: '1 week ago',
    comment: 'Delicious pasta, but the wait was a bit long.'
  },
  {
    id: '3',
    user: 'Michael T.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Best pizza in town! The crust is perfect.'
  },
];

const RestaurantScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('menu');
  const [quantity, setQuantity] = useState(1);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationDetails, setReservationDetails] = useState({
    date: '',
    time: '',
    guests: '2',
    specialRequests: ''
  });
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const restaurant = {
    id: route.params.id,
    name: route.params.name,
    image: 'https://via.placeholder.com/400x300',
    rating: 4.8,
    category: 'Italian',
    deliveryTime: '20-30 min',
    price: 'keskes',
    address: '123 Main St, Cityville',
    phone: '(555) 123-4567',
    hours: 'Mon-Fri: 11am - 10pm\nSat-Sun: 10am - 11pm',
    description: 'Authentic Italian cuisine with a modern twist. Family-owned since 1985.'
  };

  const handleReservation = () => {
    // In a real app, you would send this to your backend
    console.log('Reservation details:', reservationDetails);
    setShowReservationModal(false);
    alert(`Reservation confirmed for kes{reservationDetails.date} at kes{reservationDetails.time} for kes{reservationDetails.guests} guests.`);
  };

  const handleDelivery = () => {
    // In a real app, you would send this to your backend
    console.log('Delivery details:', { deliveryAddress, deliveryInstructions });
    setShowDeliveryModal(false);
    alert(`Delivery order placed! Your food will arrive in 30-45 minutes.`);
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={() => setSelectedItem(item)}
    >
      <Image source={{ uri: item.image }} style={styles.menuItemImage} />
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>kes{item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.menuItemRating}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderReview = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewUser}>{item.user}</Text>
        <View style={styles.reviewRating}>
          {[...Array(5)].map((_, i) => (
            <Ionicons 
              key={i} 
              name={i < item.rating ? "star" : "star-outline"} 
              size={16} 
              color="#FFD700" 
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewDate}>{item.date}</Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
      
      <View style={styles.restaurantHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons 
            name={user?.favorites?.includes(restaurant.id) ? "heart" : "heart-outline"} 
            size={28} 
            color={user?.favorites?.includes(restaurant.id) ? "#E23744" : "#fff"} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <View style={styles.restaurantMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.categoryText}>{restaurant.category}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.priceText}>{restaurant.price}</Text>
        </View>
        <Text style={styles.deliveryTime}>
          <Ionicons name="time-outline" size={16} color="#666" /> {restaurant.deliveryTime}
        </Text>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
          onPress={() => setActiveTab('menu')}
        >
          <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>Info</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Reviews</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'menu' && (
        <View style={styles.menuContainer}>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      )}
      
      {activeTab === 'info' && (
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <Ionicons name="location-outline" size={24} color="#E23744" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Address</Text>
              <Text style={styles.infoContent}>{restaurant.address}</Text>
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <Ionicons name="call-outline" size={24} color="#E23744" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Phone</Text>
              <Text style={styles.infoContent}>{restaurant.phone}</Text>
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <Ionicons name="time-outline" size={24} color="#E23744" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Hours</Text>
              <Text style={styles.infoContent}>{restaurant.hours}</Text>
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <Ionicons name="information-circle-outline" size={24} color="#E23744" />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>About</Text>
              <Text style={styles.infoContent}>{restaurant.description}</Text>
            </View>
          </View>
        </View>
      )}
      
      {activeTab === 'reviews' && (
        <View style={styles.reviewsContainer}>
          <View style={styles.overallRating}>
            <Text style={styles.overallRatingText}>{restaurant.rating}</Text>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons 
                  key={i} 
                  name={i < Math.floor(restaurant.rating) ? "star" : "star-outline"} 
                  size={24} 
                  color="#FFD700" 
                />
              ))}
            </View>
            <Text style={styles.totalReviews}>{reviews.length} reviews</Text>
          </View>
          
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
          
          <TouchableOpacity style={styles.addReviewButton}>
            <Text style={styles.addReviewButtonText}>Write a Review</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.reservationButton]}
          onPress={() => setShowReservationModal(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Reserve</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deliveryButton]}
          onPress={() => setShowDeliveryModal(true)}
        >
          <Ionicons name="bicycle-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Order Delivery</Text>
        </TouchableOpacity>
      </View>
      
      {/* Reservation Modal */}
      <Modal
        visible={showReservationModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Make a Reservation</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                placeholder="Select date"
                value={reservationDetails.date}
                onChangeText={text => setReservationDetails({...reservationDetails, date: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.input}
                placeholder="Select time"
                value={reservationDetails.time}
                onChangeText={text => setReservationDetails({...reservationDetails, time: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of Guests</Text>
              <TextInput
                style={styles.input}
                placeholder="2"
                value={reservationDetails.guests}
                onChangeText={text => setReservationDetails({...reservationDetails, guests: text})}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Special Requests</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special requests?"
                value={reservationDetails.specialRequests}
                onChangeText={text => setReservationDetails({...reservationDetails, specialRequests: text})}
                multiline
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowReservationModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleReservation}
              >
                <Text style={styles.confirmButtonText}>Confirm Reservation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Delivery Modal */}
      <Modal
        visible={showDeliveryModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Order Delivery</Text>
            
            {selectedItem && (
              <View style={styles.selectedItemContainer}>
                <Text style={styles.selectedItemText}>Selected Item: {selectedItem.name}</Text>
                <View style={styles.quantitySelector}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Ionicons name="remove" size={20} color="#E23744" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => setQuantity(quantity + 1)}
                  >
                    <Ionicons name="add" size={20} color="#E23744" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>Total: kes{(selectedItem.price * quantity).toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Delivery Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your delivery address"
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Delivery Instructions</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special instructions for delivery?"
                value={deliveryInstructions}
                onChangeText={setDeliveryInstructions}
                multiline
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeliveryModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDelivery}
              >
                <Text style={styles.confirmButtonText}>Place Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  restaurantImage: {
    width: '100%',
    height: 250,
  },
  restaurantHeader: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  favoriteButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
  restaurantInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,140,0,0.1)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ratingText: {
    marginLeft: 3,
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  dot: {
    marginHorizontal: 8,
    color: '#999',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 14,
    color: '#666',
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E23744',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#E23744',
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E23744',
  },
  menuItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 20,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  infoContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  reviewsContainer: {
    padding: 20,
  },
  overallRating: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overallRatingText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  stars: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  totalReviews: {
    fontSize: 14,
    color: '#666',
  },
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  reviewComment: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addReviewButton: {
    backgroundColor: '#E23744',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addReviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
  },
  reservationButton: {
    backgroundColor: '#E23744',
  },
  deliveryButton: {
    backgroundColor: '#E23744',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#E23744',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedItemContainer: {
    backgroundColor: '#FFF9F2',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityButton: {
    backgroundColor: '#FFEEDD',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E23744',
  },
});

export default RestaurantScreen;