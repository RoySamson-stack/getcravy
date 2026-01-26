  import React, { useState, useContext, useEffect } from 'react';
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
import { ThemeContext } from '../context/ThemeContext';
import { placeholderImages } from '../constants/images';
import { restaurantAPI } from '../services/api';
import { menuAPI } from '../services/menuAPI';
import { reviewAPI } from '../services/reviewAPI';
import { eventAPI, Event } from '../services/eventAPI';
import { dealAPI, Deal } from '../services/dealAPI';
import { ActivityIndicator, Linking, Alert } from 'react-native';
import { dummyMenuItems, dummyReviews, dummyRestaurants } from '../constants/dummyData';

const { width } = Dimensions.get('window');

const RestaurantScreen = ({ route, navigation }: any) => {
  const { user } = useContext(AuthContext);
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors } = theme;
  
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Fetch restaurant data from API
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await restaurantAPI.getById(route.params.id);
        
        if (result.success && result.restaurant) {
          const r = result.restaurant;
          setRestaurant({
            id: r.id,
            name: r.name,
            image: r.images && r.images.length > 0 ? { uri: r.images[0] } : placeholderImages.restaurant,
            rating: parseFloat(r.rating) || 0,
            category: r.category,
            deliveryTime: r.deliveryTime || '20-30 min',
            price: r.priceRange || 'Ksh',
            address: r.address || 'Address not available',
            phone: r.phone || 'Phone not available',
            hours: r.hours || null, // Keep as object for isOpenNow check
            hoursFormatted: r.hours ? formatHours(r.hours) : 'Hours not available',
            description: r.description || 'No description available'
          });
        } else {
          // Fallback to route params or dummy data if API fails
          const fallbackRestaurant = dummyRestaurants.find(r => r.id === route.params.id) || {
    id: route.params.id,
            name: route.params.name || 'Restaurant',
            image: route.params.image || placeholderImages.restaurant,
            rating: route.params.rating || 4.8,
            category: route.params.category || 'Italian',
            deliveryTime: route.params.deliveryTime || '20-30 min',
            price: route.params.price || 'Ksh',
            address: 'Address not available',
            phone: 'Phone not available',
            hours: 'Hours not available',
            description: 'No description available'
          };
          setRestaurant(fallbackRestaurant);
        }
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        // Fallback to route params or dummy data
        const fallbackRestaurant = dummyRestaurants.find(r => r.id === route.params.id) || {
          id: route.params.id,
          name: route.params.name || 'Restaurant',
          image: route.params.image || placeholderImages.restaurant,
          rating: route.params.rating || 4.8,
          category: route.params.category || 'Italian',
          deliveryTime: route.params.deliveryTime || '20-30 min',
          price: route.params.price || 'Ksh',
          address: 'Address not available',
          phone: 'Phone not available',
          hours: 'Hours not available',
          description: 'No description available'
        };
        setRestaurant(fallbackRestaurant);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [route.params.id]);

  // Fetch menu when restaurant is loaded with dummy data fallback
  useEffect(() => {
    if (restaurant?.id) {
      const fetchMenu = async () => {
        try {
          setMenuLoading(true);
          const result = await menuAPI.getRestaurantMenu(restaurant.id);
          if (result.success && result.menuItems && result.menuItems.length > 0) {
            setMenuItems(result.menuItems);
          } else {
            // Use dummy data if API returns empty or fails
            console.log('Using dummy menu data');
            setMenuItems(dummyMenuItems);
          }
        } catch (err) {
          console.error('Error fetching menu:', err);
          // Use dummy data on error
          console.log('API error, using dummy menu data');
          setMenuItems(dummyMenuItems);
        } finally {
          setMenuLoading(false);
        }
      };
      fetchMenu();
    }
  }, [restaurant?.id]);

  // Fetch reviews when restaurant is loaded with dummy data fallback
  useEffect(() => {
    if (restaurant?.id) {
      const fetchReviews = async () => {
        try {
          setReviewsLoading(true);
          const result = await reviewAPI.getRestaurantReviews(restaurant.id, 1, 10);
          if (result.success && result.reviews && result.reviews.length > 0) {
            setReviews(result.reviews.map((r: any) => ({
              id: r.id,
              user: r.user?.name || 'Anonymous',
              rating: r.rating,
              date: new Date(r.createdAt).toLocaleDateString(),
              comment: r.comment || '',
              photos: r.photos || []
            })));
          } else {
            // Use dummy data if API returns empty or fails
            console.log('Using dummy review data');
            setReviews(dummyReviews);
          }
        } catch (err) {
          console.error('Error fetching reviews:', err);
          // Use dummy data on error
          console.log('API error, using dummy review data');
          setReviews(dummyReviews);
        } finally {
          setReviewsLoading(false);
        }
      };
      fetchReviews();
    }
  }, [restaurant?.id]);

  // Fetch events when restaurant is loaded
  useEffect(() => {
    if (restaurant?.id) {
      const fetchEvents = async () => {
        try {
          setEventsLoading(true);
          const result = await eventAPI.getAll({ restaurantId: restaurant.id, limit: 10 });
          if (result.success && result.data) {
            setEvents(result.data);
          }
        } catch (err) {
          console.error('Error fetching events:', err);
        } finally {
          setEventsLoading(false);
        }
      };
      fetchEvents();
    }
  }, [restaurant?.id]);

  // Fetch deals when restaurant is loaded
  useEffect(() => {
    if (restaurant?.id) {
      const fetchDeals = async () => {
        try {
          const result = await dealAPI.getByRestaurant(restaurant.id);
          if (result.success && result.data) {
            setDeals(result.data);
          }
        } catch (err) {
          console.error('Error fetching deals:', err);
        }
      };
      fetchDeals();
    }
  }, [restaurant?.id]);

  const formatHours = (hours: any): string => {
    if (typeof hours === 'string') return hours;
    if (typeof hours === 'object') {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      return days.map(day => {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1);
        return `${dayName}: ${hours[day] || 'Closed'}`;
      }).join('\n');
    }
    return 'Hours not available';
  };

  // Check if restaurant is open now
  const isOpenNow = (hours: any): boolean => {
    if (!hours || typeof hours !== 'object') return false;
    
    const now = new Date();
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const todayHours = hours[dayOfWeek];
    
    if (!todayHours || todayHours === 'Closed') return false;
    
    // Parse hours (format: "HH:MM - HH:MM")
    const [openTime, closeTime] = todayHours.split(' - ');
    if (!openTime || !closeTime) return false;
    
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    return nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  };

  // Handle WhatsApp contact
  const handleWhatsApp = (phone: string) => {
    if (!phone) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }
    
    // Remove any non-digit characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const whatsappUrl = `whatsapp://send?phone=${cleanPhone}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(whatsappUrl);
        } else {
          // Fallback to web WhatsApp
          const webUrl = `https://wa.me/${cleanPhone}`;
          Linking.openURL(webUrl);
        }
      })
      .catch((err) => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Error', 'Failed to open WhatsApp');
      });
  };

  // Handle phone call
  const handleCall = (phone: string) => {
    if (!phone) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }
    
    const phoneUrl = `tel:${phone}`;
    Linking.openURL(phoneUrl).catch((err) => {
      console.error('Error making call:', err);
      Alert.alert('Error', 'Failed to make call');
    });
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

  const renderMenuItem = ({ item }) => {
    // Handle both string URLs and require() objects for images
    const itemImage = typeof item.image === 'string' 
      ? { uri: item.image } 
      : (item.image || placeholderImages.dish);
    
    return (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={() => setSelectedItem(item)}
    >
      <Image source={itemImage} style={styles.menuItemImage} />
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>Ksh {parseFloat(item.price).toFixed(2)}</Text>
      </View>
      <View style={styles.menuItemRating}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
    </TouchableOpacity>
  );
  };

  const styles = createStyles(colors);

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

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading restaurant...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error || 'Restaurant not found'}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={restaurant.image} style={styles.restaurantImage} />
      
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
            color={user?.favorites?.includes(restaurant.id) ? colors.primary : "#fff"} 
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
        <View style={styles.deliveryTimeRow}>
        <Text style={styles.deliveryTime}>
          <Ionicons name="time-outline" size={16} color="#666" /> {restaurant.deliveryTime}
        </Text>
          {restaurant.hours && isOpenNow(restaurant.hours) && (
            <View style={styles.openNowBadge}>
              <View style={styles.openNowDot} />
              <Text style={styles.openNowText}>Open Now</Text>
            </View>
          )}
        </View>
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
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>Events</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'menu' && (
        <View style={styles.menuContainer}>
          {menuLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading menu...</Text>
            </View>
          ) : menuItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No menu items available</Text>
            </View>
          ) : (
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
          )}
        </View>
      )}
      
      {activeTab === 'info' && (
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <Ionicons name="location-outline" size={24} color={colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Address</Text>
              <Text style={styles.infoContent}>{restaurant.address}</Text>
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <Ionicons name="call-outline" size={24} color={colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Phone</Text>
              <Text style={styles.infoContent}>{restaurant.phone}</Text>
              <View style={styles.contactButtons}>
                <TouchableOpacity 
                  style={[styles.contactButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleCall(restaurant.phone)}
                >
                  <Ionicons name="call" size={16} color="#fff" />
                  <Text style={styles.contactButtonText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.contactButton, { backgroundColor: colors.success }]}
                  onPress={() => handleWhatsApp(restaurant.phone)}
                >
                  <Ionicons name="logo-whatsapp" size={16} color="#fff" />
                  <Text style={styles.contactButtonText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <Ionicons name="time-outline" size={24} color={colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Hours</Text>
              <Text style={styles.infoContent}>{restaurant.hoursFormatted || restaurant.hours || 'Hours not available'}</Text>
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
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
            <Text style={styles.overallRatingText}>{restaurant.rating.toFixed(1)}</Text>
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
          
          {reviewsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading reviews...</Text>
            </View>
          ) : reviews.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reviews yet</Text>
            </View>
          ) : (
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
          )}
          
          <TouchableOpacity style={styles.addReviewButton}>
            <Text style={styles.addReviewButtonText}>Write a Review</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'events' && (
        <View style={styles.eventsContainer}>
          {eventsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color={colors.textLight} />
              <Text style={styles.emptyText}>No upcoming events</Text>
              <Text style={styles.emptySubtext}>Check back later for new events</Text>
            </View>
          ) : (
            <>
              {deals.length > 0 && (
                <View style={styles.dealsSection}>
                  <Text style={styles.sectionTitle}>Today's Deals</Text>
                  {deals.slice(0, 3).map((deal) => (
                    <View key={deal.id} style={styles.dealCard}>
                      <View style={styles.dealContent}>
                        <Text style={styles.dealTitle}>{deal.title}</Text>
                        {deal.description && (
                          <Text style={styles.dealDescription}>{deal.description}</Text>
                        )}
                        {deal.discount && (
                          <Text style={styles.dealDiscount}>{deal.discount}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <FlatList
                data={events}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.eventCard}
                    onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
                  >
                    <View style={styles.eventCardContent}>
                      <Text style={styles.eventCardTitle}>{item.title}</Text>
                      <View style={styles.eventCardMeta}>
                        <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
                        <Text style={styles.eventCardDate}>
                          {new Date(item.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Text>
                        <Ionicons name="time-outline" size={14} color={colors.textLight} style={styles.eventCardIcon} />
                        <Text style={styles.eventCardTime}>{item.time.substring(0, 5)}</Text>
                      </View>
                      {item.price ? (
                        <Text style={styles.eventCardPrice}>KES {item.price}</Text>
                      ) : (
                        <Text style={[styles.eventCardPrice, { color: colors.success }]}>Free</Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          )}
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
                    <Ionicons name="remove" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => setQuantity(quantity + 1)}
                  >
                    <Ionicons name="add" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemPrice}>Total: Ksh {(parseFloat(selectedItem.price) * quantity).toFixed(2)}</Text>
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

const createStyles = (colors: any) => StyleSheet.create({
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
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
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
    color: colors.primary,
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
    backgroundColor: colors.primary,
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
    backgroundColor: colors.primary,
  },
  deliveryButton: {
    backgroundColor: colors.primary,
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
    backgroundColor: colors.primary,
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
    color: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textLight,
    fontSize: 16,
  },
  emptySubtext: {
    color: colors.textLight,
    fontSize: 14,
    marginTop: 8,
    opacity: 0.7,
  },
  deliveryTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  openNowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openNowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  openNowText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  contactButtons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  eventsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  dealsSection: {
    marginBottom: 24,
  },
  dealCard: {
    backgroundColor: '#FFF9F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  dealContent: {
    flex: 1,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dealDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dealDiscount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  eventCardContent: {
    flex: 1,
  },
  eventCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  eventCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventCardDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  eventCardIcon: {
    marginLeft: 12,
  },
  eventCardTime: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  eventCardPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
  },
});

export default RestaurantScreen;