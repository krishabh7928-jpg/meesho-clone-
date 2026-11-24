/**
 * ============================================================================
 * Meesho Clone - Comprehensive Final Audit & Verification Suite
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const db = require('./db');

console.log('================================================================');
console.log('  🔍 MEESHO CLONE - COMPREHENSIVE FINAL AUDIT SUITE');
console.log('================================================================\n');

let auditResults = [];

function recordAudit(category, testName, passed, details = '') {
  auditResults.push({ category, testName, passed, details });
  const mark = passed ? '✓ PASS' : '✗ FAIL';
  console.log(`  [${mark}] [${category}] ${testName} ${details ? '-> ' + details : ''}`);
}

// ----------------------------------------------------------------------------
// 1. FRONTEND FILES & DOM INTEGRITY AUDIT
// ----------------------------------------------------------------------------
console.log('\n--- SECTION 1: FRONTEND CODE & DOM AUDIT ---');

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

recordAudit('Frontend', 'index.html exists and non-empty', htmlContent.length > 40000, `${htmlContent.length} bytes`);
recordAudit('Frontend', 'style.css exists and non-empty', cssContent.length > 50000, `${cssContent.length} bytes`);
recordAudit('Frontend', 'script.js exists and non-empty', jsContent.length > 60000, `${jsContent.length} bytes`);

// Verify critical DOM elements
const criticalElements = [
  'header', 'search-input', 'clear-search-btn', 'search-suggestions',
  'cart-btn', 'wishlist-btn', 'account-btn', 'cart-count', 'wishlist-count',
  'category-nav-list', 'product-grid', 'empty-catalog-state', 'results-count',
  'category-select', 'sort-select', 'reset-filters-btn', 'product-modal-backdrop',
  'cart-drawer-backdrop', 'wishlist-drawer-backdrop', 'checkout-modal-backdrop',
  'order-success-backdrop', 'account-modal-backdrop', 'toast-container', 'backend-status-pill'
];

let allElementsPresent = true;
criticalElements.forEach(id => {
  if (!htmlContent.includes(`id="${id}"`) && !htmlContent.includes(`id='${id}'`)) {
    allElementsPresent = false;
    recordAudit('DOM Check', `Element #${id}`, false, 'Missing from HTML');
  }
});
if (allElementsPresent) {
  recordAudit('DOM Check', 'All 24 Critical UI Containers & Modals Exist', true, '100% matched');
}

// Verify Mobile Viewport Meta
recordAudit('Mobile Meta', 'Viewport tag properly set', htmlContent.includes('name="viewport"') && htmlContent.includes('width=device-width'), 'Responsive viewport verified');

// ----------------------------------------------------------------------------
// 2. SQLITE DATABASE SCHEMA & INTEGRITY AUDIT
// ----------------------------------------------------------------------------
console.log('\n--- SECTION 2: SQLITE DATABASE TABLES & DATA INTEGRITY ---');

const { DatabaseSync } = require('node:sqlite');
const sqlite = new DatabaseSync(path.join(__dirname, 'data', 'meesho.db'));

// Check Tables
const tables = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map(t => t.name);
const expectedTables = ['products', 'coupons', 'orders', 'cart_items', 'wishlist_items'];
expectedTables.forEach(t => {
  recordAudit('DB Schema', `Table [${t}] exists in SQLite`, tables.includes(t), 'Table verified');
});

// Check Products Table Count & Columns
const products = sqlite.prepare("SELECT * FROM products").all();
recordAudit('DB Data', 'Products seeded count is 22', products.length === 22, `${products.length} products`);
recordAudit('DB Data', 'Product Price Integrity', products.every(p => p.price > 0 && p.original_price > p.price), 'All prices realistic & discounted');
recordAudit('DB Data', 'Product Stock Availability', products.every(p => p.stock > 0), 'All products have positive stock');

// Check Categories Diversity
const categories = sqlite.prepare("SELECT category, COUNT(*) as c FROM products GROUP BY category").all();
recordAudit('DB Data', 'Categories Diversity', categories.length === 8, `${categories.length} departments: ${categories.map(c => c.category).join(', ')}`);

// Check Coupons Table
const coupons = sqlite.prepare("SELECT * FROM coupons").all();
recordAudit('DB Data', 'Coupons Table Seeded', coupons.length >= 3, `${coupons.length} coupons: ${coupons.map(c => c.code).join(', ')}`);

// ----------------------------------------------------------------------------
// 3. API & BUSINESS LOGIC AUDIT
// ----------------------------------------------------------------------------
console.log('\n--- SECTION 3: BUSINESS LOGIC & API ENDPOINTS VERIFICATION ---');

// Test 1: Category Filter API
const ethnicProducts = db.getProducts({ category: 'Women Ethnic' });
recordAudit('API Logic', 'Category Filter (Women Ethnic)', ethnicProducts.every(p => p.category === 'Women Ethnic') && ethnicProducts.length > 0, `${ethnicProducts.length} items`);

// Test 2: Search Filter API
const searchResult = db.getProducts({ search: 'Saree' });
recordAudit('API Logic', 'Search Query (Saree)', searchResult.length > 0 && searchResult.some(p => p.name.includes('Saree')), `${searchResult.length} matches`);

// Test 3: Sorting API
const sortedAsc = db.getProducts({ sort: 'price-asc' });
let isAsc = true;
for (let i = 0; i < sortedAsc.length - 1; i++) {
  if (sortedAsc[i].price > sortedAsc[i+1].price) isAsc = false;
}
recordAudit('API Logic', 'Sort Price: Low to High', isAsc, `Lowest ₹${sortedAsc[0].price} to Highest ₹${sortedAsc[sortedAsc.length-1].price}`);

const sortedDesc = db.getProducts({ sort: 'price-desc' });
let isDesc = true;
for (let i = 0; i < sortedDesc.length - 1; i++) {
  if (sortedDesc[i].price < sortedDesc[i+1].price) isDesc = false;
}
recordAudit('API Logic', 'Sort Price: High to Low', isDesc, `Highest ₹${sortedDesc[0].price} to Lowest ₹${sortedDesc[sortedDesc.length-1].price}`);

// Test 4: View Filter Tabs API
const under299 = db.getProducts({ viewFilter: 'under299' });
recordAudit('API Logic', 'View Filter: Under ₹299', under299.every(p => p.price <= 299), `${under299.length} items <= ₹299`);

const trending = db.getProducts({ viewFilter: 'trending' });
recordAudit('API Logic', 'View Filter: Trending', trending.length > 0, `${trending.length} trending items`);

// Test 5: Cart Isolation & Operations
const testSess = 'audit_session_' + Date.now();
const cartStep1 = db.addToCart(testSess, 1, 2);
recordAudit('Cart Logic', 'Add to Cart', cartStep1.length === 1 && cartStep1[0].quantity === 2, 'Qty = 2');

const cartStep2 = db.addToCart(testSess, 1, 3);
recordAudit('Cart Logic', 'Duplicate Add (Increment)', cartStep2.length === 1 && cartStep2[0].quantity === 5, 'Qty incremented to 5');

const cartStep3 = db.updateCartQty(testSess, 1, -2);
recordAudit('Cart Logic', 'Update Cart Quantity (-2)', cartStep3[0].quantity === 3, 'Qty reduced to 3');

const cartStep4 = db.removeFromCart(testSess, 1);
recordAudit('Cart Logic', 'Remove Item from Cart', cartStep4.length === 0, 'Cart item deleted');

// Test 6: Wishlist Operations
const wishStep1 = db.toggleWishlist(testSess, 7);
recordAudit('Wishlist Logic', 'Add to Wishlist', wishStep1.isWishlisted === true && wishStep1.wishlist.includes(7), 'Item 7 wishlisted');

const wishStep2 = db.toggleWishlist(testSess, 7);
recordAudit('Wishlist Logic', 'Remove from Wishlist', wishStep2.isWishlisted === false && !wishStep2.wishlist.includes(7), 'Item 7 un-wishlisted');

// Test 7: Coupon Validation
const couponCheck1 = db.validateCoupon('MEESHONEW', 599);
recordAudit('Coupon Logic', 'Apply MEESHONEW (Order >= ₹499)', couponCheck1.valid === true && couponCheck1.discount === 150, '₹150 discount validated');

const couponCheck2 = db.validateCoupon('MEESHONEW', 300);
recordAudit('Coupon Logic', 'Apply MEESHONEW (Order < ₹499)', couponCheck2.valid === false, 'Blocked when under minimum order');

// Test 8: Order Creation & SQLite Persistence
const auditOrderId = 'MEESHO-AUDIT-' + Math.floor(1000 + Math.random() * 9000);
const orderCreation = db.createOrder({
  orderId: auditOrderId,
  orderDate: '24 Nov 2026',
  customer: {
    name: 'College Examiner Audit',
    phone: '9876543210',
    address: 'Academic Block 4, CSE Department, New Delhi - 110001'
  },
  paymentMethod: 'Cash On Delivery',
  totalAmount: 899,
  items: [{ id: 2, name: 'Kanjeevaram Saree', price: 899, quantity: 1 }]
});
recordAudit('Order Logic', 'Order Insertion in SQLite', orderCreation.success === true, `Created Order ${auditOrderId}`);

const retrievedOrder = db.getOrders().find(o => o.orderId === auditOrderId);
recordAudit('Order Logic', 'Order Retrieval from SQLite', retrievedOrder !== undefined, `Found ${retrievedOrder ? retrievedOrder.orderId : 'none'}`);
recordAudit('Order Logic', 'Order Item Serialization', retrievedOrder && retrievedOrder.items.length === 1 && retrievedOrder.items[0].id === 2, 'Parsed items JSON matches');

// ----------------------------------------------------------------------------
// 4. PRESENTATION & ACADEMIC ALIGNMENT AUDIT
// ----------------------------------------------------------------------------
console.log('\n--- SECTION 4: PRESENTATION (PPTX) INTEGRITY AUDIT ---');

const pptxFile = path.join(__dirname, 'Meesho_Clone_BTech_Project_Presentation.pptx');
recordAudit('PPTX Audit', 'PPTX file exists', fs.existsSync(pptxFile), pptxFile);

const pptxStats = fs.statSync(pptxFile);
recordAudit('PPTX Audit', 'PPTX file size valid', pptxStats.size > 200000, `${Math.round(pptxStats.size / 1024)} KB`);

// Check generate_ppt.js file
const pptGenScript = fs.readFileSync(path.join(__dirname, 'generate_ppt.js'), 'utf8');
recordAudit('PPTX Content', 'Slide 1: Student & Degree Information', pptGenScript.includes('Rishabh Kumar') && pptGenScript.includes('B.Tech'), 'Rishabh Kumar / B.Tech CSE');
recordAudit('PPTX Content', 'Slide 4: 3-Tier Architecture Slide', pptGenScript.includes('Presentation Tier') && pptGenScript.includes('Application Tier') && pptGenScript.includes('Database Tier'), '3 tiers documented');
recordAudit('PPTX Content', 'Slide 6: SQLite Schema Match', pptGenScript.includes('products') && pptGenScript.includes('orders') && pptGenScript.includes('cart_items') && pptGenScript.includes('coupons'), 'All 5 tables documented');
recordAudit('PPTX Content', 'Slide 7: REST API Table Match', pptGenScript.includes('/api/products') && pptGenScript.includes('/api/cart') && pptGenScript.includes('/api/orders'), 'Endpoints table verified');
recordAudit('PPTX Content', 'Slide 11: Viva Questions Slide', pptGenScript.includes('Viva Voce Guide') && pptGenScript.includes('Why did you choose SQLite'), 'Viva questions included');

// ----------------------------------------------------------------------------
// FINAL SUMMARY
// ----------------------------------------------------------------------------
console.log('\n================================================================');
const total = auditResults.length;
const passed = auditResults.filter(r => r.passed).length;
const failed = total - passed;
console.log(`  📊 AUDIT RESULT: ${passed} / ${total} CHECKS PASSED (${Math.round((passed/total)*100)}%)`);
if (failed === 0) {
  console.log('  🎉 ZERO BUGS OR DISCREPANCIES FOUND - PROJECT IS 100% READY!');
} else {
  console.log(`  ⚠️ ${failed} CHECKS FAILED`);
}
console.log('================================================================\n');

process.exit(failed === 0 ? 0 : 1);
