// This file sets up all model associations
// It should be imported after all models are defined to avoid circular dependencies

const User = require('./User');
const Restaurant = require('./Restaurant');
const MenuItem = require('./MenuItem');
const Review = require('./Review');
const Reservation = require('./Reservation');
const Video = require('./Video');
const VideoLike = require('./VideoLike');
const VideoComment = require('./VideoComment');
const Event = require('./Event');
const EventAttendee = require('./EventAttendee');
const Deal = require('./Deal');

// User associations
User.hasMany(Restaurant, { foreignKey: 'ownerId', as: 'restaurants' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
User.hasMany(Video, { foreignKey: 'userId', as: 'videos' });
User.hasMany(VideoLike, { foreignKey: 'userId', as: 'videoLikes' });
User.hasMany(VideoComment, { foreignKey: 'userId', as: 'videoComments' });
User.hasMany(Event, { foreignKey: 'userId', as: 'events' });
User.hasMany(EventAttendee, { foreignKey: 'userId', as: 'eventAttendances' });

// Restaurant associations
Restaurant.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId', as: 'menuItems' });
Restaurant.hasMany(Review, { foreignKey: 'restaurantId', as: 'reviews' });
Restaurant.hasMany(Reservation, { foreignKey: 'restaurantId', as: 'reservations' });
Restaurant.hasMany(Video, { foreignKey: 'restaurantId', as: 'videos' });
Restaurant.hasMany(Event, { foreignKey: 'restaurantId', as: 'events' });
Restaurant.hasMany(Deal, { foreignKey: 'restaurantId', as: 'deals' });

// MenuItem associations
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
MenuItem.hasMany(Review, { foreignKey: 'menuItemId', as: 'reviews' });
MenuItem.hasMany(Video, { foreignKey: 'menuItemId', as: 'videos' });

// Review associations
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
Review.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

// Reservation associations
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Reservation.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// Video associations
Video.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Video.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
Video.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });
Video.hasMany(VideoLike, { foreignKey: 'videoId', as: 'likes' });
Video.hasMany(VideoComment, { foreignKey: 'videoId', as: 'comments' });

// VideoLike associations
VideoLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });
VideoLike.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });

// VideoComment associations
VideoComment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
VideoComment.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });
VideoComment.belongsTo(VideoComment, { foreignKey: 'parentCommentId', as: 'parentComment' });
VideoComment.hasMany(VideoComment, { foreignKey: 'parentCommentId', as: 'replies' });

// Event associations
Event.belongsTo(User, { foreignKey: 'userId', as: 'creator' });
Event.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });
Event.hasMany(EventAttendee, { foreignKey: 'eventId', as: 'attendees' });

// EventAttendee associations
EventAttendee.belongsTo(User, { foreignKey: 'userId', as: 'user' });
EventAttendee.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Deal associations
Deal.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

module.exports = {
  User,
  Restaurant,
  MenuItem,
  Review,
  Reservation,
  Video,
  VideoLike,
  VideoComment,
  Event,
  EventAttendee,
  Deal
};








