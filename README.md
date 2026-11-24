# Meesho Clone - Full-Stack E-Commerce Web Application

> **Project Type:** B.Tech Major / Minor Capstone Project Demonstration  
> **Student Name:** Rishabh Kumar  
> **Academic Session:** 2026  
> **Technology Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), Node.js, Express.js, SQLite Database  
> **Architecture:** 3-Tier Full-Stack Architecture with Resilient Dual-Mode Execution  

---

## 🌟 Project Overview

**Meesho Clone** is a production-grade, responsive full-stack e-commerce web application inspired by India's leading social commerce ecosystem, **Meesho (meesho.com)**. It replicates Meesho's authentic magenta/pink branding, factory-direct wholesale pricing structure in Indian Rupees (₹), 8-category hierarchy (sarees, kurtis, footwear, cookware, electronics), M-Trusted supplier badges, sliding side drawers for Cart & Wishlist, interactive Quick View modal, and client-side checkout with input validation and dual-mode data persistence.

The project features a **Resilient Dual-Mode Architecture**:
1. **Full-Stack Mode (Node.js + Express + SQLite):** When run via `npm start`, the client communicates with an Express REST API backed by an embedded SQLite database (`data/meesho.db`).
2. **Standalone Client Mode (LocalStorage Fallback):** When `index.html` is opened directly in a browser (or via VS Code Live Server without Node), it automatically falls back to in-memory catalog data and browser `localStorage`. **It never crashes or shows a broken state.**

---

## 🚀 How to Run the Project

### Option A: Full-Stack Mode (Node.js + Express + SQLite Database) — *Recommended for College Presentation*
1. Open terminal in the project directory:
   ```bash
   cd "c:\Users\Rishabh Kumar\OneDrive\Desktop\ShopeEase"
   ```
2. Start the backend server:
   ```bash
   npm start
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```
4. Look at the top announcement bar: you will see a green badge indicating:  
   `🟢 Full-Stack Mode (SQLite)`  
   All products, cart items, wishlist items, and orders are now reading and writing directly to the SQLite database (`data/meesho.db`)!

---

### Option B: Standalone Browser Mode (Direct Launch) — *Zero Setup*
1. Simply double-click **`index.html`** or right-click and choose **Open with > Google Chrome / Microsoft Edge**.
2. Alternatively, right-click `index.html` in VS Code and select **Open with Live Server**.
3. Look at the top announcement bar: you will see a badge indicating:  
   `🟡 Standalone Mode (Local)`  
   The application runs completely client-side using `localStorage`, with zero network dependencies.

---

## 📁 Project Directory Structure

```
ShopeEase/
│
├── index.html                                 # Semantic HTML5 frontend markup & modals
├── style.css                                  # Meesho design system (#9f2089 magenta, CSS Grid)
├── script.js                                  # Dual-mode client engine (Fetch API + LocalStorage)
│
├── server.js                                  # Express.js REST API server (Port 5000)
├── db.js                                      # SQLite database layer & schema initialization
├── data/
│   └── meesho.db                              # SQLite database file (tables: products, orders, cart...)
│
├── Meesho_Clone_BTech_Project_Presentation.pptx # 12-Slide Academic PowerPoint Presentation
├── generate_ppt.js                            # Automated PPTX presentation generator
├── package.json                               # Node.js project manifest & scripts
│
├── backup/                                    # Automated pre-modification backup of original files
└── README.md                                  # Complete project documentation & viva guide
```

---

## 🗄️ Database Design (SQLite Schema)

The SQLite database (`data/meesho.db`) contains 5 relational tables:

```sql
-- 1. Products Catalog (22 authentic seeded products)
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  discount INTEGER NOT NULL,
  rating REAL DEFAULT 4.0,
  reviews_count INTEGER DEFAULT 0,
  image TEXT NOT NULL,
  description TEXT,
  popularity INTEGER DEFAULT 50,
  stock INTEGER DEFAULT 10,
  badge TEXT,
  tags TEXT
);

-- 2. Orders Records (Saves completed checkout orders)
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT UNIQUE NOT NULL,
  order_date TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  total_amount INTEGER NOT NULL,
  items_json TEXT NOT NULL
);

-- 3. Shopping Cart Table (Session-scoped)
CREATE TABLE cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1,
  UNIQUE(session_id, product_id)
);

-- 4. Wishlist Items Table
CREATE TABLE wishlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  UNIQUE(session_id, product_id)
);

-- 5. Promotional Coupons Table
CREATE TABLE coupons (
  code TEXT PRIMARY KEY,
  discount INTEGER NOT NULL,
  type TEXT NOT NULL,
  min_order INTEGER NOT NULL,
  description TEXT NOT NULL
);
```

