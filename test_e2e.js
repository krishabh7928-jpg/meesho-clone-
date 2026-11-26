/**
 * ============================================================================
 * Myntra Fashion Platform - End-to-End System Test Suite
 * Tests: Backend Server, Database, Fashion Brands, Sizes, Cart, Wishlist, Checkout
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const db = require('./db');

console.log('========================================================');
console.log('  🧪 STARTING MYNTRA FASHION SYSTEM VERIFICATION');
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
assertTest('SQLite Products Loaded', products.length >= 75, `${products.length} products found`);
assertTest('Product Pricing Validity', products.every(p => p.price > 0 && p.price < p.originalPrice), 'All prices < originalPrice');
assertTest('Fashion Brand Presence', products.every(p => p.brand && p.brand.trim() !== ''), 'All items have authentic brand name');
assertTest('Size Array Presence', products.every(p => Array.isArray(p.sizes) && p.sizes.length > 0), 'All items have available sizes');

const categories = db.getCategories();
const expectedCats = ['Men', 'Women', 'Kids', 'Beauty', 'Home'];
const hasAllCats = expectedCats.every(cat => categories.some(c => c.category === cat));
assertTest('5 Core Fashion Categories Present', categories.length === 5 && hasAllCats, `${categories.length} departments: ${categories.map(c => c.category).join(', ')}`);

// 1b. Brand & Size Filtering Verification
const roadsterProds = db.getProducts({ brand: 'Roadster' });
assertTest('Brand Filter ("Roadster")', roadsterProds.length > 0 && roadsterProds.every(p => p.brand === 'Roadster'), `${roadsterProds.length} Roadster items`);

const hrxProds = db.getProducts({ brand: 'HRX by Hrithik Roshan' });
assertTest('Brand Filter ("HRX")', hrxProds.length > 0, `${hrxProds.length} HRX items`);

const mediumSizeProds = db.getProducts({ size: 'M' });
assertTest('Size Filter ("M")', mediumSizeProds.length > 0, `${mediumSizeProds.length} items in size M`);

// 1c. Smart Search & Autocomplete
const smartSearchResult = db.getProducts({ search: 'cotton shirt' });
assertTest('Smart Search (Multi-token "cotton shirt")', smartSearchResult.length > 0, `${smartSearchResult.length} relevant items matched`);

const brandSearchResult = db.getProducts({ search: 'anouk' });
assertTest('Brand Search ("anouk")', brandSearchResult.length > 0, `${brandSearchResult.length} matches found`);

const suggestionsResult = db.getSearchSuggestions('kur');
assertTest('Live Search Suggestions API', suggestionsResult && suggestionsResult.products.length > 0, `${suggestionsResult.products.length} products, ${suggestionsResult.categories.length} categories suggested`);

const newestSorted = db.getProducts({ sort: 'newest' });
assertTest('Newest First Sorting', newestSorted.length >= 2 && newestSorted[0].createdAt >= newestSorted[newestSorted.length - 1].createdAt, 'Sorted descending by date');

const categoryFiltered = db.getProducts({ category: 'Women' });
assertTest('Category Filter ("Women")', categoryFiltered.length > 0 && categoryFiltered.every(p => p.category === 'Women'), `${categoryFiltered.length} items`);

// 2. Cart Operations Test
const sessionId = 'test_session_' + Date.now();
const cart1 = db.addToCart(sessionId, 1, 1, 'L');
assertTest('Add to Cart with Size', cart1.length === 1 && cart1[0].quantity === 1 && cart1[0].size === 'L', 'Item added with qty 1 and size L');

const cart2 = db.addToCart(sessionId, 1, 2, 'L');
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
const myntraCoupon = db.validateCoupon('MYNTRA200', 999);
assertTest('Valid Coupon MYNTRA200', myntraCoupon.valid === true && myntraCoupon.discount === 200, '₹200 discount applied');

const myntra10Coupon = db.validateCoupon('MYNTRA10', 1000);
assertTest('Percent Coupon MYNTRA10', myntra10Coupon.valid === true && myntra10Coupon.discount === 100, '10% (₹100) discount applied');

const lowOrderCoupon = db.validateCoupon('MYNTRA200', 499);
assertTest('Coupon Minimum Order Check', lowOrderCoupon.valid === false, 'Blocked when under ₹799');

const firstOrderCoupon = db.validateCoupon('FIRST100', 599);
assertTest('First Order FIRST100 Coupon', firstOrderCoupon.valid === true && firstOrderCoupon.discount === 100, 'Flat ₹100 discount applied');

// 5. Checkout & Order Persistence Test
const testOrderData = {
  orderId: 'MYN-ORD-TEST-' + Math.floor(10000 + Math.random() * 90000),
  orderDate: '26 Nov 2026',
  customer: {
    name: 'Rishabh Kumar',
    phone: '9876543210',
    address: 'Flat 101, College Road, New Delhi - 110001'
  },
  paymentMethod: 'Cash On Delivery',
  totalAmount: 1299,
  items: [{ id: 1, name: 'Men Washed Denim Casual Shirt', price: 699, quantity: 1, size: 'L' }]
};

const orderResult = db.createOrder(testOrderData);
assertTest('Create Order in SQLite', orderResult.success === true, 'Order created successfully');

const allOrders = db.getOrders();
const fetchedOrder = allOrders.find(o => o.orderId === testOrderData.orderId);
assertTest('Fetch Order History from SQLite', fetchedOrder !== undefined, `Found order: ${fetchedOrder ? fetchedOrder.orderId : 'none'}`);
assertTest('Order Customer Details Match', fetchedOrder && fetchedOrder.customer.name === 'Rishabh Kumar', 'Customer name preserved');

console.log('\n========================================================');
console.log(`  📊 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('========================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
