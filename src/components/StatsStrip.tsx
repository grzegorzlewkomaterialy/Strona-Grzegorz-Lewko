import React from 'react';
import { SALON_INFO } from '../data/salonData';

interface StatsStripProps {
  id?: string;
}

export const StatsStrip: React.FC<StatsStripProps> = ({ id = "statystyki" }) => {
  return (
    <div id={id} className="bg-[#f8f6f0] text-neutral-900 border-y border-black py-0">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-black">
          {SALON_INFO.stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center text-center px-3 sm:px-4 py-5 sm:py-6"
            >
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#a67a22] tracking-tight tabular-nums font-sans">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.18em] text-neutral-800 uppercase mt-1.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
