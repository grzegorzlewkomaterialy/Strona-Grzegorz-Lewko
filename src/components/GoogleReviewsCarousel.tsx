import React, { useRef } from 'react';
import { Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export interface GoogleReviewItem {
  id: string;
  name: string;
  date?: string;
  avatarText?: string;
  avatarBg?: string;
  avatarImg?: string;
  rating: number;
  content: string;
  photos?: string[];
}

export const REVIEWS_LIST: GoogleReviewItem[] = [
  {
    id: 'rev-wegrzyn',
    name: 'Mikołaj Węgrzyn',
    avatarImg: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/wegrzyn.png',
    avatarText: 'MW',
    avatarBg: 'bg-[#5c4033]',
    rating: 5,
    content:
      'Bardzo sympatyczny, rodzinny zakład fryzjerski z wieloletnimi tradycjami. Ceny nie odbiegają od rynku a jakość usług jest najwyższa. Miła atmosfera i ogólny klimat salonu sprawiają że wizyty tutaj są zawsze przyjemnością. Polecam zwłaszcza jeśli ktoś docenia miejsca z tradycjami, niekoniecznie goniące za trendami "popularnych" salonów fryzjerskich.',
  },
  {
    id: 'rev-kasia',
    name: 'Kasia S',
    avatarImg: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/unnamed-1.png',
    avatarText: 'K',
    avatarBg: 'bg-[#34a853]',
    rating: 5,
    content: 'Wszystko super, polecam pania Olgę!',
  },
  {
    id: 'rev-rene',
    name: 'Rene Steyn',
    avatarImg: 'https://res.cloudinary.com/tgknav3s/image/upload/v1792757382/rene.png',
    avatarText: 'RS',
    avatarBg: 'bg-[#ea4335]',
    rating: 5,
    content:
      'Hairdresser for men. I love the vintage look and feel. Good price and good service. English speaking. Make an appointment in advance.',
    photos: [
      'https://res.cloudinary.com/tgknav3s/image/upload/v1792757499/salonzdjecieklienta.webp',
      'https://res.cloudinary.com/tgknav3s/image/upload/v1792757499/zdjecieklienta.jpg',
    ],
  },
  {
    id: 'rev-maurycy',
    name: 'Maurycy Torbicz',
    avatarImg: 'https://i.postimg.cc/DyvHVrL5/unnamed.png',
    avatarText: 'MT',
    avatarBg: 'bg-[#1a73e8]',
    rating: 5,
    content: 'Najlepszy fryzjer w Krakowie',
  },
  {
    id: 'rev-janusz',
    name: 'Janusz Olesiński',
    avatarImg: 'https://i.postimg.cc/0QvZYvCD/unnamed.png',
    avatarText: 'JO',
    avatarBg: 'bg-[#0f766e]',
    rating: 5,
    content:
      'Świetny fryzjer męski i damski. Kulturalna obsługa i wysokie kompetencje są dużym atutem tej firmy. Właściciel miły i zawsze uśmiechnięty. Bardzo polecam!',
  },
  {
    id: 'rev-marek-barnas',
    name: 'Marek Barnaś',
    avatarImg: 'https://res.cloudinary.com/tgknav3s/image/upload/v1792755889/unnamed-2.png',
    avatarText: 'MB',
    avatarBg: 'bg-[#5c4033]',
    rating: 5,
    content:
      'Salon prowadzony w klasycznym stylu. Właściciel, Pan Grzegorz, dba o jakość usług i wydaje się że znajduje to odzwieciedlenie w ilości stałych klientów. Jak wielu z Nich, z zadowoleniem korzystam z usług tego salonu od lat.',
  },
  {
    id: 'rev-magdalena-ostrowska',
    name: 'Magdalena Ostrowska',
    avatarImg: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/unnamed-2.png',
    avatarText: 'MO',
    avatarBg: 'bg-[#b05286]',
    rating: 5,
    content: 'Przyjęto mnie bez rezerwacji. Pani bardzo delikatna i wyrozumiała.',
  },
  {
    id: 'rev-sonia-sonia',
    name: 'Sonia sonia',
    avatarImg: 'https://res.cloudinary.com/tgknav3s/image/upload/v1792757211/sonia.png',
    avatarText: 'S',
    avatarBg: 'bg-[#9333ea]',
    rating: 5,
    content: 'Super atmosfera i Pani Olga która potrafi wyczarować cuda na głowie....dziękujemy 🥰😍',
  },
  {
    id: 'rev-jack-przekop',
    name: 'Jack Przekop',
    avatarImg: 'https://res.cloudinary.com/tgknav3s/image/upload/v1792757338/unnamed-4.png',
    avatarText: 'JP',
    avatarBg: 'bg-[#1e40af]',
    rating: 5,
    content:
      'Jeden z najlepszych jeśli nie najlepszy Barber w Krakowie. Prosić o Panią Stasie. One of the best if not the BEST Barbershop in Krakow, I highly recommend. QUALITY STYLE and CLASS built on tradition. (ask for Pani Stasia).',
  },
  {
    id: 'rev-jack-m',
    name: 'Jack M.',
    avatarImg: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/unnamed-3.png',
    avatarText: 'JM',
    avatarBg: 'bg-[#2563eb]',
    rating: 5,
    content:
      'Od 1996 roku już (wow!) jestem zadowolonym klientem Zakładu. Głównie u Pani Stasi i u Pana Grzegorza! Polecam !',
  },
];

export const GoogleReviewsCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Duplicated list creates a seamless, infinite loop
  const loopList = [...REVIEWS_LIST, ...REVIEWS_LIST];

  const handleScrollManual = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="opinie-google"
      className="bg-white text-neutral-900 py-16 sm:py-20 border-b border-neutral-200 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header exact match to Google Reviews block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div>
            {/* Google Logo text + "Rating" */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight inline-flex items-center">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
              <span className="text-2xl sm:text-3xl font-medium text-neutral-900 tracking-tight">
                Rating
              </span>
            </div>

            {/* Rating Stars and count */}
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-950 font-sans tabular-nums">
                4.8
              </span>
              <div className="flex items-center gap-1 text-[#FBBC04]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FBBC04] text-[#FBBC04]" />
                ))}
              </div>
              <span className="text-sm text-neutral-500 font-normal">
                339 opinii Google
              </span>
            </div>
          </div>

          {/* Action buttons: Write Review and navigation arrows */}
          <div className="flex items-center gap-3">
            <a
              href="https://g.page/r/CWHE7M5_AUTmEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Napisz Opinię</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>

            {/* Manual arrows to shift view */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleScrollManual('left')}
                className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Przewiń w lewo"
                aria-label="Przewiń w lewo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleScrollManual('right')}
                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-900 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                title="Przewiń w prawo"
                aria-label="Przewiń w prawo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTINUOUS MARQUEE TRACK (moves smoothly from right to left) */}
      <div className="relative w-full">
        {/* Soft edge fade left */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />

        {/* Soft edge fade right */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-20 md:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-none py-4 px-2"
        >
          <div
            className="animate-reviews-marquee hover:[animation-play-state:paused]"
          >
            {loopList.map((review, idx) => (
              <div
                key={`${review.id}-${idx}`}
                className="w-[300px] sm:w-[360px] md:w-[410px] shrink-0 mx-3 bg-white rounded-2xl border border-neutral-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[260px] hover:border-neutral-300"
              >
                <div>
                  {/* Reviewer Header */}
                  <div className="flex items-center gap-3 mb-2.5">
                    {review.avatarImg ? (
                      <img
                        src={review.avatarImg}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-neutral-100"
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full ${review.avatarBg} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-inner`}
                      >
                        {review.avatarText}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-neutral-900 leading-tight truncate">
                        {review.name}
                      </h4>
                      <div className="flex items-center gap-0.5 text-[#FBBC04] mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#FBBC04] text-[#FBBC04]" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-light mt-3 line-clamp-4">
                    {review.content}
                  </p>

                  {/* Review Photos (if any, e.g. Rene Steyn) */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 pt-1">
                      {review.photos.map((photoUrl, pIdx) => (
                        <a
                          key={pIdx}
                          href={photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 hover:opacity-90 transition-opacity shrink-0 shadow-xs group"
                          title="Zobacz powiększone zdjęcie"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <img
                            src={photoUrl}
                            alt={`Zdjęcie dodane przez ${review.name} (${pIdx + 1})`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Left: Google Logo + Posted on Google */}
                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      Posted on <span className="font-semibold text-neutral-700">Google</span>
                    </span>
                  </div>
                  <a
                    href="https://g.page/r/CWHE7M5_AUTmEBM/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#1a73e8] hover:underline font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Oryginał
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
