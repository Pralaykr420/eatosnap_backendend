import express from 'express';
import {
  verifyEmail,
  verifyPhone,
  resendEmailOTP,
  resendPhoneOTP,
} from '../controllers/verificationController.js';

const router = express.Router();

router.post('/verify-email', verifyEmail);
router.post('/verify-phone', verifyPhone);
router.post('/resend-email-otp', resendEmailOTP);
router.post('/resend-phone-otp', resendPhoneOTP);

export default router;
