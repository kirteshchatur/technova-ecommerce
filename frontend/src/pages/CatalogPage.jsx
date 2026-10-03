import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, SlidersHorizontal, ArrowUpDown, X, PackageSearch } from 'lucide-react';
import api from '../services/api.js';
import ProductCard from '../components/product/ProductCard.jsx';
import FilterSidebar from '../components/product/FilterSidebar.jsx';
import { ProductCardSkeleton } from '../components/common/Skeleton.jsx';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const dealParam = searchParams.get('isDeal') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [dealsOnly, setDealsOnly] = useState(dealParam === 'true');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Sync URL params when they change externally
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSelectedBrand(brandParam);
    setDealsOnly(dealParam === 'true');
  }, [categoryParam, brandParam, dealParam]);

  // Load filter metadata
  useEffect(() => {
    api.getCategories().then(res => res.success && setCategories(res.categories)).catch(() => {});
    api.getBrands().then(res => res.success && setBrands(res.brands)).catch(() => {});
  }, []);

  // Fetch products on filter changes
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = {
          search: searchQuery,
          category: selectedCategory,
          brand: selectedBrand,
          minPrice,
          maxPrice,
          rating: minRating,
          inStock: inStockOnly ? 'true' : '',
          isDeal: dealsOnly ? 'true' : '',
          sort: sortBy,
          page: currentPage,
          limit: 12
        };

        const res = await api.getProducts(params);
        if (res.success) {
          setProducts(res.products);
          setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery, selectedCategory, selectedBrand, minPrice, maxPrice, minRating, inStockOnly, dealsOnly, sortBy, currentPage]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setInStockOnly(false);
    setDealsOnly(false);
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Banner / Heading */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? `${selectedCategory.toUpperCase()} Devices` : 'All Electronics'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
            Showing <strong className="text-gray-900 dark:text-white">{pagination.total}</strong> products across premium electronics
          </p>
        </div>

        {/* View mode & Sorting controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-700 dark:text-slate-200 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Filters</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-semibold text-gray-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="relevance" className="dark:bg-slate-900">Relevance</option>
              <option value="price_asc" className="dark:bg-slate-900">Price: Low to High</option>
              <option value="price_desc" className="dark:bg-slate-900">Price: High to Low</option>
              <option value="rating" className="dark:bg-slate-900">Customer Rating</option>
              <option value="newest" className="dark:bg-slate-900">Newest Arrivals</option>
              <option value="bestseller" className="dark:bg-slate-900">Best Selling</option>
              <option value="discount" className="dark:bg-slate-900">Biggest Discount</option>
            </select>
          </div>

          {/* Grid / List toggle */}
          <div className="hidden sm:flex items-center p-1 bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 sticky top-28">
          <FilterSidebar
            categories={categories}
            brands={brands}
            selectedCategory={selectedCategory}
            setSelectedCategory={(c) => { setSelectedCategory(c); setCurrentPage(1); }}
            selectedBrand={selectedBrand}
            setSelectedBrand={(b) => { setSelectedBrand(b); setCurrentPage(1); }}
            minPrice={minPrice}
            setMinPrice={(p) => { setMinPrice(p); setCurrentPage(1); }}
            maxPrice={maxPrice}
            setMaxPrice={(p) => { setMaxPrice(p); setCurrentPage(1); }}
            minRating={minRating}
            setMinRating={(r) => { setMinRating(r); setCurrentPage(1); }}
            inStockOnly={inStockOnly}
            setInStockOnly={(s) => { setInStockOnly(s); setCurrentPage(1); }}
            dealsOnly={dealsOnly}
            setDealsOnly={(d) => { setDealsOnly(d); setCurrentPage(1); }}
            onReset={handleResetFilters}
          />
        </div>

        {/* Products Section */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-5`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto my-12 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <PackageSearch className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No products matched your criteria</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                Try loosening your filters, adjusting the price range, or searching for broader terms like "laptop", "sony", or "smartphone".
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-5`}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                      : 'border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-gray-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xs h-full p-6 shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <FilterSidebar
              categories={categories}
              brands={brands}
              selectedCategory={selectedCategory}
              setSelectedCategory={(c) => { setSelectedCategory(c); setCurrentPage(1); }}
              selectedBrand={selectedBrand}
              setSelectedBrand={(b) => { setSelectedBrand(b); setCurrentPage(1); }}
              minPrice={minPrice}
              setMinPrice={(p) => { setMinPrice(p); setCurrentPage(1); }}
              maxPrice={maxPrice}
              setMaxPrice={(p) => { setMaxPrice(p); setCurrentPage(1); }}
              minRating={minRating}
              setMinRating={(r) => { setMinRating(r); setCurrentPage(1); }}
              inStockOnly={inStockOnly}
              setInStockOnly={(s) => { setInStockOnly(s); setCurrentPage(1); }}
              dealsOnly={dealsOnly}
              setDealsOnly={(d) => { setDealsOnly(d); setCurrentPage(1); }}
              onReset={handleResetFilters}
            />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full py-3 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
