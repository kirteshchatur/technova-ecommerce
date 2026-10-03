# ⚡ TECHNOVA — Technology. Simplified.
### Production-Grade Full-Stack Electronics E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.3-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3.4-38bdf8.svg)](https://tailwindcss.com/)
[![SQLite/Postgres](https://img.shields.io/badge/Database-SQLite%20%2F%20Postgres-blue.svg)](https://sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

TECHNOVA is a production-quality electronics marketplace engineered to deliver an authentic, high-performance retail experience on par with Best Buy, Croma, Reliance Digital, and Apple Store. It features a modern consumer storefront, rich catalog filtering and comparison, multi-step checkout with simulated payments, visual 6-stage order tracking, customer account management, and a comprehensive Admin Center with interactive Recharts analytics.

---

## 🌟 Key Features

### 🛒 Consumer Storefront
* **Live Search with Autocomplete**: Instant search suggestions for products, categories, and brands as you type.
* **Flash Deals Section**: Real-time ticking countdown timer (HH:MM:SS) showcasing daily limited-time electronic discounts.
* **Multi-Criteria Catalog**:
  * Filter by Category, Brand, Price Range (Min/Max), Customer Rating (4★+), Stock Availability, and Flash Deals.
  * 7 sorting modes: Relevance, Price (Low-to-High / High-to-Low), Customer Rating, Newest, Best Selling, and Biggest Discount.
  * Grid vs List layout switch.
* **Product Detail Page**:
  * Multi-angle image gallery with thumbnail previews and hover zoom.
  * Variant selector (Storage, RAM, Color options) with dynamic pricing adjustment.
  * Stock urgency indicators (*"Only 3 units left in stock!"*).
  * PIN Code delivery estimator with instant date calculation.
  * No-Cost EMI monthly calculator widget.
  * 6 Structured tabs: Overview, Specifications table, Key features, Customer Reviews with rating distribution, Shipping policies, and Manufacturer warranty.
  * Frequently Bought Together bundle with 1-click add all.
  * Related products recommendations.
* **Device Comparison Engine (`/compare`)**:
  * Compare up to 4 electronics devices side-by-side in a comparative matrix (Display, Processor, RAM, Storage, Battery, Camera, OS, Price, Rating, Warranty).
* **Shopping Cart & Coupons**:
  * Instant quantity adjustments, variant selection, and live recalculation of Subtotal, GST Tax (18%), and Shipping.
  * Dynamic promo coupon validation (`TECH10` for 10% off, `SAVE500` for flat ₹500 off, `WELCOME20`).
* **Multi-Step Checkout**:
  * **Step 1**: Delivery address selection & validation.
  * **Step 2**: Shipping option (Standard Free vs Express Delivery ₹150).
  * **Step 3**: Safe simulated payment gateway (UPI with QR code & VPA input, Credit/Debit card form, Net Banking, Cash on Delivery).
  * **Step 4**: Celebratory order confirmation with confetti effect, downloadable order summary, and tracking link.
* **Shipment Tracking (`/orders/track/:orderNumber`)**:
  * Visual 6-stage progress timeline:
    `Ordered` → `Confirmed` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`.
* **Customer Dashboard (`/account`)**:
  * Profile settings & password changes.
  * Order history with item thumbnails, status badges, and direct tracking links.
  * Saved address book management.
  * Persistent Wishlist with 1-click Move to Cart.
* **Dark Mode / Light Mode**:
  * Global dark mode with persistence in `localStorage` and system preference detection.

---

### 🛡️ Admin Management Center (`/admin`)
* **Real-time Analytics Dashboard**:
  * KPI metric cards: Total Sales Revenue, Customer Orders, Registered Customers, Low Stock alerts.
  * Interactive Recharts: 7-day revenue trend area chart and Category revenue distribution donut chart.
  * Recent customer orders list with live status indicators.
* **Product Management**:
  * Complete CRUD: Add, edit, or delete products with specs, variants, pricing, discount, and image URLs.
  * Safe destructive action confirmation dialogs.
* **Inventory Control**:
  * Real-time stock counts, units sold, low-stock threshold warnings, and quick inline stock adjustments.
* **Order Management**:
  * View all customer orders with customer details and update fulfillment status (`ordered`, `confirmed`, `packed`, `shipped`, `out_for_delivery`, `delivered`, `cancelled`).
* **Customer Management**:
  * Customer profiles with order count and lifetime spend metrics.
* **Coupon Manager**:
  * Create discount codes, toggle active/inactive status, and set usage limits.

---

## 🗄️ Relational Database Schema

```sql
users (id, name, email, password_hash, phone, role, avatar_url, created_at)
categories (id, name, slug, description, icon, image_url, is_featured)
brands (id, name, slug, logo_url, website)
products (id, name, slug, brand_id, category_id, short_description, description, price, original_price, discount_percent, stock, low_stock_threshold, sku, rating, review_count, is_featured, is_bestseller, is_flash_deal, deal_ends_at, warranty_months, return_days, images_json, specifications_json, features_json)
product_variants (id, product_id, variant_name, color, storage, ram, price_delta, stock, sku)
addresses (id, user_id, full_name, phone, address_line, city, state, pincode, is_default, address_type)
cart_items (id, user_id, product_id, variant_id, quantity)
wishlists (id, user_id, product_id)
coupons (id, code, discount_type, discount_value, min_purchase, max_discount, usage_limit, times_used, is_active)
orders (id, order_number, user_id, subtotal, discount_amount, coupon_code, shipping_fee, tax_amount, total_amount, status, shipping_address_json, shipping_method, payment_method, payment_status, estimated_delivery_date)
order_items (id, order_id, product_id, variant_id, product_name, product_image, variant_name, price, quantity, subtotal)
reviews (id, product_id, user_id, rating, title, comment, helpful_votes, is_verified_buyer)
```

---

## 🔑 Quick Demo Credentials

For convenience, 1-click login buttons are provided on the `/auth` page, or you can enter credentials manually:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@technova.com` | `Admin@123` | Full Storefront + Admin Dashboard (`/admin`) |
| **Customer** | `demo@technova.com` | `User@123` | Storefront, Cart, Wishlist, Checkout, Tracking |

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js (v18 or v20+)
- npm (v9+)

### 2. Setup Dependencies & Seed Database
```bash
# In the project root:
npm run install:all

# Seed database with realistic electronics catalog, categories, brands, & admin
npm run seed
```

### 3. Run the Application
In terminal 1 (Start Backend API Server):
```bash
npm run server
# Backend runs on http://localhost:5001
```

In terminal 2 (Start Frontend Vite Dev Server):
```bash
npm run client
# Frontend runs on http://localhost:5173
```

Open your browser at **`http://localhost:5173`**.

---

## 🧪 Automated Testing

To run the automated API verification suite:
```bash
npm run test-api
```

This validates 12 critical end-to-end flows:
1. Health check & status
2. Product catalog querying
3. Keyword search & relevance
4. Autocomplete suggestion engine
5. Customer authentication with JWT
6. Admin role verification
7. Cart item addition with variants
8. Cart retrieval & calculation
9. Dynamic coupon calculation
10. Order transaction & stock deduction
11. Multi-step order tracking timeline
12. Admin dashboard metrics aggregation

---

## 📂 Project Architecture

```
project-1/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection, JWT constants
│   │   ├── controllers/     # Auth, Products, Cart, Orders, Admin, Reviews, Coupons
│   │   ├── middleware/      # JWT verification, Admin authorization, Error handler
│   │   ├── db/              # schema.sql, seed.js
│   │   ├── routes/          # Express route definitions
│   │   └── server.js        # Express app entry
│   ├── test-api.js          # Automated verification test script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   ├── product/     # ProductCard, FilterSidebar, CompareBar
│   │   │   └── common/      # Skeleton loaders
│   │   ├── context/         # Auth, Cart, Wishlist, Compare, Theme, Toast
│   │   ├── pages/           # Home, Catalog, ProductDetail, Cart, Checkout, OrderTracking, Compare, Account, Auth, Admin
│   │   ├── services/        # Central API client
│   │   ├── App.jsx          # Route declarations
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── README.md
└── package.json
```

---

## 🛡️ Security Best Practices
- **Password Hashing**: Passwords stored using `bcryptjs` with 10 salt rounds.
- **JWT Authorization**: Cryptographic JSON Web Tokens with bearer verification.
- **Input Validation**: Sanitized query inputs and parameterized SQL queries preventing SQL injection.
- **Role Guards**: Strict admin authorization guards on all management endpoints.
- **Payment Privacy**: Sensitive credit card or bank credentials are never stored.
