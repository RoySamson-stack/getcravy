const { Deal, Restaurant } = require('../models/associations');
const { sequelize } = require('./database');

const seedDeals = async () => {
  try {
    console.log('🌱 Seeding deals...');

    const restaurants = await Restaurant.findAll({ limit: 20 });

    if (restaurants.length === 0) {
      console.log('⚠️  No restaurants found. Please seed restaurants first.');
      return;
    }

    const deals = [
      // Daily deals
      {
        title: 'Happy Hour',
        description: '50% off all cocktails and appetizers',
        discount: '50% off',
        dayOfWeek: null, // Daily
        startTime: '17:00:00',
        endTime: '19:00:00',
        restaurantId: restaurants[0].id,
        featured: true
      },
      {
        title: 'Lunch Special',
        description: 'Buy one main, get one free',
        discount: 'Buy 1 Get 1 Free',
        dayOfWeek: null,
        startTime: '12:00:00',
        endTime: '15:00:00',
        restaurantId: restaurants[1]?.id || restaurants[0].id,
        featured: true
      },
      // Day-specific deals
      {
        title: 'Taco Tuesday',
        description: 'All tacos 50% off every Tuesday',
        discount: '50% off',
        dayOfWeek: 2, // Tuesday
        startTime: '11:00:00',
        endTime: '22:00:00',
        restaurantId: restaurants[2]?.id || restaurants[0].id
      },
      {
        title: 'Wine Wednesday',
        description: 'Half price on all wine bottles',
        discount: '50% off',
        dayOfWeek: 3, // Wednesday
        startTime: '17:00:00',
        endTime: '23:00:00',
        restaurantId: restaurants[0].id,
        featured: true
      },
      {
        title: 'Thirsty Thursday',
        description: '2-for-1 on all beers',
        discount: 'Buy 1 Get 1 Free',
        dayOfWeek: 4, // Thursday
        startTime: '17:00:00',
        endTime: '23:00:00',
        restaurantId: restaurants[3]?.id || restaurants[0].id
      },
      {
        title: 'Friday Night Special',
        description: '20% off entire bill',
        discount: '20% off',
        dayOfWeek: 5, // Friday
        startTime: '18:00:00',
        endTime: '23:00:00',
        restaurantId: restaurants[4]?.id || restaurants[0].id,
        featured: true
      },
      {
        title: 'Sunday Brunch Deal',
        description: 'Kids eat free with adult meal',
        discount: 'Kids Free',
        dayOfWeek: 0, // Sunday
        startTime: '10:00:00',
        endTime: '15:00:00',
        restaurantId: restaurants[5]?.id || restaurants[0].id
      },
      {
        title: 'Student Discount',
        description: '20% off with valid student ID',
        discount: '20% off',
        dayOfWeek: null,
        startTime: null,
        endTime: null,
        restaurantId: restaurants[6]?.id || restaurants[0].id
      },
      {
        title: 'Early Bird Special',
        description: '15% off dinner before 7 PM',
        discount: '15% off',
        dayOfWeek: null,
        startTime: '17:00:00',
        endTime: '19:00:00',
        restaurantId: restaurants[7]?.id || restaurants[0].id
      },
      {
        title: 'Ladies\' Night',
        description: 'Free drinks for ladies every Thursday',
        discount: 'Free Drinks',
        dayOfWeek: 4, // Thursday
        startTime: '18:00:00',
        endTime: '23:00:00',
        restaurantId: restaurants[8]?.id || restaurants[0].id,
        featured: true
      }
    ];

    // Generate more deals for remaining restaurants
    const dealTemplates = [
      { title: 'Weekend Special', discount: '25% off', dayOfWeek: 6 },
      { title: 'Monday Madness', discount: '30% off', dayOfWeek: 1 },
      { title: 'Breakfast Deal', discount: 'KES 500 off', dayOfWeek: null, startTime: '08:00:00', endTime: '11:00:00' },
      { title: 'Dinner Deal', discount: 'Buy 2 Get 1 Free', dayOfWeek: null, startTime: '18:00:00', endTime: '22:00:00' },
      { title: 'Dessert Special', discount: 'Free dessert', dayOfWeek: null, startTime: '20:00:00', endTime: '23:00:00' }
    ];

    for (let i = deals.length; i < restaurants.length && i < 25; i++) {
      const restaurant = restaurants[i];
      const template = dealTemplates[Math.floor(Math.random() * dealTemplates.length)];
      
      deals.push({
        title: template.title,
        description: `Special ${template.title.toLowerCase()} at ${restaurant.name}`,
        discount: template.discount,
        dayOfWeek: template.dayOfWeek,
        startTime: template.startTime || null,
        endTime: template.endTime || null,
        restaurantId: restaurant.id
      });
    }

    // Create deals
    for (const dealData of deals) {
      try {
        await Deal.create(dealData);
      } catch (error) {
        console.error(`Error creating deal "${dealData.title}":`, error.message);
      }
    }

    const dealCount = await Deal.count();
    console.log(`✅ Seeded ${dealCount} deals`);

  } catch (error) {
    console.error('❌ Error seeding deals:', error);
    throw error;
  }
};

module.exports = seedDeals;

// Run if called directly
if (require.main === module) {
  seedDeals()
    .then(() => {
      console.log('✅ Deals seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Deals seeding failed:', error);
      process.exit(1);
    });
}



