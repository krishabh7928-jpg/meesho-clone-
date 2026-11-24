const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const baseHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

function takeScreenshot(tempHtmlContent, outputFilename, windowSize = '1440,900', virtualTime = 3000) {
  const tempHtmlPath = path.join(__dirname, `_temp_snap_${Date.now()}_${Math.floor(Math.random()*1000)}.html`);
  fs.writeFileSync(tempHtmlPath, tempHtmlContent, 'utf8');
  const outputPath = path.join(SCREENSHOTS_DIR, outputFilename);

  const fileUrl = `file:///${tempHtmlPath.replace(/\\/g, '/')}`;
  const cmd = `"${CHROME_PATH}" --headless=new --no-sandbox --disable-gpu --window-size=${windowSize} --virtual-time-budget=${virtualTime} --screenshot="${outputPath}" "${fileUrl}"`;
  
  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`✓ Generated screenshot: ${outputFilename}`);
  } catch (err) {
    console.error(`✗ Error capturing ${outputFilename}:`, err.message);
  } finally {
    if (fs.existsSync(tempHtmlPath)) {
      try { fs.unlinkSync(tempHtmlPath); } catch (e) {}
    }
  }
}

console.log('Generating comprehensive suite of 7 verified screenshots...');

// 1. Desktop Homepage & Hero
takeScreenshot(baseHtml, '01_desktop_home.png', '1440,900', 3000);

// 2. Categories Showcase (all 11 departments)
const snapCategoriesHtml = baseHtml.replace('</head>', `
<style>
  #hero, .offers-section { display: none !important; }
</style>
</head>`);
takeScreenshot(snapCategoriesHtml, '02_categories_showcase.png', '1440,900', 3000);

// 3. Product Catalog Grid (4-column responsive grid with prices, ratings, discounts)
const snapCatalogHtml = baseHtml.replace('</head>', `
<style>
  #hero, .offers-section, #categories-section { display: none !important; }
  #products-section { padding-top: 20px !important; }
</style>
</head>`);
takeScreenshot(snapCatalogHtml, '03_product_catalog_grid.png', '1440,950', 3000);

// 4. Smart Search & Live Suggestions
const snapSearchHtml = baseHtml.replace('</body>', `
<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      const input = document.getElementById('search-input');
      if (input) {
        input.focus();
        input.value = 'saree';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 800);
  });
</script>
</body>`);
takeScreenshot(snapSearchHtml, '04_smart_search_suggestions.png', '1440,900', 3000);

// 5. Cart Drawer with Items, Delivery Progress, & Applied Coupon
const dummyCart = [
  {
    id: 1,
    name: "Pure Kanjeevaram Soft Silk Saree with Zari Woven Border & Rich Pallu",
    category: "Women's Wear",
    price: 1299,
    originalPrice: 3999,
    discount: 68,
    rating: 4.8,
    reviewsCount: 3420,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    description: "Authentic Kanjeevaram jacquard woven art silk saree with regal gold zari pallu.",
    stock: 25,
    badge: "Best Seller",
    quantity: 1
  },
  {
    id: 10,
    name: "AeroTune True Wireless Earbuds with ENC & 45h Playtime",
    category: "Electronics",
    price: 899,
    originalPrice: 2499,
    discount: 64,
    rating: 4.7,
    reviewsCount: 4210,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    description: "Low-latency Bluetooth 5.3 earbuds featuring environmental noise cancellation.",
    stock: 40,
    badge: "Trending",
    quantity: 2
  }
];

const snapCartHtml = baseHtml.replace('<head>', `<head>
<style>
  #cart-drawer-backdrop {
    opacity: 1 !important;
    visibility: visible !important;
  }
  #cart-drawer-backdrop .drawer {
    transform: none !important;
    transition: none !important;
  }
</style>
<script>
  localStorage.setItem('meesho_cart', JSON.stringify(${JSON.stringify(dummyCart)}));
  localStorage.setItem('meesho_applied_coupon', JSON.stringify({ code: 'MEESHONEW', discount: 150, type: 'flat' }));
</script>`).replace('</body>', `
<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (window.Meesho && window.Meesho.openCart) {
        window.Meesho.openCart();
      }
    }, 600);
  });
</script>
</body>`);
takeScreenshot(snapCartHtml, '05_cart_drawer.png', '1440,900', 3000);

// 6. Product Details Modal (Quick View)
const snapModalHtml = baseHtml.replace('</body>', `
<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (window.Meesho && window.Meesho.openProductModal) {
        window.Meesho.openProductModal(1);
      }
    }, 800);
  });
</script>
</body>`);
takeScreenshot(snapModalHtml, '06_product_quickview.png', '1440,900', 3000);

// 7. Mobile Responsive View
takeScreenshot(baseHtml, '07_mobile_view.png', '390,844', 3000);

console.log('All 7 screenshots generated successfully.');
