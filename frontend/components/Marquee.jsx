'use client';

import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Star, Award } from 'lucide-react';

export default function Marquee() {
  const highlights = [
    { icon: Truck, text: 'FREE EXPRESS COURIER ACROSS INDIA' },
    { icon: Award, text: '100% UV400 POLARIZED OPTICS' },
    { icon: RotateCcw, text: '7-DAY HASSLE-FREE HOME TRIAL' },
    { icon: Star, text: '4.9★ RATED BY 25,000+ CONNOISSEURS' },
    { icon: ShieldCheck, text: 'CASH ON DELIVERY & SECURE UPI' },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-[#0F0E0A] via-[#1A170F] to-[#0F0E0A] border-y border-[#C9A227]/20 py-2.5 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee items-center gap-12 text-[11px] sm:text-xs font-medium tracking-[0.2em] text-[#C9A227]">
        {[...highlights, ...highlights, ...highlights].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 shrink-0 opacity-90 hover:opacity-100 transition-opacity">
              <Icon size={13} className="text-[#DFB83E]" />
              <span>{item.text}</span>
              <span className="text-white/20 mx-2">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
