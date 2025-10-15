import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    discountPercentage: { type: Number, min: 0, max: 100 },
    validFrom: { type: Date, required: true },
    validTill: { type: Date, required: true },
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isActive: { type: Boolean, default: true },
    termsAndConditions: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Offer', offerSchema);
