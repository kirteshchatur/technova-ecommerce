import db from '../config/db.js';

export const getProductReviews = (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = db.prepare(`
      SELECT r.*, u.name as author_name, u.avatar_url as author_avatar
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.helpful_votes DESC, r.created_at DESC
    `).all(productId);

    // Calculate rating distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalScore = 0;

    reviews.forEach(r => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      totalScore += r.rating;
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews ? Number((totalScore / totalReviews).toFixed(1)) : 0;

    res.json({
      success: true,
      reviews,
      summary: {
        totalReviews,
        averageRating,
        distribution
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    if (!rating || !title || !comment) {
      return res.status(400).json({ success: false, message: 'Rating, review title, and comments are required.' });
    }

    const numRating = parseInt(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    const insert = db.prepare(`
      INSERT INTO reviews (product_id, user_id, rating, title, comment, helpful_votes, is_verified_buyer)
      VALUES (?, ?, ?, ?, ?, 0, 1)
    `);

    insert.run(productId, req.user.id, numRating, title.trim(), comment.trim());

    // Update product rating and review count
    const stats = db.prepare(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as count 
      FROM reviews WHERE product_id = ?
    `).get(productId);

    db.prepare(`
      UPDATE products 
      SET rating = ?, review_count = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(Number(stats.avg_rating.toFixed(1)), stats.count, productId);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your verified review has been published.'
    });
  } catch (error) {
    next(error);
  }
};

export const markHelpful = (req, res, next) => {
  try {
    const { reviewId } = req.params;
    db.prepare('UPDATE reviews SET helpful_votes = helpful_votes + 1 WHERE id = ?').run(reviewId);
    res.json({ success: true, message: 'Marked as helpful.' });
  } catch (error) {
    next(error);
  }
};
