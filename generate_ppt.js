/**
 * ============================================================================
 * Myntra-Inspired Fashion E-Commerce Website
 * Academic PowerPoint Presentation Generator
 * Generates: Myntra_Fashion_BTech_Project_Presentation.pptx
 * Technology: pptxgenjs
 * Author: Rishabh Kumar (B.Tech CSE)
 * ============================================================================
 */

const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE'; // 13.333" x 7.5" widescreen 16:9 canvas

// Color Palette Constants - Myntra Brand Design System
const COLOR_PRIMARY = 'FF3F6C';    // Myntra Signature Pink
const COLOR_ACCENT = '282C3F';     // Charcoal Slate Dark
const COLOR_DARK = '282C3F';       // Charcoal Slate Dark
const COLOR_MUTED = '535766';      // Muted Charcoal Gray
const COLOR_LIGHT = 'FFF5F7';      // Soft Pink Tint
const COLOR_WHITE = 'FFFFFF';      // Pure White
const COLOR_GREEN = '03A685';      // Success Teal
const COLOR_BORDER = 'EAEAEC';     // Clean Border Gray
const COLOR_CARD_BG = 'F9F9FA';    // Soft Surface
const TOTAL_SLIDES = 14;

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

// Helper: Consistent slide header and footer with slide numbering
function addSlideChrome(slide, slideNum, category, title) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: '100%', h: 0.1, fill: { color: COLOR_PRIMARY }
  });

  slide.addText(category.toUpperCase(), {
    x: 0.8, y: 0.35, w: 10, h: 0.28,
    fontSize: 10, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, letterSpacing: 1.5
  });

  slide.addText(title, {
    x: 0.8, y: 0.65, w: 11.7, h: 0.55,
    fontSize: 22, fontFace: 'Arial', bold: true, color: COLOR_DARK
  });

  slide.addShape(pptx.shapes.LINE, {
    x: 0.8, y: 1.25, w: 11.73, h: 0,
    line: { color: COLOR_BORDER, width: 1.5 }
  });

  // Footer bar
  slide.addShape(pptx.shapes.LINE, {
    x: 0.8, y: 7.02, w: 11.73, h: 0,
    line: { color: COLOR_BORDER, width: 1 }
  });

  slide.addText('Rishabh Kumar  |  B.Tech CSE  •  Myntra-Inspired Fashion E-Commerce Website', {
    x: 0.8, y: 7.08, w: 9.0, h: 0.3,
    fontSize: 9, fontFace: 'Arial', color: COLOR_MUTED
  });

  slide.addText(`Slide ${slideNum} / ${TOTAL_SLIDES}`, {
    x: 10.5, y: 7.08, w: 2.03, h: 0.3,
    fontSize: 9, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'right'
  });
}

// --------------------------------------------------------------------------
// SLIDE 1: TITLE SLIDE
// --------------------------------------------------------------------------
const s1 = pptx.addSlide();
s1.background = { color: COLOR_LIGHT };

s1.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: '100%', h: 0.12, fill: { color: COLOR_PRIMARY }
});

s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 0.65, w: 2.8, h: 0.48,
  fill: { color: COLOR_PRIMARY }, rectRadius: 0.24
});
s1.addText('MYNTRA FASHION', {
  x: 0.8, y: 0.65, w: 2.8, h: 0.48,
  fontSize: 12, fontFace: 'Arial', bold: true, color: COLOR_WHITE, align: 'center', valign: 'middle'
});

s1.addText('Full-Stack Fashion E-Commerce Web Application', {
  x: 0.8, y: 1.35, w: 11.7, h: 0.9,
  fontSize: 32, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});

s1.addText('A Responsive Multi-Brand Fashion Shopping Platform with Express.js REST API & SQLite Database', {
  x: 0.8, y: 2.3, w: 11.7, h: 0.55,
  fontSize: 15, fontFace: 'Arial', color: COLOR_DARK
});

s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 3.1, w: 11.73, h: 3.6,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_BORDER, width: 1 }, rectRadius: 0.18
});

s1.addText([
  { text: 'Academic Project Submission Details\n\n', options: { bold: true, fontSize: 13, color: COLOR_PRIMARY } },
  { text: '• Degree / Branch: ', options: { bold: true } },
  { text: 'Bachelor of Technology (B.Tech) - Computer Science & Engineering (CSE)\n' },
  { text: '• Project Title: ', options: { bold: true } },
  { text: 'Myntra-Inspired Fashion E-Commerce Website: Full-Stack Platform with 3-Tier Architecture\n' },
  { text: '• Student Name: ', options: { bold: true } },
  { text: 'Rishabh Kumar\n' },
  { text: '• Technology Stack: ', options: { bold: true } },
  { text: 'HTML5, CSS3 (Grid & Flexbox), Vanilla JavaScript (ES6+), Node.js v24, Express.js REST API, SQLite Database\n' },
  { text: '• Key Fashion Features: ', options: { bold: true } },
  { text: '5 Core Departments (Men, Women, Kids, Beauty, Home), 56 Brands, Multi-Faceted Filters, Dual-Mode Fallback\n' },
  { text: '• Academic Session: ', options: { bold: true } },
  { text: '2026\n' }
], {
  x: 1.2, y: 3.3, w: 11.0, h: 3.25,
  fontSize: 11, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 16
});

