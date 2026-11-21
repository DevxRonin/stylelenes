'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Flame, Eye, Compass, Glasses } from 'lucide-react';
import Hero from '../components/Hero';
import TrustBadges from '../components/TrustBadges';
import ProductCard from '../components/ProductCard';
import ReviewCard from '../components/ReviewCard';
import { fetchProducts } from '../lib/api';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (e) {
        console.error('Failed to load products:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = [
    {
      name: 'Sunglasses',
      count: '15+ Models',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=Sunglasses'
    },
    {
      name: 'Premium 18K',
      count: 'Limited Editions',
      image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=Premium%20Collection'
    },
    {
      name: 'Men’s Frames',
      count: 'Executive Series',
      image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=Men'
    },
    {
      name: 'Women’s Eyewear',
      count: 'Haute Chic',
      image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=Women'
    },
    {
      name: 'Unisex Minimalist',
      count: 'Bio-Acetate',
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
      link: '/shop?category=Unisex'
    }
  ];

  // Tab Filtering
  const displayedProducts = products.filter((p) => {
    if (activeTab === 'bestsellers') return p.badge === 'BESTSELLER' || p.rating >= 4.8;
    if (activeTab === 'new') return p.badge === 'NEW' || p.badge === 'TRENDING';
    return true; // featured
  }).slice(0, 8);

  const customerReviews = [
    {
      name: 'Vikram Malhotra',
      role: 'Creative Director, Mumbai',
      review: 'The Aviator Gold Luxe frames are genuinely peerless. The 24K plating has a deep, subtle luster and the polarized clarity while driving on Mumbai coastal road is unmatched. Luxury executed right.',
      rating: 5,
      modelBought: 'Aviator Gold Luxe',
      date: 'Purchased 2 weeks ago'
    },
    {
      name: 'Ananya Singhania',
      role: 'Fashion Stylist, New Delhi',
      review: 'I ordered the Aura Amber Cat-Eye frames and was blown away by the weight balance. Featherlight Italian acetate that does not leave marks on the bridge. The unboxing packaging felt like receiving Cartier.',
      rating: 5,
      modelBought: 'Aura Amber Cat-Eye',
      date: 'Purchased 1 month ago'
    },
    {
      name: 'Rohan Mehra',
      role: 'Architect & Collector, Bengaluru',
      review: 'StyleLens is in a league of its own. The Lucent Clear frames combine architectural geometry with pristine blue-light blocking for long studio design sessions. Ordered my second pair yesterday.',
      rating: 5,
      modelBought: 'Lucent Clear Square',
      date: 'Purchased 3 weeks ago'
    }
  ];

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero Banner */}
      <Hero />

      {/* Trust Badges Bar */}
      <TrustBadges />

      {/* Curated Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
              Curated Universes
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-[#C9A227] hover:text-[#E5BF45] flex items-center gap-1 group tracking-wide"
          >
            <span>View All Eyewear</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="group relative h-64 rounded-[22px] overflow-hidden border border-white/10 hover:border-[#C9A227]/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] text-[#C9A227] uppercase tracking-wider font-semibold block">
                  {cat.count}
                </span>
                <h3 className="font-playfair text-base sm:text-lg font-bold group-hover:text-[#C9A227] transition-colors leading-tight">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Collection Tabs & Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
              Handcrafted Precision
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mt-1">
              Curated Eyewear Collection
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 text-xs self-start">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === 'featured'
                  ? 'bg-[#C9A227] text-black font-semibold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'bestsellers'
                  ? 'bg-[#C9A227] text-black font-semibold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Flame size={13} />
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'new'
                  ? 'bg-[#C9A227] text-black font-semibold shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Sparkles size={13} />
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 rounded-[22px] bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 cta-secondary text-xs font-bold tracking-wider uppercase group"
          >
            <span>Explore All {products.length}+ Eyewear Pieces</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Bespoke Craftsmanship Highlight Section */}
      <section className="bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A] py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
                The StyleLens Standard
              </span>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Sculpted from <br />
                <span className="text-gold-gradient italic">Italian Mazzucchelli Bio-Acetate</span>
              </h2>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
                Every StyleLens silhouette requires over 64 meticulous manufacturing stages. From hand-beveling the frame edges in small batches to embedding custom 5-barrel hinges and 24K gold temple core-wires, we refuse to compromise.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="font-playfair text-2xl font-bold text-[#C9A227]">64</span>
                  <p className="text-xs text-white/60 mt-1">Hand-Finishing Stages</p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="font-playfair text-2xl font-bold text-[#C9A227]">100%</span>
                  <p className="text-xs text-white/60 mt-1">UVA / UVB Blocking</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-[28px] overflow-hidden border border-white/10 shadow-2xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80"
                  alt="StyleLens Craftsmanship"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
                  <p className="text-xs font-semibold text-white">Precision Italian Craftsmanship</p>
                  <p className="text-[11px] text-white/50">Hand-assembled with custom calibrated tension hinges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A227] font-semibold">
            Client Voices
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mt-1">
            Endorsed by Connoisseurs
          </h2>
          <p className="text-xs sm:text-sm text-white/60 mt-2">
            Read authentic reviews from clients who wear StyleLens across Delhi, Mumbai, Bengaluru, and worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerReviews.map((rev, idx) => (
            <ReviewCard key={idx} {...rev} />
          ))}
        </div>
      </section>
    </div>
  );
}
