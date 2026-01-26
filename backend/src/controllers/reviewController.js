const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// Import Sequelize for associations
const { sequelize } = require('../config/database');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// @route   GET /api/restaurants/:restaurantId/reviews
// @desc    Get reviews for a restaurant
// @access  Public
exports.getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await Review.findAndCountAll({
      where: { restaurantId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'profilePhoto']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.json({
      success: true,
      data: {
        reviews: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   POST /api/restaurants/:restaurantId/reviews
// @desc    Create review for restaurant
// @access  Private
exports.createReview = async (req, res) => {
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
    const { rating, comment, photos, foodRating, serviceRating, ambianceRating, valueRating, menuItemId } = req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check if user already reviewed this restaurant
    const existingReview = await Review.findOne({
      where: {
        userId: req.user.id,
        restaurantId
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this restaurant'
      });
    }

    const review = await Review.create({
      userId: req.user.id,
      restaurantId,
      menuItemId: menuItemId || null,
      rating,
      comment,
      photos: photos || [],
      foodRating,
      serviceRating,
      ambianceRating,
      valueRating
    });

    // Update restaurant rating
    await updateRestaurantRating(restaurantId);

    // If menu item review, update menu item rating
    if (menuItemId) {
      await updateMenuItemRating(menuItemId);
    }

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    await review.update(req.body);

    // Update restaurant rating
    if (review.restaurantId) {
      await updateRestaurantRating(review.restaurantId);
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const restaurantId = review.restaurantId;
    await review.destroy();

    // Update restaurant rating
    if (restaurantId) {
      await updateRestaurantRating(restaurantId);
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to update restaurant rating
const updateRestaurantRating = async (restaurantId) => {
  try {
    const reviews = await Review.findAll({
      where: { restaurantId },
      attributes: ['rating']
    });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      await Restaurant.update(
        {
          rating: averageRating.toFixed(2),
          totalReviews: reviews.length
        },
        { where: { id: restaurantId } }
      );
    }
  } catch (error) {
    console.error('Error updating restaurant rating:', error);
  }
};

// Helper function to update menu item rating
const updateMenuItemRating = async (menuItemId) => {
  try {
    const reviews = await Review.findAll({
      where: { menuItemId },
      attributes: ['rating']
    });

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      await MenuItem.update(
        {
          rating: averageRating.toFixed(2),
          totalReviews: reviews.length
        },
        { where: { id: menuItemId } }
      );
    }
  } catch (error) {
    console.error('Error updating menu item rating:', error);
  }
};

