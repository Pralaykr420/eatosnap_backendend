import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, isOTPValid } from '../utils/otp.js';
import { sendOTPEmail } from '../services/emailService.js';
import { sendOTPSMS } from '../services/smsService.js';

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
    const phoneOTP = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({ 
      name, email, password, phone, role,
      emailOTP, phoneOTP, otpExpiry
    });

    try {
      await sendOTPEmail(email, emailOTP);
    } catch (error) {
      console.log('Email send failed:', error.message);
    }

    try {
      await sendOTPSMS(phone, phoneOTP);
    } catch (error) {
      console.log('SMS send failed:', error.message);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email and phone.',
      userId: user._id,
      email: user.email,
      phone: user.phone,
    });
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

    if (!user.isEmailVerified || !user.isPhoneVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email and phone first',
        userId: user._id,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
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
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
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
