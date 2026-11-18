/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsStrip } from './components/StatsStrip';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { PricingSection } from './components/PricingSection';
import { GallerySection } from './components/GallerySection';
import { GoogleReviewsCarousel } from './components/GoogleReviewsCarousel';
import { LocationMapSection } from './components/LocationMapSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { BarbersPage } from './pages/BarbersPage';
import { SalonPage } from './pages/SalonPage';
import { ServicesPage } from './pages/ServicesPage';
import { Phone } from 'lucide-react';
import { SALON_INFO } from './data/salonData';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'fryzjerzy' | 'salon' | 'uslugi'>('home');
  const [activeServiceSlug, setActiveServiceSlug] = useState<string | undefined>();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Sync state with URL hash
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash;
      const lower = rawHash.toLowerCase();

      if (lower.startsWith('#uslugi')) {
        setCurrentView('uslugi');
        const slashIdx = rawHash.indexOf('/');
        const queryIdx = rawHash.indexOf('?');
        if (slashIdx > -1) {
          const slugPart = rawHash.slice(slashIdx + 1).split('?')[0];
          setActiveServiceSlug(slugPart || undefined);
        } else if (queryIdx > -1) {
          const params = new URLSearchParams(rawHash.slice(queryIdx));
          setActiveServiceSlug(params.get('slug') || params.get('usluga') || undefined);
        } else {
          setActiveServiceSlug(undefined);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (lower === '#fryzjerzy') {
        setCurrentView('fryzjerzy');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (lower === '#salon') {
        setCurrentView('salon');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (view: 'home' | 'fryzjerzy' | 'salon' | 'uslugi', anchor?: string) => {
    setCurrentView(view);
    if (view === 'home') {
      if (anchor) {
        window.location.hash = `#${anchor}`;
        setTimeout(() => {
          const el = document.getElementById(anchor);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 80);
      } else {
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (view === 'uslugi') {
      setActiveServiceSlug(anchor);
      window.location.hash = anchor ? `#uslugi/${anchor}` : '#uslugi';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = `#${view}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectServiceFromCard = (category: string) => {
    setActiveCategoryFilter(category);
    const cennikElem = document.getElementById('cennik');
    if (cennikElem) {
      cennikElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-neutral-100 flex flex-col font-sans-ui selection:bg-[#d4af37] selection:text-black">
      {/* Top Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'fryzjerzy' && (
          <BarbersPage
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'salon' && (
          <SalonPage
            onBackToHome={() => handleNavigate('home')}
            onNavigateToServices={() => handleNavigate('home', 'cennik')}
          />
        )}

        {currentView === 'uslugi' && (
          <ServicesPage
            onBackToHome={() => handleNavigate('home')}
            activeServiceSlug={activeServiceSlug}
            onSelectServiceSlug={(slug) => {
              setActiveServiceSlug(slug);
              if (slug) {
                window.location.hash = `#uslugi/${slug}`;
              } else {
                window.location.hash = '#uslugi';
              }
            }}
          />
        )}

        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <Hero />

            {/* Stats Strip */}
            <StatsStrip />

            {/* Authentic Google Reviews Carousel */}
            <GoogleReviewsCarousel />

            {/* Men's Haircut Gallery */}
            <GallerySection />

            {/* Services Overview "Co robimy" */}
            <ServicesSection
              selectedCategory={activeCategoryFilter}
              onSelectCategory={handleSelectServiceFromCard}
            />

            {/* Price list */}
            <PricingSection
              activeCategoryFilter={activeCategoryFilter}
              setActiveCategoryFilter={setActiveCategoryFilter}
            />

            {/* About Section */}
            <AboutSection />

            {/* Location & Map */}
            <LocationMapSection />

            {/* Frequently Asked Questions (FAQ) */}
            <FaqSection />
          </>
        )}
      </main>

      {/* Footer across all views */}
      <Footer />

      {/* Sticky Quick Action Mobile Bar */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#141414]/95 backdrop-blur-md border border-neutral-700/80 rounded-none p-2.5 shadow-2xl">
        <a
          href={`tel:${SALON_INFO.phonePrimary.replace(/\s+/g, '')}`}
          className="btn-gold w-full py-2.5 px-4 rounded-none text-xs font-bold flex items-center justify-center gap-2 shadow-md"
        >
          <Phone className="w-4 h-4 text-neutral-950" />
          <span>{SALON_INFO.phonePrimary}</span>
        </a>
      </div>
    </div>
  );
}
