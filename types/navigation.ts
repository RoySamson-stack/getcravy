import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Restaurant: {
    id: string;
    name: string;
    image?: any;
    rating?: number;
    category?: string;
    deliveryTime?: string;
    price?: string;
  };
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: {
    orderId?: string;
    total?: string;
    status?: string;
    restaurantName?: string;
  };
  AllRestaurants: {
    homeRestaurants?: any[];
  };
  Profile: undefined;
  VideoFeed: undefined;
  Events: {
    vibe?: string;
  };
  EventDetail: {
    eventId: string;
  };
  CarMeets: undefined;
  CarMeetDetail: {
    meetId: string;
  };
  Search: undefined;
  Bookings: undefined;
};

export type Restaurant = {
  id: string;
  name: string;
  image: any;
  rating: number;
  category: string;
  deliveryTime: string;
  price: string;
  neighborhood?: string;
  address?: string;
  phone?: string;
  hours?: string;
  description?: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
};

export type OrderItem = {
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type Review = {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
  photos?: string[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  favorites: string[];
  address?: string;
};

export type CarMeet = {
  id: string;
  title: string;
  location: string;
  address: string;
  date: string;
  endDate?: string;
  description: string;
  image: any;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  carTypes: string[];
  foodAvailable: boolean;
  foodVendors?: string[];
  entryFee: number;
  phone: string;
  whatsapp: string;
  tags: string[];
};


