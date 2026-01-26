const { Video, VideoLike, VideoComment, User, Restaurant, MenuItem } = require('../models/associations');
const { Op } = require('sequelize');

// Get videos for feed
exports.getVideos = async (req, res) => {
  try {
    const { feedType = 'for_you', page = 1, limit = 10, userId } = req.query;
    const offset = (page - 1) * limit;
    const userIdParam = userId || req.user?.id;

    let whereClause = {
      isPublic: true
    };

    // Filter by feed type
    if (feedType === 'nearby' && req.query.latitude && req.query.longitude) {
      // For nearby, we'd need to calculate distance
      // For now, just filter by feedType
      whereClause.feedType = 'nearby';
    } else if (feedType === 'following' && userIdParam) {
      // Get videos from followed users/restaurants
      // This would require a Follow model - for now, return all public videos
      whereClause.feedType = 'following';
    } else {
      whereClause.feedType = feedType;
    }

    const videos = await Video.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'image']
        },
        {
          model: MenuItem,
          as: 'menuItem',
          attributes: ['id', 'name', 'image']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Check if user has liked each video
    if (userIdParam) {
      const videoIds = videos.rows.map(v => v.id);
      const userLikes = await VideoLike.findAll({
        where: {
          userId: userIdParam,
          videoId: { [Op.in]: videoIds }
        }
      });

      const likedVideoIds = new Set(userLikes.map(like => like.videoId));
      videos.rows = videos.rows.map(video => {
        const videoJson = video.toJSON();
        videoJson.isLiked = likedVideoIds.has(video.id);
        return videoJson;
      });
    }

    res.json({
      success: true,
      data: {
        videos: videos.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: videos.count,
          totalPages: Math.ceil(videos.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single video
exports.getVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const video = await Video.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'image']
        },
        {
          model: MenuItem,
          as: 'menuItem',
          attributes: ['id', 'name', 'image']
        }
      ]
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Increment view count
    await video.increment('viewsCount');

    // Check if user has liked
    let isLiked = false;
    if (userId) {
      const like = await VideoLike.findOne({
        where: { userId, videoId: id }
      });
      isLiked = !!like;
    }

    const videoJson = video.toJSON();
    videoJson.isLiked = isLiked;

    res.json({
      success: true,
      data: videoJson
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching video',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create video
exports.createVideo = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const {
      videoUrl,
      thumbnailUrl,
      title,
      description,
      dishName,
      location,
      restaurantId,
      menuItemId,
      filter,
      textOverlay,
      feedType = 'for_you',
      latitude,
      longitude
    } = req.body;

    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Video URL is required'
      });
    }

    const video = await Video.create({
      userId,
      videoUrl,
      thumbnailUrl,
      title,
      description,
      dishName,
      location,
      restaurantId,
      menuItemId,
      filter,
      textOverlay: textOverlay || null,
      hasTextOverlay: !!textOverlay,
      feedType,
      latitude,
      longitude
    });

    const videoWithRelations = await Video.findByPk(video.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: Restaurant,
          as: 'restaurant',
          attributes: ['id', 'name', 'image']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: videoWithRelations
    });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating video',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Like/Unlike video
exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { id } = req.params;

    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const existingLike = await VideoLike.findOne({
      where: { userId, videoId: id }
    });

    if (existingLike) {
      // Unlike
      await existingLike.destroy();
      await video.decrement('likesCount');
      
      res.json({
        success: true,
        data: {
          isLiked: false,
          likesCount: Math.max(0, video.likesCount - 1)
        }
      });
    } else {
      // Like
      await VideoLike.create({ userId, videoId: id });
      await video.increment('likesCount');
      
      res.json({
        success: true,
        data: {
          isLiked: true,
          likesCount: video.likesCount + 1
        }
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get video comments
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const comments = await VideoComment.findAndCountAll({
      where: {
        videoId: id,
        parentCommentId: null // Only top-level comments
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar']
        },
        {
          model: VideoComment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'avatar']
            }
          ],
          limit: 3 // Limit replies per comment
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        comments: comments.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: comments.count,
          totalPages: Math.ceil(comments.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const { content, parentCommentId } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    const comment = await VideoComment.create({
      userId,
      videoId: id,
      content: content.trim(),
      parentCommentId: parentCommentId || null
    });

    // Increment comment count
    await video.increment('commentsCount');

    const commentWithUser = await VideoComment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: commentWithUser
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Share video (increment share count)
exports.shareVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    await video.increment('sharesCount');

    res.json({
      success: true,
      data: {
        sharesCount: video.sharesCount + 1
      }
    });
  } catch (error) {
    console.error('Error sharing video:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing video',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