s1.addText(`Slide 1 / ${TOTAL_SLIDES}`, {
  x: 10.5, y: 7.05, w: 2.03, h: 0.3,
  fontSize: 9, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'right'
});

// --------------------------------------------------------------------------
// SLIDE 2: PROJECT ABSTRACT & OVERVIEW
// --------------------------------------------------------------------------
const s2 = pptx.addSlide();
addSlideChrome(s2, 2, 'Introduction', 'Project Abstract & Executive Summary');

s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.5, w: 5.65, h: 5.2,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_BORDER, width: 1 }, rectRadius: 0.15
});
s2.addText('What is Myntra Fashion Platform?', {
  x: 1.1, y: 1.78, w: 5.05, h: 0.4,
  fontSize: 15, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s2.addText([
  { text: 'The Myntra Fashion Platform is a responsive, full-stack fashion e-commerce web application inspired by Indian lifestyle retail design.\n\n' },
  { text: 'It incorporates a cohesive fashion UI: signature #FF3F6C accent palette, 3:4 portrait product cards, rating pills (e.g., 4.4 ★ | 5.4k), apparel size selectors (S, M, L, XL, XXL), and a 9-brand spotlight including Roadster, HRX, Anouk, Libas, WROGN, Mango, Levi\'s, Maybelline, and D\'Decor.\n\n' },
  { text: 'It catalogs 75 curated fashion products across 5 departments (Men, Women, Kids, Beauty, Home & Living) with multi-faceted filtering, 5 promo coupons (MYNTRA200, MYNTRA10, FESTIVE20, FIRST100, FREEDEL), slide-over bag drawer, and dual-mode execution.' }
], {
  x: 1.1, y: 2.25, w: 5.05, h: 4.2,
  fontSize: 10.8, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 15.5
});

s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.85, y: 1.5, w: 5.68, h: 5.2,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_BORDER, width: 1 }, rectRadius: 0.15
});
s2.addText('Key Project Objectives', {
  x: 7.15, y: 1.78, w: 5.1, h: 0.4,
  fontSize: 15, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s2.addText([
  { text: '1. Modern Myntra-Inspired UI/UX: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Clean typography, hero banner showcase, 5 fashion departments, brand spotlight tiles, and sticky mobile bottom navigation.\n\n' },
  { text: '2. Multi-Faceted Dynamic Filtering: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Simultaneous filtering by Category, Brand (56 brands), Apparel Size, Price Range, and Sorting order.\n\n' },
  { text: '3. Smart Search & Live Autocomplete: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Multi-token conjunction search with brand-priority weighting and highlighted suggestion tokens.\n\n' },
  { text: '4. Resilient 3-Tier Dual-Mode Architecture: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Express + SQLite full-stack operation with browser LocalStorage fallback for reliable offline viva demonstration.' }
], {
  x: 7.15, y: 2.25, w: 5.1, h: 4.2,
  fontSize: 10.8, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 15.5
});

// --------------------------------------------------------------------------
// SLIDE 3: PROBLEM STATEMENT & MOTIVATION
// --------------------------------------------------------------------------
const s3 = pptx.addSlide();
addSlideChrome(s3, 3, 'Industry Context', 'Problem Statement & Motivation');

const problems = [
  { title: 'Generic vs Fashion Discovery Needs', desc: 'Generic e-commerce UIs often overlook how fashion shoppers browse by Brand, Fit, and Size. Fashion retail benefits from portrait cards, brand spotlights, and size-specific filtering.' },
  { title: 'Frontend Bundle & Build Complexity', desc: 'Large frontend frameworks introduce extra build tooling and bundle overhead. Semantic HTML5, CSS3, and Vanilla ES6+ keep the application lightweight, readable, and easy to run directly.' },
  { title: 'Multi-Faceted Query Coordination', desc: 'Combining category, brand, size, price range, and search tokens simultaneously requires synchronized client state and parameterized SQLite queries on the backend.' },
  { title: 'Evaluation Resilience in College Viva', desc: 'External database setups can fail or time out during live classroom evaluations. An embedded SQLite database (data/fashion.db) paired with LocalStorage fallback keeps demos working offline.' }
];

problems.forEach((p, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 6.0;
  const y = 1.55 + row * 2.6;

  s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w: 5.73, h: 2.3,
    fill: { color: COLOR_WHITE }, line: { color: COLOR_BORDER, width: 1 }, rectRadius: 0.15
  });

  s3.addText(`0${idx + 1}. ${p.title}`, {
    x: x + 0.3, y: y + 0.28, w: 5.13, h: 0.35,
    fontSize: 13, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
  });

  s3.addText(p.desc, {
    x: x + 0.3, y: y + 0.72, w: 5.13, h: 1.35,
    fontSize: 10.5, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 15
  });
});

// --------------------------------------------------------------------------
// SLIDE 4: SYSTEM ARCHITECTURE (3-TIER DIAGRAM WITH CONNECTORS)
// --------------------------------------------------------------------------
const s4 = pptx.addSlide();
addSlideChrome(s4, 4, 'Engineering Design', '3-Tier System Architecture & Dual-Mode Flow');

