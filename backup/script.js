/**
 * ============================================================================
 * Meesho Clone - Smart Online Shopping Engine
 * Inspired by Meesho (meesho.com)
 * Pure Vanilla JavaScript (ES6+)
 * Author: Senior Frontend Developer / B.Tech College Project Demonstration
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. MEESHO PRODUCT DATABASE (22 Authentic Indian E-Commerce Products)
  // ==========================================================================
  const PRODUCTS_DATA = [
    {
      id: 1,
      name: "Charvi Sensational Embroidered Rayon Anarkali Kurta Set",
      category: "Women Ethnic",
      price: 649,
      originalPrice: 1999,
      discount: 67,
      rating: 4.4,
      reviewsCount: 4820,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
      description: "Gorgeous Rayon Anarkali Kurta paired with matching Palazzos and chiffon printed dupatta. Features delicate golden Zari embroidery around the neckline. Perfect for festivals, family functions, and festive celebrations.",
      popularity: 98,
      stock: 15,
      badge: "M-Trusted",
      tags: ["trending", "bestseller", "ethnic", "kurti", "saree"]
    },
    {
      id: 2,
      name: "Aishani Alluring Pure Kanjeevaram Jacquard Silk Saree",
      category: "Women Ethnic",
      price: 899,
      originalPrice: 2999,
      discount: 70,
      rating: 4.6,
      reviewsCount: 6120,
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
      description: "Traditional South Indian Kanjeevaram woven soft silk saree embellished with rich temple border and designer Zari pallu. Includes 0.8m unstitched contrast designer blouse piece.",
      popularity: 99,
      stock: 8,
      badge: "Trending",
      tags: ["trending", "ethnic", "saree", "bestseller"]
    },
    {
      id: 3,
      name: "Kashvi Pretty Floral Pure Cotton Maxi Tiered Dress",
      category: "Women Western",
      price: 479,
      originalPrice: 1299,
      discount: 63,
      rating: 4.3,
      reviewsCount: 1820,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
      description: "Breathable pure cotton tiered maxi dress with flattering puff sleeves and a matching tie-up fabric belt. Comfortable for summer outings, brunches, and college wear.",
      popularity: 88,
      stock: 12,
      badge: "60%+ OFF",
      tags: ["western", "casual", "dress"]
    },
    {
      id: 4,
      name: "Trendy Men's Cotton Linen Mandarin Collar Casual Shirt",
      category: "Men",
      price: 429,
      originalPrice: 1199,
      discount: 64,
      rating: 4.3,
      reviewsCount: 2810,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
      description: "Premium breathable cotton-linen blend casual shirt with modern Mandarin collar and roll-up sleeves. Soft washed fabric for supreme all-day comfort in tropical climates.",
      popularity: 91,
      stock: 20,
      badge: "Hot Deal",
      tags: ["trending", "menswear", "shirt"]
    },
    {
      id: 5,
      name: "Urbano Men's Slim Fit Stretchable Denim Jeans (Dark Indigo)",
      category: "Men",
      price: 599,
      originalPrice: 1699,
      discount: 65,
      rating: 4.2,
      reviewsCount: 2980,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
      description: "Authentic heavy-duty cotton denim with 2% elastane for unrestricted stretch and flexibility. Features classic 5-pocket styling and scratch-resistant brass zip fly.",
      popularity: 87,
      stock: 14,
      badge: "M-Trusted",
      tags: ["bestseller", "jeans", "menswear"]
    },
    {
      id: 6,
      name: "Streetwear Men's Oversized Graphic Print Cotton T-Shirt",
      category: "Men",
      price: 279,
      originalPrice: 799,
      discount: 65,
      rating: 4.5,
      reviewsCount: 5320,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
      description: "100% bio-washed 220 GSM combed cotton oversized streetwear t-shirt with aesthetic typography graphic print. Non-shrinkable and colorfast wash guarantee.",
      popularity: 95,
      stock: 25,
      badge: "Under ₹299",
      tags: ["streetwear", "casual", "under299"]
    },
    {
      id: 7,
      name: "Rajasthani Handcrafted Floral Embroidered Ethnic Mojari Juttis",
      category: "Bags & Footwear",
      price: 349,
      originalPrice: 999,
      discount: 65,
      rating: 4.5,
      reviewsCount: 3890,
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
      description: "Handcrafted authentic Jaipuri leather mojari juttis featuring rich silk thread embroidery and foam cushion footbed for all-day festive comfort. Pairs gracefully with sarees and kurtas.",
      popularity: 94,
      stock: 18,
      badge: "M-Trusted",
      tags: ["footwear", "ethnic", "juttis", "shoes"]
    },
    {
      id: 8,
      name: "Women's Textured Vegan Leather Crossbody Shoulder Handbag",
      category: "Bags & Footwear",
      price: 499,
      originalPrice: 1499,
      discount: 66,
      rating: 4.4,
      reviewsCount: 4120,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
      description: "Elegant textured vegan leather shoulder bag with detachable crossbody strap. Features spacious dual compartments, interior zippered pocket, and polished gold-tone hardware.",
      popularity: 93,
      stock: 11,
      badge: "Trending",
      tags: ["trending", "bag", "handbag", "fashion"]
    },
    {
      id: 9,
      name: "AeroTune True Wireless Earbuds with ENC & 45h Playtime",
      category: "Electronics",
      price: 799,
      originalPrice: 2499,
      discount: 68,
      rating: 4.5,
      reviewsCount: 7730,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      description: "Crystal-clear calls powered by Quad Mic Environmental Noise Cancellation (ENC). Ultra-low 40ms gaming latency, 13mm dynamic bass drivers, and IPX5 splash resistance.",
      popularity: 99,
      stock: 22,
      badge: "M-Trusted",
      tags: ["trending", "bestseller", "gadget", "audio"]
    },
    {
      id: 10,
      name: "PulseFit 1.96\" AMOLED Smartwatch with BT Calling & SpO2",
      category: "Electronics",
      price: 1199,
      originalPrice: 3999,
      discount: 70,
      rating: 4.4,
      reviewsCount: 3920,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      description: "Vibrant always-on AMOLED display with 600 nits peak brightness. Built-in speaker and mic for wrist calling, 120+ sports tracking modes, 24/7 heart rate and blood oxygen monitoring.",
      popularity: 96,
      stock: 9,
      badge: "Trending",
      tags: ["trending", "smartwatch", "fitness"]
    },
    {
      id: 11,
      name: "FastCharge 20,000mAh Power Bank with 22.5W Two-Way QC",
      category: "Electronics",
      price: 899,
      originalPrice: 2199,
      discount: 59,
      rating: 4.6,
      reviewsCount: 3190,
      image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80",
      description: "High-density Lithium-Polymer cell with dual USB output and Type-C PD input/output. Charges smartphones up to 4 times on a single refill. 12-layer advanced circuit protection.",
      popularity: 88,
      stock: 14,
      badge: "Hot Deal",
      tags: ["electronics", "charger", "travel"]
    },
    {
      id: 12,
      name: "Non-Stick 3-Piece Granite Kitchen Cookware Set",
      category: "Home & Kitchen",
      price: 999,
      originalPrice: 2999,
      discount: 66,
      rating: 4.7,
      reviewsCount: 4680,
      image: "https://images.unsplash.com/photo-1584990347449-a292886f4553?auto=format&fit=crop&w=600&q=80",
      description: "5-layer scratch-resistant German granite coating. Set includes 24cm Dosa Tawa, 24cm Frying Pan, and 2.5L Kadhai with tempered glass lid. Induction and gas stove compatible.",
      popularity: 93,
      stock: 7,
      badge: "M-Trusted",
      tags: ["bestseller", "kitchen", "cookware"]
    },
    {
      id: 13,
      name: "100% Pure Cotton Jaipuri Floral Double Bedsheet with 2 Pillows",
      category: "Home & Kitchen",
      price: 369,
      originalPrice: 999,
      discount: 63,
      rating: 4.3,
      reviewsCount: 5610,
      image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
      description: "King size (90x100 inches) 180 TC breathable cotton bedsheet. Fade-resistant reactive digital printing with soft skin-friendly texture. Machine washable.",
      popularity: 92,
      stock: 30,
      badge: "Trending",
      tags: ["trending", "homedecor", "bedsheet"]
    },
    {
      id: 14,
      name: "Stainless Steel Insulated 1000ml Thermal Water Bottle",
      category: "Home & Kitchen",
      price: 299,
      originalPrice: 899,
      discount: 67,
      rating: 4.5,
      reviewsCount: 3980,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
      description: "Double-walled vacuum insulation keeps liquids icy cold for 24 hours or piping hot for 12 hours. Made of food-grade 304 stainless steel with leak-proof screw cap.",
      popularity: 89,
      stock: 22,
      badge: "Under ₹299",
      tags: ["kitchen", "fitness", "bottle", "under299"]
    },
    {
      id: 15,
      name: "Vitamin C Glow Serum 30ml with Hyaluronic Acid & Ferulic",
      category: "Beauty & Health",
      price: 279,
      originalPrice: 699,
      discount: 60,
      rating: 4.6,
      reviewsCount: 8890,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
      description: "Advanced brightening facial serum formulated with 10% stable Vitamin C and multi-molecular Hyaluronic Acid. Fades dark spots, sun damage, and boosts radiant glowing skin.",
      popularity: 97,
      stock: 16,
      badge: "M-Trusted",
      tags: ["bestseller", "skincare", "beauty", "under299"]
    },
    {
      id: 16,
      name: "Velvet Matte Liquid Lipstick Combo Set of 4 Shades",
      category: "Beauty & Health",
      price: 299,
      originalPrice: 999,
      discount: 70,
      rating: 4.3,
      reviewsCount: 4520,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
      description: "Smudge-proof, waterproof, 12-hour transfer-proof matte liquid lipsticks infused with Vitamin E and Jojoba oil. Includes 4 universally flattering Indian skin tone shades (Nude, Berry, Red, Coral).",
      popularity: 92,
      stock: 14,
      badge: "Under ₹299",
      tags: ["trending", "makeup", "cosmetics", "under299"]
    },
    {
      id: 17,
      name: "Organic Arabica Coffee Face & Body Scrub (100g)",
      category: "Beauty & Health",
      price: 199,
      originalPrice: 499,
      discount: 60,
      rating: 4.4,
      reviewsCount: 2710,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
      description: "Exfoliating raw coffee scrub with cold-pressed coconut oil. Gently removes dead skin cells, tan, and reduces cellulite appearance. 100% vegan and cruelty-free.",
      popularity: 85,
      stock: 28,
      badge: "Under ₹199",
      tags: ["skincare", "beauty", "under299"]
    },
    {
      id: 18,
      name: "Ethnic Kundan & Pearl Gold-Plated Choker Jewellery Set",
      category: "Jewellery & Accessories",
      price: 449,
      originalPrice: 1499,
      discount: 70,
      rating: 4.5,
      reviewsCount: 4170,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
      description: "Handcrafted traditional bridal Kundan necklace with matching Jhumka earrings and Maang Tikka. High-polish micron gold plating with cluster pearl drops.",
      popularity: 95,
      stock: 12,
      badge: "M-Trusted",
      tags: ["jewellery", "ethnic", "bestseller"]
    },
    {
      id: 19,
      name: "Polarized UV400 Protection Classic Aviator Sunglasses",
      category: "Jewellery & Accessories",
      price: 249,
      originalPrice: 799,
      discount: 68,
      rating: 4.4,
      reviewsCount: 5290,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
      description: "Timeless teardrop aviator frame with tri-acetate polarized lenses that block 100% of UVA & UVB rays. Feather-light metallic frame with comfortable silicone nose pads.",
      popularity: 91,
      stock: 19,
      badge: "Under ₹299",
      tags: ["accessories", "sunglasses", "under299"]
    },
    {
      id: 20,
      name: "Men's Genuine Leather Slim RFID-Blocking Bifold Wallet",
      category: "Jewellery & Accessories",
      price: 299,
      originalPrice: 899,
      discount: 66,
      rating: 4.6,
      reviewsCount: 3340,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
      description: "Crafted from top-grain oil-waxed leather. Integrated RFID electromagnetic shielding protects your credit cards from unauthorized digital scans. Features 8 card slots and 2 currency pockets.",
      popularity: 88,
      stock: 15,
      badge: "Under ₹299",
      tags: ["accessories", "wallet", "leather", "under299"]
    },
    {
      id: 21,
      name: "Universal Ergonomic Aluminum Laptop & Tablet Stand",
      category: "Electronics",
      price: 399,
      originalPrice: 1099,
      discount: 63,
      rating: 4.7,
      reviewsCount: 4510,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
      description: "Solid CNC aluminum alloy riser with 6-level adjustable angles to relieve neck pain. Foldable portable design with non-slip silicone pads and heat ventilation hollow frame.",
      popularity: 90,
      stock: 24,
      badge: "Top Rated",
      tags: ["electronics", "workfromhome", "laptop"]
    },
    {
      id: 22,
      name: "Women's Printed Georgette Party Wear Anarkali Gown",
      category: "Women Ethnic",
      price: 549,
      originalPrice: 1799,
      discount: 69,
      rating: 4.5,
      reviewsCount: 3210,
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
      description: "Flowy micro-georgette festive Anarkali gown with digital floral prints and crepe lining. Includes matching dupatta with lace border.",
      popularity: 94,
      stock: 16,
      badge: "Trending",
      tags: ["ethnic", "anarkali", "gown", "trending"]
    }
  ];

  // SVG Fallback Data URI in case of network issue
  const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect fill='%23fcebf5' width='400' height='400'/><text fill='%239f2089' font-family='sans-serif' font-size='22' font-weight='900' x='50%25' y='48%25' text-anchor='middle'>meesho</text><text fill='%2364748b' font-family='sans-serif' font-size='13' x='50%25' y='55%25' text-anchor='middle'>Trusted Supplier Product</text></svg>";

  // ==========================================================================
  // 2. APPLICATION STATE MANAGEMENT
  // ==========================================================================
  const STATE = {
    products: PRODUCTS_DATA,
    filteredProducts: [...PRODUCTS_DATA],
    cart: loadFromStorage('meesho_cart', loadFromStorage('shopease_cart', [])),
    wishlist: loadFromStorage('meesho_wishlist', loadFromStorage('shopease_wishlist', [])),
    orders: loadFromStorage('meesho_orders', loadFromStorage('shopease_orders', [])),
    activeCategory: 'All',
    searchQuery: '',
    sortBy: 'popular',
    viewFilter: 'all',
    appliedCoupon: null,
    selectedProductModal: null,
    modalQuantity: 1
  };

  // Valid Meesho Promo Coupons
  const PROMO_COUPONS = {
    'MEESHONEW': { discount: 150, type: 'flat', minOrder: 499, desc: 'Flat ₹150 OFF on first order' },
    'MEESHO100': { discount: 100, type: 'flat', minOrder: 299, desc: 'Flat ₹100 OFF on any order above ₹299' },
    'FESTIVE20': { discount: 20, type: 'percent', minOrder: 599, desc: 'Extra 20% OFF on Sarees & Fashion' },
    'EASENEW': { discount: 150, type: 'flat', minOrder: 499, desc: 'Flat ₹150 OFF on order above ₹499' },
    'FREEDEL': { discount: 40, type: 'delivery', minOrder: 0, desc: 'Free Delivery on any order' }
  };

  // ==========================================================================
  // 3. STORAGE HELPERS
  // ==========================================================================
  function loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Storage load failed for ${key}:`, e);
      return fallback;
    }
  }

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage save failed for ${key}:`, e);
    }
  }

  // ==========================================================================
  // 4. DOM ELEMENTS CACHE
  // ==========================================================================
  const DOM = {
    // Nav & Search
    header: document.getElementById('header'),
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    searchSuggestions: document.getElementById('search-suggestions'),
    cartBtn: document.getElementById('cart-btn'),
    wishlistBtn: document.getElementById('wishlist-btn'),
    accountBtn: document.getElementById('account-btn'),
    cartCount: document.getElementById('cart-count'),
    wishlistCount: document.getElementById('wishlist-count'),
    mobCartCount: document.getElementById('mob-cart-count'),
    mobWishlistCount: document.getElementById('mob-wishlist-count'),
    categoryNavList: document.getElementById('category-nav-list'),

    // Mobile Bottom Nav
    mobNavHome: document.getElementById('mob-nav-home'),
    mobNavCategories: document.getElementById('mob-nav-categories'),
    mobNavWishlist: document.getElementById('mob-nav-wishlist'),
    mobNavCart: document.getElementById('mob-nav-cart'),
    mobNavAccount: document.getElementById('mob-nav-account'),

    // Product Catalog
    productGrid: document.getElementById('product-grid'),
    emptyCatalogState: document.getElementById('empty-catalog-state'),
    emptyResetBtn: document.getElementById('empty-reset-btn'),
    resultsCount: document.getElementById('results-count'),
    activeCategoryTag: document.getElementById('active-category-tag'),
    activeSearchTag: document.getElementById('active-search-tag'),
    activeSearchQuery: document.getElementById('active-search-query'),
    categorySelect: document.getElementById('category-select'),
    sortSelect: document.getElementById('sort-select'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),
    viewFilterTabs: document.querySelectorAll('.filter-tab'),

    // Product Modal
    productModalBackdrop: document.getElementById('product-modal-backdrop'),
    productModalBody: document.getElementById('product-modal-body'),
    closeProductModal: document.getElementById('close-product-modal'),

    // Cart Drawer
    cartDrawerBackdrop: document.getElementById('cart-drawer-backdrop'),
    closeCartDrawer: document.getElementById('close-cart-drawer'),
    cartDrawerCount: document.getElementById('cart-drawer-count'),
    cartItemsContainer: document.getElementById('cart-items-container'),
    cartFooter: document.getElementById('cart-footer'),
    freeDeliveryBanner: document.getElementById('free-delivery-banner'),
    deliveryStatusText: document.getElementById('delivery-status-text'),
    deliveryProgressFill: document.getElementById('delivery-progress-fill'),
    cartCouponInput: document.getElementById('cart-coupon-input'),
    applyCouponBtn: document.getElementById('apply-coupon-btn'),
    couponMsg: document.getElementById('coupon-msg'),
    billMrp: document.getElementById('bill-mrp'),
    billDiscount: document.getElementById('bill-discount'),
    couponDiscountRow: document.getElementById('coupon-discount-row'),
    billCoupon: document.getElementById('bill-coupon'),
    billDelivery: document.getElementById('bill-delivery'),
    billGrandTotal: document.getElementById('bill-grand-total'),
    proceedCheckoutBtn: document.getElementById('proceed-checkout-btn'),
    continueShoppingBtn: document.getElementById('continue-shopping-cart-btn'),

    // Wishlist Drawer
    wishlistDrawerBackdrop: document.getElementById('wishlist-drawer-backdrop'),
    closeWishlistDrawer: document.getElementById('close-wishlist-drawer'),
    wishlistDrawerCount: document.getElementById('wishlist-drawer-count'),
    wishlistItemsContainer: document.getElementById('wishlist-items-container'),
    continueShoppingWishlistBtn: document.getElementById('continue-shopping-wishlist-btn'),

    // Checkout Modal
    checkoutModalBackdrop: document.getElementById('checkout-modal-backdrop'),
    closeCheckoutModal: document.getElementById('close-checkout-modal'),
    checkoutForm: document.getElementById('checkout-form'),
    checkoutItemsPreview: document.getElementById('checkout-items-preview'),
    checkoutItemsCount: document.getElementById('checkout-items-count'),
    checkoutSubtotal: document.getElementById('checkout-subtotal'),
    checkoutDiscountVal: document.getElementById('checkout-discount-val'),
    checkoutShippingVal: document.getElementById('checkout-shipping-val'),
    checkoutGrandTotal: document.getElementById('checkout-grand-total'),
    checkoutBtnAmount: document.getElementById('checkout-btn-amount'),

    // Order Success Modal
    orderSuccessBackdrop: document.getElementById('order-success-backdrop'),
    confirmedOrderId: document.getElementById('confirmed-order-id'),
    confirmedOrderDate: document.getElementById('confirmed-order-date'),
    confirmedPaymentMethod: document.getElementById('confirmed-payment-method'),
    confirmedDeliveryDate: document.getElementById('confirmed-delivery-date'),
    confirmedAddressText: document.getElementById('confirmed-address-text'),
    confirmedTotalAmount: document.getElementById('confirmed-total-amount'),
    successContinueShoppingBtn: document.getElementById('success-continue-shopping-btn'),
    successViewOrdersBtn: document.getElementById('success-view-orders-btn'),

    // Account Modal
    accountModalBackdrop: document.getElementById('account-modal-backdrop'),
    closeAccountModal: document.getElementById('close-account-modal'),
    accOrdersCount: document.getElementById('acc-orders-count'),
    accOrdersList: document.getElementById('acc-orders-list'),
    savedAddressPreview: document.getElementById('saved-address-preview'),

    // UI Tools
    toastContainer: document.getElementById('toast-container'),
    backToTop: document.getElementById('back-to-top'),
    copyCodeBtn: document.getElementById('copy-code-btn'),
    newsletterForm: document.getElementById('newsletter-form'),
    newsletterEmail: document.getElementById('newsletter-email'),
    newsletterFeedback: document.getElementById('newsletter-feedback')
  };

  // Format currency in Indian standard (e.g. ₹1,299)
  function formatINR(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
  }

  // ==========================================================================
  // 5. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  function showToast(message, type = 'info', icon = null) {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check text-success';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation text-warning';
    if (type === 'danger') iconClass = 'fa-solid fa-circle-xmark text-danger';
    if (icon) iconClass = icon;

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span class="toast-msg">${message}</span>
    `;

    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3200);
  }

  // ==========================================================================
  // 6. MEESHO CATALOG & FILTER ENGINE
  // ==========================================================================
  function applyFiltersAndSort() {
    let result = [...STATE.products];

    // 1. Category Filter
    if (STATE.activeCategory && STATE.activeCategory !== 'All') {
      result = result.filter(p => p.category === STATE.activeCategory);
    }

    // 2. Search Query Filter
    if (STATE.searchQuery.trim() !== '') {
      const q = STATE.searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // 3. View Filter Tab (all, trending, bestseller/M-trusted, discounted, under299)
    if (STATE.viewFilter === 'trending') {
      result = result.filter(p => p.badge === 'Trending' || (p.tags && p.tags.includes('trending')));
    } else if (STATE.viewFilter === 'bestseller') {
      result = result.filter(p => p.badge === 'M-Trusted' || p.badge === 'Bestseller' || (p.tags && p.tags.includes('bestseller')));
    } else if (STATE.viewFilter === 'discounted') {
      result = result.filter(p => p.discount >= 65);
    } else if (STATE.viewFilter === 'under299') {
      result = result.filter(p => p.price <= 299);
    }

    // 4. Sorting
    switch (STATE.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    STATE.filteredProducts = result;
    renderCatalog();
    updateToolbarInfo();
  }

  function renderCatalog() {
    if (!DOM.productGrid) return;

    if (STATE.filteredProducts.length === 0) {
      DOM.productGrid.innerHTML = '';
      if (DOM.emptyCatalogState) DOM.emptyCatalogState.hidden = false;
      return;
    }

    if (DOM.emptyCatalogState) DOM.emptyCatalogState.hidden = true;

    const html = STATE.filteredProducts.map(p => {
      const isWishlisted = STATE.wishlist.includes(p.id);
      const isLowStock = p.stock <= 8;

      let badgeClass = 'card-badge';
      if (p.badge === 'M-Trusted' || p.badge === 'Bestseller') badgeClass += ' card-badge-bestseller';
      if (p.badge === 'Trending') badgeClass += ' card-badge-trending';

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="card-image-box" onclick="window.Meesho.openProductModal(${p.id})">
            <img 
              src="${p.image}" 
              alt="${p.name}" 
              class="card-img" 
              loading="lazy"
              onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
            />
            ${p.badge ? `<span class="${badgeClass}">${p.badge}</span>` : ''}
            
            <button 
              type="button" 
              class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" 
              data-id="${p.id}" 
              onclick="event.stopPropagation(); window.Meesho.toggleWishlist(${p.id});"
              aria-label="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}"
              title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
            >
              <i class="${isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
            </button>

            <button 
              type="button" 
              class="card-quickview-btn" 
              onclick="event.stopPropagation(); window.Meesho.openProductModal(${p.id});"
            >
              <i class="fa-regular fa-eye"></i> Quick View
            </button>
          </div>

          <div class="card-content">
            <div class="card-category-row">
              <span class="card-category">${p.category}</span>
              <span class="card-stock-pill ${isLowStock ? 'card-stock-low' : ''}">
                ${isLowStock ? `Only ${p.stock} left!` : 'In Stock'}
              </span>
            </div>

            <h3 class="card-title" onclick="window.Meesho.openProductModal(${p.id})" title="${p.name}">
              ${p.name}
            </h3>

            <div class="card-rating-row">
              <span class="rating-badge">
                <i class="fa-solid fa-star"></i> ${p.rating}
              </span>
              <span class="reviews-count">(${Number(p.reviewsCount).toLocaleString('en-IN')} Reviews)</span>
            </div>

            <div class="card-price-row">
              <span class="price-current">${formatINR(p.price)}</span>
              <span class="price-original">${formatINR(p.originalPrice)}</span>
              <span class="price-discount">${p.discount}% off</span>
            </div>

            <div class="card-delivery-tag">
              <i class="fa-solid fa-truck-fast"></i>
              <span>Free Delivery</span>
            </div>

            <button 
              type="button" 
              class="card-add-cart-btn" 
              onclick="window.Meesho.addToCart(${p.id}, 1, true)"
              aria-label="Add ${p.name} to cart"
            >
              <i class="fa-solid fa-bag-shopping"></i> Add to Cart
            </button>
          </div>
        </article>
      `;
    }).join('');

    DOM.productGrid.innerHTML = html;
  }

  function updateToolbarInfo() {
    if (DOM.resultsCount) {
      DOM.resultsCount.textContent = `Showing ${STATE.filteredProducts.length} of ${STATE.products.length} products`;
    }

    if (DOM.activeCategoryTag) {
      DOM.activeCategoryTag.innerHTML = `Category: <strong>${STATE.activeCategory}</strong>`;
    }

    if (DOM.activeSearchTag && DOM.activeSearchQuery) {
      if (STATE.searchQuery.trim() !== '') {
        DOM.activeSearchTag.hidden = false;
        DOM.activeSearchQuery.textContent = `"${STATE.searchQuery}"`;
      } else {
        DOM.activeSearchTag.hidden = true;
      }
    }

    // Sync Dropdown
    if (DOM.categorySelect && DOM.categorySelect.value !== STATE.activeCategory) {
      DOM.categorySelect.value = STATE.activeCategory;
    }

    // Sync Horizontal Category Nav Bar
    const navItems = document.querySelectorAll('.category-nav-item');
    navItems.forEach(btn => {
      const cat = btn.getAttribute('data-category');
      if (cat === STATE.activeCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // ==========================================================================
  // 7. PRODUCT DETAILS MODAL (QUICK VIEW)
  // ==========================================================================
  function openProductModal(productId) {
    const product = STATE.products.find(p => p.id === productId);
    if (!product) return;

    STATE.selectedProductModal = product;
    STATE.modalQuantity = 1;

    const isWishlisted = STATE.wishlist.includes(product.id);
    const isLowStock = product.stock <= 8;

    DOM.productModalBody.innerHTML = `
      <div class="modal-product-grid">
        <div class="modal-img-wrap">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
          />
        </div>

        <div class="modal-info-col">
          <span class="modal-category-badge">${product.category}</span>
          <h2 class="modal-product-title" id="modal-product-title">${product.name}</h2>

          <div class="modal-rating-row">
            <span class="rating-badge">
              <i class="fa-solid fa-star"></i> ${product.rating}
            </span>
            <span class="reviews-count">${Number(product.reviewsCount).toLocaleString('en-IN')} Verified Customer Ratings</span>
            <span class="badge-pill bg-success-soft">M-Trusted Supplier</span>
          </div>

          <div class="modal-price-card">
            <span class="current-price">${formatINR(product.price)}</span>
            <span class="orig-price">${formatINR(product.originalPrice)}</span>
            <span class="discount-pill">${product.discount}% OFF</span>
          </div>

          <div class="modal-desc-box">
            <p>${product.description}</p>
          </div>

          <div class="modal-perks-list">
            <div class="perk-item"><i class="fa-solid fa-check"></i> Free Delivery Across India</div>
            <div class="perk-item"><i class="fa-solid fa-check"></i> Cash On Delivery (COD)</div>
            <div class="perk-item"><i class="fa-solid fa-check"></i> 7-Day Easy Doorstep Return</div>
            <div class="perk-item"><i class="fa-solid fa-check"></i> Lowest Price Direct from Seller</div>
          </div>

          <div class="modal-qty-row">
            <span style="font-weight: 700; font-size: 0.9rem;">Quantity:</span>
            <div class="qty-control">
              <button type="button" class="qty-btn" id="modal-qty-minus" aria-label="Decrease quantity">-</button>
              <span class="qty-value" id="modal-qty-val">1</span>
              <button type="button" class="qty-btn" id="modal-qty-plus" aria-label="Increase quantity">+</button>
            </div>
            <span class="card-stock-pill ${isLowStock ? 'card-stock-low' : ''}" style="margin-left: 0.5rem;">
              ${isLowStock ? `Only ${product.stock} items left in stock!` : 'In Stock (Ready to Dispatch)'}
            </span>
          </div>

          <div class="modal-actions-row">
            <button 
              type="button" 
              class="btn btn-primary btn-lg btn-block" 
              id="modal-add-cart-btn"
            >
              <i class="fa-solid fa-bag-shopping"></i> Add to Cart
            </button>
            <button 
              type="button" 
              class="btn btn-outline btn-lg" 
              id="modal-wishlist-toggle"
              title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
            >
              <i class="${isWishlisted ? 'fa-solid fa-heart text-pink' : 'fa-regular fa-heart'}"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    const minusBtn = document.getElementById('modal-qty-minus');
    const plusBtn = document.getElementById('modal-qty-plus');
    const qtyVal = document.getElementById('modal-qty-val');
    const addCartBtn = document.getElementById('modal-add-cart-btn');
    const wishlistToggle = document.getElementById('modal-wishlist-toggle');

    minusBtn.addEventListener('click', () => {
      if (STATE.modalQuantity > 1) {
        STATE.modalQuantity--;
        qtyVal.textContent = STATE.modalQuantity;
      }
    });

    plusBtn.addEventListener('click', () => {
      if (STATE.modalQuantity < product.stock) {
        STATE.modalQuantity++;
        qtyVal.textContent = STATE.modalQuantity;
      } else {
        showToast(`Maximum stock limit is ${product.stock}`, 'warning');
      }
    });

    addCartBtn.addEventListener('click', () => {
      addToCart(product.id, STATE.modalQuantity, true);
      closeProductModal();
    });

    wishlistToggle.addEventListener('click', () => {
      toggleWishlist(product.id);
      const updatedWishlisted = STATE.wishlist.includes(product.id);
      wishlistToggle.innerHTML = `<i class="${updatedWishlisted ? 'fa-solid fa-heart text-pink' : 'fa-regular fa-heart'}"></i>`;
    });

    DOM.productModalBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    DOM.productModalBackdrop.hidden = true;
    STATE.selectedProductModal = null;
    document.body.style.overflow = '';
  }

  // ==========================================================================
  // 8. SHOPPING CART ENGINE
  // ==========================================================================
  function addToCart(productId, quantity = 1, showToastNotification = true) {
    const product = STATE.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = STATE.cart.findIndex(item => item.product.id === productId);

    if (existingIndex > -1) {
      STATE.cart[existingIndex].quantity += quantity;
    } else {
      STATE.cart.push({
        product: product,
        quantity: quantity
      });
    }

    saveToStorage('meesho_cart', STATE.cart);
    saveToStorage('shopease_cart', STATE.cart); // Backwards compatibility
    updateCartBadges();

    if (showToastNotification) {
      showToast(`Added <strong>${product.name.slice(0, 28)}...</strong> to Meesho Bag!`, 'success');
    }

    if (!DOM.cartDrawerBackdrop.hidden) {
      renderCartDrawer();
    }
  }

  function updateCartItemQty(productId, delta) {
    const itemIndex = STATE.cart.findIndex(i => i.product.id === productId);
    if (itemIndex === -1) return;

    const currentQty = STATE.cart[itemIndex].quantity;
    const newQty = currentQty + delta;

    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      if (newQty > STATE.cart[itemIndex].product.stock) {
        showToast(`Sorry, only ${STATE.cart[itemIndex].product.stock} items are in stock!`, 'warning');
        return;
      }
      STATE.cart[itemIndex].quantity = newQty;
      saveToStorage('meesho_cart', STATE.cart);
      saveToStorage('shopease_cart', STATE.cart);
      updateCartBadges();
      renderCartDrawer();
    }
  }

  function removeFromCart(productId) {
    const item = STATE.cart.find(i => i.product.id === productId);
    STATE.cart = STATE.cart.filter(i => i.product.id !== productId);
    saveToStorage('meesho_cart', STATE.cart);
    saveToStorage('shopease_cart', STATE.cart);
    updateCartBadges();
    renderCartDrawer();

    if (item) {
      showToast(`Removed <strong>${item.product.name.slice(0, 24)}...</strong> from bag`, 'info');
    }
  }

  function updateCartBadges() {
    const totalItems = STATE.cart.reduce((sum, item) => sum + item.quantity, 0);

    if (DOM.cartCount) DOM.cartCount.textContent = totalItems;
    if (DOM.mobCartCount) DOM.mobCartCount.textContent = totalItems;
    if (DOM.cartDrawerCount) DOM.cartDrawerCount.textContent = `(${totalItems} item${totalItems === 1 ? '' : 's'})`;
  }

  function calculateCartTotals() {
    let subtotalMRP = 0;
    let currentTotal = 0;

    STATE.cart.forEach(item => {
      subtotalMRP += (item.product.originalPrice * item.quantity);
      currentTotal += (item.product.price * item.quantity);
    });

    const bagDiscount = subtotalMRP - currentTotal;
    let deliveryFee = currentTotal >= 499 || currentTotal === 0 ? 0 : 40;

    let couponDiscount = 0;
    if (STATE.appliedCoupon && currentTotal > 0) {
      if (STATE.appliedCoupon.type === 'flat') {
        couponDiscount = STATE.appliedCoupon.discount;
      } else if (STATE.appliedCoupon.type === 'percent') {
        couponDiscount = Math.round((currentTotal * STATE.appliedCoupon.discount) / 100);
      } else if (STATE.appliedCoupon.type === 'delivery') {
        deliveryFee = 0;
      }
    }

    const finalAmount = Math.max(0, currentTotal - couponDiscount + deliveryFee);

    return {
      subtotalMRP,
      currentTotal,
      bagDiscount,
      couponDiscount,
      deliveryFee,
      finalAmount,
      totalCount: STATE.cart.reduce((s, i) => s + i.quantity, 0)
    };
  }

  function renderCartDrawer() {
    if (!DOM.cartItemsContainer) return;

    if (STATE.cart.length === 0) {
      DOM.cartItemsContainer.innerHTML = `
        <div class="empty-state" style="padding: 3rem 1rem;">
          <div class="empty-icon-wrapper">
            <i class="fa-solid fa-bag-shopping"></i>
          </div>
          <h3>Your Meesho Bag is Empty</h3>
          <p>Looks like you haven't added anything to your cart yet. Explore sarees, kurtis, footwear and grab factory deals!</p>
          <button class="btn btn-primary" onclick="window.Meesho.closeCart(); window.location.hash='#products-section';">
            <i class="fa-solid fa-bag-shopping"></i> Start Shopping
          </button>
        </div>
      `;
      if (DOM.cartFooter) DOM.cartFooter.style.display = 'none';
      if (DOM.freeDeliveryBanner) DOM.freeDeliveryBanner.style.display = 'none';
      return;
    }

    if (DOM.cartFooter) DOM.cartFooter.style.display = 'block';
    if (DOM.freeDeliveryBanner) DOM.freeDeliveryBanner.style.display = 'block';

    const totals = calculateCartTotals();

    const threshold = 499;
    const diff = threshold - totals.currentTotal;
    const pct = Math.min(100, Math.round((totals.currentTotal / threshold) * 100));

    if (diff > 0) {
      DOM.deliveryStatusText.innerHTML = `Add <strong>${formatINR(diff)}</strong> more to unlock <strong>FREE Delivery!</strong>`;
      DOM.deliveryProgressFill.style.width = `${pct}%`;
    } else {
      DOM.deliveryStatusText.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check"></i> Congratulations! You have unlocked <strong>FREE Delivery</strong></span>`;
      DOM.deliveryProgressFill.style.width = '100%';
    }

    const itemsHtml = STATE.cart.map(item => `
      <div class="cart-item-card" data-id="${item.product.id}">
        <img 
          src="${item.product.image}" 
          alt="${item.product.name}" 
          class="cart-item-img"
          onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
        />
        <div class="cart-item-details">
          <h4 class="cart-item-title" title="${item.product.name}">${item.product.name}</h4>
          <div class="cart-item-price-row">
            <span class="cart-item-price">${formatINR(item.product.price)}</span>
            <span class="cart-item-orig-price">${formatINR(item.product.originalPrice)}</span>
          </div>

          <div class="cart-item-controls">
            <div class="qty-control">
              <button 
                type="button" 
                class="qty-btn" 
                onclick="window.Meesho.updateCartQty(${item.product.id}, -1)" 
                aria-label="Decrease quantity"
              >-</button>
              <span class="qty-value">${item.quantity}</span>
              <button 
                type="button" 
                class="qty-btn" 
                onclick="window.Meesho.updateCartQty(${item.product.id}, 1)" 
                aria-label="Increase quantity"
              >+</button>
            </div>

            <button 
              type="button" 
              class="cart-item-remove-btn" 
              onclick="window.Meesho.removeFromCart(${item.product.id})"
              aria-label="Remove item"
            >
              <i class="fa-regular fa-trash-can"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `).join('');

    DOM.cartItemsContainer.innerHTML = `<div class="cart-items-list">${itemsHtml}</div>`;

    DOM.billMrp.textContent = formatINR(totals.subtotalMRP);
    DOM.billDiscount.textContent = `-${formatINR(totals.bagDiscount)}`;

    if (totals.couponDiscount > 0) {
      DOM.couponDiscountRow.hidden = false;
      DOM.billCoupon.textContent = `-${formatINR(totals.couponDiscount)}`;
    } else {
      DOM.couponDiscountRow.hidden = true;
    }

    DOM.billDelivery.innerHTML = totals.deliveryFee === 0 
      ? `<span class="text-success font-weight-bold">FREE</span>` 
      : formatINR(totals.deliveryFee);

    DOM.billGrandTotal.textContent = formatINR(totals.finalAmount);
  }

  function applyCoupon(code) {
    const cleanCode = code.toUpperCase().trim();
    if (!cleanCode) {
      if (DOM.couponMsg) DOM.couponMsg.innerHTML = `<span class="text-danger">Please enter a coupon code</span>`;
      return;
    }

    const coupon = PROMO_COUPONS[cleanCode];
    if (!coupon) {
      if (DOM.couponMsg) DOM.couponMsg.innerHTML = `<span class="text-danger">Invalid code. Try "MEESHONEW" or "MEESHO100"</span>`;
      return;
    }

    const totals = calculateCartTotals();
    if (totals.currentTotal < coupon.minOrder) {
      if (DOM.couponMsg) {
        DOM.couponMsg.innerHTML = `<span class="text-warning">Minimum order of ${formatINR(coupon.minOrder)} required for ${cleanCode}</span>`;
      }
      return;
    }

    STATE.appliedCoupon = { code: cleanCode, ...coupon };
    if (DOM.couponMsg) {
      DOM.couponMsg.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check"></i> Coupon applied: ${coupon.desc}</span>`;
    }
    showToast(`Coupon <strong>${cleanCode}</strong> applied successfully!`, 'success');
    renderCartDrawer();
  }

  function openCartDrawer() {
    renderCartDrawer();
    DOM.cartDrawerBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    DOM.cartDrawerBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  // ==========================================================================
  // 9. WISHLIST ENGINE
  // ==========================================================================
  function toggleWishlist(productId) {
    const index = STATE.wishlist.indexOf(productId);
    const product = STATE.products.find(p => p.id === productId);
    if (!product) return;

    if (index > -1) {
      STATE.wishlist.splice(index, 1);
      showToast(`Removed <strong>${product.name.slice(0, 24)}...</strong> from Wishlist`, 'info');
    } else {
      STATE.wishlist.push(productId);
      showToast(`Saved <strong>${product.name.slice(0, 24)}...</strong> to Wishlist!`, 'success', 'fa-solid fa-heart text-pink');
    }

    saveToStorage('meesho_wishlist', STATE.wishlist);
    saveToStorage('shopease_wishlist', STATE.wishlist);
    updateWishlistBadges();

    renderCatalog();

    if (!DOM.wishlistDrawerBackdrop.hidden) {
      renderWishlistDrawer();
    }
  }

  function updateWishlistBadges() {
    const count = STATE.wishlist.length;
    if (DOM.wishlistCount) DOM.wishlistCount.textContent = count;
    if (DOM.mobWishlistCount) DOM.mobWishlistCount.textContent = count;
    if (DOM.wishlistDrawerCount) DOM.wishlistDrawerCount.textContent = `(${count} item${count === 1 ? '' : 's'})`;
  }

  function renderWishlistDrawer() {
    if (!DOM.wishlistItemsContainer) return;

    if (STATE.wishlist.length === 0) {
      DOM.wishlistItemsContainer.innerHTML = `
        <div class="empty-state" style="padding: 3rem 1rem;">
          <div class="empty-icon-wrapper">
            <i class="fa-regular fa-heart"></i>
          </div>
          <h3>Your Wishlist is Empty</h3>
          <p>Tap the heart icon on any product to save items you love for later.</p>
          <button class="btn btn-primary" onclick="window.Meesho.closeWishlist(); window.location.hash='#products-section';">
            <i class="fa-solid fa-compass"></i> Discover Products
          </button>
        </div>
      `;
      return;
    }

    const items = STATE.products.filter(p => STATE.wishlist.includes(p.id));

    const html = items.map(p => `
      <div class="wishlist-item-card">
        <img 
          src="${p.image}" 
          alt="${p.name}" 
          class="wishlist-item-img"
          onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
        />
        <div class="wishlist-item-details">
          <h4 class="cart-item-title" title="${p.name}">${p.name}</h4>
          <div class="cart-item-price-row">
            <span class="cart-item-price">${formatINR(p.price)}</span>
            <span class="cart-item-orig-price">${formatINR(p.originalPrice)}</span>
            <span class="price-discount">${p.discount}% OFF</span>
          </div>

          <div class="wishlist-actions-row">
            <button 
              type="button" 
              class="btn btn-sm btn-primary" 
              onclick="window.Meesho.moveWishlistToCart(${p.id})"
            >
              <i class="fa-solid fa-cart-plus"></i> Move to Cart
            </button>
            <button 
              type="button" 
              class="btn btn-sm btn-outline" 
              onclick="window.Meesho.toggleWishlist(${p.id})"
              title="Remove from Wishlist"
            >
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    DOM.wishlistItemsContainer.innerHTML = html;
  }

  function moveWishlistToCart(productId) {
    addToCart(productId, 1, false);
    toggleWishlist(productId);
    showToast('Item moved from Wishlist to Meesho Bag!', 'success');
  }

  function openWishlistDrawer() {
    renderWishlistDrawer();
    DOM.wishlistDrawerBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeWishlistDrawer() {
    DOM.wishlistDrawerBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  // ==========================================================================
  // 10. MEESHO CHECKOUT & DEMO ORDER ENGINE
  // ==========================================================================
  function openCheckoutModal() {
    if (STATE.cart.length === 0) {
      showToast('Your bag is empty! Add products before checking out.', 'warning');
      return;
    }

    closeCartDrawer();

    const totals = calculateCartTotals();

    const previewHtml = STATE.cart.map(item => `
      <div class="checkout-preview-item">
        <span class="preview-name">${item.product.name}</span>
        <span>${item.quantity} x ${formatINR(item.product.price)}</span>
      </div>
    `).join('');

    DOM.checkoutItemsPreview.innerHTML = previewHtml;
    DOM.checkoutItemsCount.textContent = `${totals.totalCount} items`;
    DOM.checkoutSubtotal.textContent = formatINR(totals.currentTotal);
    DOM.checkoutDiscountVal.textContent = totals.bagDiscount > 0 ? `-${formatINR(totals.bagDiscount)}` : '₹0';
    DOM.checkoutShippingVal.innerHTML = totals.deliveryFee === 0 
      ? '<span class="text-success">FREE</span>' 
      : formatINR(totals.deliveryFee);
    DOM.checkoutGrandTotal.textContent = formatINR(totals.finalAmount);
    DOM.checkoutBtnAmount.textContent = formatINR(totals.finalAmount);

    document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group input, .form-group select').forEach(el => el.classList.remove('invalid'));

    DOM.checkoutModalBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeCheckoutModal() {
    DOM.checkoutModalBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  function handleCheckoutSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    const pincodeInput = document.getElementById('checkout-pincode');
    const addressInput = document.getElementById('checkout-address');
    const cityInput = document.getElementById('checkout-city');
    const stateInput = document.getElementById('checkout-state');

    const errName = document.getElementById('err-name');
    const errPhone = document.getElementById('err-phone');
    const errPincode = document.getElementById('err-pincode');
    const errAddress = document.getElementById('err-address');
    const errCity = document.getElementById('err-city');
    const errState = document.getElementById('err-state');

    [errName, errPhone, errPincode, errAddress, errCity, errState].forEach(el => el.textContent = '');
    [nameInput, phoneInput, pincodeInput, addressInput, cityInput, stateInput].forEach(el => el.classList.remove('invalid'));

    let isValid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      errName.textContent = 'Please enter a valid full name (at least 3 characters)';
      nameInput.classList.add('invalid');
      isValid = false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneInput.value.replace(/\s+/g, ''))) {
      errPhone.textContent = 'Please enter a valid 10-digit Indian phone number';
      phoneInput.classList.add('invalid');
      isValid = false;
    }

    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(pincodeInput.value.trim())) {
      errPincode.textContent = 'Please enter a valid 6-digit Indian PIN code';
      pincodeInput.classList.add('invalid');
      isValid = false;
    }

    if (!addressInput.value.trim() || addressInput.value.trim().length < 8) {
      errAddress.textContent = 'Please enter your complete address and house number';
      addressInput.classList.add('invalid');
      isValid = false;
    }

    if (!cityInput.value.trim()) {
      errCity.textContent = 'Please enter your city';
      cityInput.classList.add('invalid');
      isValid = false;
    }

    if (!stateInput.value) {
      errState.textContent = 'Please select your delivery state';
      stateInput.classList.add('invalid');
      isValid = false;
    }

    if (!isValid) return;

    const paymentRadio = document.querySelector('input[name="payment-method"]:checked');
    const paymentMethod = paymentRadio ? (paymentRadio.value === 'COD' ? 'Cash On Delivery' : 'Instant UPI (Demo)') : 'Cash On Delivery';

    const totals = calculateCartTotals();

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `MEESHO-ORD-2026-${randomNum}`;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const newOrder = {
      orderId: orderId,
      date: formattedDate,
      customer: {
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        address: `${addressInput.value.trim()}, ${cityInput.value.trim()}, ${stateInput.value} - ${pincodeInput.value.trim()}`
      },
      paymentMethod: paymentMethod,
      items: [...STATE.cart],
      totalAmount: totals.finalAmount
    };

    STATE.orders.unshift(newOrder);
    saveToStorage('meesho_orders', STATE.orders);
    saveToStorage('shopease_orders', STATE.orders);

    saveToStorage('meesho_saved_address', newOrder.customer);
    saveToStorage('shopease_saved_address', newOrder.customer);

    closeCheckoutModal();

    DOM.confirmedOrderId.textContent = orderId;
    DOM.confirmedOrderDate.textContent = formattedDate;
    DOM.confirmedPaymentMethod.textContent = paymentMethod;
    DOM.confirmedAddressText.textContent = `${newOrder.customer.name}, ${newOrder.customer.address}`;
    DOM.confirmedTotalAmount.textContent = formatINR(totals.finalAmount);

    DOM.orderSuccessBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';

    STATE.cart = [];
    STATE.appliedCoupon = null;
    saveToStorage('meesho_cart', STATE.cart);
    saveToStorage('shopease_cart', STATE.cart);
    updateCartBadges();

    showToast(`Meesho Order <strong>${orderId}</strong> confirmed! 🎉`, 'success');
  }

  function closeOrderSuccessModal() {
    DOM.orderSuccessBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  // ==========================================================================
  // 11. USER ACCOUNT & ORDER HISTORY
  // ==========================================================================
  function openAccountModal() {
    DOM.accOrdersCount.textContent = STATE.orders.length;
    renderOrderHistory();

    const savedAddr = loadFromStorage('meesho_saved_address', loadFromStorage('shopease_saved_address', null));
    if (savedAddr && DOM.savedAddressPreview) {
      DOM.savedAddressPreview.innerHTML = `
        <strong>${savedAddr.name}</strong> (${savedAddr.phone})<br />
        ${savedAddr.address}
      `;
    }

    DOM.accountModalBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeAccountModal() {
    DOM.accountModalBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  function renderOrderHistory() {
    if (!DOM.accOrdersList) return;

    if (STATE.orders.length === 0) {
      DOM.accOrdersList.innerHTML = `
        <div class="empty-state" style="padding: 2rem 1rem;">
          <i class="fa-solid fa-clock-rotate-left" style="font-size: 2rem; color: var(--meesho-magenta); margin-bottom: 0.5rem; display: block;"></i>
          <h4>No Meesho Orders Placed Yet</h4>
          <p style="font-size: 0.85rem;">When you complete demo checkout, your orders and tracking details will appear here.</p>
        </div>
      `;
      return;
    }

    const html = STATE.orders.map(order => `
      <div class="order-history-card">
        <div class="order-history-header">
          <div>
            <strong class="text-pink">${order.orderId}</strong>
            <span style="margin: 0 0.5rem;">•</span>
            <span>${order.date}</span>
          </div>
          <span class="badge-pill bg-success-soft">SUPPLIER DISPATCHED</span>
        </div>
        <div class="order-history-items">
          ${order.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.88rem; font-weight: 700;">
          <span>Paid via ${order.paymentMethod}</span>
          <span class="text-pink">${formatINR(order.totalAmount)}</span>
        </div>
      </div>
    `).join('');

    DOM.accOrdersList.innerHTML = html;
  }

  // ==========================================================================
  // 12. LIVE SEARCH & QUICK AUTOCOMPLETE
  // ==========================================================================
  function handleSearchInput(e) {
    const query = e.target.value;
    STATE.searchQuery = query;

    if (query.trim().length > 0) {
      DOM.clearSearchBtn.style.display = 'block';
      showSearchSuggestions(query);
    } else {
      DOM.clearSearchBtn.style.display = 'none';
      hideSearchSuggestions();
    }

    applyFiltersAndSort();
  }

  function showSearchSuggestions(query) {
    const q = query.toLowerCase().trim();
    const matches = STATE.products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 5);

    if (matches.length === 0) {
      hideSearchSuggestions();
      return;
    }

    const html = matches.map(p => `
      <div class="suggestion-item" onclick="window.Meesho.selectSearchSuggestion('${p.name.replace(/'/g, "\\'")}')">
        <img 
          src="${p.image}" 
          alt="${p.name}" 
          class="suggestion-thumb"
          onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
        />
        <div class="suggestion-details">
          <span class="suggestion-title">${p.name}</span>
          <span class="suggestion-meta">${p.category} • ${formatINR(p.price)}</span>
        </div>
      </div>
    `).join('');

    DOM.searchSuggestions.innerHTML = html;
    DOM.searchSuggestions.hidden = false;
  }

  function hideSearchSuggestions() {
    if (DOM.searchSuggestions) DOM.searchSuggestions.hidden = true;
  }

  function selectSearchSuggestion(productName) {
    DOM.searchInput.value = productName;
    STATE.searchQuery = productName;
    hideSearchSuggestions();
    applyFiltersAndSort();
  }

  function clearSearch() {
    DOM.searchInput.value = '';
    STATE.searchQuery = '';
    DOM.clearSearchBtn.style.display = 'none';
    hideSearchSuggestions();
    applyFiltersAndSort();
    DOM.searchInput.focus();
  }

  // ==========================================================================
  // 13. GLOBAL EVENT LISTENERS ATTACHMENT
  // ==========================================================================
  function attachEventListeners() {
    DOM.searchInput.addEventListener('input', handleSearchInput);
    DOM.clearSearchBtn.addEventListener('click', clearSearch);

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        hideSearchSuggestions();
      }
    });

    if (DOM.activeSearchTag) {
      DOM.activeSearchTag.addEventListener('click', clearSearch);
    }

    const catNavButtons = document.querySelectorAll('.category-nav-item');
    catNavButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        STATE.activeCategory = cat;
        STATE.viewFilter = 'all';
        DOM.viewFilterTabs.forEach(t => t.classList.remove('active'));
        const allTab = document.querySelector('.filter-tab[data-view="all"]');
        if (allTab) allTab.classList.add('active');
        applyFiltersAndSort();
      });
    });

    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        STATE.activeCategory = cat;
        applyFiltersAndSort();
        const catalogSec = document.getElementById('products-section');
        if (catalogSec) catalogSec.scrollIntoView({ behavior: 'smooth' });
      });
    });

    const footerCatLinks = document.querySelectorAll('.footer-cat-link');
    footerCatLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.getAttribute('data-category');
        STATE.activeCategory = cat;
        applyFiltersAndSort();
        const catalogSec = document.getElementById('products-section');
        if (catalogSec) catalogSec.scrollIntoView({ behavior: 'smooth' });
      });
    });

    const filterQuickBtns = document.querySelectorAll('.filter-quick-btn');
    filterQuickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        const filter = btn.getAttribute('data-filter');

        if (cat) {
          STATE.activeCategory = cat;
          STATE.viewFilter = 'all';
        } else if (filter === 'under299') {
          STATE.viewFilter = 'under299';
        }

        applyFiltersAndSort();
        const catalogSec = document.getElementById('products-section');
        if (catalogSec) catalogSec.scrollIntoView({ behavior: 'smooth' });
      });
    });

    DOM.viewFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        DOM.viewFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        STATE.viewFilter = tab.getAttribute('data-view');
        applyFiltersAndSort();
      });
    });

    if (DOM.categorySelect) {
      DOM.categorySelect.addEventListener('change', (e) => {
        STATE.activeCategory = e.target.value;
        applyFiltersAndSort();
      });
    }

    if (DOM.sortSelect) {
      DOM.sortSelect.addEventListener('change', (e) => {
        STATE.sortBy = e.target.value;
        applyFiltersAndSort();
      });
    }

    const resetAll = () => {
      STATE.activeCategory = 'All';
      STATE.searchQuery = '';
      STATE.sortBy = 'popular';
      STATE.viewFilter = 'all';
      DOM.searchInput.value = '';
      DOM.clearSearchBtn.style.display = 'none';
      if (DOM.sortSelect) DOM.sortSelect.value = 'popular';
      DOM.viewFilterTabs.forEach(t => t.classList.remove('active'));
      const allTab = document.querySelector('.filter-tab[data-view="all"]');
      if (allTab) allTab.classList.add('active');
      applyFiltersAndSort();
      showToast('Filters reset to default', 'info');
    };

    if (DOM.resetFiltersBtn) DOM.resetFiltersBtn.addEventListener('click', resetAll);
    if (DOM.emptyResetBtn) DOM.emptyResetBtn.addEventListener('click', resetAll);

    if (DOM.cartBtn) DOM.cartBtn.addEventListener('click', openCartDrawer);
    if (DOM.mobNavCart) DOM.mobNavCart.addEventListener('click', openCartDrawer);
    if (DOM.closeCartDrawer) DOM.closeCartDrawer.addEventListener('click', closeCartDrawer);

    if (DOM.wishlistBtn) DOM.wishlistBtn.addEventListener('click', openWishlistDrawer);
    if (DOM.mobNavWishlist) DOM.mobNavWishlist.addEventListener('click', openWishlistDrawer);
    if (DOM.closeWishlistDrawer) DOM.closeWishlistDrawer.addEventListener('click', closeWishlistDrawer);

    if (DOM.accountBtn) DOM.accountBtn.addEventListener('click', openAccountModal);
    if (DOM.mobNavAccount) DOM.mobNavAccount.addEventListener('click', openAccountModal);
    if (DOM.closeAccountModal) DOM.closeAccountModal.addEventListener('click', closeAccountModal);

    const trackOrderLink = document.getElementById('track-order-link');
    if (trackOrderLink) {
      trackOrderLink.addEventListener('click', (e) => {
        e.preventDefault();
        openAccountModal();
      });
    }

    if (DOM.closeProductModal) DOM.closeProductModal.addEventListener('click', closeProductModal);

    if (DOM.proceedCheckoutBtn) DOM.proceedCheckoutBtn.addEventListener('click', openCheckoutModal);
    if (DOM.closeCheckoutModal) DOM.closeCheckoutModal.addEventListener('click', closeCheckoutModal);
    if (DOM.checkoutForm) DOM.checkoutForm.addEventListener('submit', handleCheckoutSubmit);

    if (DOM.continueShoppingBtn) DOM.continueShoppingBtn.addEventListener('click', closeCartDrawer);
    if (DOM.continueShoppingWishlistBtn) DOM.continueShoppingWishlistBtn.addEventListener('click', closeWishlistDrawer);
    if (DOM.successContinueShoppingBtn) DOM.successContinueShoppingBtn.addEventListener('click', closeOrderSuccessModal);

    if (DOM.successViewOrdersBtn) {
      DOM.successViewOrdersBtn.addEventListener('click', () => {
        closeOrderSuccessModal();
        openAccountModal();
      });
    }

    const backdropList = [
      { backdrop: DOM.productModalBackdrop, closeFn: closeProductModal },
      { backdrop: DOM.cartDrawerBackdrop, closeFn: closeCartDrawer },
      { backdrop: DOM.wishlistDrawerBackdrop, closeFn: closeWishlistDrawer },
      { backdrop: DOM.checkoutModalBackdrop, closeFn: closeCheckoutModal },
      { backdrop: DOM.orderSuccessBackdrop, closeFn: closeOrderSuccessModal },
      { backdrop: DOM.accountModalBackdrop, closeFn: closeAccountModal }
    ];

    backdropList.forEach(({ backdrop, closeFn }) => {
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) closeFn();
        });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        backdropList.forEach(({ closeFn }) => closeFn());
        hideSearchSuggestions();
      }
    });

    if (DOM.applyCouponBtn && DOM.cartCouponInput) {
      DOM.applyCouponBtn.addEventListener('click', () => {
        applyCoupon(DOM.cartCouponInput.value);
      });

      DOM.cartCouponInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyCoupon(DOM.cartCouponInput.value);
        }
      });
    }

    if (DOM.copyCodeBtn) {
      DOM.copyCodeBtn.addEventListener('click', () => {
        const code = document.getElementById('promo-copy-code').textContent.trim();
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Copied code <strong>${code}</strong> to clipboard!`, 'success');
        }).catch(() => {
          showToast(`Coupon code is: ${code}`, 'info');
        });
      });
    }

    document.querySelectorAll('.copy-coupon-inline').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code');
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Copied code <strong>${code}</strong>!`, 'success');
        }).catch(() => {
          showToast(`Coupon code: ${code}`, 'info');
        });
      });
    });

    document.querySelectorAll('.acc-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.acc-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.acc-tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        const content = document.getElementById(`acc-${tabId}-tab`);
        if (content) content.classList.add('active');
      });
    });

    document.querySelectorAll('.payment-option input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
        if (radio.checked) {
          radio.closest('.payment-option').classList.add('selected');
        }
      });
    });

    if (DOM.newsletterForm && DOM.newsletterEmail) {
      DOM.newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = DOM.newsletterEmail.value.trim();
        if (email) {
          DOM.newsletterFeedback.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check"></i> Subscribed to Meesho Maha Sale updates!</span>`;
          DOM.newsletterEmail.value = '';
          showToast('Subscribed! Check email for secret seller deals.', 'success');
        }
      });
    }

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;

      if (scrollPos > 40) {
        DOM.header.classList.add('header-scrolled');
      } else {
        DOM.header.classList.remove('header-scrolled');
      }

      if (DOM.backToTop) {
        if (scrollPos > 450) {
          DOM.backToTop.classList.add('visible');
        } else {
          DOM.backToTop.classList.remove('visible');
        }
      }
    });

    if (DOM.backToTop) {
      DOM.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        const catNav = document.getElementById('category-nav');
        if (catNav) {
          catNav.scrollIntoView({ behavior: 'smooth' });
          showToast('Scroll sideways on category strip to explore all departments', 'info');
        }
      });
    }
  }

  // ==========================================================================
  // 14. PUBLIC API EXPOSURE (MEESHO & SHOPEASE COMPATIBILITY)
  // ==========================================================================
  const PUBLIC_API = {
    openProductModal,
    closeProductModal,
    addToCart,
    updateCartQty: updateCartItemQty,
    removeFromCart,
    openCart: openCartDrawer,
    closeCart: closeCartDrawer,
    toggleWishlist,
    moveWishlistToCart,
    openWishlist: openWishlistDrawer,
    closeWishlist: closeWishlistDrawer,
    openCheckout: openCheckoutModal,
    closeCheckout: closeCheckoutModal,
    openAccount: openAccountModal,
    closeAccount: closeAccountModal,
    selectSearchSuggestion,
    showToast
  };

  window.Meesho = PUBLIC_API;
  window.ShopEase = PUBLIC_API; // Maintain backwards compatibility

  // ==========================================================================
  // 15. INITIALIZATION ON DOM READY
  // ==========================================================================
  function init() {
    updateCartBadges();
    updateWishlistBadges();
    applyFiltersAndSort();
    attachEventListeners();
    console.log('%c meesho CLONE E-Commerce Platform Loaded (B.Tech Showcase) ', 'background: #9f2089; color: #fff; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 13px;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
