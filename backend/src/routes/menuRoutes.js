const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticate } = require('../middleware/auth');
const { validateMenuItem } = require('../middleware/validation');

// Public routes
router.get('/restaurants/:restaurantId/menu', menuController.getRestaurantMenu);
router.get('/:id', menuController.getMenuItemById);

// Protected routes
router.post('/restaurants/:restaurantId/menu', authenticate, validateMenuItem, menuController.createMenuItem);
router.put('/:id', authenticate, menuController.updateMenuItem);
router.delete('/:id', authenticate, menuController.deleteMenuItem);

module.exports = router;

