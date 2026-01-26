const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VideoLike = sequelize.define('VideoLike', {
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
    },
    onDelete: 'CASCADE'
  },
  videoId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'videos',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'video_likes',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['videoId'] },
    { 
      fields: ['userId', 'videoId'],
      unique: true,
      name: 'unique_user_video_like'
    }
  ]
});

// Associations are defined in ./associations.js to avoid circular dependencies

module.exports = VideoLike;

