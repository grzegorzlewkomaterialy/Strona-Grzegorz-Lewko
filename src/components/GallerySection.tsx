import React from 'react';
import { Phone } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

// 3 prominent / VIP figures who visited the barbershop
export interface VipGuest {
  id: number;
  name: string;
  role: string;
  img?: string;
}

const VIP_GUESTS: VipGuest[] = [
  {
    id: 1,
    name: 'Robert Makłowicz',
    role: 'Dziennikarz, krytyk kulinarny, pisarz',
    img: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/655233636_18132272335526924_3732512341570730985_n.jpg',
  },
  {
    id: 2,
    name: 'Jan Monczka',
    role: 'Aktor',
    img: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/jan-monczka.jpg',
  },
  {
    id: 3,
    name: 'Janusz Muniak',
    role: 'Polski muzyk jazzowy',
    img: 'https://res.cloudinary.com/tgknav3s/image/upload/v1794943553/janusz-muniak.jpg',
  },
];

// 24 slots (grid 3 x 8)
export interface GallerySlot {
  id: number;
  img?: string;
  title?: string;
  objectPosition?: string;
}

const GALLERY_CONFIG: Record<number, { url: string; objectPosition?: string }> = {
  1: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/842281604_18116470786973750_330887463520530068_n.webp' },
  2: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/656034090_18074707433162991_5780057782947972758_n.jpg' },
  3: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/654111794_18062015540409455_8501769147987431629_n.jpg' },
  4: {
    url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/670337565_18526976068076035_3415428726271431534_n.jpg',
    objectPosition: 'center top',
  },
  5: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/656299024_18177234034383926_1295502308629581771_n.jpg' },
  6: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/670014533_18336953431170361_4729533133700662114_n.jpg' },
  7: {
    url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/651744393_17996162342752321_3796808083549480366_n.jpg',
    objectPosition: 'center top',
  },
  8: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/649845826_18011577626832399_7447108658568021265_n.jpg' },
  9: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/660782677_18418863715123707_1267646489667391479_n.jpg' },
  10: {
    url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/650895620_18014237645829876_2441765729232024236_n.jpg',
    objectPosition: 'center top',
  },
  11: {
    url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/651910979_18097004005972575_2422847350359282472_n.jpg',
    objectPosition: 'center top',
  },
  12: {
    url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/653560664_17993695568759117_4022961304395373535_n.jpg',
    objectPosition: 'center top',
  },
  13: {
    url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/652772820_18070581545220746_5584251367065890360_n.jpg',
    objectPosition: 'center top',
  },
  14: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/657689792_18078453026420219_4717116868589347415_n.jpg' },
  15: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/654027268_18103657370295902_7663749246466253474_n.jpg' },
  16: {
    url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/656723283_18108343816831943_2163839695114133533_n.jpg',
    objectPosition: 'center top',
  },
  17: {
    url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/655171562_18091152032146050_8850370059508854968_n.jpg',
    objectPosition: 'center top',
  },
  18: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/663016012_18582579964007009_6753339247998489158_n_1.jpg' },
  19: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/655069063_18134005783520354_45079169823687200_n.jpg' },
  20: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/655577852_18094023902029942_6426300384744926141_n.jpg' },
  21: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/649080653_17948368401069792_5515592991048096326_n.jpg' },
  22: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/656148596_18104976487715389_8951915747242563792_n.jpg' },
  23: {
    url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/624579644_18080408735352221_4959383100508426004_n.jpg',
    objectPosition: 'center 20%',
  },
  24: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/653923624_18064581980654406_7134270573158220463_n.jpg' },
};

// Initial 24 slots with X placeholders ready for real haircut photos
const INITIAL_SLOTS: GallerySlot[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: `Fryzura ${i + 1}`,
  img: GALLERY_CONFIG[i + 1]?.url,
  objectPosition: GALLERY_CONFIG[i + 1]?.objectPosition,
}));

// Konfiguracja 9 slotów dla Pań
export const WOMEN_GALLERY_CONFIG: Record<number, { url: string; objectPosition?: string }> = {
  1: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/660760756_18171945082363046_3773721627736673036_n.jpg' },
  2: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/575950580_18083873617973750_1568151489952672017_n.webp' },
  3: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/656418982_18080221070098755_6856312565870972838_n.jpg' },
  4: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/669850780_18458932516099346_8259727695233320555_n.jpg' },
  5: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/618802670_17884317099324931_2066756138573174874_n.jpg' },
  6: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/v1792931453/654203525_18064543928656396_1749028491946098908_n.jpg' },
  7: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/v1792931431/655181288_18106314790848568_1578841263159968533_n.jpg' },
  8: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/v1792931445/641296724_18060543992400828_6711385847502943030_n.jpg' },
  9: { url: 'https://res.cloudinary.com/tgknav3s/image/upload/v1792932068/651786606_18094548344043691_4174042665138008695_n.jpg' },
};

const WOMEN_SLOTS: GallerySlot[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  title: `Fryzura damska ${i + 1}`,
  img: WOMEN_GALLERY_CONFIG[i + 1]?.url,
  objectPosition: WOMEN_GALLERY_CONFIG[i + 1]?.objectPosition,
}));

