const { Restaurant, MenuItem, Event, EventAttendee, Deal, Review, Reservation, Video, VideoLike, VideoComment, User, Order, OrderItem, Payment } = require('../models/associations');
const { Op } = require('sequelize');

// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalRestaurants, totalEvents, totalDeals, totalUsers, totalReviews, totalReservations, totalOrders, reservations, orders] = await Promise.all([
      Restaurant.count(),
      Event.count({ where: { isActive: true } }),
      Deal.count({ where: { isActive: true } }),
      User.count(),
      Review.count(),
      Reservation.count(),
      Order.count(),
      Reservation.findAll({
        include: [
          { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] }
        ]
      }),
      Order.findAll({
        include: [
          { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
          { model: Payment, as: 'payment', attributes: ['status', 'amount', 'method', 'paidAt'] }
        ]
      })
    ]);

    const todayEvents = await Event.count({
      where: {
        isActive: true,
        date: new Date().toISOString().split('T')[0]
      }
    });

    const recentRestaurants = await Restaurant.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    const recentEvents = await Event.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    const reservationSummary = {
      pendingReservations: 0,
      confirmedReservations: 0,
      completedReservations: 0,
      totalReservedGuests: 0
    };

    const reservationPerformance = new Map();
    for (const reservation of reservations) {
      const restaurantId = reservation.restaurantId;
      const entry = reservationPerformance.get(restaurantId) || {
        restaurantId,
        restaurantName: reservation.restaurant?.name || 'Unknown',
        reservationCount: 0,
        reservedGuests: 0,
        totalRevenue: 0,
        paidOrders: 0,
        averageOrderValue: 0
      };

      entry.reservationCount += 1;
      entry.reservedGuests += reservation.partySize || 0;
      reservationPerformance.set(restaurantId, entry);

      if (reservation.status === 'pending') reservationSummary.pendingReservations += 1;
      if (reservation.status === 'confirmed') reservationSummary.confirmedReservations += 1;
      if (reservation.status === 'completed') reservationSummary.completedReservations += 1;
      if (['pending', 'confirmed', 'completed'].includes(reservation.status)) {
        reservationSummary.totalReservedGuests += reservation.partySize || 0;
      }
    }

    const now = new Date().toISOString().split('T')[0];
    const financial = {
      totalRevenue: 0,
      paidRevenue: 0,
      pendingRevenue: 0,
      paidOrders: 0,
      ...reservationSummary,
      topPerformingRestaurants: []
    };

    for (const order of orders) {
      const orderTotal = Number(order.total || 0);
      const paymentStatus = order.payment?.status || order.paymentStatus;

      financial.totalRevenue += orderTotal;
      if (paymentStatus === 'paid') {
        financial.paidRevenue += orderTotal;
        financial.paidOrders += 1;
      } else if (paymentStatus === 'pending') {
        financial.pendingRevenue += orderTotal;
      }

      if (order.restaurantId) {
        const entry = reservationPerformance.get(order.restaurantId) || {
          restaurantId: order.restaurantId,
          restaurantName: order.restaurant?.name || 'Unknown',
          reservationCount: 0,
          reservedGuests: 0,
          totalRevenue: 0,
          paidOrders: 0,
          averageOrderValue: 0
        };

        entry.totalRevenue += orderTotal;
        if (paymentStatus === 'paid') {
          entry.paidOrders += 1;
        }
        entry.averageOrderValue = entry.paidOrders > 0
          ? Number((entry.totalRevenue / entry.paidOrders).toFixed(2))
          : Number(entry.totalRevenue.toFixed(2));

        reservationPerformance.set(order.restaurantId, entry);
      }
    }

    financial.topPerformingRestaurants = Array.from(reservationPerformance.values())
      .sort((a, b) => {
        if (b.totalRevenue !== a.totalRevenue) {
          return b.totalRevenue - a.totalRevenue;
        }
        return b.reservedGuests - a.reservedGuests;
      })
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        stats: {
          totalRestaurants,
          totalEvents,
          totalDeals,
          totalUsers,
          totalReviews,
          totalReservations,
          totalOrders,
          todayEvents
        },
        financial,
        recentRestaurants,
        recentEvents
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Restaurant CRUD
exports.getRestaurants = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, city, featured, isActive } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (category) where.category = category;
    if (city) where.city = city;
    if (featured) where.featured = featured === 'true';
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const { count, rows } = await Restaurant.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
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
    console.error('Admin get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: { restaurant }
    });
  } catch (error) {
    console.error('Admin create restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

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

    await restaurant.update(req.body);

    res.json({
      success: true,
      message: 'Restaurant updated successfully',
      data: { restaurant }
    });
  } catch (error) {
    console.error('Admin update restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

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

    await restaurant.destroy();

    res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Event CRUD
exports.getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) where.title = { [Op.iLike]: `%${search}%` };
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const { count, rows } = await Event.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'ASC']],
      include: [
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] }
      ]
    });

    res.json({
      success: true,
      data: {
        events: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      userId: req.body.userId || req.user.id
    });
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Admin create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.update(req.body);

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Admin update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.destroy();

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Deal CRUD
exports.getDeals = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) where.title = { [Op.iLike]: `%${search}%` };
    if (isActive !== undefined) where.isAvailable = isActive === 'true';

    const { count, rows } = await Deal.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] }
      ]
    });

    res.json({
      success: true,
      data: {
        deals: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin get deals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.createDeal = async (req, res) => {
  try {
    const deal = await Deal.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Deal created successfully',
      data: { deal }
    });
  } catch (error) {
    console.error('Admin create deal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByPk(id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    await deal.update(req.body);

    res.json({
      success: true,
      message: 'Deal updated successfully',
      data: { deal }
    });
  } catch (error) {
    console.error('Admin update deal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByPk(id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    await deal.destroy();

    res.json({
      success: true,
      message: 'Deal deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete deal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Menu Item CRUD
exports.getMenuItems = async (req, res) => {
  try {
    const { page = 1, limit = 50, restaurantId, search, isActive } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (restaurantId) where.restaurantId = restaurantId;
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const { count, rows } = await MenuItem.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']],
      include: [
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] }
      ]
    });

    res.json({
      success: true,
      data: {
        menuItems: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: { menuItem }
    });
  } catch (error) {
    console.error('Admin create menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findByPk(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    await menuItem.update(req.body);

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: { menuItem }
    });
  } catch (error) {
    console.error('Admin update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

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

    await menuItem.destroy();

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// User management
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (role) where.role = role;

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password, ...updateData } = req.body;
    await user.update(updateData);

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Admin update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Review management
exports.getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, restaurantId } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (restaurantId) where.restaurantId = restaurantId;

    const { count, rows } = await Review.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] }
      ]
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
    console.error('Admin get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

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

    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Reservation management
exports.getReservations = async (req, res) => {
  try {
    const { page = 1, limit = 20, restaurantId, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (restaurantId) where.restaurantId = restaurantId;
    if (status) where.status = status;

    const { count, rows } = await Reservation.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC'], ['time', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] }
      ]
    });

    res.json({
      success: true,
      data: {
        reservations: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin get reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, restaurantId, status, paymentStatus } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (restaurantId) where.restaurantId = restaurantId;
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const { count, rows } = await Order.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
        { model: OrderItem, as: 'items' },
        { model: Payment, as: 'payment', attributes: ['id', 'status', 'amount', 'method', 'paidAt'] }
      ]
    });

    res.json({
      success: true,
      data: {
        orders: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
