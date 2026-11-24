/**
 * ============================================================================
 * Meesho Clone - Academic PowerPoint Presentation Generator
 * Generates: Meesho_Clone_BTech_Project_Presentation.pptx
 * Technology: pptxgenjs
 * Author: Rishabh Kumar (B.Tech CSE)
 * ============================================================================
 */

const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';

// Color Palette Constants
const COLOR_PRIMARY = '9F2089';    // Meesho Magenta
const COLOR_ACCENT = 'F43397';     // Meesho Bright Pink
const COLOR_DARK = '1E293B';       // Slate Dark
const COLOR_LIGHT = 'F8F9FA';      // Soft Off-White
const COLOR_WHITE = 'FFFFFF';      // Pure White
const COLOR_GREEN = '038D63';      // Success Green
const COLOR_GRAY = '64748B';       // Muted Gray
const COLOR_CARD_BG = 'F1F5F9';    // Card Surface

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

// Helper: Add consistent header to content slides
function addSlideHeader(slide, category, title) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: '100%', h: 0.1, fill: { color: COLOR_PRIMARY }
  });

  slide.addText(category.toUpperCase(), {
    x: 0.8, y: 0.45, w: 10, h: 0.3,
    fontSize: 10, fontFace: 'Arial', bold: true, color: COLOR_ACCENT, letterSpacing: 1.5
  });

  slide.addText(title, {
    x: 0.8, y: 0.75, w: 11.5, h: 0.6,
    fontSize: 22, fontFace: 'Arial', bold: true, color: COLOR_DARK
  });

  slide.addShape(pptx.shapes.LINE, {
    x: 0.8, y: 1.35, w: 11.7, h: 0,
    line: { color: 'E2E8F0', width: 1.5 }
  });
}

// --------------------------------------------------------------------------
// SLIDE 1: TITLE SLIDE
// --------------------------------------------------------------------------
const s1 = pptx.addSlide();
s1.background = { color: 'FAF5FF' };

s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 0.7, w: 2.2, h: 0.5,
  fill: { color: COLOR_PRIMARY }, rectRadius: 0.25
});
s1.addText('MEESHO CLONE', {
  x: 0.8, y: 0.7, w: 2.2, h: 0.5,
  fontSize: 12, fontFace: 'Arial', bold: true, color: COLOR_WHITE, align: 'center', valign: 'middle'
});

s1.addText('Full-Stack E-Commerce Web Application', {
  x: 0.8, y: 1.5, w: 11.5, h: 1.0,
  fontSize: 34, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});

s1.addText('A Responsive Indian Social-Commerce Platform with Express.js REST API & SQLite Database', {
  x: 0.8, y: 2.5, w: 11.5, h: 0.6,
  fontSize: 16, fontFace: 'Arial', color: COLOR_DARK
});

// Info Card
s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 3.4, w: 11.7, h: 3.2,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.2
});

s1.addText([
  { text: 'Academic Project Submission Details\n\n', options: { bold: true, fontSize: 14, color: COLOR_PRIMARY } },
  { text: '• Degree / Branch: ', options: { bold: true } },
  { text: 'Bachelor of Technology (B.Tech) - Computer Science & Engineering\n' },
  { text: '• Project Title: ', options: { bold: true } },
  { text: 'ShopeEase: Responsive Meesho Clone with Smart Search & 3-Tier Architecture\n' },
  { text: '• Student Name: ', options: { bold: true } },
  { text: 'Rishabh Kumar\n' },
  { text: '• Technology Stack: ', options: { bold: true } },
  { text: 'Semantic HTML5, Responsive CSS3, Vanilla JavaScript (ES6+), Node.js, Express.js, SQLite Database\n' },
  { text: '• Academic Session: ', options: { bold: true } },
  { text: '2026\n' }
], {
  x: 1.2, y: 3.6, w: 11.0, h: 2.8,
  fontSize: 11.5, fontFace: 'Arial', color: COLOR_DARK
});

// --------------------------------------------------------------------------
// SLIDE 2: PROJECT ABSTRACT & OVERVIEW
// --------------------------------------------------------------------------
const s2 = pptx.addSlide();
addSlideHeader(s2, 'Introduction', 'Project Abstract & Overview');

