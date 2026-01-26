const { Restaurant, Event, Deal } = require('../models/associations');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// @route   GET /api/restaurants
// @desc    Get all restaurants with filtering and pagination
// @access  Public
exports.getAllRestaurants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      city,
      neighborhood,
      search,
      minRating,
      featured,
      sortBy = 'rating',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { isActive: true };

    // Apply filters
    if (category) {
      where.category = category;
    }
    if (city) {
      where.city = city;
    }
    if (neighborhood) {
      where.neighborhood = neighborhood;
    }
    if (minRating) {
      where.rating = { [Op.gte]: parseFloat(minRating) };
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Sorting
    const order = [[sortBy, sortOrder.toUpperCase()]];

    const { count, rows } = await Restaurant.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order
    });

    res.json({
      success: true,
      data: {
        restaurants: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   GET /api/restaurants/:id
// @desc    Get single restaurant by ID
// @access  Public
exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findByPk(id, {
      include: [
        {
          model: Event,
          as: 'events',
          where: {
            isActive: true,
            date: { [Op.gte]: new Date().toISOString().split('T')[0] } // Only future events
          },
          required: false,
          order: [['date', 'ASC'], ['time', 'ASC']],
          limit: 10
        },
        {
          model: Deal,
          as: 'deals',
          where: { isActive: true },
          required: false
        }
      ]
    });

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data: { restaurant }
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   GET /api/restaurants/nearby
// @desc    Get nearby restaurants by location
// @access  Public
exports.getNearbyRestaurants = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);

    // Simple distance calculation (Haversine formula would be better)
    // For now, using a simple bounding box
    const restaurants = await Restaurant.findAll({
      where: {
        isActive: true,
        latitude: {
          [Op.between]: [lat - rad / 111, lat + rad / 111]
        },
        longitude: {
          [Op.between]: [lng - rad / 111, lng + rad / 111]
        }
      },
      limit: 50,
      order: [['rating', 'DESC']]
    });

    res.json({
      success: true,
      data: { restaurants }
    });
  } catch (error) {
    console.error('Get nearby restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   GET /api/restaurants/featured
// @desc    Get featured restaurants
// @access  Public
exports.getFeaturedRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: {
        isActive: true,
        featured: true
      },
      limit: 10,
      order: [['rating', 'DESC']]
    });

    res.json({
      success: true,
      data: { restaurants }
    });
  } catch (error) {
    console.error('Get featured restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   POST /api/restaurants
// @desc    Create new restaurant (Admin/Restaurant Owner)
// @access  Private
exports.createRestaurant = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const restaurantData = {
      ...req.body,
      ownerId: req.user.id
    };

    const restaurant = await Restaurant.create(restaurantData);

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: { restaurant }
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   PUT /api/restaurants/:id
// @desc    Update restaurant
// @access  Private (Owner/Admin)
exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check if user is owner or admin
    if (restaurant.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant'
      });
    }

    await restaurant.update(req.body);

    res.json({
      success: true,
      message: 'Restaurant updated successfully',
      data: { restaurant }
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   DELETE /api/restaurants/:id
// @desc    Delete restaurant
// @access  Private (Owner/Admin)
exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check if user is owner or admin
    if (restaurant.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this restaurant'
      });
    }

    await restaurant.update({ isActive: false });

    res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};








