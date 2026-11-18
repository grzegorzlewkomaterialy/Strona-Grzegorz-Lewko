import React from 'react';
import { ArrowLeft, Phone } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

interface SalonPageProps {
  onBackToHome: () => void;
  onNavigateToServices?: () => void;
}

export const SalonPage: React.FC<SalonPageProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-neutral-100 pt-24 sm:pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8 flex items-center">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-400 hover:text-[#d4af37] bg-neutral-900 border border-neutral-800 px-4 py-2 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Powrót do strony głównej</span>
          </button>
        </div>

        {/* Main Hero Header */}
        <header className="mb-12 sm:mb-16 bg-neutral-900/60 border border-neutral-800 p-6 sm:p-10 text-center">
          <h1 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Historia salonu
          </h1>
        </header>

        {/* Section 1: Historia + Zdjęcie 1 */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center mb-14 sm:mb-20">
          <div className="md:col-span-5">
            <div className="w-full max-w-[360px] mx-auto md:max-w-none aspect-[3/4] overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950">
              <img
                src="https://res.cloudinary.com/tgknav3s/image/upload/v1794952093/images_design_page_layout_artykul-1.webp"
                alt="Rodzinny salon fryzjerski w Krakowie od 1963 roku"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          <div className="md:col-span-7 space-y-5 text-base sm:text-lg text-neutral-300 font-light leading-relaxed bg-[#121212] border border-neutral-800/80 p-6 sm:p-8">
            <p>
              Od 1963 roku, nieprzerwanie, strzyżemy krakowian. Zaczęliśmy w Hotelu Polskim, w jednym z najbardziej znanych miejsc w mieście, i przez kolejne dekady byliśmy tam dla stałych klientów, a także dla gości z całej Polski i zagranicy.
            </p>
            <p>
              Dziś salon prowadzi Grzegorz Lewko. To rodzinna firma, więc u nas liczy się to, co zostaje w zawodzie na lata: doświadczenie, dokładność i indywidualne podejście do każdego klienta.
            </p>
          </div>
        </section>

        {/* Section 2: Nowy adres & Co robimy + Zdjęcie 2 */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center mb-16">
          <div className="md:col-span-7 order-2 md:order-1 space-y-8 bg-[#121212] border border-neutral-800/80 p-6 sm:p-8">
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] inline-block shrink-0" />
                <span>Zmienił się adres, nie zmieniła się atmosfera</span>
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                Po latach w Hotelu Polskim salon przeniósł się na ul. Karmelicką 25, jedną z najsłynniejszych krakowskich ulic. Zostali ci sami fryzjerzy i ta sama miła, rodzinna atmosfera.
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-neutral-800/80">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#d4af37] inline-block shrink-0" />
                <span>Co robimy</span>
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                Wykonujemy klasyczne strzyżenia damskie i męskie, koloryzację, modelowanie, strzyżenie brody i fryzury okolicznościowe. Pracujemy na profesjonalnych kosmetykach MONTIBELLO, KEMON, CLUBMAN i MORGANS, które można u nas kupić. Salon jest laureatem plebiscytu Orły Fryzjerstwa.
              </p>
              <p className="text-base sm:text-lg text-[#d4af37] font-semibold pt-2">
                Ponad 60 lat na rynku to dla nas zobowiązanie. Zapraszamy.
              </p>
            </div>
          </div>

          <div className="md:col-span-5 order-1 md:order-2">
            <div className="w-full max-w-[360px] mx-auto md:max-w-none aspect-[3/4] overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950">
              <img
                src="https://res.cloudinary.com/tgknav3s/image/upload/v1794952111/podstrona-img-1.jpg"
                alt="Salon Fryzjerski Grzegorz Lewko przy ul. Karmelickiej 25 w Krakowie"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="bg-neutral-900/60 border border-neutral-800 p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
            Zadzwoń i Umów Wizytę
          </h2>
          <a
            href={`tel:${SALON_INFO.phonePrimary.replace(/\s+/g, '')}`}
            className="btn-gold inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-bold shadow-lg cursor-pointer"
          >
            <Phone className="w-4 h-4 text-neutral-950" />
            <span>{SALON_INFO.phonePrimary}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
