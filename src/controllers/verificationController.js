import User from '../models/User.js';
import { generateOTP, isOTPValid } from '../utils/otp.js';
import { sendOTPEmail } from '../services/emailService.js';
import { sendOTPSMS } from '../services/smsService.js';

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

export const verifyPhone = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({ message: 'Phone already verified' });
    }

    if (!isOTPValid(user.otpExpiry)) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    if (user.phoneOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isPhoneVerified = true;
    user.phoneOTP = undefined;
    await user.save();

    res.json({ success: true, message: 'Phone verified successfully' });
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

    await sendOTPEmail(user.email, emailOTP);

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendPhoneOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isPhoneVerified) {
      return res.status(400).json({ message: 'Phone already verified' });
    }

    const phoneOTP = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.phoneOTP = phoneOTP;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPSMS(user.phone, phoneOTP);

    res.json({ success: true, message: 'OTP sent to phone' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
