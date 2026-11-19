/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import {
  AppView,
  NAV_EVENT,
  NavigateDetail,
  navigateTo,
  parseRoute,
  updatePageSeo,
} from './utils/navigation';

export default function App() {
  const initialRoute = parseRoute(window.location.pathname);
  const [currentView, setCurrentView] = useState<AppView>(initialRoute.view);
  const [activeServiceSlug, setActiveServiceSlug] = useState<string | undefined>(
    initialRoute.serviceSlug
  );
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const syncFromLocation = useCallback((scrollToTarget?: string) => {
    // Support legacy hash URLs by normalizing them cleanly to History API paths
    if (window.location.hash) {
      const lowerHash = window.location.hash.toLowerCase();
      if (lowerHash.startsWith('#uslugi')) {
        const cleanPath = window.location.hash.slice(1).split('?')[0];
        window.history.replaceState(null, '', `/${cleanPath}`);
      } else if (lowerHash === '#fryzjerzy') {
        window.history.replaceState(null, '', '/fryzjerzy');
      } else if (lowerHash === '#salon') {
        window.history.replaceState(null, '', '/salon');
      }
    }

    const parsed = parseRoute(window.location.pathname);
    setCurrentView(parsed.view);
    setActiveServiceSlug(parsed.serviceSlug);

    if (parsed.view === 'home' && scrollToTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollToTarget);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    syncFromLocation();

    const onPopState = (e: PopStateEvent) => {
      const stateScrollTo = (e.state as { scrollTo?: string } | null)?.scrollTo;
      syncFromLocation(stateScrollTo);
    };

    const onAppNavigate = (e: Event) => {
      const detail = (e as CustomEvent<NavigateDetail>).detail;
      syncFromLocation(detail?.scrollTo);
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener(NAV_EVENT, onAppNavigate);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener(NAV_EVENT, onAppNavigate);
    };
  }, [syncFromLocation]);

  // Dynamic SEO title and meta description per top-level route
  useEffect(() => {
    if (currentView === 'home') {
      updatePageSeo(
        'Najlepszy Fryzjer Męski Kraków - strzyżenie męskie, broda, barber, fryzjer damski blisko Ciebie - Lewko Grzegorz',
        'Oficjalna strona legendarnego salonu fryzjerskiego Grzegorza Lewko przy ul. Karmelickiej 25 w Krakowie. Tradycja od 1963 roku, profesjonalne strzyżenie męskie i stylizacja brody.',
        '/'
      );
    } else if (currentView === 'fryzjerzy') {
      updatePageSeo(
        'Nasi Fryzjerzy i Barberzy Kraków | Salon Fryzjerski Grzegorz Lewko',
        'Poznaj zespół doświadczonych mistrzów fryzjerstwa i barberów w Salonie Grzegorza Lewko przy ul. Karmelickiej 25 w Krakowie: Grzegorz, Piotr, Stasia i Olga.',
        '/fryzjerzy'
      );
    } else if (currentView === 'salon') {
      updatePageSeo(
        'Historia salonu – Od 1963 roku w Krakowie | Grzegorz Lewko',
        'Poznaj historię rodzinnego salonu fryzjerskiego Grzegorza Lewko w Krakowie przy ul. Karmelickiej 25. Ponad 60 lat tradycji od 1963 roku.',
        '/salon'
      );
    }
  }, [currentView]);

  const handleNavigate = (view: AppView, target?: string) => {
    if (view === 'home') {
      navigateTo('/', target);
    } else if (view === 'uslugi') {
      navigateTo(target ? `/uslugi/${target}` : '/uslugi');
    } else {
      navigateTo(`/${view}`);
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
            onNavigateToServices={() => handleNavigate('uslugi')}
          />
        )}

        {currentView === 'uslugi' && (
          <ServicesPage
            onBackToHome={() => handleNavigate('home')}
            activeServiceSlug={activeServiceSlug}
            onSelectServiceSlug={(slug) => handleNavigate('uslugi', slug)}
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
    </div>
  );
}
