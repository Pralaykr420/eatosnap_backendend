import express from 'express';
import {
  createReel,
  getReels,
  getReel,
  likeReel,
  addComment,
  saveReel,
  shareReel,
  getReelAnalytics,
  deleteReel,
} from '../controllers/reelController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getReels).post(protect, createReel);

router.route('/:id').get(getReel).delete(protect, deleteReel);

router.post('/:id/like', protect, likeReel);
router.post('/:id/comment', protect, addComment);
router.post('/:id/save', protect, saveReel);
router.post('/:id/share', protect, shareReel);
router.get('/:id/analytics', protect, getReelAnalytics);

export default router;
