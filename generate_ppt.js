/**
 * ============================================================================
 * Meesho Clone - Academic PowerPoint Presentation Generator
 * Generates: Meesho_Clone_BTech_Project_Presentation.pptx
 * Technology: pptxgenjs
 * ============================================================================
 */

const pptxgen = require('pptxgenjs');
const path = require('path');

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

// Decorative shapes
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
  x: 0.8, y: 3.5, w: 11.7, h: 3.0,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.2
});

s1.addText([
  { text: 'Academic Project Details\n\n', options: { bold: true, fontSize: 14, color: COLOR_PRIMARY } },
  { text: '• Degree / Branch: ', options: { bold: true } },
  { text: 'Bachelor of Technology (B.Tech) - Computer Science & Engineering\n' },
  { text: '• Project Type: ', options: { bold: true } },
  { text: 'Major / Minor Capstone Web Development Project\n' },
  { text: '• Student Name: ', options: { bold: true } },
  { text: 'Rishabh Kumar\n' },
  { text: '• Technology Stack: ', options: { bold: true } },
  { text: 'HTML5, CSS3, Vanilla JavaScript (ES6+), Node.js, Express.js, SQLite Database\n' },
  { text: '• Academic Session: ', options: { bold: true } },
  { text: '2026\n' }
], {
  x: 1.2, y: 3.8, w: 11.0, h: 2.4,
  fontSize: 12, fontFace: 'Arial', color: COLOR_DARK
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
  { text: 'Meesho Clone is a feature-complete e-commerce web application inspired by India’s fastest-growing social commerce platform, Meesho (meesho.com).\n\n' },
  { text: 'It connects Indian buyers directly to local manufacturers and weavers, delivering factory-direct wholesale prices, free delivery thresholds, Cash on Delivery (COD), and hassle-free 7-day returns.\n\n' },
  { text: 'The platform offers a seamless shopping journey: multi-category browsing, real-time live search, interactive product quick-views, a sliding shopping cart drawer, wishlist tracking, client/server address validation, and instant demo order generation.' }
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
  { text: '1. Authentic Meesho UX: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Replicate signature magenta/pink aesthetics, 8-category hierarchy, and mobile dock.\n\n' },
  { text: '2. 3-Tier Full-Stack Architecture: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Frontend (HTML/CSS/JS), Backend (Express.js REST API), and Database (SQLite relational tables).\n\n' },
  { text: '3. Resilient Dual-Mode Design: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Works in full-stack client-server mode, with an automated fallback to LocalStorage for zero-setup demonstrations.\n\n' },
  { text: '4. Zero Framework Overhead: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Pure Vanilla JavaScript frontend demonstrates deep mastery of core DOM and async Web APIs.' }
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
  { title: 'Middlemen Price Markups', desc: 'Traditional retail channels add up to 40-70% margins on ethnic garments. Direct manufacturer sourcing is critical for tier 2/3 Indian households.' },
  { title: 'Heavy Client Framework Overhead', desc: 'Many single-page apps bundle 5MB+ JavaScript runtimes, rendering them sluggish on budget mobile devices and slow 3G/4G connections.' },
  { title: 'Regional Payment Preferences', desc: 'Over 65% of suburban Indian shoppers rely heavily on Cash on Delivery (COD) and scan-and-pay UPI rather than international credit cards.' },
  { title: 'Resilience During Demonstrations', desc: 'Student web projects often crash during university vivas when external cloud database credentials or internet access fail.' }
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
  { text: 'Accessible markup, modal structures, and fallback SVGs.\n\n' },
  { text: '• Responsive CSS3: ', options: { bold: true } },
  { text: 'Meesho design system, CSS variables, CSS Grid & Flexbox, animations.\n\n' },
  { text: '• Vanilla JavaScript: ', options: { bold: true } },
  { text: 'IIFE modular pattern, DOM rendering, async Fetch API, dynamic filters.' }
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
  { text: 'High-throughput asynchronous non-blocking I/O event loop.\n\n' },
  { text: '• Express.js Framework: ', options: { bold: true } },
  { text: 'REST routing, JSON parsing middleware, CORS handling, static hosting.\n\n' },
  { text: '• Business Logic: ', options: { bold: true } },
  { text: 'Server-side order validation, stock management, and coupon engine.' }
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
  { text: 'Self-contained zero-config relational store (`data/meesho.db`).\n\n' },
  { text: '• Relational Tables: ', options: { bold: true } },
  { text: 'Products, Orders, Cart, Wishlist, and Coupons with constraints.\n\n' },
  { text: '• Dual-Mode Fallback: ', options: { bold: true } },
  { text: 'Synchronized with browser `localStorage` for offline resilience.' }
], {
  x: 9.2, y: 2.6, w: 3.2, h: 3.8,
  fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK
});