// Tier 1 Box
s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.5, w: 3.35, h: 4.15,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_PRIMARY, width: 2 }, rectRadius: 0.15
});
s4.addShape(pptx.shapes.RECTANGLE, {
  x: 0.8, y: 1.5, w: 3.35, h: 0.72,
  fill: { color: COLOR_PRIMARY }
});
s4.addText('Presentation Tier\n(Browser Client)', {
  x: 0.9, y: 1.54, w: 3.15, h: 0.65,
  fontSize: 12.5, fontFace: 'Arial', bold: true, color: COLOR_WHITE, align: 'center', valign: 'middle'
});
s4.addText([
  { text: '• HTML5: ', options: { bold: true } },
  { text: 'Semantic structure, header, modals & drawers.\n\n' },
  { text: '• CSS3: ', options: { bold: true } },
  { text: 'Myntra palette (#FF3F6C), Grid/Flexbox, responsive views.\n\n' },
  { text: '• Vanilla JS (ES6+): ', options: { bold: true } },
  { text: 'Multi-filter engine, search autocomplete, cart & LocalStorage sync.' }
], {
  x: 0.98, y: 2.38, w: 3.0, h: 3.1,
  fontSize: 10, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14
});

// Connector 1 -> 2
s4.addShape(pptx.shapes.RIGHT_ARROW, {
  x: 4.25, y: 3.35, w: 0.55, h: 0.34,
  fill: { color: COLOR_PRIMARY }
});
s4.addText('REST / JSON\n(/api/*)', {
  x: 4.15, y: 2.82, w: 0.75, h: 0.45,
  fontSize: 8, fontFace: 'Arial', bold: true, color: COLOR_MUTED, align: 'center'
});

// Tier 2 Box
s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 4.9, y: 1.5, w: 3.5, h: 4.15,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_ACCENT, width: 2 }, rectRadius: 0.15
});
s4.addShape(pptx.shapes.RECTANGLE, {
  x: 4.9, y: 1.5, w: 3.5, h: 0.72,
  fill: { color: COLOR_ACCENT }
});
s4.addText('Application Tier\n(Node.js v24 + Express)', {
  x: 5.0, y: 1.54, w: 3.3, h: 0.65,
  fontSize: 12.5, fontFace: 'Arial', bold: true, color: COLOR_WHITE, align: 'center', valign: 'middle'
});
s4.addText([
  { text: '• Express.js Server: ', options: { bold: true } },
  { text: 'Static file serving, CORS middleware & REST routing.\n\n' },
  { text: '• Query & Validation: ', options: { bold: true } },
  { text: 'Category, brand, size, price, search & order validation.\n\n' },
  { text: '• Business Logic: ', options: { bold: true } },
  { text: 'Coupon verification, session cart/wishlist & order ID handling.' }
], {
  x: 5.08, y: 2.38, w: 3.15, h: 3.1,
  fontSize: 10, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14
});

// Connector 2 -> 3
s4.addShape(pptx.shapes.RIGHT_ARROW, {
  x: 8.5, y: 3.35, w: 0.55, h: 0.34,
  fill: { color: COLOR_GREEN }
});
s4.addText('SQL\n(DatabaseSync)', {
  x: 8.38, y: 2.82, w: 0.8, h: 0.45,
  fontSize: 8, fontFace: 'Arial', bold: true, color: COLOR_MUTED, align: 'center'
});

// Tier 3 Box
s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 9.15, y: 1.5, w: 3.38, h: 4.15,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_GREEN, width: 2 }, rectRadius: 0.15
});
s4.addShape(pptx.shapes.RECTANGLE, {
  x: 9.15, y: 1.5, w: 3.38, h: 0.72,
  fill: { color: COLOR_GREEN }
});
s4.addText('Database Tier\n(Embedded SQLite)', {
  x: 9.25, y: 1.54, w: 3.18, h: 0.65,
  fontSize: 12.5, fontFace: 'Arial', bold: true, color: COLOR_WHITE, align: 'center', valign: 'middle'
});
s4.addText([
  { text: '• SQLite Store: ', options: { bold: true } },
  { text: 'Zero-config file database (data/fashion.db) via Node v24.\n\n' },
  { text: '• 5 Relational Tables: ', options: { bold: true } },
  { text: 'products, orders, cart_items, wishlist_items, coupons.\n\n' },
  { text: '• Auto-Seeded Catalog: ', options: { bold: true } },
  { text: '75 fashion products & 5 coupons synced on startup.' }
], {
  x: 9.33, y: 2.38, w: 3.02, h: 3.1,
  fontSize: 10, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14
});

