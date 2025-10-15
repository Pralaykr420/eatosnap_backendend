import express from 'express';
import {
  createOffer,
  getRestaurantOffers,
  updateOffer,
  deleteOffer,
} from '../controllers/offerController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, restrictTo('seller'), createOffer);
router.get('/restaurant/:restaurantId', getRestaurantOffers);
router.put('/:id', protect, restrictTo('seller'), updateOffer);
router.delete('/:id', protect, restrictTo('seller'), deleteOffer);

export default router;
