const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Video = sequelize.define('Video', {
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
  restaurantId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'restaurants',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  menuItemId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'menu_items',
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dishName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds'
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  commentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  sharesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  filter: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Applied video filter name'
  },
  hasTextOverlay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  textOverlay: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Text overlay content'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  feedType: {
    type: DataTypes.ENUM('for_you', 'nearby', 'following', 'trending'),
    defaultValue: 'for_you'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  }
}, {
  tableName: 'videos',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['restaurantId'] },
    { fields: ['menuItemId'] },
    { fields: ['feedType'] },
    { fields: ['isPublic'] },
    { fields: ['createdAt'] },
    { fields: ['likesCount'] },
    { fields: ['viewsCount'] }
  ]
});

// Associations are defined in ./associations.js to avoid circular dependencies

module.exports = Video;

