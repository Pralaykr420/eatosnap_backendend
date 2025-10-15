import Order from '../models/Order.js';

const PLATFORM_COMMISSION_RATE = 0.15;
const DELIVERY_FEE_RIDER_SHARE = 0.80;
const DELIVERY_FEE_PLATFORM_SHARE = 0.20;

export const calculateOrderPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const platformCommission = order.totalAmount * PLATFORM_COMMISSION_RATE;
    const restaurantAmount = order.totalAmount - platformCommission;
    const riderEarnings = order.deliveryFee * DELIVERY_FEE_RIDER_SHARE;
    const platformDeliveryShare = order.deliveryFee * DELIVERY_FEE_PLATFORM_SHARE;

    order.platformCommission = platformCommission;
    order.restaurantAmount = restaurantAmount;
    order.riderEarnings = riderEarnings;
    await order.save();

    res.json({
      orderId: order._id,
      totalAmount: order.totalAmount,
      deliveryFee: order.deliveryFee,
      platformCommission,
      restaurantAmount,
      riderEarnings,
      platformDeliveryShare,
      paymentMethod: order.paymentMethod,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentBreakdown = async (req, res) => {
  try {
    const { items, deliveryFee } = req.body;

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const platformCommission = totalAmount * PLATFORM_COMMISSION_RATE;
    const restaurantAmount = totalAmount - platformCommission;
    const riderEarnings = deliveryFee * DELIVERY_FEE_RIDER_SHARE;
    const platformDeliveryShare = deliveryFee * DELIVERY_FEE_PLATFORM_SHARE;

    res.json({
      totalAmount,
      deliveryFee,
      grandTotal: totalAmount + deliveryFee,
      platformCommission,
      restaurantAmount,
      riderEarnings,
      platformDeliveryShare,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
