import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Scale, Check, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { useCompare } from '../../context/CompareContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();

  const inWish = isInWishlist(product.id);
  const inComp = isInCompare(product.id);
  const isLowStock = product.stock > 0 && product.stock <= (product.low_stock_threshold || 5);
  const isOutOfStock = product.stock === 0;

  // Monthly EMI estimation (over 12 months)
  const emiPerMonth = Math.round(product.price / 12);

  return (
    <div className="group relative bg-white dark:bg-slate-800/90 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 p-3 sm:p-4 flex flex-col justify-between hover:shadow-card-hover hover:border-brand-500/50 dark:hover:border-brand-500/50 transition-all duration-300">
      {/* Top Badges */}
      <div className="relative w-full aspect-square bg-gray-50 dark:bg-slate-900 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center p-2">
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start">
          {product.discount_percent > 0 && (
            <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
              -{product.discount_percent}% OFF
            </span>
          )}
          {product.is_flash_deal === 1 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
              <Zap className="w-3 h-3 fill-white" /> DEAL
            </span>
          )}
          {product.is_bestseller === 1 && (
            <span className="bg-slate-900 text-white dark:bg-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Quick Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur transition-all ${
            inWish 
              ? 'bg-rose-50 text-rose-500 shadow-md scale-110' 
              : 'bg-white/80 dark:bg-slate-800/80 text-gray-500 hover:text-rose-500 hover:scale-105'
          }`}
          title={inWish ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${inWish ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Image */}
        <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product Metadata */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 text-xs text-gray-400 dark:text-slate-400 mb-1">
          <span className="font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider text-[11px]">
            {product.brand_name || 'Brand'}
          </span>
          <span className="truncate">{product.category_name}</span>
        </div>

        {/* Title */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-1.5 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            <span>{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
            <Star className="w-3 h-3 fill-emerald-600 dark:fill-emerald-400 text-transparent" />
          </div>
          <span className="text-xs text-gray-400 dark:text-slate-500">
            ({product.review_count || 12})
          </span>
        </div>

        {/* Price & Savings */}
        <div className="mt-auto pt-2 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-gray-900 dark:text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">
            EMI from <strong className="text-gray-700 dark:text-slate-200">₹{emiPerMonth.toLocaleString('en-IN')}/mo</strong>
          </p>

          {/* Stock warnings */}
          {isOutOfStock ? (
            <p className="text-[11px] font-bold text-rose-500 mt-1">Currently Out of Stock</p>
          ) : isLowStock ? (
            <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Only {product.stock} units left!
            </p>
          ) : (
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1">
              ✓ In Stock · Fast Delivery
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3.5 pt-2 flex items-center gap-2">
        <button
          onClick={() => addToCart(product, null, 1)}
          disabled={isOutOfStock}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
        </button>

        <button
          onClick={() => addToCompare(product)}
          className={`p-2 rounded-xl border text-xs font-medium transition-all ${
            inComp
              ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-950/60 dark:border-purple-700 dark:text-purple-300'
              : 'border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-gray-300 hover:text-gray-800 dark:hover:text-white'
          }`}
          title={inComp ? "Remove from comparison" : "Add to comparison"}
        >
          {inComp ? <Check className="w-4 h-4 text-purple-600" /> : <Scale className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
