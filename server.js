/**
 * ============================================================================
 * Meesho Clone - Express REST API Server
 * Backend & Database Layer for B.Tech Project Demonstration
 * Technology: Node.js (v24), Express, SQLite (meesho.db)
 * Author: Senior Backend Engineer / B.Tech Project Showcase
 * ============================================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend assets directly from root directory
app.use(express.static(path.join(__dirname)));

// Request Logger for demonstration & debugging
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toLocaleTimeString('en-IN')}] ${req.method} ${req.url}`);
  }
  next();
});

// Helper to extract session ID (for cart/wishlist persistence across different clients)
function getSessionId(req) {
  return req.headers['x-session-id'] || req.query.sessionId || 'default_user';
}

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

// 1. Health & Server Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'Myntra Fashion E-Commerce Full-Stack Application',
    technology: 'Node.js + Express + SQLite Database',
    databaseDriver: db.dbDriver,
    timestamp: new Date().toISOString()
  });
});

// 2. Products Catalog with multi-faceted filtering (category, search, sort, brand, size, price range)
app.get('/api/products', (req, res) => {
  try {
    const { category, search, sort, viewFilter, brand, size, priceMin, priceMax } = req.query;
    const products = db.getProducts({ category, search, sort, viewFilter, brand, size, priceMin, priceMax });
    res.json({
      success: true,
      total: products.length,
      data: products
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, error: 'Database error fetching products' });
  }
});

// 2b. Live Search Suggestions (Autocomplete - Defined before :id param route)
app.get('/api/products/suggestions', (req, res) => {
  try {
    const q = req.query.q || req.query.search || '';
    const limit = parseInt(req.query.limit, 10) || 6;
    const suggestions = db.getSearchSuggestions(q, limit);
    res.json({ success: true, ...suggestions });
  } catch (err) {
    console.error('Error fetching search suggestions:', err);
    res.status(500).json({ success: false, error: 'Error fetching search suggestions' });
  }
});

// 2c. Brands List
app.get('/api/brands', (req, res) => {
  try {
    const brands = db.getBrands();
    res.json({ success: true, total: brands.length, data: brands });
  } catch (err) {
    console.error('Error fetching brands:', err);
    res.status(500).json({ success: false, error: 'Error fetching brands' });
  }
});

// 3. Single Product Details
app.get('/api/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = db.getProductById(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error fetching product details' });
  }
});

// 4. Categories & Product Counts
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error fetching categories' });
  }
});

// 5. Shopping Cart Endpoints
app.get('/api/cart', (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const items = db.getCart(sessionId);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error fetching cart' });
  }
});

app.post('/api/cart', (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId, quantity = 1, size = 'M' } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: 'productId is required' });
    }

    const updatedCart = db.addToCart(sessionId, parseInt(productId, 10), parseInt(quantity, 10), size);
    res.json({ success: true, message: 'Item added to cart', items: updatedCart });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ success: false, error: 'Error adding to cart' });
  }
});

app.put('/api/cart/:productId', (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const productId = parseInt(req.params.productId, 10);
    const { delta = 1 } = req.body;

    const updatedCart = db.updateCartQty(sessionId, productId, delta);
    res.json({ success: true, items: updatedCart });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error updating cart quantity' });
  }
});

app.delete('/api/cart/:productId', (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const productId = parseInt(req.params.productId, 10);
    const updatedCart = db.removeFromCart(sessionId, productId);
    res.json({ success: true, message: 'Item removed from cart', items: updatedCart });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error removing from cart' });
  }
});

// 6. Wishlist Endpoints
app.get('/api/wishlist', (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const wishlist = db.getWishlist(sessionId);
    res.json({ success: true, wishlist });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error fetching wishlist' });
  }
});

app.post('/api/wishlist', (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: 'productId is required' });
    }

    const result = db.toggleWishlist(sessionId, parseInt(productId, 10));
    res.json({
      success: true,
      isWishlisted: result.isWishlisted,
      wishlist: result.wishlist
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error toggling wishlist' });
  }
});

// 7. Orders & Checkout Endpoints
app.post('/api/orders', (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { customer, paymentMethod, items, totalAmount } = req.body;

    // Server-Side Validations
    if (!customer || !customer.name || customer.name.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Full name is required (min 3 chars)' });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!customer.phone || !phoneRegex.test(customer.phone.replace(/\s+/g, ''))) {
      return res.status(400).json({ success: false, error: 'Valid 10-digit Indian phone number required' });
    }

    if (!customer.address || customer.address.trim().length < 8) {
      return res.status(400).json({ success: false, error: 'Complete street address is required' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must contain at least 1 item' });
    }

    // Generate Unique Order ID
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `MEESHO-ORD-2026-${randomSuffix}`;
    const orderDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const orderData = {
      orderId,
      orderDate,
      customer,
      paymentMethod: paymentMethod || 'Cash On Delivery',
      totalAmount: parseInt(totalAmount, 10) || 0,
      items
    };

    db.createOrder(orderData);
    db.clearCart(sessionId); // Clear cart upon successful order placement

    res.status(201).json({
      success: true,
      message: 'Order created and saved in SQLite database',
      order: orderData
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, error: 'Internal server error creating order' });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    const orders = db.getOrders();
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Error fetching order history' });
  }
});

// 8. Coupon Validation Endpoint
app.post('/api/coupons/apply', (req, res) => {
  try {
    const { code, orderAmount = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Coupon code required' });
    }

    const result = db.validateCoupon(code, parseInt(orderAmount, 10));
    res.json(result);
  } catch (err) {
    res.status(500).json({ valid: false, message: 'Error checking coupon' });
  }
});

// Root fallback to index.html for SPA routing (with explicit static asset defense)
app.get('*', (req, res) => {
  if (req.path.endsWith('.css')) {
    return res.type('text/css').sendFile(path.join(__dirname, 'style.css'));
  }
  if (req.path.endsWith('.js')) {
    const filename = path.basename(req.path);
    return res.type('application/javascript').sendFile(path.join(__dirname, filename));
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server when executed directly (node server.js)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🛍️  Meesho Clone Full-Stack Server Running`);
    console.log(`  🌐  Local URL:   http://localhost:${PORT}`);
    console.log(`  🗄️  Database:    SQLite (data/meesho.db)`);
    console.log(`  ⚡  REST API:    http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
}

// Export Express app for Vercel Serverless Functions
module.exports = app;
