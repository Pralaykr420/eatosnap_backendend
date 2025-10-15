import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'seller', 'rider', 'admin'], default: 'user' },
    isEmailVerified: { type: Boolean, default: false },
    emailOTP: { type: String },
    otpExpiry: { type: Date },

    avatar: { type: String, default: '' },
    addresses: [
      {
        label: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        coordinates: { lat: Number, lng: Number },
      },
    ],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    preferences: {
      cuisine: [String],
      dietary: [String],
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