// Dual-Mode Offline Fallback Strip at Bottom
s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 5.88, w: 11.73, h: 0.92,
  fill: { color: COLOR_LIGHT }, line: { color: COLOR_PRIMARY, width: 1.2 }, rectRadius: 0.12
});
s4.addText([
  { text: 'Dual-Mode Execution Path: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'On load, script.js probes GET /api/health. When the Express server is active, Full-Stack Mode (SQLite) runs. If opened directly via file:// or offline, Standalone Mode automatically uses products_data.js and browser localStorage.' }
], {
  x: 1.05, y: 5.96, w: 11.2, h: 0.76,
  fontSize: 10, fontFace: 'Arial', color: COLOR_DARK, valign: 'middle'
});

// --------------------------------------------------------------------------
// SLIDE 5: TECHNOLOGY STACK SPECIFICATION
// --------------------------------------------------------------------------
const s5 = pptx.addSlide();
addSlideChrome(s5, 5, 'Technologies', 'Technology Stack & Engineering Justification');

const techTable = [
  [
    { text: 'Layer / Domain', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Technology Chosen', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Role & Engineering Justification', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } }
  ],
  [
    { text: 'Presentation' },
    { text: 'HTML5 Semantic Elements' },
    { text: 'Accessible tags (<header>, <nav>, <section>, <article>, <footer>) for fashion departments, modals, and drawers.' }
  ],
  [
    { text: 'Styling' },
    { text: 'CSS3 (Variables, Grid, Flexbox)' },
    { text: 'Myntra-inspired design system (#FF3F6C), 3:4 portrait cards, glassmorphic rating badges, sticky mobile dock.' }
  ],
  [
    { text: 'Client Logic' },
    { text: 'Vanilla JavaScript (ES6+)' },
    { text: 'Zero build step or framework overhead. Multi-faceted filtering, debounced autocomplete, cart & checkout state.' }
  ],
  [
    { text: 'Backend Server' },
    { text: 'Node.js v24 & Express.js' },
    { text: 'RESTful API routing, multi-parameter filtering, JSON responses, static asset serving, CORS middleware.' }
  ],
  [
    { text: 'Database' },
    { text: 'SQLite (Node v24 DatabaseSync)' },
    { text: 'Self-contained zero-config SQL engine (data/fashion.db) storing 75 products, orders, cart, wishlist & coupons.' }
  ],
  [
    { text: 'Client Storage' },
    { text: 'HTML5 Web Storage API' },
    { text: 'LocalStorage persistence for cart, wishlist, saved address, and orders during standalone offline execution.' }
  ]
];

s5.addTable(techTable, {
  x: 0.8, y: 1.5, w: 11.73, h: 5.1,
  fontSize: 10, fontFace: 'Arial', color: COLOR_DARK,
  border: { color: COLOR_BORDER, pt: 1 },
  colW: [2.0, 2.8, 6.93]
});

// --------------------------------------------------------------------------
// SLIDE 6: DATABASE DESIGN & RELATIONAL SCHEMA
// --------------------------------------------------------------------------
const s6 = pptx.addSlide();
addSlideChrome(s6, 6, 'Database Design', 'SQLite Relational Database Schema (data/fashion.db)');

const schemas = [
  {
    table: 'products',
    fields: 'id (PK, INT)\nname (TEXT)\nbrand (TEXT)\ncategory (TEXT)\nprice (INT)\noriginal_price (INT)\ndiscount (INT)\nrating (REAL)\nreviews_count (INT)\nimage (TEXT)\ndescription (TEXT)\nsizes (TEXT JSON)\npopularity (INT)\nstock (INT)\nbadge (TEXT)\ntags (TEXT)\ncreated_at (TEXT)',
    records: '75 Curated Fashion Items'
  },
  {
    table: 'orders',
    fields: 'id (PK, AUTO)\norder_id (UNIQUE TEXT)\norder_date (TEXT)\ncustomer_name (TEXT)\ncustomer_phone (TEXT)\ncustomer_address (TEXT)\npayment_method (TEXT)\ntotal_amount (INT)\nitems_json (TEXT)',
    records: 'Persistent Order History'
  },
  {
    table: 'cart_items',
    fields: 'id (PK, AUTO)\nsession_id (TEXT)\nproduct_id (INT)\nquantity (INT)\nsize (TEXT)\nUNIQUE(session_id,\n  product_id)',
    records: 'Session-Scoped Bag'
  },
  {
    table: 'wishlist_items',
    fields: 'id (PK, AUTO)\nsession_id (TEXT)\nproduct_id (INT)\nUNIQUE(session_id,\n  product_id)',
    records: 'Session-Scoped Favorites'
  },
  {
    table: 'coupons',
    fields: 'code (PK, TEXT)\ndiscount (INT)\ntype (TEXT)\nmin_order (INT)\ndescription (TEXT)',
    records: '5 Active Promo Coupons'
  }
];

schemas.forEach((s, idx) => {
  const x = 0.8 + idx * 2.4;
  s6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y: 1.5, w: 2.25, h: 5.25,
    fill: { color: COLOR_WHITE }, line: { color: COLOR_BORDER, width: 1 }, rectRadius: 0.12
  });

  s6.addShape(pptx.shapes.RECTANGLE, {
    x, y: 1.5, w: 2.25, h: 0.6,
    fill: { color: COLOR_PRIMARY }
  });
  s6.addText(s.table, {
    x, y: 1.5, w: 2.25, h: 0.6,
    fontSize: 11.5, fontFace: 'Arial', bold: true, color: COLOR_WHITE, align: 'center', valign: 'middle'
  });

  s6.addText(s.fields, {
    x: x + 0.14, y: 2.2, w: 1.98, h: 3.95,
    fontSize: 8, fontFace: 'Courier New', color: COLOR_DARK, lineSpacing: 11
  });

  s6.addText(s.records, {
    x: x + 0.1, y: 6.25, w: 2.05, h: 0.4,
    fontSize: 8, fontFace: 'Arial', bold: true, color: COLOR_GREEN, align: 'center'
  });
});

