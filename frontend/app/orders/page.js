'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Search, Clock, CheckCircle2, Truck, Eye, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { fetchOrders } from '../../lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await fetchOrders();
        // Also merge any local orders from localStorage
        let localOrders = [];
        try {
          localOrders = JSON.parse(localStorage.getItem('stylelens_orders') || '[]');
        } catch (e) {}

        // Deduplicate by orderId or _id
        const orderMap = new Map();
        [...data, ...localOrders].forEach((ord) => {
          const key = ord.orderId || ord._id;
          if (key && !orderMap.has(key)) {
            orderMap.set(key, ord);
          }
        });

        setOrders(Array.from(orderMap.values()));
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.orderId && o.orderId.toLowerCase().includes(q)) ||
      (o.name && o.name.toLowerCase().includes(q)) ||
      (o.phone && o.phone.toLowerCase().includes(q)) ||
      (o.email && o.email.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status) => {
    const s = (status || 'placed').toLowerCase();
    if (s === 'delivered') {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
    if (s === 'shipped') {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
    if (s === 'processing') {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    return 'bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/40';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
          Client Consignment Ledger
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl font-extrabold text-white mt-1">
          Your Eyewear Orders
        </h1>
        <p className="text-xs sm:text-sm text-white/60 mt-2 font-light">
          Track the atelier assembly, lens calibration, and courier dispatch of your StyleLens frames.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Order ID (e.g. SL-), Name, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#141414] border border-white/10 rounded-full text-xs text-white placeholder-white/40 focus:border-[#C9A227] focus:outline-none shadow-xl"
          />
          <Search size={15} className="absolute left-3.5 top-3.5 text-white/40 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 max-w-4xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 rounded-[22px] bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="max-w-md mx-auto p-12 text-center rounded-[28px] bg-[#141414] border border-white/10 shadow-2xl">
          <Package size={36} className="mx-auto text-white/40 mb-3" />
          <h2 className="font-playfair text-xl font-bold text-white">No Orders Found</h2>
          <p className="text-xs text-white/50 mt-1 mb-6">
            {searchQuery
              ? 'No orders match your search query.'
              : 'You have not placed any orders yet. Discover our handcrafted collection.'}
          </p>
          <Link href="/shop" className="px-6 py-3 cta-gradient text-xs font-semibold">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredOrders.map((order) => {
            const dateStr = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recently placed';

            return (
              <div
                key={order.orderId || order._id}
                className="p-6 sm:p-7 rounded-[24px] bg-[#141414] border border-white/10 hover:border-[#C9A227]/30 shadow-xl transition-all space-y-5"
              >
                {/* Header row: ID, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">
                      Order Identifier
                    </span>
                    <span className="font-mono text-sm sm:text-base font-bold text-[#C9A227]">
                      {order.orderId || order._id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/50">{dateStr}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status || 'Placed'}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-black/40 border border-white/5 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                          <Package size={20} className="text-white/40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-playfair text-sm font-bold text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-white/50">
                          Quantity: {item.qty} × ₹{item.price?.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className="font-sans font-bold text-xs text-white">
                        ₹{(item.price * item.qty)?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer row: Client, Payment Mode, Total, Action */}
                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <p className="text-white/80">
                      Consignee: <strong className="text-white">{order.name}</strong> • {order.city}, {order.state}
                    </p>
                    <p className="text-white/40 text-[11px] mt-0.5">
                      Payment: {order.payment?.method || 'Cash on Delivery'} ({order.payment?.status || 'Pending'})
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider block sm:text-right">Total</span>
                      <span className="font-sans text-lg font-bold text-white">
                        ₹{order.total?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedOrderForTracking(order)}
                      className="px-4 py-2 rounded-full cta-secondary text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Truck size={13} className="text-[#C9A227]" />
                      <span>Track Dispatch</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tracking Modal */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#141414] border border-[#C9A227]/30 rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#C9A227] font-bold">Consignment Tracking</span>
                <h3 className="font-mono text-base font-bold text-white">{selectedOrderForTracking.orderId}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="p-1.5 rounded-full text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-6 relative pl-6 border-l-2 border-[#C9A227]/40 my-4 text-xs">
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#C9A227] border-2 border-black" />
                <h4 className="font-bold text-white text-sm">Order Placed & Registered</h4>
                <p className="text-white/50">Your order is logged and verified with StyleLens Atelier.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#C9A227] border-2 border-black" />
                <h4 className="font-bold text-white text-sm">Atelier Quality & Optical Inspection</h4>
                <p className="text-white/50">Lenses inspected for UV400 certification and frame symmetry.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-black" />
                <h4 className="font-bold text-emerald-400 text-sm">Dispatched via BlueDart Air</h4>
                <p className="text-white/50">En route to {selectedOrderForTracking.city}, {selectedOrderForTracking.pincode}.</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white/20 border-2 border-black" />
                <h4 className="font-semibold text-white/50 text-sm">Out for Doorstep Delivery</h4>
                <p className="text-white/40">Expected in 2 business days with 7-Day trial guarantee.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3 text-xs text-white/70">
              <MapPin size={18} className="text-[#C9A227] shrink-0" />
              <span>Destination: {selectedOrderForTracking.address}, {selectedOrderForTracking.city}</span>
            </div>

            <button
              onClick={() => setSelectedOrderForTracking(null)}
              className="w-full py-3 cta-gradient text-xs font-bold uppercase tracking-wider text-black"
            >
              Close Tracking Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