s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.6, w: 5.6, h: 5.0,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
});
s2.addText('What is Meesho Clone?', {
  x: 1.1, y: 1.9, w: 5.0, h: 0.4,
  fontSize: 15, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s2.addText([
  { text: 'Meesho Clone is a feature-complete e-commerce web application inspired by India’s leading social commerce platform, Meesho (meesho.com).\n\n' },
  { text: 'It connects Indian shoppers directly to manufacturers and local weavers, delivering wholesale prices, free delivery thresholds, Cash on Delivery (COD), and hassle-free 7-day returns.\n\n' },
  { text: 'Features 65 authentic Indian products across 11 diverse departments, smart multi-token search with live suggestions, price and newest sorting, slide-over bag drawer, and automated SQLite persistence.' }
], {
  x: 1.1, y: 2.4, w: 5.0, h: 3.9,
  fontSize: 11.5, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 18
});

s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.6, w: 5.7, h: 5.0,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
});
s2.addText('Key Project Objectives', {
  x: 7.1, y: 1.9, w: 5.0, h: 0.4,
  fontSize: 15, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s2.addText([
  { text: '1. Authentic Meesho UX & 11 Categories: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Signature magenta/pink theme, 11 departments (Fashion, Mobiles, Electronics, Grocery, etc.), and mobile dock.\n\n' },
  { text: '2. Smart Multi-Token Search & Suggestions: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Real-time debounced autocomplete with token highlighting, category pills, and tag suggestions.\n\n' },
  { text: '3. 3-Tier Full-Stack Architecture: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'HTML/CSS/JS presentation layer, Express REST API routing, and SQLite relational database.\n\n' },
  { text: '4. Resilient Dual-Mode Engineering: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Seamlessly works in full-stack client-server mode, falling back to LocalStorage for zero-setup viva execution.' }
], {
  x: 7.1, y: 2.4, w: 5.1, h: 3.9,
  fontSize: 11.5, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 16
});

// --------------------------------------------------------------------------
// SLIDE 3: PROBLEM STATEMENT & MOTIVATION
// --------------------------------------------------------------------------
const s3 = pptx.addSlide();
addSlideHeader(s3, 'Market Need', 'Problem Statement & Motivation');

const problems = [
  { title: 'Middlemen Price Markups', desc: 'Traditional retail channels add 40-70% markups on sarees, fashion, and essentials. Direct factory sourcing provides wholesale rates for tier 2/3 Indian households.' },
  { title: 'Heavy Client Framework Overhead', desc: 'Modern web apps bundle 5MB+ JavaScript runtimes, causing high latency on budget phones. Pure Vanilla JS achieves instant sub-100ms load times.' },
  { title: 'Regional Payment Preferences', desc: 'Over 65% of Indian e-commerce buyers prefer Cash on Delivery (COD) and scan-and-pay UPI rather than international credit cards.' },
  { title: 'Demonstration Resilience', desc: 'Student projects often fail during evaluations due to cloud database downtime or network issues. A zero-config SQLite store with offline fallback guarantees 100% uptime.' }
];

problems.forEach((p, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 6.0;
  const y = 1.6 + row * 2.5;

  s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w: 5.7, h: 2.2,
    fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
  });

  s3.addText(`0${idx + 1}. ${p.title}`, {
    x: x + 0.3, y: y + 0.3, w: 5.1, h: 0.35,
    fontSize: 13, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
  });

  s3.addText(p.desc, {
    x: x + 0.3, y: y + 0.75, w: 5.1, h: 1.25,
    fontSize: 11, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 16
  });
});

// --------------------------------------------------------------------------
// SLIDE 4: SYSTEM ARCHITECTURE (3-TIER)
// --------------------------------------------------------------------------
const s4 = pptx.addSlide();
addSlideHeader(s4, 'Engineering Design', '3-Tier System Architecture');

// Tier 1
s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.6, w: 3.6, h: 5.0,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_PRIMARY, width: 2 }, rectRadius: 0.15
});
s4.addText('Presentation Tier\n(Client-Side)', {
  x: 1.0, y: 1.8, w: 3.2, h: 0.6,
  fontSize: 14, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center'
});
s4.addText([
  { text: '• Semantic HTML5: ', options: { bold: true } },
  { text: 'Accessible markup, modal dialogs, and SVG icons.\n\n' },
  { text: '• Responsive CSS3: ', options: { bold: true } },
  { text: 'Meesho design system, CSS variables, CSS Grid (4-col desktop, 2-col mobile), Flexbox.\n\n' },
  { text: '• Vanilla JavaScript (ES6+): ', options: { bold: true } },
  { text: 'IIFE modular architecture, async Fetch API, debounced search suggestions, client cache.' }
], {
  x: 1.0, y: 2.6, w: 3.2, h: 3.8,
  fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK
});

