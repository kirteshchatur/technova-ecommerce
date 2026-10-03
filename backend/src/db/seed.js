import db from '../config/db.js';
import bcrypt from 'bcryptjs';

console.log('🌱 Starting TECHNOVA Database Seeding...');

// Clear existing tables
db.exec(`
  DELETE FROM order_items;
  DELETE FROM orders;
  DELETE FROM reviews;
  DELETE FROM cart_items;
  DELETE FROM wishlists;
  DELETE FROM addresses;
  DELETE FROM product_variants;
  DELETE FROM products;
  DELETE FROM brands;
  DELETE FROM categories;
  DELETE FROM coupons;
  DELETE FROM users;
`);

// Reset SQLite auto-increments
db.exec(`
  DELETE FROM sqlite_sequence WHERE name IN (
    'users', 'categories', 'brands', 'products', 'product_variants',
    'addresses', 'cart_items', 'wishlists', 'coupons', 'orders', 'order_items', 'reviews'
  );
`);

// 1. Users
const adminPass = bcrypt.hashSync('Admin@123', 10);
const userPass = bcrypt.hashSync('User@123', 10);

const insertUser = db.prepare(`
  INSERT INTO users (name, email, password_hash, phone, role, avatar_url)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertUser.run('TECHNOVA Admin', 'admin@technova.com', adminPass, '+91 9876543210', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');
insertUser.run('Alex Morgan', 'demo@technova.com', userPass, '+91 9123456780', 'customer', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');
insertUser.run('Sophia Chen', 'sophia@example.com', userPass, '+91 9988776655', 'customer', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80');

// 2. Categories
const categories = [
  { name: 'Smartphones', slug: 'smartphones', icon: 'Smartphone', description: 'Next-gen flagship & foldable smartphones with pro cameras and 5G connectivity.', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', is_featured: 1 },
  { name: 'Laptops', slug: 'laptops', icon: 'Laptop', description: 'Ultra-thin notebooks, creator workstations, and high-performance gaming laptops.', image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80', is_featured: 1 },
  { name: 'Tablets', slug: 'tablets', icon: 'Tablet', description: 'Creative digital canvases and portable media powerhouses with stylus support.', image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80', is_featured: 1 },
  { name: 'Headphones', slug: 'headphones', icon: 'Headphones', description: 'Audiophile active noise-canceling headphones and wireless spatial earbuds.', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', is_featured: 1 },
  { name: 'Smartwatches', slug: 'smartwatches', icon: 'Watch', description: 'Advanced biometric health tracking, sapphire glass, and cellular smart wearables.', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80', is_featured: 1 },
  { name: 'Gaming', slug: 'gaming', icon: 'Gamepad2', description: 'Next-gen consoles, mechanical keyboards, gaming mice, and VR headsets.', image_url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80', is_featured: 1 },
  { name: 'Cameras', slug: 'cameras', icon: 'Camera', description: 'Full-frame mirrorless digital cameras, cine lenses, and 4K vlogging rigs.', image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80', is_featured: 1 },
  { name: 'Televisions', slug: 'televisions', icon: 'Tv', description: 'OLED and Mini-LED 4K/8K smart cinema displays with Dolby Vision & Atmos.', image_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80', is_featured: 1 },
  { name: 'Accessories', slug: 'accessories', icon: 'Cable', description: 'High-speed GaN fast chargers, Thunderbolt docks, protective cases, and cables.', image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80', is_featured: 0 },
  { name: 'Smart Home', slug: 'smart-home', icon: 'Home', description: 'Smart assistant displays, security cameras, smart lighting, and automated mesh hubs.', image_url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', is_featured: 0 }
];

const insertCategory = db.prepare(`
  INSERT INTO categories (name, slug, description, icon, image_url, is_featured)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const cat of categories) {
  insertCategory.run(cat.name, cat.slug, cat.description, cat.icon, cat.image_url, cat.is_featured);
}

