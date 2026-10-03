import db from '../config/db.js';

export const getCart = (req, res, next) => {
  try {
    const items = db.prepare(`
      SELECT 
        ci.id,
        ci.product_id,
        ci.variant_id,
        ci.quantity,
        p.name as product_name,
        p.slug as product_slug,
        p.price as base_price,
        p.original_price,
        p.stock as product_stock,
        p.images_json,
        pv.variant_name,
        pv.price_delta,
        pv.stock as variant_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants pv ON ci.variant_id = pv.id
      WHERE ci.user_id = ?
      ORDER BY ci.id DESC
    `).all(req.user.id);

    const formatted = items.map(item => {
      const price = item.base_price + (item.price_delta || 0);
      const images = JSON.parse(item.images_json || '[]');
      const maxStock = item.variant_id ? item.variant_stock : item.product_stock;
      return {
        id: item.id,
        productId: item.product_id,
        variantId: item.variant_id,
        name: item.product_name,
        slug: item.product_slug,
        variantName: item.variant_name,
        price,
        originalPrice: item.original_price,
        image: images[0] || null,
        quantity: item.quantity,
        maxStock: maxStock || 0,
        subtotal: price * item.quantity
      };
    });

    const subtotal = formatted.reduce((acc, curr) => acc + curr.subtotal, 0);

    res.json({
      success: true,
      items: formatted,
      subtotal,
      itemCount: formatted.reduce((acc, curr) => acc + curr.quantity, 0)
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = (req, res, next) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const product = db.prepare('SELECT id, stock FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Check variant stock if specified
    if (variantId) {
      const variant = db.prepare('SELECT id, stock FROM product_variants WHERE id = ? AND product_id = ?').get(variantId, productId);
      if (!variant) {
        return res.status(404).json({ success: false, message: 'Variant not found.' });
      }
      if (variant.stock < quantity) {
        return res.status(400).json({ success: false, message: 'Not enough variant stock available.' });
      }
    } else {
      if (product.stock < quantity) {
        return res.status(400).json({ success: false, message: 'Not enough product stock available.' });
      }
    }

    // Check if already in cart
    const existing = db.prepare(`
      SELECT id, quantity FROM cart_items 
      WHERE user_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))
    `).get(req.user.id, productId, variantId || null, variantId || null);

    if (existing) {
      const newQty = existing.quantity + quantity;
      db.prepare('UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newQty, existing.id);
    } else {
      db.prepare(`
        INSERT INTO cart_items (user_id, product_id, variant_id, quantity)
        VALUES (?, ?, ?, ?)
      `).run(req.user.id, productId, variantId || null, quantity);
    }

    res.json({ success: true, message: 'Added to cart!' });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(id, req.user.id);
      return res.json({ success: true, message: 'Item removed from cart.' });
    }

    db.prepare('UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?')
      .run(quantity, id, req.user.id);

    res.json({ success: true, message: 'Cart updated.' });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = (req, res, next) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(id, req.user.id);
    res.json({ success: true, message: 'Item removed from cart.' });
  } catch (error) {
    next(error);
  }
};

export const clearCart = (req, res, next) => {
  try {
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    next(error);
  }
};
