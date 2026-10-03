const API_BASE_URL = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('technova_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.message || `Request failed with status ${res.status}`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  updatePassword: (data) => request('/auth/password', { method: 'PUT', body: JSON.stringify(data) }),
  getAddresses: () => request('/auth/addresses'),
  saveAddress: (data) => request('/auth/addresses', { method: 'POST', body: JSON.stringify(data) }),
  deleteAddress: (id) => request(`/auth/addresses/${id}`, { method: 'DELETE' }),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return request(`/products?${query.toString()}`);
  },
  getProductBySlugOrId: (slugOrId) => request(`/products/${slugOrId}`),
  getCategories: () => request('/products/meta/categories'),
  getBrands: () => request('/products/meta/brands'),
  getSearchSuggestions: (q) => request(`/products/search/suggestions?q=${encodeURIComponent(q)}`),
  getFlashDeals: () => request('/products/section/deals'),
  getSectionProducts: (type) => request(`/products/section/${type}`),

  // Cart
  getCart: () => request('/cart'),
  addToCart: (productId, variantId, quantity = 1) => request('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, variantId, quantity })
  }),
  updateCartItem: (id, quantity) => request(`/cart/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  }),
  removeCartItem: (id) => request(`/cart/${id}`, { method: 'DELETE' }),
  clearCart: () => request('/cart', { method: 'DELETE' }),

  // Wishlist
  getWishlist: () => request('/wishlist'),
  toggleWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'POST' }),
  removeFromWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),

  // Coupons
  validateCoupon: (code, subtotal) => request('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal })
  }),

  // Orders
  createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getUserOrders: () => request('/orders'),
  getOrderById: (id) => request(`/orders/${id}`),
  trackOrder: (orderNumber) => request(`/orders/track/${orderNumber}`),

  // Reviews
  getProductReviews: (productId) => request(`/reviews/products/${productId}/reviews`),
  addReview: (productId, reviewData) => request(`/reviews/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData)
  }),
  markHelpful: (reviewId) => request(`/reviews/reviews/${reviewId}/helpful`, { method: 'POST' }),

  // Admin
  getAdminMetrics: () => request('/admin/metrics'),
  getAdminProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/products?${q}`);
  },
  createProduct: (data) => request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  getAdminOrders: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/orders?${q}`);
  },
  updateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  getAdminInventory: () => request('/admin/inventory'),
  updateStock: (id, stock, low_stock_threshold) => request(`/admin/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ stock, low_stock_threshold })
  }),
  getAdminCustomers: () => request('/admin/customers'),
  getAdminCoupons: () => request('/admin/coupons'),
  createAdminCoupon: (data) => request('/admin/coupons', { method: 'POST', body: JSON.stringify(data) }),
  toggleAdminCoupon: (id) => request(`/admin/coupons/${id}/toggle`, { method: 'PUT' })
};

export default api;
