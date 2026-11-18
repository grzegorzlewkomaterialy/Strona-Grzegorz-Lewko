import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section id="o-nas" className="bg-white text-neutral-900 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
            O nas
          </h2>
        </div>

        {/* 2-column layout: Salon photo on the left, description on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Salon Photo (natural original proportions without cropping) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md rounded-none overflow-hidden shadow-md border border-neutral-200 group">
              <img
                src="https://res.cloudinary.com/tgknav3s/image/upload/f_auto/q_auto/zdjecie-salonu.webp"
                alt="Salon Fryzjer Polski Grzegorz Lewko Kraków"
                className="w-full h-auto object-contain rounded-none block"
              />
            </div>
          </div>

          {/* Right Column: Narrative Prose */}
          <div className="lg:col-span-7 space-y-5 text-neutral-700 text-sm sm:text-base leading-relaxed font-light">
            <p>
              <strong className="font-semibold text-neutral-950">Fryzjer Polski Grzegorz Lewko</strong> to uznany, krakowski salon fryzjerski zlokalizowany w reprezentacyjnej kamienicy przy <span className="text-neutral-950 font-medium">ul. Karmelickiej 25</span> (tuż obok Teatru Bagatela i krakowskich Plant). Świadczymy kompleksowe usługi fryzjerstwa męskiego, klasycznego barberingu, cięć nożyczkowych, modern fade oraz precyzyjnej pielęgnacji i stylizacji brody.
            </p>

            <p>
              Historia naszego zakładu sięga <span className="text-neutral-950 font-medium">1963 roku</span>. Przez dziesięciolecia salon był miejscem spotkań krakowskiej inteligencji, profesorów uniwersyteckich, aktorów krakowskich scen teatralnych oraz każdego dżentelmena, dla którego nienaganna prezencja i spokój fotela fryzjerskiego są nieodzownym elementem codziennego życia.
            </p>

            <p>
              Mistrz <strong className="font-semibold text-neutral-950">Grzegorz Lewko</strong> wraz z zespołem łączy tradycyjną szkołę rzemiosła fryzjerskiego z najnowszymi światowymi trendami. Wykonujemy dopracowane cięcia nożyczkowe, płynne cieniowania skin fade, jak również rytuały tradycyjnego golenia twarzy brzytwą z gorącym kompresem ziołowym.
            </p>

            <p>
              Pracujemy wyłącznie na certyfikowanych kosmetykach renomowanych marek (Montibello, Kemon, Clubman Pinaud, Reuzel, Uppercut Deluxe). Stawiamy na punktualność, szacunek do czasu klienta, filiżankę dobrej kawy i uczciwy, przejrzysty cennik.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
