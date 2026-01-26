const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VideoComment = sequelize.define('VideoComment', {
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
  },
  parentCommentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'video_comments',
      key: 'id'
    },
    onDelete: 'CASCADE',
    comment: 'For nested/reply comments'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 1000]
    }
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'video_comments',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['videoId'] },
    { fields: ['parentCommentId'] },
    { fields: ['createdAt'] }
  ]
});

// Associations are defined in ./associations.js to avoid circular dependencies

module.exports = VideoComment;