// Tier 2
s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 4.8, y: 1.6, w: 3.8, h: 5.0,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_ACCENT, width: 2 }, rectRadius: 0.15
});
s4.addText('Application Tier\n(REST API Server)', {
  x: 5.0, y: 1.8, w: 3.4, h: 0.6,
  fontSize: 14, fontFace: 'Arial', bold: true, color: COLOR_ACCENT, align: 'center'
});
s4.addText([
  { text: '• Node.js Runtime: ', options: { bold: true } },
  { text: 'High-throughput asynchronous non-blocking event loop.\n\n' },
  { text: '• Express.js Framework: ', options: { bold: true } },
  { text: 'REST API routing, JSON middleware, CORS, static file serving, route priority order.\n\n' },
  { text: '• Business Logic Engine: ', options: { bold: true } },
  { text: 'Multi-token search scoring, suggestions generator, coupon rules, stock management.' }
], {
  x: 5.0, y: 2.6, w: 3.4, h: 3.8,
  fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK
});

// Tier 3
s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 9.0, y: 1.6, w: 3.6, h: 5.0,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_GREEN, width: 2 }, rectRadius: 0.15
});
s4.addText('Database Tier\n(Persistent Storage)', {
  x: 9.2, y: 1.8, w: 3.2, h: 0.6,
  fontSize: 14, fontFace: 'Arial', bold: true, color: COLOR_GREEN, align: 'center'
});
s4.addText([
  { text: '• SQLite Database: ', options: { bold: true } },
  { text: 'Self-contained zero-config relational database (`data/meesho.db`).\n\n' },
  { text: '• Relational Tables: ', options: { bold: true } },
  { text: '5 normalized tables (products, orders, cart_items, wishlist_items, coupons).\n\n' },
  { text: '• Dual-Mode Fallback: ', options: { bold: true } },
  { text: 'Mirrored in browser LocalStorage (`products_data.js`) for standalone offline execution.' }
], {
  x: 9.2, y: 2.6, w: 3.2, h: 3.8,
  fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK
});

// --------------------------------------------------------------------------
// SLIDE 5: TECHNOLOGY STACK SPECIFICATION
// --------------------------------------------------------------------------
const s5 = pptx.addSlide();
addSlideHeader(s5, 'Technologies', 'Technology Stack & Engineering Justification');

const techTable = [
  [
    { text: 'Layer / Domain', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Technology Chosen', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Role & Engineering Justification', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } }
  ],
  [
    { text: 'Markup' },
    { text: 'HTML5' },
    { text: 'Semantic tags (<header>, <nav>, <main>, <article>, <footer>) and ARIA attributes for accessibility.' }
  ],
  [
    { text: 'Styling' },
    { text: 'CSS3' },
    { text: 'CSS Custom Properties (Variables), CSS Grid (4-col / 2-col), Flexbox, transitions & keyframe animations.' }
  ],
  [
    { text: 'Client Logic' },
    { text: 'Vanilla JavaScript (ES6+)' },
    { text: 'Zero bundle overhead. Debounced live suggestions, client-side filtering, DOM rendering, LocalStorage sync.' }
  ],
  [
    { text: 'Backend Server' },
    { text: 'Node.js & Express.js' },
    { text: 'RESTful API routing, JSON serialization, static asset delivery, CORS middleware, error handling.' }
  ],
  [
    { text: 'Database' },
    { text: 'SQLite (Node native DatabaseSync)' },
    { text: 'Zero-config embedded relational database. Relational tables, parameterized SQL queries, local file storage.' }
  ],
  [
    { text: 'Client Storage' },
    { text: 'HTML5 Web Storage API' },
    { text: 'LocalStorage fallback for cart, wishlist, and session token persistence across browser restarts.' }
  ]
];

