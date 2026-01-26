const { Event, EventAttendee, Restaurant, User } = require('../models/associations');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');

// @route   GET /api/events
// @desc    Get all events with filtering and pagination
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      eventType,
      dateFrom,
      dateTo,
      latitude,
      longitude,
      radius, // in kilometers
      featured,
      restaurantId,
      search,
      sortBy = 'date',
      sortOrder = 'ASC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { isActive: true };

    // Apply filters
    if (eventType) {
      where.eventType = eventType;
    }
    if (dateFrom) {
      where.date = { [Op.gte]: dateFrom };
    }
    if (dateTo) {
      where.date = { [Op.lte]: dateTo };
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (restaurantId) {
      where.restaurantId = restaurantId;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Location-based filtering
    let order = [];
    if (latitude && longitude && radius) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const rad = parseFloat(radius);

      // Calculate distance using Haversine formula
      const distanceQuery = Sequelize.literal(
        `6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude)))`
      );

      where.latitude = {
        [Op.between]: [
          lat - (rad / 111), // Rough conversion: 1 degree ≈ 111 km
          lat + (rad / 111)
        ]
      };
      where.longitude = {
        [Op.between]: [
          lng - (rad / (111 * Math.cos(lat * Math.PI / 180))),
          lng + (rad / (111 * Math.cos(lat * Math.PI / 180)))
        ]
      };

      order.push([distanceQuery, 'ASC']);
    }

    // Sorting
    if (sortBy === 'date') {
      order.push(['date', sortOrder]);
      order.push(['time', sortOrder]);
    } else if (sortBy === 'attendees') {
      order.push(['attendeesCount', 'DESC']);
    } else if (sortBy === 'price') {
      order.push(['price', sortOrder === 'ASC' ? 'ASC' : 'DESC']);
    }

    const { count, rows } = await Event.findAndCountAll({
      where,
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'images', 'neighborhood']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ],
      order: order.length > 0 ? order : [['date', 'ASC'], ['time', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Optional: get user ID if authenticated

    const event = await Event.findByPk(id, {
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'description', 'address', 'phone', 'email', 'website', 'images', 'neighborhood', 'latitude', 'longitude']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: EventAttendee,
          as: 'attendees',
          attributes: ['id', 'userId', 'status'],
          limit: 10 // Show first 10 attendees
        }
      ]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if current user is attending
    let userAttendance = null;
    if (userId) {
      userAttendance = await EventAttendee.findOne({
        where: { userId, eventId: id }
      });
    }

    res.json({
      success: true,
      data: {
        ...event.toJSON(),
        userAttendance: userAttendance ? { status: userAttendance.status } : null
      }
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
exports.createEvent = async (req, res) => {
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
      date,
      time,
      endTime,
      price,
      location,
      latitude,
      longitude,
      capacity,
      eventType,
      images,
      restaurantId
    } = req.body;

    const userId = req.user.id;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      endTime,
      price: price ? parseFloat(price) : null,
      location,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      capacity: capacity ? parseInt(capacity) : null,
      eventType: eventType || 'restaurant_event',
      images,
      restaurantId,
      userId
    });

    const eventWithRelations = await Event.findByPk(event.id, {
      include: [
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'images', 'neighborhood']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: eventWithRelations
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// @route   POST /api/events/:id/attend
// @desc    Mark event as going or interested
// @access  Private
exports.attendEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'going' or 'interested'
    const userId = req.user.id;

    if (!['going', 'interested'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be "going" or "interested"'
      });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user already has an attendance record
    let attendance = await EventAttendee.findOne({
      where: { userId, eventId: id }
    });

    if (attendance) {
      // Update existing attendance
      attendance.status = status;
      await attendance.save();
    } else {
      // Create new attendance
      attendance = await EventAttendee.create({
        userId,
        eventId: id,
        status
      });

      // Increment attendees count
      event.attendeesCount += 1;
      await event.save();
    }

    // Update attendees count based on "going" status
    const goingCount = await EventAttendee.count({
      where: { eventId: id, status: 'going' }
    });
    event.attendeesCount = goingCount;
    await event.save();

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Error attending event:', error);
    res.status(500).json({
      success: false,
      message: 'Error attending event',
      error: error.message
    });
  }
};

// @route   DELETE /api/events/:id/attend
// @desc    Remove attendance from event
// @access  Private
exports.removeAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const attendance = await EventAttendee.findOne({
      where: { userId, eventId: id }
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    await attendance.destroy();

    // Update attendees count
    const event = await Event.findByPk(id);
    if (event) {
      const goingCount = await EventAttendee.count({
        where: { eventId: id, status: 'going' }
      });
      event.attendeesCount = goingCount;
      await event.save();
    }

    res.json({
      success: true,
      message: 'Attendance removed successfully'
    });
  } catch (error) {
    console.error('Error removing attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing attendance',
      error: error.message
    });
  }
};

// @route   GET /api/events/:id/attendees
// @desc    Get event attendees
// @access  Public
exports.getEventAttendees = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 20,
      status
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { eventId: id };

    if (status) {
      where.status = status;
    }

    const { count, rows } = await EventAttendee.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching attendees:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendees',
      error: error.message
    });
  }
};


