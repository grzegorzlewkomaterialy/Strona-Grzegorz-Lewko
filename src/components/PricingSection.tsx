import React from 'react';
import { Phone } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

interface PricingSectionProps {
  activeCategoryFilter?: string;
  setActiveCategoryFilter?: (cat: string) => void;
}

interface LengthPricingRow {
  name: string;
  short?: string;
  medium?: string;
  long?: string;
}

interface FlatPricingRow {
  name: string;
  price: string;
}

const WOMEN_LENGTH_PRICES: LengthPricingRow[] = [
  { name: 'Strzyżenie', short: '90 zł', medium: '100 zł', long: 'od 115 zł' },
  { name: 'Mycie, strzyżenie, suszenie', short: '110 zł', medium: '135 zł', long: 'od 165 zł' },
  { name: 'Mycie i modelowanie', short: '70 zł', medium: '100 zł', long: 'od 125 zł' },
  { name: 'Mycie, modelowanie i prostowanie', medium: '115 zł', long: 'od 155 zł' },
  { name: 'Mycie, strzyżenie i modelowanie', short: '125 zł', medium: '155 zł', long: 'od 185 zł' },
  { name: 'Trwała ondulacja', short: '175 zł', medium: '235 zł', long: 'od 360 zł' },
  { name: 'Trwała ondulacja, strzyżenie i modelowanie', short: '260 zł', medium: '310 zł', long: 'od 410 zł' },
  { name: 'Koloryzacja, modelowanie', short: '210 zł', medium: '240 zł', long: 'od 330 zł' },
  { name: 'Koloryzacja, strzyżenie i modelowanie', short: '260 zł', medium: '310 zł', long: 'od 410 zł' },
  { name: 'Pasemka, balayage, modelowanie', short: '260 zł', medium: '340 zł', long: 'od 460 zł' },
  { name: 'Pasemka, balayage, strzyżenie i modelowanie', short: '325 zł', medium: '420 zł', long: 'od 510 zł' },
  { name: 'Koloryzacja, pasemka, strzyżenie i modelowanie', short: '360 zł', medium: '460 zł', long: 'od 530 zł' },
];

const WOMEN_OTHER_PRICES: FlatPricingRow[] = [
  { name: 'Dekoloryzacja', price: 'od 350 zł do 600 zł' },
  { name: 'Fryzura okolicznościowa (upięcie, kok)', price: 'od 200 do 270 zł' },
  { name: 'Ombre, sombre, strzyżenie i modelowanie', price: 'od 500 zł' },
  { name: 'Zabieg pielęgnacyjny', price: 'od 135 zł' },
  { name: 'Strzyżenie grzywki', price: '37 zł' },
];

const MEN_LENGTH_PRICES: LengthPricingRow[] = [
  { name: 'Strzyżenie', short: '90 zł', medium: '100 zł', long: 'od 120 zł' },
  { name: 'Strzyżenie i mycie', short: '100 zł', medium: '110 zł', long: 'od 130 zł' },
  { name: 'Odsiwianie', short: '155 zł', medium: '185 zł', long: 'od 220 zł' },
  { name: 'Mycie i modelowanie', short: '65 zł', medium: '80 zł', long: 'od 95 zł' },
  { name: 'Mycie, strzyżenie i modelowanie', short: '125 zł', medium: '135 zł', long: 'od 170 zł' },
  { name: 'Odsiwianie, strzyżenie i modelowanie', short: '180 zł', medium: '210 zł', long: 'od 300 zł' },
  { name: 'Strzyżenie włosów i brody', short: '135 zł', medium: '155 zł', long: 'od 175 zł' },
  { name: 'Strzyżenie włosów i wąsów', short: '100 zł', medium: '110 zł', long: 'od 135 zł' },
];

const MEN_OTHER_PRICES: FlatPricingRow[] = [
  { name: 'Strzyżenie maszynką (jedna długość)', price: '80 zł' },
  { name: 'Golenie twarzy', price: '75 zł' },
  { name: 'Golenie głowy', price: '85 zł' },
  { name: 'Strzyżenie brody', price: '65 zł' },
  { name: 'Strzyżenie wąsów', price: '20 zł' },
  { name: 'Strzyżenie brody z częściowym wygoleniem twarzy', price: '85 zł' },
  { name: 'Strzyżenie i farbowanie brody', price: '125 zł' },
];

interface PricingCategoryBlockProps {
  title: string;
  lengthRows: LengthPricingRow[];
  otherRows: FlatPricingRow[];
  footnote: string;
}

