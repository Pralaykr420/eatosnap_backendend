import Rider from '../models/Rider.js';
import Order from '../models/Order.js';

export const registerRider = async (req, res) => {
  try {
    const { aadharNumber, aadharDocument, vehicleType, vehicleNumber, drivingLicense, age, bankDetails } = req.body;

    if (age < 18) {
      return res.status(400).json({ message: 'Rider must be at least 18 years old' });
    }

    const existingRider = await Rider.findOne({ user: req.user.id });
    if (existingRider) {
      return res.status(400).json({ message: 'Rider profile already exists' });
    }

    const rider = await Rider.create({
      user: req.user.id,
      aadharNumber,
      aadharDocument,
      vehicleType,
      vehicleNumber,
      drivingLicense,
      age,
      bankDetails,
    });

    res.status(201).json({ success: true, rider, message: 'Rider registered. Aadhar verification pending.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleActive = async (req, res) => {
  try {
    const rider = await Rider.findOne({ user: req.user.id });
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    if (!rider.isAadharVerified) {
      return res.status(403).json({ message: 'Aadhar verification required' });
    }

    const today = new Date().toDateString();
    const lastActive = rider.lastActiveDate ? new Date(rider.lastActiveDate).toDateString() : null;

    if (today !== lastActive) {
      rider.todayWorkingHours = 0;
    }

    if (rider.todayWorkingHours >= 12) {
      return res.status(403).json({ message: 'Maximum 12 hours working limit reached for today' });
    }

    rider.isActive = !rider.isActive;
    rider.isAvailable = rider.isActive;
    rider.lastActiveDate = new Date();
    await rider.save();

    res.json({ success: true, isActive: rider.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const rider = await Rider.findOne({ user: req.user.id });

    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    rider.currentLocation.coordinates = [lng, lat];
    await rider.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableOrders = async (req, res) => {
  try {
    const rider = await Rider.findOne({ user: req.user.id });
    if (!rider || !rider.isActive) {
      return res.status(403).json({ message: 'Rider not active' });
    }

    const orders = await Order.find({
      orderStatus: 'ready',
      riderStatus: 'pending',
      rider: null,
    })
      .populate('restaurant', 'name address phone')
      .populate('user', 'name phone email')
      .sort('-createdAt');

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const rider = await Rider.findOne({ user: req.user.id });

    if (!rider || !rider.isAvailable) {
      return res.status(403).json({ message: 'Rider not available' });
    }

    const order = await Order.findById(orderId);
    if (!order || order.rider) {
      return res.status(400).json({ message: 'Order not available' });
    }

    order.rider = rider._id;
    order.riderStatus = 'accepted';
    order.riderEarnings = order.deliveryFee * 0.8;
    await order.save();

    rider.isAvailable = false;
    await rider.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    res.json({ success: true, message: 'Order rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const rider = await Rider.findOne({ user: req.user.id });

    const order = await Order.findOne({ _id: orderId, rider: rider._id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.riderStatus = status;
    if (status === 'delivered') {
      order.orderStatus = 'delivered';
      order.actualDeliveryTime = new Date();
      rider.isAvailable = true;
      rider.totalDeliveries += 1;
      rider.earnings += order.riderEarnings;
      await rider.save();
    }
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRiderProfile = async (req, res) => {
  try {
    const rider = await Rider.findOne({ user: req.user.id }).populate('user', 'name email phone');
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }
    res.json({ success: true, rider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
