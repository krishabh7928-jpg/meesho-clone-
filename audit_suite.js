/**
 * ============================================================================
 * Myntra Fashion Platform - Comprehensive Final Audit & Verification Suite
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const db = require('./db');

console.log('================================================================');
console.log('  🔍 MYNTRA FASHION PLATFORM - COMPREHENSIVE FINAL AUDIT SUITE');
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

recordAudit('Frontend', 'index.html exists and non-empty', htmlContent.length > 25000, `${htmlContent.length} bytes`);
recordAudit('Frontend', 'style.css exists and non-empty', cssContent.length > 25000, `${cssContent.length} bytes`);
recordAudit('Frontend', 'script.js exists and non-empty', jsContent.length > 25000, `${jsContent.length} bytes`);

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
recordAudit('DB Data', 'Products seeded count is 75', products.length >= 75, `${products.length} products`);
recordAudit('DB Data', 'Product Price Integrity', products.every(p => p.price > 0 && p.original_price > p.price), 'All prices realistic & discounted');
recordAudit('DB Data', 'Product Stock Availability', products.every(p => p.stock > 0), 'All products have positive stock');
recordAudit('DB Data', 'Fashion Brands Present', products.every(p => p.brand && p.brand.trim() !== ''), 'All products have brand name');

// Check Categories Diversity (5 Core Categories)
const categories = sqlite.prepare("SELECT category, COUNT(*) as c FROM products GROUP BY category").all();
recordAudit('DB Data', 'Categories Diversity (5 Core Fashion Categories)', categories.length === 5, `${categories.length} departments: ${categories.map(c => c.category).join(', ')}`);

// Check Coupons Table
const coupons = sqlite.prepare("SELECT * FROM coupons").all();
recordAudit('DB Data', 'Coupons Table Seeded', coupons.length >= 4, `${coupons.length} coupons: ${coupons.map(c => c.code).join(', ')}`);

// ----------------------------------------------------------------------------
// 3. API & BUSINESS LOGIC AUDIT
// ----------------------------------------------------------------------------
console.log('\n--- SECTION 3: BUSINESS LOGIC & API ENDPOINTS VERIFICATION ---');

// Test 1: Category Filter API
const womenProducts = db.getProducts({ category: "Women" });
recordAudit('API Logic', "Category Filter (Women)", womenProducts.every(p => p.category === "Women") && womenProducts.length > 0, `${womenProducts.length} items`);

const menProducts = db.getProducts({ category: "Men" });
recordAudit('API Logic', "Category Filter (Men)", menProducts.every(p => p.category === "Men") && menProducts.length > 0, `${menProducts.length} items`);

// Test 2: Smart Search Multi-Token API
const searchResult = db.getProducts({ search: 'cotton shirt' });
recordAudit('API Logic', 'Smart Search Query ("cotton shirt")', searchResult.length > 0, `${searchResult.length} matches`);

// Test 2b: Search Suggestions API
const suggestions = db.getSearchSuggestions('men');
recordAudit('API Logic', 'Live Search Suggestions API', suggestions.products.length > 0 && suggestions.categories.length > 0, `${suggestions.products.length} product matches, ${suggestions.categories.length} category matches`);

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

const sortedNewest = db.getProducts({ sort: 'newest' });
recordAudit('API Logic', 'Sort: Newest First', sortedNewest.length > 0 && sortedNewest[0].createdAt >= sortedNewest[sortedNewest.length - 1].createdAt, 'Newest timestamp first');

// Test 4: View Filter Tabs API
const under999 = db.getProducts({ viewFilter: 'under999' });
recordAudit('API Logic', 'View Filter: Under ₹999', under999.every(p => p.price <= 999), `${under999.length} items <= ₹999`);

const trending = db.getProducts({ viewFilter: 'trending' });
recordAudit('API Logic', 'View Filter: Trending', trending.length > 0, `${trending.length} trending items`);

// Test 5: Cart Isolation & Operations
const testSess = 'audit_session_' + Date.now();
const cartStep1 = db.addToCart(testSess, 1, 2, 'L');
recordAudit('Cart Logic', 'Add to Cart', cartStep1.length === 1 && cartStep1[0].quantity === 2, 'Qty = 2');

const cartStep2 = db.addToCart(testSess, 1, 3, 'L');
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
const couponCheck1 = db.validateCoupon('MYNTRA200', 899);
recordAudit('Coupon Logic', 'Apply MYNTRA200 (Order >= ₹799)', couponCheck1.valid === true && couponCheck1.discount === 200, '₹200 discount validated');

const couponCheck2 = db.validateCoupon('MYNTRA200', 499);
recordAudit('Coupon Logic', 'Apply MYNTRA200 (Order < ₹799)', couponCheck2.valid === false, 'Blocked when under minimum order');

// Test 8: Order Creation & SQLite Persistence
const auditOrderId = 'MYN-AUDIT-' + Math.floor(1000 + Math.random() * 9000);
const orderRes = db.createOrder({
  orderId: auditOrderId,
  orderDate: '26 Nov 2026',
  customer: {
    name: 'Auditor Rahul',
    phone: '9876500000',
    address: 'Auditing Lab, Sector 62, Noida, UP'
  },
  paymentMethod: 'Cash On Delivery',
  totalAmount: 1899,
  items: [{ id: 1, name: 'Denim Shirt', price: 699, quantity: 1, size: 'L' }]
});
recordAudit('Order Logic', 'Order Insertion to SQLite', orderRes.success === true, `Created Order ${auditOrderId}`);

const storedOrders = db.getOrders();
const verifiedOrder = storedOrders.find(o => o.orderId === auditOrderId);
recordAudit('Order Logic', 'Order Retrieval from SQLite', verifiedOrder !== undefined, `Found Order ID ${auditOrderId}`);
recordAudit('Order Logic', 'Order Payload Consistency', verifiedOrder && verifiedOrder.customer.name === 'Auditor Rahul', 'Customer details verified');

// ----------------------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log('\n================================================================');
const total = auditResults.length;
const passed = auditResults.filter(r => r.passed).length;
const failed = total - passed;
console.log(`  AUDIT SUMMARY: ${passed} / ${total} TESTS PASSED (${failed} FAILED)`);
console.log('================================================================\n');

if (failed === 0) {
  console.log('🎉 AUDIT SUCCESS: All tests passed with 100% score!\n');
  process.exit(0);
} else {
  console.error(`⚠️ AUDIT FAILURE: ${failed} tests failed.`);
  process.exit(1);
}
