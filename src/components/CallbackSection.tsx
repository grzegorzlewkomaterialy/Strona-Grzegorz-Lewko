import React, { useState } from 'react';
import { Phone, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export const CallbackSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 9) {
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
    setPhone(val);
  };

  return (
    <section id="kontakt" className="bg-white text-neutral-900 py-16 sm:py-24 border-t border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading matching Screenshot 7 */}
        <h2 className="font-sans text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950 mb-3 text-balance">
          Potrzebujesz porady? Jesteśmy do Twojej dyspozycji
        </h2>

        {/* Subtitle matching Screenshot 7 */}
        <p className="text-sm sm:text-base text-neutral-600 font-light max-w-xl mx-auto mb-10 text-balance">
          Zostaw wiadomość, a skontaktujemy się z Tobą i pomożemy wybrać odpowiednią usługę lub dogodny termin w salonie.
        </p>

        {/* Form Container */}
        {isSuccess ? (
          <div className="max-w-md mx-auto p-8 rounded-none bg-[#faf8f4] border border-emerald-300 text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Dziękujemy za kontakt!</h3>
            <p className="text-sm text-neutral-600 font-light leading-relaxed mb-6">
              Przyjęliśmy Twoje zgłoszenie. Nasz recepcjonista lub mistrz Grzegorz oddzwoni pod numer <span className="font-semibold text-neutral-900">+48 {phone}</span> w ciągu najbliższych minut.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setName('');
                setPhone('');
              }}
              className="text-xs font-semibold text-[#a67a22] hover:underline uppercase tracking-wider cursor-pointer"
            >
              Wyślij kolejne zapytanie
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Name Input */}
              <div className="w-full md:flex-1">
                <input
                  type="text"
                  required
                  placeholder="Twoje imię i nazwisko"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-none bg-white border border-neutral-300 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67a22] focus:border-transparent placeholder:text-neutral-400"
                />
              </div>

              {/* Phone Input with PL Flag */}
              <div className="w-full md:flex-1 relative flex items-center">
                <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-xs font-medium text-neutral-600">
                  <span className="text-base">🇵🇱</span>
                  <span>+48</span>
                </div>
                <input
                  type="tel"
                  required
                  placeholder="(000) 000-000"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full pl-20 pr-4 py-3.5 rounded-none bg-white border border-neutral-300 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#a67a22] focus:border-transparent placeholder:text-neutral-400"
                />
              </div>

              {/* Submit Black Button matching Screenshot 7 */}
              <div className="w-full md:w-auto">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3.5 rounded-none bg-black text-white hover:bg-neutral-800 text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Wysyłanie...</span>
                    </>
                  ) : (
                    <>
                      <span>Oddzwoń do mnie</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Privacy Disclaimer matching Screenshot 7 */}
            <p className="text-[11px] sm:text-xs text-neutral-500 font-light mt-4">
              Klikając ten przycisk, wyrażasz zgodę na przetwarzanie danych osobowych oraz akceptujesz politykę prywatności.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