---

## 🌐 RESTful API Endpoints Specification

| Method | Endpoint | Parameters / Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | None | Checks server connectivity, returns DB driver & timestamp |
| `GET` | `/api/products` | `?category=...&search=...&sort=...` | Returns filtered and sorted products from SQLite |
| `GET` | `/api/products/:id` | `id` (URL parameter) | Retrieves single product details |
| `GET` | `/api/categories` | None | Returns all 8 departments with product counts |
| `GET` | `/api/cart` | Header `x-session-id` | Retrieves current session's cart items from SQLite |
| `POST` | `/api/cart` | JSON `{ productId, quantity }` | Adds product to cart or increments quantity |
| `PUT` | `/api/cart/:id` | JSON `{ delta }` | Updates item quantity (+1 or -1) in database |
| `DELETE` | `/api/cart/:id` | None | Removes product from session cart |
| `GET` | `/api/wishlist` | Header `x-session-id` | Retrieves wishlisted product IDs from SQLite |
| `POST` | `/api/wishlist` | JSON `{ productId }` | Toggles product wishlist state in SQLite |
| `POST` | `/api/orders` | JSON `{ customer, paymentMethod, items, totalAmount }` | Validates phone/address, generates Order ID, saves to SQLite |
| `GET` | `/api/orders` | None | Returns all past orders from database |
| `POST` | `/api/coupons/apply` | JSON `{ code, orderAmount }` | Validates coupon (`MEESHONEW`, `MEESHO100`, `FESTIVE20`) |

---

## 📊 PowerPoint Presentation (`.pptx`)

A PowerPoint presentation has been generated in the project directory:
**`Meesho_Clone_BTech_Project_Presentation.pptx`**

### Summary of the 12 Slides:
1. **Slide 1:** Title Slide (Project Title, B.Tech CSE, Student Name: Rishabh Kumar, 2026).
2. **Slide 2:** Project Abstract & Objectives (Social Commerce Model, Factory Pricing).
3. **Slide 3:** Problem Statement & Motivation (Middleman markups, regional payment needs).
4. **Slide 4:** 3-Tier System Architecture (Presentation, Application, and Database Tiers).
5. **Slide 5:** Technology Stack Specifications (HTML5, CSS3, Vanilla JS, Node, Express, SQLite).
6. **Slide 6:** Database Design & Relational Schema (Products, Orders, Cart, Wishlist, Coupons).
7. **Slide 7:** RESTful API Endpoints Table (HTTP Verbs, URIs, Payloads, Status Codes).
8. **Slide 8:** Key Functional Modules (Catalog, Quick View, Cart Drawer, Checkout).
9. **Slide 9:** UI/UX & Responsive Design System (Meesho Magenta, 2-Col Mobile Grid, Dock).
10. **Slide 10:** Quality Assurance & Testing Results (All 6 core test suites passed).
11. **Slide 11:** Viva Voce Defense Guide (Common examiner questions & answers).
12. **Slide 12:** Conclusion & Future Scope (Payment gateways, seller dashboard, AI recommendations).

---

## 🎓 Viva Voce Questions & Answers (College Defense)

### Q1: Why did you choose SQLite over MongoDB or MySQL?
> **Answer:** "SQLite is an embedded, zero-configuration relational database stored directly in `data/meesho.db`. Unlike MongoDB or MySQL, it requires no background service daemons or network setup, making it 100% portable for academic demonstrations while preserving complete SQL relational integrity and ACID compliance."

### Q2: What is the Dual-Mode Resilient Architecture and why is it important?
> **Answer:** "The frontend dynamically probes `/api/health` on startup. If connected to Express, it synchronizes with the SQLite database. If the server is offline or the examiner simply double-clicks `index.html`, it falls back to `localStorage`. This guarantees zero crashes during evaluations."

### Q3: How is duplicate prevention handled in the shopping cart?
> **Answer:** "Both client and server enforce uniqueness: the database `cart_items` table has a `UNIQUE(session_id, product_id)` constraint, and the `addToCart` function checks whether the product exists and increments `quantity = quantity + ?` rather than inserting a duplicate row."

### Q4: How are Indian e-commerce constraints accommodated?
> **Answer:** "The platform natively accommodates Cash on Delivery (COD) as a default payment mode, provides a dynamic Free Delivery progress bar (threshold ₹499), validates 10-digit Indian phone numbers (`/^[6-9]\d{9}$/`), and requires valid 6-digit Indian PIN codes."

---

## 🛡️ Academic Declaration
This project is developed for educational purposes as a B.Tech college project demonstration.
