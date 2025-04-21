import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { orangeTheme } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import DeliveryScreen from '../screens/DeliveryScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Map" component={MapScreen} />
    {/* Add other screens */}
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = 'home';
        
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Map') iconName = 'map';
        else if (route.name === 'Delivery') iconName = 'delivery-dining';
        else if (route.name === 'Reservations') iconName = 'book-online';
        else if (route.name === 'Profile') iconName = 'person';
        
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: orangeTheme.colors.primary,
      tabBarInactiveTintColor: orangeTheme.colors.placeholder,
      tabBarStyle: {
        backgroundColor: orangeTheme.colors.surface,
        borderTopWidth: 0,
        elevation: 8,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Delivery" component={DeliveryScreen} />
    <Tab.Screen name="Reservations" component={ReservationsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <PaperProvider theme={orangeTheme}>
    <NavigationContainer theme={orangeTheme}>
      <Drawer.Navigator
        screenOptions={{
          drawerActiveTintColor: orangeTheme.colors.primary,
          drawerInactiveTintColor: orangeTheme.colors.text,
          drawerStyle: {
            backgroundColor: orangeTheme.colors.background,
          },
        }}
      >
        <Drawer.Screen 
          name="Main" 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
        {/* Add other drawer screens */}
      </Drawer.Navigator>
    </NavigationContainer>
  </PaperProvider>
);

export default AppNavigator;