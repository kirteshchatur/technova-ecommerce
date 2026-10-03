import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, ArrowRight, ShieldCheck, Truck, RotateCcw, 
  Headphones, Flame, Clock, Sparkles, Smartphone, Laptop, 
  Tablet, Watch, Gamepad2, Camera, Tv, Cable, Home as HomeIcon
} from 'lucide-react';
import api from '../services/api.js';
import ProductCard from '../components/product/ProductCard.jsx';
import { ProductCardSkeleton } from '../components/common/Skeleton.jsx';

// Category icon mapper
const iconMap = {
  Smartphone, Laptop, Tablet, Headphones, Watch, Gamepad2, Camera, Tv, Cable, Home: HomeIcon
};

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [activeTab, setActiveTab] = useState('bestsellers');
  const [loading, setLoading] = useState(true);

  // Countdown timer for flash deals (e.g. 18 hours 42 mins 15 secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catRes, dealRes, bestRes, newRes] = await Promise.all([
          api.getCategories(),
          api.getFlashDeals(),
          api.getSectionProducts('bestsellers'),
          api.getSectionProducts('new-arrivals')
        ]);

        if (catRes.success) setCategories(catRes.categories);
        if (dealRes.success) setFlashDeals(dealRes.deals);
        if (bestRes.success) setBestsellers(bestRes.products);
        if (newRes.success) setNewArrivals(newRes.products);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white py-16 lg:py-24 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-2xl border border-slate-700/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-brand-400" /> Next-Gen Electronics
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Power Your World With <span className="bg-gradient-to-r from-sky-400 to-brand-300 bg-clip-text text-transparent">Better Technology</span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover flagship smartphones, creator workstations, audiophile ANC gear, and smart living tech with official brand warranties and lightning-fast delivery.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 transition-all flex items-center gap-2 group"
                >
                  <span>Shop Catalog</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products?isDeal=true"
                  className="px-7 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-slate-100 text-sm font-bold rounded-2xl border border-slate-600/80 transition-all flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Explore Flash Deals</span>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-700/60 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-slate-400">Genuine Products</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white">FREE</p>
                  <p className="text-xs text-slate-400">Express Delivery</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white">15 DAYS</p>
                  <p className="text-xs text-slate-400">Easy Returns</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-500 to-sky-400 opacity-30 blur-2xl"></div>
                <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-900/80 p-4 shadow-2xl backdrop-blur">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
                    alt="Featured MacBook Pro M3"
                    className="w-full h-64 sm:h-72 object-cover rounded-2xl"
                  />
                  <div className="mt-4 p-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-brand-400 font-bold uppercase tracking-wider">Spotlight Launch</span>
                      <h4 className="text-white font-bold text-base mt-0.5">Apple MacBook Pro 16" M3 Max</h4>
                      <p className="text-xs text-slate-400">Up to 40-core GPU · 48GB Unified RAM</p>
                    </div>
                    <Link
                      to="/product/apple-macbook-pro-16-m3-max"
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Explore Popular Categories
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Engineered devices curated by specialists
            </p>
          </div>
          <Link to="/products" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map(c => {
            const IconComponent = iconMap[c.icon] || Smartphone;
            return (
              <Link
                key={c.id}
                to={`/products?category=${c.slug}`}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-200/80 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-card-hover transition-all text-center flex flex-col items-center justify-center gap-3 overflow-hidden"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/70 border border-brand-100 dark:border-brand-900 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                  <IconComponent className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
                    {c.product_count || '10+'} Devices
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Flash Deals Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-transparent dark:from-rose-950/40 dark:via-amber-950/20 p-6 sm:p-8 rounded-3xl border border-rose-200/60 dark:border-rose-900/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 animate-pulse">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>⚡ Flash Deals of the Day</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Massive discounts on top electronic gear. Limited stock.
                </p>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
              <Clock className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 mr-2">Deals End In:</span>
              <div className="flex items-center gap-1.5 font-mono text-sm font-extrabold text-gray-900 dark:text-white">
                <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md text-rose-600">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : flashDeals.slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* 4. Best Sellers & New Arrivals Tabs */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Featured Collections
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Top rated by tech professionals and community reviewers
            </p>
          </div>

          <div className="flex items-center p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'bestsellers'
                  ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              🔥 Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('newArrivals')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'newArrivals'
                  ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              ✨ New Arrivals
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : (activeTab === 'bestsellers' ? bestsellers : newArrivals).slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* 5. Promotional Banner: "Upgrade Your Setup" */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 lg:p-14 border border-slate-800 shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:block opacity-40 lg:opacity-60">
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
              alt="Ultimate Gaming Rig"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400 bg-brand-950/80 border border-brand-800 px-3 py-1 rounded-full">
              Workstation & Studio Pro
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Upgrade Your Setup
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Transform your workspace with high-bandwidth Thunderbolt docks, 8K HDR monitors, spatial noise-canceling headsets, and ultra-ergonomic peripherals.
            </p>
            <div className="pt-2">
              <Link
                to="/products?category=accessories"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-brand-500/30 transition-all"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Shop With Us Trust Pillars */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Why Shop At TECHNOVA?
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Setting the benchmark for customer security, warranty transparency, and service speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Free Express Shipping</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              Fast, insured priority dispatch on all orders exceeding ₹1,000 across India.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">100% Genuine Brands</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              Every unit is authorized by original brand manufacturers with official warranty cards.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">15-Day Easy Returns</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              Hassle-free doorstep pickup and instant refunds if you are unsatisfied with your unit.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Secure Payments</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              End-to-end 256-bit encrypted checkout supporting UPI, EMI, Cards, and Net Banking.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">24/7 Expert Support</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              Certified technical support specialists available whenever you need configuration help.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
