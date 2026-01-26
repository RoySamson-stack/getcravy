const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Deal = sequelize.define('Deal', {
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
    allowNull: true
  },
  discount: {
    type: DataTypes.STRING,
    allowNull: true, // e.g., "20% off", "Buy 1 Get 1", "KES 500 off"
    validate: {
      len: [0, 100]
    }
  },
  dayOfWeek: {
    type: DataTypes.INTEGER,
    allowNull: true, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday, null = daily
    validate: {
      min: 0,
      max: 6
    }
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  validFrom: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  validUntil: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'restaurants',
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
  tableName: 'deals',
  timestamps: true,
  indexes: [
    { fields: ['restaurantId'] },
    { fields: ['dayOfWeek'] },
    { fields: ['isActive'] },
    { fields: ['featured'] },
    { fields: ['validFrom', 'validUntil'] }
  ]
});

module.exports = Deal;



