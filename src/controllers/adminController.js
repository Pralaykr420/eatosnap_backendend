import Restaurant from '../models/Restaurant.js';
import Rider from '../models/Rider.js';

export const getPendingRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isFssaiVerified: false, fssaiRejectionReason: null })
      .populate('owner', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, count: restaurants.length, restaurants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { approved, rejectionReason } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (approved) {
      restaurant.isFssaiVerified = true;
      restaurant.fssaiVerifiedBy = req.user.id;
      restaurant.fssaiVerifiedAt = new Date();
      restaurant.fssaiRejectionReason = null;
    } else {
      restaurant.isFssaiVerified = false;
      restaurant.fssaiRejectionReason = rejectionReason || 'FSSAI verification failed';
    }

    await restaurant.save();
    res.json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingRiders = async (req, res) => {
  try {
    const riders = await Rider.find({ isAadharVerified: false })
      .populate('user', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, count: riders.length, riders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyRider = async (req, res) => {
  try {
    const { riderId } = req.params;
    const { approved } = req.body;

    const rider = await Rider.findById(riderId);
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    rider.isAadharVerified = approved;
    await rider.save();

    res.json({ success: true, rider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
