import express from 'express';
import jwt from 'jsonwebtoken';
import { signupSchema, loginSchema } from '../validators/auth.js';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Signup route
router.post('/signup', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details.map(d => d.message) 
      });
    }

    const { email, password, name, role } = value;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user (password will be hashed by pre-save hook)
    const newUser = new User({
      email,
      password,
      name,
      role: role || 'user'
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details.map(d => d.message) 
      });
    }

    const { email, password } = value;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password using the model method
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;