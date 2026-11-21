'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Star, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-white/5">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C9A227]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[250px] bg-[#E5BF45]/5 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, CTA buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Luxury Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-[#C9A227]/30 text-xs text-[#C9A227] tracking-wider uppercase backdrop-blur-md">
              <Sparkles size={13} className="text-[#C9A227] animate-pulse" />
              <span>Haute Lunetterie 2026 Collection</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              See the World <br />
              <span className="text-gold-gradient italic">in Style</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Discover premium eyewear designed for every vision. Precision-engineered polarized optics meets hand-polished Italian acetate and 24K gold accents.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/shop"
                className="px-8 py-4 cta-gradient text-sm font-bold tracking-wide flex items-center gap-2 group hover:shadow-gold-glow"
              >
                <span>Shop Now</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/shop?category=Premium%20Collection"
                className="px-8 py-4 cta-secondary text-sm font-semibold tracking-wide flex items-center gap-2"
              >
                <span>Explore Collection</span>
              </Link>

              <Link
                href="/ai-assistant"
                className="px-6 py-4 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 hover:bg-[#C9A227]/25 text-xs font-semibold text-[#C9A227] flex items-center gap-2 transition-all"
              >
                <Sparkles size={14} className="text-[#DFB83E]" />
                <span>Ask AI Stylist</span>
              </Link>
            </div>

            {/* Social Proof & Metrics */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-white">4.9 / 5</span>
                <span>(25,000+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-[#C9A227]" />
                <span>Certified UV400 Polarized</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Glassmorphism Badges */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[28px] overflow-hidden border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.8)] group">
              <img
                src="https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1000&q=85"
                alt="StyleLens Aviator Gold Luxe Sunglasses"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Top Glass Badge */}
              <div className="absolute top-5 left-5 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2.5 shadow-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C9A227] animate-ping" />
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Flagship Model</p>
                  <p className="text-xs font-bold text-white font-playfair">Aviator 24K Gold Luxe</p>
                </div>
              </div>

              {/* Bottom Glass Badge */}
              <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-[#C9A227]/30 flex items-center justify-between shadow-2xl">
                <div>
                  <p className="text-[11px] text-[#C9A227] font-semibold uppercase tracking-wider">Starting From</p>
                  <p className="font-sans text-xl font-bold text-white">₹2,499</p>
                </div>
                <Link
                  href="/product/sl-prod-1"
                  className="px-4 py-2 rounded-full cta-gradient text-xs font-bold text-black"
                >
                  View Frame
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
