const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Load all models and associations before routes
require('./models/User');
require('./models/Restaurant');
require('./models/MenuItem');
require('./models/Review');
require('./models/Reservation');
require('./models/Video');
require('./models/VideoLike');
require('./models/VideoComment');
require('./models/Event');
require('./models/EventAttendee');
require('./models/Deal');
require('./models/associations');

const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const videoRoutes = require('./routes/videoRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dealRoutes = require('./routes/dealRoutes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
// Allow requests from Expo Go and localhost
app.use(cors({
  origin: process.env.CORS_ORIGIN || true, // Allow all origins in development
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'GoEat API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/deals', dealRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  // Test database connection
  const dbConnected = await testConnection();
  
  if (!dbConnected && process.env.NODE_ENV === 'production') {
    console.error('❌ Cannot start server without database connection');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    if (!dbConnected) {
      console.log('⚠️  Database not connected - some features may not work');
    }
  });
};

startServer();

module.exports = app;

