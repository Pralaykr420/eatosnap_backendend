import express from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/socialController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/follow', protect, followUser);
router.post('/unfollow', protect, unfollowUser);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);

export default router;
