const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'restaurants',
      key: 'id'
    }
  },
  menuItemId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'menu_items',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  helpfulCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  foodRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  serviceRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  ambianceRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  valueRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['restaurantId'] },
    { fields: ['menuItemId'] },
    { fields: ['rating'] }
  ]
});

// Associations are defined in ./associations.js to avoid circular dependencies

module.exports = Review;

