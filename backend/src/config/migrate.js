const { sequelize } = require('./database');
// Load all models first
require('../models/User');
require('../models/Restaurant');
require('../models/MenuItem');
require('../models/Review');
require('../models/Reservation');
// Then load associations (this must be after all models are loaded)
require('../models/associations');

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

migrate();

