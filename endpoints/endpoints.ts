// Get base URL from environment or use default
// For development, use localhost
// For physical device testing, use your computer's IP address
// In production, use your production API URL
const getBaseUrl = () => {
  // Check if we have an environment variable
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  // Default to localhost for development
  return 'http://localhost:5000/api/';
};

export const endpoints = {
    baseUrl: getBaseUrl(), 
    
    // Authentication endpoints
    login: `auth/login`,
    signup: `auth/signup`,
    logout: `auth/logout`,
    forgotPassword: `auth/forgot-password`,
    resetPassword: `auth/reset-password`,
    
    // User management
    getProfile: `/users/profile`,
    updateProfile: `/users/profile`,
    
    // Restaurants endpoints
    getRestaurants: `restaurants`,
    createRestaurant: `restaurants`,
    getSingleRestaurant: `restaurants/:id`,
    updateRestaurant: `restaurants/:id`,
    uploadRestaurant: `restaurants/:id/upload`,
    deleteRestaurant: `restaurants/:id`,
    
    // Location based endpoints
    cityFilterRestaurant: `/locations/cities`,
    neighborhoodFilterRestaurant: `/locations/neighborhoods`,
    
    // Search filter
    searchRestaurant: `/restaurants/search`,
    filterRestaurant: `/restaurants/filter`,
    
    // Special features
    featuredRestaurant: `/restaurants/featured`,
    nearbyRestaurant: `/restaurants/nearby`,
    trendingRestaurants: `/restaurants/trending`,
    topLikedRestaurants: `/restaurants/top-liked`,
    likeRestaurant: `/restaurants/:id/like`,
  };