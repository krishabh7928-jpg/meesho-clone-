/**
 * ============================================================================
 * Meesho Clone - Database Layer (SQLite + Resilient JSON Fallback)
 * Technology: Native Node.js SQLite (DatabaseSync)
 * Author: Senior Backend Engineer / B.Tech Project Showcase
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const SQLITE_FILE = path.join(DB_DIR, 'meesho.db');
const JSON_BACKUP_FILE = path.join(DB_DIR, 'meesho_store.json');

// Initial seed catalog (22 authentic Meesho products)
const SEED_PRODUCTS = [
  {
    id: 1,
    name: "Charvi Sensational Embroidered Rayon Anarkali Kurta Set",
    category: "Women Ethnic",
    price: 649,
    original_price: 1999,
    discount: 67,
    rating: 4.4,
    reviews_count: 4820,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    description: "Gorgeous Rayon Anarkali Kurta paired with matching Palazzos and chiffon printed dupatta. Features delicate golden Zari embroidery around the neckline. Perfect for festivals, family functions, and festive celebrations.",
    popularity: 98,
    stock: 15,
    badge: "M-Trusted",
    tags: "trending,bestseller,ethnic,kurti,saree"
  },
  {
    id: 2,
    name: "Aishani Alluring Pure Kanjeevaram Jacquard Silk Saree",
    category: "Women Ethnic",
    price: 899,
    original_price: 2999,
    discount: 70,
    rating: 4.6,
    reviews_count: 6120,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
    description: "Traditional South Indian Kanjeevaram woven soft silk saree embellished with rich temple border and designer Zari pallu. Includes 0.8m unstitched contrast designer blouse piece.",
    popularity: 99,
    stock: 8,
    badge: "Trending",
    tags: "trending,ethnic,saree,bestseller"
  },
  {
    id: 3,
    name: "Kashvi Pretty Floral Pure Cotton Maxi Tiered Dress",
    category: "Women Western",
    price: 479,
    original_price: 1299,
    discount: 63,
    rating: 4.3,
    reviews_count: 1820,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
    description: "Breathable pure cotton tiered maxi dress with flattering puff sleeves and a matching tie-up fabric belt. Comfortable for summer outings, brunches, and college wear.",
    popularity: 88,
    stock: 12,
    badge: "60%+ OFF",
    tags: "western,casual,dress"
  },
  {
    id: 4,
    name: "Trendy Men's Cotton Linen Mandarin Collar Casual Shirt",
    category: "Men",
    price: 429,
    original_price: 1199,
    discount: 64,
    rating: 4.3,
    reviews_count: 2810,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    description: "Premium breathable cotton-linen blend casual shirt with modern Mandarin collar and roll-up sleeves. Soft washed fabric for supreme all-day comfort in tropical climates.",
    popularity: 91,
    stock: 20,
    badge: "Hot Deal",
    tags: "trending,menswear,shirt"
  },
  {
    id: 5,
    name: "Urbano Men's Slim Fit Stretchable Denim Jeans (Dark Indigo)",
    category: "Men",
    price: 599,
    original_price: 1699,
    discount: 65,
    rating: 4.2,
    reviews_count: 2980,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    description: "Authentic heavy-duty cotton denim with 2% elastane for unrestricted stretch and flexibility. Features classic 5-pocket styling and scratch-resistant brass zip fly.",
    popularity: 87,
    stock: 14,
    badge: "M-Trusted",
    tags: "bestseller,jeans,menswear"
  },
  {
    id: 6,
    name: "Streetwear Men's Oversized Graphic Print Cotton T-Shirt",
    category: "Men",
    price: 279,
    original_price: 799,
    discount: 65,
    rating: 4.5,
    reviews_count: 5320,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    description: "100% bio-washed 220 GSM combed cotton oversized streetwear t-shirt with aesthetic typography graphic print. Non-shrinkable and colorfast wash guarantee.",
    popularity: 95,
    stock: 25,
    badge: "Under ₹299",
    tags: "streetwear,casual,under299"
  },
  {
    id: 7,
    name: "Rajasthani Handcrafted Floral Embroidered Ethnic Mojari Juttis",
    category: "Bags & Footwear",
    price: 349,
    original_price: 999,
    discount: 65,
    rating: 4.5,
    reviews_count: 3890,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
    description: "Handcrafted authentic Jaipuri leather mojari juttis featuring rich silk thread embroidery and foam cushion footbed for all-day festive comfort. Pairs gracefully with sarees and kurtas.",
    popularity: 94,
    stock: 18,
    badge: "M-Trusted",
    tags: "footwear,ethnic,juttis,shoes"
  },
  {
    id: 8,
    name: "Women's Textured Vegan Leather Crossbody Shoulder Handbag",
    category: "Bags & Footwear",
    price: 499,
    original_price: 1499,
    discount: 66,
    rating: 4.4,
    reviews_count: 4120,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    description: "Elegant textured vegan leather shoulder bag with detachable crossbody strap. Features spacious dual compartments, interior zippered pocket, and polished gold-tone hardware.",
    popularity: 93,
    stock: 11,
    badge: "Trending",
    tags: "trending,bag,handbag,fashion"
  },
  {
    id: 9,
    name: "AeroTune True Wireless Earbuds with ENC & 45h Playtime",
    category: "Electronics",
    price: 799,
    original_price: 2499,
    discount: 68,
    rating: 4.5,
    reviews_count: 7730,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    description: "Crystal-clear calls powered by Quad Mic Environmental Noise Cancellation (ENC). Ultra-low 40ms gaming latency, 13mm dynamic bass drivers, and IPX5 splash resistance.",
    popularity: 99,
    stock: 22,
    badge: "M-Trusted",
    tags: "trending,bestseller,gadget,audio"
  },
  {
    id: 10,
    name: "PulseFit 1.96\" AMOLED Smartwatch with BT Calling & SpO2",
    category: "Electronics",
    price: 1199,
    original_price: 3999,
    discount: 70,
    rating: 4.4,
    reviews_count: 3920,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    description: "Vibrant always-on AMOLED display with 600 nits peak brightness. Built-in speaker and mic for wrist calling, 120+ sports tracking modes, 24/7 heart rate and blood oxygen monitoring.",
    popularity: 96,
    stock: 9,
    badge: "Trending",
    tags: "trending,smartwatch,fitness"
  },
  {
    id: 11,
    name: "FastCharge 20,000mAh Power Bank with 22.5W Two-Way QC",
    category: "Electronics",
    price: 899,
    original_price: 2199,
    discount: 59,
    rating: 4.6,
    reviews_count: 3190,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80",
    description: "High-density Lithium-Polymer cell with dual USB output and Type-C PD input/output. Charges smartphones up to 4 times on a single refill. 12-layer advanced circuit protection.",
    popularity: 88,
    stock: 14,
    badge: "Hot Deal",
    tags: "electronics,charger,travel"
  },
  {
    id: 12,
    name: "Non-Stick 3-Piece Granite Kitchen Cookware Set",
    category: "Home & Kitchen",
    price: 999,
    original_price: 2999,
    discount: 66,
    rating: 4.7,
    reviews_count: 4680,
    image: "https://images.unsplash.com/photo-1584990347449-a292886f4553?auto=format&fit=crop&w=600&q=80",
    description: "5-layer scratch-resistant German granite coating. Set includes 24cm Dosa Tawa, 24cm Frying Pan, and 2.5L Kadhai with tempered glass lid. Induction and gas stove compatible.",
    popularity: 93,
    stock: 7,
    badge: "M-Trusted",
    tags: "bestseller,kitchen,cookware"
  },
  {
    id: 13,
    name: "100% Pure Cotton Jaipuri Floral Double Bedsheet with 2 Pillows",
    category: "Home & Kitchen",
    price: 369,
    original_price: 999,
    discount: 63,
    rating: 4.3,
    reviews_count: 5610,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
    description: "King size (90x100 inches) 180 TC breathable cotton bedsheet. Fade-resistant reactive digital printing with soft skin-friendly texture. Machine washable.",
    popularity: 92,
    stock: 30,
    badge: "Trending",
    tags: "trending,homedecor,bedsheet"
  },
  {
    id: 14,
    name: "Stainless Steel Insulated 1000ml Thermal Water Bottle",
    category: "Home & Kitchen",
    price: 299,
    original_price: 899,
    discount: 67,
    rating: 4.5,
    reviews_count: 3980,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
    description: "Double-walled vacuum insulation keeps liquids icy cold for 24 hours or piping hot for 12 hours. Made of food-grade 304 stainless steel with leak-proof screw cap.",
    popularity: 89,
    stock: 22,
    badge: "Under ₹299",
    tags: "kitchen,fitness,bottle,under299"
  },
  {
    id: 15,
    name: "Vitamin C Glow Serum 30ml with Hyaluronic Acid & Ferulic",
    category: "Beauty & Health",
    price: 279,
    original_price: 699,
    discount: 60,
    rating: 4.6,
    reviews_count: 8890,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    description: "Advanced brightening facial serum formulated with 10% stable Vitamin C and multi-molecular Hyaluronic Acid. Fades dark spots, sun damage, and boosts radiant glowing skin.",
    popularity: 97,
    stock: 16,
    badge: "M-Trusted",
    tags: "bestseller,skincare,beauty,under299"
  },
  {
    id: 16,
    name: "Velvet Matte Liquid Lipstick Combo Set of 4 Shades",
    category: "Beauty & Health",
    price: 299,
    original_price: 999,
    discount: 70,
    rating: 4.3,
    reviews_count: 4520,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
    description: "Smudge-proof, waterproof, 12-hour transfer-proof matte liquid lipsticks infused with Vitamin E and Jojoba oil. Includes 4 universally flattering Indian skin tone shades (Nude, Berry, Red, Coral).",
    popularity: 92,
    stock: 14,
    badge: "Under ₹299",
    tags: "trending,makeup,cosmetics,under299"
  },
  {
    id: 17,
    name: "Organic Arabica Coffee Face & Body Scrub (100g)",
    category: "Beauty & Health",
    price: 199,
    original_price: 499,
    discount: 60,
    rating: 4.4,
    reviews_count: 2710,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    description: "Exfoliating raw coffee scrub with cold-pressed coconut oil. Gently removes dead skin cells, tan, and reduces cellulite appearance. 100% vegan and cruelty-free.",
    popularity: 85,
    stock: 28,
    badge: "Under ₹199",
    tags: "skincare,beauty,under299"
  },
  {
    id: 18,
    name: "Ethnic Kundan & Pearl Gold-Plated Choker Jewellery Set",
    category: "Jewellery & Accessories",
    price: 449,
    original_price: 1499,
    discount: 70,
    rating: 4.5,
    reviews_count: 4170,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    description: "Handcrafted traditional bridal Kundan necklace with matching Jhumka earrings and Maang Tikka. High-polish micron gold plating with cluster pearl drops.",
    popularity: 95,
    stock: 12,
    badge: "M-Trusted",
    tags: "jewellery,ethnic,bestseller"
  },
  {
    id: 19,
    name: "Polarized UV400 Protection Classic Aviator Sunglasses",
    category: "Jewellery & Accessories",
    price: 249,
    original_price: 799,
    discount: 68,
    rating: 4.4,
    reviews_count: 5290,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    description: "Timeless teardrop aviator frame with tri-acetate polarized lenses that block 100% of UVA & UVB rays. Feather-light metallic frame with comfortable silicone nose pads.",
    popularity: 91,
    stock: 19,
    badge: "Under ₹299",
    tags: "accessories,sunglasses,under299"
  },
  {
    id: 20,
    name: "Men's Genuine Leather Slim RFID-Blocking Bifold Wallet",
    category: "Jewellery & Accessories",
    price: 299,
    original_price: 899,
    discount: 66,
    rating: 4.6,
    reviews_count: 3340,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
    description: "Crafted from top-grain oil-waxed leather. Integrated RFID electromagnetic shielding protects your credit cards from unauthorized digital scans. Features 8 card slots and 2 currency pockets.",
    popularity: 88,
    stock: 15,
    badge: "Under ₹299",
    tags: "accessories,wallet,leather,under299"
  },
  {
    id: 21,
    name: "Universal Ergonomic Aluminum Laptop & Tablet Stand",
    category: "Electronics",
    price: 399,
    original_price: 1099,
    discount: 63,
    rating: 4.7,
    reviews_count: 4510,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
    description: "Solid CNC aluminum alloy riser with 6-level adjustable angles to relieve neck pain. Foldable portable design with non-slip silicone pads and heat ventilation hollow frame.",
    popularity: 90,
    stock: 24,
    badge: "Top Rated",
    tags: "electronics,workfromhome,laptop"
  },
  {
    id: 22,
    name: "Women's Printed Georgette Party Wear Anarkali Gown",
    category: "Women Ethnic",
    price: 549,
    original_price: 1799,
    discount: 69,
    rating: 4.5,
    reviews_count: 3210,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    description: "Flowy micro-georgette festive Anarkali gown with digital floral prints and crepe lining. Includes matching dupatta with lace border.",
    popularity: 94,
    stock: 16,
    badge: "Trending",
    tags: "ethnic,anarkali,gown,trending"
  }
];

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
      tags TEXT
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

  // Seed Products if table is empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (countRow.count === 0) {
    console.log('⚡ Seeding initial Meesho product catalog to SQLite...');
    const insertProduct = db.prepare(`
      INSERT INTO products (id, name, category, price, original_price, discount, rating, reviews_count, image, description, popularity, stock, badge, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of SEED_PRODUCTS) {
      insertProduct.run(
        p.id, p.name, p.category, p.price, p.original_price, p.discount,
        p.rating, p.reviews_count, p.image, p.description, p.popularity,
        p.stock, p.badge, p.tags
      );
    }
    console.log(`✓ Seeded ${SEED_PRODUCTS.length} products.`);
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
    query += ' AND (name LIKE ? OR category LIKE ? OR description LIKE ? OR tags LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term, term, term);
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
    tags: row.tags ? row.tags.split(',') : []
  };
}

function getCategories() {
  const rows = sqliteDb.prepare('SELECT category, COUNT(*) as count FROM products GROUP BY category').all();
  return rows;
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
    INSERT INTO orders (order_id, order_date, customer_name, customer_phone, customer_address, payment_method, total_amount, items_json)
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