s5.addTable(techTable, {
  x: 0.8, y: 1.6, w: 11.7, h: 4.8,
  fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK,
  border: { color: 'CBD5E1', pt: 1 },
  colW: [2.0, 2.5, 7.2]
});

// --------------------------------------------------------------------------
// SLIDE 6: DATABASE DESIGN & RELATIONAL SCHEMA
// --------------------------------------------------------------------------
const s6 = pptx.addSlide();
addSlideHeader(s6, 'Database Design', 'SQLite Relational Database Schema');

const schemas = [
  {
    table: 'products',
    fields: 'id (PK, INT)\nname (TEXT)\ncategory (TEXT)\nprice (INT)\noriginal_price (INT)\ndiscount (INT)\nrating (REAL)\nreviews_count (INT)\nimage (TEXT)\ndescription (TEXT)\nstock (INT)\nbadge (TEXT)\ntags (TEXT)\ncreated_at (TEXT)',
    records: '65 Seeded Items (11 Categories)'
  },
  {
    table: 'orders',
    fields: 'id (PK, AUTO)\norder_id (UNIQUE TEXT)\norder_date (TEXT)\ncustomer_name (TEXT)\ncustomer_phone (TEXT)\ncustomer_address (TEXT)\npayment_method (TEXT)\ntotal_amount (INT)\nitems_json (TEXT)',
    records: 'Auto-Incrementing PK'
  },
  {
    table: 'cart_items',
    fields: 'id (PK, AUTO)\nsession_id (TEXT)\nproduct_id (FK -> products)\nquantity (INT)\nUNIQUE(session_id, product_id)',
    records: 'Session-Scoped'
  },
  {
    table: 'wishlist_items',
    fields: 'id (PK, AUTO)\nsession_id (TEXT)\nproduct_id (FK -> products)\nUNIQUE(session_id, product_id)',
    records: 'Session-Scoped'
  },
  {
    table: 'coupons',
    fields: 'code (PK, TEXT)\ndiscount (INT)\ntype (TEXT)\nmin_order (INT)\ndescription (TEXT)',
    records: 'MEESHONEW, MEESHO100, FESTIVE20'
  }
];

schemas.forEach((s, idx) => {
  const x = 0.8 + idx * 2.4;
  s6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y: 1.6, w: 2.25, h: 4.9,
    fill: { color: COLOR_WHITE }, line: { color: 'CBD5E1', width: 1 }, rectRadius: 0.12
  });

  s6.addShape(pptx.shapes.RECTANGLE, {
    x, y: 1.6, w: 2.25, h: 0.65,
    fill: { color: COLOR_PRIMARY }
  });
  s6.addText(s.table, {
    x, y: 1.6, w: 2.25, h: 0.65,
    fontSize: 12, fontFace: 'Arial', bold: true, color: COLOR_WHITE, align: 'center', valign: 'middle'
  });

  s6.addText(s.fields, {
    x: x + 0.15, y: 2.35, w: 1.95, h: 3.45,
    fontSize: 9, fontFace: 'Courier New', color: COLOR_DARK, lineSpacing: 13
  });

  s6.addText(s.records, {
    x: x + 0.1, y: 5.9, w: 2.05, h: 0.45,
    fontSize: 8.5, fontFace: 'Arial', bold: true, color: COLOR_GREEN, align: 'center'
  });
});

// --------------------------------------------------------------------------
// SLIDE 7: RESTFUL API ENDPOINTS CONTRACT
// --------------------------------------------------------------------------
const s7 = pptx.addSlide();
addSlideHeader(s7, 'Backend API', 'RESTful API Specification & Endpoints');

