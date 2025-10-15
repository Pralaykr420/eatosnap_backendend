import Restaurant from '../models/Restaurant.js';

export const createRestaurant = async (req, res) => {
  try {
    const { fssaiNumber, fssaiCertificate } = req.body;
    
    if (!fssaiNumber || !fssaiCertificate) {
      return res.status(400).json({ message: 'FSSAI certificate and number are required' });
    }

    const restaurant = await Restaurant.create({ 
      ...req.body, 
      owner: req.user.id,
      isFssaiVerified: false
    });
    
    res.status(201).json({ 
      success: true, 
      restaurant,
      message: 'Restaurant created. FSSAI verification pending.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const { search, cuisine, sort, lat, lng, radius = 10 } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (cuisine) query.cuisine = { $in: cuisine.split(',') };

    if (lat && lng) {
      query['address.coordinates'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1000,
        },
      };
    }

    let restaurants = Restaurant.find(query);

    if (sort === 'rating') restaurants = restaurants.sort('-rating');
    if (sort === 'deliveryTime') restaurants = restaurants.sort('deliveryTime');

    restaurants = await restaurants;
    res.json({ success: true, count: restaurants.length, restaurants });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or unauthorized' });
    }
    res.json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or unauthorized' });
    }
    res.json({ success: true, message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
