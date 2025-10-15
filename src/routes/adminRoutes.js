import express from 'express';
import { getPendingRestaurants, verifyRestaurant, getPendingRiders, verifyRider } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/restaurants/pending', protect, authorize('admin'), getPendingRestaurants);
router.put('/restaurants/verify/:restaurantId', protect, authorize('admin'), verifyRestaurant);
router.get('/riders/pending', protect, authorize('admin'), getPendingRiders);
router.put('/riders/verify/:riderId', protect, authorize('admin'), verifyRider);

export default router;
