import { Restaurant, MenuItem, Review, CarMeet } from '../types/navigation';
import { placeholderImages } from './images';

// Dummy car meets data
export const dummyCarMeets: CarMeet[] = [
  {
    id: '1',
    title: 'Nairobi Sunday Cars & Coffee',
    location: 'Village Market Parking',
    address: 'Village Market, Gigiri, Nairobi',
    date: '2026-02-02T08:00:00Z',
    endDate: '2026-02-02T12:00:00Z',
    description: 'Weekly gathering of car enthusiasts. Bring your ride and enjoy coffee with fellow petrolheads.',
    image: placeholderImages.restaurant,
    organizer: 'Nairobi Car Club',
    attendees: 45,
    maxAttendees: 100,
    carTypes: ['JDM', 'European', 'American Muscle', 'Classic'],
    foodAvailable: true,
    foodVendors: ['Java House', 'Artcaffe'],
    entryFee: 0,
    phone: '+254 722 000 001',
    whatsapp: '+254 722 000 001',
    tags: ['weekly', 'family-friendly', 'coffee']
  },
  {
    id: '2',
    title: 'JDM Night Meet',
    location: 'Carnivore Grounds',
    address: 'Carnivore Restaurant, Langata Road',
    date: '2026-02-07T19:00:00Z',
    endDate: '2026-02-07T23:00:00Z',
    description: 'Japanese car enthusiasts unite! Show off your JDM builds and enjoy great food.',
    image: placeholderImages.restaurant,
    organizer: 'JDM Kenya',
    attendees: 78,
    maxAttendees: 150,
    carTypes: ['JDM', 'Tuner'],
    foodAvailable: true,
    foodVendors: ['Carnivore Restaurant'],
    entryFee: 500,
    phone: '+254 733 000 002',
    whatsapp: '+254 733 000 002',
    tags: ['jdm', 'night', 'tuner']
  },
  {
    id: '3',
    title: 'Classic Car Show & Brunch',
    location: 'Karen Country Club',
    address: 'Karen Country Club, Karen',
    date: '2026-02-09T10:00:00Z',
    endDate: '2026-02-09T16:00:00Z',
    description: 'Vintage and classic car display with gourmet brunch. Family-friendly event.',
    image: placeholderImages.restaurant,
    organizer: 'Classic Car Society Kenya',
    attendees: 32,
    maxAttendees: 80,
    carTypes: ['Classic', 'Vintage', 'Luxury'],
    foodAvailable: true,
    foodVendors: ['Karen Country Club Restaurant'],
    entryFee: 1000,
    phone: '+254 744 000 003',
    whatsapp: '+254 744 000 003',
    tags: ['classic', 'brunch', 'family']
  }
];

// Dummy restaurants data
export const dummyRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Pizza Palace',
    image: placeholderImages.restaurant,
    rating: 4.8,
    category: 'Italian',
    deliveryTime: '20-30 min',
    price: 'Ksh',
    address: '123 Main Street, Nairobi',
    phone: '+254 700 000 000',
    description: 'Authentic Italian cuisine with a modern twist'
  },
  {
    id: '2',
    name: 'Sushi Express',
    image: placeholderImages.restaurant,
    rating: 4.6,
    category: 'Japanese',
    deliveryTime: '25-35 min',
    price: 'Ksh',
    address: '456 Park Avenue, Nairobi',
    phone: '+254 700 000 001',
    description: 'Fresh sushi and Japanese delicacies'
  },
  {
    id: '3',
    name: 'Taco Fiesta',
    image: placeholderImages.restaurant,
    rating: 4.7,
    category: 'Mexican',
    deliveryTime: '15-25 min',
    price: 'Ksh',
    address: '789 Market Street, Nairobi',
    phone: '+254 700 000 002',
    description: 'Spicy Mexican flavors and authentic tacos'
  },
  {
    id: '4',
    name: 'Burger House',
    image: placeholderImages.restaurant,
    rating: 4.5,
    category: 'American',
    deliveryTime: '20-30 min',
    price: 'Ksh',
    address: '321 Oak Boulevard, Nairobi',
    phone: '+254 700 000 003',
    description: 'Gourmet burgers and classic American fare'
  },
  {
    id: '5',
    name: 'Curry Corner',
    image: placeholderImages.restaurant,
    rating: 4.9,
    category: 'Indian',
    deliveryTime: '30-40 min',
    price: 'Ksh',
    address: '654 Spice Road, Nairobi',
    phone: '+254 700 000 004',
    description: 'Authentic Indian curries and tandoori dishes'
  },
  {
    id: '6',
    name: 'Pho Saigon',
    image: placeholderImages.restaurant,
    rating: 4.4,
    category: 'Vietnamese',
    deliveryTime: '25-35 min',
    price: 'Ksh',
    address: '987 River Street, Nairobi',
    phone: '+254 700 000 005',
    description: 'Traditional Vietnamese pho and spring rolls'
  }
];

// Dummy menu items
export const dummyMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 1299,
    category: 'Pizza',
    image: 'https://via.placeholder.com/300',
    rating: 4.7
  },
  {
    id: '2',
    name: 'Pasta Carbonara',
    description: 'Spaghetti with creamy sauce, pancetta, and parmesan',
    price: 1499,
    category: 'Pasta',
    image: 'https://via.placeholder.com/300',
    rating: 4.5
  },
  {
    id: '3',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers',
    price: 799,
    category: 'Dessert',
    image: 'https://via.placeholder.com/300',
    rating: 4.8
  },
  {
    id: '4',
    name: 'Bruschetta',
    description: 'Toasted bread topped with tomatoes, garlic, and basil',
    price: 699,
    category: 'Appetizer',
    image: 'https://via.placeholder.com/300',
    rating: 4.3
  },
  {
    id: '5',
    name: 'Chicken Parmesan',
    description: 'Breaded chicken topped with marinara and mozzarella',
    price: 1699,
    category: 'Main Course',
    image: 'https://via.placeholder.com/300',
    rating: 4.6
  }
];

// Dummy reviews
export const dummyReviews: Review[] = [
  {
    id: '1',
    user: 'John D.',
    rating: 5,
    date: '2 days ago',
    comment: 'Amazing food and great service! Will definitely come back.',
    photos: []
  },
  {
    id: '2',
    user: 'Sarah M.',
    rating: 4,
    date: '1 week ago',
    comment: 'Delicious pasta, but the wait was a bit long.',
    photos: []
  },
  {
    id: '3',
    user: 'Michael T.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Best pizza in town! The crust is perfect.',
    photos: []
  }
];

