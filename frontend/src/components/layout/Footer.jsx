import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Headphones, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-950 border border-brand-800 flex items-center justify-center text-brand-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">Complimentary for all orders above ₹1,000</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Tech</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct manufacturer warranty certified</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">15-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">No-questions-asked refund policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">24/7 Priority Tech Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Call or chat with certified engineers</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                TECH<span className="text-brand-400">NOVA</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's premier digital electronics marketplace. Delivering authentic consumer electronics, workstations, audio systems, and smart home ecosystems with unmatched reliability.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+91 1800 209 8888 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@technova.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>TechNova Towers, Cyber Gateway, Bengaluru 560103</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/products?category=smartphones" className="hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link to="/products?category=laptops" className="hover:text-white transition-colors">Laptops & Workstations</Link></li>
              <li><Link to="/products?category=headphones" className="hover:text-white transition-colors">Audio & Headphones</Link></li>
              <li><Link to="/products?category=smartwatches" className="hover:text-white transition-colors">Smartwatches</Link></li>
              <li><Link to="/products?category=gaming" className="hover:text-white transition-colors">Gaming Consoles</Link></li>
              <li><Link to="/products?category=televisions" className="hover:text-white transition-colors">4K OLED TVs</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link to="/account?tab=orders" className="hover:text-white transition-colors">Order History</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link to="/compare" className="hover:text-white transition-colors">Compare Devices</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">Account Settings</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Tech Insider</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Subscribe to receive weekly exclusive flash deal drops, launch notifications, and tech reviews.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to TECHNOVA Insider drops!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 TECHNOVA Inc. All rights reserved. Technology. Simplified.</p>
          <div className="flex items-center gap-4">
            <span>Safe & Encrypted 256-bit SSL Checkout</span>
            <span className="font-mono bg-slate-900 px-2 py-1 rounded text-slate-400">UPI / CARDS / NETBANKING / COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
