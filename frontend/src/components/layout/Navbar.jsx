import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, ShoppingCart, Heart, User, Sun, Moon, 
  Menu, X, ChevronDown, Sparkles, Scale, ShieldCheck, 
  Zap, Package, LogOut, LayoutDashboard, Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCompare } from '../../context/CompareContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import api from '../../services/api.js';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount } = useCompare();
  const { isDark, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    api.getCategories()
      .then(res => {
        if (res.success) setCategories(res.categories);
      })
      .catch(() => {});
  }, []);

  // Close popovers on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSuggestions(false);
    setAccountDropdownOpen(false);
  }, [location.pathname]);

  // Click outside search to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        api.getSearchSuggestions(searchQuery)
          .then(res => {
            if (res.success) setSuggestions(res.suggestions);
          })
          .catch(() => {});
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setSuggestions(null);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-gray-200 dark:border-slate-800 transition-colors">
      {/* Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 dark:bg-brand-950 dark:text-brand-200 text-xs py-1.5 px-4 font-medium flex justify-between items-center border-b border-slate-800">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <span className="bg-brand-600 text-white text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded">NEW</span>
            <span>Get 10% instant discount with coupon <strong className="text-brand-400 font-mono">TECH10</strong> on all electronics!</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-300 dark:text-slate-400">
            <Link to="/track-order" className="hover:text-white flex items-center gap-1 transition-colors">
              <Truck className="w-3.5 h-3.5" /> Track Shipment
            </Link>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Genuine Warranty
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center">
                TECH<span className="text-brand-600 dark:text-brand-400">NOVA</span>
              </span>
              <p className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 -mt-1 tracking-wider uppercase">
                Technology. Simplified.
              </p>
            </div>
          </Link>

          {/* Live Search Bar */}
          <div ref={searchRef} className="relative hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search smartphones, OLED TVs, RTX laptops, headphones..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-11 pr-12 py-2.5 rounded-full border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/80 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-xs font-medium transition-colors"
              >
                Search
              </button>
            </form>

            {/* Suggestions Popover */}
            {showSuggestions && suggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                {suggestions.products?.length > 0 && (
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Products</p>
                    <div className="space-y-1">
                      {suggestions.products.map(p => (
                        <Link
                          key={p.id}
                          to={`/product/${p.slug}`}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700/60 transition-colors"
                        >
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100 dark:bg-slate-900" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
                            <p className="text-xs font-bold text-brand-600 dark:text-brand-400">₹{p.price.toLocaleString('en-IN')}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.categories?.length > 0 && (
                  <div className="p-3 bg-gray-50/50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.categories.map(c => (
                        <Link
                          key={c.id}
                          to={`/products?category=${c.slug}`}
                          onClick={() => setShowSuggestions(false)}
                          className="text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-full hover:border-brand-500 font-medium text-gray-700 dark:text-slate-300"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Compare */}
            <Link
              to="/compare"
              className="relative p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Compare Electronics"
            >
              <Scale className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2 rounded-xl text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 p-2 px-3 rounded-xl bg-brand-50 dark:bg-brand-950/50 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-bold text-sm">{itemCount}</span>
              <span className="hidden xl:inline text-xs font-semibold text-slate-500 dark:text-slate-400">
                · ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </Link>

            {/* User Account Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:inline text-sm font-medium text-gray-800 dark:text-slate-200 max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {accountDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 py-2 z-50 animate-in fade-in duration-150">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/account"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>

                      <Link
                        to="/account?tab=orders"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      >
                        <Package className="w-4 h-4" /> Orders & Tracking
                      </Link>

                      <div className="border-t border-gray-100 dark:border-slate-700 my-1"></div>

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-brand-600 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-brand-400 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
          </form>
        </div>
      </div>

      {/* Secondary Categories Navigation Bar */}
      <nav className="hidden lg:block bg-gray-50 dark:bg-slate-800/60 border-t border-gray-100 dark:border-slate-800">
        <div className="container mx-auto px-4 flex items-center gap-6 overflow-x-auto py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 whitespace-nowrap">
          <Link to="/products" className="hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1.5 transition-colors">
            All Products
          </Link>
          <Link to="/products?isDeal=true" className="text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline">
            <Zap className="w-3.5 h-3.5 fill-rose-600" /> Flash Deals
          </Link>
          {categories.slice(0, 8).map(c => (
            <Link
              key={c.id}
              to={`/products?category=${c.slug}`}
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {c.name}
            </Link>
          ))}
          <Link to="/track-order" className="ml-auto text-brand-600 dark:text-brand-400 hover:underline">
            Track Order →
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[110px] bg-slate-900/50 backdrop-blur-sm z-50 md:hidden">
          <div className="bg-white dark:bg-slate-900 w-4/5 max-w-sm h-full p-6 shadow-2xl flex flex-col gap-4 overflow-y-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Navigation</p>
            <Link to="/" className="text-base font-semibold py-2 border-b dark:border-slate-800">Home</Link>
            <Link to="/products" className="text-base font-semibold py-2 border-b dark:border-slate-800">All Products</Link>
            <Link to="/products?isDeal=true" className="text-base font-semibold py-2 border-b dark:border-slate-800 text-rose-600">Flash Deals</Link>
            <Link to="/compare" className="text-base font-semibold py-2 border-b dark:border-slate-800">Compare Devices ({compareCount})</Link>
            <Link to="/track-order" className="text-base font-semibold py-2 border-b dark:border-slate-800">Track Order</Link>
            
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-4">Categories</p>
            {categories.map(c => (
              <Link
                key={c.id}
                to={`/products?category=${c.slug}`}
                className="text-sm py-1.5 text-gray-700 dark:text-slate-300"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
