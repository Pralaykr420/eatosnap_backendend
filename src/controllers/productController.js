import Product from '../models/Product.js';
import Restaurant from '../models/Restaurant.js';

export const createProduct = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.body.restaurant, owner: req.user.id });
    if (!restaurant) {
      return res.status(403).json({ message: 'Not authorized to add products to this restaurant' });
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { restaurant, category, search, isVeg } = req.query;
    let query = { isAvailable: true };

    if (restaurant) query.restaurant = restaurant;
    if (category) query.category = category;
    if (isVeg) query.isVeg = isVeg === 'true';
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).populate('restaurant', 'name logo');
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('restaurant');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const restaurant = await Restaurant.findOne({ _id: product.restaurant, owner: req.user.id });
    if (!restaurant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const restaurant = await Restaurant.findOne({ _id: product.restaurant, owner: req.user.id });
    if (!restaurant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
