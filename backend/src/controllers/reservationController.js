const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Import Sequelize for associations
const { sequelize } = require('../config/database');

// @route   POST /api/restaurants/:restaurantId/reservations
// @desc    Create reservation
// @access  Private
exports.createReservation = async (req, res) => {
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
    const { date, time, partySize, specialRequests } = req.body;

    // Check if restaurant exists
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check for conflicting reservations (simple check)
    const reservationDate = new Date(date);
    const existingReservation = await Reservation.findOne({
      where: {
        restaurantId,
        date: {
          [Op.between]: [
            new Date(reservationDate.setHours(0, 0, 0, 0)),
            new Date(reservationDate.setHours(23, 59, 59, 999))
          ]
        },
        time,
        status: {
          [Op.in]: ['pending', 'confirmed']
        }
      }
    });

    // Simple availability check (in production, use proper table management)
    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked. Please choose another time.'
      });
    }

    const reservation = await Reservation.create({
      userId: req.user.id,
      restaurantId,
      date: new Date(date),
      time,
      partySize: parseInt(partySize),
      specialRequests: specialRequests || null,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: { reservation }
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   GET /api/reservations
// @desc    Get user's reservations
// @access  Private
exports.getUserReservations = async (req, res) => {
  try {
    const { status, upcoming } = req.query;

    const where = { userId: req.user.id };
    
    if (status) {
      where.status = status;
    }
    if (upcoming === 'true') {
      where.date = { [Op.gte]: new Date() };
    }

    const reservations = await Reservation.findAll({
      where,
      include: [{
        model: Restaurant,
        as: 'restaurant',
        attributes: ['id', 'name', 'address', 'phone', 'images']
      }],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    res.json({
      success: true,
      data: { reservations }
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   GET /api/restaurants/:restaurantId/reservations/availability
// @desc    Get available time slots for a date
// @access  Public
exports.getAvailability = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const reservationDate = new Date(date);
    const startOfDay = new Date(reservationDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(reservationDate.setHours(23, 59, 59, 999));

    // Get all reservations for this date
    const reservations = await Reservation.findAll({
      where: {
        restaurantId,
        date: {
          [Op.between]: [startOfDay, endOfDay]
        },
        status: {
          [Op.in]: ['pending', 'confirmed']
        }
      }
    });

    // Generate available time slots (11am to 10pm, every 30 minutes)
    const availableSlots = [];
    const bookedSlots = reservations.map(r => r.time);

    for (let hour = 11; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (!bookedSlots.includes(timeString)) {
          availableSlots.push(timeString);
        }
      }
    }

    res.json({
      success: true,
      data: {
        date,
        availableSlots,
        bookedSlots: bookedSlots.length
      }
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   PUT /api/reservations/:id
// @desc    Update reservation
// @access  Private
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check if user owns the reservation
    if (reservation.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this reservation'
      });
    }

    await reservation.update(req.body);

    res.json({
      success: true,
      message: 'Reservation updated successfully',
      data: { reservation }
    });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   DELETE /api/reservations/:id
// @desc    Cancel reservation
// @access  Private
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check if user owns the reservation
    if (reservation.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this reservation'
      });
    }

    await reservation.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

