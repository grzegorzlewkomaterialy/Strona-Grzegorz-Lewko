import React from 'react';
import { Scissors, Sparkles, Palette, Droplets } from 'lucide-react';

interface ServicesSectionProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const cards = [
    {
      id: 'meskie',
      title: 'Strzyżenie męskie',
      icon: Scissors,
    },
    {
      id: 'damskie',
      title: 'Strzyżenie damskie',
      icon: Sparkles,
    },
    {
      id: 'farbowanie',
      title: 'Farbowanie włosów',
      icon: Palette,
    },
    {
      id: 'pielegnacja',
      title: 'Pielęgnacja',
      icon: Droplets,
    },
  ];

  return (
    <section id="co-robimy" className="bg-[#0c0c0c] text-white py-14 sm:py-16 border-t border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Kicker & Title */}
        <span className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-[#d4af37] block mb-2">
          USŁUGI
        </span>
        <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-8 sm:mb-10">
          Co robimy
        </h2>

        {/* 4 Service Cards Grid (zmniejszone, bez podtytułów i bez zbędnych animacji) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedCategory === card.id;

            return (
              <button
                key={card.id}
                onClick={() => onSelectCategory(card.id)}
                className={`flex flex-col items-center justify-center p-5 sm:p-6 rounded-none border text-center cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-neutral-900 border-[#d4af37]'
                    : 'bg-[#141414] border-neutral-800 hover:border-neutral-700 hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="w-11 h-11 rounded-none bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#d4af37] mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white tracking-wide">
                  {card.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Link to Full SEO Services Hub */}
        <div className="mt-8 flex justify-center">
          <a
            href="#uslugi"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-400 hover:text-[#d4af37] transition-colors bg-neutral-900/60 border border-neutral-800 px-5 py-2.5"
          >
            <span>Zobacz dedykowane podstrony i poradniki wszystkich 15 usług</span>
            <span className="text-[#d4af37]">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
