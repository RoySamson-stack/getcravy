const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const { authenticate } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const dealValidation = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('restaurantId').isUUID().withMessage('Restaurant ID must be a valid UUID'),
  body('dayOfWeek').optional().isInt({ min: 0, max: 6 }).withMessage('Day of week must be between 0 (Sunday) and 6 (Saturday)')
];

// Public routes
router.get('/today', dealController.getTodayDeals);
router.get('/this-week', dealController.getThisWeekDeals);
router.get('/restaurants/:restaurantId', dealController.getRestaurantDeals);

// Protected routes (require authentication)
router.post('/', authenticate, dealValidation, dealController.createDeal);
router.put('/:id', authenticate, dealController.updateDeal);
router.delete('/:id', authenticate, dealController.deleteDeal);

module.exports = router;



