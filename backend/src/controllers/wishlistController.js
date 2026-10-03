import db from '../config/db.js';

export const getWishlist = (req, res, next) => {
  try {
    const items = db.prepare(`
      SELECT 
        w.id as wishlist_id,
        p.*,
        c.name as category_name,
        b.name as brand_name
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN brands b ON p.brand_id = b.id
      WHERE w.user_id = ?
      ORDER BY w.id DESC
    `).all(req.user.id);

    const formatted = items.map(p => ({
      ...p,
      images: JSON.parse(p.images_json || '[]')
    }));

    res.json({ success: true, wishlist: formatted });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = (req, res, next) => {
  try {
    const { productId } = req.params;

    const existing = db.prepare('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?').get(req.user.id, productId);
    if (existing) {
      db.prepare('DELETE FROM wishlists WHERE id = ?').run(existing.id);
      return res.json({ success: true, inWishlist: false, message: 'Removed from wishlist.' });
    } else {
      db.prepare('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)').run(req.user.id, productId);
      return res.json({ success: true, inWishlist: true, message: 'Added to wishlist!' });
    }
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = (req, res, next) => {
  try {
    const { productId } = req.params;
    db.prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?').run(req.user.id, productId);
    res.json({ success: true, message: 'Removed from wishlist.' });
  } catch (error) {
    next(error);
  }
};
