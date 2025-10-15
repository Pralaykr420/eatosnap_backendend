import Offer from '../models/Offer.js';
import Restaurant from '../models/Restaurant.js';
import Product from '../models/Product.js';

export const createOffer = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.body.restaurant, owner: req.user.id });
    if (!restaurant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.body.applicableProducts?.length > 0) {
      const products = await Product.find({
        _id: { $in: req.body.applicableProducts },
        restaurant: req.body.restaurant,
      });
      if (products.length !== req.body.applicableProducts.length) {
        return res.status(400).json({ message: 'Some products not found in your restaurant' });
      }
    }

    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurantOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      restaurant: req.params.restaurantId,
      isActive: true,
      validTill: { $gte: new Date() },
    }).populate('applicableProducts', 'name price');

    res.json({ success: true, offers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    const restaurant = await Restaurant.findOne({ _id: offer.restaurant, owner: req.user.id });
    if (!restaurant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(offer, req.body);
    await offer.save();

    res.json({ success: true, offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    const restaurant = await Restaurant.findOne({ _id: offer.restaurant, owner: req.user.id });
    if (!restaurant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await offer.deleteOne();
    res.json({ success: true, message: 'Offer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
