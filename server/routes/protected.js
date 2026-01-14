import express from 'express';
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

export default router;