// 3. Brands
const brands = [
  { name: 'Apple', slug: 'apple', logo_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=150&q=80', website: 'https://apple.com' },
  { name: 'Samsung', slug: 'samsung', logo_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=150&q=80', website: 'https://samsung.com' },
  { name: 'Sony', slug: 'sony', logo_url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=150&q=80', website: 'https://sony.com' },
  { name: 'Dell', slug: 'dell', logo_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=150&q=80', website: 'https://dell.com' },
  { name: 'Bose', slug: 'bose', logo_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=150&q=80', website: 'https://bose.com' },
  { name: 'ASUS ROG', slug: 'asus-rog', logo_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80', website: 'https://rog.asus.com' },
  { name: 'Canon', slug: 'canon', logo_url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=150&q=80', website: 'https://canon.com' },
  { name: 'LG', slug: 'lg', logo_url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=150&q=80', website: 'https://lg.com' },
  { name: 'Logitech', slug: 'logitech', logo_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=150&q=80', website: 'https://logitech.com' },
  { name: 'Google', slug: 'google', logo_url: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=150&q=80', website: 'https://google.com' }
];

const insertBrand = db.prepare(`
  INSERT INTO brands (name, slug, logo_url, website)
  VALUES (?, ?, ?, ?)
`);

for (const b of brands) {
  insertBrand.run(b.name, b.slug, b.logo_url, b.website);
}

// 4. Products
const products = [
  {
    name: 'Apple iPhone 15 Pro Max',
    slug: 'apple-iphone-15-pro-max',
    brand: 'Apple',
    category: 'Smartphones',
    short_description: 'Aerospace-grade titanium design, A17 Pro chip, 48MP main camera with 5x optical telephoto lens.',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever with 5x optical zoom on the 120mm lens. Enjoy the stunning 6.7-inch Super Retina XDR display with ProMotion and Always-On.',
    price: 134900,
    original_price: 159900,
    discount_percent: 15,
    stock: 24,
    low_stock_threshold: 5,
    sku: 'APL-IPH15PM-256',
    rating: 4.9,
    review_count: 142,
    is_featured: 1,
    is_bestseller: 1,
    is_flash_deal: 1,
    deal_ends_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    warranty_months: 12,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Display": "6.7-inch Super Retina XDR OLED, 120Hz ProMotion",
      "Processor": "Apple A17 Pro (3nm architecture, 6-core GPU)",
      "RAM": "8 GB Unified Memory",
      "Storage": "256 GB NVMe",
      "Camera": "48MP Main + 12MP Ultra-Wide + 12MP 5x Telephoto",
      "Battery": "4,422 mAh (Up to 29 hrs video playback)",
      "OS": "iOS 17 (Upgradable)",
      "Weight": "221 grams"
    },
    features: [
      "Titanium frame with textured matte glass back",
      "Action button for quick access to favorite shortcuts",
      "USB-C connector with USB 3 speeds up to 10Gb/s",
      "Ceramic Shield front tougher than any smartphone glass"
    ],
    variants: [
      { name: 'Natural Titanium / 256GB', color: 'Natural Titanium', storage: '256GB', ram: '8GB', price_delta: 0, stock: 12, sku: 'IP15PM-NT-256' },
      { name: 'Natural Titanium / 512GB', color: 'Natural Titanium', storage: '512GB', ram: '8GB', price_delta: 20000, stock: 8, sku: 'IP15PM-NT-512' },
      { name: 'Black Titanium / 256GB', color: 'Black Titanium', storage: '256GB', ram: '8GB', price_delta: 0, stock: 4, sku: 'IP15PM-BT-256' }
    ]
  },
  {
    name: 'Samsung Galaxy S24 Ultra 5G',
    slug: 'samsung-galaxy-s24-ultra',
    brand: 'Samsung',
    category: 'Smartphones',
    short_description: 'Galaxy AI smartphone with 200MP Quad Telephoto camera, titanium shield, and built-in S Pen.',
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity and productivity. Built with a robust titanium frame and Corning Gorilla Armor, featuring a flat 6.8-inch Dynamic AMOLED 2X 2600-nit screen.',
    price: 129999,
    original_price: 144999,
    discount_percent: 10,
    stock: 18,
    low_stock_threshold: 4,
    sku: 'SAM-S24U-256',
    rating: 4.8,
    review_count: 98,
    is_featured: 1,
    is_bestseller: 1,
    is_flash_deal: 0,
    deal_ends_at: null,
    warranty_months: 12,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Display": "6.8-inch Dynamic AMOLED 2X, QHD+, 1-120Hz, 2600 nits",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy (4nm)",
      "RAM": "12 GB LPDDR5X",
      "Storage": "256 GB UFS 4.0",
      "Camera": "200MP Main + 50MP 5x + 10MP 3x + 12MP Ultra-wide",
      "Battery": "5,000 mAh with 45W Fast Charging",
      "OS": "Android 14 with One UI 6.1 (7 years updates)",
      "Weight": "232 grams"
    },
    features: [
      "Circle to Search with Google AI built-in",
      "Live Translate and Note Assist for instant productivity",
      "Corning Gorilla Armor reduces reflections by 75%",
      "Integrated precision S Pen with 2.8ms latency"
    ],
    variants: [
      { name: 'Titanium Gray / 256GB', color: 'Titanium Gray', storage: '256GB', ram: '12GB', price_delta: 0, stock: 10, sku: 'S24U-GR-256' },
      { name: 'Titanium Black / 512GB', color: 'Titanium Black', storage: '512GB', ram: '12GB', price_delta: 15000, stock: 8, sku: 'S24U-BK-512' }
    ]
  },
  {
    name: 'Apple MacBook Pro 16" M3 Max',
    slug: 'apple-macbook-pro-16-m3-max',
    brand: 'Apple',
    category: 'Laptops',
    short_description: 'Supercharged for pros with M3 Max 16-core CPU, 40-core GPU, Liquid Retina XDR display, up to 22h battery.',
    description: 'The 16-inch MacBook Pro blasts forward with M3 Max, an unimaginably advanced chip that delivers massive performance for the most demanding workflows. With industry-leading battery life, a breathtaking Liquid Retina XDR display, and all the ports you need.',
    price: 349900,
    original_price: 399900,
    discount_percent: 12,
    stock: 7,
    low_stock_threshold: 3,
    sku: 'APL-MBP16-M3M',
    rating: 4.95,
    review_count: 64,
    is_featured: 1,
    is_bestseller: 1,
    is_flash_deal: 0,
    deal_ends_at: null,
    warranty_months: 12,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Display": "16.2-inch Liquid Retina XDR (3456x2234), 1600 nits peak, 120Hz",
      "Processor": "Apple M3 Max (16-core CPU, 40-core GPU, 16-core Neural Engine)",
      "RAM": "48 GB Unified Memory (Up to 400GB/s bandwidth)",
      "Storage": "1 TB Superfast SSD",
      "Ports": "3x Thunderbolt 4, HDMI 2.1, SDXC card slot, MagSafe 3",
      "Battery": "100Wh Lithium-Polymer (Up to 22 hrs)",
      "OS": "macOS Sonoma",
      "Weight": "2.16 kg"
    },
    features: [
      "Hardware-accelerated ray tracing and mesh shading",
      "Six-speaker sound system with force-cancelling woofers",
      "Studio-quality three-mic array with high signal-to-noise ratio",
      "1080p FaceTime HD camera with advanced computational video"
    ],
    variants: [
      { name: 'Space Black / 48GB / 1TB', color: 'Space Black', storage: '1TB', ram: '48GB', price_delta: 0, stock: 4, sku: 'MBP16-SB-1TB' },
      { name: 'Silver / 64GB / 2TB', color: 'Silver', storage: '2TB', ram: '64GB', price_delta: 60000, stock: 3, sku: 'MBP16-SL-2TB' }
    ]
  },
  {
    name: 'Dell XPS 15 9530 InfinityEdge',
    slug: 'dell-xps-15-9530',
    brand: 'Dell',
    category: 'Laptops',
    short_description: 'Intel Core i9 13th Gen, NVIDIA RTX 4070, 3.5K OLED Touchscreen display with precision CNC chassis.',
    description: 'Immerse yourself in content with bright, color-rich OLED panels with high resolution, and more viewing space to keep you productive. Packed with 13th Gen Intel Core processors and RTX 40-series graphics in an iconic thin aluminum and carbon fiber design.',
    price: 224990,
    original_price: 259990,
    discount_percent: 13,
    stock: 9,
    low_stock_threshold: 3,
    sku: 'DEL-XPS15-9530',
    rating: 4.7,
    review_count: 53,
    is_featured: 1,
    is_bestseller: 0,
    is_flash_deal: 1,
    deal_ends_at: new Date(Date.now() + 86400000 * 3).toISOString(),
    warranty_months: 24,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Display": "15.6-inch 3.5K (3456x2160) OLED Touch, 400 nits, 100% DCI-P3",
      "Processor": "13th Gen Intel Core i9-13900H (14 cores, up to 5.4 GHz)",
      "RAM": "32 GB DDR5 4800MHz Dual-Channel",
      "Storage": "1 TB PCIe NVMe Gen 4 SSD",
      "GPU": "NVIDIA GeForce RTX 4070 8GB GDDR6",
      "Battery": "86Wh with 130W Type-C adapter",
      "OS": "Windows 11 Home",
      "Weight": "1.92 kg"
    },
    features: [
      "Quad-speaker design with Waves Nx 3D audio",
      "Machined aluminum chassis with aerospace carbon fiber palm rest",
      "Corning Gorilla Glass 6 touch panel",
      "Dual Thunderbolt 4 ports with Power Delivery"
    ],
    variants: [
      { name: 'Platinum Silver / 32GB / 1TB', color: 'Platinum Silver', storage: '1TB', ram: '32GB', price_delta: 0, stock: 5, sku: 'XPS15-SLV-1TB' },
      { name: 'Platinum Silver / 64GB / 2TB', color: 'Platinum Silver', storage: '2TB', ram: '64GB', price_delta: 45000, stock: 4, sku: 'XPS15-SLV-2TB' }
    ]
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    slug: 'sony-wh-1000xm5-wireless-headphones',
    brand: 'Sony',
    category: 'Headphones',
    short_description: 'Industry-leading noise cancellation with Auto NC Optimizer, 30h battery, crystal-clear hands-free calls.',
    description: 'With two processors controlling eight microphones, Auto NC Optimizer for automatically optimizing noise cancellation based on your wearing conditions and environment, and a specially designed driver unit, WH-1000XM5 headphones rewrite the rules for distraction-free listening.',
    price: 29990,
    original_price: 34990,
    discount_percent: 14,
    stock: 35,
    low_stock_threshold: 5,
    sku: 'SNY-WH1000XM5-BLK',
    rating: 4.85,
    review_count: 215,
    is_featured: 1,
    is_bestseller: 1,
    is_flash_deal: 1,
    deal_ends_at: new Date(Date.now() + 86400000).toISOString(),
    warranty_months: 12,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Type": "Over-Ear Circumaural Closed Wireless",
      "Noise Cancellation": "Dual Integrated Processor V1 + HD Noise Cancelling Processor QN1",
      "Driver": "30mm precision-engineered carbon fiber composite",
      "Battery Life": "30 Hours with ANC On, 40 Hours with ANC Off",
      "Fast Charge": "3 minutes gives 3 hours playback (USB-PD)",
      "Codecs": "LDAC, AAC, SBC with DSEE Extreme audio upscaling",
      "Weight": "250 grams"
    },
    features: [
      "Industry-leading active noise cancellation with 8 microphones",
      "Multipoint connection lets you pair two Bluetooth devices simultaneously",
      "Speak-to-Chat automatically pauses playback when you start talking",
      "Ultra-comfortable soft fit leather headband"
    ],
    variants: [
      { name: 'Black', color: 'Black', storage: null, ram: null, price_delta: 0, stock: 20, sku: 'XM5-BLK' },
      { name: 'Silver', color: 'Silver', storage: null, ram: null, price_delta: 0, stock: 15, sku: 'XM5-SLV' }
    ]
  },
  {
    name: 'Bose QuietComfort Ultra Headphones',
    slug: 'bose-quietcomfort-ultra-headphones',
    brand: 'Bose',
    category: 'Headphones',
    short_description: 'Breakthrough spatialized audio with world-class noise cancellation and CustomTune technology.',
    description: 'High-fidelity audio meets world-class noise cancellation. Bose Immersive Audio pushes the boundary of what it means to listen by taking what you hear out of your head and placing it in front of you. CustomTune technology personalizes the noise cancellation and sound performance to your ears.',
    price: 35900,
    original_price: 39900,
    discount_percent: 10,
    stock: 22,
    low_stock_threshold: 4,
    sku: 'BOS-QCU-BLK',
    rating: 4.8,
    review_count: 87,
    is_featured: 1,
    is_bestseller: 0,
    is_flash_deal: 0,
    deal_ends_at: null,
    warranty_months: 12,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Type": "Over-Ear Wireless ANC",
      "Audio Technology": "Bose Immersive Audio Spatialized Soundstage",
      "Noise Modes": "Quiet Mode, Aware Mode with ActiveSense, Immersion Mode",
      "Battery Life": "24 Hours (Up to 18 Hours with Immersive Audio)",
      "Bluetooth": "Version 5.3 with Snapdragon Sound aptX Adaptive",
      "Weight": "252 grams"
    },
    features: [
      "CustomTune technology calibrates sound to ear canal anatomy",
      "Luxe materials: cast aluminum yokes and plush protein leather",
      "Wind noise reduction microphone system for clear calls",
      "SimpleSync pairing with Bose Smart Soundbars"
    ],
    variants: [
      { name: 'Black', color: 'Black', storage: null, ram: null, price_delta: 0, stock: 12, sku: 'QCU-BLK' },
      { name: 'White Smoke', color: 'White Smoke', storage: null, ram: null, price_delta: 0, stock: 10, sku: 'QCU-WSM' }
    ]
  },
  {
    name: 'Apple Watch Ultra 2 GPS + Cellular 49mm',
    slug: 'apple-watch-ultra-2',
    brand: 'Apple',
    category: 'Smartwatches',
    short_description: 'Rugged 49mm titanium case, 3000-nit display, precision dual-frequency GPS, 36-hour battery life.',
    description: 'The most capable and rugged Apple Watch pushes the limits again. Featuring the all-new S9 SiP, a magical new double tap gesture to interact without touching the screen, and the brightest Apple display ever at 3000 nits. Rated for 100m water resistance and recreational scuba diving to 40m.',
    price: 89900,
    original_price: 99900,
    discount_percent: 10,
    stock: 14,
    low_stock_threshold: 3,
    sku: 'APL-AWU2-49',
    rating: 4.9,
    review_count: 112,
    is_featured: 1,
    is_bestseller: 1,
    is_flash_deal: 0,
    deal_ends_at: null,
    warranty_months: 12,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Case": "49mm Aerospace-grade Titanium with flat sapphire front crystal",
      "Display": "Always-On Retina OLED, 3000 nits brightness (1 nit minimum)",
      "Chip": "Apple S9 SiP with 4-core Neural Engine",
      "Battery": "Up to 36 hours normal use (Up to 72 hours in Low Power Mode)",
      "Sensors": "Blood Oxygen, ECG, Temperature sensing, Depth gauge to 40m",
      "GPS": "Precision dual-frequency GPS (L1 and L5)",
      "Water Resistance": "WR100 and EN13319 dive certification"
    },
    features: [
      "Customizable Action button in international orange",
      "86-decibel Emergency Siren audible up to 180 meters",
      "Dual speakers and three-mic array with beamforming",
      "Modular Ultra watch face showcasing real-time data"
    ],
    variants: [
      { name: 'Titanium / Blue Ocean Band', color: 'Blue Ocean', storage: '64GB', ram: null, price_delta: 0, stock: 7, sku: 'AWU2-OCN-BLU' },
      { name: 'Titanium / Orange Alpine Loop', color: 'Orange Alpine', storage: '64GB', ram: null, price_delta: 0, stock: 7, sku: 'AWU2-ALP-ORG' }
    ]
  },
  {
    name: 'Sony PlayStation 5 Slim Console (Disc Edition)',
    slug: 'sony-playstation-5-slim',
    brand: 'Sony',
    category: 'Gaming',
    short_description: 'Slimmer design with 1TB SSD, 4K 120Hz gaming, ray tracing, and immersive DualSense haptic feedback.',
    description: 'Experience lightning-fast loading with an ultra-high speed 1TB SSD, deeper immersion with support for haptic feedback, adaptive triggers and 3D Audio, and an all-new generation of incredible PlayStation games in a sleek compact console design.',
    price: 49990,
    original_price: 54990,
    discount_percent: 9,
    stock: 28,
    low_stock_threshold: 5,
    sku: 'SNY-PS5-SLM-1TB',
    rating: 4.9,
    review_count: 310,
    is_featured: 1,
    is_bestseller: 1,
    is_flash_deal: 1,
    deal_ends_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    warranty_months: 12,
    return_days: 7,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "CPU": "x86-64-AMD Ryzen Zen 2, 8 Cores / 16 Threads at 3.5GHz",
      "GPU": "AMD Radeon RDNA 2-based graphics engine with Ray Tracing",
      "Memory": "16 GB GDDR6 (448GB/s bandwidth)",
      "Storage": "1 TB Custom Ultra-Fast NVMe SSD (5.5GB/s raw)",
      "Video Output": "HDMI 2.1 support for 4K 120Hz, 8K, VRR",
      "Audio": "Tempest 3D AudioTech engine",
      "Optical Drive": "Ultra HD Blu-ray (Removable)"
    },
    features: [
      "DualSense Wireless Controller with adaptive dynamic triggers",
      "Over 30% reduction in volume and 24% lighter than original model",
      "Ray tracing realism with lifelike shadows and reflections",
      "Backwards compatible with 4,000+ PS4 titles with Game Boost"
    ],
    variants: [
      { name: 'Standard White 1TB Disc Edition', color: 'White', storage: '1TB', ram: '16GB', price_delta: 0, stock: 28, sku: 'PS5-SLM-DISC' }
    ]
  },
  {
    name: 'Canon EOS R6 Mark II Mirrorless Camera',
    slug: 'canon-eos-r6-mark-ii',
    brand: 'Canon',
    category: 'Cameras',
    short_description: '24.2MP full-frame CMOS sensor, 40 fps electronic shutter, 6K oversampled 4K 60p, advanced Dual Pixel AF II.',
    description: 'Never compromise your vision. The EOS R6 Mark II sets new benchmarks with its versatile full-frame 24.2-megapixel sensor, blistering 40 fps shooting speed, sophisticated subject-tracking autofocus powered by deep learning, and up to 8 stops of in-body image stabilization.',
    price: 215999,
    original_price: 243999,
    discount_percent: 11,
    stock: 6,
    low_stock_threshold: 2,
    sku: 'CAN-R6MK2-BODY',
    rating: 4.88,
    review_count: 42,
    is_featured: 1,
    is_bestseller: 0,
    is_flash_deal: 0,
    deal_ends_at: null,
    warranty_months: 24,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Sensor": "24.2 MP Full-Frame CMOS Sensor (35.9 x 23.9 mm)",
      "Processor": "DIGIC X Image Processor",
      "Autofocus": "Dual Pixel CMOS AF II with 1053 automatic AF zones",
      "Burst Rate": "Up to 40 fps Electronic Shutter, 12 fps Mechanical",
      "Video": "6K Oversampled 4K UHD 60p uncropped, FHD 180p slow-motion",
      "Stabilization": "5-axis In-Body Image Stabilization (Up to 8 stops with RF IS)",
      "Viewfinder": "0.5-inch 3.69M-dot OLED EVF with 120 fps refresh",
      "Weight": "670 grams with battery and memory card"
    },
    features: [
      "Subject detection for humans, horses, birds, cars, trains, aircraft",
      "Dual UHS-II SD card slots for redundant recording",
      "Canon Log 3 and HDR PQ 10-bit color profiles",
      "Weather-sealed magnesium alloy internal chassis"
    ],
    variants: [
      { name: 'Body Only', color: 'Black', storage: null, ram: null, price_delta: 0, stock: 4, sku: 'R6M2-BODY' },
      { name: 'With RF 24-105mm f/4L IS USM Lens', color: 'Black', storage: null, ram: null, price_delta: 90000, stock: 2, sku: 'R6M2-KIT-24105' }
    ]
  },
  {
    name: 'LG C3 65" 4K Smart OLED evo TV',
    slug: 'lg-c3-65-oled-evo-tv',
    brand: 'LG',
    category: 'Televisions',
    short_description: 'Self-lit OLED evo pixels with Brightness Booster, α9 AI Processor Gen6, 0.1ms response, Dolby Vision & Atmos.',
    description: 'Enter a world of realism with the LG OLED evo C3. Powered by the α9 AI Processor Gen6, pixels shine brighter than ever with Brightness Booster. Complete with 4 HDMI 2.1 ports, 120Hz refresh rate, G-Sync and FreeSync Premium for the ultimate cinema and gaming experience.',
    price: 189990,
    original_price: 249990,
    discount_percent: 24,
    stock: 11,
    low_stock_threshold: 3,
    sku: 'LG-OLED65C3-4K',
    rating: 4.92,
    review_count: 178,
    is_featured: 1,
    is_bestseller: 1,
    is_flash_deal: 1,
    deal_ends_at: new Date(Date.now() + 86400000 * 4).toISOString(),
    warranty_months: 36,
    return_days: 10,
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Screen Size": "65-inch 4K Ultra HD (3840 x 2160)",
      "Panel Technology": "OLED evo with Infinite Contrast & Perfect Black",
      "Processor": "α9 AI Processor 4K Gen6 with AI Super Upscaling",
      "Refresh Rate": "120Hz Native, 0.1ms Response Time",
      "HDR Support": "Dolby Vision, HDR10, HLG, Filmmaker Mode",
      "Audio": "40W 2.2 Channel with Dolby Atmos & AI Sound Pro 9.1.2",
      "Gaming Features": "4x HDMI 2.1 (48Gbps), VRR, ALLM, NVIDIA G-Sync, AMD FreeSync"
    },
    features: [
      "Ultra-slim bezel design that merges seamlessly into any decor",
      "webOS 23 smart hub with personalized profiles and Matter smart home support",
      "Magic Remote with intuitive point-and-click navigation",
      "Certified low blue light and flicker-free eye comfort display"
    ],
    variants: [
      { name: '55-inch OLED evo', color: 'Titanium Gray', storage: null, ram: null, price_delta: -50000, stock: 5, sku: 'LG-OLED55C3' },
      { name: '65-inch OLED evo', color: 'Titanium Gray', storage: null, ram: null, price_delta: 0, stock: 6, sku: 'LG-OLED65C3' }
    ]
  },
  {
    name: 'Apple iPad Pro 13" M4 Ultra-Retina Tandem OLED',
    slug: 'apple-ipad-pro-13-m4',
    brand: 'Apple',
    category: 'Tablets',
    short_description: 'Groundbreaking ultra-thin 5.1mm design, Apple M4 chip, Tandem OLED display with 1600 nits peak HDR.',
    description: 'The all-new iPad Pro packs outrageous power into an unbelievably thin, light, and portable design. Pushing the boundaries of display tech with the Ultra Retina XDR screen featuring breakthrough tandem OLED technology. Powered by the next-generation Apple M4 chip.',
    price: 129900,
    original_price: 139900,
    discount_percent: 7,
    stock: 15,
    low_stock_threshold: 4,
    sku: 'APL-IPAD13M4-256',
    rating: 4.89,
    review_count: 76,
    is_featured: 1,
    is_bestseller: 0,
    is_flash_deal: 0,
    deal_ends_at: null,
    warranty_months: 12,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Display": "13-inch Ultra Retina XDR Tandem OLED, 1000 nits full screen / 1600 nits HDR",
      "Processor": "Apple M4 (9-core CPU, 10-core GPU with Ray Tracing)",
      "RAM": "8 GB Unified Memory",
      "Storage": "256 GB High Speed Storage",
      "Camera": "12MP Wide rear + Landscape 12MP Ultra-wide Center Stage front",
      "Connectivity": "Wi-Fi 6E, Bluetooth 5.3, Thunderbolt / USB 4 port",
      "Thickness": "5.1 mm (Apple thinnest device ever)",
      "Weight": "579 grams"
    },
    features: [
      "Compatible with Apple Pencil Pro with squeeze & barrel roll haptics",
      "Tandem OLED technology delivers unprecedented sub-pixel contrast",
      "Studio quality four-speaker audio system",
      "Hardware-accelerated ray tracing for console-quality rendering"
    ],
    variants: [
      { name: 'Space Black / 256GB / Wi-Fi', color: 'Space Black', storage: '256GB', ram: '8GB', price_delta: 0, stock: 9, sku: 'IPAD13-SB-256' },
      { name: 'Silver / 512GB / Wi-Fi', color: 'Silver', storage: '512GB', ram: '8GB', price_delta: 20000, stock: 6, sku: 'IPAD13-SL-512' }
    ]
  },
  {
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    slug: 'logitech-mx-master-3s',
    brand: 'Logitech',
    category: 'Accessories',
    short_description: '8000 DPI track-on-glass sensor, Quiet Clicks, MagSpeed electromagnetic scroll wheel, USB-C fast charging.',
    description: 'Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor. The MagSpeed electromagnetic scroll wheel is 90% faster and 87% more precise.',
    price: 9995,
    original_price: 11995,
    discount_percent: 17,
    stock: 45,
    low_stock_threshold: 8,
    sku: 'LOG-MXM3S-GRY',
    rating: 4.88,
    review_count: 320,
    is_featured: 0,
    is_bestseller: 1,
    is_flash_deal: 1,
    deal_ends_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    warranty_months: 24,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Sensor": "Darkfield 8000 DPI high-precision sensor (works on glass)",
      "Scroll Wheel": "MagSpeed Electromagnetic scroll with SmartShift",
      "Buttons": "7 customizable buttons including thumb wheel and gesture button",
      "Battery Life": "Up to 70 days on a full charge (1-min charge = 3 hours use)",
      "Connectivity": "Bluetooth Low Energy + Logi Bolt USB Receiver",
      "Multi-Device": "Pair up to 3 devices and Flow across Windows and macOS"
    },
    features: [
      "Quiet clicks offer 90% less click noise while maintaining tactile feel",
      "Sculpted ergonomic shape supports palm and fingers naturally",
      "Customizable app-specific shortcuts via Logi Options+ software",
      "USB-C rechargeable with included cable"
    ],
    variants: [
      { name: 'Graphite', color: 'Graphite', storage: null, ram: null, price_delta: 0, stock: 25, sku: 'MXM3S-GRP' },
      { name: 'Pale Gray', color: 'Pale Gray', storage: null, ram: null, price_delta: 0, stock: 20, sku: 'MXM3S-GRY' }
    ]
  },
  {
    name: 'Google Nest Hub Max 10" Smart Display',
    slug: 'google-nest-hub-max',
    brand: 'Google',
    category: 'Smart Home',
    short_description: '10" HD screen, stereo speakers with 30W subwoofer, Nest Cam built-in, Face Match personalization.',
    description: 'Help at a glance for your busy home. Nest Hub Max with Google Assistant helps your family stay in touch and on track. Leave video messages and make video calls with Google Meet. See your personalized calendar, commute, and reminders with Face Match recognition.',
    price: 19999,
    original_price: 24999,
    discount_percent: 20,
    stock: 19,
    low_stock_threshold: 4,
    sku: 'GGL-NEST-HMAX-CH',
    rating: 4.65,
    review_count: 89,
    is_featured: 0,
    is_bestseller: 0,
    is_flash_deal: 1,
    deal_ends_at: new Date(Date.now() + 86400000 * 3).toISOString(),
    warranty_months: 12,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Display": "10.0-inch HD touchscreen (1280 x 800)",
      "Camera": "6.5MP camera with 127° wide field of view and auto-framing",
      "Speakers": "2x 18mm 10W tweeters + 1x 75mm 30W bass woofer",
      "Microphones": "Far-field microphone array with hardware mic/camera kill switch",
      "Wireless": "Wi-Fi 802.11ac dual band, Bluetooth 5.0, Thread mesh hub",
      "Sensors": "Ambient EQ light sensor"
    },
    features: [
      "Nest Cam functionality with motion sensing and live home monitoring",
      "Face Match technology shows personalized cards when you walk into the room",
      "Quick Gestures to pause media by simply raising your hand",
      "Matter and Thread border router built right in"
    ],
    variants: [
      { name: 'Chalk', color: 'Chalk', storage: null, ram: null, price_delta: 0, stock: 11, sku: 'NEST-MAX-CHK' },
      { name: 'Charcoal', color: 'Charcoal', storage: null, ram: null, price_delta: 0, stock: 8, sku: 'NEST-MAX-CHR' }
    ]
  },
  {
    name: 'ASUS ROG Zephyrus G16 (2024) OLED Gaming Laptop',
    slug: 'asus-rog-zephyrus-g16-2024',
    brand: 'ASUS ROG',
    category: 'Gaming',
    short_description: 'Intel Core Ultra 9, NVIDIA RTX 4080, 2.5K 240Hz ROG Nebula OLED display, CNC aluminum chassis.',
    description: 'Precision gaming meets sleek luxury. The Zephyrus G16 is precision machined from aluminum alloy and packs serious gaming firepower with the Intel Core Ultra 9 processor and NVIDIA GeForce RTX 4080 GPU, all cooled with ROG Intelligent Cooling liquid metal.',
    price: 279990,
    original_price: 319990,
    discount_percent: 12,
    stock: 8,
    low_stock_threshold: 2,
    sku: 'ASUS-G16-RTX4080',
    rating: 4.88,
    review_count: 47,
    is_featured: 1,
    is_bestseller: 0,
    is_flash_deal: 0,
    deal_ends_at: null,
    warranty_months: 24,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Display": "16-inch 2.5K (2560x1600) ROG Nebula OLED 240Hz, 0.2ms, G-Sync",
      "Processor": "Intel Core Ultra 9 185H (16 cores / 22 threads, NPU AI boost)",
      "RAM": "32 GB LPDDR5X 7467MHz Dual Channel",
      "Storage": "2 TB PCIe 4.0 NVMe M.2 SSD",
      "GPU": "NVIDIA GeForce RTX 4080 12GB GDDR6 (115W TGP + 25W Dynamic Boost)",
      "Battery": "90Wh battery with 240W slim adapter + 100W Type-C charging",
      "Weight": "1.85 kg"
    },
    features: [
      "Slash Lighting array on the lid with custom reactive animations",
      "ROG Intelligent Cooling with tri-fan tech and liquid metal thermal compound",
      "6-speaker sound system with dual force-canceling woofers and Dolby Atmos",
      "OLED panel with 100% DCI-P3 color gamut and VESA DisplayHDR True Black 500"
    ],
    variants: [
      { name: 'Eclipse Gray / 32GB / 2TB', color: 'Eclipse Gray', storage: '2TB', ram: '32GB', price_delta: 0, stock: 5, sku: 'ROG-G16-GRY' },
      { name: 'Platinum White / 32GB / 2TB', color: 'Platinum White', storage: '2TB', ram: '32GB', price_delta: 5000, stock: 3, sku: 'ROG-G16-WHT' }
    ]
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic 47mm',
    slug: 'samsung-galaxy-watch-6-classic',
    brand: 'Samsung',
    category: 'Smartwatches',
    short_description: 'Iconic rotating bezel, sapphire crystal screen, ECG, blood pressure & advanced sleep coaching.',
    description: 'Timeless luxury meets modern tech. The rotating physical bezel brings intuitive navigation, framed in polished stainless steel with sapphire crystal glass. Track advanced sleep metrics, body composition BIA, and cardiovascular health with continuous monitoring.',
    price: 36999,
    original_price: 43999,
    discount_percent: 16,
    stock: 25,
    low_stock_threshold: 5,
    sku: 'SAM-GW6C-47-BLK',
    rating: 4.75,
    review_count: 145,
    is_featured: 0,
    is_bestseller: 1,
    is_flash_deal: 1,
    deal_ends_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    warranty_months: 12,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Case": "47mm Stainless Steel with mechanical rotating bezel",
      "Display": "1.5-inch Super AMOLED (480x480), Sapphire Crystal, 2000 nits",
      "Processor": "Exynos W930 Dual-Core 1.4GHz",
      "RAM & Storage": "2GB RAM + 16GB internal storage",
      "Sensors": "Samsung BioActive (Optical Heart + Electrical Heart + BIA)",
      "Battery": "425 mAh with WPC Wireless Fast Charging",
      "Durability": "5ATM + IP68 water/dust rating and MIL-STD-810H"
    },
    features: [
      "Physical rotating bezel with tactile clicking response",
      "Personalized Heart Rate Zones for targeted endurance workouts",
      "Fall Detection with automated emergency SOS calling",
      "One-click band mechanism for quick styling changes"
    ],
    variants: [
      { name: 'Black 47mm LTE', color: 'Black', storage: '16GB', ram: null, price_delta: 0, stock: 15, sku: 'GW6C-47-BLK' },
      { name: 'Silver 47mm LTE', color: 'Silver', storage: '16GB', ram: null, price_delta: 0, stock: 10, sku: 'GW6C-47-SLV' }
    ]
  },
  {
    name: 'Anker Prime 20,000mAh 200W Power Bank',
    slug: 'anker-prime-20000-200w-power-bank',
    brand: 'Anker',
    category: 'Accessories',
    short_description: '200W total output, 2x USB-C + 1x USB-A, smart digital smart display, charges 2 laptops fast simultaneously.',
    description: 'Anker Prime combines ultra-dynamic power delivery with a compact design. Equipped with two high-powered USB-C ports delivering up to 100W each and one USB-A port, providing an astonishing 200W total output. The smart digital display shows battery percentage, output watts, and recharge time.',
    price: 8999,
    original_price: 11999,
    discount_percent: 25,
    stock: 60,
    low_stock_threshold: 10,
    sku: 'ANK-PRM-20K-200W',
    rating: 4.82,
    review_count: 240,
    is_featured: 0,
    is_bestseller: 1,
    is_flash_deal: 1,
    deal_ends_at: new Date(Date.now() + 86400000).toISOString(),
    warranty_months: 24,
    return_days: 15,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=900&q=80'
    ],
    specifications: {
      "Capacity": "20,000 mAh (72Wh) Airline-safe",
      "Max Output": "200W Total (100W Max per USB-C port)",
      "Recharge Time": "1 hour 15 mins via 100W USB-C input",
      "Display": "TFT Full-Color Smart Digital Display with Active Power Metrics",
      "Safety": "ActiveShield 2.0 temperature monitoring 3 million times daily",
      "Weight": "540 grams"
    },
    features: [
      "Simultaneously charge a 16\" MacBook Pro and an iPad at full speed",
      "Smart digital display gives real-time stats for input, output, and health",
      "GaNPrime semiconductor efficiency reduces heat and size",
      "Compatible with charging base dock (sold separately)"
    ],
    variants: [
      { name: 'Standard Anker Prime Black', color: 'Midnight Black', storage: null, ram: null, price_delta: 0, stock: 60, sku: 'ANK-PRM-20K' }
    ]
  }
];

