import React, { useState, useEffect } from 'react';
import {
  SERVICES_SEO_LIST,
  ServiceDetailItem,
  getServiceBySlugOrId,
} from '../data/servicesSeoData';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Phone,
  Scissors,
  MapPin,
} from 'lucide-react';
import { SALON_INFO } from '../data/salonData';
import { VerbatimMarkdown, extractLeadingH1 } from '../components/VerbatimMarkdown';
import { AppLink } from '../components/AppLink';
import { updatePageSeo } from '../utils/navigation';

interface ServicesPageProps {
  onBackToHome: () => void;
  activeServiceSlug?: string;
  onSelectServiceSlug: (slug?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  activeServiceSlug,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'meskie' | 'damskie'>('all');
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]); // First FAQ open by default

  const activeService: ServiceDetailItem | undefined = activeServiceSlug
    ? getServiceBySlugOrId(activeServiceSlug)
    : undefined;

  // Scroll to top when active service changes & sync SEO title/meta description
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpenFaqIndices([0]);

    if (activeService) {
      updatePageSeo(
        activeService.metaTitle,
        activeService.metaDescription,
        `/uslugi/${activeServiceSlug || activeService.slug}`
      );
    } else {
      updatePageSeo(
        'Usługi fryzjerskie Kraków – Cennik | Salon Fryzjerski Grzegorz Lewko',
        'Poznaj pełen zakres usług fryzjerstwa męskiego i damskiego w Salonie Grzegorz Lewko przy ul. Karmelickiej 25 w Krakowie. Tradycja od 1963 roku.',
        '/uslugi'
      );
    }
  }, [activeServiceSlug, activeService]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredServices =
    categoryFilter === 'all'
      ? SERVICES_SEO_LIST
      : SERVICES_SEO_LIST.filter((s) => s.category === categoryFilter);

  // =========================================================================
  // RANK 3: DETAILED INDIVIDUAL SERVICE PAGE (1500+ WORDS TOPICAL & LOCAL SEO)
  // =========================================================================
  if (activeService) {
    const relatedServices = activeService.relatedServiceIds
      .map((id) => getServiceBySlugOrId(id))
      .filter((s): s is ServiceDetailItem => s !== undefined);
    const hasVerbatimMarkdown = Boolean(
      activeService.markdownContent && activeService.markdownContent.trim().length > 0
    );
    const extracted = hasVerbatimMarkdown
      ? extractLeadingH1(activeService.markdownContent!)
      : { h1: null, body: '' };
    const displayH1 = extracted.h1 || activeService.title;

    // Schema.org Graph structured data (LocalBusiness / HairSalon, Service, BreadcrumbList, FAQPage)
    const structuredDataGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'HairSalon',
          '@id': 'https://fryzjerpolski.krakow.pl/#salon',
          name: 'Salon Fryzjerski Grzegorz Lewko',
          description:
            'Tradycyjny salon fryzjerski męski i damski przy ulicy Karmelickiej 25 w Krakowie. Ponad 60 lat tradycji od 1963 roku.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Karmelicka 25',
            addressLocality: 'Kraków',
            postalCode: '31-131',
            addressCountry: 'PL',
          },
          telephone: '+48 12 429 44 35',
          url: 'https://fryzjerpolski.krakow.pl',
        },
        {
          '@type': 'Service',
          '@id': `https://fryzjerpolski.krakow.pl/#service-${activeService.id}`,
          name: activeService.title,
          description: activeService.metaDescription,
          serviceType: activeService.categoryLabel,
          provider: {
            '@id': 'https://fryzjerpolski.krakow.pl/#salon',
          },
          areaServed: {
            '@type': 'City',
            name: 'Kraków',
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Strona główna',
              item: 'https://fryzjerpolski.krakow.pl',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Usługi',
              item: 'https://fryzjerpolski.krakow.pl/uslugi',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: activeService.categoryLabel,
              item: 'https://fryzjerpolski.krakow.pl/uslugi',
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: activeService.title.split('|')[0].trim(),
              item: `https://fryzjerpolski.krakow.pl/uslugi/${activeService.slug}`,
            },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: activeService.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    };

    return (
      <div className="min-h-screen bg-[#0e0e0e] text-neutral-100 pt-24 sm:pt-28 pb-20">
        {/* Dynamic Rich Schema (HairSalon, Service, BreadcrumbList, FAQPage) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataGraph) }}
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Action button */}
          <div className="mb-6 flex items-center">
            <AppLink
              to="/uslugi"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-400 hover:text-[#d4af37] bg-neutral-900 border border-neutral-800 px-4 py-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Wszystkie usługi salonu</span>
            </AppLink>
          </div>

          {/* Main Hero Header */}
          <header className="mb-10 bg-neutral-900/60 border border-neutral-800 p-6 sm:p-10 relative overflow-hidden">
            {/* H1 Main Keyword Title */}
            <h1 className="font-sans text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6 text-center">
              {displayH1}
            </h1>

            {!hasVerbatimMarkdown && (
              <>
                {/* Primary & Secondary SEO Keywords tags */}
                {(activeService.primaryKeyword ||
                  (activeService.secondaryKeywords && activeService.secondaryKeywords.length > 0)) && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {activeService.primaryKeyword && (
                      <span className="text-[11px] font-semibold text-[#d4af37] bg-[#d4af37]/15 border border-[#d4af37]/35 px-2.5 py-1">
                        Główna fraza: {activeService.primaryKeyword}
                      </span>
                    )}
                    {activeService.secondaryKeywords?.slice(0, 4).map((kw, kwIdx) => (
                      <span
                        key={kwIdx}
                        className="text-[11px] text-neutral-300 bg-neutral-800/80 border border-neutral-700/60 px-2 py-0.5"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                {/* Hero Lead Paragraph */}
                <p className="text-base sm:text-lg text-neutral-200 leading-relaxed max-w-3xl mb-8 font-light">
                  {activeService.heroIntro}
                </p>

                {/* Key benefits / bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 pt-4 border-t border-neutral-800/80">
                  {activeService.keyBenefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Action Bar inside Header */}
            <div className="flex items-center justify-center pt-6 border-t border-neutral-800">
              <a
                href={`tel:${SALON_INFO.phonePrimary.replace(/\s+/g, '')}`}
                className="btn-gold px-7 py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Phone className="w-4 h-4 text-neutral-950" />
                <span>{SALON_INFO.phonePrimary}</span>
              </a>
            </div>
          </header>

          {/* MAIN ARTICLE SECTIONS */}
          <article className="space-y-12 text-neutral-300 leading-relaxed font-light mb-16">
            {hasVerbatimMarkdown ? (
              <section className="bg-[#121212] border border-neutral-800/80 p-6 sm:p-10">
                <VerbatimMarkdown
                  content={activeService.markdownContent!}
                  skipLeadingH1={Boolean(extracted.h1)}
                />
              </section>
            ) : (
              activeService.mainSections.map((sec, sIdx) => (
                <section
                  key={sIdx}
                  className="bg-[#121212] border border-neutral-800/80 p-6 sm:p-8 space-y-5"
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-[#d4af37] inline-block" />
                    {sec.heading}
                  </h2>

                  {sec.subheading && (
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-200">
                      {sec.subheading}
                    </h3>
                  )}

                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-sm sm:text-base leading-relaxed text-neutral-300">
                      {p}
                    </p>
                  ))}

                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="space-y-2.5 my-4 pl-2">
                      {sec.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-neutral-200">
                          <span className="text-[#d4af37] font-bold mt-0.5">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Optional Data Table (e.g. hair type vs solutions) */}
                  {sec.table && (
                    <div className="overflow-x-auto my-6 border border-neutral-800">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="bg-neutral-900 border-b border-neutral-800 text-white font-semibold">
                            {sec.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-3.5 sm:p-4">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800 bg-neutral-950/60">
                          {sec.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-neutral-900/40 transition-colors">
                              <td className="p-3.5 sm:p-4 font-semibold text-[#d4af37] whitespace-nowrap">
                                {row[0]}
                              </td>
                              <td className="p-3.5 sm:p-4 text-neutral-300">{row[1]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))
            )}

            {/* Location & Salon Authority Card */}
            <div className="bg-neutral-900 border border-[#d4af37]/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">
                  Zapraszamy do salonu
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Salon Fryzjerski Grzegorz Lewko
                </h3>
                <p className="text-sm text-neutral-400 mt-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#d4af37]" />
                  ul. Karmelicka 25, 31-131 Kraków (Stare Miasto)
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Poniedziałek – Piątek: 08:00 – 19:00 | Sobota: 08:00 – 14:00
                </p>
              </div>

              <a
                href={`tel:${SALON_INFO.phonePrimary.replace(/\s+/g, '')}`}
                className="btn-gold px-6 py-3 text-sm font-bold shrink-0 cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-neutral-950" />
                <span>{SALON_INFO.phonePrimary}</span>
              </a>
            </div>

            {/* FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
            {!hasVerbatimMarkdown && activeService.faqs.length > 0 && (
              <section className="bg-[#121212] border border-neutral-800 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-[#d4af37] inline-block" />
                  Najczęściej zadawane pytania (FAQ)
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mb-6">
                  Wszystko, co warto wiedzieć przed wizytą w Salonie Grzegorz Lewko w Krakowie.
                </p>

                <div className="space-y-3">
                  {activeService.faqs.map((faq, fIdx) => {
                    const isOpen = openFaqIndices.includes(fIdx);
                    return (
                      <div
                        key={fIdx}
                        className="border border-neutral-800 bg-neutral-900/60 overflow-hidden transition-colors"
                      >
                        <button
                          onClick={() => toggleFaq(fIdx)}
                          className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white hover:text-[#d4af37] transition-colors cursor-pointer"
                          aria-expanded={isOpen}
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-[#d4af37] transition-transform duration-200 shrink-0 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed border-t border-neutral-800/60 pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* RANK 3 INTERLINKING: POWIĄZANE USŁUGI W SALONIE */}
            {relatedServices.length > 0 && (
              <section className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-[#d4af37]" />
                  <span>Powiązane usługi:</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedServices.map((rel) => (
                    <AppLink
                      key={rel.id}
                      to={`/uslugi/${rel.slug}`}
                      className="bg-neutral-900 border border-neutral-800 p-4 hover:border-[#d4af37]/60 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#d4af37]">
                          {rel.categoryLabel}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors mt-1 mb-2">
                          {rel.slug === 'strzyzenie-wlosow-meskie'
                            ? 'Strzyżenie włosów męskie'
                            : rel.title.split('|')[0].trim()}
                        </h4>
                        <p className="text-xs text-neutral-400 line-clamp-2 font-light">
                          {rel.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-end pt-3 mt-3 border-t border-neutral-800 text-xs">
                        <span className="text-[#d4af37] inline-flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform">
                          Czytaj więcej
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </AppLink>
                  ))}

                  {/* LOKALIZACJA SALONU I DOJAZD (SEO INTERNAL LINKING) */}
                  <AppLink
                    to="/"
                    scrollTo="lokalizacja"
                    className="bg-neutral-900/90 border border-[#d4af37]/40 p-4 hover:border-[#d4af37] transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#d4af37] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#d4af37]" />
                        Lokalizacja salonu i dojazd
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors mt-1 mb-2">
                        ul. Karmelicka 25, 31-131 Kraków
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-2 font-light">
                        Stare Miasto / Śródmieście, 3 min od Teatru Bagatela. Dogodny dojazd tramwajem i parkingi w pobliżu.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-800 text-xs">
                      <span className="text-neutral-400 text-[11px]">Pn–Pt 8–19 · Sob 8–14</span>
                      <span className="text-[#d4af37] inline-flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform">
                        Dojazd i kontakt
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </AppLink>
                </div>
              </section>
            )}
          </article>

          {/* Bottom Back Button */}
          <div className="text-center pt-8 border-t border-neutral-800">
            <AppLink
              to="/uslugi"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-300 hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Powrót do pełnego katalogu usług salonu</span>
            </AppLink>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RANK 2: MAIN SERVICES CATEGORY HUB PAGE (/uslugi)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-neutral-100 pt-24 sm:pt-28 pb-20">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-neutral-400 mb-8 border-b border-neutral-800 pb-4"
        >
          <AppLink
            to="/"
            className="hover:text-[#d4af37] transition-colors cursor-pointer"
          >
            Strona główna
          </AppLink>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-[#d4af37] font-medium">Usługi</span>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <AppLink
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-400 hover:text-[#d4af37] bg-neutral-900 border border-neutral-800 px-4 py-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Powrót do strony głównej</span>
          </AppLink>
        </div>

        {/* Hub Title Banner */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-8 sm:p-12 mb-10">
          <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Usługi
          </h1>
        </div>

        {/* Category Filter Tabs (Rank 2 sub-categories) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-[#d4af37] text-neutral-950 shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
              }`}
            >
              Wszystkie usługi ({SERVICES_SEO_LIST.length})
            </button>
            <button
              onClick={() => setCategoryFilter('meskie')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                categoryFilter === 'meskie'
                  ? 'bg-[#d4af37] text-neutral-950 shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
              }`}
            >
              Fryzjerstwo męskie (8)
            </button>
            <button
              onClick={() => setCategoryFilter('damskie')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                categoryFilter === 'damskie'
                  ? 'bg-[#d4af37] text-neutral-950 shadow-sm'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
              }`}
            >
              Fryzjerstwo damskie (7)
            </button>
          </div>

          <span className="text-xs text-neutral-500">
            Kliknij usługę, aby przeczytać wyczerpujący poradnik (1500+ słów)
          </span>
        </div>

        {/* Services Grid (Rank 2 -> Links to Rank 3 deep pages) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-[#141414] border border-neutral-800 hover:border-[#d4af37]/60 transition-all flex flex-col justify-between group"
            >
              <div className="p-6">
                {/* Category Badge */}
                <div className="flex items-center mb-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-[#d4af37] border border-neutral-700">
                    {service.categoryLabel}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug mb-2">
                  <AppLink to={`/uslugi/${service.slug}`} className="hover:text-[#d4af37] transition-colors">
                    {service.slug === 'strzyzenie-wlosow-meskie'
                      ? 'Strzyżenie włosów męskie'
                      : service.title.split('|')[0].trim()}
                  </AppLink>
                </h3>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed mb-4 line-clamp-3">
                  {service.shortDescription}
                </p>

                {/* Target Audience Highlight */}
                <div className="text-[11px] text-neutral-500 border-l-2 border-[#d4af37]/50 pl-2 py-0.5 line-clamp-2">
                  {service.targetAudience}
                </div>
              </div>

              {/* Card Footer: Deep Page Link */}
              <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-end">
                <div className="flex items-center gap-2">
                  <AppLink
                    to={`/uslugi/${service.slug}`}
                    className="btn-gold px-3.5 py-1.5 text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Czytaj opis</span>
                    <ChevronRight className="w-3 h-3 text-neutral-950" />
                  </AppLink>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Topical Authority Footer Block */}
        <div className="mt-16 bg-neutral-900/60 border border-neutral-800 p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
            Zadzwoń i Umów Wizytę
          </h2>
          <div className="flex items-center justify-center">
            <a
              href={`tel:${SALON_INFO.phonePrimary.replace(/\s+/g, '')}`}
              className="btn-gold px-8 py-3 text-sm font-bold cursor-pointer inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-neutral-950" />
              <span>{SALON_INFO.phonePrimary}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
