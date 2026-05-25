const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  method: {
    type: DataTypes.ENUM('card', 'paypal', 'cash'),
    allowNull: false
  },
  gateway: {
    type: DataTypes.ENUM('paystack', 'manual'),
    allowNull: false,
    defaultValue: 'manual'
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  providerReference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  accessCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  authorizationUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gatewayResponse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  indexes: [
    { fields: ['orderId'] },
    { fields: ['status'] }
  ]
});

module.exports = Payment;
