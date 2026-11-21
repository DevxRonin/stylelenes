import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export default function ReviewCard({ name, role, review, rating, modelBought, date }) {
  return (
    <div className="flex flex-col justify-between p-6 rounded-[22px] bg-[#141414] border border-white/5 hover:border-[#C9A227]/30 transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex text-amber-400">
            {[...Array(rating || 5)].map((_, i) => (
              <Star key={i} size={14} className="fill-amber-400" />
            ))}
          </div>
          <span className="text-[11px] text-white/40">{date || 'Verified Purchase'}</span>
        </div>

        <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic line-clamp-4">
          &ldquo;{review}&rdquo;
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div>
          <h4 className="font-playfair text-sm font-semibold text-white flex items-center gap-1.5">
            {name}
            <CheckCircle size={13} className="text-emerald-400" />
          </h4>
          <p className="text-[11px] text-white/50">{role}</p>
        </div>
        {modelBought && (
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-[#C9A227] border border-[#C9A227]/20 font-medium">
            {modelBought}
          </span>
        )}
      </div>
    </div>
  );
}
