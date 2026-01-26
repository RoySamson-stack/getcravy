const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
// Load associations
require('../models/associations');

const seedMenuItems = async () => {
  try {
    console.log('🌱 Seeding menu items...');

    // Get restaurants
    const restaurants = await Restaurant.findAll();
    if (restaurants.length === 0) {
      console.log('⚠️  No restaurants found. Please seed restaurants first.');
      return;
    }

    const menuItems = [];

    // Menu for first restaurant (Italian)
    if (restaurants[0]) {
      menuItems.push(
        {
          restaurantId: restaurants[0].id,
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
          story: 'A traditional Italian pizza named after Queen Margherita. Simple, fresh, and delicious.',
          price: 1299,
          category: 'Pizza',
          rating: 4.7,
          totalReviews: 45,
          spiceLevel: 0,
          dietaryTags: ['vegetarian'],
          isAvailable: true,
          isFeatured: true,
          preparationTime: 20
        },
        {
          restaurantId: restaurants[0].id,
          name: 'Pasta Carbonara',
          description: 'Spaghetti with creamy sauce, pancetta, and parmesan cheese',
          story: 'A Roman classic made with eggs, cheese, and cured pork. Rich and satisfying.',
          price: 1499,
          category: 'Pasta',
          rating: 4.5,
          totalReviews: 38,
          spiceLevel: 1,
          dietaryTags: [],
          isAvailable: true,
          isFeatured: true,
          preparationTime: 25
        },
        {
          restaurantId: restaurants[0].id,
          name: 'Tiramisu',
          description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
          story: 'Meaning "pick me up" in Italian, this dessert is a perfect end to any meal.',
          price: 799,
          category: 'Dessert',
          rating: 4.8,
          totalReviews: 52,
          spiceLevel: 0,
          dietaryTags: ['vegetarian'],
          isAvailable: true,
          isFeatured: false,
          preparationTime: 10
        },
        {
          restaurantId: restaurants[0].id,
          name: 'Bruschetta',
          description: 'Toasted bread topped with fresh tomatoes, garlic, and basil',
          story: 'A simple Italian appetizer that celebrates fresh, quality ingredients.',
          price: 699,
          category: 'Appetizer',
          rating: 4.3,
          totalReviews: 28,
          spiceLevel: 0,
          dietaryTags: ['vegetarian'],
          isAvailable: true,
          isFeatured: false,
          preparationTime: 15
        },
        {
          restaurantId: restaurants[0].id,
          name: 'Chicken Parmesan',
          description: 'Breaded chicken breast topped with marinara sauce and mozzarella',
          story: 'An Italian-American favorite, crispy on the outside, tender on the inside.',
          price: 1699,
          category: 'Main Course',
          rating: 4.6,
          totalReviews: 41,
          spiceLevel: 2,
          dietaryTags: [],
          isAvailable: true,
          isFeatured: true,
          preparationTime: 30
        }
      );
    }

    // Check if menu items already exist
    const existingCount = await MenuItem.count();
    if (existingCount > 0) {
      console.log('⚠️  Menu items already exist, skipping seed');
      return;
    }

    await MenuItem.bulkCreate(menuItems);
    console.log(`✅ Seeded ${menuItems.length} menu items successfully!`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
};

// Run seed if called directly
if (require.main === module) {
  seedMenuItems()
    .then(() => {
      console.log('✅ Menu seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Menu seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedMenuItems };

