import React from 'react';
import { Filter, RotateCcw, Star, Check } from 'lucide-react';

export default function FilterSidebar({
  categories = [],
  brands = [],
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
  dealsOnly,
  setDealsOnly,
  onReset
}) {
  return (
    <aside className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
        <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-600" /> Filters
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset All
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-slate-400 mb-3">
          Categories
        </h4>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full text-left text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
              !selectedCategory 
                ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400' 
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`w-full text-left text-xs font-medium py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                selectedCategory === c.slug
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-[11px] text-gray-400">({c.product_count || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-slate-400 mb-3">
          Brands
        </h4>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedBrand('')}
            className={`w-full text-left text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
              !selectedBrand
                ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Brands</span>
          </button>
          {brands.map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.slug)}
              className={`w-full text-left text-xs font-medium py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                selectedBrand === b.slug
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{b.name}</span>
              <span className="text-[11px] text-gray-400">({b.product_count || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-slate-400 mb-3">
          Price Range (₹)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs"
          />
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 dark:text-slate-400 mb-3">
          Customer Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 2].map(r => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === String(r) ? '' : String(r))}
              className={`w-full flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-xs transition-colors ${
                minRating === String(r)
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < r ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-slate-600'}`}
                  />
                ))}
              </div>
              <span>{r}★ & above</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability & Deals Toggles */}
      <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-slate-800">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-gray-800 dark:text-slate-200 select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 dark:bg-slate-800"
          />
          <span>In-Stock Only</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-gray-800 dark:text-slate-200 select-none">
          <input
            type="checkbox"
            checked={dealsOnly}
            onChange={(e) => setDealsOnly(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 dark:bg-slate-800"
          />
          <span>Flash Deals Only</span>
        </label>
      </div>
    </aside>
  );
}
