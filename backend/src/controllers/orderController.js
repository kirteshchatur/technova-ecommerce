import db from '../config/db.js';

export const createOrder = (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      shippingMethod = 'standard',
      paymentMethod = 'UPI',
      couponCode,
      notes
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Complete delivery address is required.' });
    }

    // Begin database transaction
    const executeOrder = db.transaction(() => {
      let subtotal = 0;
      const verifiedItems = [];

      for (const item of items) {
        const product = db.prepare('SELECT id, name, price, stock, images_json FROM products WHERE id = ?').get(item.productId);
        if (!product) {
          throw new Error(`Product ${item.name || item.productId} is no longer available.`);
        }

        let itemPrice = product.price;
        let variantName = null;

        if (item.variantId) {
          const variant = db.prepare('SELECT id, variant_name, price_delta, stock FROM product_variants WHERE id = ? AND product_id = ?').get(item.variantId, product.id);
          if (!variant) {
            throw new Error(`Selected variant is unavailable.`);
          }
          if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name} (${variant.variant_name}). Only ${variant.stock} available.`);
          }
          itemPrice += variant.price_delta;
          variantName = variant.variant_name;

          // Decrement variant stock
          db.prepare('UPDATE product_variants SET stock = stock - ? WHERE id = ?').run(item.quantity, variant.id);
        } else {
          if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} available.`);
          }
        }

        // Decrement product base stock
        db.prepare('UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(item.quantity, product.id);

        const images = JSON.parse(product.images_json || '[]');
        const lineTotal = itemPrice * item.quantity;
        subtotal += lineTotal;

        verifiedItems.push({
          productId: product.id,
          variantId: item.variantId || null,
          productName: product.name,
          productImage: images[0] || null,
          variantName,
          price: itemPrice,
          quantity: item.quantity,
          subtotal: lineTotal
        });
      }

      // Calculate coupon discount
      let discountAmount = 0;
      if (couponCode) {
        const coupon = db.prepare('SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1').get(couponCode.trim());
        if (coupon && subtotal >= coupon.min_purchase) {
          if (coupon.discount_type === 'percentage') {
            discountAmount = (subtotal * coupon.discount_value) / 100;
            if (coupon.max_discount && discountAmount > coupon.max_discount) {
              discountAmount = coupon.max_discount;
            }
          } else {
            discountAmount = coupon.discount_value;
          }
          discountAmount = Math.min(discountAmount, subtotal);
          db.prepare('UPDATE coupons SET times_used = times_used + 1 WHERE id = ?').run(coupon.id);
        }
      }

      const shippingFee = shippingMethod === 'express' ? 150 : (subtotal >= 1000 ? 0 : 99);
      const taxableAmount = Math.max(0, subtotal - discountAmount);
      const taxAmount = Math.round(taxableAmount * 0.18); // 18% standard GST on electronics
      const totalAmount = taxableAmount + shippingFee + taxAmount;

      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `TN-${new Date().getFullYear()}-${randomSuffix}`;

      // Estimated delivery date: 2 days for express, 5 days for standard
      const deliveryDays = shippingMethod === 'express' ? 2 : 5;
      const estimatedDelivery = new Date(Date.now() + deliveryDays * 86400000).toISOString();

      const insertOrderStmt = db.prepare(`
        INSERT INTO orders (
          order_number, user_id, subtotal, discount_amount, coupon_code,
          shipping_fee, tax_amount, total_amount, status, shipping_address_json,
          shipping_method, payment_method, payment_status, estimated_delivery_date, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, 'completed', ?, ?)
      `);

      const orderResult = insertOrderStmt.run(
        orderNumber,
        req.user.id,
        subtotal,
        Math.round(discountAmount),
        couponCode || null,
        shippingFee,
        taxAmount,
        totalAmount,
        JSON.stringify(shippingAddress),
        shippingMethod,
        paymentMethod,
        estimatedDelivery,
        notes || null
      );

      const orderId = orderResult.lastInsertRowid;

      // Insert order items
      const insertItemStmt = db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, variant_id, product_name, product_image, variant_name, price, quantity, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of verifiedItems) {
        insertItemStmt.run(
          orderId,
          item.productId,
          item.variantId,
          item.productName,
          item.productImage,
          item.variantName,
          item.price,
          item.quantity,
          item.subtotal
        );
      }

      // Clear user cart
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(req.user.id);

      return {
        orderId,
        orderNumber,
        subtotal,
        discountAmount: Math.round(discountAmount),
        shippingFee,
        taxAmount,
        totalAmount,
        estimatedDelivery,
        itemCount: verifiedItems.length
      };
    });

    const orderSummary = executeOrder();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: orderSummary
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserOrders = (req, res, next) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC
    `).all(req.user.id);

    const formattedOrders = orders.map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return {
        ...order,
        shippingAddress: JSON.parse(order.shipping_address_json || '{}'),
        items
      };
    });

    res.json({ success: true, orders: formattedOrders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = (req, res, next) => {
  try {
    const { id } = req.params;

    const order = db.prepare(`
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE (o.id = ? OR o.order_number = ?) AND (o.user_id = ? OR ? = 'admin')
    `).get(id, id, req.user.id, req.user.role);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

    res.json({
      success: true,
      order: {
        ...order,
        shippingAddress: JSON.parse(order.shipping_address_json || '{}'),
        items
      }
    });
  } catch (error) {
    next(error);
  }
};

export const trackOrder = (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = db.prepare(`
      SELECT id, order_number, status, created_at, estimated_delivery_date, shipping_method, total_amount
      FROM orders
      WHERE order_number = ?
    `).get(orderNumber);

    if (!order) {
      return res.status(404).json({ success: false, message: 'No shipment found with this tracking/order ID.' });
    }

    const items = db.prepare('SELECT product_name, product_image, quantity FROM order_items WHERE order_id = ?').all(order.id);

    // Compute progress timeline steps
    const statusOrder = ['ordered', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
    const currentStepIndex = statusOrder.indexOf(order.status);

    const timeline = [
      { step: 'ordered', label: 'Order Placed', time: order.created_at, completed: currentStepIndex >= 0 },
      { step: 'confirmed', label: 'Order Confirmed', time: order.created_at, completed: currentStepIndex >= 1 },
      { step: 'packed', label: 'Packed & Quality Checked', time: null, completed: currentStepIndex >= 2 },
      { step: 'shipped', label: 'Shipped with Courier', time: null, completed: currentStepIndex >= 3 },
      { step: 'out_for_delivery', label: 'Out for Delivery', time: null, completed: currentStepIndex >= 4 },
      { step: 'delivered', label: 'Delivered', time: order.status === 'delivered' ? order.estimated_delivery_date : null, completed: currentStepIndex >= 5 }
    ];

    res.json({
      success: true,
      tracking: {
        ...order,
        items,
        currentStep: order.status,
        timeline
      }
    });
  } catch (error) {
    next(error);
  }
};
