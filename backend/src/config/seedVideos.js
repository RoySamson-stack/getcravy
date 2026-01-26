require('dotenv').config();
const { sequelize } = require('../config/database');

// Load all models and associations
require('../models/User');
require('../models/Restaurant');
require('../models/MenuItem');
require('../models/Video');
require('../models/associations');

const { Video, User, Restaurant } = require('../models/associations');

const seedVideos = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Get first user and restaurant for seeding
    const user = await User.findOne();
    const restaurant = await Restaurant.findOne();

    if (!user) {
      console.error('❌ No users found. Please seed users first.');
      process.exit(1);
    }

    if (!restaurant) {
      console.error('❌ No restaurants found. Please seed restaurants first.');
      process.exit(1);
    }

    // Sample videos data
    const videosData = [
      {
        userId: user.id,
        restaurantId: restaurant.id,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://via.placeholder.com/300x500',
        title: 'Amazing Nyama Choma',
        description: 'Best grilled goat meat in Nairobi!',
        dishName: 'Grilled Goat Meat',
        location: 'Westlands, Nairobi',
        feedType: 'for_you',
        likesCount: 1234,
        commentsCount: 89,
        sharesCount: 45,
        viewsCount: 5678,
      },
      {
        userId: user.id,
        restaurantId: restaurant.id,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://via.placeholder.com/300x500',
        title: 'Coastal Pilau Delight',
        description: 'Authentic coastal pilau recipe',
        dishName: 'Coastal Pilau',
        location: 'Mombasa Road',
        feedType: 'for_you',
        likesCount: 2345,
        commentsCount: 156,
        sharesCount: 78,
        viewsCount: 8901,
      },
      {
        userId: user.id,
        restaurantId: restaurant.id,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://via.placeholder.com/300x500',
        title: 'Traditional Ugali & Sukuma',
        description: 'Classic Kenyan comfort food',
        dishName: 'Traditional Ugali & Sukuma',
        location: 'Kibera, Nairobi',
        feedType: 'for_you',
        likesCount: 890,
        commentsCount: 34,
        sharesCount: 12,
        viewsCount: 2345,
      },
    ];

    // Clear existing videos
    await Video.destroy({ where: {} });
    console.log('🗑️  Cleared existing videos.');

    // Create videos
    for (const videoData of videosData) {
      await Video.create(videoData);
    }

    console.log(`✅ Successfully seeded ${videosData.length} videos.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding videos:', error);
    process.exit(1);
  }
};

seedVideos();

