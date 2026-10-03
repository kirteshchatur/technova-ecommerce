import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, AlertTriangle, 
  TrendingUp, Plus, Edit2, Trash2, CheckCircle2, X, Search, 
  Filter, Tag, BarChart3, ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'inventory' | 'customers' | 'coupons'
  const [loading, setLoading] = useState(true);

  // Data states
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Modals & forms
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    brand_id: 1,
    category_id: 1,
    price: '',
    original_price: '',
    discount_percent: 0,
    stock: 10,
    low_stock_threshold: 5,
    sku: '',
    short_description: '',
    description: '',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'],
    specifications: { "Warranty": "12 Months", "Type": "Electronics" },
    features: ['High-performance build', 'Energy efficient']
  });

  // Coupons form
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 10,
    min_purchase: 1000,
    max_discount: 2000,
    usage_limit: 500
  });

  useEffect(() => {
    if (!isAdmin) {
      addToast('Admin access required.', 'error');
      navigate('/');
      return;
    }
    loadAllData();
  }, [isAdmin]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [metRes, catRes, brRes] = await Promise.all([
        api.getAdminMetrics(),
        api.getCategories(),
        api.getBrands()
      ]);

      if (metRes.success) setMetrics(metRes.metrics);
      if (catRes.success) setCategories(catRes.categories);
      if (brRes.success) setBrands(brRes.brands);
    } catch (err) {
      console.error(err);
      addToast('Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    const res = await api.getAdminProducts({ limit: 50 });
    if (res.success) setProducts(res.products);
  };

  const loadOrders = async () => {
    const res = await api.getAdminOrders();
    if (res.success) setOrders(res.orders);
  };

  const loadInventory = async () => {
    const res = await api.getAdminInventory();
    if (res.success) setInventory(res.inventory);
  };

  const loadCustomers = async () => {
    const res = await api.getAdminCustomers();
    if (res.success) setCustomers(res.customers);
  };

  const loadCoupons = async () => {
    const res = await api.getAdminCoupons();
    if (res.success) setCoupons(res.coupons);
  };

  // Switch tab handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'products') loadProducts();
    if (tab === 'orders') loadOrders();
    if (tab === 'inventory') loadInventory();
    if (tab === 'customers') loadCustomers();
    if (tab === 'coupons') loadCoupons();
    if (tab === 'overview') loadAllData();
  };

  // Product CRUD
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productForm);
        addToast('Product updated successfully!');
      } else {
        await api.createProduct(productForm);
        addToast('New product published successfully!');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      loadProducts();
      loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        addToast('Product removed.');
        loadProducts();
        loadAllData();
      } catch (err) {
        addToast(err.message, 'error');
      }
    }
  };

  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      brand_id: p.brand_id,
      category_id: p.category_id,
      price: p.price,
      original_price: p.original_price,
      discount_percent: p.discount_percent,
      stock: p.stock,
      low_stock_threshold: p.low_stock_threshold,
      sku: p.sku,
      short_description: p.short_description,
      description: p.description,
      images: p.images || [],
      specifications: p.specifications || {},
      features: p.features || []
    });
    setShowProductModal(true);
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      addToast(`Order status updated to '${newStatus}'`);
      loadOrders();
      loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Stock update
  const handleUpdateStock = async (id, stock) => {
    try {
      await api.updateStock(id, stock);
      addToast('Inventory count updated.');
      loadInventory();
      loadAllData();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Coupon create
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.createAdminCoupon(couponForm);
      addToast('Coupon created!');
      setShowCouponModal(false);
      loadCoupons();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      await api.toggleAdminCoupon(id);
      loadCoupons();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading && !metrics) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Management Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            TECHNOVA Admin Center
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Real-time analytics, inventory management, customer orders, and catalog operations.
          </p>
        </div>

        {activeTab === 'products' && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setProductForm({
                name: '',
                brand_id: 1,
                category_id: 1,
                price: '',
                original_price: '',
                discount_percent: 0,
                stock: 10,
                low_stock_threshold: 5,
                sku: 'TN-' + Math.floor(1000 + Math.random() * 9000),
                short_description: '',
                description: '',
                images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'],
                specifications: { "Type": "Electronics" },
                features: ['Premium build quality']
              });
              setShowProductModal(true);
            }}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        )}

        {activeTab === 'coupons' && (
          <button
            onClick={() => setShowCouponModal(true)}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-800 gap-2 overflow-x-auto text-xs sm:text-sm font-bold">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'products', label: 'Catalog Products', icon: Package },
          { id: 'inventory', label: 'Inventory Monitor', icon: AlertTriangle },
          { id: 'orders', label: 'Orders & Shipments', icon: ShoppingCart },
          { id: 'customers', label: 'Customer Base', icon: Users },
          { id: 'coupons', label: 'Discount Coupons', icon: Tag }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`flex items-center gap-2 py-3 px-5 border-b-2 -mb-px transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-brand-50/20 dark:bg-brand-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sales Revenue</span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                ₹{metrics.totalRevenue?.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% from last week
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Orders</span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {metrics.totalOrders}
              </p>
              <p className="text-xs text-brand-600 font-bold">
                {metrics.pendingOrders} awaiting fulfillment
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Customers</span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                {metrics.totalCustomers}
              </p>
              <p className="text-xs text-gray-500">Registered member profiles</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Low Stock Warnings</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-500">
                {metrics.lowStockProducts}
              </p>
              <p className="text-xs text-amber-600 font-semibold">SKUs below alert threshold</p>
            </div>
          </div>

          {/* Visual Recharts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sales Trend (7 cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-brand-600" /> 7-Day Revenue Trend (₹)
                  </h3>
                  <p className="text-xs text-gray-400">Daily gross electronic sales</p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.salesTrend}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stop-color="#0284c7" stop-opacity={0.3} />
                        <stop offset="95%" stop-color="#0284c7" stop-opacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Revenue Distribution (5 cols) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Revenue by Category</h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.categorySales?.filter(c => c.revenue > 0)}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {metrics.categorySales?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Recent Customer Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 uppercase tracking-wider font-bold">
                    <th className="pb-3">Order #</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {metrics.recentOrders?.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-mono font-bold text-brand-600 dark:text-brand-400">{o.order_number}</td>
                      <td className="py-3 font-medium text-gray-900 dark:text-white">{o.customer_name}</td>
                      <td className="py-3 font-bold">₹{o.total_amount?.toLocaleString('en-IN')}</td>
                      <td className="py-3 text-gray-500">{o.payment_method}</td>
                      <td className="py-3">
                        <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 font-mono">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Item</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Brand</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Stock</th>
                  <th className="pb-3">SKU</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 flex items-center gap-3">
                      <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 object-contain rounded-lg bg-gray-50 dark:bg-slate-800 p-1" />
                      <span className="font-bold text-gray-900 dark:text-white max-w-xs truncate">{p.name}</span>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-slate-300">{p.category_name}</td>
                    <td className="py-3 font-semibold text-brand-600">{p.brand_name}</td>
                    <td className="py-3 font-bold">₹{p.price.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        p.stock <= p.low_stock_threshold ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 font-mono text-gray-400">{p.sku}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 text-gray-500 hover:text-brand-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY */}
      {activeTab === 'inventory' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-gray-900 dark:text-white">Real-Time Stock Monitoring</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Product Name</th>
                  <th className="pb-3">SKU</th>
                  <th className="pb-3">Units Sold</th>
                  <th className="pb-3">Available Stock</th>
                  <th className="pb-3">Threshold</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {inventory.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-gray-900 dark:text-white max-w-xs truncate">{item.name}</td>
                    <td className="py-3 font-mono text-gray-400">{item.sku}</td>
                    <td className="py-3 font-semibold">{item.units_sold} units</td>
                    <td className="py-3 font-black text-sm">{item.stock}</td>
                    <td className="py-3 text-gray-400">{item.low_stock_threshold}</td>
                    <td className="py-3">
                      {item.stock <= item.low_stock_threshold ? (
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          ⚠️ LOW STOCK
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                          HEALTHY
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateStock(item.id, Math.max(0, item.stock - 5))}
                          className="px-2 py-1 bg-gray-100 dark:bg-slate-800 rounded font-bold hover:bg-gray-200"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleUpdateStock(item.id, item.stock + 10)}
                          className="px-2 py-1 bg-gray-100 dark:bg-slate-800 rounded font-bold hover:bg-gray-200"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-gray-900 dark:text-white">Customer Order Management</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Delivery City</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-brand-600 dark:text-brand-400">{o.order_number}</td>
                    <td className="py-3">
                      <p className="font-bold text-gray-900 dark:text-white">{o.customer_name}</p>
                      <p className="text-[10px] text-gray-400">{o.customer_email}</p>
                    </td>
                    <td className="py-3 font-semibold">{o.items?.length || 1} items</td>
                    <td className="py-3 font-extrabold">₹{o.total_amount?.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-gray-500">{o.shippingAddress?.city || 'Bengaluru'}</td>
                    <td className="py-3">{o.payment_method}</td>
                    <td className="py-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="px-2 py-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                      >
                        <option value="ordered">Ordered</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-gray-900 dark:text-white">Registered Customer Profiles</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Total Orders</th>
                  <th className="pb-3">Lifetime Spend</th>
                  <th className="pb-3">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-gray-900 dark:text-white">{c.name}</td>
                    <td className="py-3 text-gray-500">{c.email}</td>
                    <td className="py-3 text-gray-500 font-mono">{c.phone || '—'}</td>
                    <td className="py-3 font-bold">{c.order_count} orders</td>
                    <td className="py-3 font-extrabold text-emerald-600">₹{c.total_spent?.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-gray-400 font-mono">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-gray-900 dark:text-white">Discount Coupons</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 uppercase tracking-wider font-bold">
                  <th className="pb-3">Code</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Value</th>
                  <th className="pb-3">Min Order</th>
                  <th className="pb-3">Times Used</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {coupons.map(cp => (
                  <tr key={cp.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-brand-600 text-sm">{cp.code}</td>
                    <td className="py-3 capitalize text-gray-600 dark:text-slate-300">{cp.discount_type}</td>
                    <td className="py-3 font-extrabold">{cp.discount_type === 'percentage' ? `${cp.discount_value}%` : `₹${cp.discount_value}`}</td>
                    <td className="py-3">₹{cp.min_purchase}</td>
                    <td className="py-3">{cp.times_used} / {cp.usage_limit}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        cp.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {cp.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleToggleCoupon(cp.id)}
                        className="text-xs font-bold text-brand-600 hover:underline"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b dark:border-slate-800">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Product Details' : 'Add New Electronics Product'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="p-1 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Brand</label>
                  <select
                    value={productForm.brand_id}
                    onChange={(e) => setProductForm(p => ({ ...p, brand_id: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm(p => ({ ...p, category_id: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm(p => ({ ...p, price: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.original_price}
                    onChange={(e) => setProductForm(p => ({ ...p, original_price: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm(p => ({ ...p, stock: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">SKU Code</label>
                <input
                  type="text"
                  required
                  value={productForm.sku}
                  onChange={(e) => setProductForm(p => ({ ...p, sku: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.images[0] || ''}
                  onChange={(e) => setProductForm(p => ({ ...p, images: [e.target.value] }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  required
                  value={productForm.short_description}
                  onChange={(e) => setProductForm(p => ({ ...p, short_description: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2 text-xs font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Create Promo Code</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Code (e.g. SUMMER15)"
                value={couponForm.code}
                onChange={(e) => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={couponForm.discount_type}
                  onChange={(e) => setCouponForm(p => ({ ...p, discount_type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="Discount Value"
                  value={couponForm.discount_value}
                  onChange={(e) => setCouponForm(p => ({ ...p, discount_value: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
              </div>
              <input
                type="number"
                placeholder="Minimum Purchase (₹)"
                value={couponForm.min_purchase}
                onChange={(e) => setCouponForm(p => ({ ...p, min_purchase: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
