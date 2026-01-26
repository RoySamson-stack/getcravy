const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');

// Public routes
router.get('/restaurants/:restaurantId/reviews', reviewController.getRestaurantReviews);

// Protected routes
router.post('/restaurants/:restaurantId/reviews', authenticate, validateReview, reviewController.createReview);
router.put('/:id', authenticate, reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;