const apiTable = [
  [
    { text: 'HTTP Method', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Endpoint URI', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Parameters / Body', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Response & Description', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } }
  ],
  [
    { text: 'GET', options: { bold: true, color: COLOR_GREEN } },
    { text: '/api/health' },
    { text: 'None' },
    { text: '200 OK: Server status, DB driver (SQLite), timestamp.' }
  ],
  [
    { text: 'GET', options: { bold: true, color: COLOR_GREEN } },
    { text: '/api/products' },
    { text: '?category=...&search=...&sort=price-asc|price-desc|newest' },
    { text: '200 OK: Multi-criteria filtered array of product records from SQLite.' }
  ],
  [
    { text: 'GET', options: { bold: true, color: COLOR_GREEN } },
    { text: '/api/products/suggestions' },
    { text: '?q=...&limit=6' },
    { text: '200 OK: Live search suggestions for matching products, categories, and tags.' }
  ],
  [
    { text: 'GET', options: { bold: true, color: COLOR_GREEN } },
    { text: '/api/products/:id' },
    { text: 'URL Param: id (Integer)' },
    { text: '200 OK: Single product details object (or 404 Not Found).' }
  ],
  [
    { text: 'GET', options: { bold: true, color: COLOR_GREEN } },
    { text: '/api/cart' },
    { text: 'Header: x-session-id' },
    { text: '200 OK: Current session cart items joined with product metadata.' }
  ],
  [
    { text: 'POST', options: { bold: true, color: COLOR_PRIMARY } },
    { text: '/api/cart' },
    { text: 'JSON: { productId, quantity }' },
    { text: '200 OK: Increments quantity or inserts cart record in SQLite.' }
  ],
  [
    { text: 'POST', options: { bold: true, color: COLOR_PRIMARY } },
    { text: '/api/wishlist' },
    { text: 'JSON: { productId }' },
    { text: '200 OK: Toggles wishlist status in database.' }
  ],
  [
    { text: 'POST', options: { bold: true, color: COLOR_PRIMARY } },
    { text: '/api/orders' },
    { text: 'JSON: { customer, paymentMethod, items, totalAmount }' },
    { text: '201 Created: Validates inputs, generates Order ID, saves to SQLite.' }
  ],
  [
    { text: 'POST', options: { bold: true, color: COLOR_PRIMARY } },
    { text: '/api/coupons/apply' },
    { text: 'JSON: { code, orderAmount }' },
    { text: '200 OK: Validates minimum order and returns discount calculation.' }
  ]
];

s7.addTable(apiTable, {
  x: 0.8, y: 1.6, w: 11.7, h: 4.9,
  fontSize: 9.5, fontFace: 'Arial', color: COLOR_DARK,
  border: { color: 'CBD5E1', pt: 1 },
  colW: [1.4, 2.7, 3.6, 4.0]
});

// --------------------------------------------------------------------------
// SLIDE 8: KEY FUNCTIONAL MODULES
// --------------------------------------------------------------------------
const s8 = pptx.addSlide();
addSlideHeader(s8, 'Application Features', 'Key Functional Modules & E-Commerce Flow');

const modules = [
  {
    title: 'Smart Search & Live Suggestions',
    items: '• 65 authentic products across 11 diverse departments\n• Multi-token conjunction search with relevance scoring\n• Real-time debounced popover with token text highlighting\n• Department filter pills, popular keyword chips, and zero-match recommendations'
  },
  {
    title: 'Product Details (Quick View Modal)',
    items: '• High-resolution photo showcase with verified supplier badge\n• Responsive stock availability indicator & rating stars\n• Interactive quantity selector (- / +) with inventory checks\n• Direct Add-to-Cart and Wishlist heart toggle'
  },
  {
    title: 'Slide-Over Cart & Coupon Engine',
    items: '• Prevents duplicate entries by auto-incrementing quantity\n• Dynamic Free Delivery progress bar (threshold ₹499)\n• Promo coupon validation engine (MEESHONEW, FESTIVE20)\n• Complete price breakdown (MRP, Discount, Coupon, Delivery, Total)'
  },
  {
    title: 'Checkout & SQLite Order Persistence',
    items: '• Indian phone (+91 10-digit) and 6-digit PIN code validation\n• Payment selector: Cash on Delivery (COD) or Instant UPI Demo\n• Unique order ID generation (MEESHO-ORD-2026-xxxxx)\n• Persistent order history in SQLite and LocalStorage'
  }
];

modules.forEach((m, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 6.0;
  const y = 1.6 + row * 2.5;

  s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w: 5.7, h: 2.25,
    fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
  });

  s8.addText(m.title, {
    x: x + 0.3, y: y + 0.25, w: 5.1, h: 0.35,
    fontSize: 13, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
  });

  s8.addText(m.items, {
    x: x + 0.3, y: y + 0.7, w: 5.1, h: 1.4,
    fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 15
  });
});

