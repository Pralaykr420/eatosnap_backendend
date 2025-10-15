import express from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, restrictTo('seller'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, restrictTo('seller'), updateProduct)
  .delete(protect, restrictTo('seller'), deleteProduct);

export default router;
