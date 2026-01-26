const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/restaurants/:restaurantId/availability', reservationController.getAvailability);

// Protected routes
router.post('/restaurants/:restaurantId/reservations', authenticate, reservationController.createReservation);
router.get('/', authenticate, reservationController.getUserReservations);
router.put('/:id', authenticate, reservationController.updateReservation);
router.delete('/:id', authenticate, reservationController.cancelReservation);

module.exports = router;