// --------------------------------------------------------------------------
// SLIDE 5: TECHNOLOGY STACK SPECIFICATION
// --------------------------------------------------------------------------
const s5 = pptx.addSlide();
addSlideHeader(s5, 'Technologies', 'Technology Stack & Environment');

const techTable = [
  [
    { text: 'Layer / Domain', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Technology Chosen', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Role & Engineering Justification', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } }
  ],
  [
    { text: 'Markup' },
    { text: 'HTML5' },
    { text: 'Semantic elements (<header>, <nav>, <main>, <article>, <footer>) and ARIA attributes for accessibility.' }
  ],
  [
    { text: 'Styling' },
    { text: 'CSS3' },
    { text: 'CSS Custom Properties (Variables), CSS Grid (4-col / 2-col), Flexbox, smooth transitions & keyframe animations.' }
  ],
  [
    { text: 'Client Logic' },
    { text: 'Vanilla JavaScript (ES6+)' },
    { text: 'No heavy libraries. IIFE pattern, Fetch API, DOM manipulation, dynamic filtering and event delegation.' }
  ],
  [
    { text: 'Backend Server' },
    { text: 'Node.js & Express.js' },
    { text: 'RESTful API routing, JSON serialization, static asset serving, CORS middleware, error handling.' }
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
    fields: 'id (PK, INT)\nname (TEXT)\ncategory (TEXT)\nprice (INT)\noriginal_price (INT)\ndiscount (INT)\nrating (REAL)\nstock (INT)\nbadge (TEXT)\ntags (TEXT)',
    records: '22 Seeded Items'
  },
  {
    table: 'orders',
    fields: 'id (PK, AUTO)\norder_id (UNIQUE TEXT)\norder_date (TEXT)\ncustomer_name (TEXT)\ncustomer_phone (TEXT)\ncustomer_address (TEXT)\npayment_method (TEXT)\ntotal_amount (INT)\nitems_json (TEXT)',
    records: 'Auto-Incrementing'
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
    x: x + 0.15, y: 2.4, w: 1.95, h: 3.4,
    fontSize: 9.5, fontFace: 'Courier New', color: COLOR_DARK, lineSpacing: 14
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
    { text: 'Request Parameters / Body', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
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
    { text: '?category=...&search=...&sort=...&viewFilter=...' },
    { text: '200 OK: Filtered & sorted array of product records from SQLite.' }
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
  x: 0.8, y: 1.6, w: 11.7, h: 4.8,
  fontSize: 10, fontFace: 'Arial', color: COLOR_DARK,
  border: { color: 'CBD5E1', pt: 1 },
  colW: [1.5, 2.3, 3.7, 4.2]
});

// --------------------------------------------------------------------------
// SLIDE 8: KEY FUNCTIONAL MODULES
// --------------------------------------------------------------------------
const s8 = pptx.addSlide();
addSlideHeader(s8, 'Application Features', 'Key Functional Modules');