export const GallerySection: React.FC = () => {
  return (
    <>
      {/* Czarna sekcja z przyciskiem do umówienia wizyty telefonicznie */}
      <div className="bg-[#0d0d0d] text-white py-12 sm:py-16 text-center border-t border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
            Zadzwoń i Umów Wizytę:
          </h2>
          <a
            href={`tel:${SALON_INFO.phonePrimary.replace(/\s+/g, '')}`}
            className="btn-gold px-8 sm:px-12 py-4 rounded-none text-sm sm:text-base font-bold uppercase tracking-wider shadow-xl hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-2.5"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-950" />
            <span>{SALON_INFO.phonePrimary}</span>
          </a>
        </div>
      </div>

      {/* Sekcja z gośćmi i Galerią Fryzur */}
      <section id="galeria" className="bg-white text-neutral-900 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Sekcja: Zaufali nam między innymi: */}
          <div className="mb-14 sm:mb-16">
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                Zaufali nam między innymi:
              </h3>
            </div>

            {/* Siatka 3 osobistości w jednym rzędzie - squared */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {VIP_GUESTS.map((guest) => (
                <div
                  key={guest.id}
                  className="bg-white rounded-none border border-neutral-200 shadow-xs hover:border-[#d4af37] hover:shadow-md transition-all flex flex-col overflow-hidden group p-3 sm:p-4 text-center"
                >
                  {/* Ramka na zdjęcie */}
                  <div className="w-full aspect-[4/5] rounded-none overflow-hidden bg-neutral-100 border border-neutral-200/80 flex items-center justify-center relative mb-3">
                    {guest.img ? (
                      <img
                        src={guest.img}
                        alt={guest.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-3 text-neutral-400 group-hover:text-neutral-600 select-none">
                        <span className="text-2xl sm:text-3xl font-mono font-black text-neutral-300 group-hover:text-[#d4af37] transition-colors mb-1">
                          ✕
                        </span>
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                          Zdjęcie #{guest.id}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Miejsce na podpis: Imię + rola/tytuł */}
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                    {guest.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-500 font-normal mt-1 leading-snug">
                    {guest.role}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tytuł galerii - Portfolio Męskie */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
              Portfolio Męskie
            </h2>
          </div>

          {/* Grid 3x8 (3 kolumny x 8 wierszy = 24 zdjęcia / sloty) - squared */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {INITIAL_SLOTS.map((slot) => (
              <div
                key={slot.id}
                className={`aspect-square rounded-none transition-all group cursor-pointer relative overflow-hidden ${
                  slot.img
                    ? 'p-0 border-0 shadow-sm hover:shadow-md'
                    : 'border border-dashed border-neutral-300 hover:border-[#d4af37] bg-neutral-50 hover:bg-neutral-100/90 flex flex-col items-center justify-center p-3 sm:p-4 shadow-xs'
                }`}
              >
                {slot.img ? (
                  <img
                    src={slot.img}
                    alt={slot.title || `Fryzura ${slot.id}`}
                    style={slot.objectPosition ? { objectPosition: slot.objectPosition } : undefined}
                    className="w-full h-full object-cover rounded-none"
                  />
                ) : (
                  <div className="text-center select-none">
                    <span className="text-2xl sm:text-3xl font-black text-neutral-300 group-hover:text-[#d4af37] transition-colors block mb-1 font-mono">
                      ✕
                    </span>
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-neutral-400 group-hover:text-neutral-600 transition-colors">
                      Zdjęcie #{slot.id}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sekcja dla Pań - Portfolio Damskie - squared */}
          <div className="mt-10 sm:mt-14">
            <div className="text-center mb-8 sm:mb-10">
              <h3 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
                Portfolio Damskie
              </h3>
            </div>

            {/* Grid 3x3 = 9 miejsc na zdjęcia - squared */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {WOMEN_SLOTS.map((slot) => (
                <div
                  key={slot.id}
                  className={`aspect-[3/4] rounded-none transition-all group cursor-pointer relative overflow-hidden ${
                    slot.img
                      ? 'p-0 border-0 shadow-sm hover:shadow-md'
                      : 'border border-dashed border-neutral-300 hover:border-[#d4af37] bg-neutral-50 hover:bg-neutral-100/90 flex flex-col items-center justify-center p-3 sm:p-4 shadow-xs'
                  }`}
                >
                  {slot.img ? (
                    <img
                      src={slot.img}
                      alt={slot.title || `Fryzura damska ${slot.id}`}
                      style={slot.objectPosition ? { objectPosition: slot.objectPosition } : undefined}
                      className="w-full h-full object-cover rounded-none"
                    />
                  ) : (
                    <div className="text-center select-none">
                      <span className="text-2xl sm:text-3xl font-black text-neutral-300 group-hover:text-[#d4af37] transition-colors block mb-1 font-mono">
                        ✕
                      </span>
                      <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-neutral-400 group-hover:text-neutral-600 transition-colors">
                        Zdjęcie damskie #{slot.id}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
