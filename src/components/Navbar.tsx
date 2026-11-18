import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Instagram } from 'lucide-react';
import { SALON_INFO } from '../data/salonData';

interface NavbarProps {
  currentView?: 'home' | 'fryzjerzy' | 'salon' | 'uslugi';
  onNavigate?: (view: 'home' | 'fryzjerzy' | 'salon' | 'uslugi', anchor?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView = 'home',
  onNavigate,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'PL' | 'EN'>('PL');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: 'home' | 'fryzjerzy' | 'salon' | 'uslugi', anchor?: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(view, anchor);
    } else {
      if (view === 'home' && anchor) {
        window.location.hash = `#${anchor}`;
      } else {
        window.location.hash = `#${view}`;
      }
    }
  };

  const handleLanguageChange = (lang: 'PL' | 'EN') => {
    setLanguage(lang);
    const targetCode = lang === 'EN' ? 'en' : 'pl';
    try {
      document.cookie = `googtrans=/pl/${targetCode}; path=/;`;
      document.cookie = `googtrans=/pl/${targetCode}; domain=${window.location.hostname}; path=/;`;
      const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (select) {
        select.value = targetCode;
        select.dispatchEvent(new Event('change'));
      } else {
        const element = document.getElementById('google_translate_element');
        if (element) {
          window.location.reload();
        }
      }
    } catch (e) {
      console.error('Google translate error:', e);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0f0f0f]/95 backdrop-blur-md border-b border-neutral-800 shadow-xl py-3'
            : 'bg-[#121212]/80 backdrop-blur-sm border-b border-neutral-800/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
            {/* Zone 1: Brand Wordmark / Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center group whitespace-nowrap shrink-0 cursor-pointer bg-transparent border-0 p-0"
              title="Fryzjer Polski - Grzegorz Lewko"
            >
              <img
                src="/grzegorz-lewko-logo.png"
                alt="Fryzjer Polski - Grzegorz Lewko"
                className="h-9 sm:h-11 lg:h-12 w-auto object-contain bg-transparent"
              />
            </button>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
              <button
                onClick={() => handleNavClick('fryzjerzy')}
                className={`transition-colors whitespace-nowrap shrink-0 tracking-wide cursor-pointer ${
                  currentView === 'fryzjerzy'
                    ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5'
                    : 'text-neutral-300 hover:text-[#d4af37]'
                }`}
              >
                Fryzjerzy
              </button>
              <button
                onClick={() => handleNavClick('salon')}
                className={`transition-colors whitespace-nowrap shrink-0 tracking-wide cursor-pointer ${
                  currentView === 'salon'
                    ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5'
                    : 'text-neutral-300 hover:text-[#d4af37]'
                }`}
              >
                Salon
              </button>
              <button
                onClick={() => handleNavClick('uslugi')}
                className={`transition-colors whitespace-nowrap shrink-0 tracking-wide cursor-pointer ${
                  currentView === 'uslugi'
                    ? 'text-[#d4af37] font-bold border-b-2 border-[#d4af37] pb-0.5'
                    : 'text-neutral-300 hover:text-[#d4af37]'
                }`}
              >
                Usługi
              </button>
              <button
                onClick={() => handleNavClick('home', 'cennik')}
                className="text-neutral-300 hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 tracking-wide cursor-pointer"
              >
                Cennik
              </button>
              <button
                onClick={() => handleNavClick('home', 'o-nas')}
                className="text-neutral-300 hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 tracking-wide cursor-pointer"
              >
                O nas
              </button>
              <button
                onClick={() => handleNavClick('home', 'lokalizacja')}
                className="text-neutral-300 hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 tracking-wide cursor-pointer"
              >
                Lokalizacja
              </button>
              <button
                onClick={() => handleNavClick('home', 'faq')}
                className="text-neutral-300 hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 tracking-wide cursor-pointer"
              >
                FAQ
              </button>
            </nav>

            {/* Zone 3: Instagram Icon, Language Tile & Primary CTA */}
            <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
              {/* Instagram Brown/Bronze Icon (desktop only; inside hamburger menu on mobile) */}
              <a
                href="https://www.instagram.com/fryzjergrzegorzlewko/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex w-9 h-9 rounded-none bg-neutral-900 border border-neutral-700/80 hover:border-[#a67a22] items-center justify-center text-[#a67a22] hover:text-[#d4af37] transition-all shadow-sm group"
                title="Instagram @fryzjergrzegorzlewko"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>

              {/* Language Switcher Tile - squared (desktop only; inside hamburger menu on mobile) */}
              <div className="hidden lg:flex items-center bg-neutral-900 border border-neutral-700/80 rounded-none p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('PL')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-none transition-all cursor-pointer ${
                    language === 'PL'
                      ? 'bg-[#d4af37] text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Polski (PL)"
                >
                  <span>PL</span>
                  <span className="text-[12px]">🇵🇱</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('EN')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-none transition-all cursor-pointer ${
                    language === 'EN'
                      ? 'bg-[#d4af37] text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="English (EN) - Translate via Google"
                >
                  <span>EN</span>
                  <span className="text-[12px]">🇬🇧</span>
                </button>
              </div>

              {/* Primary Call Button: +48 600 825 009 - compact on mobile */}
              <a
                href={`tel:${SALON_INFO.phonePrimary.replace(/\s+/g, '')}`}
                className="btn-gold px-2.5 py-2 sm:px-5 sm:py-2.5 rounded-none text-[11px] sm:text-sm font-semibold tracking-wide whitespace-nowrap flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-md"
                title={language === 'PL' ? 'Zadzwoń, aby umówić wizytę' : 'Call to book an appointment'}
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-950 shrink-0" />
                <span>{SALON_INFO.phonePrimary}</span>
              </a>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-none text-neutral-300 hover:text-white bg-neutral-900/80 border border-neutral-800 hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Otwórz menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#141414] border-b border-neutral-800 px-4 pt-3 pb-6 animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-2 pt-2">
              <button
                onClick={() => handleNavClick('fryzjerzy')}
                className={`text-left px-3 py-2.5 rounded-none text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'fryzjerzy'
                    ? 'bg-neutral-800 text-[#d4af37] font-bold'
                    : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#d4af37]'
                }`}
              >
                Fryzjerzy
              </button>
              <button
                onClick={() => handleNavClick('salon')}
                className={`text-left px-3 py-2.5 rounded-none text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'salon'
                    ? 'bg-neutral-800 text-[#d4af37] font-bold'
                    : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#d4af37]'
                }`}
              >
                Salon
              </button>
              <button
                onClick={() => handleNavClick('uslugi')}
                className={`text-left px-3 py-2.5 rounded-none text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'uslugi'
                    ? 'bg-neutral-800 text-[#d4af37] font-bold'
                    : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#d4af37]'
                }`}
              >
                Usługi
              </button>
              <button
                onClick={() => handleNavClick('home', 'cennik')}
                className="text-left px-3 py-2.5 rounded-none text-sm font-medium text-neutral-200 hover:bg-neutral-800 hover:text-[#d4af37] cursor-pointer"
              >
                Cennik
              </button>
              <button
                onClick={() => handleNavClick('home', 'o-nas')}
                className="text-left px-3 py-2.5 rounded-none text-sm font-medium text-neutral-200 hover:bg-neutral-800 hover:text-[#d4af37] cursor-pointer"
              >
                O nas
              </button>
              <button
                onClick={() => handleNavClick('home', 'lokalizacja')}
                className="text-left px-3 py-2.5 rounded-none text-sm font-medium text-neutral-200 hover:bg-neutral-800 hover:text-[#d4af37] cursor-pointer"
              >
                Lokalizacja
              </button>
              <button
                onClick={() => handleNavClick('home', 'faq')}
                className="text-left px-3 py-2.5 rounded-none text-sm font-medium text-neutral-200 hover:bg-neutral-800 hover:text-[#d4af37] cursor-pointer"
              >
                FAQ
              </button>

              <div className="pt-3 border-t border-neutral-800 flex flex-col gap-3">
                {/* Language Switcher inside Mobile Menu */}
                <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 px-3 py-2">
                  <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Język strony
                  </span>
                  <div className="flex items-center bg-neutral-950 border border-neutral-700/80 rounded-none p-0.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        handleLanguageChange('PL');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-1 px-3 py-1 rounded-none transition-all cursor-pointer ${
                        language === 'PL'
                          ? 'bg-[#d4af37] text-neutral-950 font-bold shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>PL</span>
                      <span className="text-[12px]">🇵🇱</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleLanguageChange('EN');
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-1 px-3 py-1 rounded-none transition-all cursor-pointer ${
                        language === 'EN'
                          ? 'bg-[#d4af37] text-neutral-950 font-bold shadow-sm'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>EN</span>
                      <span className="text-[12px]">🇬🇧</span>
                    </button>
                  </div>
                </div>

                {/* Instagram inside Mobile Menu */}
                <a
                  href="https://www.instagram.com/fryzjergrzegorzlewko/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-none bg-neutral-900 border border-neutral-700 text-sm font-medium text-[#d4af37] hover:border-[#d4af37] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram @fryzjergrzegorzlewko</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
