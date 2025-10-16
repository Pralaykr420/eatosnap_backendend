import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, isOTPValid } from '../utils/otp.js';
import { sendOTPEmail } from '../services/emailService.js';

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const emailOTP = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({ 
      name, email, password, phone, role,
      emailOTP, otpExpiry
    });

    try {
      await sendOTPEmail(email, emailOTP);
      console.log(`✅ OTP sent to ${email}: ${emailOTP}`);
      res.status(201).json({
        success: true,
        message: 'Registration successful. OTP sent to your email. Check spam folder.',
        userId: user._id,
        email: user.email,
      });
    } catch (error) {
      console.error('❌ Email send failed:', error.message);
      // Return OTP in response for testing if email fails
      res.status(201).json({
        success: true,
        message: 'Registration successful. Email service error. Use this OTP:',
        userId: user._id,
        email: user.email,
        otp: emailOTP, // TEMPORARY: Remove in production
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email first',
        userId: user._id,
        isEmailVerified: user.isEmailVerified
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
