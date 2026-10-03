import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Heart, ShoppingCart, Zap, Scale, Check, ShieldCheck, 
  Truck, RotateCcw, CreditCard, ChevronRight, ThumbsUp, 
  MapPin, AlertCircle, Share2, Plus, Sparkles, ArrowLeft, RefreshCw, PackageX
} from 'lucide-react';
import api from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCompare } from '../context/CompareContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ProductCard from '../components/product/ProductCard.jsx';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'features' | 'reviews' | 'shipping' | 'warranty'
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Delivery pincode check
  const [pincode, setPincode] = useState('560103');
  const [deliveryEstimate, setDeliveryEstimate] = useState('Standard: 3 - 5 Days | Express: 2 Days');
  const [checkingPincode, setCheckingPincode] = useState(false);

  // Reviews state
  const [reviewsData, setReviewsData] = useState({ reviews: [], summary: { averageRating: 0, totalReviews: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } } });
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await api.getProductBySlugOrId(slug);
      if (res.success && res.product) {
        setProduct(res.product);
        setRelatedProducts(Array.isArray(res.relatedProducts) ? res.relatedProducts : []);
        if (Array.isArray(res.product.variants) && res.product.variants.length > 0) {
          setSelectedVariant(res.product.variants[0]);
        } else {
          setSelectedVariant(null);
        }
        setSelectedImage(0);

        // Fetch reviews safely
        try {
          const rRes = await api.getProductReviews(res.product.id);
          if (rRes && rRes.success) {
            setReviewsData({
              reviews: Array.isArray(rRes.reviews) ? rRes.reviews : [],
              summary: rRes.summary || { averageRating: 0, totalReviews: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }
            });
          }
        } catch (rErr) {
          console.warn('Reviews fetch non-fatal error:', rErr);
        }
      } else {
        setProduct(null);
      }
    } catch (err) {
      console.error('Failed to load product detail:', err);
      if (err.status === 404) {
        setProduct(null);
      } else {
        setFetchError(err.message || 'Unable to connect to server.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleImageError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  // 1. Loading Skeleton UI
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-10 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-64"></div>

        {/* Product Details Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-16 h-16 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
              ))}
            </div>
            <div className="flex-1 aspect-square bg-gray-200 dark:bg-slate-800 rounded-3xl"></div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-20 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
            <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
              <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Fetch / Network Error State
  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-8 shadow-xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Unable to load this product</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
            {fetchError}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={loadProduct}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
            <Link
              to="/products"
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Product Not Found (Invalid ID or Slug)
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-8 shadow-xl space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <PackageX className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Product Not Found</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
            The electronic product you're looking for doesn't exist or may have been removed from our catalog.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safe data extraction
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [FALLBACK_IMAGE];

  const variants = Array.isArray(product.variants) ? product.variants : [];
  const features = Array.isArray(product.features) ? product.features : [];
  const specifications = typeof product.specifications === 'object' && product.specifications !== null 
    ? product.specifications 
    : {};

  const reviewsList = Array.isArray(reviewsData?.reviews) ? reviewsData.reviews : [];
  const reviewSummary = reviewsData?.summary || { totalReviews: 0, averageRating: 0, distribution: {} };
  const reviewDistribution = reviewSummary.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const inWish = isInWishlist(product.id);
  const inComp = isInCompare(product.id);
  const currentPrice = (product.price || 0) + (selectedVariant?.price_delta || 0);
  const originalPrice = product.original_price || currentPrice;
  const currentStock = selectedVariant ? (selectedVariant.stock || 0) : (product.stock || 0);
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock > 0 && currentStock <= (product.low_stock_threshold || 5);
  const savings = Math.max(0, originalPrice - currentPrice);
  const emiRate = Math.round(currentPrice / 12);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setCheckingPincode(true);
      setTimeout(() => {
        setDeliveryEstimate(`Express delivery available to ${pincode} within 48 Hours. Free delivery.`);
        setCheckingPincode(false);
      }, 350);
    } else {
      addToast('Please enter a valid 6-digit PIN code.', 'error');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please sign in to write a review.', 'error');
      navigate('/auth');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.addReview(product.id, reviewForm);
      if (res && res.success) {
        addToast('Review submitted successfully!');
        setReviewForm({ rating: 5, title: '', comment: '' });
        // Reload reviews
        const rRes = await api.getProductReviews(product.id);
        if (rRes && rRes.success) setReviewsData(rRes);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleHelpfulVote = async (reviewId) => {
    try {
      await api.markHelpful(reviewId);
      addToast('Marked as helpful!');
      const rRes = await api.getProductReviews(product.id);
      if (rRes && rRes.success) setReviewsData(rRes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
        <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${product.category_slug || ''}`} className="hover:text-brand-600 transition-colors">
          {product.category_name || 'Category'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Gallery (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col-reverse md:flex-row gap-4 sticky top-28">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto shrink-0 py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden p-1 bg-white dark:bg-slate-900 transition-all ${
                    selectedImage === idx
                      ? 'border-brand-600 shadow-md ring-2 ring-brand-500/20'
                      : 'border-gray-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-contain"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-8 flex items-center justify-center relative overflow-hidden aspect-square shadow-sm group">
            {product.discount_percent > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
                -{product.discount_percent}% OFF
              </span>
            )}
            <img
              src={images[selectedImage] || images[0]}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          </div>
        </div>

        {/* Right: Product Details & Purchase Actions (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Title */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-900 px-2.5 py-1 rounded-lg">
                {product.brand_name || 'Brand'}
              </span>
              <span className="text-xs text-gray-400 font-mono">SKU: {selectedVariant?.sku || product.sku}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-2 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
              {product.short_description}
            </p>
          </div>

          {/* Ratings & Reviews summary */}
          <div className="flex items-center gap-3 py-2 border-y border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <span>{product.rating ? Number(product.rating).toFixed(1) : '4.9'}</span>
              <Star className="w-3.5 h-3.5 fill-emerald-600 dark:fill-emerald-400 text-transparent" />
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
              {product.review_count || 12} Verified Customer Ratings & Reviews
            </span>
          </div>

          {/* Pricing Box */}
          <div className="bg-gray-50/80 dark:bg-slate-900/80 rounded-2xl p-5 border border-gray-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {originalPrice > currentPrice && (
                <span className="text-base text-gray-400 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {savings > 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                  Save ₹{savings.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Inclusive of all taxes. Free insured door-to-door delivery.
            </p>

            {/* EMI Notice */}
            <div className="pt-2 flex items-center gap-2 text-xs text-gray-700 dark:text-slate-300">
              <CreditCard className="w-4 h-4 text-brand-600 shrink-0" />
              <span>
                No Cost EMI available starting at <strong className="text-gray-900 dark:text-white">₹{emiRate.toLocaleString('en-IN')}/month</strong>
              </span>
            </div>
          </div>

          {/* Variants Selector (if any) */}
          {variants.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Select Configuration / Variant:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                      selectedVariant?.id === v.id
                        ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20 font-bold'
                        : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{v.variant_name}</span>
                    <span className="text-[11px] font-mono text-gray-400 mt-1">
                      {v.price_delta > 0 ? `+₹${v.price_delta.toLocaleString('en-IN')}` : 'Base configuration'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Urgency */}
          <div>
            {isOutOfStock ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Currently out of stock. Back in inventory soon.</span>
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-400 text-xs font-bold">
                <Zap className="w-4 h-4 fill-amber-500" />
                <span>Urgent: Only {currentStock} units left in stock! Order now before it runs out.</span>
              </div>
            ) : (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>In Stock & Ready to Ship within 24 Hours</span>
              </p>
            )}
          </div>

          {/* Pincode Check */}
          <div className="bg-gray-50/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600" /> Delivery Availability
              </span>
            </div>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit Pincode"
                className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={checkingPincode}
                className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:bg-brand-600 transition-colors"
              >
                {checkingPincode ? 'Checking...' : 'Check'}
              </button>
            </form>
            {deliveryEstimate && (
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">
                {deliveryEstimate}
              </p>
            )}
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(Math.max(1, currentStock), q + 1))}
                  disabled={quantity >= currentStock}
                  className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-sm disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Add to Wishlist & Compare Buttons */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-all ${
                  inWish
                    ? 'bg-rose-50 border-rose-300 text-rose-500'
                    : 'border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-rose-400 hover:text-rose-500'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWish ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => addToCompare(product)}
                className={`p-3 rounded-xl border transition-all ${
                  inComp
                    ? 'bg-purple-50 border-purple-300 text-purple-700'
                    : 'border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-purple-400 hover:text-purple-600'
                }`}
                title="Compare Specs"
              >
                <Scale className="w-5 h-5" />
              </button>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => addToCart(product, selectedVariant, quantity)}
                disabled={isOutOfStock}
                className="py-3.5 px-6 rounded-2xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/30 hover:shadow-brand-500/50 transition-all active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Frequently Bought Together</span>
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-2xl p-2 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
              <img src={images[0]} alt={product.name} className="w-full h-full object-contain" onError={handleImageError} />
            </div>
            <Plus className="w-5 h-5 text-gray-400" />
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-2xl p-2 border border-gray-200 dark:border-slate-700 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=300&q=80" alt="Anker 100W GaN Fast Charger" className="w-full h-full object-contain" onError={handleImageError} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-900 dark:text-white">This Item: {product.name}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">+ Anker GaN 100W Fast Charger Pro (₹4,999)</p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div>
              <p className="text-xs text-gray-400">Bundle Price:</p>
              <p className="text-xl font-black text-gray-900 dark:text-white">
                ₹{(currentPrice + 4999).toLocaleString('en-IN')}
              </p>
            </div>
            <button
              onClick={() => {
                addToCart(product, selectedVariant, 1);
                addToast('Bundle added to cart!');
              }}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:bg-brand-600 transition-colors"
            >
              Add Both to Cart
            </button>
          </div>
        </div>
      </section>

      {/* Tabs Section: Overview, Specifications, Features, Reviews, Shipping, Warranty */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-200 dark:border-slate-800 overflow-x-auto text-xs sm:text-sm font-bold">
          {['overview', 'specs', 'features', 'reviews', 'shipping', 'warranty'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 capitalize whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-brand-50/20 dark:bg-brand-950/20'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {tab === 'specs' ? 'Specifications' : tab === 'reviews' ? `Reviews (${reviewSummary.totalReviews})` : tab}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {/* 1. Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-4 max-w-3xl leading-relaxed text-sm text-gray-700 dark:text-slate-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Product Overview</h3>
              <p>{product.description}</p>
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60">
                  <p className="text-xs font-bold uppercase text-brand-600 dark:text-brand-400">Authenticity</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">100% Genuine Box-Packed with seal and serial verification.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60">
                  <p className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Warranty</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{product.warranty_months || 12} Months comprehensive hardware warranty.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700/60">
                  <p className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">Support</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Free phone onboarding and setup guidance available.</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. Specifications */}
          {activeTab === 'specs' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Technical Specifications</h3>
              {Object.keys(specifications).length > 0 ? (
                <div className="rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden divide-y divide-gray-100 dark:divide-slate-800">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 p-3.5 text-xs">
                      <span className="font-bold text-gray-500 dark:text-slate-400">{key}</span>
                      <span className="col-span-2 font-medium text-gray-900 dark:text-white">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No specifications listed for this product.</p>
              )}
            </div>
          )}

          {/* 3. Features */}
          {activeTab === 'features' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Key Features & Highlights</h3>
              {features.length > 0 ? (
                <ul className="space-y-3">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">Standard product features apply.</p>
              )}
            </div>
          )}

          {/* 4. Reviews & Ratings */}
          {activeTab === 'reviews' && (
            <div className="space-y-10">
              {/* Rating summary & distribution */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gray-50/60 dark:bg-slate-800/40 p-6 rounded-2xl border border-gray-200/80 dark:border-slate-800">
                <div className="md:col-span-4 text-center md:border-r border-gray-200 dark:border-slate-700 md:pr-6">
                  <p className="text-5xl font-black text-gray-900 dark:text-white">
                    {reviewSummary.averageRating}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-amber-400 my-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Based on {reviewSummary.totalReviews} verified reviews
                  </p>
                </div>

                {/* Bars distribution */}
                <div className="md:col-span-8 space-y-2">
                  {[5, 4, 3, 2, 1].map(stars => {
                    const count = reviewDistribution[stars] || 0;
                    const pct = reviewSummary.totalReviews ? Math.round((count / reviewSummary.totalReviews) * 100) : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3 text-xs">
                        <span className="w-8 font-bold text-gray-600 dark:text-slate-400">{stars}★</span>
                        <div className="flex-1 h-2.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="w-10 text-right text-gray-400 font-mono">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write Review Form */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4">
                <h4 className="font-bold text-base text-gray-900 dark:text-white">Write a Verified Review</h4>
                <form onSubmit={handleAddReview} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: r }))}
                          className="p-1"
                        >
                          <Star className={`w-6 h-6 ${r <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Review Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Unbelievable performance and display clarity!"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Your Detailed Experience</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share what you liked, battery observations, camera performance, build feel..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    {submittingReview ? 'Publishing Review...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                <h4 className="font-bold text-base text-gray-900 dark:text-white">Customer Reviews ({reviewsList.length})</h4>
                {reviewsList.length > 0 ? (
                  <div className="space-y-3">
                    {reviewsList.map(r => (
                      <div key={r.id} className="p-5 rounded-2xl bg-gray-50/50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                              {r.author_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900 dark:text-white">{r.author_name || 'Customer'}</p>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                ✓ Verified Buyer
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] text-gray-400 font-mono">
                            {new Date(r.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                          ))}
                        </div>

                        <h5 className="font-bold text-sm text-gray-900 dark:text-white">{r.title}</h5>
                        <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">{r.comment}</p>

                        <div className="pt-2 flex items-center gap-3">
                          <button
                            onClick={() => handleHelpfulVote(r.id)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-brand-600 transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful ({r.helpful_votes || 0})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No reviews submitted yet for this product. Be the first to review!</p>
                )}
              </div>
            </div>
          )}

          {/* 5. Shipping & Returns */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-3xl leading-relaxed text-sm text-gray-700 dark:text-slate-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Shipping & Return Policies</h3>
              <p>
                All orders are packaged in temperature-controlled, shock-absorbent anti-static packaging and dispatched with registered priority couriers (Bluedart, Delhivery, FedEx).
              </p>
              <ul className="space-y-2 list-disc pl-5 text-xs sm:text-sm">
                <li><strong>Complimentary Shipping:</strong> Free for orders exceeding ₹1,000 across 19,000+ pincodes.</li>
                <li><strong>Express Same-Day Dispatch:</strong> Orders placed before 2:00 PM are processed immediately.</li>
                <li><strong>15-Day Easy Replacement:</strong> Return or replace your product if defective or damaged during transit.</li>
              </ul>
            </div>
          )}

          {/* 6. Warranty */}
          {activeTab === 'warranty' && (
            <div className="space-y-4 max-w-3xl leading-relaxed text-sm text-gray-700 dark:text-slate-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Official Brand Warranty</h3>
              <p>
                This unit is covered by <strong>{product.warranty_months || 12} Months Manufacturer Warranty</strong> valid across all authorized brand service centers in India.
              </p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                To claim warranty, simply present the electronic tax invoice automatically generated upon your order delivery.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Related Devices in {product.category_name || 'Category'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