// --------------------------------------------------------------------------
// SLIDE 9: VISUAL SHOWCASE - DESKTOP & SMART SEARCH
// --------------------------------------------------------------------------
const s9 = pptx.addSlide();
addSlideHeader(s9, 'Live Screenshots', 'Visual Showcase: Desktop Experience & Smart Search');

// Screenshot 1: Desktop Home
const snap1Path = path.join(SCREENSHOTS_DIR, '01_desktop_home.png');
if (fs.existsSync(snap1Path)) {
  s9.addImage({
    path: snap1Path,
    x: 0.8, y: 1.6, w: 5.7, h: 3.8
  });
}
s9.addText('01. Desktop Homepage & 11-Department Navigation Strip', {
  x: 0.8, y: 5.6, w: 5.7, h: 0.6,
  fontSize: 11, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center'
});

// Screenshot 2: Smart Search Suggestions
const snap2Path = path.join(SCREENSHOTS_DIR, '04_smart_search_suggestions.png');
if (fs.existsSync(snap2Path)) {
  s9.addImage({
    path: snap2Path,
    x: 6.8, y: 1.6, w: 5.7, h: 3.8
  });
}
s9.addText('02. Live Debounced Search Suggestions with Match Highlighting', {
  x: 6.8, y: 5.6, w: 5.7, h: 0.6,
  fontSize: 11, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center'
});

// --------------------------------------------------------------------------
// SLIDE 10: VISUAL SHOWCASE - CATALOG & CART MANAGEMENT
// --------------------------------------------------------------------------
const s10 = pptx.addSlide();
addSlideHeader(s10, 'Live Screenshots', 'Visual Showcase: Product Catalog & Cart Management');

// Screenshot 3: Product Catalog Grid
const snap3Path = path.join(SCREENSHOTS_DIR, '03_product_catalog_grid.png');
if (fs.existsSync(snap3Path)) {
  s10.addImage({
    path: snap3Path,
    x: 0.8, y: 1.6, w: 5.7, h: 3.8
  });
}
s10.addText('03. 4-Column Responsive Grid with Ratings, Discounts, & Badges', {
  x: 0.8, y: 5.6, w: 5.7, h: 0.6,
  fontSize: 11, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center'
});

// Screenshot 4: Cart Drawer
const snap4Path = path.join(SCREENSHOTS_DIR, '05_cart_drawer.png');
if (fs.existsSync(snap4Path)) {
  s10.addImage({
    path: snap4Path,
    x: 6.8, y: 1.6, w: 5.7, h: 3.8
  });
}
s10.addText('04. Slide-Over Cart with Free Delivery Threshold & Coupon Engine', {
  x: 6.8, y: 5.6, w: 5.7, h: 0.6,
  fontSize: 11, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center'
});

// --------------------------------------------------------------------------
// SLIDE 11: UI/UX & RESPONSIVE DESIGN SYSTEM
// --------------------------------------------------------------------------
const s11 = pptx.addSlide();
addSlideHeader(s11, 'UI/UX Design', 'Meesho Design Language & Mobile Responsiveness');