const insertProduct = db.prepare(`
  INSERT INTO products (
    name, slug, brand_id, category_id, short_description, description,
    price, original_price, discount_percent, stock, low_stock_threshold, sku,
    rating, review_count, is_featured, is_bestseller, is_flash_deal, deal_ends_at,
    warranty_months, return_days, images_json, specifications_json, features_json
  ) VALUES (
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?
  )
`);

const insertVariant = db.prepare(`
  INSERT INTO product_variants (
    product_id, variant_name, color, storage, ram, price_delta, stock, sku
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Map categories and brands to IDs
const categoryMap = {};
for (const row of db.prepare('SELECT id, name FROM categories').all()) {
  categoryMap[row.name] = row.id;
}

const brandMap = {};
for (const row of db.prepare('SELECT id, name FROM brands').all()) {
  brandMap[row.name] = row.id;
}

for (const p of products) {
  const brandId = brandMap[p.brand] || 1;
  const categoryId = categoryMap[p.category] || 1;

  const res = insertProduct.run(
    p.name,
    p.slug,
    brandId,
    categoryId,
    p.short_description,
    p.description,
    p.price,
    p.original_price,
    p.discount_percent,
    p.stock,
    p.low_stock_threshold,
    p.sku,
    p.rating,
    p.review_count,
    p.is_featured,
    p.is_bestseller,
    p.is_flash_deal,
    p.deal_ends_at,
    p.warranty_months,
    p.return_days,
    JSON.stringify(p.images),
    JSON.stringify(p.specifications),
    JSON.stringify(p.features)
  );

  const productId = res.lastInsertRowid;

  if (p.variants && p.variants.length > 0) {
    for (const v of p.variants) {
      insertVariant.run(
        productId,
        v.name,
        v.color,
        v.storage,
        v.ram,
        v.price_delta,
        v.stock,
        v.sku
      );
    }
  }
}

// 5. Coupons
const coupons = [
  { code: 'TECH10', discount_type: 'percentage', discount_value: 10, min_purchase: 1000, max_discount: 5000, usage_limit: 500 },
  { code: 'SAVE500', discount_type: 'flat', discount_value: 500, min_purchase: 3000, max_discount: 500, usage_limit: 1000 },
  { code: 'WELCOME20', discount_type: 'percentage', discount_value: 20, min_purchase: 2000, max_discount: 2000, usage_limit: 200 },
  { code: 'SUPERDEAL', discount_type: 'percentage', discount_value: 15, min_purchase: 10000, max_discount: 10000, usage_limit: 100 }
];

const insertCoupon = db.prepare(`
  INSERT INTO coupons (code, discount_type, discount_value, min_purchase, max_discount, usage_limit)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const c of coupons) {
  insertCoupon.run(c.code, c.discount_type, c.discount_value, c.min_purchase, c.max_discount, c.usage_limit);
}

