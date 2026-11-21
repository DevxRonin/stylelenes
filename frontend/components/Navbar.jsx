'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Sparkles, Menu, X, User, Compass } from 'lucide-react';
import { useCart } from '../lib/cartContext';

export default function Navbar() {
  const router = useRouter();
  const { cartCount, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (userEmail.trim()) {
      setIsLoggedIn(true);
      setAccountModalOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile Menu & Brand Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white/80 hover:text-[#C9A227] transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9F7C14] via-[#C9A227] to-[#F9E79F] p-[2px] transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center">
                    <Sparkles size={18} className="text-[#C9A227]" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-playfair text-2xl font-bold tracking-wider text-white group-hover:text-[#C9A227] transition-colors">
                    Style<span className="text-[#C9A227]">Lens</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-white/50 -mt-1 font-sans">
                    Haute Lunetterie
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-sm font-medium text-white/80 hover:text-[#C9A227] transition-colors tracking-wide">
                Home
              </Link>
              <Link href="/shop" className="text-sm font-medium text-white/80 hover:text-[#C9A227] transition-colors tracking-wide">
                Shop All
              </Link>
              <Link href="/shop?category=Sunglasses" className="text-sm font-medium text-white/80 hover:text-[#C9A227] transition-colors tracking-wide">
                Sunglasses
              </Link>
              <Link href="/shop?category=Men" className="text-sm font-medium text-white/80 hover:text-[#C9A227] transition-colors tracking-wide">
                Men
              </Link>
              <Link href="/shop?category=Women" className="text-sm font-medium text-white/80 hover:text-[#C9A227] transition-colors tracking-wide">
                Women
              </Link>
              <Link href="/shop?category=Premium%20Collection" className="text-sm font-medium text-[#C9A227] hover:text-[#E5BF45] transition-colors tracking-wide flex items-center gap-1.5 font-semibold">
                <Sparkles size={14} /> Premium 18K
              </Link>
              <Link href="/orders" className="text-sm font-medium text-white/80 hover:text-[#C9A227] transition-colors tracking-wide">
                Track Orders
              </Link>
            </nav>

            {/* Right: Search, AI Concierge, User Account, Shopping Bag */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Desktop Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
                <input
                  type="text"
                  placeholder="Search luxury frames..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-64 pl-9 pr-4 py-2 bg-white/5 hover:bg-white/10 focus:bg-[#141414] text-xs text-white placeholder-white/40 rounded-full border border-white/10 focus:border-[#C9A227]/50 focus:outline-none transition-all duration-300"
                />
                <Search size={14} className="absolute left-3 text-white/40 pointer-events-none" />
              </form>

              {/* AI Concierge Link */}
              <Link
                href="/ai-assistant"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-xs font-medium text-[#C9A227] hover:bg-[#C9A227]/20 transition-all"
                title="AI Shopping Stylist"
              >
                <Sparkles size={13} className="text-[#C9A227] animate-pulse" />
                <span>AI Stylist</span>
              </Link>

              {/* User Account Button */}
              <button
                onClick={() => setAccountModalOpen(true)}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-[#C9A227] transition-colors border border-white/5"
                title={isLoggedIn ? `Logged in as ${userEmail}` : 'Account / Login'}
              >
                <User size={18} className={isLoggedIn ? 'text-[#C9A227]' : ''} />
              </button>

              {/* Cart Drawer Trigger Button */}
              <button
                onClick={openCart}
                className="relative p-2.5 rounded-full bg-gradient-to-r from-white/5 to-white/10 hover:from-[#C9A227]/20 hover:to-[#C9A227]/10 text-white hover:text-[#C9A227] border border-white/10 hover:border-[#C9A227]/40 transition-all duration-300 flex items-center justify-center"
                aria-label="View Shopping Bag"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#C9A227] text-[#0A0A0A] text-xs font-bold flex items-center justify-center shadow-lg shadow-[#C9A227]/40 animate-scale">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0F0F0F] border-b border-white/10 px-4 pt-3 pb-6 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center relative mb-4">
              <input
                type="text"
                placeholder="Search luxury frames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/5 text-sm text-white placeholder-white/40 rounded-full border border-white/10 focus:border-[#C9A227]/50 focus:outline-none"
              />
              <Search size={16} className="absolute left-3 text-white/40" />
            </form>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-white/5 text-white/90 hover:text-[#C9A227]"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-white/5 text-white/90 hover:text-[#C9A227]"
              >
                Shop All
              </Link>
              <Link
                href="/shop?category=Sunglasses"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-white/5 text-white/90 hover:text-[#C9A227]"
              >
                Sunglasses
              </Link>
              <Link
                href="/shop?category=Men"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-white/5 text-white/90 hover:text-[#C9A227]"
              >
                Men
              </Link>
              <Link
                href="/shop?category=Women"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-white/5 text-white/90 hover:text-[#C9A227]"
              >
                Women
              </Link>
              <Link
                href="/shop?category=Premium%20Collection"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#C9A227]/10 text-[#C9A227] font-semibold"
              >
                ✨ Premium 18K
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-white/5 text-white/90 hover:text-[#C9A227]"
              >
                Track Orders
              </Link>
              <Link
                href="/ai-assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-[#C9A227]/20 text-[#C9A227] font-semibold flex items-center gap-1.5"
              >
                <Sparkles size={14} /> AI Stylist
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Account Login / Profile Modal */}
      {accountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#141414] border border-[#C9A227]/30 rounded-[22px] p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setAccountModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] mb-3">
                <User size={24} />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-white">
                {isLoggedIn ? 'VIP Client Lounge' : 'Sign In to StyleLens'}
              </h3>
              <p className="text-xs text-white/60 mt-1">
                {isLoggedIn
                  ? `Signed in as ${userEmail}`
                  : 'Unlock exclusive member pricing and bespoke eyewear styling'}
              </p>
            </div>

            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                  <p className="text-white/60 text-xs">Membership Status</p>
                  <p className="text-[#C9A227] font-semibold flex items-center gap-1 mt-0.5">
                    ✨ StyleLens Gold Connoisseur
                  </p>
                </div>
                <Link
                  href="/orders"
                  onClick={() => setAccountModalOpen(false)}
                  className="block w-full py-3 text-center cta-gradient text-sm font-semibold"
                >
                  View My Order History
                </Link>
                <button
                  onClick={() => {
                    setIsLoggedIn(false);
                    setUserEmail('');
                  }}
                  className="w-full py-2.5 text-xs text-white/50 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vip@stylelens.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Password / Passkey
                  </label>
                  <input
                    type="password"
                    required
                    defaultValue="••••••••"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 cta-gradient font-semibold text-sm tracking-wide mt-2"
                >
                  Enter StyleLens Concierge
                </button>
                <p className="text-[11px] text-center text-white/40">
                  Demo mode: Enter any email to experience the member portal.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
