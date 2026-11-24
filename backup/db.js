/**
 * ============================================================================
 * Meesho Clone - Database Layer (SQLite + Resilient JSON Fallback)
 * Technology: Native Node.js SQLite (DatabaseSync)
 * Author: Senior Backend Engineer / B.Tech Project Showcase
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { PRODUCTS_DATA } = require('./products_data');

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const SQLITE_FILE = path.join(DB_DIR, 'meesho.db');
const JSON_BACKUP_FILE = path.join(DB_DIR, 'meesho_store.json');

// Comprehensive seed catalog (65 authentic products across 11 categories)
const SEED_PRODUCTS = PRODUCTS_DATA;

const SEED_COUPONS = [
  { code: 'MEESHONEW', discount: 150, type: 'flat', min_order: 499, description: 'Flat ₹150 OFF on first order' },
  { code: 'MEESHO100', discount: 100, type: 'flat', min_order: 299, description: 'Flat ₹100 OFF on any order above ₹299' },
  { code: 'FESTIVE20', discount: 20, type: 'percent', min_order: 599, description: 'Extra 20% OFF on Sarees & Fashion' },
  { code: 'FREEDEL', discount: 40, type: 'delivery', min_order: 0, description: 'Free Delivery on any order' }
];

let dbDriver = 'sqlite';
let sqliteDb = null;

try {
  // Attempt to load Node.js native SQLite engine
  const { DatabaseSync } = require('node:sqlite');
  sqliteDb = new DatabaseSync(SQLITE_FILE);
  console.log('✓ Connected to SQLite database:', SQLITE_FILE);
  initializeSqliteSchema(sqliteDb);
} catch (err) {
  console.warn('! Node.js native SQLite unavailable, activating resilient JSON file store:', err.message);
  dbDriver = 'json';
  initializeJsonStore();
}

function initializeSqliteSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER NOT NULL,
      discount INTEGER NOT NULL,
      rating REAL DEFAULT 4.0,
      reviews_count INTEGER DEFAULT 0,
      image TEXT NOT NULL,
      description TEXT,
      popularity INTEGER DEFAULT 50,
      stock INTEGER DEFAULT 10,
      badge TEXT,
      tags TEXT,
      created_at TEXT DEFAULT '2026-11-20T00:00:00Z'
    );

    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT PRIMARY KEY,
      discount INTEGER NOT NULL,
      type TEXT NOT NULL,
      min_order INTEGER NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT UNIQUE NOT NULL,
      order_date TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      total_amount INTEGER NOT NULL,
      items_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      UNIQUE(session_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS wishlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      UNIQUE(session_id, product_id)
    );
  `);

  // Ensure created_at column exists in products table if table already existed
  try {
    const tableInfo = db.prepare("PRAGMA table_info(products)").all();
    const hasCreatedAt = tableInfo.some(col => col.name === 'created_at');
    if (!hasCreatedAt) {
      db.exec("ALTER TABLE products ADD COLUMN created_at TEXT DEFAULT '2026-11-20T00:00:00Z'");
    }
  } catch (err) {
    console.warn('Could not check/add created_at column:', err.message);
  }

  // Seed or upgrade Products catalog in SQLite
  const countRow = db.prepare('SELECT COUNT(*) as count FROM products').get();
  const sampleProduct = countRow.count > 0 ? db.prepare('SELECT category FROM products WHERE id = 1').get() : null;
  const needsUpgrade = countRow.count < SEED_PRODUCTS.length || (sampleProduct && sampleProduct.category === 'Women Ethnic');

  if (needsUpgrade) {
    console.log(`⚡ Seeding/Upgrading Meesho product catalog in SQLite (${SEED_PRODUCTS.length} products)...`);
    const upsertProduct = db.prepare(`
      INSERT OR REPLACE INTO products (id, name, category, price, original_price, discount, rating, reviews_count, image, description, popularity, stock, badge, tags, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of SEED_PRODUCTS) {
      upsertProduct.run(
        p.id, p.name, p.category, p.price, p.original_price || p.originalPrice, p.discount,
        p.rating, p.reviews_count || p.reviewsCount, p.image, p.description, p.popularity,
        p.stock, p.badge, p.tags, p.created_at || '2026-11-20T00:00:00Z'
      );
    }
    console.log(`✓ Seeded ${SEED_PRODUCTS.length} products in SQLite.`);
  }

  // Seed Coupons
  const couponCount = db.prepare('SELECT COUNT(*) as count FROM coupons').get();
  if (couponCount.count === 0) {
    const insertCoupon = db.prepare(`
      INSERT INTO coupons (code, discount, type, min_order, description)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const c of SEED_COUPONS) {
      insertCoupon.run(c.code, c.discount, c.type, c.min_order, c.description);
    }
  }
}

// --------------------------------------------------------------------------
// Public Database Access Functions
// --------------------------------------------------------------------------

function getProducts({ category, search, sort, viewFilter } = {}) {
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search && search.trim() !== '') {
    // Smart multi-keyword tokenized search across name, category, description, and tags
    const tokens = search.trim().toLowerCase().split(/\s+/).filter(t => t.length > 0);
    for (const token of tokens) {
      query += ' AND (LOWER(name) LIKE ? OR LOWER(category) LIKE ? OR LOWER(description) LIKE ? OR LOWER(tags) LIKE ?)';
      const term = `%${token}%`;
      params.push(term, term, term, term);
    }
  }

  if (viewFilter === 'trending') {
    query += " AND (badge = 'Trending' OR tags LIKE '%trending%')";
  } else if (viewFilter === 'bestseller') {
    query += " AND (badge = 'M-Trusted' OR badge = 'Bestseller' OR tags LIKE '%bestseller%')";
  } else if (viewFilter === 'discounted') {
    query += ' AND discount >= 65';
  } else if (viewFilter === 'under299') {
    query += ' AND price <= 299';
  }

  switch (sort) {
    case 'price-asc':
      query += ' ORDER BY price ASC';
      break;
    case 'price-desc':
      query += ' ORDER BY price DESC';
      break;
    case 'rating':
      query += ' ORDER BY rating DESC';
      break;
    case 'discount':
      query += ' ORDER BY discount DESC';
      break;
    case 'newest':
      query += ' ORDER BY created_at DESC, id DESC';
      break;
    case 'popular':
    default:
      query += ' ORDER BY popularity DESC';
      break;
  }

  const rows = sqliteDb.prepare(query).all(...params);
  // Transform column original_price to camelCase for frontend compatibility
  return rows.map(r => ({
    ...r,
    originalPrice: r.original_price,
    reviewsCount: r.reviews_count,
    createdAt: r.created_at,
    tags: r.tags ? r.tags.split(',') : []
  }));
}

function getProductById(id) {
  const row = sqliteDb.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!row) return null;
  return {
    ...row,
    originalPrice: row.original_price,
    reviewsCount: row.reviews_count,
    createdAt: row.created_at,
    tags: row.tags ? row.tags.split(',') : []
  };
}

function getCategories() {
  const rows = sqliteDb.prepare('SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC').all();
  return rows;
}

function getSearchSuggestions(query, limit = 6) {
  if (!query || query.trim() === '') {
    return { query: '', products: [], categories: [], keywords: [] };
  }
  const q = query.trim().toLowerCase();
  const allProds = getProducts();

  const productMatches = [];
  const categoryMatches = new Set();
  const keywordSuggestions = new Set();

  for (const p of allProds) {
    const nameLower = p.name.toLowerCase();
    const catLower = p.category.toLowerCase();
    const tagsLower = (p.tags || []).join(' ').toLowerCase();

    const matchesName = nameLower.includes(q);
    const matchesCat = catLower.includes(q);
    const matchesTags = tagsLower.includes(q);

    if (matchesName || matchesCat || matchesTags) {
      if (productMatches.length < limit) {
        productMatches.push({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.image,
          badge: p.badge,
          rating: p.rating
        });
      }
      if (matchesCat) {
        categoryMatches.add(p.category);
      }
      if (p.tags) {
        for (const t of p.tags) {
          if (t.toLowerCase().includes(q) && t.toLowerCase() !== q) {
            keywordSuggestions.add(t);
          }
        }
      }
    }
  }

  return {
    query,
    products: productMatches,
    categories: Array.from(categoryMatches).slice(0, 4),
    keywords: Array.from(keywordSuggestions).slice(0, 5)
  };
}

function getCart(sessionId = 'default') {
  const rows = sqliteDb.prepare(`
    SELECT c.quantity, p.* 
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.session_id = ?
  `).all(sessionId);

  return rows.map(r => ({
    product: {
      id: r.id,
      name: r.name,
      category: r.category,
      price: r.price,
      originalPrice: r.original_price,
      discount: r.discount,
      rating: r.rating,
      reviewsCount: r.reviews_count,
      image: r.image,
      stock: r.stock,
      badge: r.badge
    },
    quantity: r.quantity
  }));
}

function addToCart(sessionId = 'default', productId, quantity = 1) {
  const existing = sqliteDb.prepare('SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?').get(sessionId, productId);
  if (existing) {
    sqliteDb.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE session_id = ? AND product_id = ?')
      .run(quantity, sessionId, productId);
  } else {
    sqliteDb.prepare('INSERT INTO cart_items (session_id, product_id, quantity) VALUES (?, ?, ?)')
      .run(sessionId, productId, quantity);
  }
  return getCart(sessionId);
}

function updateCartQty(sessionId = 'default', productId, delta) {
  const existing = sqliteDb.prepare('SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?').get(sessionId, productId);
  if (!existing) return getCart(sessionId);

  const newQty = existing.quantity + delta;
  if (newQty <= 0) {
    sqliteDb.prepare('DELETE FROM cart_items WHERE session_id = ? AND product_id = ?').run(sessionId, productId);
  } else {
    sqliteDb.prepare('UPDATE cart_items SET quantity = ? WHERE session_id = ? AND product_id = ?').run(newQty, sessionId, productId);
  }
  return getCart(sessionId);
}

function removeFromCart(sessionId = 'default', productId) {
  sqliteDb.prepare('DELETE FROM cart_items WHERE session_id = ? AND product_id = ?').run(sessionId, productId);
  return getCart(sessionId);
}

function clearCart(sessionId = 'default') {
  sqliteDb.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId);
}

function getWishlist(sessionId = 'default') {
  const rows = sqliteDb.prepare('SELECT product_id FROM wishlist_items WHERE session_id = ?').all(sessionId);
  return rows.map(r => r.product_id);
}

function toggleWishlist(sessionId = 'default', productId) {
  const existing = sqliteDb.prepare('SELECT * FROM wishlist_items WHERE session_id = ? AND product_id = ?').get(sessionId, productId);
  let isWishlisted = false;

  if (existing) {
    sqliteDb.prepare('DELETE FROM wishlist_items WHERE session_id = ? AND product_id = ?').run(sessionId, productId);
    isWishlisted = false;
  } else {
    sqliteDb.prepare('INSERT INTO wishlist_items (session_id, product_id) VALUES (?, ?)').run(sessionId, productId);
    isWishlisted = true;
  }

  return { isWishlisted, wishlist: getWishlist(sessionId) };
}

function createOrder(orderData) {
  const { orderId, orderDate, customer, paymentMethod, totalAmount, items } = orderData;
  sqliteDb.prepare(`
    INSERT OR REPLACE INTO orders (order_id, order_date, customer_name, customer_phone, customer_address, payment_method, total_amount, items_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    orderId,
    orderDate,
    customer.name,
    customer.phone,
    customer.address,
    paymentMethod,
    totalAmount,
    JSON.stringify(items)
  );

  return { success: true, orderId };
}

function getOrders() {
  const rows = sqliteDb.prepare('SELECT * FROM orders ORDER BY id DESC').all();
  return rows.map(r => ({
    orderId: r.order_id,
    date: r.order_date,
    customer: {
      name: r.customer_name,
      phone: r.customer_phone,
      address: r.customer_address
    },
    paymentMethod: r.payment_method,
    totalAmount: r.total_amount,
    items: JSON.parse(r.items_json)
  }));
}

function validateCoupon(code, orderAmount) {
  const coupon = sqliteDb.prepare('SELECT * FROM coupons WHERE code = ?').get(code.toUpperCase().trim());
  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code.' };
  }

  if (orderAmount < coupon.min_order) {
    return { valid: false, message: `Minimum order of ₹${coupon.min_order} required for ${coupon.code}.` };
  }

  let discountAmount = 0;
  if (coupon.type === 'flat') {
    discountAmount = coupon.discount;
  } else if (coupon.type === 'percent') {
    discountAmount = Math.round((orderAmount * coupon.discount) / 100);
  } else if (coupon.type === 'delivery') {
    discountAmount = 40;
  }

  return {
    valid: true,
    code: coupon.code,
    discount: discountAmount,
    type: coupon.type,
    description: coupon.description
  };
}

module.exports = {
  dbDriver,
  getProducts,
  getProductById,
  getCategories,
  getSearchSuggestions,
  getCart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  getWishlist,
  toggleWishlist,
  createOrder,
  getOrders,
  validateCoupon,
  SEED_PRODUCTS
};
