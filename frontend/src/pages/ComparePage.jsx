import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Trash2, ShoppingCart, Star, ArrowRight, Check, X } from 'lucide-react';
import { useCompare } from '../context/CompareContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (!compareItems || compareItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
          <Scale className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">No Products to Compare</h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
          Select up to 4 electronics devices from our catalog to compare technical specifications side-by-side.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-brand-600/30 transition-all"
        >
          <span>Browse Electronics</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Collect all unique specification keys across selected products
  const allSpecKeys = Array.from(
    new Set(compareItems.flatMap(p => Object.keys(p.specifications || {})))
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Compare Electronics ({compareItems.length}/4)
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Technical side-by-side comparison of processor, display, battery, and benchmarks.
          </p>
        </div>

        <button
          onClick={clearCompare}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Comparison
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40">
              <th className="p-4 sm:p-6 w-1/4 text-xs font-extrabold uppercase text-gray-400 tracking-wider">
                Product Details
              </th>
              {compareItems.map(item => (
                <th key={item.id} className="p-4 sm:p-6 w-1/4 align-top">
                  <div className="space-y-3">
                    <div className="relative aspect-square w-full bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
                      <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-contain" />
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                        {item.brand_name}
                      </span>
                      <Link to={`/product/${item.slug}`}>
                        <h3 className="text-xs font-bold text-gray-900 dark:text-white hover:text-brand-600 line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                    </div>

                    <div>
                      <span className="text-base font-black text-gray-900 dark:text-white">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(item, null, 1)}
                      className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
            {/* Rating row */}
            <tr>
              <td className="p-4 font-bold text-gray-500 dark:text-slate-400 bg-gray-50/30 dark:bg-slate-800/20">Customer Rating</td>
              {compareItems.map(item => (
                <td key={item.id} className="p-4">
                  <div className="flex items-center gap-1 font-bold text-gray-900 dark:text-white">
                    <span>{item.rating ? Number(item.rating).toFixed(1) : '4.8'}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-gray-400 text-[11px]">({item.review_count || 12})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Warranty row */}
            <tr>
              <td className="p-4 font-bold text-gray-500 dark:text-slate-400 bg-gray-50/30 dark:bg-slate-800/20">Warranty</td>
              {compareItems.map(item => (
                <td key={item.id} className="p-4 font-medium text-gray-700 dark:text-slate-300">
                  {item.warranty_months} Months Official
                </td>
              ))}
            </tr>

            {/* Dynamic Specifications rows */}
            {allSpecKeys.map(key => (
              <tr key={key}>
                <td className="p-4 font-bold text-gray-500 dark:text-slate-400 bg-gray-50/30 dark:bg-slate-800/20">{key}</td>
                {compareItems.map(item => (
                  <td key={item.id} className="p-4 font-medium text-gray-800 dark:text-slate-200">
                    {item.specifications?.[key] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
