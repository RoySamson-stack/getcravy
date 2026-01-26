const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true, // null means free event
    validate: {
      min: 0
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  attendeesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  eventType: {
    type: DataTypes.ENUM(
      'restaurant_event',
      'festival',
      'popup',
      'special',
      'entertainment'
    ),
    allowNull: false,
    defaultValue: 'restaurant_event'
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'restaurants',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'events',
  timestamps: true,
  indexes: [
    { fields: ['date'] },
    { fields: ['eventType'] },
    { fields: ['restaurantId'] },
    { fields: ['userId'] },
    { fields: ['featured'] },
    { fields: ['isActive'] },
    { fields: ['date', 'time'] }
  ]
});

module.exports = Event;



