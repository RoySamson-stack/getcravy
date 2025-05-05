export const endpoints = {
    baseUrl: 'https://api.example.com', 

    // restaurants endpoints
    getRestaurants: `api/restaurants`,
    createRestaurants: `api/restaurants`,
    getSingleRestaurant: `api/restaurants/:id`,
    updateRestaurant: `api/restaurants/:id`,
    deleteRestaurant: `api/restaurants/:id`,


    //location based endpoints
    cityFilterRestaurant: `api/locations/cities`,
    neighborhoodFilterRestaurant: `api/locations/neighborhoods`,


    //search filter
    searchRestaurant: `api/restaurants/search`,
    filterRestaurant: `api/restaurants/filter`,


    //special feature
    featuredRestaurant: `api/restaurants/featured`,
    nearbyRestaurant: `api/restaurants/nearby`,

    // additional features you requested
    trendingRestaurants: `api/restaurants/trending`,
    topLikedRestaurants: `api/restaurants/top-liked`,
    likeRestaurant: `api/restaurants/:id/like`
};