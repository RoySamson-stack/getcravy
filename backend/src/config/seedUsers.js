const User = require('../models/User');
const { sequelize } = require('./database');
// Load associations
require('../models/associations');

const seedUsers = async () => {
  try {
    console.log('🌱 Seeding users...');

    // Check if users already exist
    const existingCount = await User.count();
    if (existingCount > 0) {
      console.log('⚠️  Users already exist, skipping seed');
      return;
    }

    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+254712345678',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+254712345679',
        role: 'user'
      },
      {
        name: 'Restaurant Owner',
        email: 'owner@example.com',
        password: 'password123',
        phone: '+254712345680',
        role: 'restaurant_owner'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        phone: '+254712345681',
        role: 'admin'
      }
    ];

    // Create users individually to ensure password hooks run
    // bulkCreate bypasses hooks, so we need to create them one by one
    for (const userData of users) {
      await User.create(userData);
    }
    console.log(`✅ Seeded ${users.length} users successfully!`);
    console.log('\n📝 Test User Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role: ${user.role}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
};

// Run seed if called directly
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('✅ User seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ User seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedUsers };

