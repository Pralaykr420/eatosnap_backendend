import express from 'express';
import { calculateOrderPayment, getPaymentBreakdown } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/calculate/:orderId', protect, calculateOrderPayment);
router.post('/breakdown', getPaymentBreakdown);

export default router;
