'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle2, Lock, CreditCard, Banknote, QrCode, ArrowRight, Sparkles, AlertCircle, ShoppingBag, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../lib/cartContext';
import { createOrder } from '../../lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, shippingFee, cartTotal, clearCart } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    paymentMethod: 'COD',
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Goa', 'Gujarat', 'Haryana',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan',
    'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim() || !/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Valid 10-digit mobile number is required';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Valid email address is required for dispatch receipt';
    }
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim() || !/^[0-9]{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Valid 6-digit PIN code is required';
    }

    if (formData.paymentMethod === 'UPI' && !formData.upiId.trim()) {
      errs.upiId = 'Please enter your UPI ID (e.g. mobile@upi)';
    }

    if (formData.paymentMethod === 'CARD') {
      if (!formData.cardNumber.trim()) errs.cardNumber = 'Card number required';
      if (!formData.cardExpiry.trim()) errs.cardExpiry = 'MM/YY required';
      if (!formData.cardCvv.trim()) errs.cardCvv = 'CVV required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        paymentMethod: formData.paymentMethod,
        items: cart.map((item) => ({
          productId: item.productId || item._id || item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
        })),
        subtotal: cartSubtotal,
        shippingFee: shippingFee,
        total: cartTotal,
      };

      const result = await createOrder(orderPayload);

      if (result.success && result.order) {
        // Confetti celebration
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#C9A227', '#DFB83E', '#FFFFFF'],
          });
        } catch (e) {}

        // Save to client localStorage for quick orders lookup
        try {
          const prevOrders = JSON.parse(localStorage.getItem('stylelens_orders') || '[]');
          localStorage.setItem('stylelens_orders', JSON.stringify([result.order, ...prevOrders]));
        } catch (e) {}

        setOrderConfirmed(result.order);
        clearCart();
      } else {
        alert(result.message || 'Could not place order. Please check inputs.');
      }
    } catch (err) {
      console.error('Order checkout error:', err);
      alert('Order placement encountered an issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmation Screen
  if (orderConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <div className="p-8 sm:p-12 rounded-[28px] bg-[#141414] border border-[#C9A227]/40 shadow-2xl space-y-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#9F7C14] to-[#DFB83E] p-[3px] mx-auto">
            <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center text-[#C9A227]">
              <CheckCircle2 size={38} />
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-bold">
              Order Confirmed & Placed
            </span>
            <h1 className="font-playfair text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Thank You, {orderConfirmed.name}
            </h1>
            <p className="text-sm text-white/60 mt-2 max-w-lg mx-auto">
              Your bespoke eyewear has been recorded in our atelier ledger under Order ID{' '}
              <strong className="text-[#C9A227] font-mono">{orderConfirmed.orderId}</strong>.
            </p>
          </div>

          {/* Details Card */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:justify-between pb-3 border-b border-white/10 gap-2">
              <div>
                <span className="text-white/40 block">Order Identifier</span>
                <span className="font-mono font-bold text-white text-sm">{orderConfirmed.orderId}</span>
              </div>
              <div>
                <span className="text-white/40 block">Payment Mode</span>
                <span className="font-semibold text-[#C9A227]">{orderConfirmed.payment?.method || 'Cash on Delivery'}</span>
              </div>
              <div>
                <span className="text-white/40 block">Total Amount</span>
                <span className="font-bold text-white text-sm">₹{orderConfirmed.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <span className="text-white/40 block mb-1">Shipping Destination</span>
              <p className="text-white/90">
                {orderConfirmed.address}, {orderConfirmed.city}, {orderConfirmed.state} – {orderConfirmed.pincode}
              </p>
              <p className="text-white/60 mt-0.5">Phone: {orderConfirmed.phone} • Email: {orderConfirmed.email}</p>
            </div>

            <div className="pt-2">
              <span className="text-white/40 block mb-2">Eyewear Items ({orderConfirmed.items?.length})</span>
              <div className="space-y-2">
                {orderConfirmed.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <span className="text-white font-medium">{item.name} × {item.qty}</span>
                    <span className="text-white/70">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/orders"
              className="w-full sm:w-auto px-8 py-3.5 cta-gradient text-xs font-bold uppercase tracking-wider text-black flex items-center justify-center gap-2"
            >
              <span>Track in Orders Portal</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 cta-secondary text-xs font-bold uppercase tracking-wider text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
          Secure Encrypted Transaction
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl font-extrabold text-white mt-1">
          Luxury Checkout
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="max-w-md mx-auto p-12 text-center rounded-[28px] bg-[#141414] border border-white/10">
          <ShoppingBag size={32} className="mx-auto text-white/40 mb-3" />
          <h2 className="font-playfair text-xl font-bold text-white">Your bag is empty</h2>
          <p className="text-xs text-white/50 mt-1 mb-6">Add eyewear frames to proceed with checkout.</p>
          <Link href="/shop" className="px-6 py-3 cta-gradient text-xs font-semibold">
            Explore Collection
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Shipping Information & Payment Method (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Client Shipping Information */}
            <div className="p-6 sm:p-8 rounded-[28px] bg-[#141414] border border-white/10 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#C9A227]/10 text-[#C9A227] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-playfair text-lg font-bold text-white">
                    Shipping & Consignment Address
                  </h3>
                  <p className="text-[11px] text-white/50">Where should your handcrafted eyewear be delivered?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Aryan Singhania"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-xs text-white placeholder-white/30 focus:outline-none transition-colors ${
                      errors.name ? 'border-rose-500' : 'border-white/10 focus:border-[#C9A227]'
                    }`}
                  />
                  {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Phone Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-xs text-white placeholder-white/30 focus:outline-none transition-colors ${
                      errors.phone ? 'border-rose-500' : 'border-white/10 focus:border-[#C9A227]'
                    }`}
                  />
                  {errors.phone && <p className="text-[10px] text-rose-400 mt-1">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="client@stylelens.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-xs text-white placeholder-white/30 focus:outline-none transition-colors ${
                      errors.email ? 'border-rose-500' : 'border-white/10 focus:border-[#C9A227]'
                    }`}
                  />
                  {errors.email && <p className="text-[10px] text-rose-400 mt-1">{errors.email}</p>}
                </div>

                {/* Complete Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    Complete Address (Flat / House / Suite, Street) *
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Penthouse 4B, Imperial Towers, Altamount Road"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-xs text-white placeholder-white/30 focus:outline-none transition-colors ${
                      errors.address ? 'border-rose-500' : 'border-white/10 focus:border-[#C9A227]'
                    }`}
                  />
                  {errors.address && <p className="text-[10px] text-rose-400 mt-1">{errors.address}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-xs text-white placeholder-white/30 focus:outline-none transition-colors ${
                      errors.city ? 'border-rose-500' : 'border-white/10 focus:border-[#C9A227]'
                    }`}
                  />
                  {errors.city && <p className="text-[10px] text-rose-400 mt-1">{errors.city}</p>}
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-xs text-white focus:border-[#C9A227] focus:outline-none"
                  >
                    {indianStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PIN Code */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    placeholder="400026"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-xs text-white placeholder-white/30 focus:outline-none transition-colors ${
                      errors.pincode ? 'border-rose-500' : 'border-white/10 focus:border-[#C9A227]'
                    }`}
                  />
                  {errors.pincode && <p className="text-[10px] text-rose-400 mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* 2. Payment Options */}
            <div className="p-6 sm:p-8 rounded-[28px] bg-[#141414] border border-white/10 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#C9A227]/10 text-[#C9A227] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-playfair text-lg font-bold text-white">
                    Payment Method
                  </h3>
                  <p className="text-[11px] text-white/50">Select your preferred payment channel</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD'
                      ? 'bg-[#C9A227]/10 border-[#C9A227]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="mt-1 text-[#C9A227] focus:ring-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Banknote size={18} className="text-[#C9A227]" />
                      <span className="font-semibold text-xs text-white">Cash on Delivery (COD)</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                        Popular
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-1">
                      Pay upon doorstep delivery via cash or UPI scan. Verified with delivery agent OTP.
                    </p>
                  </div>
                </label>

                {/* UPI Mode */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'UPI'
                      ? 'bg-[#C9A227]/10 border-[#C9A227]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={formData.paymentMethod === 'UPI'}
                    onChange={handleChange}
                    className="mt-1 text-[#C9A227] focus:ring-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <QrCode size={18} className="text-[#C9A227]" />
                      <span className="font-semibold text-xs text-white">Instant UPI (GPay / PhonePe / Paytm)</span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-1">
                      Zero convenience charges. Fast instant payment confirmation.
                    </p>

                    {formData.paymentMethod === 'UPI' && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <label className="block text-[11px] text-white/70">Enter Your VPA / UPI ID:</label>
                        <input
                          type="text"
                          name="upiId"
                          placeholder="e.g. username@okhdfcbank"
                          value={formData.upiId}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:border-[#C9A227] focus:outline-none"
                        />
                        {errors.upiId && <p className="text-[10px] text-rose-400">{errors.upiId}</p>}
                      </div>
                    )}
                  </div>
                </label>

                {/* Card Demo Mode */}
                <label
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'CARD'
                      ? 'bg-[#C9A227]/10 border-[#C9A227]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={formData.paymentMethod === 'CARD'}
                    onChange={handleChange}
                    className="mt-1 text-[#C9A227] focus:ring-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} className="text-[#C9A227]" />
                      <span className="font-semibold text-xs text-white">Credit / Debit Card</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-500/20 text-amber-300 font-bold uppercase">
                        Demo Mode Only
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-1">
                      Simulated card authorization gateway. No real charge is incurred.
                    </p>

                    {formData.paymentMethod === 'CARD' && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                        <div>
                          <input
                            type="text"
                            name="cardNumber"
                            placeholder="Card Number (e.g. 4532 •••• •••• 8910)"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:border-[#C9A227] focus:outline-none"
                          />
                          {errors.cardNumber && <p className="text-[10px] text-rose-400 mt-1">{errors.cardNumber}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <input
                              type="text"
                              name="cardExpiry"
                              placeholder="MM/YY"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:border-[#C9A227] focus:outline-none"
                            />
                            {errors.cardExpiry && <p className="text-[10px] text-rose-400 mt-1">{errors.cardExpiry}</p>}
                          </div>
                          <div>
                            <input
                              type="password"
                              name="cardCvv"
                              maxLength={4}
                              placeholder="CVV"
                              value={formData.cardCvv}
                              onChange={handleChange}
                              className="w-full px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-xs text-white placeholder-white/30 focus:border-[#C9A227] focus:outline-none"
                            />
                            {errors.cardCvv && <p className="text-[10px] text-rose-400 mt-1">{errors.cardCvv}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-[28px] bg-[#141414] border border-white/10 shadow-2xl space-y-6 sticky top-28">
              <h3 className="font-playfair text-xl font-bold text-white pb-3 border-b border-white/10">
                Order Review ({cart.reduce((a, b) => a + b.qty, 0)} Items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const pid = item.productId || item._id || item.id;
                  return (
                    <div key={pid} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover bg-black/50 border border-white/5 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair text-xs font-semibold text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-white/50">Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
                      </div>
                      <span className="font-sans font-bold text-xs text-white">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-white/70 pt-4 border-t border-white/10">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-white font-medium">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Courier</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                  <span>Total Amount Due</span>
                  <span className="text-[#C9A227]">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 cta-gradient font-bold text-xs uppercase tracking-wider text-black flex items-center justify-center gap-2 group disabled:opacity-50 hover:shadow-gold-glow"
              >
                {isSubmitting ? (
                  <span>Securing Order in Atelier...</span>
                ) : (
                  <>
                    <span>Confirm & Authorize Order</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="space-y-2 pt-2 text-[11px] text-white/40">
                <div className="flex items-center gap-2">
                  <Lock size={13} className="text-emerald-400 shrink-0" />
                  <span>256-Bit SSL End-to-End Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={13} className="text-[#C9A227] shrink-0" />
                  <span>Dispatches within 24 hours via BlueDart Air</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
