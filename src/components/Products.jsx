import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);

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
      setError(err.message || 'Failed to fetch products. Please login first.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, productName) => {
    try {
      await productsAPI.addToCart(productId, 1);
      setCart([...cart, productId]);
      alert(`${productName} added to cart!`);
    } catch (err) {
      setError(err.message || 'Failed to add product to cart');
    }
  };

  if (loading) {
    return <div className="products-container"><p>Loading products...</p></div>;
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button onClick={fetchProducts}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h2>Available Products</h2>
      <p className="products-count">Total Products: {products.length}</p>
      
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <h3>{product.name}</h3>
                <span className="product-category">{product.category}</span>
              </div>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">${product.price.toFixed(2)}</span>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product.id, product.name)}
                  disabled={cart.includes(product.id)}
                >
                  {cart.includes(product.id) ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
