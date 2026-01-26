const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { validationResult } = require('express-validator');

// @route   GET /api/restaurants/:restaurantId/menu
// @desc    Get menu for a restaurant
// @access  Public
exports.getRestaurantMenu = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { category, available } = req.query;

    const where = { restaurantId };
    
    if (category) {
      where.category = category;
    }
    if (available === 'true') {
      where.isAvailable = true;
    }

    const menuItems = await MenuItem.findAll({
      where,
      order: [['category', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { menuItems }
    });
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
exports.getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findByPk(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: { menuItem }
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   POST /api/restaurants/:restaurantId/menu
// @desc    Create menu item (Restaurant Owner)
// @access  Private
exports.createMenuItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { restaurantId } = req.params;

    // Check if restaurant exists and user owns it
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (restaurant.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add menu items to this restaurant'
      });
    }

    const menuItem = await MenuItem.create({
      ...req.body,
      restaurantId
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: { menuItem }
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Private
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findByPk(id, {
      include: [{ model: Restaurant, as: 'restaurant' }]
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Check authorization
    const restaurant = await Restaurant.findByPk(menuItem.restaurantId);
    if (restaurant.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this menu item'
      });
    }

    await menuItem.update(req.body);

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: { menuItem }
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Private
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findByPk(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Check authorization
    const restaurant = await Restaurant.findByPk(menuItem.restaurantId);
    if (restaurant.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this menu item'
      });
    }

    await menuItem.destroy();

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};








