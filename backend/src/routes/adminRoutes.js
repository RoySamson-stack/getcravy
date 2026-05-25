const express = require('express');
const router = express.Router();
const { authorizeAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Apply admin authorization to all admin routes
router.use(authorizeAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Restaurants
router.get('/restaurants', adminController.getRestaurants);
router.post('/restaurants', adminController.createRestaurant);
router.put('/restaurants/:id', adminController.updateRestaurant);
router.delete('/restaurants/:id', adminController.deleteRestaurant);

// Events
router.get('/events', adminController.getEvents);
router.post('/events', adminController.createEvent);
router.put('/events/:id', adminController.updateEvent);
router.delete('/events/:id', adminController.deleteEvent);

// Deals
router.get('/deals', adminController.getDeals);
router.post('/deals', adminController.createDeal);
router.put('/deals/:id', adminController.updateDeal);
router.delete('/deals/:id', adminController.deleteDeal);

// Menu Items
router.get('/menu-items', adminController.getMenuItems);
router.post('/menu-items', adminController.createMenuItem);
router.put('/menu-items/:id', adminController.updateMenuItem);
router.delete('/menu-items/:id', adminController.deleteMenuItem);

// Users
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Reviews
router.get('/reviews', adminController.getReviews);
router.delete('/reviews/:id', adminController.deleteReview);

// Reservations
router.get('/reservations', adminController.getReservations);

// Orders
router.get('/orders', adminController.getOrders);

module.exports = router;
