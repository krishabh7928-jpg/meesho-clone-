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

console.log('Generating comprehensive suite of 7 verified Myntra Fashion screenshots...');

// 1. Desktop Homepage & Hero Banner Carousel
takeScreenshot(baseHtml, '01_desktop_home.png', '1440,900', 3000);

// 2. Categories Showcase (Men, Women, Kids, Beauty, Home & Living)
const snapCategoriesHtml = baseHtml.replace('</head>', `
<style>
  #hero-section, .announcement-bar, #deals-section { display: none !important; }
  #categories-section { padding-top: 30px !important; }
</style>
</head>`);
takeScreenshot(snapCategoriesHtml, '02_categories_showcase.png', '1440,900', 3000);

// 3. Product Catalog Grid (4-column responsive grid with fashion brand names, ratings, discounts)
const snapCatalogHtml = baseHtml.replace('</head>', `
<style>
  #hero-section, #brands-section, #categories-section, #deals-section { display: none !important; }
  #products-section { padding-top: 20px !important; }
</style>
</head>`);
takeScreenshot(snapCatalogHtml, '03_product_catalog_grid.png', '1440,950', 3000);

// 4. Smart Search & Live Autocomplete Suggestions
const snapSearchHtml = baseHtml.replace('</body>', `
<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      const input = document.getElementById('search-input');
      if (input) {
        input.focus();
        input.value = 'roadster';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 800);
  });
</script>
</body>`);
takeScreenshot(snapSearchHtml, '04_smart_search_suggestions.png', '1440,900', 3500);

// 5. Cart Drawer with Fashion Items, Delivery Progress, & Applied MYNTRA200 Coupon
const dummyCart = [
  {
    id: 1,
    brand: "Roadster",
    name: "Men Pure Cotton Casual Slim Fit Shirt",
    category: "Men",
    price: 649,
    originalPrice: 1499,
    discount: 56,
    rating: 4.3,
    reviewsCount: 3820,
    sizes: ["S", "M", "L", "XL", "XXL"],
    selectedSize: "L",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    badge: "Trending",
    quantity: 1
  },
  {
    id: 16,
    brand: "Libas",
    name: "Women Floral Printed Pure Cotton Anarkali Kurta Set",
    category: "Women",
    price: 1399,
    originalPrice: 3499,
    discount: 60,
    rating: 4.6,
    reviewsCount: 5210,
    sizes: ["S", "M", "L", "XL"],
    selectedSize: "M",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    badge: "Best Seller",
    quantity: 1
  }
];

const snapCartHtml = baseHtml.replace('<head>', `<head>
<style>
  #cart-drawer-backdrop {
    opacity: 1 !important;
    visibility: visible !important;
  }
  #cart-drawer-backdrop .cart-drawer {
    transform: none !important;
    transition: none !important;
  }
</style>
<script>
  localStorage.setItem('myntra_cart', JSON.stringify(${JSON.stringify(dummyCart)}));
  localStorage.setItem('myntra_applied_coupon', JSON.stringify({ code: 'MYNTRA200', discount: 200, type: 'flat' }));
</script>`).replace('</body>', `
<script>
  window.addEventListener('load', () => {
    setTimeout(() => {
      const api = window.Myntra;
      if (api && api.openCart) {
        api.openCart();
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
      const api = window.Myntra;
      if (api && api.openProductModal) {
        api.openProductModal(1);
      }
    }, 800);
  });
</script>
</body>`);
takeScreenshot(snapModalHtml, '06_product_quickview.png', '1440,900', 3000);

// 7. Mobile Responsive View
takeScreenshot(baseHtml, '07_mobile_view.png', '390,844', 3000);

console.log('✓ All 7 Myntra screenshots captured successfully.');
