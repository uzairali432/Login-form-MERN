import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [sortBy, setSortBy] = useState('popular');

  // Mock product data
  const products = [
    { id: 1, name: 'Wireless Headphones', price: 79.99, category: 'electronics', rating: 4.5, reviews: 128, image: '🎧' },
    { id: 2, name: 'USB-C Cable', price: 12.99, category: 'electronics', rating: 4.8, reviews: 456, image: '🔌' },
    { id: 3, name: 'Phone Case', price: 19.99, category: 'accessories', rating: 4.3, reviews: 89, image: '📱' },
    { id: 4, name: 'Screen Protector', price: 9.99, category: 'accessories', rating: 4.7, reviews: 234, image: '📺' },
    { id: 5, name: 'Laptop Stand', price: 34.99, category: 'office', rating: 4.6, reviews: 167, image: '💻' },
    { id: 6, name: 'Desk Lamp', price: 29.99, category: 'office', rating: 4.4, reviews: 95, image: '💡' },
    { id: 7, name: 'Portable Speaker', price: 49.99, category: 'electronics', rating: 4.7, reviews: 312, image: '🔊' },
    { id: 8, name: 'Phone Mount', price: 14.99, category: 'accessories', rating: 4.5, reviews: 178, image: '🎯' },
    { id: 9, name: 'Keyboard', price: 59.99, category: 'office', rating: 4.6, reviews: 203, image: '⌨️' },
    { id: 10, name: 'Mouse Pad', price: 16.99, category: 'office', rating: 4.4, reviews: 112, image: '🖱️' },
    { id: 11, name: 'Screen Cleaner Kit', price: 11.99, category: 'accessories', rating: 4.3, reviews: 67, image: '🧹' },
    { id: 12, name: 'Cable Organizer', price: 13.99, category: 'accessories', rating: 4.6, reviews: 145, image: '🔗' },
  ];

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'office', label: 'Office' },
  ];

  // Filter products
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // popular (original order)
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="products-container">
      <div className="products-header">
        <div className="header-content">
          <h1>Shop</h1>
          <div className="header-actions">
            <span className="user-greeting">Welcome, {user?.name}</span>
            <div className="cart-info">
              <span className="cart-count">{cart.length}</span>
              <span className="cart-label">Items in Cart</span>
            </div>
            <button onClick={logout} className="logout-button">Logout</button>
          </div>
        </div>
      </div>

      <div className="products-main">
        {/* Sidebar */}
        <aside className="products-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-list">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          {cart.length > 0 && (
            <div className="cart-section">
              <h3>Shopping Cart</h3>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-qty">Qty: {item.quantity}</span>
                      <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove from cart"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>
                <button className="checkout-btn">Checkout</button>
              </div>
            </div>
          )}
        </aside>

        {/* Products Grid */}
        <div className="products-content">
          <div className="products-toolbar">
            <p className="results-count">{sortedProducts.length} products</p>
            <div className="sort-controls">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {sortedProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">{product.image}</div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <span className="stars">★ {product.rating}</span>
                    <span className="review-count">({product.reviews})</span>
                  </div>
                  <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