// --------------------------------------------------------------------------
// SLIDE 7: RESTFUL API ENDPOINTS CONTRACT
// --------------------------------------------------------------------------
const s7 = pptx.addSlide();
addSlideChrome(s7, 7, 'Backend API', 'RESTful API Specification & Fashion Endpoints');

const apiTable = [
  [
    { text: 'HTTP Method', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Endpoint URI', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Query / Body Params', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Response & Functionality', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } }
  ],
  [
    { text: 'GET', options: { bold: true, color: COLOR_GREEN } },
    { text: '/api/health' },
    { text: 'None' },
    { text: '200 OK: Returns server status and active database driver (sqlite).' }
  ],
  [
    { text: 'GET', options: { bold: true, color: COLOR_GREEN } },
    { text: '/api/products' },
    { text: '?category, brand, size, priceMin, priceMax, search, sort, viewFilter' },
    { text: '200 OK: Returns fashion items filtered across selected facets.' }
  ],
  [
    { text: 'GET', options: { bold: true, color: COLOR_GREEN } },
    { text: '/api/brands  &  /api/categories' },
    { text: 'None' },
    { text: '200 OK: Returns 56 unique brands and 5 category counts.' }
  ],
  [
    { text: 'GET', options: { bold: true, color: COLOR_GREEN } },
    { text: '/api/products/suggestions' },
    { text: '?q=...&limit=6' },
    { text: '200 OK: Autocomplete matches for products, brands, and categories.' }
  ],
  [
    { text: 'GET', options: { bold: true, color: COLOR_GREEN } },
    { text: '/api/products/:id' },
    { text: 'URL Param: id (Integer)' },
    { text: '200 OK / 404: Single product details with size array and stock.' }
  ],
  [
    { text: 'GET / POST / PUT / DELETE', options: { bold: true, color: COLOR_PRIMARY } },
    { text: '/api/cart  &  /api/cart/:productId' },
    { text: 'Header: x-session-id; Body: { productId, quantity, size } / { delta }' },
    { text: '200 OK: Reads, adds, updates quantity, or removes bag items.' }
  ],
  [
    { text: 'GET / POST', options: { bold: true, color: COLOR_PRIMARY } },
    { text: '/api/wishlist' },
    { text: 'Header: x-session-id; Body: { productId }' },
    { text: '200 OK: Fetches or toggles session-scoped wishlist favorites.' }
  ],
  [
    { text: 'GET / POST', options: { bold: true, color: COLOR_PRIMARY } },
    { text: '/api/orders' },
    { text: 'Body: { orderId, customer, paymentMethod, items, totalAmount }' },
    { text: '201 Created / 200 OK: Validates customer/items, saves & lists orders.' }
  ],
  [
    { text: 'POST', options: { bold: true, color: COLOR_PRIMARY } },
    { text: '/api/coupons/apply' },
    { text: 'Body: { code, orderAmount }' },
    { text: '200 OK: Validates promo codes (MYNTRA200, MYNTRA10, etc.).' }
  ]
];

s7.addTable(apiTable, {
  x: 0.8, y: 1.45, w: 11.73, h: 5.3,
  fontSize: 8.5, fontFace: 'Arial', color: COLOR_DARK,
  border: { color: COLOR_BORDER, pt: 1 },
  colW: [1.85, 2.75, 3.65, 3.48]
});

// --------------------------------------------------------------------------
// SLIDE 8: KEY FUNCTIONAL MODULES
// --------------------------------------------------------------------------
const s8 = pptx.addSlide();
addSlideChrome(s8, 8, 'Application Features', 'Key Functional Modules & Fashion Shopping Flow');

const modules = [
  {
    title: 'Multi-Faceted Fashion Filtering',
    items: '• 5 core departments: Men, Women, Kids, Beauty, Home\n• Brand filter dropdown covering all 56 catalog brands\n• Apparel size filter & card pills (S–XXL, Free Size, numeric sizes)\n• Price ranges (Under ₹500 to ₹2,000+) & Sort (Price, Rating, Discount, Newest)'
  },
  {
    title: 'Smart Search & Live Autocomplete',
    items: '• Multi-token search matches title, brand, category, and styling tags\n• Brand-priority relevance scoring elevates branded fashion queries\n• Debounced autocomplete dropdown with highlighted matched tokens\n• Category pills, popular search chips, and zero-match recommendations'
  },
  {
    title: 'Slide-Over Shopping Bag & Coupons',
    items: '• Interactive slide-over cart drawer with size badges and quantity controls\n• Dynamic Free Delivery progress tracker (threshold ₹799)\n• 5 promo coupons: MYNTRA200, MYNTRA10, FESTIVE20, FIRST100, FREEDEL\n• Live price breakdown (Total MRP, Product Discount, Delivery, Total Payable)'
  },
  {
    title: 'Quick View, Wishlist & Checkout',
    items: '• Product Quick View modal with size selector, quantity, and stock status\n• Wishlist heart toggle with counter badge and Move-to-Bag action\n• Demo checkout with client Indian PIN code & phone validation + COD/UPI\n• Order History, Saved Addresses & Coupons tabs in Profile modal'
  }
];

modules.forEach((m, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 6.0;
  const y = 1.5 + row * 2.6;

  s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w: 5.73, h: 2.35,
    fill: { color: COLOR_WHITE }, line: { color: COLOR_BORDER, width: 1 }, rectRadius: 0.15
  });

  s8.addText(m.title, {
    x: x + 0.3, y: y + 0.22, w: 5.13, h: 0.35,
    fontSize: 13, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
  });

  s8.addText(m.items, {
    x: x + 0.3, y: y + 0.65, w: 5.13, h: 1.5,
    fontSize: 10.2, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 15
  });
});

