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




