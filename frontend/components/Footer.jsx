'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, CheckCircle2, ShieldCheck, MapPin, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#080808] border-t border-white/10 text-white pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9F7C14] to-[#F9E79F] p-[2px]">
                <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center">
                  <Sparkles size={16} className="text-[#C9A227]" />
                </div>
              </div>
              <span className="font-playfair text-2xl font-bold tracking-wider text-white">
                Style<span className="text-[#C9A227]">Lens</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-sm">
              StyleLens redefines optical luxury with handcrafted Italian bio-acetate, 24K gold-plated titanium, and aerospace-grade polarized lenses engineered for sublime clarity.
            </p>
            <div className="flex items-center gap-3 pt-2 text-white/60">
              <span className="p-2 rounded-full bg-white/5 hover:bg-[#C9A227] hover:text-black transition-colors cursor-pointer">
                <Instagram size={16} />
              </span>
              <span className="p-2 rounded-full bg-white/5 hover:bg-[#C9A227] hover:text-black transition-colors cursor-pointer">
                <Facebook size={16} />
              </span>
              <span className="p-2 rounded-full bg-white/5 hover:bg-[#C9A227] hover:text-black transition-colors cursor-pointer">
                <Twitter size={16} />
              </span>
            </div>
          </div>

          {/* Eyewear Collections */}
          <div className="space-y-3">
            <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#C9A227]">
              Haute Collections
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <Link href="/shop?category=Sunglasses" className="hover:text-white transition-colors">
                  Polarized Sunglasses
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Premium%20Collection" className="hover:text-white transition-colors">
                  18K Gold Heritage
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Men" className="hover:text-white transition-colors">
                  Men’s Executive Frames
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Women" className="hover:text-white transition-colors">
                  Women’s Butterfly & Cat-Eye
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Unisex" className="hover:text-white transition-colors">
                  Minimalist Clear & Acetate
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Experience */}
          <div className="space-y-3">
            <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#C9A227]">
              Client Services
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="hover:text-white transition-colors">
                  AI Face-Shape Stylist
                </Link>
              </li>
              <li>
                <span className="text-white/40 cursor-default">7-Day Complimentary Home Trial</span>
              </li>
              <li>
                <span className="text-white/40 cursor-default">1-Year Lens & Frame Warranty</span>
              </li>
              <li>
                <span className="text-white/40 cursor-default">Prescription Lens Mounting</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#C9A227]">
              The Connoisseur Club
            </h4>
            <p className="text-xs text-white/60">
              Receive private invitations to limited production releases and enjoy 10% off your inaugural order.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Welcome! Use code <strong>STYLELENS</strong> for 10% off.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:border-[#C9A227] focus:outline-none"
                  />
                  <Mail size={13} className="absolute left-2.5 top-2.5 text-white/40" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 cta-gradient text-xs font-semibold"
                >
                  Join Exclusive Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits & Certifications */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>© {new Date().getFullYear()} StyleLens Eyewear Ltd. All rights reserved. Handcrafted with precision.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Secure SSL Payment</span>
            <span>•</span>
            <span>UPI & Cash on Delivery</span>
            <span>•</span>
            <span>Certified UV400 Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
