import db from '../config/db.js';

export const getProducts = (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      isDeal,
      sort = 'relevance',
      page = 1,
      limit = 12
    } = req.query;

    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN brands b ON p.brand_id = b.id
      WHERE 1=1
    `;
    const params = [];

    // Search filter across product name, brand, category, keywords
    if (search && search.trim()) {
      query += ` AND (
        p.name LIKE ? OR 
        b.name LIKE ? OR 
        c.name LIKE ? OR 
        p.short_description LIKE ?
      )`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    // Category filter (slug or id)
    if (category) {
      if (isNaN(category)) {
        query += ` AND c.slug = ?`;
        params.push(category);
      } else {
        query += ` AND p.category_id = ?`;
        params.push(parseInt(category));
      }
    }

    // Brand filter (slug or id or comma-separated)
    if (brand) {
      const brandsList = brand.split(',').map(b => b.trim());
      if (brandsList.length === 1) {
        query += ` AND b.slug = ?`;
        params.push(brandsList[0]);
      } else {
        const placeholders = brandsList.map(() => '?').join(',');
        query += ` AND b.slug IN (${placeholders})`;
        params.push(...brandsList);
      }
    }

    // Price range
    if (minPrice) {
      query += ` AND p.price >= ?`;
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ` AND p.price <= ?`;
      params.push(parseFloat(maxPrice));
    }

    // Rating filter
    if (rating) {
      query += ` AND p.rating >= ?`;
      params.push(parseFloat(rating));
    }

    // Stock availability
    if (inStock === 'true' || inStock === '1') {
      query += ` AND p.stock > 0`;
    }

    // Flash deals
    if (isDeal === 'true' || isDeal === '1') {
      query += ` AND p.is_flash_deal = 1`;
    }

    // Total count before pagination
    const countSql = `SELECT COUNT(*) as total FROM (${query})`;
    const totalCount = db.prepare(countSql).get(...params).total;

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ` ORDER BY p.price ASC`;
        break;
      case 'price_desc':
        query += ` ORDER BY p.price DESC`;
        break;
      case 'rating':
        query += ` ORDER BY p.rating DESC, p.review_count DESC`;
        break;
      case 'newest':
        query += ` ORDER BY p.created_at DESC`;
        break;
      case 'bestseller':
        query += ` ORDER BY p.is_bestseller DESC, p.review_count DESC`;
        break;
      case 'discount':
        query += ` ORDER BY p.discount_percent DESC`;
        break;
      case 'relevance':
      default:
        query += ` ORDER BY p.is_featured DESC, p.rating DESC, p.id DESC`;
        break;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    query += ` LIMIT ? OFFSET ?`;
    params.push(limitNum, offset);

    const rows = db.prepare(query).all(...params);

    const formattedProducts = rows.map(p => ({
      ...p,
      images: JSON.parse(p.images_json || '[]'),
      specifications: JSON.parse(p.specifications_json || '{}'),
      features: JSON.parse(p.features_json || '[]'),
    }));

    res.json({
      success: true,
      products: formattedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlugOrId = (req, res, next) => {
  try {
    const { slugOrId } = req.params;

    let product;
    if (!isNaN(slugOrId)) {
      product = db.prepare(`
        SELECT p.*, c.name as category_name, c.slug as category_slug, b.name as brand_name, b.slug as brand_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN brands b ON p.brand_id = b.id
        WHERE p.id = ?
      `).get(parseInt(slugOrId));
    } else {
      product = db.prepare(`
        SELECT p.*, c.name as category_name, c.slug as category_slug, b.name as brand_name, b.slug as brand_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN brands b ON p.brand_id = b.id
        WHERE p.slug = ?
      `).get(slugOrId);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all(product.id);

    // Fetch related products in same category
    const relatedRows = db.prepare(`
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN brands b ON p.brand_id = b.id
      WHERE p.category_id = ? AND p.id != ?
      LIMIT 4
    `).all(product.category_id, product.id);

    const relatedProducts = relatedRows.map(r => ({
      ...r,
      images: JSON.parse(r.images_json || '[]')
    }));

    res.json({
      success: true,
      product: {
        ...product,
        images: JSON.parse(product.images_json || '[]'),
        specifications: JSON.parse(product.specifications_json || '{}'),
        features: JSON.parse(product.features_json || '[]'),
        variants
      },
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

export const getSearchSuggestions = (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, suggestions: [], popular: ['iPhone 15 Pro', 'Sony WH-1000XM5', 'MacBook Pro', 'PlayStation 5', 'OLED TV'] });
    }

    const term = `%${q.trim()}%`;
    const products = db.prepare(`
      SELECT id, name, slug, price, original_price, images_json, rating
      FROM products
      WHERE name LIKE ? OR sku LIKE ?
      LIMIT 5
    `).all(term, term);

    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      original_price: p.original_price,
      image: JSON.parse(p.images_json || '[]')[0] || null,
      rating: p.rating
    }));

    const categories = db.prepare('SELECT id, name, slug FROM categories WHERE name LIKE ? LIMIT 3').all(term);
    const brands = db.prepare('SELECT id, name, slug FROM brands WHERE name LIKE ? LIMIT 3').all(term);

    res.json({
      success: true,
      suggestions: {
        products: formatted,
        categories,
        brands
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = (req, res, next) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.is_featured DESC, c.name ASC
    `).all();
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const getBrands = (req, res, next) => {
  try {
    const brands = db.prepare(`
      SELECT b.*, COUNT(p.id) as product_count
      FROM brands b
      LEFT JOIN products p ON b.id = p.brand_id
      GROUP BY b.id
      ORDER BY product_count DESC, b.name ASC
    `).all();
    res.json({ success: true, brands });
  } catch (error) {
    next(error);
  }
};

export const getFlashDeals = (req, res, next) => {
  try {
    const deals = db.prepare(`
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN brands b ON p.brand_id = b.id
      WHERE p.is_flash_deal = 1
      ORDER BY p.discount_percent DESC
      LIMIT 8
    `).all();

    res.json({
      success: true,
      deals: deals.map(p => ({
        ...p,
        images: JSON.parse(p.images_json || '[]')
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getSectionProducts = (req, res, next) => {
  try {
    const { type } = req.params; // 'bestsellers', 'new-arrivals', 'featured'

    let whereClause = '1=1';
    let orderClause = 'p.rating DESC';

    if (type === 'bestsellers') {
      whereClause = 'p.is_bestseller = 1';
      orderClause = 'p.review_count DESC';
    } else if (type === 'new-arrivals') {
      orderClause = 'p.created_at DESC';
    } else if (type === 'featured') {
      whereClause = 'p.is_featured = 1';
      orderClause = 'p.rating DESC';
    }

    const rows = db.prepare(`
      SELECT p.*, c.name as category_name, b.name as brand_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN brands b ON p.brand_id = b.id
      WHERE ${whereClause}
      ORDER BY ${orderClause}
      LIMIT 8
    `).all();

    res.json({
      success: true,
      products: rows.map(p => ({
        ...p,
        images: JSON.parse(p.images_json || '[]')
      }))
    });
  } catch (error) {
    next(error);
  }
};
