import express from 'express';
import {
  registerRider,
  toggleActive,
  updateLocation,
  getAvailableOrders,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
  getRiderProfile,
} from '../controllers/riderController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', protect, restrictTo('rider'), registerRider);
router.post('/toggle-active', protect, restrictTo('rider'), toggleActive);
router.put('/location', protect, restrictTo('rider'), updateLocation);
router.get('/available-orders', protect, restrictTo('rider'), getAvailableOrders);
router.post('/accept-order', protect, restrictTo('rider'), acceptOrder);
router.post('/reject-order', protect, restrictTo('rider'), rejectOrder);
router.put('/order-status', protect, restrictTo('rider'), updateOrderStatus);
router.get('/profile', protect, restrictTo('rider'), getRiderProfile);

export default router;
