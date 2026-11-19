import React, { useState } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Czy to dobry fryzjer damsko-męski w Krakowie?',
    answer:
      'Lewko Grzegorz to fryzjer damsko-męski z Krakowa z kilkudziesięcioma latami doświadczenia. Strzyże kobiety, mężczyzn i dzieci, a każdą fryzurę dopasowuje do typu urody i stylu życia klienta. Ponad 300 opinii i 4.8 gwiazdek na podstawie Google.',
  },
  {
    id: 'faq-2',
    question: 'Ile kosztuje strzyżenie damskie i męskie w Krakowie?',
    answer:
      'W salonie Grzegorza Lewko strzyżenie męskie kosztuje od 90 zł, a damskie od 100 zł. Cena zależy od długości włosów i zakresu usługi.',
  },
  {
    id: 'faq-3',
    question: 'Jak umówić się do fryzjera w Krakowie?',
    answer:
      'Wizytę można zarezerwować telefonicznie pod numerem +48 600 825 009, +48 12 429 44 35 lub przez wiadomość SMS. Zalecamy rezerwację z wyprzedzeniem, szczególnie w piątki, soboty i przed świętami.',
  },
  {
    id: 'faq-4',
    question: 'Gdzie znajduje się salon fryzjerski Grzegorza Lewko w Krakowie?',
    answer:
      'Salon mieści się przy Karmelickiej 25 w Starym Mieście, 31-131 Kraków. Dojedziesz tu tramwajem i autobusem, a w pobliżu znajduje się też parking przy ulicy.',
  },
  {
    id: 'faq-5',
    question: 'Jakie usługi fryzjerskie oferuje salon w Krakowie?',
    answer:
      'Oferujemy strzyżenie damskie, męskie i dziecięce, strzyżenie brzytwą i temperą, koloryzację, refleksy, balayage, modelowanie, zabiegi pielęgnacyjne na włosy oraz fryzury okolicznościowe.',
  },
  {
    id: 'faq-6',
    question: 'Czy w salonie można ostrzyc dziecko?',
    answer:
      'Tak, w salonie strzyżemy także dzieci od 2 roku życia. Rodzic może zostać w salonie.',
  },
  {
    id: 'faq-7',
    question: 'Ile trwa wizyta u fryzjera?',
    answer:
      'Strzyżenie męskie trwa około 30 minut, damskie 45 minut, a koloryzacja lub balayage od 2 do 6 godzin. Czas zależy od długości włosów i rodzaju usługi.',
  },
  {
    id: 'faq-8',
    question: 'Jakie godziny otwarcia ma fryzjer Grzegorz Lewko?',
    answer:
      'Salon jest otwarty pon.–pt. 8:00-19:00, sob. 8:00-14:00. W niedzielę nieczynne. Godziny w święta aktualizujemy w profilu Google.',
  },
  {
    id: 'faq-9',
    question: 'Jakich kosmetyków i farb używa salon?',
    answer:
      'Pracujemy na profesjonalnych produktach Montibello, Moroccanoil, Pan Drwal oraz Clubman. Dobieramy je indywidualnie do struktury i kondycji włosów, także dla włosów farbowanych, cienkich i zniszczonych.',
  },
  {
    id: 'faq-10',
    question: 'Czy można zapłacić kartą lub BLIKIEM?',
    answer:
      'Tak, przyjmujemy płatność gotówką, kartą, BLIKiem.',
  },
  {
    id: 'faq-11',
    question: 'Czy mogę odwołać lub przełożyć wizytę?',
    answer:
      'Tak, prosimy o kontakt minimum [X godzin] przed terminem pod numerem [numer]. Dzięki temu wolny termin może zająć inny klient.',
  },
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="bg-[#faf8f5] text-neutral-900 py-16 sm:py-24 border-t border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 mb-3">
            FAQs
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 font-light max-w-xl mx-auto">
            Często zadawane pytania
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-none border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-[#d4af37] shadow-md ring-1 ring-[#d4af37]/20'
                    : 'border-neutral-200 hover:border-neutral-300 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-5 sm:px-7 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight leading-snug">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#f4ebd0] text-[#8c6517] rotate-180'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-7 pb-6 pt-1 text-sm sm:text-base text-neutral-700 leading-relaxed font-light border-t border-neutral-100 animate-in fade-in-50 duration-200">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact help footnote - squared corners */}
        <div className="mt-12 p-6 sm:p-8 rounded-none bg-white border border-neutral-200 text-center flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-neutral-950">
              Masz inne pytanie lub potrzebujesz pomocy? Zadzwoń.
            </h4>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${SALON_INFO.phonePrimary.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4 text-[#d4af37]" />
              <span>{SALON_INFO.phonePrimary}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
