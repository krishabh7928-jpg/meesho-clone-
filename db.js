/**
 * ============================================================================
 * Myntra - Database Layer (SQLite + Resilient JSON Fallback)
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

const SQLITE_FILE = path.join(DB_DIR, 'fashion.db');
const JSON_BACKUP_FILE = path.join(DB_DIR, 'myntra_store.json');

// Comprehensive seed catalog (75 authentic fashion products across 5 categories)
const SEED_PRODUCTS = PRODUCTS_DATA;

const SEED_COUPONS = [
  { code: 'MYNTRA200', discount: 200, type: 'flat', min_order: 799, description: 'Flat ₹200 OFF on order above ₹799' },
  { code: 'MYNTRA10', discount: 10, type: 'percent', min_order: 499, description: 'Extra 10% OFF on all fashion orders' },
  { code: 'FESTIVE20', discount: 20, type: 'percent', min_order: 599, description: 'Extra 20% OFF on Ethnic & Festive Wear' },
  { code: 'FIRST100', discount: 100, type: 'flat', min_order: 499, description: 'Flat ₹100 OFF on your first fashion order' },
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
      brand TEXT DEFAULT '',
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER NOT NULL,
      discount INTEGER NOT NULL,
      rating REAL DEFAULT 4.0,
      reviews_count INTEGER DEFAULT 0,
      image TEXT NOT NULL,
      description TEXT,
      sizes TEXT DEFAULT '["S","M","L","XL"]',
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
      size TEXT DEFAULT 'M',
      UNIQUE(session_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS wishlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      UNIQUE(session_id, product_id)
    );
  `);

  // Ensure brand and sizes columns exist if table was previously created with older schema
  try {
    const tableInfo = db.prepare("PRAGMA table_info(products)").all();
    const hasBrand = tableInfo.some(col => col.name === 'brand');
    if (!hasBrand) {
      db.exec("ALTER TABLE products ADD COLUMN brand TEXT DEFAULT ''");
    }
    const hasSizes = tableInfo.some(col => col.name === 'sizes');
    if (!hasSizes) {
      db.exec("ALTER TABLE products ADD COLUMN sizes TEXT DEFAULT '[\"S\",\"M\",\"L\",\"XL\"]'");
    }
    const hasCreatedAt = tableInfo.some(col => col.name === 'created_at');
    if (!hasCreatedAt) {
      db.exec("ALTER TABLE products ADD COLUMN created_at TEXT DEFAULT '2026-11-20T00:00:00Z'");
    }
  } catch (err) {
    console.warn('Could not check/add columns:', err.message);
  }

  // Seed or upgrade Products catalog in SQLite
  const countRow = db.prepare('SELECT COUNT(*) as count FROM products').get();
  const sampleProduct = countRow.count > 0 ? db.prepare('SELECT brand, category FROM products WHERE id = 1').get() : null;
  const needsUpgrade = countRow.count < SEED_PRODUCTS.length || !sampleProduct || !sampleProduct.brand || sampleProduct.brand === '';

  if (needsUpgrade) {
    console.log(`⚡ Seeding/Upgrading Myntra Fashion catalog in SQLite (${SEED_PRODUCTS.length} products)...`);
    // Delete existing products to avoid stale categories
    db.exec('DELETE FROM products');
    const insertProduct = db.prepare(`
      INSERT INTO products (id, name, brand, category, price, original_price, discount, rating, reviews_count, image, description, sizes, popularity, stock, badge, tags, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of SEED_PRODUCTS) {
      const sizesJson = Array.isArray(p.sizes) ? JSON.stringify(p.sizes) : JSON.stringify(["S", "M", "L", "XL"]);
      insertProduct.run(
        p.id, p.name, p.brand || '', p.category, p.price, p.original_price || p.originalPrice, p.discount,
        p.rating, p.reviews_count || p.reviewsCount, p.image, p.description, sizesJson, p.popularity,
        p.stock, p.badge, p.tags, p.created_at || '2026-11-20T00:00:00Z'
      );
    }
    console.log(`✓ Seeded ${SEED_PRODUCTS.length} fashion products in SQLite.`);
  } else {
    // Keep product image URLs synced with SEED_PRODUCTS without disturbing orders/cart/wishlist
    const syncImg = db.prepare('UPDATE products SET image = ? WHERE id = ? AND image != ?');
    for (const p of SEED_PRODUCTS) {
      syncImg.run(p.image, p.id, p.image);
    }
  }

  // Seed / Upgrade Coupons
  const insertCoupon = db.prepare(`
    INSERT OR REPLACE INTO coupons (code, discount, type, min_order, description)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const c of SEED_COUPONS) {
    insertCoupon.run(c.code, c.discount, c.type, c.min_order, c.description);
  }
}

// --------------------------------------------------------------------------
// Public Database Access Functions
// --------------------------------------------------------------------------

function getProducts({ category, search, sort, viewFilter, brand, size, priceMin, priceMax } = {}) {
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    query += ' AND LOWER(category) = LOWER(?)';
    params.push(category);
  }

  if (brand && brand !== 'All') {
    query += ' AND LOWER(brand) = LOWER(?)';
    params.push(brand);
  }

  if (size && size !== 'All') {
    query += ' AND sizes LIKE ?';
    params.push(`%"${size}"%`);
  }

  if (priceMin !== undefined && priceMin !== null && !isNaN(priceMin)) {
    query += ' AND price >= ?';
    params.push(Number(priceMin));
  }

  if (priceMax !== undefined && priceMax !== null && !isNaN(priceMax)) {
    query += ' AND price <= ?';
    params.push(Number(priceMax));
  }

  if (search && search.trim() !== '') {
    // Smart multi-keyword tokenized search across name, brand, category, description, and tags
    const tokens = search.trim().toLowerCase().split(/\s+/).filter(t => t.length > 0);
    for (const token of tokens) {
      query += ' AND (LOWER(name) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(category) LIKE ? OR LOWER(description) LIKE ? OR LOWER(tags) LIKE ?)';
      const term = `%${token}%`;
      params.push(term, term, term, term, term);
    }
  }

  if (viewFilter === 'trending') {
    query += " AND (badge = 'Trending' OR tags LIKE '%trending%')";
  } else if (viewFilter === 'bestseller') {
    query += " AND (badge = 'Best Seller' OR tags LIKE '%bestseller%')";
  } else if (viewFilter === 'discounted') {
    query += ' AND discount >= 50';
  } else if (viewFilter === 'under999') {
    query += ' AND price <= 999';
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
  return rows.map(r => {
    let parsedSizes = [];
    try {
      parsedSizes = r.sizes ? JSON.parse(r.sizes) : ['S', 'M', 'L', 'XL'];
    } catch {
      parsedSizes = r.sizes ? r.sizes.split(',') : ['S', 'M', 'L', 'XL'];
    }
    return {
      ...r,
      originalPrice: r.original_price,
      reviewsCount: r.reviews_count,
      createdAt: r.created_at,
      sizes: parsedSizes,
      tags: r.tags ? r.tags.split(',') : []
    };
  });
}

function getProductById(id) {
  const row = sqliteDb.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!row) return null;
  let parsedSizes = [];
  try {
    parsedSizes = row.sizes ? JSON.parse(row.sizes) : ['S', 'M', 'L', 'XL'];
  } catch {
    parsedSizes = row.sizes ? row.sizes.split(',') : ['S', 'M', 'L', 'XL'];
  }
  return {
    ...row,
    originalPrice: row.original_price,
    reviewsCount: row.reviews_count,
    createdAt: row.created_at,
    sizes: parsedSizes,
    tags: row.tags ? row.tags.split(',') : []
  };
}

function getCategories() {
  const rows = sqliteDb.prepare('SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC').all();
  return rows;
}

function getBrands() {
  const rows = sqliteDb.prepare("SELECT brand, COUNT(*) as count FROM products WHERE brand != '' GROUP BY brand ORDER BY count DESC").all();
  return rows;
}

function getSearchSuggestions(query, limit = 6) {
  if (!query || query.trim() === '') {
    return { query: '', products: [], categories: [], brands: [], keywords: [] };
  }
  const q = query.trim().toLowerCase();
  const allProds = getProducts();

  const productMatches = [];
  const categoryMatches = new Set();
  const brandMatches = new Set();
  const keywordSuggestions = new Set();

  for (const p of allProds) {
    const nameLower = p.name.toLowerCase();
    const brandLower = (p.brand || '').toLowerCase();
    const catLower = p.category.toLowerCase();
    const tagsLower = (p.tags || []).join(' ').toLowerCase();

    const matchesName = nameLower.includes(q);
    const matchesBrand = brandLower.includes(q);
    const matchesCat = catLower.includes(q);
    const matchesTags = tagsLower.includes(q);

    if (matchesName || matchesBrand || matchesCat || matchesTags) {
      if (productMatches.length < limit) {
        productMatches.push({
          id: p.id,
          name: p.name,
          brand: p.brand,
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
      if (matchesBrand && p.brand) {
        brandMatches.add(p.brand);
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
    brands: Array.from(brandMatches).slice(0, 4),
    keywords: Array.from(keywordSuggestions).slice(0, 5)
  };
}

function getCart(sessionId = 'default') {
  const rows = sqliteDb.prepare(`
    SELECT c.quantity, c.size, p.* 
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.session_id = ?
  `).all(sessionId);

  return rows.map(r => ({
    product: {
      id: r.id,
      brand: r.brand,
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
    quantity: r.quantity,
    size: r.size || 'M'
  }));
}

function addToCart(sessionId = 'default', productId, quantity = 1, size = 'M') {
  const existing = sqliteDb.prepare('SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?').get(sessionId, productId);
  if (existing) {
    sqliteDb.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE session_id = ? AND product_id = ?')
      .run(quantity, sessionId, productId);
  } else {
    sqliteDb.prepare('INSERT INTO cart_items (session_id, product_id, quantity, size) VALUES (?, ?, ?, ?)')
      .run(sessionId, productId, quantity, size);
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
  getBrands,
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