// --------------------------------------------------------------------------
// SLIDE 9: VISUAL SHOWCASE - DESKTOP & SMART SEARCH
// --------------------------------------------------------------------------
const s9 = pptx.addSlide();
addSlideChrome(s9, 9, 'Live Screenshots', 'Visual Showcase: Desktop Homepage & Smart Autocomplete');

const snap1Path = path.join(SCREENSHOTS_DIR, '01_desktop_home.png');
if (fs.existsSync(snap1Path)) {
  s9.addImage({
    path: snap1Path,
    x: 0.8, y: 1.55, w: 5.7, h: 3.56
  });
}
s9.addText('01. Desktop Homepage: Myntra Branding, Hero Showcase & Full-Stack Status Pill', {
  x: 0.8, y: 5.3, w: 5.7, h: 0.55,
  fontSize: 11, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center'
});

const snap2Path = path.join(SCREENSHOTS_DIR, '04_smart_search_suggestions.png');
if (fs.existsSync(snap2Path)) {
  s9.addImage({
    path: snap2Path,
    x: 6.83, y: 1.55, w: 5.7, h: 3.56
  });
}
s9.addText('02. Smart Search Autocomplete with Brand Priority & Highlighted Matches', {
  x: 6.83, y: 5.3, w: 5.7, h: 0.55,
  fontSize: 11, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center'
});

// --------------------------------------------------------------------------
// SLIDE 10: VISUAL SHOWCASE - CATALOG & SHOPPING BAG
// --------------------------------------------------------------------------
const s10 = pptx.addSlide();
addSlideChrome(s10, 10, 'Live Screenshots', 'Visual Showcase: Fashion Catalog Grid & Slide-Over Bag');

const snap3Path = path.join(SCREENSHOTS_DIR, '03_product_catalog_grid.png');
if (fs.existsSync(snap3Path)) {
  s10.addImage({
    path: snap3Path,
    x: 0.8, y: 1.55, w: 5.7, h: 3.56
  });
}
s10.addText('03. 4-Column Catalog Grid: 3:4 Portrait Cards, Ratings & Size Pills', {
  x: 0.8, y: 5.3, w: 5.7, h: 0.55,
  fontSize: 11, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center'
});

const snap4Path = path.join(SCREENSHOTS_DIR, '05_cart_drawer.png');
if (fs.existsSync(snap4Path)) {
  s10.addImage({
    path: snap4Path,
    x: 6.83, y: 1.55, w: 5.7, h: 3.56
  });
}
s10.addText('04. Slide-Over Shopping Bag: Free Delivery Tracker & MYNTRA200 Coupon', {
  x: 6.83, y: 5.3, w: 5.7, h: 0.55,
  fontSize: 11, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY, align: 'center'
});

// --------------------------------------------------------------------------
// SLIDE 11: UI/UX & RESPONSIVE DESIGN SYSTEM
// --------------------------------------------------------------------------
const s11 = pptx.addSlide();
addSlideChrome(s11, 11, 'UI/UX Design', 'Myntra Design System & Mobile Responsiveness');

