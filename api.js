const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const os = require('os');
// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Function to get current IP address
function getCurrentIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost'; // fallback
}

const IP_ADDRESS = getCurrentIP();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  neighborhood: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String },
  priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], required: true },
  cuisine: { type: String, required: true },
  openingHours: { type: Object, required: true },
  featured: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

// Create indices
restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ name: 'text', description: 'text', cuisine: 'text' });

// Create models
const User = mongoose.model('User', userSchema);
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error();
    }
    
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Admin middleware
const adminAuth = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Admin access required' });
  }
  next();
};


//admin routes need to be added for the routing and also for the restaurnt admins

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    
    await user.save();
    
    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/logout', auth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Restaurant Routes
app.get('/api/restaurants', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const restaurants = await Restaurant.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await Restaurant.countDocuments();
    
    res.json({
      restaurants,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRestaurants: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/restaurants', auth, adminAuth, async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/restaurants/:id', auth, adminAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/restaurants/:id', auth, adminAuth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Location-based Routes
app.get('/api/locations/cities', async (req, res) => {
  try {
    const cities = await Restaurant.distinct('city');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/locations/neighborhoods', async (req, res) => {
  try {
    const { city } = req.query;
    const query = city ? { city } : {};
    
    const neighborhoods = await Restaurant.distinct('neighborhood', query);
    res.json(neighborhoods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search and Filter Routes
app.get('/api/restaurants/search', async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    const restaurants = await Restaurant.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Restaurant.countDocuments({ $text: { $search: query } });
    
    res.json({
      restaurants,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRestaurants: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/restaurants/filter', async (req, res) => {
  try {
    const { 
      city, neighborhood, cuisine, priceRange, 
      page = 1, limit = 10 
    } = req.query;
    
    const filter = {};
    
    if (city) filter.city = city;
    if (neighborhood) filter.neighborhood = neighborhood;
    if (cuisine) filter.cuisine = cuisine;
    if (priceRange) filter.priceRange = priceRange;
    
    const restaurants = await Restaurant.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await Restaurant.countDocuments(filter);
    
    res.json({
      restaurants,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRestaurants: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Special Features Routes
app.get('/api/restaurants/featured', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const restaurants = await Restaurant.find({ featured: true })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await Restaurant.countDocuments({ featured: true });
    
    res.json({
      restaurants,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRestaurants: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/restaurants/nearby', async (req, res) => {
  try {
    const { lat, lng, distance = 5, page = 1, limit = 10 } = req.query;
    
    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(distance) * 1000, // Convert to meters
        },
      },
    })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Restaurant.countDocuments({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(distance) * 1000,
        },
      },
    });
    
    res.json({
      restaurants,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRestaurants: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/restaurants/trending', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // We could define trending based on recent views, likes, etc.
    // For now, let's use likes as a simple metric
    const restaurants = await Restaurant.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ likes: -1, createdAt: -1 });
    
    const count = await Restaurant.countDocuments();
    
    res.json({
      restaurants,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRestaurants: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/restaurants/top-liked', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const restaurants = await Restaurant.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ likes: -1 });
    
    const count = await Restaurant.countDocuments();
    
    res.json({
      restaurants,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRestaurants: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/restaurants/:id/like', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Routes
app.get('/api/admin/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const totalRestaurants = await Restaurant.countDocuments();
    const totalUsers = await User.countDocuments();
    const featuredRestaurants = await Restaurant.countDocuments({ featured: true });
    
    // Most liked restaurants
    const topRestaurants = await Restaurant.find()
      .sort({ likes: -1 })
      .limit(5);
    
    // Recently added restaurants
    const recentRestaurants = await Restaurant.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // City distribution
    const cityDistribution = await Restaurant.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Cuisine distribution
    const cuisineDistribution = await Restaurant.aggregate([
      { $group: { _id: '$cuisine', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      stats: {
        totalRestaurants,
        totalUsers,
        featuredRestaurants,
      },
      topRestaurants,
      recentRestaurants,
      cityDistribution,
      cuisineDistribution,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get('/api/admin/restaurants', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;
    
    const restaurants = await Restaurant.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);
    
    const count = await Restaurant.countDocuments();
    
    res.json({
      restaurants,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRestaurants: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users', auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const users = await User.find()
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await User.countDocuments();
    
    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server running on http://${IP_ADDRESS}:${PORT}`);
});