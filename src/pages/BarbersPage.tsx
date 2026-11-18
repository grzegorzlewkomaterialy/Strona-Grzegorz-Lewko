import React from 'react';
import { SALON_INFO } from '../data/salonData';
import { ArrowLeft, Phone } from 'lucide-react';

interface BarbersPageProps {
  onBackToHome: () => void;
}

export const BarbersPage: React.FC<BarbersPageProps> = ({
  onBackToHome,
}) => {
  const barbers = [
    {
      id: 'grzegorz',
      name: 'Grzegorz',
      title: 'Barber i fryzjer męski',
      image:
        'https://res.cloudinary.com/tgknav3s/image/upload/v1794947021/1000007757.jpg',
      description:
        'Grzegorz w swojej pracy dba o najmniejsze szczegóły, doradza i dobiera fryzurę i stylizacje brody indywidualnie do klienta. Każdy z nas ma inny kształt głowy i twarzy, dlatego tylko takie podejście daje zadowalające rezultaty.',
    },
    {
      id: 'piotr',
      name: 'Piotr',
      title: 'Barber',
      image:
        'https://res.cloudinary.com/tgknav3s/image/upload/v1794947006/1000007755.jpg',
      description:
        'Specjalista w klasycznych oraz nowoczesnych fryzurach męskich, precyzyjnych cieniowaniach i stylizacji męskiego zarostu.',
    },
    {
      id: 'stasia',
      name: 'Stasia',
      title: 'Fryzjerka & Stylistka',
      image:
        'https://res.cloudinary.com/tgknav3s/image/upload/v1794947027/1000007717.jpg',
      description:
        'Wieloletnie rzemiosło w precyzyjnych cięciach nożyczkowych, układaniu fryzur oraz indywidualnym doborze formy do rysów twarzy.',
    },
    {
      id: 'olga',
      name: 'Olga',
      title: 'Fryzjerka & Stylistka',
      image:
        'https://res.cloudinary.com/tgknav3s/image/upload/v1794947013/1000007754.jpg',
      description:
        'Dbałość o detale, kunszt nożyczkowy i profesjonalne podejście do każdego klienta w przyjaznej, serdecznej atmosferze.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-neutral-100 pt-0 pb-0 flex flex-col justify-between">
      {/* Page Header Banner with photo edge-to-edge full width from very top of the page */}
      <div className="relative w-full min-h-[360px] sm:min-h-[440px] md:min-h-[480px] flex flex-col justify-end overflow-hidden mb-12 border-b border-neutral-800">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/tgknav3s/image/upload/v1794947411/1000007765.jpg"
            alt="Umywalka i stanowiska fryzjerskie"
            className="w-full h-full object-cover object-[center_35%] filter brightness-[0.55] contrast-105"
          />
          {/* Elegant dark gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/60 to-[#0e0e0e]/50" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-12 sm:pb-16 text-center">
          {/* Back Link / Breadcrumb */}
          <div className="mb-6 flex justify-start">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-[#d4af37] bg-black/50 hover:bg-black/75 backdrop-blur-xs px-3.5 py-1.5 rounded-none border border-neutral-700/60 transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Powrót do strony głównej</span>
            </button>
          </div>

          <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)]">
            Nasi Fryzjerzy
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Barbers List - Unified on single black background, alternating layout */}
        <div className="space-y-16 sm:space-y-24 mb-20">
          {barbers.map((barber, index) => {
            const isImageRight = index % 2 === 1;
            return (
              <div
                key={barber.id}
                className={`flex flex-col ${
                  isImageRight ? 'md:flex-row-reverse' : 'md:flex-row'
                } items-center gap-8 md:gap-12 lg:gap-16`}
              >
                {/* Large Barber Photo */}
                <div className="w-full max-w-[360px] sm:max-w-none sm:w-80 md:w-96 lg:w-[400px] aspect-[3/4] rounded-none overflow-hidden border border-neutral-800 shadow-2xl shrink-0 relative group">
                  <img
                    src={barber.image}
                    alt={`${barber.name} - ${barber.title}`}
                    className="w-full h-full object-cover object-[center_55%] filter brightness-95 contrast-105 transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left flex flex-col justify-center py-2">
                  <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2">
                    {barber.name}
                  </h2>
                  <p className="text-base sm:text-lg font-semibold text-[#d4af37] mb-5 tracking-wide">
                    {barber.title}
                  </p>
                  <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-xl">
                    {barber.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edge-to-edge full width white section */}
      <section className="w-full bg-white text-neutral-900 py-16 sm:py-24 border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
          <span className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-[#a67a22] mb-3">
            DOBRY FRYZJER KRAKÓW
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 tracking-tight mb-3">
            Szukasz dobrego fryzjera?
          </h2>
          <p className="text-base sm:text-xl text-neutral-600 font-normal mb-8 max-w-xl">
            Umów się i sprawdź nas!
          </p>
          <div className="flex items-center justify-center w-full sm:w-auto">
            <a
              href={`tel:${SALON_INFO.phonePrimary.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto btn-gold px-8 py-3.5 rounded-none text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Phone className="w-4 h-4 text-neutral-950" />
              <span>{SALON_INFO.phonePrimary}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
