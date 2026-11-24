/**
 * ============================================================================
 * Meesho Clone - End-to-End System Test Suite
 * Tests: Backend Server, Database, Cart, Wishlist, Checkout, PPTX
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const db = require('./db');

console.log('========================================================');
console.log('  🧪 STARTING MEESHO CLONE SYSTEM VERIFICATION');
console.log('========================================================\n');

let passedTests = 0;
let totalTests = 0;

function assertTest(name, condition, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${name} ${details ? '(' + details + ')' : ''}`);
  } else {
    console.error(`  ✗ [FAIL] ${name} ${details ? '(' + details + ')' : ''}`);
  }
}

// 1. Database & Catalog Verification
const products = db.getProducts();
assertTest('SQLite Products Loaded', products.length >= 65, `${products.length} products found`);
assertTest('Product Pricing Validity', products.every(p => p.price > 0 && p.price < p.originalPrice), 'All prices < originalPrice');

const categories = db.getCategories();
assertTest('Categories Count (11 Requested Categories)', categories.length === 11, `${categories.length} departments found: ${categories.map(c => c.category).join(', ')}`);

// 1b. Smart Search & Newest Sort Verification
const smartSearchResult = db.getProducts({ search: 'cotton shirt' });
assertTest('Smart Search (Multi-token "cotton shirt")', smartSearchResult.length > 0, `${smartSearchResult.length} relevant items matched`);

const partialSearchResult = db.getProducts({ search: 'smart' });
assertTest('Partial Search ("smart")', partialSearchResult.length > 0, `${partialSearchResult.length} matches found`);

const suggestionsResult = db.getSearchSuggestions('ear');
assertTest('Live Search Suggestions API', suggestionsResult && suggestionsResult.products.length > 0, `${suggestionsResult.products.length} products, ${suggestionsResult.categories.length} categories suggested`);

const newestSorted = db.getProducts({ sort: 'newest' });
assertTest('Newest First Sorting', newestSorted.length >= 2 && newestSorted[0].createdAt >= newestSorted[newestSorted.length - 1].createdAt, 'Sorted descending by date');

const categoryFiltered = db.getProducts({ category: "Women's Wear" });
assertTest('Category Filter ("Women\'s Wear")', categoryFiltered.length > 0 && categoryFiltered.every(p => p.category === "Women's Wear"), `${categoryFiltered.length} items`);

// 2. Cart Operations Test
const sessionId = 'test_session_' + Date.now();
const cart1 = db.addToCart(sessionId, 1, 1);
assertTest('Add to Cart', cart1.length === 1 && cart1[0].quantity === 1, 'Item added with qty 1');

const cart2 = db.addToCart(sessionId, 1, 2);
assertTest('Duplicate Cart Prevention', cart2.length === 1 && cart2[0].quantity === 3, 'Qty incremented to 3');

const cart3 = db.updateCartQty(sessionId, 1, -1);
assertTest('Decrement Cart Quantity', cart3[0].quantity === 2, 'Qty decremented to 2');

const cart4 = db.removeFromCart(sessionId, 1);
assertTest('Remove from Cart', cart4.length === 0, 'Cart emptied successfully');

// 3. Wishlist Operations Test
const wish1 = db.toggleWishlist(sessionId, 5);
assertTest('Add to Wishlist', wish1.isWishlisted === true && wish1.wishlist.includes(5), 'Item 5 added to wishlist');

const wish2 = db.toggleWishlist(sessionId, 5);
assertTest('Remove from Wishlist', wish2.isWishlisted === false && !wish2.wishlist.includes(5), 'Item 5 removed from wishlist');

// 4. Coupon Validation Test
const validCoupon = db.validateCoupon('MEESHONEW', 599);
assertTest('Valid Coupon MEESHONEW', validCoupon.valid === true && validCoupon.discount === 150, '₹150 discount applied');

const lowOrderCoupon = db.validateCoupon('MEESHONEW', 299);
assertTest('Coupon Minimum Order Check', lowOrderCoupon.valid === false, 'Blocked when under ₹499');

const invalidCoupon = db.validateCoupon('INVALID99', 599);
assertTest('Invalid Coupon Handling', invalidCoupon.valid === false, 'Blocked invalid code');

// 5. Checkout & Order Persistence Test
const testOrderData = {
  orderId: 'MEESHO-ORD-TEST-' + Math.floor(10000 + Math.random() * 90000),
  orderDate: '24 Nov 2026',
  customer: {
    name: 'Rishabh Kumar',
    phone: '9876543210',
    address: 'Flat 101, College Road, New Delhi - 110001'
  },
  paymentMethod: 'Cash On Delivery',
  totalAmount: 649,
  items: [{ id: 1, name: 'Anarkali Kurta Set', price: 649, quantity: 1 }]
};

const orderResult = db.createOrder(testOrderData);
assertTest('Create Order in SQLite', orderResult.success === true, 'Order created successfully');

const allOrders = db.getOrders();
const fetchedOrder = allOrders.find(o => o.orderId === testOrderData.orderId);
assertTest('Fetch Order History from SQLite', fetchedOrder !== undefined, `Found order: ${fetchedOrder ? fetchedOrder.orderId : 'none'}`);
assertTest('Order Customer Details Match', fetchedOrder && fetchedOrder.customer.name === 'Rishabh Kumar', 'Customer name preserved');

// 6. PowerPoint File Verification
const pptxPath = path.join(__dirname, 'Meesho_Clone_BTech_Project_Presentation.pptx');
assertTest('PPTX Presentation File Exists', fs.existsSync(pptxPath), pptxPath);
const pptxStat = fs.statSync(pptxPath);
assertTest('PPTX Presentation File Non-Empty', pptxStat.size > 100000, `${Math.round(pptxStat.size / 1024)} KB`);

// 7. Backup Integrity Verification
const backupDir = path.join(__dirname, 'backup');
assertTest('Backup Directory Exists', fs.existsSync(backupDir));
assertTest('Backup index.html Exists', fs.existsSync(path.join(backupDir, 'index.html')));
assertTest('Backup script.js Exists', fs.existsSync(path.join(backupDir, 'script.js')));

console.log('\n========================================================');
console.log(`  📊 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('========================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
