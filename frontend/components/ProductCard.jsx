'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../lib/cartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const productId = product._id || product.id;
  const discountPercent = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const badgeColor = {
    BESTSELLER: 'bg-[#C9A227] text-[#0A0A0A] font-bold',
    EXCLUSIVE: 'bg-gradient-to-r from-[#DFB83E] to-[#9F7C14] text-[#0A0A0A] font-bold',
    NEW: 'bg-emerald-500/90 text-white font-semibold',
    SALE: 'bg-rose-500/90 text-white font-semibold',
    HOT: 'bg-amber-500/90 text-[#0A0A0A] font-bold',
    TRENDING: 'bg-purple-500/90 text-white font-semibold',
  }[product.badge?.toUpperCase()] || 'bg-white/10 text-white/90';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between bg-[#141414] border border-white/10 hover:border-[#C9A227]/40 rounded-[22px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:shadow-[0_25px_50px_rgba(201,162,39,0.14)] transition-all duration-300 hover:-translate-y-1.5"
    >
      {/* Top Media Area */}
      <div className="relative w-full aspect-square bg-[#1A1A1A] overflow-hidden">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className={`px-3 py-1 rounded-full text-[10px] tracking-wider uppercase shadow-md ${badgeColor}`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Discount Tag */}
        {discountPercent > 0 && (
          <div className="absolute top-3.5 right-3.5 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-600/90 text-white shadow-md">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Product Image with Hover Zoom */}
        <Link href={`/product/${productId}`} className="block w-full h-full relative cursor-pointer">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Floating Quick View Action */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center gap-3">
          <Link
            href={`/product/${productId}`}
            className="pointer-events-auto p-3 rounded-full bg-[#0A0A0A]/90 hover:bg-[#C9A227] text-white hover:text-black border border-white/20 hover:border-transparent transition-all shadow-xl"
            title="Inspect Details"
          >
            <Eye size={18} />
          </Link>
        </div>
      </div>

      {/* Details & Info Section */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-gradient-to-b from-[#141414] to-[#111111]">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
            <span className="uppercase tracking-widest text-[11px] text-[#C9A227] font-medium">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={13} className="fill-amber-400" />
              <span className="font-semibold text-white/90 text-xs">{product.rating || 4.8}</span>
              {product.reviewsCount && (
                <span className="text-white/40 text-[10px]">({product.reviewsCount})</span>
              )}
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/product/${productId}`}>
            <h3 className="font-playfair text-base sm:text-lg font-semibold text-white group-hover:text-[#C9A227] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Frame Spec Summary */}
          <p className="text-xs text-white/50 mt-1 line-clamp-1">
            {product.frameShape} • {product.frameMaterial}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-sans font-bold text-lg text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-xs text-white/40 line-through">
                  ₹{product.oldPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-400/90 font-medium">
              {product.stock > 0 ? (product.stock < 10 ? `Only ${product.stock} left` : 'In Stock') : 'Pre-order'}
            </p>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={justAdded}
            className={`px-3.5 py-2.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-all duration-300 ${
              justAdded
                ? 'bg-emerald-500 text-black'
                : 'cta-gradient hover:shadow-gold-glow'
            }`}
            aria-label={`Add ${product.name} to bag`}
          >
            {justAdded ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
