const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/featured', restaurantController.getFeaturedRestaurants);
router.get('/nearby', restaurantController.getNearbyRestaurants);
router.get('/:id', restaurantController.getRestaurantById);

// Protected routes (require authentication)
router.post('/', authenticate, restaurantController.createRestaurant);
router.put('/:id', authenticate, restaurantController.updateRestaurant);
router.delete('/:id', authenticate, restaurantController.deleteRestaurant);

module.exports = router;








