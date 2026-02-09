import express from 'express';
import User from '../models/User.js';
import { authenticateToken, requireAdmin, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/profile', (req, res) => {
  res.json({
    message: 'Profile accessed successfully',
    user: req.user
  });
});

router.get('/admin', requireAdmin, (req, res) => {
  res.json({
    message: 'Admin dashboard accessed successfully',
    user: req.user
  });
});

router.get('/dashboard', requireRole('user', 'admin'), (req, res) => {
  res.json({
    message: 'Dashboard accessed successfully',
    user: req.user,
    role: req.user.role
  });
});

router.put('/profile/name', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required and must be a valid string' });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({ error: 'Name must be between 2 and 50 characters' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = trimmedName;
    await user.save();

    res.json({
      message: 'Name updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update name error:', error);
    res.status(500).json({ error: 'Failed to update name' });
  }
});

export default router;