const modules = [
  {
    title: 'Catalog & Live Search',
    items: '• 22 authentic Indian products across 8 departments\n• Live search autocomplete with thumbnail popover\n• Dynamic multi-criteria filtering (category, price, rating, discount)\n• Instant empty-state recovery button'
  },
  {
    title: 'Product Details (Quick View)',
    items: '• High-resolution photo showcase with verified supplier badge\n• Responsive stock availability indicator\n• Real-time quantity selector (- / +)\n• Direct Add-to-Cart and Wishlist heart toggle'
  },
  {
    title: 'Slide-Over Cart Drawer',
    items: '• Prevents duplicate entries by auto-incrementing quantity\n• Dynamic Free Delivery progress bar (threshold ₹499)\n• Promo coupon validation engine (MEESHONEW)\n• Complete price breakdown (MRP, Discount, Delivery, Total)'
  },
  {
    title: 'Checkout & Order Management',
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
// SLIDE 9: UI/UX & RESPONSIVE DESIGN SYSTEM
// --------------------------------------------------------------------------
const s9 = pptx.addSlide();
addSlideHeader(s9, 'UI/UX Design', 'Meesho Design Language & Responsiveness');

s9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.6, w: 3.6, h: 5.0,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
});
s9.addText('Meesho Visual Identity', {
  x: 1.0, y: 1.8, w: 3.2, h: 0.4,
  fontSize: 13, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s9.addText([
  { text: '• Primary Palette: ', options: { bold: true } },
  { text: 'Meesho Magenta (#9F2089) and Bright Pink (#F43397).\n\n' },
  { text: '• Typography: ', options: { bold: true } },
  { text: 'Plus Jakarta Sans for clean readability.\n\n' },
  { text: '• Product Badges: ', options: { bold: true } },
  { text: 'M-Trusted, Free Delivery, 60%+ OFF, Green Star Ratings.\n\n' },
  { text: '• Micro-Interactions: ', options: { bold: true } },
  { text: 'Floating toast alerts, drawer slides, hover elevations.' }
], {
  x: 1.0, y: 2.3, w: 3.2, h: 4.1,
  fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14
});

s9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 4.8, y: 1.6, w: 3.6, h: 5.0,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
});
s9.addText('Responsive Viewports', {
  x: 5.0, y: 1.8, w: 3.2, h: 0.4,
  fontSize: 13, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s9.addText([
  { text: '• Desktop (> 1024px): ', options: { bold: true } },
  { text: '4-column product grid, top announcement ticker, full navbar.\n\n' },
  { text: '• Tablet (768px - 1024px): ', options: { bold: true } },
  { text: '3-column grid, compact navigation.\n\n' },
  { text: '• Mobile (< 768px): ', options: { bold: true } },
  { text: '2-column product grid matching Meesho Android/iOS app layout.\n\n' },
  { text: '• Zero Horizontal Scroll: ', options: { bold: true } },
  { text: 'Fluid viewport layout verified on all devices.' }
], {
  x: 5.0, y: 2.3, w: 3.2, h: 4.1,
  fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14
});

s9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 8.8, y: 1.6, w: 3.7, h: 5.0,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
});
s9.addText('Mobile Native Dock', {
  x: 9.0, y: 1.8, w: 3.3, h: 0.4,
  fontSize: 13, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s9.addText([
  { text: '• Fixed Bottom Navigation: ', options: { bold: true } },
  { text: 'Home, Categories, Wishlist, Cart, and Account icons within thumb reach.\n\n' },
  { text: '• Live Counter Badges: ', options: { bold: true } },
  { text: 'Badge counters dynamically update on bottom dock icons.\n\n' },
  { text: '• Slide Drawers: ', options: { bold: true } },
  { text: 'Full-screen slide-over experience tailored for mobile touchscreens.' }
], {
  x: 9.0, y: 2.3, w: 3.3, h: 4.1,
  fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14
});

// --------------------------------------------------------------------------
// SLIDE 10: TESTING & VERIFICATION
// --------------------------------------------------------------------------
const s10 = pptx.addSlide();
addSlideHeader(s10, 'Quality Assurance', 'Testing, Verification & Validation Results');

const testCases = [
  { test: 'REST API Connectivity', result: 'PASSED', desc: 'All 8 endpoints return valid JSON status codes and correct payloads.' },
  { test: 'SQLite Database Persistence', result: 'PASSED', desc: '22 seeded products, orders table, cart records saved across server restarts.' },
  { test: 'Resilient Dual-Mode Sync', result: 'PASSED', desc: 'Gracefully switches to LocalStorage fallback if server is offline.' },
  { test: 'Duplicate Cart Prevention', result: 'PASSED', desc: 'Increments quantity rather than inserting duplicate rows in cart.' },
  { test: 'Free Delivery Threshold Engine', result: 'PASSED', desc: 'Automatically calculates delta and unlocks free shipping at ₹499+.' },
  { test: 'Client & Server Form Validation', result: 'PASSED', desc: 'Regex enforcement on 10-digit Indian phone numbers and 6-digit PIN codes.' }
];

const testTable = [
  [
    { text: 'Test Scenario', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Status', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Verification Details', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } }
  ],
  ...testCases.map(t => [
    { text: t.test, options: { bold: true } },
    { text: t.result, options: { bold: true, color: COLOR_GREEN } },
    { text: t.desc }
  ])
];

s10.addTable(testTable, {
  x: 0.8, y: 1.6, w: 11.7, h: 4.8,
  fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK,
  border: { color: 'CBD5E1', pt: 1 },
  colW: [3.2, 1.5, 7.0]
});

// --------------------------------------------------------------------------
// SLIDE 11: VIVA VOCE DEFENSE & TALKING POINTS
// --------------------------------------------------------------------------
const s11 = pptx.addSlide();
addSlideHeader(s11, 'Viva Voce Guide', 'Key Examiner Questions & Technical Answers');

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
    q: 'Q3. How is search and filtering performance optimized on the client side?',
    a: 'Instead of making separate server roundtrips for every keystroke, the client implements a centralized `applyFiltersAndSort()` pipeline. It filters an in-memory collection across multiple attributes (name, category, tags) and re-renders only affected DOM nodes in sub-10ms.'
  }
];

