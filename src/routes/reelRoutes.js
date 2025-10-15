import express from 'express';
import {
  createReel,
  getReels,
  getReel,
  likeReel,
  addComment,
  deleteReel,
} from '../controllers/reelController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getReels).post(protect, restrictTo('seller'), createReel);

router.route('/:id').get(getReel).delete(protect, restrictTo('seller'), deleteReel);

router.post('/:id/like', protect, likeReel);
router.post('/:id/comment', protect, addComment);

export default router;
