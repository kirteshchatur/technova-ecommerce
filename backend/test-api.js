import app from './src/server.js';
import db from './src/config/db.js';

async function runTests() {
  console.log('🧪 Starting Backend API Automated Verification...');

  // Start temporary server for testing
  const server = app.listen(5099, async () => {
    const baseUrl = 'http://localhost:5099/api';
    let passed = 0;
    let failed = 0;

    const assert = (condition, message) => {
      if (condition) {
        console.log(`  ✅ PASS: ${message}`);
        passed++;
      } else {
        console.error(`  ❌ FAIL: ${message}`);
        failed++;
      }
    };

    try {
      // 1. Health check
      const healthRes = await fetch(`${baseUrl}/health`).then(r => r.json());
      assert(healthRes.status === 'online', 'Health check returns online');

      // 2. Fetch products
      const productsRes = await fetch(`${baseUrl}/products?limit=5`).then(r => r.json());
      assert(productsRes.success && productsRes.products.length > 0, `Fetched ${productsRes.products?.length} products`);

      // 3. Search and filter
      const searchRes = await fetch(`${baseUrl}/products?search=Apple`).then(r => r.json());
      assert(searchRes.success && searchRes.products.length > 0, `Search for 'Apple' found ${searchRes.products?.length} products`);

      // 4. Suggestions
      const suggestRes = await fetch(`${baseUrl}/products/search/suggestions?q=iph`).then(r => r.json());
      assert(suggestRes.success && suggestRes.suggestions.products.length > 0, 'Suggestions returned matches for "iph"');

      // 5. Customer Login
      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@technova.com', password: 'User@123' })
      }).then(r => r.json());
      assert(loginRes.success && loginRes.token, 'Customer login succeeded with JWT token');
      const userToken = loginRes.token;

      // 6. Admin Login
      const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@technova.com', password: 'Admin@123' })
      }).then(r => r.json());
      assert(adminLoginRes.success && adminLoginRes.user.role === 'admin', 'Admin login succeeded with admin role');
      const adminToken = adminLoginRes.token;

      // 7. Add to Cart
      const addToCartRes = await fetch(`${baseUrl}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
        body: JSON.stringify({ productId: 1, quantity: 1, variantId: 1 })
      }).then(r => r.json());
      assert(addToCartRes.success, 'Added product to cart with variant');

      // 8. View Cart
      const cartRes = await fetch(`${baseUrl}/cart`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      }).then(r => r.json());
      assert(cartRes.success && cartRes.items.length > 0, `Cart contains ${cartRes.items?.length} items`);

      // 9. Validate Coupon
      const couponRes = await fetch(`${baseUrl}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'TECH10', subtotal: 10000 })
      }).then(r => r.json());
      assert(couponRes.success && couponRes.coupon.discountAmount === 1000, `Coupon TECH10 calculated ₹${couponRes.coupon?.discountAmount} discount`);

      // 10. Place Order
      const orderRes = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
        body: JSON.stringify({
          items: [{ productId: 1, variantId: 1, quantity: 1 }],
          shippingAddress: {
            fullName: 'Alex Morgan',
            phone: '+91 9123456780',
            addressLine: 'Flat 402, Skyline Towers',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560103'
          },
          shippingMethod: 'standard',
          paymentMethod: 'UPI',
          couponCode: 'TECH10'
        })
      }).then(r => r.json());
      assert(orderRes.success && orderRes.order.orderNumber, `Order placed successfully: ${orderRes.order?.orderNumber}`);

      // 11. Track Order
      const trackRes = await fetch(`${baseUrl}/orders/track/${orderRes.order.orderNumber}`).then(r => r.json());
      assert(trackRes.success && trackRes.tracking.timeline.length === 6, 'Order tracking timeline loaded');

      // 12. Admin Metrics
      const metricsRes = await fetch(`${baseUrl}/admin/metrics`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      }).then(r => r.json());
      assert(metricsRes.success && metricsRes.metrics.totalOrders > 0, `Admin metrics loaded (Total orders: ${metricsRes.metrics?.totalOrders})`);

      console.log(`\n🎉 Test Results: ${passed} Passed, ${failed} Failed`);
      server.close();
      process.exit(failed === 0 ? 0 : 1);
    } catch (err) {
      console.error('Test execution error:', err);
      server.close();
      process.exit(1);
    }
  });
}

runTests();