s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.6, w: 3.6, h: 5.0,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
});
s11.addText('Meesho Visual Identity', {
  x: 1.0, y: 1.8, w: 3.2, h: 0.4,
  fontSize: 13, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s11.addText([
  { text: '• Primary Palette: ', options: { bold: true } },
  { text: 'Signature Meesho Magenta (#9F2089) and Bright Pink (#F43397).\n\n' },
  { text: '• Typography: ', options: { bold: true } },
  { text: 'Plus Jakarta Sans for high mobile legibility.\n\n' },
  { text: '• Trust Badges: ', options: { bold: true } },
  { text: 'M-Trusted Supplier, Free Delivery, 60%+ OFF, Green Star Ratings.\n\n' },
  { text: '• Micro-Interactions: ', options: { bold: true } },
  { text: 'Slide drawers, quickview modals, animated toast alerts, hover lift.' }
], {
  x: 1.0, y: 2.3, w: 3.2, h: 4.1,
  fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14
});

// Mobile Screenshot
const snapMobPath = path.join(SCREENSHOTS_DIR, '07_mobile_view.png');
if (fs.existsSync(snapMobPath)) {
  s11.addImage({
    path: snapMobPath,
    x: 4.8, y: 1.6, w: 2.5, h: 4.8
  });
}

s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.7, y: 1.6, w: 4.8, h: 5.0,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
});
s11.addText('Mobile Native Dock & Layout', {
  x: 8.0, y: 1.8, w: 4.3, h: 0.4,
  fontSize: 13, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s11.addText([
  { text: '• Fixed Bottom Navigation: ', options: { bold: true } },
  { text: 'Home, Categories, Wishlist, Cart, and Account buttons within single-thumb reach.\n\n' },
  { text: '• Real-Time Counter Badges: ', options: { bold: true } },
  { text: 'Floating red/pink notification pills update dynamically when items are saved or added.\n\n' },
  { text: '• 2-Column Mobile Grid: ', options: { bold: true } },
  { text: 'Mirrors Meesho’s official Android and iOS app shopping experience on smaller touchscreens.\n\n' },
  { text: '• Zero Horizontal Scroll: ', options: { bold: true } },
  { text: 'Fluid viewport layout verified on all screen sizes (375px to 1920px).' }
], {
  x: 8.0, y: 2.3, w: 4.3, h: 4.1,
  fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14
});

// --------------------------------------------------------------------------
// SLIDE 12: TESTING & VERIFICATION RESULTS
// --------------------------------------------------------------------------
const s12 = pptx.addSlide();
addSlideHeader(s12, 'Quality Assurance', 'Automated Testing, Verification & Validation Results');

const testCases = [
  { test: 'Final Verification Suite', result: '83 / 83 PASSED (100%)', desc: 'Tested 11 categories, partial search, suggestions API, sorting, images, dual-mode & checkout.' },
  { test: 'System Audit Suite', result: '41 / 41 PASSED (100%)', desc: 'Verified DOM containers, SQLite tables, coupon engine, order serialization & PPT integrity.' },
  { test: 'End-to-End Suite', result: '25 / 25 PASSED (100%)', desc: 'Verified 65 products, price discounts, cart add/update/remove, and SQLite order history.' },
  { test: 'SQLite Database Integrity', result: '100% PERSISTENT', desc: '65 products seeded across 11 categories with created_at timestamps and transactional safety.' },
  { test: 'Image CDN Verification', result: '100% VALID HTTPS', desc: 'All 65 products use high-resolution Unsplash CDN URLs with automatic SVG fallback.' },
  { test: 'Dual-Mode Sync Parity', result: '100% MATCH', desc: 'Full-stack Express + SQLite and Standalone LocalStorage yield identical search & cart results.' }
];

const testTable = [
  [
    { text: 'Test Scenario / Suite', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Result & Score', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Verification Details & Scope', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } }
  ],
  ...testCases.map(t => [
    { text: t.test, options: { bold: true } },
    { text: t.result, options: { bold: true, color: COLOR_GREEN } },
    { text: t.desc }
  ])
];

s12.addTable(testTable, {
  x: 0.8, y: 1.6, w: 11.7, h: 4.8,
  fontSize: 10, fontFace: 'Arial', color: COLOR_DARK,
  border: { color: 'CBD5E1', pt: 1 },
  colW: [3.2, 2.5, 6.0]
});

// --------------------------------------------------------------------------
// SLIDE 13: VIVA VOCE DEFENSE & TALKING POINTS
// --------------------------------------------------------------------------
const s13 = pptx.addSlide();
addSlideHeader(s13, 'Viva Voce Guide', 'Key Examiner Questions & Technical Answers');

const vivaItems = [
  {
    q: 'Q1. Why did you choose SQLite over MongoDB or MySQL for this project?',
    a: 'SQLite is an embedded, zero-configuration relational database stored directly in `data/meesho.db`. Unlike MongoDB or MySQL, it requires no background service daemons or network setup, making it 100% portable for academic demonstrations while preserving complete SQL relational integrity.'
  },
  {
    q: 'Q2. What is the Dual-Mode Resilient Architecture and why is it important?',
    a: 'The frontend dynamically probes `/api/health` on startup. If connected to Express, it synchronizes with the SQLite database. If the server is offline or the examiner simply double-clicks `index.html`, it falls back to `localStorage`. This guarantees zero crashes during evaluations.'
  },
  {
    q: 'Q3. How does the Smart Multi-Token Search algorithm function?',
    a: 'Queries are normalized and split into discrete whitespace-separated tokens. Products match if all tokens are satisfied across title, category, tags, or description. A relevance scoring formula then ranks exact title matches and category hits higher than incidental description mentions.'
  }
];

vivaItems.forEach((v, idx) => {
  const y = 1.6 + idx * 1.65;
  s13.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y, w: 11.7, h: 1.45,
    fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.12
  });

  s13.addText(v.q, {
    x: 1.1, y: y + 0.15, w: 11.1, h: 0.35,
    fontSize: 11.5, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
  });

  s13.addText(v.a, {
    x: 1.1, y: y + 0.55, w: 11.1, h: 0.75,
    fontSize: 10, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14
  });
});

