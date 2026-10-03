-- TECHNOVA Electronics Database Schema (Relational SQLite / Postgres compatible)

PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    website TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    original_price REAL NOT NULL,
    discount_percent INTEGER DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    sku TEXT UNIQUE NOT NULL,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT 0,
    is_bestseller BOOLEAN DEFAULT 0,
    is_flash_deal BOOLEAN DEFAULT 0,
    deal_ends_at DATETIME,
    warranty_months INTEGER DEFAULT 12,
    return_days INTEGER DEFAULT 15,
    images_json TEXT NOT NULL DEFAULT '[]', -- JSON array of image URLs
    specifications_json TEXT NOT NULL DEFAULT '{}', -- JSON key-value of technical specs
    features_json TEXT NOT NULL DEFAULT '[]', -- JSON array of key highlights
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Product Variants (e.g. Storage, Color, RAM options)
CREATE TABLE IF NOT EXISTS product_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_name TEXT NOT NULL, -- e.g. "Space Black, 256GB"
    color TEXT,
    storage TEXT,
    ram TEXT,
    price_delta REAL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    sku TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_default BOOLEAN DEFAULT 0,
    address_type TEXT DEFAULT 'home' CHECK(address_type IN ('home', 'work', 'other')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id, variant_id)
);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK(discount_type IN ('percentage', 'flat')),
    discount_value REAL NOT NULL,
    min_purchase REAL DEFAULT 0,
    max_discount REAL,
    usage_limit INTEGER DEFAULT 1000,
    times_used INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subtotal REAL NOT NULL,
    discount_amount REAL DEFAULT 0,
    coupon_code TEXT,
    shipping_fee REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'ordered' CHECK(status IN ('ordered', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled')),
    shipping_address_json TEXT NOT NULL,
    shipping_method TEXT DEFAULT 'standard',
    payment_method TEXT NOT NULL, -- UPI, Card, NetBanking, COD
    payment_status TEXT DEFAULT 'completed' CHECK(payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    estimated_delivery_date DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    variant_name TEXT,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    helpful_votes INTEGER DEFAULT 0,
    is_verified_buyer BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
