import Follow from '../models/Follow.js';
import User from '../models/User.js';

export const followUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const existingFollow = await Follow.findOne({ follower: req.user.id, following: userId });
    if (existingFollow) {
      return res.status(400).json({ message: 'Already following' });
    }

    await Follow.create({ follower: req.user.id, following: userId });
    res.json({ success: true, message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.body;

    await Follow.deleteOne({ follower: req.user.id, following: userId });
    res.json({ success: true, message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId })
      .populate('follower', 'name avatar')
      .sort('-createdAt');

    res.json({ success: true, count: followers.length, followers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.params.userId })
      .populate('following', 'name avatar')
      .sort('-createdAt');

    res.json({ success: true, count: following.length, following });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
