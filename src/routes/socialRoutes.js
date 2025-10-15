import express from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/socialController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/follow/:userId', protect, followUser);
router.post('/unfollow/:userId', protect, unfollowUser);
router.get('/followers', protect, getFollowers);
router.get('/following', protect, getFollowing);

export default router;
