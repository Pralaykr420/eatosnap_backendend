import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    cuisine: [{ type: String }],
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: { lat: Number, lng: Number },
    },
    phone: { type: String, required: true },
    email: { type: String },
    openingHours: {
      monday: { open: String, close: String, closed: Boolean },
      tuesday: { open: String, close: String, closed: Boolean },
      wednesday: { open: String, close: String, closed: Boolean },
      thursday: { open: String, close: String, closed: Boolean },
      friday: { open: String, close: String, closed: Boolean },
      saturday: { open: String, close: String, closed: Boolean },
      sunday: { open: String, close: String, closed: Boolean },
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    deliveryTime: { type: String, default: '30-40 mins' },
    deliveryFee: { type: Number, default: 0 },
    minOrder: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isPureVeg: { type: Boolean, default: false },
    tags: [String],
  },
  { timestamps: true }
);

restaurantSchema.index({ 'address.coordinates': '2dsphere' });

export default mongoose.model('Restaurant', restaurantSchema);
