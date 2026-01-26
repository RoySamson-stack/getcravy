const Restaurant = require('../models/Restaurant');
const { sequelize } = require('./database');
// Load associations
require('../models/associations');

const seedRestaurants = async () => {
  try {
    console.log('🌱 Seeding restaurants...');

    const restaurants = [
      {
        name: 'Delicious Bistro',
        description: 'Authentic Italian cuisine with a modern twist. Family-owned since 1985.',
        category: 'Italian',
        rating: 4.8,
        totalReviews: 245,
        deliveryTime: '20-30 min',
        priceRange: '$$',
        address: '123 Main St, Westlands',
        city: 'Nairobi',
        neighborhood: 'Westlands',
        latitude: -1.2620,
        longitude: 36.8019,
        phone: '+254712345678',
        hours: {
          monday: '11:00 - 22:00',
          tuesday: '11:00 - 22:00',
          wednesday: '11:00 - 22:00',
          thursday: '11:00 - 22:00',
          friday: '11:00 - 23:00',
          saturday: '10:00 - 23:00',
          sunday: '10:00 - 22:00'
        },
        featured: true,
        images: []
      },
      {
        name: 'Taco Heaven',
        description: 'Best Mexican food in Nairobi. Fresh ingredients, authentic flavors.',
        category: 'Mexican',
        rating: 4.5,
        totalReviews: 189,
        deliveryTime: '15-25 min',
        priceRange: '$',
        address: '456 Park Road, Kilimani',
        city: 'Nairobi',
        neighborhood: 'Kilimani',
        latitude: -1.2800,
        longitude: 36.7800,
        phone: '+254712345679',
        featured: true,
        images: []
      },
      {
        name: 'Sushi Express',
        description: 'Fresh sushi and Japanese cuisine. Fast service, great quality.',
        category: 'Japanese',
        rating: 4.7,
        totalReviews: 312,
        deliveryTime: '25-35 min',
        priceRange: '$$$',
        address: '789 Business Park, Karen',
        city: 'Nairobi',
        neighborhood: 'Karen',
        latitude: -1.3200,
        longitude: 36.7000,
        phone: '+254712345680',
        featured: true,
        images: []
      },
      {
        name: 'Burger Joint',
        description: 'Gourmet burgers made with local ingredients. Juicy, flavorful, satisfying.',
        category: 'American',
        rating: 4.4,
        totalReviews: 156,
        deliveryTime: '10-20 min',
        priceRange: '$',
        address: '321 Mombasa Road, Industrial Area',
        city: 'Nairobi',
        neighborhood: 'Industrial Area',
        latitude: -1.3000,
        longitude: 36.8200,
        phone: '+254712345681',
        featured: false,
        images: []
      },
      {
        name: 'Curry House',
        description: 'Authentic Indian curries and tandoori dishes. Spicy and flavorful.',
        category: 'Indian',
        rating: 4.6,
        totalReviews: 278,
        deliveryTime: '30-40 min',
        priceRange: '$$',
        address: '654 Ring Road, Lavington',
        city: 'Nairobi',
        neighborhood: 'Lavington',
        latitude: -1.2700,
        longitude: 36.7900,
        phone: '+254712345682',
        featured: false,
        images: []
      },
      {
        name: 'Pho Corner',
        description: 'Traditional Vietnamese pho and spring rolls. Fresh and healthy.',
        category: 'Vietnamese',
        rating: 4.3,
        totalReviews: 134,
        deliveryTime: '20-30 min',
        priceRange: '$',
        address: '987 Ngong Road, Kileleshwa',
        city: 'Nairobi',
        neighborhood: 'Kileleshwa',
        latitude: -1.2900,
        longitude: 36.7700,
        phone: '+254712345683',
        featured: false,
        images: []
      }
    ];

    // Check if restaurants already exist
    const existingCount = await Restaurant.count();
    if (existingCount > 0) {
      console.log('⚠️  Restaurants already exist, skipping seed');
      return;
    }

    await Restaurant.bulkCreate(restaurants);
    console.log(`✅ Seeded ${restaurants.length} restaurants successfully!`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
};

// Run seed if called directly
if (require.main === module) {
  seedRestaurants()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedRestaurants };

