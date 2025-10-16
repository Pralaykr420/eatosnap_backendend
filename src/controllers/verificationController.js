import User from '../models/User.js';
import { generateOTP, isOTPValid } from '../utils/otp.js';
import { sendOTPEmail } from '../services/emailService.js';

export const verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    if (!isOTPValid(user.otpExpiry)) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    if (user.emailOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isEmailVerified = true;
    user.emailOTP = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const resendEmailOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const emailOTP = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.emailOTP = emailOTP;
    user.otpExpiry = otpExpiry;
    await user.save();

    try {
      await sendOTPEmail(user.email, emailOTP);
      console.log(`✅ OTP resent to ${user.email}: ${emailOTP}`);
      res.json({ success: true, message: 'OTP sent to email. Check spam folder if not received.' });
    } catch (emailError) {
      console.error('❌ Email send failed:', emailError.message);
      // Return OTP in response for testing (REMOVE IN PRODUCTION)
      res.json({ 
        success: true, 
        message: 'Email service error. Use this OTP for testing:', 
        otp: emailOTP 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


