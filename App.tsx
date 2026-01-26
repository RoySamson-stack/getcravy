import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from './types/navigation';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import RestaurantScreen from './screens/RestaurantScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import AllRestaurantsScreen from './screens/AllRestaurantsScreen';
import ProfileScreen from './screens/ProfileScreen';
import VideoFeedScreen from './screens/VideoFeedScreen';
import EventsScreen from './screens/EventsScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import BookingsScreen from './screens/BookingsScreen';
import { useInactivityTimeout } from './hooks/useInactivityTimeout';


const Stack = createStackNavigator<RootStackParamList>();

// Inner component to access auth context
function AppNavigator() {
  const { user, logout } = useAuth();
  const theme = React.useContext(ThemeContext);
  if (!theme) throw new Error('ThemeContext must be used within ThemeProvider');
  const { colors, isDark } = theme;
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  // Inactivity timeout - logout after 15 minutes of inactivity
  useInactivityTimeout({
    timeoutMinutes: 15,
    onTimeout: async () => {
      if (user) {
        await logout();
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    },
    enabled: !!user,
  });

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        initialRouteName={user ? "Home" : "Login"}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitleVisible: false,
        }}
      >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={({ navigation }) => ({ 
              title: 'GoEat',
              headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 15 }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('VideoFeed')}
                    style={{ marginRight: 15 }}
                  >
                    <Ionicons name="videocam-outline" size={28} color={colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                  >
                    <Ionicons name="person-circle-outline" size={28} color={colors.white} />
                  </TouchableOpacity>
                </View>
              ),
            })} 
          />
          <Stack.Screen 
            name="VideoFeed" 
            component={VideoFeedScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Restaurant" 
            component={RestaurantScreen} 
            options={({ route, navigation }) => ({ 
              title: route.params.name,
              headerBackTitleVisible: false,
            })} 
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen} 
            options={{ title: 'Your Cart' }} 
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen} 
            options={{ title: 'Checkout' }} 
          />
          <Stack.Screen 
            name="OrderConfirmation" 
            component={OrderConfirmationScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="AllRestaurants" 
            component={AllRestaurantsScreen} 
            options={{ title: 'All Restaurants' }} 
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={({ navigation }) => ({
              headerShown: false,
              gestureEnabled: true,
            })} 
          />
          <Stack.Screen 
            name="Events" 
            component={EventsScreen} 
            options={{ title: 'Events' }} 
          />
          <Stack.Screen 
            name="EventDetail" 
            component={EventDetailScreen} 
            options={{ title: 'Event Details' }} 
          />
          <Stack.Screen 
            name="Bookings" 
            component={BookingsScreen} 
            options={{ title: 'My Bookings' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}