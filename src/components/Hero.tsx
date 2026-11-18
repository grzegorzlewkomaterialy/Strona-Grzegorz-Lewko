import React from 'react';
import { ChevronDown, Phone, Tag } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[580px] sm:min-h-[680px] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#0d0d0d] pt-16 sm:pt-20">
      {/* Background Image fitted edge-to-edge with natural vertical framing without cropping heads */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://i.postimg.cc/XNDcJndk/Maklowicz-zdjecie-w-tle.png"
          alt="Fryzjer Polski - Grzegorz Lewko Kraków"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[center_25%]"
        />
        {/* Subtle overlay slightly darkened for enhanced contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center flex flex-col items-center">
        {/* Location & Year Kicker */}
        <div className="inline-flex items-center gap-2 mb-6 text-xs sm:text-sm font-semibold tracking-[0.28em] uppercase text-[#d4af37]">
          <span>KRAKÓW</span>
          <span className="text-neutral-500 font-light">·</span>
          <span>OD 1963 ROKU</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl text-balance drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] leading-[1.1]">
          Fryzjer Męski i Damski Kraków
        </h1>

        {/* H2 Subheadings */}
        <h2 className="text-base sm:text-xl text-neutral-100 font-normal max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] flex flex-col items-center gap-1">
          <span>Strzyżenie męskie i barber</span>
          <span>Trymowanie i pielęgnacja brody</span>
          <span>Fryzjer damski (strzyżenie i stylizacja)</span>
          <span>Koloryzacja</span>
        </h2>

        {/* Action Buttons - squared */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            href={`tel:${SALON_INFO.phonePrimary.replace(/\s+/g, '')}`}
            className="btn-gold w-full sm:w-auto px-8 py-4 rounded-none text-sm sm:text-base font-semibold tracking-wide flex items-center justify-center gap-3 cursor-pointer shadow-lg"
          >
            <Phone className="w-5 h-5 text-neutral-950" />
            <span>{SALON_INFO.phonePrimary}</span>
          </a>

          <a
            href="#cennik"
            className="w-full sm:w-auto px-6 py-4 rounded-none text-sm sm:text-base font-medium text-neutral-200 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 transition-all flex items-center justify-center gap-2"
          >
            <Tag className="w-4 h-4 text-[#d4af37]" />
            <span>Cennik</span>
          </a>
        </div>

        {/* Chevron Scroll Down */}
        <a
          href="#statystyki"
          className="mt-16 text-neutral-400 hover:text-[#d4af37] transition-colors p-2 animate-bounce flex flex-col items-center gap-1"
          aria-label="Przewiń niżej"
        >
          <ChevronDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
};
