'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles, ShieldCheck, Tag } from 'lucide-react';
import { useCart, FREE_DELIVERY_THRESHOLD } from '../../lib/cartContext';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    shippingFee,
    cartTotal,
    progressToFreeShipping,
    amountNeededForFreeShipping,
  } = useCart();

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const clean = coupon.trim().toUpperCase();
    if (clean === 'STYLELENS' || clean === 'LUXURY10') {
      const disc = Math.round(cartSubtotal * 0.1);
      setDiscount(disc);
      setCouponMsg('✨ 10% VIP Connoisseur discount applied!');
    } else {
      setCouponMsg('Invalid coupon code. Try "STYLELENS"');
    }
  };

  const finalTotal = Math.max(0, cartTotal - discount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
          Your Curated Bag
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl font-extrabold text-white mt-1">
          Shopping Bag ({cart.reduce((a, b) => a + b.qty, 0)})
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="max-w-md mx-auto p-12 text-center rounded-[28px] bg-[#141414] border border-white/10 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40 mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <h2 className="font-playfair text-xl font-bold text-white">Your Bag is Empty</h2>
          <p className="text-xs text-white/50 mt-1 mb-6">
            Find the perfect pair from our handcrafted polarized sunglasses and optical frames.
          </p>
          <Link href="/shop" className="px-8 py-3.5 cta-gradient text-xs font-bold tracking-wide">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items List (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping bar */}
            <div className="p-4 rounded-[20px] bg-gradient-to-r from-[#1A1812] to-[#141414] border border-[#C9A227]/30">
              {amountNeededForFreeShipping > 0 ? (
                <p className="text-xs text-white/80 mb-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-[#C9A227]" />
                  Add <strong className="text-[#C9A227]">₹{amountNeededForFreeShipping}</strong> more to unlock <strong className="text-white">FREE Express Delivery!</strong>
                </p>
              ) : (
                <p className="text-xs text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                  <Sparkles size={14} />
                  🎉 You have unlocked complimentary Express Courier delivery!
                </p>
              )}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A227] to-[#E5BF45] transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {cart.map((item) => {
                const itemId = item.productId || item._id || item.id;
                return (
                  <div
                    key={itemId}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-[22px] bg-[#141414] border border-white/5 hover:border-white/10 transition-colors shadow-lg"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-2xl object-cover bg-black/40 border border-white/5 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] text-[#C9A227] uppercase tracking-wider font-semibold">
                          {item.category}
                        </span>
                        <h3 className="font-playfair text-base font-bold text-white">
                          {item.name}
                        </h3>
                        <p className="text-xs text-white/50">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      {/* Qty Counter */}
                      <div className="flex items-center border border-white/10 rounded-full bg-white/5 px-2">
                        <button
                          onClick={() => updateQuantity(itemId, -1)}
                          className="px-2.5 py-1 text-white/70 hover:text-[#C9A227] transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-3 text-xs font-bold text-white">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(itemId, 1)}
                          className="px-2.5 py-1 text-white/70 hover:text-[#C9A227] transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Total */}
                      <span className="font-sans font-bold text-base text-white min-w-[80px] text-right">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </span>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="p-2 text-white/40 hover:text-rose-400 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary Card (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-[28px] bg-[#141414] border border-white/10 shadow-2xl space-y-6 sticky top-28">
              <h2 className="font-playfair text-xl font-bold text-white pb-3 border-b border-white/10">
                Order Summary
              </h2>

              {/* Coupon */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. STYLELENS)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 uppercase focus:border-[#C9A227] focus:outline-none"
                  />
                  <Tag size={14} className="absolute left-3 top-3 text-white/40" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-[#C9A227] hover:text-black text-xs font-semibold transition-colors"
                >
                  Apply Voucher
                </button>
                {couponMsg && <p className="text-[11px] text-emerald-400">{couponMsg}</p>}
              </form>

              {/* Breakdown */}
              <div className="space-y-3 text-xs text-white/70 border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-white">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>VIP Promotion</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                  <span>Estimated Total</span>
                  <span className="text-[#C9A227]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 cta-gradient font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 group hover:shadow-gold-glow"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-white/40">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>100% Secure Payment • 7-Day Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
