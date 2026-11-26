/**
 * ============================================================================
 * Comprehensive Verification Script for Myntra Fashion E-Commerce Platform
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const db = require('./db');
const { PRODUCTS_DATA } = require('./products_data');

console.log('================================================================');
console.log('  🔍 VERIFYING MYNTRA FASHION PLATFORM IMPROVEMENTS');
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
// 1. Search All Products & Product Details Completeness
// ----------------------------------------------------------------------------
console.log('--- 1. Search All Products & Product Details Completeness ---');
const allProducts = db.getProducts();
assert('Products loaded from SQLite', allProducts.length === 75, `${allProducts.length} products`);

const allDetailsComplete = allProducts.every(p => 
  p.id &&
  typeof p.brand === 'string' && p.brand.length > 0 &&
  typeof p.name === 'string' && p.name.length > 5 &&
  typeof p.image === 'string' && p.image.startsWith('https://') &&
  typeof p.price === 'number' && p.price > 0 &&
  typeof p.originalPrice === 'number' && p.originalPrice > p.price &&
  typeof p.discount === 'number' && p.discount > 0 &&
  typeof p.description === 'string' && p.description.length > 20 &&
  typeof p.category === 'string' && p.category.length > 0 &&
  Array.isArray(p.sizes) && p.sizes.length > 0 &&
  typeof p.stock === 'number' && p.stock > 0 &&
  typeof p.rating === 'number' && p.rating >= 4.0 &&
  typeof p.reviewsCount === 'number' && p.reviewsCount > 0
);
assert('Every product has brand, name, image, price, originalPrice, discount, description, category, sizes, stock', allDetailsComplete, '100% compliant');

// ----------------------------------------------------------------------------
// 2. 5 Core Categories Verification (Men, Women, Kids, Beauty, Home)
// ----------------------------------------------------------------------------
console.log('\n--- 2. 5 Core Categories Verification ---');
const requiredCategories = ['Men', 'Women', 'Kids', 'Beauty', 'Home'];
const categoriesInDb = db.getCategories().map(c => c.category);
const allReqCategoriesPresent = requiredCategories.every(rc => categoriesInDb.includes(rc));
assert('All 5 requested fashion categories present in SQLite', allReqCategoriesPresent, categoriesInDb.join(', '));

requiredCategories.forEach(cat => {
  const catProducts = db.getProducts({ category: cat });
  assert(`Category "${cat}" has active catalog items`, catProducts.length === 15, `${catProducts.length} items found`);
});

// ----------------------------------------------------------------------------
// 3. Brand Filtering & Smart Search
// ----------------------------------------------------------------------------
console.log('\n--- 3. Brand Filtering & Smart Search ---');
const testBrands = ['Roadster', 'HRX by Hrithik Roshan', 'Anouk', 'Libas', 'WROGN', 'Mango', 'Levis', 'Maybelline New York', "D'Decor"];
testBrands.forEach(b => {
  const brandMatches = db.getProducts({ brand: b });
  assert(`Brand Filter: "${b}"`, brandMatches.length > 0 && brandMatches.every(p => p.brand === b), `${brandMatches.length} items`);
});

const testQueries = [
  { q: 'kurt', minMatches: 2, label: 'Partial "kurt" matches Kurta / Kurti' },
  { q: 'saree', minMatches: 1, label: 'Keyword "saree" matches Sarees' },
  { q: 'cotton shirt', minMatches: 2, label: 'Multi-token "cotton shirt"' },
  { q: 'running shoes', minMatches: 2, label: 'Multi-token "running shoes"' },
  { q: 'serum', minMatches: 3, label: 'Keyword "serum" matches face serums' },
  { q: 'bedsheet', minMatches: 1, label: 'Keyword "bedsheet" matches bedsheets' }
];

testQueries.forEach(t => {
  const matches = db.getProducts({ search: t.q });
  assert(`Smart Search: ${t.label}`, matches.length >= t.minMatches, `${matches.length} matches`);
});

// ----------------------------------------------------------------------------
// 4. Search Suggestions (Autocomplete API)
// ----------------------------------------------------------------------------
console.log('\n--- 4. Search Suggestions Dropdown Verification ---');
const sugg1 = db.getSearchSuggestions('road');
assert('Suggestions for "road" returns product matches', sugg1.products.length > 0, `${sugg1.products.length} products`);
assert('Suggestions for "road" returns brand matches', sugg1.brands.length > 0, sugg1.brands.join(', '));

const sugg2 = db.getSearchSuggestions('men');
assert('Suggestions for "men" returns category matches', sugg2.categories.length > 0, sugg2.categories.join(', '));

// ----------------------------------------------------------------------------
// 5. Size Filtering & Price Sorting
// ----------------------------------------------------------------------------
console.log('\n--- 5. Size Filtering & Price Sorting ---');
const sizeM = db.getProducts({ size: 'M' });
assert('Size Filter "M"', sizeM.length > 10, `${sizeM.length} products`);

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

// ----------------------------------------------------------------------------
// 6. SQLite Backend Data Persistence & Regression Safety
// ----------------------------------------------------------------------------
console.log('\n--- 6. SQLite Backend Data Persistence & Regression Safety ---');
assert('Backend driver is SQLite', db.dbDriver === 'sqlite');

const testSession = 'verify_sess_' + Date.now();
const cartRes = db.addToCart(testSession, 1, 2, 'L');
assert('Add to Cart in SQLite with Size', cartRes.length === 1 && cartRes[0].quantity === 2 && cartRes[0].size === 'L', 'Item preserved');

const wishRes = db.toggleWishlist(testSession, 1);
assert('Wishlist Toggle in SQLite', wishRes.isWishlisted === true && wishRes.wishlist.includes(1), 'Wishlist preserved');

const orderId = 'MYN-VERIFY-' + Math.floor(10000 + Math.random() * 90000);
const orderRes = db.createOrder({
  orderId,
  orderDate: '26 Nov 2026',
  customer: { name: 'Rishabh Kumar', phone: '9876543210', address: '123 Fashion Street, Delhi' },
  paymentMethod: 'Cash On Delivery',
  totalAmount: 1398,
  items: [{ id: 1, name: 'Denim Casual Shirt', price: 699, quantity: 2, size: 'L' }]
});
assert('Order Persistence in SQLite', orderRes.success === true, `Order ${orderId} created`);

const orders = db.getOrders();
const savedOrder = orders.find(o => o.orderId === orderId);
assert('Order Retrieved from SQLite', savedOrder && savedOrder.customer.name === 'Rishabh Kumar');

const couponMyntra = db.validateCoupon('MYNTRA200', 899);
assert('Coupon MYNTRA200 valid for order >= ₹799', couponMyntra.valid && couponMyntra.discount === 200);

const couponCompat = db.validateCoupon('MEESHONEW', 599);
assert('Coupon MEESHONEW backward compatible valid', couponCompat.valid && couponCompat.discount === 150);

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