s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.5, w: 3.65, h: 5.2,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_BORDER, width: 1 }, rectRadius: 0.15
});
s11.addText('Myntra Visual Identity', {
  x: 1.05, y: 1.75, w: 3.15, h: 0.4,
  fontSize: 13, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s11.addText([
  { text: '• Primary Palette: ', options: { bold: true } },
  { text: 'Signature Myntra Pink (#FF3F6C), Charcoal Slate (#282C3F), and Orange (#F26A10).\n\n' },
  { text: '• 3:4 Portrait Cards: ', options: { bold: true } },
  { text: 'Fashion card aspect ratio with rating pills and discount highlights.\n\n' },
  { text: '• Brand Prominence: ', options: { bold: true } },
  { text: 'Bold uppercase brand headers (ROADSTER, HRX, LIBAS) above item titles.\n\n' },
  { text: '• Micro-Interactions: ', options: { bold: true } },
  { text: 'Slide-in drawers, wishlist heart toggles, size selector pills, hover transitions.' }
], {
  x: 1.05, y: 2.25, w: 3.15, h: 4.2,
  fontSize: 10.2, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14.5
});

const snapMobPath = path.join(SCREENSHOTS_DIR, '07_mobile_view.png');
if (fs.existsSync(snapMobPath)) {
  s11.addImage({
    path: snapMobPath,
    x: 4.98, y: 1.55, w: 2.22, h: 4.8
  });
}

s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 7.73, y: 1.5, w: 4.8, h: 5.2,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_BORDER, width: 1 }, rectRadius: 0.15
});
s11.addText('Mobile Navigation & Grid', {
  x: 8.0, y: 1.75, w: 4.25, h: 0.4,
  fontSize: 13, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s11.addText([
  { text: '• Sticky Bottom Dock: ', options: { bold: true } },
  { text: 'App-style bottom navigation bar for Home, Categories, Wishlist, Bag, and Profile.\n\n' },
  { text: '• Dynamic Counter Badges: ', options: { bold: true } },
  { text: 'Live Bag and Wishlist counter badges synchronize across desktop and mobile bars.\n\n' },
  { text: '• 2-Column Mobile Grid: ', options: { bold: true } },
  { text: '4 columns on desktop (1440px), 3 columns at 1024px, and 2 columns on tablet/mobile.\n\n' },
  { text: '• Zero Horizontal Overflow: ', options: { bold: true } },
  { text: 'Verified in headless Chrome at 390px mobile, 768px tablet, and 1440px desktop.' }
], {
  x: 8.0, y: 2.25, w: 4.25, h: 4.2,
  fontSize: 10.2, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14.5
});

// --------------------------------------------------------------------------
// SLIDE 12: TESTING & VERIFICATION RESULTS (168/168 HIGHLIGHT + TABLE)
// --------------------------------------------------------------------------
const s12 = pptx.addSlide();
addSlideChrome(s12, 12, 'Quality Assurance', 'Automated Verification, Test Coverage & Results');

// Top 3 Visual KPI Summary Cards
const kpis = [
  { metric: '168 / 168', label: 'Node Test Checks Passed (100%)', color: COLOR_GREEN },
  { metric: '26 / 26', label: 'Headless Chrome Browser E2E Passed', color: COLOR_PRIMARY },
  { metric: '57 / 57', label: 'Unique Image URLs Verified HTTP 200', color: COLOR_ACCENT }
];

kpis.forEach((k, idx) => {
  const x = 0.8 + idx * 4.01;
  s12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y: 1.45, w: 3.71, h: 1.05,
    fill: { color: COLOR_WHITE }, line: { color: k.color, width: 1.8 }, rectRadius: 0.14
  });
  s12.addText(k.metric, {
    x, y: 1.52, w: 3.71, h: 0.5,
    fontSize: 22, fontFace: 'Arial', bold: true, color: k.color, align: 'center'
  });
  s12.addText(k.label, {
    x: x + 0.1, y: 2.05, w: 3.51, h: 0.35,
    fontSize: 9.5, fontFace: 'Arial', bold: true, color: COLOR_DARK, align: 'center'
  });
});

const testCases = [
  { test: 'Final Verification Suite (final_verification_suite.js)', result: '69 / 69 PASSED (100%)', desc: '5 categories, brands, size pills, multi-faceted filtering, dual-mode & checkout.' },
  { test: 'System Audit Suite (audit_suite.js)', result: '36 / 36 PASSED (100%)', desc: '24 DOM containers, 5 SQLite tables, coupon engine (MYNTRA200), API logic.' },
  { test: 'End-to-End Test Suite (test_e2e.js)', result: '26 / 26 PASSED (100%)', desc: '75 products, discounts, cart add/update/remove, wishlist, and SQLite orders.' },
  { test: 'Feature Improvement Suite (verify_all_improvements.js)', result: '37 / 37 PASSED (100%)', desc: 'Brand filters, size matching, price sorting, search suggestions & DB persistence.' },
  { test: 'Live Browser E2E & Standalone Mode (Headless Chrome)', result: '26 / 26 PASSED (100%)', desc: 'Live UI flows, 390px/768px/1440px layouts, offline file:// mode, 0 console errors.' }
];

