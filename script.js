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
  // 1. MEESHO PRODUCT DATABASE (65 Authentic Products Across 11 Categories)
  // ==========================================================================
  const PRODUCTS_DATA = (typeof window !== 'undefined' && Array.isArray(window.PRODUCTS_DATA) && window.PRODUCTS_DATA.length > 0)
    ? window.PRODUCTS_DATA
    : (typeof require !== 'undefined' ? require('./products_data').PRODUCTS_DATA : []);

  // SVG Fallback Data URI in case of network issue
  const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect fill='%23fcebf5' width='400' height='400'/><text fill='%239f2089' font-family='sans-serif' font-size='22' font-weight='900' x='50%25' y='48%25' text-anchor='middle'>meesho</text><text fill='%2364748b' font-family='sans-serif' font-size='13' x='50%25' y='55%25' text-anchor='middle'>Trusted Supplier Product</text></svg>";

  // ==========================================================================
  // 2. APPLICATION STATE MANAGEMENT
  // ==========================================================================
  function getSessionToken() {
    let token = localStorage.getItem('meesho_session_token');
    if (!token) {
      token = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('meesho_session_token', token);
    }
    return token;
  }

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
    modalQuantity: 1,
    isBackendConnected: false,
    sessionId: getSessionToken()
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
    emptyStateTitle: document.getElementById('empty-state-title'),
    emptyStateDesc: document.getElementById('empty-state-desc'),
    emptyResetBtn: document.getElementById('empty-reset-btn'),
    relatedProductGrid: document.getElementById('related-product-grid'),
    relatedProductsSection: document.getElementById('related-products-section'),
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
  
  // Reusable Product Card Template
  function createProductCardHtml(p) {
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
            <span class="reviews-count">(${Number(p.reviewsCount || p.reviews_count || 0).toLocaleString('en-IN')} Reviews)</span>
          </div>

          <div class="card-price-row">
            <span class="price-current">${formatINR(p.price)}</span>
            <span class="price-original">${formatINR(p.originalPrice || p.original_price)}</span>
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
  }

  // Smart Multi-Token Search Matcher with Relevance Scoring
  function evaluateSearchMatch(product, rawQuery) {
    if (!rawQuery || rawQuery.trim() === '') {
      return { isMatch: true, score: product.popularity || 50 };
    }

    const query = rawQuery.trim().toLowerCase();
    const tokens = query.split(/\s+/).filter(Boolean);
    const name = (product.name || '').toLowerCase();
    const cat = (product.category || '').toLowerCase();
    const desc = (product.description || '').toLowerCase();
    const tags = Array.isArray(product.tags) 
      ? product.tags.map(t => t.toLowerCase()) 
      : (typeof product.tags === 'string' ? product.tags.toLowerCase().split(',') : []);
    const tagsText = tags.join(' ');

    let score = 0;

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

      // Partial / Prefix match for user typing partial words (e.g. "kurt", "shir", "snee")
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
      result = result.filter(p => p.category === STATE.activeCategory);
    }

    // 2. Smart Search Query Filter with Relevance Scoring
    const searchActive = STATE.searchQuery.trim() !== '';
    if (searchActive) {
      const scoredItems = [];
      for (const p of result) {
        const evalResult = evaluateSearchMatch(p, STATE.searchQuery);
        if (evalResult.isMatch) {
          scoredItems.push({ product: p, score: evalResult.score });
        }
      }
      // Sort by relevance score initially
      scoredItems.sort((a, b) => b.score - a.score);
      result = scoredItems.map(item => item.product);
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

    // 4. Sorting (if not default popular during search, or if user picked explicit sort)
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
    updateToolbarInfo();
  }

  function renderRelatedProducts() {
    if (!DOM.relatedProductGrid) return;
    const recommendations = STATE.products
      .filter(p => p.badge === 'M-Trusted' || p.badge === 'Trending' || p.badge === 'Bestseller' || p.popularity >= 93)
      .slice(0, 8);

    DOM.relatedProductGrid.innerHTML = recommendations.map(p => createProductCardHtml(p)).join('');
  }

  function renderCatalog() {
    if (!DOM.productGrid) return;

    if (STATE.filteredProducts.length === 0) {
      DOM.productGrid.innerHTML = '';
      if (DOM.emptyCatalogState) {
        DOM.emptyCatalogState.hidden = false;
        if (DOM.emptyStateTitle) {
          if (STATE.searchQuery.trim() !== '') {
            DOM.emptyStateTitle.textContent = `No Matching Products Found for "${STATE.searchQuery}"`;
          } else {
            DOM.emptyStateTitle.textContent = 'No Matching Products Found';
          }
        }
        if (DOM.emptyStateDesc) {
          if (STATE.searchQuery.trim() !== '') {
            DOM.emptyStateDesc.textContent = `We couldn't find any items matching "${STATE.searchQuery}". Try checking for typos, searching broader keywords, or click any of the popular search suggestions below.`;
          } else {
            DOM.emptyStateDesc.textContent = "We couldn't find any items matching your active category or filters. Try resetting your filters to explore all available products.";
          }
        }
        renderRelatedProducts();
      }
      return;
    }

    if (DOM.emptyCatalogState) DOM.emptyCatalogState.hidden = true;

    DOM.productGrid.innerHTML = STATE.filteredProducts.map(p => createProductCardHtml(p)).join('');
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

    // Async sync to SQLite Backend if connected
    if (STATE.isBackendConnected) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': STATE.sessionId },
        body: JSON.stringify({ productId, quantity })
      }).catch(e => console.warn('Cart backend sync skipped:', e));
    }

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
    saveToStorage('meesho_cart', STATE.cart);
    saveToStorage('shopease_cart', STATE.cart);
    updateCartBadges();
    renderCartDrawer();

    if (STATE.isBackendConnected) {
      fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'x-session-id': STATE.sessionId }
      }).catch(() => {});
    }

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

    if (STATE.isBackendConnected) {
      fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': STATE.sessionId },
        body: JSON.stringify({ productId })
      }).catch(() => {});
    }

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
    saveToStorage('shopease_cart', STATE.cart);

    saveToStorage('meesho_saved_address', newOrder.customer);
    saveToStorage('shopease_saved_address', newOrder.customer);

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

    // If connected to SQLite backend, refresh order list from server
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

    // 1. Direct product matches evaluated via smart token matcher
    const productMatches = STATE.products.filter(p => {
      const evalRes = evaluateSearchMatch(p, q);
      return evalRes.isMatch;
    }).slice(0, 5);

    // 2. Matching categories (e.g. searching "mob" matches Mobiles, "foot" matches Footwear)
    const allCategories = [...new Set(STATE.products.map(p => p.category))];
    const matchingCategories = allCategories
      .filter(cat => cat.toLowerCase().includes(q))
      .slice(0, 2);

    // 3. Matching tags/keywords for instant suggestions
    const matchingKeywords = new Set();
    for (const p of STATE.products) {
      const tags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? p.tags.split(',') : []);
      for (const t of tags) {
        const cleanT = t.trim().toLowerCase();
        if (cleanT.includes(q) && cleanT !== q) {
          matchingKeywords.add(cleanT);
        }
      }
    }
    const keywordsList = Array.from(matchingKeywords).slice(0, 3);

    if (productMatches.length === 0 && matchingCategories.length === 0 && keywordsList.length === 0) {
      hideSearchSuggestions();
      return;
    }

    let html = '';

    // A. Category Suggestions
    if (matchingCategories.length > 0) {
      html += '<div class="suggestion-section-title"><i class="fa-solid fa-layer-group"></i> Department Suggestions</div>';
      html += matchingCategories.map(cat => `
        <div class="suggestion-item suggestion-category-item" onclick="window.Meesho.selectCategorySuggestion('${cat.replace(/'/g, "\\'")}')">
          <div class="suggestion-icon"><i class="fa-solid fa-layer-group"></i></div>
          <div class="suggestion-details">
            <span class="suggestion-title">In <strong>${highlightMatch(cat, query)}</strong></span>
            <span class="suggestion-meta">Filter by ${cat}</span>
          </div>
        </div>
      `).join('');
    }

    // B. Keyword Suggestions
    if (keywordsList.length > 0) {
      html += '<div class="suggestion-section-title"><i class="fa-solid fa-fire"></i> Popular Searches</div>';
      html += keywordsList.map(kw => `
        <div class="suggestion-item suggestion-keyword-item" onclick="window.Meesho.selectSearchSuggestion('${kw.replace(/'/g, "\\'")}')">
          <div class="suggestion-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
          <div class="suggestion-details">
            <span class="suggestion-title">${highlightMatch(kw, query)}</span>
            <span class="suggestion-meta">Search Meesho catalog</span>
          </div>
        </div>
      `).join('');
    }

    // C. Product Suggestions
    if (productMatches.length > 0) {
      html += '<div class="suggestion-section-title"><i class="fa-solid fa-bag-shopping"></i> Matching Products</div>';
      html += productMatches.map(p => `
        <div class="suggestion-item" onclick="window.Meesho.selectSearchSuggestion('${p.name.replace(/'/g, "\\'")}')">
          <img 
            src="${p.image}" 
            alt="${p.name}" 
            class="suggestion-thumb"
            onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
          />
          <div class="suggestion-details">
            <span class="suggestion-title">${highlightMatch(p.name, query)}</span>
            <span class="suggestion-meta">
              <span>${formatINR(p.price)}</span>
              <span class="suggestion-cat-badge">${p.category}</span>
            </span>
          </div>
        </div>
      `).join('');
    }

    DOM.searchSuggestions.innerHTML = html;
    DOM.searchSuggestions.hidden = false;
  }

  function hideSearchSuggestions() {
    activeSuggestionIndex = -1;
    if (DOM.searchSuggestions) DOM.searchSuggestions.hidden = true;
  }

  function selectSearchSuggestion(productName) {
    DOM.searchInput.value = productName;
    STATE.searchQuery = productName;
    DOM.clearSearchBtn.style.display = 'block';
    hideSearchSuggestions();
    applyFiltersAndSort();
    scrollToCatalog();
  }

  function selectCategorySuggestion(categoryName) {
    DOM.searchInput.value = '';
    STATE.searchQuery = '';
    DOM.clearSearchBtn.style.display = 'none';
    STATE.activeCategory = categoryName;
    hideSearchSuggestions();

    // Synchronize Category Navigation bar
    const catNavButtons = document.querySelectorAll('.category-nav-item');
    catNavButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === categoryName);
    });

    if (DOM.categorySelect) {
      DOM.categorySelect.value = categoryName;
    }

    applyFiltersAndSort();
    scrollToCatalog();
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
    DOM.searchInput.addEventListener('keydown', handleSearchKeydown);
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
        catNavButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (DOM.categorySelect) DOM.categorySelect.value = cat;
        DOM.viewFilterTabs.forEach(t => t.classList.remove('active'));
        const allTab = document.querySelector('.filter-tab[data-view="all"]');
        if (allTab) allTab.classList.add('active');
        applyFiltersAndSort();
        scrollToCatalog();
      });
    });

    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        STATE.activeCategory = cat;
        catNavButtons.forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-category') === cat);
        });
        if (DOM.categorySelect) DOM.categorySelect.value = cat;
        applyFiltersAndSort();
        scrollToCatalog();
      });
    });

    const footerCatLinks = document.querySelectorAll('.footer-cat-link');
    footerCatLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.getAttribute('data-category');
        STATE.activeCategory = cat;
        catNavButtons.forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-category') === cat);
        });
        if (DOM.categorySelect) DOM.categorySelect.value = cat;
        applyFiltersAndSort();
        scrollToCatalog();
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
          catNavButtons.forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-category') === cat);
          });
          if (DOM.categorySelect) DOM.categorySelect.value = cat;
        } else if (filter === 'under299') {
          STATE.viewFilter = 'under299';
        }

        applyFiltersAndSort();
        scrollToCatalog();
      });
    });

    // Popular Search Suggestion Chips in Empty State
    document.querySelectorAll('.search-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        if (query) {
          DOM.searchInput.value = query;
          STATE.searchQuery = query;
          DOM.clearSearchBtn.style.display = 'block';
          applyFiltersAndSort();
          scrollToCatalog();
        }
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
        catNavButtons.forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-category') === e.target.value);
        });
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
      if (DOM.categorySelect) DOM.categorySelect.value = 'All';
      DOM.viewFilterTabs.forEach(t => t.classList.remove('active'));
      const allTab = document.querySelector('.filter-tab[data-view="all"]');
      if (allTab) allTab.classList.add('active');
      catNavButtons.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-category') === 'All');
      });
      hideSearchSuggestions();
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
    selectCategorySuggestion,
    showToast
  };

  window.Meesho = PUBLIC_API;
  window.ShopEase = PUBLIC_API; // Maintain backwards compatibility

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
    console.log('%c[Standalone Mode]%c Operating with LocalStorage persistence', 'color: #ff9800; font-weight: bold;', 'color: #666;');
    return false;
  }

  function init() {
    updateCartBadges();
    updateWishlistBadges();
    applyFiltersAndSort();
    attachEventListeners();
    checkBackendConnection();
    console.log('%c meesho CLONE E-Commerce Platform Loaded (B.Tech Showcase) ', 'background: #9f2089; color: #fff; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 13px;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
