import express from 'express';
import { authenticateToken, requireAdmin, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Protected route - accessible to all authenticated users
router.get('/profile', (req, res) => {
  res.json({
    message: 'Profile accessed successfully',
    user: req.user
  });
});

// Admin only route
router.get('/admin', requireAdmin, (req, res) => {
  res.json({
    message: 'Admin dashboard accessed successfully',
    user: req.user
  });
});

// Role-based route example
router.get('/dashboard', requireRole('user', 'admin'), (req, res) => {
  res.json({
    message: 'Dashboard accessed successfully',
    user: req.user,
    role: req.user.role
  });
});

export default router;

