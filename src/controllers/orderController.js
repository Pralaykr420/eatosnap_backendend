import Order from '../models/Order.js';
import Rider from '../models/Rider.js';

const PLATFORM_COMMISSION_RATE = 0.15;
const DELIVERY_FEE_RIDER_SHARE = 0.80;

export const createOrder = async (req, res) => {
  try {
    const platformCommission = req.body.totalAmount * PLATFORM_COMMISSION_RATE;
    const restaurantAmount = req.body.totalAmount - platformCommission;
    const riderEarnings = req.body.deliveryFee * DELIVERY_FEE_RIDER_SHARE;

    const order = await Order.create({
      ...req.body,
      user: req.user.id,
      platformCommission,
      restaurantAmount,
      riderEarnings,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const query = req.user.role === 'seller' ? {} : { user: req.user.id };
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name logo')
      .sort('-createdAt');

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name logo phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    order.statusHistory.push({ status });

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
      if (order.rider) {
        await Rider.findByIdAndUpdate(order.rider, {
          $inc: { totalEarnings: order.riderEarnings, completedDeliveries: 1 },
        });
      }
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({ message: 'Can only review delivered orders' });
    }

    order.rating = rating;
    order.review = review;
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
