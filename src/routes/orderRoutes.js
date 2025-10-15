import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  addReview,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getOrders).post(protect, createOrder);

router.route('/:id').get(protect, getOrder);

router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/review', protect, addReview);

export default router;
