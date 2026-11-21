'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Tag } from 'lucide-react';
import { useCart, FREE_DELIVERY_THRESHOLD } from '../lib/cartContext';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    shippingFee,
    cartTotal,
    progressToFreeShipping,
    amountNeededForFreeShipping,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const clean = couponCode.trim().toUpperCase();
    if (clean === 'STYLELENS' || clean === 'LUXURY10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setDiscountAmount(discount);
      setCouponSuccess('10% VIP Connoisseur discount applied!');
    } else if (clean === 'FIRST500' && cartSubtotal >= 2500) {
      setDiscountAmount(500);
      setCouponSuccess('₹500 exclusive welcome discount applied!');
    } else {
      setCouponError('Invalid coupon code. Try "STYLELENS" for 10% off');
    }
  };

  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleProceedToCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111111] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#141414]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-[#C9A227]" size={20} />
              <h2 className="font-playfair text-xl font-bold text-white tracking-wide">
                Your Shopping Bag ({cart.reduce((a, b) => a + b.qty, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-gradient-to-r from-[#1A1812] to-[#141414] border-b border-[#C9A227]/20">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-xs text-white/80 mb-1.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#C9A227]" />
                Add <span className="text-[#C9A227] font-semibold">₹{amountNeededForFreeShipping}</span> more for <strong className="text-white">FREE Express Delivery</strong>
              </p>
            ) : (
              <p className="text-xs text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-400" />
                🎉 You have qualified for FREE Express Delivery!
              </p>
            )}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C9A227] to-[#E5BF45] transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/30 mb-4 border border-white/5">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-playfair text-lg font-semibold text-white">
                  Your bag is empty
                </h3>
                <p className="text-xs text-white/50 mt-1 max-w-[220px]">
                  Explore our handcrafted eyewear collection and find frames designed for your vision.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 cta-gradient text-xs font-semibold"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cart.map((item) => {
                const itemId = item.productId || item._id || item.id;
                return (
                  <div
                    key={itemId}
                    className="flex gap-4 p-3.5 rounded-[18px] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="w-20 h-20 rounded-xl bg-black/40 overflow-hidden shrink-0 border border-white/5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-[10px] text-[#C9A227] uppercase tracking-wider font-medium">
                            {item.category}
                          </p>
                          <h4 className="text-sm font-semibold text-white line-clamp-1">
                            {item.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(itemId)}
                          className="text-white/40 hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-white/10 rounded-full bg-white/5">
                          <button
                            onClick={() => updateQuantity(itemId, -1)}
                            className="p-1 hover:text-[#C9A227] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-white">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(itemId, 1)}
                            className="p-1 hover:text-[#C9A227] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <span className="font-sans font-bold text-sm text-white">
                          ₹{(item.price * item.qty).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Order Calculations */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#141414] space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. STYLELENS)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 uppercase focus:border-[#C9A227] focus:outline-none"
                  />
                  <Tag size={13} className="absolute left-2.5 top-2.5 text-white/40" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-[#C9A227] hover:text-black text-xs font-semibold transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponSuccess && <p className="text-[11px] text-emerald-400">{couponSuccess}</p>}
              {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-white/70 pt-2 border-t border-white/5">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-white font-medium">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Promotion Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier</span>
                  <span>{shippingFee === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                  <span>Estimated Total</span>
                  <span className="text-[#C9A227]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 cta-gradient font-bold text-sm flex items-center justify-center gap-2 group tracking-wide"
              >
                <span>Proceed to Luxury Checkout</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-white/40">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>256-Bit Encrypted Secure Checkout • 7-Day Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
