import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-10 sm:pt-12 pb-10 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Header - Horizontal layout with logo on left */}
        <div className="flex items-center justify-center gap-4 sm:gap-5 mb-10 sm:mb-12">
          <img
            src="/grzegorz-lewko-logo.png"
            alt="Lewko Grzegorz"
            className="h-11 sm:h-13 w-auto object-contain bg-transparent shrink-0"
          />
          <div className="text-left">
            <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
              Lewko Grzegorz
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-normal mt-0.5">
              Strzyżenie męskie i damskie Kraków
            </p>
          </div>
        </div>

        {/* 3 Columns Layout Matching Screenshot 8 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 pb-16 border-b border-neutral-800/80 text-xs sm:text-sm">
          {/* Column 1: Nasz Salon */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase mb-4">
              NASZ SALON
            </h4>
            <div className="flex items-start gap-2 text-neutral-300 mb-4">
              <MapPin className="w-4 h-4 text-[#d4af37] mt-0.5 shrink-0" />
              <span className="text-sm">Karmelicka 25, 31-131 Kraków</span>
            </div>
            {/* Google Maps Pin Embed */}
            <div className="w-full rounded-none overflow-hidden border border-neutral-800 shadow-md aspect-[4/3] max-w-sm mt-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4028.364713351261!2d19.92762901316477!3d50.066070371402475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47165b1020d9a857%3A0xe644017fceecc461!2sLewko%20Grzegorz.%20hairdresser's!5e0!3m2!1sen!2spl!4v1792748947104!5m2!1sen!2spl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Pinezka Google Maps - Fryzjer Polski Karmelicka 25 Kraków"
                className="w-full h-full min-h-[190px]"
              />
            </div>
          </div>

          {/* Column 2: Godziny Otwarcia */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase mb-4">
              GODZINY OTWARCIA
            </h4>
            <ul className="space-y-1.5 text-neutral-400 font-light">
              <li className="flex justify-between items-center py-1 border-b border-neutral-900">
                <span>Poniedziałek:</span>
                <span className="text-white font-medium">08:00 – 19:00</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-neutral-900">
                <span>Wtorek:</span>
                <span className="text-white font-medium">08:00 – 19:00</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-neutral-900">
                <span>Środa:</span>
                <span className="text-white font-medium">08:00 – 19:00</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-neutral-900">
                <span>Czwartek:</span>
                <span className="text-white font-medium">08:00 – 19:00</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-neutral-900">
                <span>Piątek:</span>
                <span className="text-white font-medium">08:00 – 19:00</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-neutral-900">
                <span>Sobota:</span>
                <span className="text-white font-medium">08:00 – 14:00</span>
              </li>
              <li className="flex justify-between items-center py-1 text-neutral-500">
                <span>Niedziela:</span>
                <span>Zamknięte</span>
              </li>
            </ul>
            <p className="text-[11px] text-neutral-500 mt-4">
              Zalecamy wcześniejszą rezerwację terminu telefonicznie.
            </p>
          </div>

          {/* Column 3: Kontakt */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-neutral-300 uppercase mb-4">
              KONTAKT
            </h4>
            <div className="space-y-3 mb-6 text-neutral-300">
              <a
                href="tel:+48124294435"
                className="flex items-center gap-2.5 hover:text-[#d4af37] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span className="font-medium">+48 12 429 44 35</span>
              </a>
              <a
                href="tel:+48600825009"
                className="flex items-center gap-2.5 hover:text-[#d4af37] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span className="font-medium">+48 600 825 009</span>
              </a>
              <a
                href={`mailto:${SALON_INFO.email}`}
                className="flex items-center gap-2.5 hover:text-[#d4af37] transition-colors truncate"
              >
                <Mail className="w-4 h-4 text-[#d4af37]" />
                <span className="truncate">{SALON_INFO.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-light gap-4">
          <p>
            © 1963–2026 Lewko Grzegorz. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-300 transition-colors">
              Polityka Prywatności
            </span>
            <span className="hover:text-neutral-300 transition-colors">
              Regulamin
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