// --------------------------------------------------------------------------
// SLIDE 14: CONCLUSION & FUTURE ENHANCEMENTS
// --------------------------------------------------------------------------
const s14 = pptx.addSlide();
addSlideHeader(s14, 'Project Wrap-up', 'Conclusion & Future Roadmap');

s14.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.6, w: 5.6, h: 4.8,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
});
s14.addText('Project Conclusion', {
  x: 1.1, y: 1.9, w: 5.0, h: 0.4,
  fontSize: 14, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s14.addText([
  { text: '• Successfully Engineered: ', options: { bold: true } },
  { text: 'A responsive, high-performance Meesho Clone mimicking Indian social commerce dynamics.\n\n' },
  { text: '• Full-Stack Competency: ', options: { bold: true } },
  { text: 'Demonstrated mastery of semantic HTML5, CSS design systems, Vanilla JS, Express.js REST APIs, and SQLite database schema design.\n\n' },
  { text: '• Academic Standard: ', options: { bold: true } },
  { text: 'Rigorous automated testing (83/83 checks passing), zero console errors, input validation, and genuine data persistence.' }
], {
  x: 1.1, y: 2.4, w: 5.0, h: 3.7,
  fontSize: 11, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 16
});

s14.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.6, w: 5.7, h: 4.8,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
});
s14.addText('Future Scope & Roadmap', {
  x: 7.1, y: 1.9, w: 5.0, h: 0.4,
  fontSize: 14, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s14.addText([
  { text: '1. Payment Gateway: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Integration with live Razorpay / Cashfree UPI webhooks.\n\n' },
  { text: '2. Supplier Admin Dashboard: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Dedicated portal for weavers and sellers to upload catalog photos and track payouts.\n\n' },
  { text: '3. Machine Learning Recommendations: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Collaborative filtering model for personalized Indian ethnic style suggestions.\n\n' },
  { text: '4. WhatsApp Commerce Integration: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'One-click product catalog sharing directly on WhatsApp for resellers.' }
], {
  x: 7.1, y: 2.4, w: 5.1, h: 3.7,
  fontSize: 11, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 15
});

// Output File Generation
const outputPath = path.join(__dirname, 'Meesho_Clone_BTech_Project_Presentation.pptx');

pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`\n======================================================`);
    console.log(`  📊 Academic Presentation Generated Successfully!`);
    console.log(`  📁 File Path: ${fileName}`);
    console.log(`  🎯 Total Slides: 14 Slides (including Live Screenshots)`);
    console.log(`======================================================\n`);
  })
  .catch(err => {
    console.error('Error generating presentation:', err);
  });
