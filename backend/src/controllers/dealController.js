const { Deal, Restaurant } = require('../models/associations');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Helper function to check if deal is currently valid
const isDealValid = (deal) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentTime = now.getHours() * 100 + now.getMinutes();

  // Check date range
  if (deal.validFrom) {
    const validFrom = new Date(deal.validFrom);
    if (today < validFrom) return false;
  }
  if (deal.validUntil) {
    const validUntil = new Date(deal.validUntil);
    if (today > validUntil) return false;
  }

  // Check day of week
  if (deal.dayOfWeek !== null && deal.dayOfWeek !== undefined) {
    const dayOfWeek = today.getDay();
    if (dayOfWeek !== deal.dayOfWeek) return false;
  }

  // Check time range
  if (deal.startTime && deal.endTime) {
    const startTime = parseTime(deal.startTime);
    const endTime = parseTime(deal.endTime);
    if (currentTime < startTime || currentTime > endTime) return false;
  }

  return true;
};

// Helper function to parse time string (HH:MM:SS) to minutes
const parseTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  return parseInt(hours) * 100 + parseInt(minutes);
};

// @route   GET /api/deals/today
// @desc    Get today's active deals
// @access  Public
exports.getTodayDeals = async (req, res) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    const deals = await Deal.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { dayOfWeek: dayOfWeek },
          { dayOfWeek: null } // Daily deals
        ],
        [Op.or]: [
          { validFrom: null },
          { validFrom: { [Op.lte]: today } }
        ],
        [Op.or]: [
          { validUntil: null },
          { validUntil: { [Op.gte]: today } }
        ]
      },
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'images', 'neighborhood', 'address', 'phone']
        }
      ],
      order: [['featured', 'DESC'], ['createdAt', 'DESC']]
    });

    // Filter deals by current time if they have time restrictions
    const validDeals = deals.filter(deal => {
      if (!deal.startTime || !deal.endTime) return true;
      return isDealValid(deal);
    });

    res.json({
      success: true,
      data: validDeals
    });
  } catch (error) {
    console.error('Error fetching today\'s deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching today\'s deals',
      error: error.message
    });
  }
};

// @route   GET /api/deals/this-week
// @desc    Get this week's deals
// @access  Public
exports.getThisWeekDeals = async (req, res) => {
  try {
    const today = new Date();
    const weekFromNow = new Date(today);
    weekFromNow.setDate(today.getDate() + 7);

    const deals = await Deal.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { validFrom: null },
          { validFrom: { [Op.lte]: weekFromNow } }
        ],
        [Op.or]: [
          { validUntil: null },
          { validUntil: { [Op.gte]: today } }
        ]
      },
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'images', 'neighborhood', 'address', 'phone']
        }
      ],
      order: [['featured', 'DESC'], ['dayOfWeek', 'ASC'], ['startTime', 'ASC']]
    });

    res.json({
      success: true,
      data: deals
    });
  } catch (error) {
    console.error('Error fetching this week\'s deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching this week\'s deals',
      error: error.message
    });
  }
};

// @route   GET /api/restaurants/:restaurantId/deals
// @desc    Get deals for a specific restaurant
// @access  Public
exports.getRestaurantDeals = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    const deals = await Deal.findAll({
      where: {
        restaurantId,
        isActive: true
      },
      order: [['featured', 'DESC'], ['dayOfWeek', 'ASC'], ['startTime', 'ASC']]
    });

    res.json({
      success: true,
      data: deals
    });
  } catch (error) {
    console.error('Error fetching restaurant deals:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant deals',
      error: error.message
    });
  }
};

// @route   POST /api/deals
// @desc    Create a new deal
// @access  Private (Restaurant owners)
exports.createDeal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      discount,
      dayOfWeek,
      startTime,
      endTime,
      validFrom,
      validUntil,
      restaurantId
    } = req.body;

    const userId = req.user.id;

    // Verify user owns the restaurant
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (restaurant.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create deals for this restaurant'
      });
    }

    const deal = await Deal.create({
      title,
      description,
      discount,
      dayOfWeek: dayOfWeek !== undefined ? parseInt(dayOfWeek) : null,
      startTime,
      endTime,
      validFrom,
      validUntil,
      restaurantId
    });

    const dealWithRestaurant = await Deal.findByPk(deal.id, {
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'images', 'neighborhood']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: dealWithRestaurant
    });
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating deal',
      error: error.message
    });
  }
};

// @route   PUT /api/deals/:id
// @desc    Update a deal
// @access  Private (Restaurant owners)
exports.updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deal = await Deal.findByPk(id, {
      include: [
        {
          model: Restaurant,
          as: 'restaurant'
        }
      ]
    });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    if (deal.restaurant.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this deal'
      });
    }

    const {
      title,
      description,
      discount,
      dayOfWeek,
      startTime,
      endTime,
      validFrom,
      validUntil,
      isActive
    } = req.body;

    if (title !== undefined) deal.title = title;
    if (description !== undefined) deal.description = description;
    if (discount !== undefined) deal.discount = discount;
    if (dayOfWeek !== undefined) deal.dayOfWeek = dayOfWeek !== null ? parseInt(dayOfWeek) : null;
    if (startTime !== undefined) deal.startTime = startTime;
    if (endTime !== undefined) deal.endTime = endTime;
    if (validFrom !== undefined) deal.validFrom = validFrom;
    if (validUntil !== undefined) deal.validUntil = validUntil;
    if (isActive !== undefined) deal.isActive = isActive;

    await deal.save();

    res.json({
      success: true,
      data: deal
    });
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating deal',
      error: error.message
    });
  }
};

// @route   DELETE /api/deals/:id
// @desc    Delete a deal
// @access  Private (Restaurant owners)
exports.deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deal = await Deal.findByPk(id, {
      include: [
        {
          model: Restaurant,
          as: 'restaurant'
        }
      ]
    });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    if (deal.restaurant.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this deal'
      });
    }

    await deal.destroy();

    res.json({
      success: true,
      message: 'Deal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting deal',
      error: error.message
    });
  }
};


