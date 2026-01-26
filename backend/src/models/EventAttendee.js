const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EventAttendee = sequelize.define('EventAttendee', {
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
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('going', 'interested'),
    allowNull: false,
    defaultValue: 'interested'
  }
}, {
  tableName: 'event_attendees',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['eventId'] },
    { fields: ['status'] },
    { 
      fields: ['userId', 'eventId'],
      unique: true // Prevent duplicate attendance records
    }
  ]
});

module.exports = EventAttendee;



