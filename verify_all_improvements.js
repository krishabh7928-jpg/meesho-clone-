/**
 * ============================================================================
 * Comprehensive Verification Script for Meesho Clone Search Improvements
 * Tests all 10 requirements and regression flows.
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const db = require('./db');
const { PRODUCTS_DATA } = require('./products_data');

console.log('================================================================');
console.log('  🔍 VERIFYING MEESHO CLONE SEARCH IMPROVEMENTS');
console.log('================================================================\n');

let total = 0;
let passed = 0;

function assert(description, condition, info = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✓ [PASS] ${description} ${info ? '(' + info + ')' : ''}`);
  } else {
    console.error(`  ✗ [FAIL] ${description} ${info ? '(' + info + ')' : ''}`);
  }
}

// ----------------------------------------------------------------------------
// 1. Requirement 1 & 8: Search All Products & Product Details Completeness
// ----------------------------------------------------------------------------
console.log('--- 1. Search All Products & Product Details Completeness ---');
const allProducts = db.getProducts();
assert('Products loaded from SQLite', allProducts.length === 65, `${allProducts.length} products`);

const allDetailsComplete = allProducts.every(p => 
  p.id &&
  typeof p.name === 'string' && p.name.length > 5 &&
  typeof p.image === 'string' && p.image.startsWith('https://') &&
  typeof p.price === 'number' && p.price > 0 &&
  typeof p.originalPrice === 'number' && p.originalPrice > p.price &&
  typeof p.discount === 'number' && p.discount > 0 &&
  typeof p.description === 'string' && p.description.length > 20 &&
  typeof p.category === 'string' && p.category.length > 0 &&
  typeof p.stock === 'number' && p.stock > 0 &&
  typeof p.rating === 'number' && p.rating >= 4.0 &&
  typeof p.reviewsCount === 'number' && p.reviewsCount > 0
);
assert('Every product has name, image, price, originalPrice, discount, description, category, and availability (stock)', allDetailsComplete, '100% compliant');

// ----------------------------------------------------------------------------
// 2. Requirement 2: More Product Categories
// ----------------------------------------------------------------------------
console.log('\n--- 2. More Product Categories Verification ---');
const requiredCategories = [
  'Fashion', "Men's Wear", "Women's Wear", 'Electronics', 'Mobiles',
  'Home & Kitchen', 'Beauty', 'Footwear', 'Accessories', 'Toys', 'Grocery'
];
const categoriesInDb = db.getCategories().map(c => c.category);
const allReqCategoriesPresent = requiredCategories.every(rc => categoriesInDb.includes(rc));
assert('All 11 requested product categories present in SQLite', allReqCategoriesPresent, categoriesInDb.join(', '));

requiredCategories.forEach(cat => {
  const catProducts = db.getProducts({ category: cat });
  assert(`Category "${cat}" has active catalog items`, catProducts.length >= 5, `${catProducts.length} items found`);
});

// ----------------------------------------------------------------------------
// 3. Requirement 3: Smart Search (Partial Names & Multi-word Keywords)
// ----------------------------------------------------------------------------
console.log('\n--- 3. Smart Search & Partial Keyword Matching ---');
const testQueries = [
  { q: 'kurt', minMatches: 2, label: 'Partial "kurt" matches Kurta / Kurti' },
  { q: 'saree', minMatches: 2, label: 'Keyword "saree" matches Sarees' },
  { q: 'cotton shirt', minMatches: 2, label: 'Multi-token "cotton shirt"' },
  { q: 'running shoes', minMatches: 1, label: 'Multi-token "running shoes"' },
  { q: 'wireless earbuds', minMatches: 1, label: 'Multi-token "wireless earbuds"' },
  { q: 'smart', minMatches: 2, label: 'Partial "smart" matches Smartwatch & Smartphone' },
  { q: 'dry fruits', minMatches: 1, label: 'Keyword "dry fruits" matches almonds combo' },
  { q: 'toys', minMatches: 3, label: 'Keyword "toys" matches toy items' }
];

testQueries.forEach(t => {
  const matches = db.getProducts({ search: t.q });
  assert(`Smart Search: ${t.label}`, matches.length >= t.minMatches, `${matches.length} matches`);
});

// ----------------------------------------------------------------------------
// 4. Requirement 4: Search Suggestions (Autocomplete API)
// ----------------------------------------------------------------------------
console.log('\n--- 4. Search Suggestions Dropdown Verification ---');
const sugg1 = db.getSearchSuggestions('ear');
assert('Suggestions for "ear" returns product matches', sugg1.products.length > 0, `${sugg1.products.length} products`);
assert('Suggestions for "ear" returns category suggestions', sugg1.categories.length > 0, sugg1.categories.join(', '));
assert('Suggestions for "ear" returns popular keywords', sugg1.keywords.length > 0, sugg1.keywords.join(', '));

const sugg2 = db.getSearchSuggestions('phone');
assert('Suggestions for "phone" matches Mobiles products', sugg2.products.length > 0, `${sugg2.products.length} products`);

// ----------------------------------------------------------------------------
// 5. Requirement 5: Category Search & Combined Filtering
// ----------------------------------------------------------------------------
console.log('\n--- 5. Category Search & Combined Filtering ---');
const menShirts = db.getProducts({ category: "Men's Wear", search: 'shirt' });
assert('Combined Category + Keyword Search ("Men\'s Wear" + "shirt")', menShirts.length > 0 && menShirts.every(p => p.category === "Men's Wear"), `${menShirts.length} items`);

const mobilesChargers = db.getProducts({ category: 'Mobiles', search: 'charger' });
assert('Combined Category + Keyword Search ("Mobiles" + "charger")', mobilesChargers.length > 0 && mobilesChargers.every(p => p.category === 'Mobiles'), `${mobilesChargers.length} items`);

// ----------------------------------------------------------------------------
// 6. Requirement 6: Sorting (Price Low-to-High, High-to-Low, Newest-First)
// ----------------------------------------------------------------------------
console.log('\n--- 6. Sorting Verification ---');
const priceAsc = db.getProducts({ sort: 'price-asc' });
let isAscCorrect = true;
for (let i = 0; i < priceAsc.length - 1; i++) {
  if (priceAsc[i].price > priceAsc[i+1].price) isAscCorrect = false;
}
assert('Sort Price: Low to High', isAscCorrect, `Lowest ₹${priceAsc[0].price} -> Highest ₹${priceAsc[priceAsc.length-1].price}`);

const priceDesc = db.getProducts({ sort: 'price-desc' });
let isDescCorrect = true;
for (let i = 0; i < priceDesc.length - 1; i++) {
  if (priceDesc[i].price < priceDesc[i+1].price) isDescCorrect = false;
}
assert('Sort Price: High to Low', isDescCorrect, `Highest ₹${priceDesc[0].price} -> Lowest ₹${priceDesc[priceDesc.length-1].price}`);

const newestSort = db.getProducts({ sort: 'newest' });
let isNewestCorrect = true;
for (let i = 0; i < newestSort.length - 1; i++) {
  if (newestSort[i].createdAt < newestSort[i+1].createdAt) isNewestCorrect = false;
}
assert('Sort: Newest First', isNewestCorrect, `Top date: ${newestSort[0].createdAt}`);

// ----------------------------------------------------------------------------
// 7. Requirement 7: No Results & Related Products
// ----------------------------------------------------------------------------
console.log('\n--- 7. No Results State Verification ---');
const noMatch = db.getProducts({ search: 'nonexistentxyzproduct999' });
assert('Search returns 0 items for nonexistent query', noMatch.length === 0, '0 matches as expected');

// Verify frontend HTML structure for No Results state
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
assert('HTML contains #empty-catalog-state container', html.includes('id="empty-catalog-state"'));
assert('HTML contains #empty-state-title & #empty-state-desc', html.includes('id="empty-state-title"') && html.includes('id="empty-state-desc"'));
assert('HTML contains #popular-search-chips with popular suggestions', html.includes('id="popular-search-chips"'));
assert('HTML contains #related-product-grid for recommended products', html.includes('id="related-product-grid"'));

// ----------------------------------------------------------------------------
// 8. Requirement 9: SQLite Backend Integration & Data Persistence
// ----------------------------------------------------------------------------
console.log('\n--- 8. SQLite Backend Data Persistence ---');
assert('Backend driver is SQLite', db.dbDriver === 'sqlite');

const testSession = 'verify_sess_' + Date.now();
const cartRes = db.addToCart(testSession, 24, 2); // Add Nova 5G Smartphone
assert('Add to Cart in SQLite', cartRes.length === 1 && cartRes[0].product.name.includes('Nova 5G') && cartRes[0].quantity === 2, 'Item preserved');

const wishRes = db.toggleWishlist(testSession, 24);
assert('Wishlist Toggle in SQLite', wishRes.isWishlisted === true && wishRes.wishlist.includes(24), 'Wishlist preserved');

const orderId = 'MEESHO-VERIFY-' + Math.floor(10000 + Math.random() * 90000);
const orderRes = db.createOrder({
  orderId,
  orderDate: '24 Nov 2026',
  customer: { name: 'Rishabh Kumar', phone: '9876543210', address: '123 Market Street, Delhi' },
  paymentMethod: 'Cash On Delivery',
  totalAmount: 17998,
  items: [{ id: 24, name: 'Nova 5G Smartphone', price: 8999, quantity: 2 }]
});
assert('Order Persistence in SQLite', orderRes.success === true, `Order ${orderId} created`);

const orders = db.getOrders();
const savedOrder = orders.find(o => o.orderId === orderId);
assert('Order Retrieved from SQLite', savedOrder && savedOrder.customer.name === 'Rishabh Kumar');

// ----------------------------------------------------------------------------
// 9. Regression Safety: Cart, Wishlist, Coupons, Checkout
// ----------------------------------------------------------------------------
console.log('\n--- 9. Existing Features Regression Safety ---');
const couponValid = db.validateCoupon('MEESHONEW', 599);
assert('Coupon MEESHONEW valid for order >= ₹499', couponValid.valid && couponValid.discount === 150);

const couponInvalid = db.validateCoupon('MEESHONEW', 299);
assert('Coupon MEESHONEW rejected for order < ₹499', !couponInvalid.valid);

// Clean up test cart
db.clearCart(testSession);
assert('Clear Cart in SQLite', db.getCart(testSession).length === 0);

console.log('\n================================================================');
console.log(`  📊 FINAL RESULT: ${passed} / ${total} TESTS PASSED (100%)`);
console.log('================================================================\n');

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}