const testTable = [
  [
    { text: 'Test Suite / Verification Scope', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Result & Score', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } },
    { text: 'Verified Coverage', options: { bold: true, fill: { color: COLOR_PRIMARY }, color: COLOR_WHITE } }
  ],
  ...testCases.map(t => [
    { text: t.test, options: { bold: true } },
    { text: t.result, options: { bold: true, color: COLOR_GREEN } },
    { text: t.desc }
  ])
];

s12.addTable(testTable, {
  x: 0.8, y: 2.7, w: 11.73, h: 4.05,
  fontSize: 9.5, fontFace: 'Arial', color: COLOR_DARK,
  border: { color: COLOR_BORDER, pt: 1 },
  colW: [4.2, 2.3, 5.23]
});

// --------------------------------------------------------------------------
// SLIDE 13: VIVA VOCE DEFENSE & TALKING POINTS
// --------------------------------------------------------------------------
const s13 = pptx.addSlide();
addSlideChrome(s13, 13, 'Viva Voce Guide', 'Key Examiner Questions & Technical Explanations');

const vivaItems = [
  {
    q: 'Q1. Why did you design a Myntra-inspired fashion store instead of a generic store?',
    a: 'Fashion e-commerce requires specialized product discovery: multi-brand browsing across 56 labels, apparel sizing matrices (S–XXL, Free Size, numeric sizes), 3:4 portrait cards, and brand-weighted search ranking—providing richer full-stack engineering scope for a B.Tech capstone project.'
  },
  {
    q: 'Q2. How is Dual-Mode Resilience implemented and why is it useful?',
    a: 'On startup, the client queries /api/health. When Node.js v24 and Express are active, it uses the SQLite database (data/fashion.db). If the server is offline or index.html is opened directly, it falls back to products_data.js and localStorage so browsing, cart, wishlist, and checkout keep working offline.'
  },
  {
    q: 'Q3. How do the Multi-Faceted Filter and Smart Search engines operate?',
    a: 'Five simultaneous filter facets (Category, Brand, Size, Price Range, and Sort) narrow the product list consistently on both client and server. Smart Search splits queries into tokens and prioritizes brand matches first, highlighting matched terms in the autocomplete dropdown.'
  }
];

vivaItems.forEach((v, idx) => {
  const y = 1.5 + idx * 1.78;
  s13.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y, w: 11.73, h: 1.58,
    fill: { color: COLOR_WHITE }, line: { color: COLOR_BORDER, width: 1 }, rectRadius: 0.12
  });

  s13.addText(v.q, {
    x: 1.1, y: y + 0.14, w: 11.13, h: 0.35,
    fontSize: 11.5, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
  });

  s13.addText(v.a, {
    x: 1.1, y: y + 0.54, w: 11.13, h: 0.9,
    fontSize: 10, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 14
  });
});

// --------------------------------------------------------------------------
// SLIDE 14: CONCLUSION & FUTURE ENHANCEMENTS
// --------------------------------------------------------------------------
const s14 = pptx.addSlide();
addSlideChrome(s14, 14, 'Project Wrap-up', 'Conclusion & Future Roadmap');

s14.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 0.8, y: 1.5, w: 5.65, h: 5.2,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_BORDER, width: 1 }, rectRadius: 0.15
});
s14.addText('Project Conclusion', {
  x: 1.1, y: 1.8, w: 5.05, h: 0.4,
  fontSize: 14, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s14.addText([
  { text: '• Successfully Built: ', options: { bold: true } },
  { text: 'A responsive Myntra-inspired fashion e-commerce web application featuring 75 curated fashion items across 5 departments and 56 brands.\n\n' },
  { text: '• Full-Stack Engineering: ', options: { bold: true } },
  { text: 'Implemented semantic HTML5, CSS Grid/Flexbox design system, Vanilla JS ES6+, Node.js v24, Express REST API, and SQLite database storage.\n\n' },
  { text: '• Verified Readiness: ', options: { bold: true } },
  { text: '168/168 automated Node checks and 26/26 live headless Chrome browser E2E checks passed with zero console errors, plus dual-mode offline support.' }
], {
  x: 1.1, y: 2.3, w: 5.05, h: 4.1,
  fontSize: 10.8, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 15.5
});

s14.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
  x: 6.85, y: 1.5, w: 5.68, h: 5.2,
  fill: { color: COLOR_WHITE }, line: { color: COLOR_BORDER, width: 1 }, rectRadius: 0.15
});
s14.addText('Future Scope & Roadmap', {
  x: 7.15, y: 1.8, w: 5.1, h: 0.4,
  fontSize: 14, fontFace: 'Arial', bold: true, color: COLOR_PRIMARY
});
s14.addText([
  { text: '1. Live Payment Gateway: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Integration with Razorpay or Cashfree UPI payment webhooks and server-side signature verification.\n\n' },
  { text: '2. User Authentication & JWT: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Account sign-up/login with hashed passwords and persistent multi-device order tracking.\n\n' },
  { text: '3. Admin Inventory Portal: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Dashboard for adding new fashion products, updating stock counts, and managing coupon campaigns.\n\n' },
  { text: '4. Size & Outfit Recommendations: ', options: { bold: true, color: COLOR_PRIMARY } },
  { text: 'Smart fit guidance and complementary outfit suggestions based on browsing history.' }
], {
  x: 7.15, y: 2.3, w: 5.1, h: 4.1,
  fontSize: 10.8, fontFace: 'Arial', color: COLOR_DARK, lineSpacing: 15.5
});

// Output File Generation
const outputPath = path.join(__dirname, 'Myntra_Fashion_BTech_Project_Presentation.pptx');

pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`\n======================================================`);
    console.log(`  📊 Academic Presentation Generated Successfully!`);
    console.log(`  📁 File Path: ${fileName}`);
    console.log(`  🎯 Total Slides: ${TOTAL_SLIDES} Slides (with Slide Numbers & Diagrams)`);
    console.log(`======================================================\n`);
  })
  .catch(err => {
    console.error('Error generating presentation:', err);
  });
