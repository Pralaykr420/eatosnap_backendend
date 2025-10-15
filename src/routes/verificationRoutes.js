import express from 'express';
import {
  verifyEmail,
  resendEmailOTP,
} from '../controllers/verificationController.js';

const router = express.Router();

router.post('/verify-email', verifyEmail);
router.post('/resend-email-otp', resendEmailOTP);

export default router;
