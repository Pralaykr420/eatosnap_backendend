import Reel from '../models/Reel.js';
import Restaurant from '../models/Restaurant.js';

export const createReel = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.body.restaurant);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const reel = await Reel.create({ ...req.body, creator: req.user.id });
    res.status(201).json({ success: true, reel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReels = async (req, res) => {
  try {
    const { restaurant } = req.query;
    const query = restaurant ? { restaurant, isActive: true } : { isActive: true };

    const reels = await Reel.find(query)
      .populate('restaurant', 'name logo')
      .populate('creator', 'name avatar')
      .sort('-createdAt');

    res.json({ success: true, count: reels.length, reels });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate('restaurant', 'name logo')
      .populate('creator', 'name avatar')
      .populate('products', 'name price images');

    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    reel.views += 1;
    await reel.save();

    res.json({ success: true, reel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    const index = reel.likes.indexOf(req.user.id);
    if (index > -1) {
      reel.likes.splice(index, 1);
    } else {
      reel.likes.push(req.user.id);
    }

    await reel.save();
    res.json({ success: true, likes: reel.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    reel.comments.push({ user: req.user.id, text: req.body.text });
    await reel.save();

    const populatedReel = await Reel.findById(reel._id).populate('comments.user', 'name avatar');
    res.json({ success: true, comments: populatedReel.comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    const index = reel.saves.indexOf(req.user.id);
    if (index > -1) {
      reel.saves.splice(index, 1);
    } else {
      reel.saves.push(req.user.id);
    }

    await reel.save();
    res.json({ success: true, saved: index === -1 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const shareReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    reel.shares += 1;
    await reel.save();

    res.json({ success: true, shares: reel.shares });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReelAnalytics = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found' });
    }

    res.json({
      success: true,
      analytics: {
        views: reel.views,
        likes: reel.likes.length,
        saves: reel.saves.length,
        shares: reel.shares,
        comments: reel.comments.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findOne({ _id: req.params.id, creator: req.user.id });
    if (!reel) {
      return res.status(404).json({ message: 'Reel not found or unauthorized' });
    }

    await reel.deleteOne();
    res.json({ success: true, message: 'Reel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
