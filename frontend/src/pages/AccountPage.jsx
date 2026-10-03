import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, Package, Heart, MapPin, Key, 
  Trash2, ShoppingCart, ExternalLink, Plus, Check 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import api from '../services/api.js';

export default function AccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const activeTab = searchParams.get('tab') || 'profile';

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar_url: user?.avatar_url || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password update state
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  // New address state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: 1,
    addressType: 'home'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'addresses') {
      loadAddresses();
    }
  }, [activeTab, isAuthenticated, navigate]);

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.getUserOrders();
      if (res.success) setOrders(res.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const res = await api.getAddresses();
      if (res.success) setAddresses(res.addresses);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile(profileForm);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingPassword(true);
      const res = await api.updatePassword(passwordForm);
      if (res.success) {
        addToast('Password changed successfully.');
        setPasswordForm({ currentPassword: '', newPassword: '' });
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.saveAddress(newAddress);
      if (res.success) {
        addToast('Address saved successfully.');
        setShowAddressModal(false);
        loadAddresses();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.deleteAddress(id);
      addToast('Address removed.');
      loadAddresses();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Account Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-brand-500/20" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-brand-600 text-white font-black text-2xl flex items-center justify-center">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="text-center sm:text-left flex-1">
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">{user?.name}</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{user?.email} · {user?.phone || 'No phone set'}</p>
          <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 px-2.5 py-0.5 rounded-full border border-brand-200 dark:border-brand-800">
            TECHNOVA Verified Member
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-800 gap-2 overflow-x-auto text-xs sm:text-sm font-bold">
        {[
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
          { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
          { id: 'addresses', label: 'Saved Addresses', icon: MapPin }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setSearchParams({ tab: t.id })}
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

      {/* TAB CONTENT */}

      {/* 1. Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Personal Information</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={profileForm.avatar_url}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Security & Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">New Password (Min 6 chars)</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:bg-brand-600 transition-colors"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <p className="text-xs text-gray-400">Loading order history...</p>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-gray-200 dark:border-slate-800 text-center space-y-3">
              <Package className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="font-bold text-gray-900 dark:text-white">No Orders Placed Yet</h3>
              <p className="text-xs text-gray-500">When you buy electronics, your order receipts and tracking links will appear here.</p>
              <Link to="/products" className="inline-block mt-3 px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold">
                Start Shopping
              </Link>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800 gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-gray-400">Order Ref</span>
                    <p className="text-sm font-mono font-bold text-gray-900 dark:text-white">{order.order_number}</p>
                    <span className="text-xs text-gray-400">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      ₹{order.total_amount?.toLocaleString('en-IN')}
                    </span>
                    <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
                      {order.status?.replace(/_/g, ' ')}
                    </span>
                    <Link
                      to={`/orders/track/${order.order_number}`}
                      className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      Track <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img src={item.product_image} alt={item.product_name} className="w-10 h-10 object-contain rounded-lg bg-gray-50 dark:bg-slate-800 p-1" />
                      <span className="font-bold text-gray-900 dark:text-white flex-1">{item.product_name}</span>
                      <span className="text-gray-400 font-mono">Qty: {item.quantity}</span>
                      <span className="font-bold text-gray-900 dark:text-white">₹{item.subtotal?.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlist.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-gray-200 dark:border-slate-800 text-center space-y-3">
              <Heart className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="font-bold text-gray-900 dark:text-white">Your Wishlist is Empty</h3>
              <p className="text-xs text-gray-500">Save products you like to monitor price drops and availability.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlist.map(p => (
                <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 flex flex-col justify-between">
                  <div className="relative aspect-square w-full bg-gray-50 dark:bg-slate-800 rounded-xl p-3 mb-3 flex items-center justify-center">
                    <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-contain" />
                    <button
                      onClick={() => removeFromWishlist(p.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white dark:bg-slate-700 text-rose-500 shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2">{p.name}</h4>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(p, null, 1);
                      removeFromWishlist(p.id);
                    }}
                    className="mt-3 w-full py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Addresses Tab */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Delivery Addresses</h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div key={addr.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-2 relative">
                {addr.is_default === 1 && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    DEFAULT ADDRESS
                  </span>
                )}
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{addr.full_name}</h4>
                <p className="text-xs text-gray-500 dark:text-slate-400">{addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="text-xs text-gray-500 font-mono">Phone: {addr.phone}</p>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="text-xs text-rose-500 hover:underline pt-2 inline-block font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* New Address Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">Add Delivery Address</h3>
                <form onSubmit={handleSaveAddress} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress(p => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Phone"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Address Line"
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress(p => ({ ...p, addressLine: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(p => ({ ...p, city: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress(p => ({ ...p, state: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="PIN Code"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress(p => ({ ...p, pincode: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