vivaItems.forEach((v, idx) => {
  const y = 1.6 + idx * 1.65;
  s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y, w: 11.7, h: 1.45,
    fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.12
  });

  s11.addText(v.q, {
    x: 1.1, y: y + 0.15, w: 11.1, h: 0.35,
    fontSize: 11.5, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
  });

  s11.addText(v.a, {
    x: 1.1, y: y + 0.55, w: 11.1, h: 0.75,
    fontSize: 10, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14
  });
});

// --------------------------------------------------------------------------
// SLIDE 12: CONCLUSION & FUTURE ENHANCEMENTS
// --------------------------------------------------------------------------
const s12 = pptx.addSlide();
addSlideHeader(s12, 'Project Wrap-up', 'Conclusion & Future Roadmap');

s12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.6, w: 5.6, h: 4.8,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
});
s12.addText('Project Conclusion', {
  x: 1.1, y: 1.9, w: 5.0, h: 0.4,
  fontSize: 14, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s12.addText([
  { text: '• Successfully Engineered: ', options: { bold: true } },
  { text: 'A responsive, high-performance Meesho Clone mimicking Indian social commerce dynamics.\n\n' },
  { text: '• Full-Stack Competency: ', options: { bold: true } },
  { text: 'Demonstrated proficiency in semantic HTML5, CSS design systems, Vanilla JS, Express.js REST APIs, and SQLite database schema design.\n\n' },
  { text: '• Academic Standard: ', options: { bold: true } },
  { text: 'Clean code, zero console errors, input validation, and genuine data persistence.' }
], {
  x: 1.1, y: 2.4, w: 5.0, h: 3.7,
  fontSize: 11, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 16
});

s12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.8, y: 1.6, w: 5.7, h: 4.8,
  fill: { color: COLOR_WHITE }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
});
s12.addText('Future Scope & Roadmap', {
  x: 7.1, y: 1.9, w: 5.0, h: 0.4,
  fontSize: 14, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s12.addText([
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
    console.log(`  🎯 Total Slides: 12 Slides`);
    console.log(`======================================================\n`);
  })
  .catch(err => {
    console.error('Error generating presentation:', err);
  });
