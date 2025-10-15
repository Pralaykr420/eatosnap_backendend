import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: { type: Number, required: true, min: 1 },
        price: Number,
        customizations: [{ name: String, option: String, price: Number }],
      },
    ],
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: { lat: Number, lng: Number },
    },
    orderType: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['upi', 'cod'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    upiTransactionId: { type: String },
    platformCommission: { type: Number, default: 0 },
    restaurantAmount: { type: Number, default: 0 },
    rider: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },
    riderEarnings: { type: Number, default: 0 },
    pickupLocation: {
      address: String,
      coordinates: { lat: Number, lng: Number },
    },
    riderStatus: { type: String, enum: ['pending', 'accepted', 'rejected', 'picked_up', 'delivered'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    specialInstructions: String,
    rating: { type: Number, min: 1, max: 5 },
    review: String,
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
