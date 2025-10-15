import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [{ type: String }],
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    preparationTime: { type: String, default: '15-20 mins' },
    tags: [String],
    nutritionInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    customizations: [
      {
        name: String,
        options: [{ label: String, price: Number }],
        required: Boolean,
      },
    ],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
