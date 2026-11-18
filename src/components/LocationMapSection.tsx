import React from 'react';
import { StatsStrip } from './StatsStrip';

export const LocationMapSection: React.FC = () => {
  return (
    <section id="lokalizacja" className="bg-[#0f0f0f] text-white pt-6 sm:pt-8 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-6 text-center">
        <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
          Znajdź nas i umów wizytę telefonicznie
        </h2>
      </div>

      {/* Map edge-to-edge full width */}
      <div className="w-full h-[450px] sm:h-[500px] lg:h-[550px] border-t border-b border-neutral-800 bg-[#141414]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4028.364713351261!2d19.92762901316477!3d50.066070371402475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47165b1020d9a857%3A0xe644017fceecc461!2sLewko%20Grzegorz.%20hairdresser's!5e0!3m2!1sen!2spl!4v1792748947104!5m2!1sen!2spl"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Pinezka Google Maps - Lewko Grzegorz Karmelicka 25 Kraków"
          className="w-full h-full"
        />
      </div>

      {/* Pasek ze statystykami od razu pod mapą */}
      <StatsStrip id="statystyki-mapa" />
    </section>
  );
};
