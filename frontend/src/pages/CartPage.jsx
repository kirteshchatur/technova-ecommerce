import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, 
  Truck, ArrowLeft, Check, Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    items, itemCount, subtotal, coupon, couponDiscount, 
    taxAmount, shippingFee, finalTotal, updateQuantity, 
    removeItem, clearCart, applyCoupon, removeCoupon 
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    await applyCoupon(couponCode.trim());
    setApplying(false);
    setCouponCode('');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
          Looks like you haven't added any electronic devices or gear to your cart yet.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-brand-600/30 transition-all"
        >
          <span>Explore Electronics</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Review your selected devices and accessories before checkout.
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Link to={`/product/${item.slug}`} className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-xl p-2 shrink-0 border border-gray-100 dark:border-slate-700/60 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link to={`/product/${item.slug}`}>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate">
                      {item.name}
                    </h3>
                  </Link>
                  {item.variantName && (
                    <span className="inline-block mt-0.5 text-xs text-brand-600 dark:text-brand-400 font-semibold bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md">
                      {item.variantName}
                    </span>
                  )}
                  <p className="text-xs font-bold text-gray-900 dark:text-white mt-1.5">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-800">
                <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 p-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-xs"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-xs disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping */}
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-brand-600" /> Have a Promo Code?
            </h4>

            {coupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">{coupon.code}</span>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      Savings applied: ₹{coupon.discountAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. TECH10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={applying || !couponCode.trim()}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:bg-brand-600 transition-colors disabled:opacity-40"
                >
                  {applying ? '...' : 'Apply'}
                </button>
              </form>
            )}

            {/* Quick coupon hint */}
            <div className="pt-1 flex flex-wrap gap-1.5 text-[11px] text-gray-500 dark:text-slate-400">
              <span>Try:</span>
              <button
                onClick={() => applyCoupon('TECH10')}
                className="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                TECH10
              </button>
              <span>·</span>
              <button
                onClick={() => applyCoupon('SAVE500')}
                className="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                SAVE500
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">Order Summary</h3>

            <div className="space-y-2.5 text-xs text-gray-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Discount ({coupon?.code})</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated GST Tax (18%)</span>
                <span className="font-semibold text-gray-900 dark:text-white">₹{taxAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {shippingFee === 0 ? <strong className="text-emerald-600 dark:text-emerald-400">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-baseline justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Final Total</p>
                <p className="text-[11px] text-gray-400">Includes all taxes</p>
              </div>
              <span className="text-2xl font-black text-gray-900 dark:text-white">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust badge */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Safe 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
