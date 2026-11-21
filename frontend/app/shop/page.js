'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { fetchProducts } from '../../lib/api';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState('all');
  const [minRating, setMinRating] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = ['All', 'Sunglasses', 'Men', 'Women', 'Unisex', 'Premium Collection'];

  const priceOptions = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹999', value: 'under-999', min: 0, max: 999 },
    { label: '₹1,000 – ₹2,500', value: '1000-2500', min: 1000, max: 2500 },
    { label: '₹2,500 – ₹5,000', value: '2500-5000', min: 2500, max: 5000 },
    { label: 'Above ₹5,000', value: 'above-5000', min: 5000, max: 99999 },
  ];

  const ratingOptions = [
    { label: 'All Ratings', value: 'all' },
    { label: '4.8★ & Above', value: '4.8' },
    { label: '4.5★ & Above', value: '4.5' },
    { label: '4.0★ & Above', value: '4.0' },
  ];

  // Sync category or search when query string changes
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
    if (searchParams.get('search')) {
      setSearchQuery(searchParams.get('search'));
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let minP = undefined;
        let maxP = undefined;
        if (priceRange !== 'all') {
          const opt = priceOptions.find(o => o.value === priceRange);
          if (opt) {
            minP = opt.min;
            maxP = opt.max;
          }
        }

        const data = await fetchProducts({
          category: selectedCategory,
          search: searchQuery,
          minPrice: minP,
          maxPrice: maxP,
          rating: minRating !== 'all' ? minRating : undefined,
          sort: sortBy,
        });
        setProducts(data);
      } catch (e) {
        console.error('Failed to load shop products:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedCategory, searchQuery, priceRange, minRating, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange('all');
    setMinRating('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    searchQuery !== '' ||
    priceRange !== 'all' ||
    minRating !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Title & Description Banner */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
          Haute Lunetterie Catalog
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl font-extrabold text-white mt-1">
          The StyleLens Collection
        </h1>
        <p className="text-xs sm:text-sm text-white/60 mt-2 font-light">
          Explore handcrafted frames engineered with high-definition polarized triacetate optics and 24K gold accents.
        </p>
      </div>

      {/* Main Filter & Sort Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-[22px] bg-[#141414] border border-white/10 mb-8 shadow-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by silhouette, material, or color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder-white/40 focus:border-[#C9A227] focus:outline-none"
          />
          <Search size={15} className="absolute left-3.5 top-3 text-white/40 pointer-events-none" />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-white font-medium hover:border-[#C9A227]/40"
          >
            <SlidersHorizontal size={14} className="text-[#C9A227]" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs text-white focus:border-[#C9A227] focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#141414] text-white">Featured</option>
              <option value="rating_desc" className="bg-[#141414] text-white">Popularity & Rating</option>
              <option value="price_asc" className="bg-[#141414] text-white">Price: Low to High</option>
              <option value="price_desc" className="bg-[#141414] text-white">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } p-6 rounded-[22px] bg-[#141414] border border-white/10 space-y-8 h-fit`}
        >
          {/* Header & Reset */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="font-playfair text-base font-bold text-white flex items-center gap-2">
              <Filter size={16} className="text-[#C9A227]" />
              Filter By
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#C9A227] hover:underline flex items-center gap-1"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white/70 mb-3">
              Category
            </h4>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#C9A227] text-black font-bold shadow-md'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white/70 mb-3">
              Price Range
            </h4>
            <div className="space-y-1.5">
              {priceOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPriceRange(opt.value)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    priceRange === opt.value
                      ? 'bg-[#C9A227] text-black font-bold shadow-md'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white/70 mb-3">
              Minimum Rating
            </h4>
            <div className="space-y-1.5">
              {ratingOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMinRating(opt.value)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    minRating === opt.value
                      ? 'bg-[#C9A227] text-black font-bold shadow-md'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {/* Active Chips & Count */}
          <div className="flex items-center justify-between mb-6 text-xs text-white/60">
            <span>Showing <strong className="text-white">{products.length}</strong> luxury eyewear models</span>
            {hasActiveFilters && (
              <span className="text-[#C9A227] text-xs">Filters applied</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 rounded-[22px] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center rounded-[22px] bg-[#141414] border border-white/5">
              <Sparkles size={32} className="mx-auto text-[#C9A227] mb-3" />
              <h3 className="font-playfair text-xl font-bold text-white">No Matching Eyewear Found</h3>
              <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto">
                No frames matched your current filter criteria. Try resetting your price or category filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 cta-gradient text-xs font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading StyleLens Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
