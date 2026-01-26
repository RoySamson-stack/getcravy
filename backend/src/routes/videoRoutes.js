const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/', videoController.getVideos);
router.get('/:id', videoController.getVideo);
router.get('/:id/comments', videoController.getComments);

// Protected routes (require authentication)
router.post('/', authenticate, videoController.createVideo);
router.post('/:id/like', authenticate, videoController.toggleLike);
router.post('/:id/comment', authenticate, videoController.addComment);
router.post('/:id/share', videoController.shareVideo);

module.exports = router;

