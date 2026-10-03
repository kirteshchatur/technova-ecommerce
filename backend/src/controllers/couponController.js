import db from '../config/db.js';

export const validateCoupon = (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code.' });
    }

    const coupon = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1').get(code.trim());

    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired.' });
    }

    if (coupon.times_used >= coupon.usage_limit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached.' });
    }

    const orderAmount = parseFloat(subtotal) || 0;
    if (orderAmount < coupon.min_purchase) {
      return res.status(400).json({
        success: false,
        message: `Coupon requires a minimum order value of ₹${coupon.min_purchase.toLocaleString('en-IN')}.`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (orderAmount * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }

    discount = Math.min(discount, orderAmount);

    res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        discountAmount: Math.round(discount)
      }
    });
  } catch (error) {
    next(error);
  }
};
