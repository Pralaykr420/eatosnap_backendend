import mongoose from 'mongoose';

const riderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    aadharNumber: { type: String, required: true, unique: true },
    aadharDocument: { type: String, required: true },
    isAadharVerified: { type: Boolean, default: false },
    age: { type: Number },
    vehicleType: { type: String, enum: ['bike', 'scooter', 'bicycle'], required: true },
    vehicleNumber: { type: String, required: true },
    drivingLicense: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: false },
    currentLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    todayWorkingHours: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    totalDeliveries: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String,
    },
  },
  { timestamps: true }
);

riderSchema.index({ currentLocation: '2dsphere' });

export default mongoose.model('Rider', riderSchema);