const PricingCategoryBlock: React.FC<PricingCategoryBlockProps> = ({
  title,
  lengthRows,
  otherRows,
  footnote,
}) => (
  <div className="mb-14 last:mb-10">
    {/* Category Title */}
    <div className="flex items-center gap-4 mb-5">
      <h3 className="font-sans text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
        {title}
      </h3>
      <span className="h-px flex-1 bg-neutral-200" />
    </div>

    {/* Desktop / Tablet Matrix Table */}
    <div className="hidden sm:block border border-neutral-200 bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-neutral-950 text-white text-xs uppercase tracking-wider">
            <th className="py-3.5 px-4 font-semibold">Usługa</th>
            <th className="py-3.5 px-4 font-semibold text-right w-32 text-[#d4af37]">
              Włosy krótkie
            </th>
            <th className="py-3.5 px-4 font-semibold text-right w-32 text-[#d4af37]">
              Włosy średnie
            </th>
            <th className="py-3.5 px-4 font-semibold text-right w-32 text-[#d4af37]">
              Włosy długie
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 text-sm">
          {lengthRows.map((row, idx) => (
            <tr
              key={row.name}
              className={`transition-colors hover:bg-[#faf8f5] ${
                idx % 2 === 1 ? 'bg-neutral-50/50' : 'bg-white'
              }`}
            >
              <td className="py-3 px-4 font-medium text-neutral-900">{row.name}</td>
              <td className="py-3 px-4 text-right font-bold text-neutral-950 tabular-nums whitespace-nowrap">
                {row.short ?? <span className="text-neutral-300 font-normal">—</span>}
              </td>
              <td className="py-3 px-4 text-right font-bold text-neutral-950 tabular-nums whitespace-nowrap">
                {row.medium ?? <span className="text-neutral-300 font-normal">—</span>}
              </td>
              <td className="py-3 px-4 text-right font-bold text-neutral-950 tabular-nums whitespace-nowrap">
                {row.long ?? <span className="text-neutral-300 font-normal">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Compact Cards for Length Pricing */}
    <div className="sm:hidden border border-neutral-200 divide-y divide-neutral-200 bg-white">
      {lengthRows.map((row) => (
        <div key={row.name} className="p-3.5">
          <div className="text-sm font-semibold text-neutral-950 mb-2">{row.name}</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-neutral-50 border border-neutral-100 px-2 py-1.5">
              <span className="block text-[10px] uppercase tracking-wider text-neutral-500">
                Krótkie
              </span>
              <span className="font-bold text-neutral-950 tabular-nums">
                {row.short ?? '—'}
              </span>
            </div>
            <div className="bg-neutral-50 border border-neutral-100 px-2 py-1.5">
              <span className="block text-[10px] uppercase tracking-wider text-neutral-500">
                Średnie
              </span>
              <span className="font-bold text-neutral-950 tabular-nums">
                {row.medium ?? '—'}
              </span>
            </div>
            <div className="bg-neutral-50 border border-neutral-100 px-2 py-1.5">
              <span className="block text-[10px] uppercase tracking-wider text-neutral-500">
                Długie
              </span>
              <span className="font-bold text-neutral-950 tabular-nums">
                {row.long ?? '—'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Other / Single-price Services in clean 2-col Grid */}
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 border border-neutral-200 bg-white divide-y md:divide-y-0 md:gap-px md:bg-neutral-200">
      {otherRows.map((item) => (
        <div
          key={item.name}
          className="bg-white hover:bg-[#faf8f5] transition-colors px-4 py-3 flex items-center justify-between gap-4"
        >
          <span className="text-sm font-medium text-neutral-900 leading-snug">{item.name}</span>
          <span className="text-sm font-bold text-neutral-950 tabular-nums whitespace-nowrap shrink-0">
            {item.price}
          </span>
        </div>
      ))}
      {otherRows.length % 2 === 1 && <div className="hidden md:block bg-white" />}
    </div>

    {/* Category Footnote */}
    <p className="mt-4 text-center text-xs sm:text-sm text-neutral-500 font-normal">
      {footnote}
    </p>
  </div>
);

export const PricingSection: React.FC<PricingSectionProps> = () => {
  return (
    <section
      id="cennik"
      className="bg-white text-neutral-900 pt-16 sm:pt-20 pb-16 sm:pb-20 border-b border-neutral-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="font-sans text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950">
            Cennik
          </h2>
        </div>

        <PricingCategoryBlock
          title="Cennik usług fryzjerskich dla pań"
          lengthRows={WOMEN_LENGTH_PRICES}
          otherRows={WOMEN_OTHER_PRICES}
          footnote="Cena usługi jest zależna od długości włosów i użytych materiałów."
        />

        <PricingCategoryBlock
          title="Cennik usług fryzjerskich dla panów"
          lengthRows={MEN_LENGTH_PRICES}
          otherRows={MEN_OTHER_PRICES}
          footnote="Cena usługi zależy od długości włosów i użytych materiałów."
        />

        {/* Single Call-to-Appointment Button */}
        <div className="pt-8 border-t border-neutral-200 text-center">
          <a
            href={`tel:${SALON_INFO.phonePrimary.replace(/\s+/g, '')}`}
            className="btn-gold inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-none text-sm sm:text-base font-bold tracking-wide shadow-md"
          >
            <Phone className="w-4 h-4 text-neutral-950" />
            <span>{SALON_INFO.phonePrimary}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
