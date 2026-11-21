import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export default function TrustBadges() {
  const perks = [
    {
      icon: Truck,
      title: 'Free Express Courier',
      desc: 'Complimentary expedited delivery on all orders over ₹999 across India.'
    },
    {
      icon: Award,
      title: 'Aerospace UV400 Optics',
      desc: 'Triacetate polarized lenses blocking 100% harmful UVA, UVB & blue rays.'
    },
    {
      icon: RotateCcw,
      title: '7-Day Home Trial',
      desc: 'Try at home. If the fit isn’t perfection, enjoy effortless door-step returns.'
    },
    {
      icon: ShieldCheck,
      title: '1-Year Frame Warranty',
      desc: 'Comprehensive coverage against manufacturing defects and hinge wear.'
    }
  ];

  return (
    <section className="py-12 bg-[#0E0E0E] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-[20px] bg-white/[0.02] border border-white/5 hover:border-[#C9A227]/30 transition-all group"
              >
                <div className="p-3 rounded-2xl bg-[#C9A227]/10 text-[#C9A227] group-hover:scale-110 transition-transform shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="font-playfair text-sm font-bold text-white group-hover:text-[#C9A227] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
