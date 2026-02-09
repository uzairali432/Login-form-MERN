import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, updateName } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [updateError, setUpdateError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productsAPI.getAll();
      setProducts(data.products);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setNewName(user?.name || '');
    setUpdateError('');
  };

  const handleSaveName = async () => {
    try {
      setIsSaving(true);
      setUpdateError('');
      const result = await updateName(newName);
      
      if (result.success) {
        setIsEditingName(false);
      } else {
        setUpdateError(result.error || 'Failed to update name');
      }
    } catch (err) {
      setUpdateError(err.message || 'Failed to update name');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setNewName(user?.name || '');
    setUpdateError('');
  };

  const categories = [
    { id: 'all', label: 'All Products' },
  ];

  // Filter products
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
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

  if (loading) {
    return (
      <div className="products-container">
        <div className="products-header">
          <div className="header-content">
            <h1>Shop</h1>
            <div className="header-actions">
              <span className="user-greeting">Welcome, {user?.name}</span>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          </div>
        </div>
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="products-header">
          <div className="header-content">
            <h1>Shop</h1>
            <div className="header-actions">
              <span className="user-greeting">Welcome, {user?.name}</span>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          </div>
        </div>
        <div className="error-banner">Error: {error}</div>
      </div>
    );
  }

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

      {/* User Details Section */}
      <div className="user-details-section">
        <div className="user-details-card">
          <h2>User Profile</h2>
          <div className="user-details-content">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              {isEditingName ? (
                <div className="detail-edit">
                  <input
                    type="text"
                    className="name-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <div className="edit-buttons">
                    <button
                      className="save-btn"
                      onClick={handleSaveName}
                      disabled={isSaving || !newName.trim()}
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                  </div>
                  {updateError && <span className="error-message">{updateError}</span>}
                </div>
              ) : (
                <div className="detail-value-with-edit">
                  <span className="detail-value">{user?.name}</span>
                  <button
                    className="edit-btn"
                    onClick={handleEditName}
                    title="Edit name"
                  >
                    ✏️
                  </button>
                </div>
              )}
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{user?.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Role:</span>
              <span className="detail-value">{user?.role || 'User'}</span>
            </div>
            {user?.id && (
              <div className="detail-item">
                <span className="detail-label">User ID:</span>
                <span className="detail-value">{user?.id}</span>
              </div>
            )}
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
                <div className="product-image">📦</div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
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

