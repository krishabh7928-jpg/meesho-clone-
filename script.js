/**
 * ============================================================================
 * Myntra - Modern Online Fashion Shopping Engine
 * Pure Vanilla JavaScript (ES6+)
 * Author: Senior Frontend Engineer / B.Tech College Project Demonstration
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. PRODUCT DATABASE & FALLBACK
  // ==========================================================================
  const PRODUCTS_DATA = (typeof window !== 'undefined' && Array.isArray(window.PRODUCTS_DATA) && window.PRODUCTS_DATA.length > 0)
    ? window.PRODUCTS_DATA
    : (typeof require !== 'undefined' ? require('./products_data').PRODUCTS_DATA : []);

  const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'><rect fill='%23fff1f4' width='400' height='500'/><text fill='%23ff3f6c' font-family='sans-serif' font-size='26' font-weight='900' x='50%25' y='48%25' text-anchor='middle'>myntra</text><text fill='%23535766' font-family='sans-serif' font-size='14' x='50%25' y='55%25' text-anchor='middle'>Fashion Runway Collection</text></svg>";

  // ==========================================================================
  // 2. APPLICATION STATE MANAGEMENT
  // ==========================================================================
  function getSessionToken() {
    let token = localStorage.getItem('myntra_session_token');
    if (!token) {
      token = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('myntra_session_token', token);
    }
    return token;
  }

  const STATE = {
    products: PRODUCTS_DATA,
    filteredProducts: [...PRODUCTS_DATA],
    cart: loadFromStorage('myntra_cart', []),
    wishlist: loadFromStorage('myntra_wishlist', []),
    orders: loadFromStorage('myntra_orders', []),
    activeCategory: 'All',
    activeBrand: 'All',
    activeSize: 'All',
    activePriceRange: 'all',
    searchQuery: '',
    sortBy: 'popular',
    viewFilter: 'all',
    appliedCoupon: null,
    selectedProductModal: null,
    modalSelectedSize: 'M',
    modalQuantity: 1,
    isBackendConnected: false,
    sessionId: getSessionToken()
  };

  // Valid Myntra Promo Coupons
  const PROMO_COUPONS = {
    'MYNTRA200': { discount: 200, type: 'flat', minOrder: 799, desc: 'Flat ₹200 OFF on orders above ₹799' },
    'MYNTRA10': { discount: 10, type: 'percent', minOrder: 499, desc: 'Extra 10% OFF on all fashion orders' },
    'FESTIVE20': { discount: 20, type: 'percent', minOrder: 599, desc: 'Extra 20% OFF on Ethnic & Festive Wear' },
    'FIRST100': { discount: 100, type: 'flat', minOrder: 499, desc: 'Flat ₹100 OFF on your first fashion order' },
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
    emptyStateTitle: document.getElementById('empty-state-title'),
    emptyStateDesc: document.getElementById('empty-state-desc'),
    emptyResetBtn: document.getElementById('empty-reset-btn'),
    relatedProductGrid: document.getElementById('related-product-grid'),
    relatedProductsSection: document.getElementById('related-products-section'),
    resultsCount: document.getElementById('results-count'),

    // Filter Tags
    activeCategoryTag: document.getElementById('active-category-tag'),
    activeBrandTag: document.getElementById('active-brand-tag'),
    activeBrandVal: document.getElementById('active-brand-val'),
    activeSizeTag: document.getElementById('active-size-tag'),
    activeSizeVal: document.getElementById('active-size-val'),
    activePriceTag: document.getElementById('active-price-tag'),
    activePriceVal: document.getElementById('active-price-val'),
    activeSearchTag: document.getElementById('active-search-tag'),
    activeSearchQuery: document.getElementById('active-search-query'),

    // Filter Controls
    categorySelect: document.getElementById('category-select'),
    brandSelect: document.getElementById('brand-select'),
    sizeSelect: document.getElementById('size-select'),
    priceFilterSelect: document.getElementById('price-filter-select'),
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

    // Utilities
    toastContainer: document.getElementById('toast-container'),
    backToTop: document.getElementById('back-to-top'),
    copyCodeBtn: document.getElementById('copy-code-btn'),
    newsletterForm: document.getElementById('newsletter-form'),
    newsletterEmail: document.getElementById('newsletter-email'),
    newsletterFeedback: document.getElementById('newsletter-feedback')
  };

  // ==========================================================================
  // 5. UTILITY & FORMATTING FUNCTIONS
  // ==========================================================================
  function formatINR(number) {
    return '₹' + Number(number || 0).toLocaleString('en-IN');
  }

  function formatCount(number) {
    const num = Number(number || 0);
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return String(num);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(message, type = 'info', customIcon = null) {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'fa-solid fa-circle-info';
    if (type === 'success') icon = 'fa-solid fa-circle-check';
    if (type === 'warning') icon = 'fa-solid fa-triangle-exclamation';
    if (type === 'danger') icon = 'fa-solid fa-circle-xmark';
    if (customIcon) icon = customIcon;

    toast.innerHTML = `
      <i class="${icon} toast-icon"></i>
      <div class="toast-text">${message}</div>
      <button class="toast-close" aria-label="Close notification"><i class="fa-solid fa-xmark"></i></button>
    `;

    DOM.toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 250);
    });

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 250);
      }
    }, 3800);
  }

  // ==========================================================================
  // 6. MYNTRA PRODUCT CARDS & CATALOG RENDERING
  // ==========================================================================
  function renderProductCard(p) {
    const isWishlisted = STATE.wishlist.includes(p.id);
    const reviewsFormatted = formatCount(p.reviewsCount || p.reviews_count || 0);
    const availableSizes = Array.isArray(p.sizes) ? p.sizes : (typeof p.sizes === 'string' ? JSON.parse(p.sizes || '[]') : []);

    let badgeClass = 'card-badge';
    if (p.badge === 'Trending') badgeClass += ' card-badge-trending';
    else if (p.badge === 'Best Seller' || p.badge === 'Top Brand') badgeClass += ' card-badge-bestseller';

    return `
      <article class="product-card" data-id="${p.id}">
        <div class="card-image-box" onclick="window.Myntra.openProductModal(${p.id})">
          <img 
            src="${p.image}" 
            alt="${escapeHTML(p.name)}" 
            class="card-img" 
            loading="lazy"
            onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
          />
          ${p.badge ? `<span class="${badgeClass}">${p.badge}</span>` : ''}
          
          <div class="card-rating-badge">
            <span class="card-rating-val">${p.rating}</span>
            <i class="fa-solid fa-star"></i>
            <span class="card-rating-divider">|</span>
            <span class="card-reviews-num">${reviewsFormatted}</span>
          </div>

          <button 
            type="button" 
            class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" 
            data-id="${p.id}" 
            onclick="event.stopPropagation(); window.Myntra.toggleWishlist(${p.id});"
            aria-label="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}"
            title="${isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}"
          >
            <i class="${isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
          </button>

          <button 
            type="button" 
            class="card-quickview-btn" 
            onclick="event.stopPropagation(); window.Myntra.openProductModal(${p.id});"
          >
            <i class="fa-regular fa-eye"></i> Quick View
          </button>
        </div>

        <div class="card-content">
          <div class="card-brand">${escapeHTML(p.brand || 'MYNTRA')}</div>
          
          <h3 class="card-title" onclick="window.Myntra.openProductModal(${p.id})" title="${escapeHTML(p.name)}">
            ${escapeHTML(p.name)}
          </h3>

          ${availableSizes.length > 0 ? `
            <div class="card-sizes-row">
              <span class="sizes-hint">Sizes:</span>
              ${availableSizes.slice(0, 4).map(s => `<span class="size-pill">${s}</span>`).join('')}
              ${availableSizes.length > 4 ? `<span class="size-pill-more">+${availableSizes.length - 4}</span>` : ''}
            </div>
          ` : ''}

          <div class="card-price-row">
            <span class="price-current">${formatINR(p.price)}</span>
            <span class="price-original">${formatINR(p.originalPrice || p.original_price)}</span>
            <span class="price-discount">(${p.discount}% OFF)</span>
          </div>

          <button 
            type="button" 
            class="card-add-cart-btn" 
            onclick="window.Myntra.addToCart(${p.id}, 1, true)"
            aria-label="Add ${escapeHTML(p.name)} to bag"
          >
            <i class="fa-solid fa-bag-shopping"></i> Add to Bag
          </button>
        </div>
      </article>
    `;
  }

  // Smart Multi-Token Search Matcher with Brand & Relevance Scoring
  function evaluateSearchMatch(product, rawQuery) {
    if (!rawQuery || rawQuery.trim() === '') {
      return { isMatch: true, score: product.popularity || 50 };
    }

    const query = rawQuery.trim().toLowerCase();
    const tokens = query.split(/\s+/).filter(Boolean);
    const name = (product.name || '').toLowerCase();
    const brand = (product.brand || '').toLowerCase();
    const cat = (product.category || '').toLowerCase();
    const desc = (product.description || '').toLowerCase();
    const tags = Array.isArray(product.tags) 
      ? product.tags.map(t => t.toLowerCase()) 
      : (typeof product.tags === 'string' ? product.tags.toLowerCase().split(',') : []);
    const tagsText = tags.join(' ');

    let score = 0;

    // Direct brand match
    if (brand === query) score += 250;
    else if (brand.includes(query)) score += 150;

    // Full query whole-phrase checks
    if (name === query) score += 200;
    else if (name.startsWith(query)) score += 120;
    else if (name.includes(query)) score += 80;

    if (cat === query) score += 100;
    else if (cat.includes(query)) score += 60;

    if (tagsText.includes(query)) score += 50;
    if (desc.includes(query)) score += 25;

    // Token-by-token checks
    let allTokensMatched = true;

    for (const token of tokens) {
      let tokenMatched = false;

      if (brand.includes(token)) {
        tokenMatched = true;
        score += 45;
      }
      if (name.includes(token)) {
        tokenMatched = true;
        score += 35;
      }
      if (tags.some(t => t.includes(token))) {
        tokenMatched = true;
        score += 30;
      }
      if (cat.includes(token)) {
        tokenMatched = true;
        score += 25;
      }
      if (desc.includes(token)) {
        tokenMatched = true;
        score += 15;
      }

      // Prefix match for fast typers (e.g. "road", "deni", "kurt")
      const words = name.split(/[\s,.-]+/);
      if (words.some(w => w.startsWith(token))) {
        tokenMatched = true;
        score += 20;
      }

      if (!tokenMatched) {
        allTokensMatched = false;
        break;
      }
    }

    return {
      isMatch: allTokensMatched,
      score: score + (product.popularity || 50) * 0.1
    };
  }

  function applyFiltersAndSort() {
    let result = [...STATE.products];

    // 1. Category Filter
    if (STATE.activeCategory && STATE.activeCategory !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === STATE.activeCategory.toLowerCase());
    }

    // 2. Brand Filter
    if (STATE.activeBrand && STATE.activeBrand !== 'All') {
      result = result.filter(p => (p.brand || '').toLowerCase() === STATE.activeBrand.toLowerCase());
    }

    // 3. Size Filter
    if (STATE.activeSize && STATE.activeSize !== 'All') {
      result = result.filter(p => {
        const sizes = Array.isArray(p.sizes) ? p.sizes : (typeof p.sizes === 'string' ? JSON.parse(p.sizes || '[]') : []);
        return sizes.includes(STATE.activeSize);
      });
    }

    // 4. Price Filter
    if (STATE.activePriceRange && STATE.activePriceRange !== 'all') {
      switch (STATE.activePriceRange) {
        case 'under500':
          result = result.filter(p => p.price < 500);
          break;
        case '500to999':
          result = result.filter(p => p.price >= 500 && p.price <= 999);
          break;
        case '1000to1999':
          result = result.filter(p => p.price >= 1000 && p.price <= 1999);
          break;
        case '2000above':
          result = result.filter(p => p.price >= 2000);
          break;
      }
    }

    // 5. Smart Search Query Filter with Relevance Scoring
    const searchActive = STATE.searchQuery.trim() !== '';
    if (searchActive) {
      const scoredItems = [];
      for (const p of result) {
        const evalResult = evaluateSearchMatch(p, STATE.searchQuery);
        if (evalResult.isMatch) {
          scoredItems.push({ product: p, score: evalResult.score });
        }
      }
      scoredItems.sort((a, b) => b.score - a.score);
      result = scoredItems.map(item => item.product);
    }

    // 6. View Filter Tab (all, trending, bestseller, discounted, under999, under299)
    if (STATE.viewFilter === 'trending') {
      result = result.filter(p => p.badge === 'Trending' || (p.tags && p.tags.includes('trending')));
    } else if (STATE.viewFilter === 'bestseller') {
      result = result.filter(p => p.badge === 'Best Seller' || p.badge === 'Top Brand' || (p.tags && p.tags.includes('bestseller')));
    } else if (STATE.viewFilter === 'discounted') {
      result = result.filter(p => p.discount >= 50);
    } else if (STATE.viewFilter === 'under999') {
      result = result.filter(p => p.price <= 999);
    } else if (STATE.viewFilter === 'under299') {
      result = result.filter(p => p.price <= 499);
    }

    // 7. Sorting
    if (!searchActive || STATE.sortBy !== 'popular') {
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
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0) || b.id - a.id);
          break;
        case 'popular':
        default:
          result.sort((a, b) => b.popularity - a.popularity);
          break;
      }
    }

    STATE.filteredProducts = result;
    renderCatalog();
    updateFilterTagsUI();
  }

  function updateFilterTagsUI() {
    if (DOM.resultsCount) {
      DOM.resultsCount.textContent = `Showing ${STATE.filteredProducts.length} style${STATE.filteredProducts.length === 1 ? '' : 's'}`;
    }

    // Category tag
    if (DOM.activeCategoryTag) {
      DOM.activeCategoryTag.innerHTML = `Category: <strong>${STATE.activeCategory}</strong>`;
    }

    // Brand tag
    if (DOM.activeBrandTag && DOM.activeBrandVal) {
      if (STATE.activeBrand && STATE.activeBrand !== 'All') {
        DOM.activeBrandVal.textContent = STATE.activeBrand;
        DOM.activeBrandTag.hidden = false;
      } else {
        DOM.activeBrandTag.hidden = true;
      }
    }

    // Size tag
    if (DOM.activeSizeTag && DOM.activeSizeVal) {
      if (STATE.activeSize && STATE.activeSize !== 'All') {
        DOM.activeSizeVal.textContent = STATE.activeSize;
        DOM.activeSizeTag.hidden = false;
      } else {
        DOM.activeSizeTag.hidden = true;
      }
    }

    // Price tag
    if (DOM.activePriceTag && DOM.activePriceVal) {
      if (STATE.activePriceRange && STATE.activePriceRange !== 'all') {
        const labels = {
          'under500': 'Under ₹500',
          '500to999': '₹500 - ₹999',
          '1000to1999': '₹1,000 - ₹1,999',
          '2000above': '₹2,000+'
        };
        DOM.activePriceVal.textContent = labels[STATE.activePriceRange] || STATE.activePriceRange;
        DOM.activePriceTag.hidden = false;
      } else {
        DOM.activePriceTag.hidden = true;
      }
    }

    // Search tag
    if (DOM.activeSearchTag && DOM.activeSearchQuery) {
      if (STATE.searchQuery.trim() !== '') {
        DOM.activeSearchQuery.textContent = STATE.searchQuery.trim();
        DOM.activeSearchTag.hidden = false;
      } else {
        DOM.activeSearchTag.hidden = true;
      }
    }

    // Synchronize select controls
    if (DOM.categorySelect && DOM.categorySelect.value !== STATE.activeCategory) {
      DOM.categorySelect.value = STATE.activeCategory;
    }
    if (DOM.brandSelect && DOM.brandSelect.value !== STATE.activeBrand) {
      DOM.brandSelect.value = STATE.activeBrand;
    }
    if (DOM.sizeSelect && DOM.sizeSelect.value !== STATE.activeSize) {
      DOM.sizeSelect.value = STATE.activeSize;
    }
    if (DOM.priceFilterSelect && DOM.priceFilterSelect.value !== STATE.activePriceRange) {
      DOM.priceFilterSelect.value = STATE.activePriceRange;
    }
    if (DOM.sortSelect && DOM.sortSelect.value !== STATE.sortBy) {
      DOM.sortSelect.value = STATE.sortBy;
    }

    // Synchronize sub-nav and main dept nav active pills
    document.querySelectorAll('.category-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === STATE.activeCategory);
    });
    document.querySelectorAll('.nav-dept-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === STATE.activeCategory);
    });
  }

  function renderCatalog() {
    if (!DOM.productGrid) return;

    if (STATE.filteredProducts.length === 0) {
      DOM.productGrid.innerHTML = '';
      if (DOM.emptyCatalogState) {
        DOM.emptyCatalogState.hidden = false;
        if (STATE.searchQuery.trim() !== '') {
          DOM.emptyStateTitle.textContent = `No matches found for "${STATE.searchQuery}"`;
          DOM.emptyStateDesc.textContent = "Try searching broader terms like 'Shirt', 'Kurta', 'Denim', 'Dress', or check for spelling mistakes.";
        } else {
          DOM.emptyStateTitle.textContent = 'No Styles Match Your Selected Filters';
          DOM.emptyStateDesc.textContent = 'Try adjusting your brand, size or price filters to explore our wider collection.';
        }
      }

      // Render recommendations inside empty state
      if (DOM.relatedProductGrid) {
        const recommendations = [...STATE.products]
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 4);
        DOM.relatedProductGrid.innerHTML = recommendations.map(p => renderProductCard(p)).join('');
      }
      return;
    }

    if (DOM.emptyCatalogState) {
      DOM.emptyCatalogState.hidden = true;
    }

    DOM.productGrid.innerHTML = STATE.filteredProducts.map(p => renderProductCard(p)).join('');
  }

  // ==========================================================================
  // 7. PRODUCT DETAILS / QUICK VIEW MODAL
  // ==========================================================================
  function openProductModal(productId) {
    const product = STATE.products.find(p => p.id === productId);
    if (!product || !DOM.productModalBody) return;

    STATE.selectedProductModal = product;
    STATE.modalQuantity = 1;
    STATE.modalSelectedSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : 'Free Size';

    const isWishlisted = STATE.wishlist.includes(product.id);
    const availableSizes = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === 'string' ? JSON.parse(product.sizes || '[]') : []);

    DOM.productModalBody.innerHTML = `
      <div class="product-modal-grid">
        <div class="modal-gallery-col">
          <img 
            src="${product.image}" 
            class="modal-main-img" 
            alt="${escapeHTML(product.name)}" 
            onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
          />
        </div>

        <div class="modal-info-col">
          <div class="modal-brand-name">${escapeHTML(product.brand || 'MYNTRA')}</div>
          <h2 class="modal-product-title" id="modal-product-title">${escapeHTML(product.name)}</h2>

          <div class="modal-rating-row">
            <span class="rating-badge">
              <span>${product.rating}</span>
              <i class="fa-solid fa-star"></i>
            </span>
            <span class="reviews-count">${Number(product.reviewsCount || product.reviews_count || 0).toLocaleString('en-IN')} Customer Ratings</span>
            <span class="badge-pill bg-success-soft">100% Original Brand</span>
          </div>

          <div class="modal-price-card">
            <span class="current-price">${formatINR(product.price)}</span>
            <span class="orig-price">${formatINR(product.originalPrice || product.original_price)}</span>
            <span class="discount-pill">(${product.discount}% OFF)</span>
            <span class="tax-info">inclusive of all taxes</span>
          </div>

          ${availableSizes.length > 0 ? `
            <div class="modal-size-select-box">
              <span class="size-heading">SELECT SIZE:</span>
              <div class="modal-size-options" id="modal-size-options">
                ${availableSizes.map((s, idx) => `
                  <button type="button" class="modal-size-btn ${idx === 0 ? 'selected' : ''}" data-size="${s}">${s}</button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="modal-desc-box">
            <h4 class="desc-heading">PRODUCT DETAILS</h4>
            <p>${escapeHTML(product.description)}</p>
          </div>

          <div class="modal-perks-list">
            <div class="perk-item"><i class="fa-solid fa-circle-check text-success"></i> 100% Original Products Guaranteed</div>
            <div class="perk-item"><i class="fa-solid fa-truck-fast text-pink"></i> Express Delivery (Dispatches in 24 Hours)</div>
            <div class="perk-item"><i class="fa-solid fa-rotate-left text-blue"></i> Easy 14-Day Return &amp; Exchange</div>
            <div class="perk-item"><i class="fa-solid fa-hand-holding-dollar text-green"></i> Cash on Delivery Available</div>
          </div>

          <div class="modal-qty-row">
            <span style="font-weight: 700; font-size: 0.9rem;">Quantity:</span>
            <div class="qty-control">
              <button type="button" class="qty-btn" id="modal-qty-minus" aria-label="Decrease quantity">-</button>
              <span class="qty-value" id="modal-qty-val">1</span>
              <button type="button" class="qty-btn" id="modal-qty-plus" aria-label="Increase quantity">+</button>
            </div>
            <span class="stock-status-pill ${product.stock <= 8 ? 'low-stock' : ''}">
              ${product.stock <= 8 ? `Hurry, only ${product.stock} items left!` : 'In Stock'}
            </span>
          </div>

          <div class="modal-actions-row">
            <button 
              type="button" 
              class="btn btn-primary btn-lg btn-block" 
              id="modal-add-cart-btn"
            >
              <i class="fa-solid fa-bag-shopping"></i> ADD TO BAG
            </button>
            <button 
              type="button" 
              class="btn btn-outline btn-lg" 
              id="modal-wishlist-toggle"
              title="${isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}"
            >
              <i class="${isWishlisted ? 'fa-solid fa-heart text-pink' : 'fa-regular fa-heart'}"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    // Size selection listener in modal
    document.querySelectorAll('.modal-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        STATE.modalSelectedSize = btn.getAttribute('data-size');
      });
    });

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
      addToCart(product.id, STATE.modalQuantity, true, STATE.modalSelectedSize);
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
    if (DOM.productModalBackdrop) {
      DOM.productModalBackdrop.hidden = true;
    }
    STATE.selectedProductModal = null;
    document.body.style.overflow = '';
  }

  // ==========================================================================
  // 8. SHOPPING CART ENGINE
  // ==========================================================================
  function addToCart(productId, quantity = 1, showToastNotification = true, size = 'M') {
    const product = STATE.products.find(p => p.id === productId);
    if (!product) return;

    const chosenSize = size || (product.sizes && product.sizes[0]) || 'M';
    const existingIndex = STATE.cart.findIndex(item => item.product.id === productId && (item.size || 'M') === chosenSize);

    if (existingIndex > -1) {
      STATE.cart[existingIndex].quantity += quantity;
    } else {
      STATE.cart.push({
        product: product,
        quantity: quantity,
        size: chosenSize
      });
    }

    saveToStorage('myntra_cart', STATE.cart);
    updateCartBadges();

    // Async sync to SQLite Backend if connected
    if (STATE.isBackendConnected) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': STATE.sessionId },
        body: JSON.stringify({ productId, quantity, size: chosenSize })
      }).catch(e => console.warn('Cart backend sync skipped:', e));
    }

    if (showToastNotification) {
      showToast(`Added <strong>${product.name.slice(0, 26)}... (Size: ${chosenSize})</strong> to Bag!`, 'success');
    }

    if (DOM.cartDrawerBackdrop && !DOM.cartDrawerBackdrop.hidden) {
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
      saveToStorage('myntra_cart', STATE.cart);
      updateCartBadges();
      renderCartDrawer();

      if (STATE.isBackendConnected) {
        fetch(`/api/cart/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'x-session-id': STATE.sessionId },
          body: JSON.stringify({ delta })
        }).catch(() => {});
      }
    }
  }

  function removeFromCart(productId) {
    const item = STATE.cart.find(i => i.product.id === productId);
    STATE.cart = STATE.cart.filter(i => i.product.id !== productId);
    saveToStorage('myntra_cart', STATE.cart);
    updateCartBadges();
    renderCartDrawer();

    if (STATE.isBackendConnected) {
      fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'x-session-id': STATE.sessionId }
      }).catch(() => {});
    }

    if (item) {
      showToast(`Removed <strong>${item.product.name.slice(0, 24)}...</strong> from Bag`, 'info');
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
      const orig = item.product.originalPrice || item.product.original_price || item.product.price;
      subtotalMRP += (orig * item.quantity);
      currentTotal += (item.product.price * item.quantity);
    });

    const bagDiscount = subtotalMRP - currentTotal;
    let deliveryFee = currentTotal >= 799 || currentTotal === 0 ? 0 : 70;

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
          <h3>Hey, your bag is empty!</h3>
          <p>There is nothing in your bag. Let's add some trendy fashion styles from Men, Women, Kids or Beauty!</p>
          <button class="btn btn-primary" onclick="window.Myntra.closeCart(); window.location.hash='#products-section';">
            <i class="fa-solid fa-bag-shopping"></i> Explore Fashion
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

    const threshold = 799;
    const diff = threshold - totals.currentTotal;
    const pct = Math.min(100, Math.round((totals.currentTotal / threshold) * 100));

    if (diff > 0) {
      DOM.deliveryStatusText.innerHTML = `Shop for <strong>${formatINR(diff)}</strong> more to unlock <strong>FREE Delivery!</strong>`;
      DOM.deliveryProgressFill.style.width = `${pct}%`;
    } else {
      DOM.deliveryStatusText.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check"></i> Congratulations! You have unlocked <strong>FREE Delivery</strong></span>`;
      DOM.deliveryProgressFill.style.width = '100%';
    }

    const itemsHtml = STATE.cart.map(item => `
      <div class="cart-item-card" data-id="${item.product.id}">
        <img 
          src="${item.product.image}" 
          alt="${escapeHTML(item.product.name)}" 
          class="cart-item-img"
          onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
        />
        <div class="cart-item-details">
          <div class="cart-item-brand">${escapeHTML(item.product.brand || 'MYNTRA')}</div>
          <h4 class="cart-item-title" title="${escapeHTML(item.product.name)}">${escapeHTML(item.product.name)}</h4>
          <div class="cart-item-size-tag">Size: <strong>${item.size || 'M'}</strong></div>
          
          <div class="cart-item-price-row">
            <span class="cart-item-price">${formatINR(item.product.price)}</span>
            <span class="cart-item-orig-price">${formatINR(item.product.originalPrice || item.product.original_price)}</span>
            <span class="price-discount">(${item.product.discount}% OFF)</span>
          </div>

          <div class="cart-item-controls">
            <div class="qty-control">
              <button 
                type="button" 
                class="qty-btn" 
                onclick="window.Myntra.updateCartQty(${item.product.id}, -1)" 
                aria-label="Decrease quantity"
              >-</button>
              <span class="qty-value">${item.quantity}</span>
              <button 
                type="button" 
                class="qty-btn" 
                onclick="window.Myntra.updateCartQty(${item.product.id}, 1)" 
                aria-label="Increase quantity"
              >+</button>
            </div>

            <button 
              type="button" 
              class="cart-item-remove-btn" 
              onclick="window.Myntra.removeFromCart(${item.product.id})"
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
      if (DOM.couponMsg) DOM.couponMsg.innerHTML = `<span class="text-danger">Invalid code. Try "MYNTRA200" or "MYNTRA10"</span>`;
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

    saveToStorage('myntra_wishlist', STATE.wishlist);
    updateWishlistBadges();

    if (STATE.isBackendConnected) {
      fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': STATE.sessionId },
        body: JSON.stringify({ productId })
      }).catch(() => {});
    }

    renderCatalog();

    if (DOM.wishlistDrawerBackdrop && !DOM.wishlistDrawerBackdrop.hidden) {
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
          <h3>YOUR WISHLIST IS EMPTY</h3>
          <p>Explore runway trends and save your favorite garments and accessories here.</p>
          <button class="btn btn-primary" onclick="window.Myntra.closeWishlist(); window.location.hash='#products-section';">
            <i class="fa-solid fa-compass"></i> Discover Fashion
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
          alt="${escapeHTML(p.name)}" 
          class="wishlist-item-img"
          onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
        />
        <div class="wishlist-item-details">
          <div class="cart-item-brand">${escapeHTML(p.brand || 'MYNTRA')}</div>
          <h4 class="cart-item-title" title="${escapeHTML(p.name)}">${escapeHTML(p.name)}</h4>
          <div class="cart-item-price-row">
            <span class="cart-item-price">${formatINR(p.price)}</span>
            <span class="cart-item-orig-price">${formatINR(p.originalPrice || p.original_price)}</span>
            <span class="price-discount">(${p.discount}% OFF)</span>
          </div>

          <div class="wishlist-actions-row">
            <button 
              type="button" 
              class="btn btn-sm btn-primary" 
              onclick="window.Myntra.moveWishlistToCart(${p.id})"
            >
              <i class="fa-solid fa-bag-shopping"></i> MOVE TO BAG
            </button>
            <button 
              type="button" 
              class="btn btn-sm btn-outline" 
              onclick="window.Myntra.toggleWishlist(${p.id})"
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
    showToast('Item moved from Wishlist to Shopping Bag!', 'success');
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
  // 10. CHECKOUT & ORDER PLACEMENT ENGINE
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
        <span class="preview-name">${escapeHTML(item.product.name)} (Size: ${item.size || 'M'})</span>
        <span>${item.quantity} x ${formatINR(item.product.price)}</span>
      </div>
    `).join('');

    DOM.checkoutItemsPreview.innerHTML = previewHtml;
    DOM.checkoutItemsCount.textContent = `${totals.totalCount} item${totals.totalCount === 1 ? '' : 's'}`;
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
      errPhone.textContent = 'Please enter a valid 10-digit Indian mobile number';
      phoneInput.classList.add('invalid');
      isValid = false;
    }

    const pinRegex = /^[1-9][0-9]{5}$/;
    if (!pinRegex.test(pincodeInput.value.trim())) {
      errPincode.textContent = 'Please enter a valid 6-digit PIN code';
      pincodeInput.classList.add('invalid');
      isValid = false;
    }

    if (!addressInput.value.trim() || addressInput.value.trim().length < 8) {
      errAddress.textContent = 'Please enter complete house/flat and street address';
      addressInput.classList.add('invalid');
      isValid = false;
    }

    if (!cityInput.value.trim()) {
      errCity.textContent = 'Please enter your city';
      cityInput.classList.add('invalid');
      isValid = false;
    }

    if (!stateInput.value) {
      errState.textContent = 'Please select your state';
      stateInput.classList.add('invalid');
      isValid = false;
    }

    if (!isValid) return;

    const paymentRadio = document.querySelector('input[name="payment-method"]:checked');
    const paymentMethod = paymentRadio ? (paymentRadio.value === 'COD' ? 'Cash On Delivery' : 'Instant UPI (Demo)') : 'Cash On Delivery';

    const totals = calculateCartTotals();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `MYN-ORD-2026-${randomNum}`;
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
    saveToStorage('myntra_orders', STATE.orders);
    saveToStorage('myntra_saved_address', newOrder.customer);

    // Save order in SQLite backend if connected
    if (STATE.isBackendConnected) {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': STATE.sessionId },
        body: JSON.stringify(newOrder)
      }).then(res => res.json())
        .then(data => {
          if (data.success) {
            console.log('✓ Order persisted to SQLite Database:', data.order.orderId);
          }
        }).catch(err => console.warn('SQLite order sync skipped:', err));
    }

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
    saveToStorage('myntra_cart', STATE.cart);
    updateCartBadges();

    showToast(`Order <strong>${orderId}</strong> confirmed! 🎉`, 'success');
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

    if (STATE.isBackendConnected) {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.orders) {
            STATE.orders = data.orders;
            DOM.accOrdersCount.textContent = STATE.orders.length;
            renderOrderHistory();
          }
        })
        .catch(err => console.warn('Order history server fetch skipped:', err));
    }

    const savedAddr = loadFromStorage('myntra_saved_address', null);
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
          <i class="fa-solid fa-clock-rotate-left" style="font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem; display: block;"></i>
          <h4>No Orders Placed Yet</h4>
          <p style="font-size: 0.85rem;">When you complete demo checkout, your fashion order tracking and summary will appear here.</p>
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
          <span class="badge-pill bg-success-soft">ORDER CONFIRMED</span>
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
  // 12. LIVE SMART SEARCH & AUTOCOMPLETE ENGINE
  // ==========================================================================
  let searchDebounceTimer = null;
  let activeSuggestionIndex = -1;

  function highlightMatch(text, query) {
    if (!query || !text) return text || '';
    const cleanQ = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!cleanQ) return text;
    const regex = new RegExp(`(${cleanQ})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function scrollToCatalog() {
    const catalogSec = document.getElementById('products-section');
    if (catalogSec) {
      catalogSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleSearchInput(e) {
    const query = e.target.value;
    STATE.searchQuery = query;

    if (query.trim().length > 0) {
      DOM.clearSearchBtn.style.display = 'block';
    } else {
      DOM.clearSearchBtn.style.display = 'none';
      hideSearchSuggestions();
    }

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      if (query.trim().length > 0) {
        showSearchSuggestions(query);
      }
      applyFiltersAndSort();
    }, 150);
  }

  function handleSearchKeydown(e) {
    if (DOM.searchSuggestions && !DOM.searchSuggestions.hidden) {
      const items = DOM.searchSuggestions.querySelectorAll('.suggestion-item');
      if (items.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
          items.forEach((item, idx) => {
            item.classList.toggle('selected', idx === activeSuggestionIndex);
          });
          items[activeSuggestionIndex].scrollIntoView({ block: 'nearest' });
          return;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
          items.forEach((item, idx) => {
            item.classList.toggle('selected', idx === activeSuggestionIndex);
          });
          items[activeSuggestionIndex].scrollIntoView({ block: 'nearest' });
          return;
        } else if (e.key === 'Enter') {
          if (activeSuggestionIndex >= 0 && items[activeSuggestionIndex]) {
            e.preventDefault();
            items[activeSuggestionIndex].click();
            return;
          }
        } else if (e.key === 'Escape') {
          hideSearchSuggestions();
          return;
        }
      }
    }

    if (e.key === 'Enter') {
      hideSearchSuggestions();
      applyFiltersAndSort();
      scrollToCatalog();
    }
  }

  function showSearchSuggestions(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      hideSearchSuggestions();
      return;
    }

    activeSuggestionIndex = -1;

    // 1. Direct matches
    const productMatches = STATE.products.filter(p => {
      const evalRes = evaluateSearchMatch(p, q);
      return evalRes.isMatch;
    }).slice(0, 5);

    // 2. Brand suggestions
    const brandMatches = new Set();
    STATE.products.forEach(p => {
      if (p.brand && p.brand.toLowerCase().includes(q)) {
        brandMatches.add(p.brand);
      }
    });

    // 3. Category suggestions
    const categoryMatches = new Set();
    const allCategories = ['Men', 'Women', 'Kids', 'Beauty', 'Home'];
    allCategories.forEach(c => {
      if (c.toLowerCase().includes(q)) {
        categoryMatches.add(c);
      }
    });

    if (productMatches.length === 0 && brandMatches.size === 0 && categoryMatches.size === 0) {
      DOM.searchSuggestions.innerHTML = `
        <div class="no-suggestions">
          <i class="fa-solid fa-magnifying-glass"></i>
          <span>No suggestions for "<strong>${escapeHTML(query)}</strong>"</span>
        </div>
      `;
      DOM.searchSuggestions.hidden = false;
      return;
    }

    let html = '';

    // Render Brand matches
    if (brandMatches.size > 0) {
      html += `
        <div class="suggestion-group">
          <div class="suggestion-group-title"><i class="fa-solid fa-tags"></i> Top Brands</div>
          ${Array.from(brandMatches).slice(0, 3).map(b => `
            <div class="suggestion-item" data-type="brand" data-val="${b}">
              <div class="suggestion-text">
                <strong>${highlightMatch(b, query)}</strong>
                <span class="suggestion-sub">Explore Brand Store</span>
              </div>
              <i class="fa-solid fa-arrow-right suggestion-arrow"></i>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Render Category matches
    if (categoryMatches.size > 0) {
      html += `
        <div class="suggestion-group">
          <div class="suggestion-group-title"><i class="fa-solid fa-layer-group"></i> Fashion Departments</div>
          ${Array.from(categoryMatches).slice(0, 3).map(c => `
            <div class="suggestion-item" data-type="category" data-val="${c}">
              <div class="suggestion-text">
                <strong>${highlightMatch(c, query)}</strong>
                <span class="suggestion-sub">View department styles</span>
              </div>
              <i class="fa-solid fa-arrow-right suggestion-arrow"></i>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Render Product matches
    if (productMatches.length > 0) {
      html += `
        <div class="suggestion-group">
          <div class="suggestion-group-title"><i class="fa-solid fa-shirt"></i> Matching Styles</div>
          ${productMatches.map(p => `
            <div class="suggestion-item product-suggestion" data-type="product" data-id="${p.id}">
              <img src="${p.image}" class="suggestion-thumb" alt="${escapeHTML(p.name)}" />
              <div class="suggestion-text">
                <span class="suggestion-brand">${escapeHTML(p.brand || '')}</span>
                <span class="suggestion-name">${highlightMatch(p.name, query)}</span>
                <span class="suggestion-price">${formatINR(p.price)} <small>(${p.discount}% OFF)</small></span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    DOM.searchSuggestions.innerHTML = html;
    DOM.searchSuggestions.hidden = false;

    // Attach click events on suggestions
    DOM.searchSuggestions.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        if (type === 'product') {
          const id = parseInt(item.getAttribute('data-id'), 10);
          openProductModal(id);
        } else if (type === 'brand') {
          const brand = item.getAttribute('data-val');
          selectBrandSuggestion(brand);
        } else if (type === 'category') {
          const category = item.getAttribute('data-val');
          selectCategorySuggestion(category);
        }
        hideSearchSuggestions();
      });
    });
  }

  function hideSearchSuggestions() {
    if (DOM.searchSuggestions) {
      DOM.searchSuggestions.hidden = true;
      activeSuggestionIndex = -1;
    }
  }

  function selectSearchSuggestion(query) {
    if (DOM.searchInput) {
      DOM.searchInput.value = query;
      STATE.searchQuery = query;
      DOM.clearSearchBtn.style.display = 'block';
    }
    hideSearchSuggestions();
    applyFiltersAndSort();
    scrollToCatalog();
  }

  function selectBrandSuggestion(brand) {
    STATE.activeBrand = brand;
    if (DOM.brandSelect) DOM.brandSelect.value = brand;
    applyFiltersAndSort();
    scrollToCatalog();
    showToast(`Filtering by brand: <strong>${brand}</strong>`, 'info');
  }

  function selectCategorySuggestion(category) {
    STATE.activeCategory = category;
    if (DOM.categorySelect) DOM.categorySelect.value = category;
    applyFiltersAndSort();
    scrollToCatalog();
    showToast(`Browsing category: <strong>${category}</strong>`, 'info');
  }

  function clearSearch() {
    if (DOM.searchInput) DOM.searchInput.value = '';
    STATE.searchQuery = '';
    DOM.clearSearchBtn.style.display = 'none';
    hideSearchSuggestions();
    applyFiltersAndSort();
  }

  // ==========================================================================
  // 13. EVENT LISTENERS
  // ==========================================================================
  function attachEventListeners() {
    // Search input & suggestions
    if (DOM.searchInput) {
      DOM.searchInput.addEventListener('input', handleSearchInput);
      DOM.searchInput.addEventListener('keydown', handleSearchKeydown);
      DOM.searchInput.addEventListener('focus', () => {
        if (DOM.searchInput.value.trim().length > 0) {
          showSearchSuggestions(DOM.searchInput.value);
        }
      });
    }

    if (DOM.clearSearchBtn) {
      DOM.clearSearchBtn.addEventListener('click', clearSearch);
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        hideSearchSuggestions();
      }
    });

    // Department navigation clicks (Header)
    document.querySelectorAll('.nav-dept-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        selectCategorySuggestion(cat);
      });
    });

    // Category navigation clicks (Sub-bar)
    if (DOM.categoryNavList) {
      DOM.categoryNavList.addEventListener('click', (e) => {
        const item = e.target.closest('.category-nav-item');
        if (item) {
          const category = item.getAttribute('data-category');
          selectCategorySuggestion(category);
        }
      });
    }

    // Category Cards / Roundels on Homepage
    document.querySelectorAll('.category-card, .category-jump-btn').forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        if (cat) selectCategorySuggestion(cat);
      });
    });

    // Footer Department / Category Links
    document.querySelectorAll('.footer-cat-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.getAttribute('data-category');
        if (cat) selectCategorySuggestion(cat);
      });
    });

    // Track Order link in footer
    const trackOrderLink = document.getElementById('track-order-link');
    if (trackOrderLink) {
      trackOrderLink.addEventListener('click', (e) => {
        e.preventDefault();
        openAccountModal();
      });
    }

    // Top Brand Spotlight Tiles
    document.querySelectorAll('.brand-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const brand = tile.getAttribute('data-brand');
        if (brand) selectBrandSuggestion(brand);
      });
    });

    // Filter Controls
    if (DOM.categorySelect) {
      DOM.categorySelect.addEventListener('change', (e) => {
        STATE.activeCategory = e.target.value;
        applyFiltersAndSort();
      });
    }

    if (DOM.brandSelect) {
      DOM.brandSelect.addEventListener('change', (e) => {
        STATE.activeBrand = e.target.value;
        applyFiltersAndSort();
      });
    }

    if (DOM.sizeSelect) {
      DOM.sizeSelect.addEventListener('change', (e) => {
        STATE.activeSize = e.target.value;
        applyFiltersAndSort();
      });
    }

    if (DOM.priceFilterSelect) {
      DOM.priceFilterSelect.addEventListener('change', (e) => {
        STATE.activePriceRange = e.target.value;
        applyFiltersAndSort();
      });
    }

    if (DOM.sortSelect) {
      DOM.sortSelect.addEventListener('change', (e) => {
        STATE.sortBy = e.target.value;
        applyFiltersAndSort();
      });
    }

    // Reset Filters button
    if (DOM.resetFiltersBtn) {
      DOM.resetFiltersBtn.addEventListener('click', () => {
        resetAllFilters();
        showToast('All filters have been reset to default', 'info');
      });
    }

    if (DOM.emptyResetBtn) {
      DOM.emptyResetBtn.addEventListener('click', () => {
        resetAllFilters();
      });
    }

    function resetAllFilters() {
      STATE.activeCategory = 'All';
      STATE.activeBrand = 'All';
      STATE.activeSize = 'All';
      STATE.activePriceRange = 'all';
      STATE.searchQuery = '';
      STATE.sortBy = 'popular';
      STATE.viewFilter = 'all';
      if (DOM.searchInput) DOM.searchInput.value = '';
      if (DOM.clearSearchBtn) DOM.clearSearchBtn.style.display = 'none';
      DOM.viewFilterTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-view') === 'all'));
      applyFiltersAndSort();
    }

    // Filter Tabs
    DOM.viewFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        DOM.viewFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        STATE.viewFilter = tab.getAttribute('data-view');
        applyFiltersAndSort();
      });
    });

    // Remove individual active filter tags
    document.querySelectorAll('.remove-tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const type = btn.getAttribute('data-type');
        if (type === 'brand') STATE.activeBrand = 'All';
        else if (type === 'size') STATE.activeSize = 'All';
        else if (type === 'price') STATE.activePriceRange = 'all';
        else if (type === 'search') clearSearch();
        applyFiltersAndSort();
      });
    });

    // Search chip buttons inside empty state
    document.querySelectorAll('.search-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-query');
        selectSearchSuggestion(q);
      });
    });

    // Header buttons (Cart, Wishlist, Profile)
    if (DOM.cartBtn) DOM.cartBtn.addEventListener('click', openCartDrawer);
    if (DOM.wishlistBtn) DOM.wishlistBtn.addEventListener('click', openWishlistDrawer);
    if (DOM.accountBtn) DOM.accountBtn.addEventListener('click', openAccountModal);

    // Mobile nav buttons
    if (DOM.mobNavCart) DOM.mobNavCart.addEventListener('click', openCartDrawer);
    if (DOM.mobNavWishlist) DOM.mobNavWishlist.addEventListener('click', openWishlistDrawer);
    if (DOM.mobNavAccount) DOM.mobNavAccount.addEventListener('click', openAccountModal);

    // Close drawers / modals
    if (DOM.closeCartDrawer) DOM.closeCartDrawer.addEventListener('click', closeCartDrawer);
    if (DOM.closeWishlistDrawer) DOM.closeWishlistDrawer.addEventListener('click', closeWishlistDrawer);
    if (DOM.closeProductModal) DOM.closeProductModal.addEventListener('click', closeProductModal);
    if (DOM.closeCheckoutModal) DOM.closeCheckoutModal.addEventListener('click', closeCheckoutModal);
    if (DOM.closeAccountModal) DOM.closeAccountModal.addEventListener('click', closeAccountModal);

    if (DOM.continueShoppingBtn) DOM.continueShoppingBtn.addEventListener('click', closeCartDrawer);
    if (DOM.continueShoppingWishlistBtn) DOM.continueShoppingWishlistBtn.addEventListener('click', closeWishlistDrawer);

    if (DOM.proceedCheckoutBtn) DOM.proceedCheckoutBtn.addEventListener('click', openCheckoutModal);

    // Backdrop clicks to close modals/drawers
    const modalBackdrops = [
      DOM.productModalBackdrop,
      DOM.cartDrawerBackdrop,
      DOM.wishlistDrawerBackdrop,
      DOM.checkoutModalBackdrop,
      DOM.orderSuccessBackdrop,
      DOM.accountModalBackdrop
    ];

    modalBackdrops.forEach(backdrop => {
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            backdrop.hidden = true;
            document.body.style.overflow = '';
          }
        });
      }
    });

    // Apply Coupon button
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

    // Checkout form submit
    if (DOM.checkoutForm) {
      DOM.checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    // Order Success Modal Actions
    if (DOM.successContinueShoppingBtn) {
      DOM.successContinueShoppingBtn.addEventListener('click', () => {
        closeOrderSuccessModal();
        window.location.hash = '#products-section';
      });
    }

    if (DOM.successViewOrdersBtn) {
      DOM.successViewOrdersBtn.addEventListener('click', () => {
        closeOrderSuccessModal();
        openAccountModal();
      });
    }

    // Promo Code Copy Buttons
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

    // Account Modal Tabs
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

    // Payment Radio button styling
    document.querySelectorAll('.payment-option input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
        if (radio.checked) {
          radio.closest('.payment-option').classList.add('selected');
        }
      });
    });

    // Newsletter Form
    if (DOM.newsletterForm && DOM.newsletterEmail) {
      DOM.newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = DOM.newsletterEmail.value.trim();
        if (email) {
          DOM.newsletterFeedback.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check"></i> Subscribed to Myntra Fashion drops!</span>`;
          DOM.newsletterEmail.value = '';
          showToast('Subscribed! Check email for exclusive VIP drop alerts.', 'success');
        }
      });
    }

    // Scroll listeners (header shadow, back-to-top)
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

    // Mobile Menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        const catNav = document.getElementById('category-nav');
        if (catNav) {
          catNav.scrollIntoView({ behavior: 'smooth' });
          showToast('Browse Men, Women, Kids, Beauty & Home', 'info');
        }
      });
    }
  }

  // ==========================================================================
  // 14. PUBLIC API EXPOSURE (MYNTRA FASHION)
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
    selectBrandSuggestion,
    selectCategorySuggestion,
    applyCoupon,
    showToast
  };

  window.Myntra = PUBLIC_API;
  window.MyntraFashion = PUBLIC_API;

  // ==========================================================================
  // 15. DUAL-MODE BACKEND SYNC & INITIALIZATION
  // ==========================================================================
  async function checkBackendConnection() {
    const statusPill = document.getElementById('backend-status-pill');
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        STATE.isBackendConnected = true;
        if (statusPill) {
          statusPill.classList.add('online');
          statusPill.innerHTML = `<span class="status-dot"></span> Full-Stack Mode (SQLite)`;
          statusPill.title = `Connected to Node.js & Express REST API with SQLite (${data.databaseDriver})`;
        }

        // Fetch live product catalog from SQLite database
        try {
          const prodRes = await fetch('/api/products');
          if (prodRes.ok) {
            const prodData = await prodRes.json();
            if (prodData.data && prodData.data.length > 0) {
              STATE.products = prodData.data;
              applyFiltersAndSort();
            }
          }
        } catch (e) {
          console.warn('Using local product catalog fallback:', e);
        }

        console.log(`%c[Full-Stack API Connected]%c Node.js + Express + SQLite Database active`, 'color: #00e676; font-weight: bold;', 'color: #333;');
        return true;
      }
    } catch (e) {
      // Backend not running (e.g. running via file:// or Live Server directly)
    }

    STATE.isBackendConnected = false;
    if (statusPill) {
      statusPill.classList.remove('online');
      statusPill.innerHTML = `<span class="status-dot"></span> Standalone Mode (Local)`;
      statusPill.title = 'Running directly in browser with LocalStorage data persistence';
    }
    console.log('%c[Standalone Mode]%c Operating with LocalStorage persistence', 'color: #ff3f6c; font-weight: bold;', 'color: #666;');
    return false;
  }

  function init() {
    updateCartBadges();
    updateWishlistBadges();
    applyFiltersAndSort();
    attachEventListeners();
    checkBackendConnection();
    console.log('%c MYNTRA FASHION E-COMMERCE PLATFORM (B.Tech College Showcase) ', 'background: #ff3f6c; color: #fff; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 13px;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