// 6. User Addresses
const insertAddress = db.prepare(`
  INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, pincode, is_default, address_type)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertAddress.run(2, 'Alex Morgan', '+91 9123456780', 'Flat 402, Skyline Towers, Cyber City', 'Bengaluru', 'Karnataka', '560103', 1, 'home');
insertAddress.run(2, 'Alex Morgan', '+91 9123456780', 'TechnoPark Phase 2, Whitefield', 'Bengaluru', 'Karnataka', '560066', 0, 'work');

// 7. Reviews
const insertReview = db.prepare(`
  INSERT INTO reviews (product_id, user_id, rating, title, comment, helpful_votes, is_verified_buyer)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

insertReview.run(1, 2, 5, 'Unmatched performance and build quality!', 'The titanium build feels so light yet durable in hand compared to stainless steel. The 5x camera produces stellar portraits. Battery lasts comfortably through an entire 24h day of intensive work.', 24, 1);
insertReview.run(1, 3, 5, 'Worth every penny for creative professionals', 'The log video recording directly to external SSD is a game changer for content creation. Best smartphone on the planet right now.', 18, 1);
insertReview.run(3, 2, 5, 'Absolute beast of a machine', 'The M3 Max compiles huge codebases in seconds without the fans even kicking in. The XDR screen is breathtaking for photo and video editing.', 31, 1);
insertReview.run(5, 3, 5, 'Best ANC on the market hands down', 'I travel by flight weekly and these headphones eliminate engine rumble completely. Sound signature is balanced and rich.', 42, 1);

// 8. Sample Completed Orders
const insertOrder = db.prepare(`
  INSERT INTO orders (
    order_number, user_id, subtotal, discount_amount, coupon_code,
    shipping_fee, tax_amount, total_amount, status, shipping_address_json,
    shipping_method, payment_method, payment_status, estimated_delivery_date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertOrderItem = db.prepare(`
  INSERT INTO order_items (
    order_id, product_id, variant_id, product_name, product_image, variant_name, price, quantity, subtotal
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Order 1: Delivered
const order1Addr = JSON.stringify({
  fullName: 'Alex Morgan',
  phone: '+91 9123456780',
  addressLine: 'Flat 402, Skyline Towers, Cyber City',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560103'
});

const o1 = insertOrder.run(
  'TN-2026-90412',
  2,
  29990,
  2999,
  'TECH10',
  0,
  4858,
  31849,
  'delivered',
  order1Addr,
  'standard',
  'Credit Card',
  'completed',
  new Date(Date.now() - 86400000 * 5).toISOString()
);

insertOrderItem.run(
  o1.lastInsertRowid,
  5,
  null,
  'Sony WH-1000XM5 Wireless Headphones',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  'Black',
  29990,
  1,
  29990
);

// Order 2: Shipped / In Transit
const o2 = insertOrder.run(
  'TN-2026-98124',
  2,
  134900,
  5000,
  'TECH10',
  0,
  23382,
  153282,
  'shipped',
  order1Addr,
  'express',
  'UPI',
  'completed',
  new Date(Date.now() + 86400000 * 2).toISOString()
);

insertOrderItem.run(
  o2.lastInsertRowid,
  1,
  1,
  'Apple iPhone 15 Pro Max',
  'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
  'Natural Titanium / 256GB',
  134900,
  1,
  134900
);

console.log('✅ TECHNOVA Database Seeding Completed Successfully!');
console.log('   👤 Admin User: admin@technova.com / Admin@123');
console.log('   👤 Demo User:  demo@technova.com  / User@123');
console.log('   📦 Seeded Categories, Brands, Products, Variants, Coupons, and Sample Orders.');
