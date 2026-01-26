const { Event, Restaurant, User } = require('../models/associations');
const { sequelize } = require('./database');

const seedEvents = async () => {
  try {
    console.log('🌱 Seeding events...');

    // Get restaurants and users
    const restaurants = await Restaurant.findAll({ limit: 20 });
    const users = await User.findAll({ limit: 5 });

    if (restaurants.length === 0) {
      console.log('⚠️  No restaurants found. Please seed restaurants first.');
      return;
    }

    if (users.length === 0) {
      console.log('⚠️  No users found. Please seed users first.');
      return;
    }

    // Helper to get random date in next 30 days
    const getRandomFutureDate = () => {
      const today = new Date();
      const daysAhead = Math.floor(Math.random() * 30) + 1;
      const date = new Date(today);
      date.setDate(today.getDate() + daysAhead);
      return date.toISOString().split('T')[0];
    };

    // Helper to get random time
    const getRandomTime = () => {
      const hours = Math.floor(Math.random() * 12) + 12; // 12:00 - 23:00
      const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    };

    const eventTypes = ['restaurant_event', 'festival', 'popup', 'special', 'entertainment'];
    const neighborhoods = ['Westlands', 'Kilimani', 'CBD', 'Karen', 'Lavington', 'Parklands'];

    const events = [
      // Restaurant Events
      {
        title: 'Wine Tasting Evening',
        description: 'Join us for an exclusive wine tasting experience featuring wines from South Africa and Kenya. Includes cheese platter and expert sommelier guidance.',
        date: getRandomFutureDate(),
        time: '18:00:00',
        endTime: '21:00:00',
        price: 2500,
        location: restaurants[0].address || '123 Main St, Westlands',
        latitude: restaurants[0].latitude,
        longitude: restaurants[0].longitude,
        capacity: 30,
        eventType: 'restaurant_event',
        restaurantId: restaurants[0].id,
        userId: users[0].id,
        featured: true
      },
      {
        title: 'Chef\'s Table Experience',
        description: 'Intimate 8-course tasting menu prepared by our head chef. Limited to 12 guests per evening.',
        date: getRandomFutureDate(),
        time: '19:00:00',
        endTime: '22:30:00',
        price: 5000,
        location: restaurants[1]?.address || '456 Park Road, Kilimani',
        latitude: restaurants[1]?.latitude,
        longitude: restaurants[1]?.longitude,
        capacity: 12,
        eventType: 'restaurant_event',
        restaurantId: restaurants[1]?.id,
        userId: users[0].id,
        featured: true
      },
      {
        title: 'Live Music & Dinner',
        description: 'Enjoy live acoustic music while dining. Local artists performing every Friday night.',
        date: getRandomFutureDate(),
        time: '19:30:00',
        endTime: '23:00:00',
        price: null, // Free
        location: restaurants[2]?.address || '789 Street Ave, CBD',
        latitude: restaurants[2]?.latitude,
        longitude: restaurants[2]?.longitude,
        capacity: 50,
        eventType: 'entertainment',
        restaurantId: restaurants[2]?.id,
        userId: users[1]?.id || users[0].id
      },
      {
        title: 'Themed Dinner: Italian Night',
        description: 'Special Italian-themed menu with traditional dishes. Live cooking demonstrations included.',
        date: getRandomFutureDate(),
        time: '18:00:00',
        endTime: '22:00:00',
        price: 3500,
        location: restaurants[0].address || '123 Main St, Westlands',
        latitude: restaurants[0].latitude,
        longitude: restaurants[0].longitude,
        capacity: 40,
        eventType: 'restaurant_event',
        restaurantId: restaurants[0].id,
        userId: users[0].id
      },
      // Festivals
      {
        title: 'Nairobi Food Festival',
        description: 'Annual food festival featuring 50+ vendors, live cooking demos, and food competitions.',
        date: getRandomFutureDate(),
        time: '10:00:00',
        endTime: '20:00:00',
        price: 500,
        location: 'Uhuru Park, Nairobi',
        latitude: -1.2921,
        longitude: 36.8219,
        capacity: 1000,
        eventType: 'festival',
        restaurantId: null,
        userId: users[0].id,
        featured: true
      },
      {
        title: 'Street Food Saturdays',
        description: 'Monthly street food market featuring the best food trucks and vendors in Nairobi.',
        date: getRandomFutureDate(),
        time: '12:00:00',
        endTime: '18:00:00',
        price: null,
        location: 'Karura Forest, Nairobi',
        latitude: -1.2500,
        longitude: 36.8000,
        capacity: 500,
        eventType: 'festival',
        restaurantId: null,
        userId: users[0].id
      },
      // Pop-ups
      {
        title: 'Sushi Pop-up',
        description: 'Limited-time sushi pop-up featuring fresh fish flown in daily. Only this weekend!',
        date: getRandomFutureDate(),
        time: '17:00:00',
        endTime: '22:00:00',
        price: 4000,
        location: restaurants[3]?.address || '321 Garden Road, Karen',
        latitude: restaurants[3]?.latitude,
        longitude: restaurants[3]?.longitude,
        capacity: 25,
        eventType: 'popup',
        restaurantId: restaurants[3]?.id,
        userId: users[1]?.id || users[0].id,
        featured: true
      },
      {
        title: 'BBQ Night Pop-up',
        description: 'Authentic Kenyan nyama choma experience with live grilling and traditional sides.',
        date: getRandomFutureDate(),
        time: '18:00:00',
        endTime: '23:00:00',
        price: 2000,
        location: restaurants[4]?.address || '654 Valley Road, Lavington',
        latitude: restaurants[4]?.latitude,
        longitude: restaurants[4]?.longitude,
        capacity: 60,
        eventType: 'popup',
        restaurantId: restaurants[4]?.id,
        userId: users[1]?.id || users[0].id
      },
      // Specials
      {
        title: 'Ladies\' Night',
        description: 'Special menu and drinks for ladies. 20% off all cocktails and appetizers.',
        date: getRandomFutureDate(),
        time: '18:00:00',
        endTime: '23:00:00',
        price: null,
        location: restaurants[5]?.address || '987 Mall Road, Parklands',
        latitude: restaurants[5]?.latitude,
        longitude: restaurants[5]?.longitude,
        capacity: 80,
        eventType: 'special',
        restaurantId: restaurants[5]?.id,
        userId: users[2]?.id || users[0].id
      },
      {
        title: 'Sunday Brunch Special',
        description: 'All-you-can-eat brunch buffet with live jazz music. Kids eat free!',
        date: getRandomFutureDate(),
        time: '10:00:00',
        endTime: '15:00:00',
        price: 2500,
        location: restaurants[0].address || '123 Main St, Westlands',
        latitude: restaurants[0].latitude,
        longitude: restaurants[0].longitude,
        capacity: 100,
        eventType: 'special',
        restaurantId: restaurants[0].id,
        userId: users[0].id
      },
      {
        title: 'Comedy Night',
        description: 'Stand-up comedy night featuring local comedians. Dinner and show package available.',
        date: getRandomFutureDate(),
        time: '20:00:00',
        endTime: '23:00:00',
        price: 1500,
        location: restaurants[1]?.address || '456 Park Road, Kilimani',
        latitude: restaurants[1]?.latitude,
        longitude: restaurants[1]?.longitude,
        capacity: 70,
        eventType: 'entertainment',
        restaurantId: restaurants[1]?.id,
        userId: users[1]?.id || users[0].id
      },
      {
        title: 'Sports Viewing Party',
        description: 'Watch the big game on our giant screens. Special game day menu and drinks.',
        date: getRandomFutureDate(),
        time: '15:00:00',
        endTime: '19:00:00',
        price: null,
        location: restaurants[2]?.address || '789 Street Ave, CBD',
        latitude: restaurants[2]?.latitude,
        longitude: restaurants[2]?.longitude,
        capacity: 120,
        eventType: 'entertainment',
        restaurantId: restaurants[2]?.id,
        userId: users[2]?.id || users[0].id
      }
    ];

    // Generate more events to reach 30-40 total
    for (let i = events.length; i < 35; i++) {
      const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      const titles = [
        'Wine & Dine Evening',
        'Cooking Class: Pasta Making',
        'Karaoke Night',
        'Trivia Night',
        'Date Night Special',
        'Family Fun Day',
        'Happy Hour Extended',
        'Taco Tuesday',
        'Pizza Night',
        'Dessert Tasting',
        'Beer Tasting',
        'Cocktail Masterclass',
        'Breakfast Club',
        'Lunch Special',
        'Dinner & Movie',
        'Acoustic Sessions',
        'DJ Night',
        'Cultural Food Night',
        'Vegan Pop-up',
        'Seafood Special'
      ];

      const descriptions = [
        'Join us for a special evening',
        'Experience something unique',
        'Limited time offer',
        'Don\'t miss out on this exclusive event',
        'Perfect for food lovers',
        'Great atmosphere and delicious food',
        'Something for everyone'
      ];

      events.push({
        title: titles[Math.floor(Math.random() * titles.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)] + '. ' + 
                     'Come and enjoy great food, drinks, and company.',
        date: getRandomFutureDate(),
        time: getRandomTime(),
        endTime: null,
        price: Math.random() > 0.5 ? Math.floor(Math.random() * 5000) + 500 : null,
        location: restaurant.address || `${Math.floor(Math.random() * 1000)} Street, ${neighborhoods[Math.floor(Math.random() * neighborhoods.length)]}`,
        latitude: restaurant.latitude || (-1.3 + Math.random() * 0.1),
        longitude: restaurant.longitude || (36.7 + Math.random() * 0.2),
        capacity: Math.floor(Math.random() * 80) + 20,
        eventType,
        restaurantId: Math.random() > 0.3 ? restaurant.id : null,
        userId: user.id,
        featured: Math.random() > 0.8
      });
    }

    // Create events
    for (const eventData of events) {
      try {
        await Event.create(eventData);
      } catch (error) {
        console.error(`Error creating event "${eventData.title}":`, error.message);
      }
    }

    const eventCount = await Event.count();
    console.log(`✅ Seeded ${eventCount} events`);

  } catch (error) {
    console.error('❌ Error seeding events:', error);
    throw error;
  }
};

module.exports = seedEvents;

// Run if called directly
if (require.main === module) {
  seedEvents()
    .then(() => {
      console.log('✅ Events seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Events seeding failed:', error);
      process.exit(1);
    });
}



