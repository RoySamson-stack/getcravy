const { body } = require('express-validator');

exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('phone')
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 characters')
];

exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

exports.validateMenuItem = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters'),
  
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
];

exports.validateReview = [
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Comment must be less than 1000 characters')
];

exports.validateOrder = [
  body('restaurantId')
    .trim()
    .notEmpty()
    .withMessage('Restaurant is required')
    .isUUID()
    .withMessage('Restaurant ID must be valid'),

  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one order item is required'),

  body('items.*.menuItemId')
    .trim()
    .notEmpty()
    .withMessage('Menu item is required')
    .isUUID()
    .withMessage('Menu item ID must be valid'),

  body('items.*.quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),

  body('paymentMethod')
    .isIn(['card', 'paypal', 'cash'])
    .withMessage('Payment method must be card, paypal, or cash'),

  body('deliveryAddress')
    .trim()
    .notEmpty()
    .withMessage('Delivery address is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Delivery address must be between 5 and 500 characters'),

  body('deliveryInstructions')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Delivery instructions must be less than 500 characters'),

  body('contactPhone')
    .optional()
    .isLength({ min: 10, max: 20 })
    .withMessage('Contact phone must be between 10 and 20 characters')
];
