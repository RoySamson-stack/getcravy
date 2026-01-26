const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const eventValidation = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Date must be a valid date'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:00)?$/).withMessage('Time must be in HH:MM format'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('eventType').optional().isIn(['restaurant_event', 'festival', 'popup', 'special', 'entertainment']).withMessage('Invalid event type')
];

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.get('/:id/attendees', eventController.getEventAttendees);

// Protected routes (require authentication)
router.post('/', authenticate, eventValidation, eventController.createEvent);
router.post('/:id/attend', authenticate, eventController.attendEvent);
router.delete('/:id/attend', authenticate, eventController.removeAttendance);

module.exports = router;



