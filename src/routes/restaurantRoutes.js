import express from 'express';
import {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getRestaurants).post(protect, restrictTo('seller'), createRestaurant);

router
  .route('/:id')
  .get(getRestaurant)
  .put(protect, restrictTo('seller'), updateRestaurant)
  .delete(protect, restrictTo('seller'), deleteRestaurant);

export default router;
