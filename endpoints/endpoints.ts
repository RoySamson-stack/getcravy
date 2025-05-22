export const endpoints = {
    baseUrl: 'http://192.168.250.52:5000/api/', 
    
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