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

router.post('/register', protect, registerRider);
router.put('/toggle-active', protect, toggleActive);
router.put('/update-location', protect, updateLocation);
router.get('/available-orders', protect, getAvailableOrders);
router.put('/accept-order/:orderId', protect, acceptOrder);
router.put('/reject-order/:orderId', protect, rejectOrder);
router.put('/update-delivery-status/:orderId', protect, updateOrderStatus);
router.get('/profile', protect, getRiderProfile);

export default router;
