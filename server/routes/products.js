import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mock products database
const products = [
  {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    description: 'High-performance laptop for professionals',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    price: 29.99,
    description: 'Ergonomic wireless mouse',
    category: 'Accessories'
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    price: 149.99,
    description: 'RGB Mechanical keyboard with custom switches',
    category: 'Accessories'
  },
  {
    id: 4,
    name: 'Monitor',
    price: 399.99,
    description: '27-inch 4K Ultra HD monitor',
    category: 'Electronics'
  },
  {
    id: 5,
    name: 'Webcam',
    price: 79.99,
    description: '1080p HD webcam with microphone',
    category: 'Accessories'
  },
];

// Get all products - requires authentication
router.get('/', authenticateToken, (req, res) => {
  try {
    res.json({
      message: 'Products fetched successfully',
      user: req.user.email,
      products: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID - requires authentication
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product fetched successfully',
      user: req.user.email,
      product: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add product to cart - requires authentication
router.post('/cart/add', authenticateToken, (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity required' });
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product added to cart successfully',
      user: req.user.email,
      cartItem: {
        ...product,
        quantity: quantity
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
});

export default router;
