import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (page: string) => {
    setMobileMenuOpen(false);
    if (page === 'home') {
      onNavigate('home');
      setTimeout(() => {
        scrollToSection('hero');
      }, 100);
    } else if (page === 'admin') {
      onNavigate('admin');
    } else if (page === 'profile') {
      onNavigate('profile');
    } else {
      onNavigate('home');
      setTimeout(() => {
        scrollToSection(page);
      }, 100);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-2xl shadow-primary/10 border-b border-accent/20' 
        : 'bg-white/90 backdrop-blur-sm shadow-lg'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo Section with Enhanced Effects */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-12 h-12 rounded-full object-cover bg-primary logo-cinematic group-hover:scale-110 transition-all duration-500 ease-out" 
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
            </div>
            <h1 className="text-3xl font-bold text-primary title-cinematic group-hover:text-accent transition-all duration-500">
              {t('siteName', 'Grand Slam')}
            </h1>
          </div>

          {/* Desktop Navigation with Cinematic Effects */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('home')}
              className={`nav-cinematic ${
                currentPage === 'home' 
                  ? 'text-accent font-bold nav-active' 
                  : 'text-primary nav-inactive'
              }`}
            >
              <span className="relative z-10">{t('home', 'Home')}</span>
            </button>
            <button
              onClick={() => handleNavigation('courtAvailability')}
              className={`nav-cinematic ${
                currentPage === 'courtAvailability' 
                  ? 'text-accent font-bold nav-active' 
                  : 'text-primary nav-inactive'
              }`}
            >
              <span className="relative z-10">{t('court', 'Court')}</span>
            </button>
            <button
              onClick={() => handleNavigation('squashShop')}
              className={`nav-cinematic ${
                currentPage === 'squashShop' 
                  ? 'text-accent font-bold nav-active' 
                  : 'text-primary nav-inactive'
              }`}
            >
              <span className="relative z-10">{t('squashShop', 'Squash Shop')}</span>
            </button>
            <button
              onClick={() => handleNavigation('championships')}
              className={`nav-cinematic ${
                currentPage === 'championships' 
                  ? 'text-accent font-bold nav-active' 
                  : 'text-primary nav-inactive'
              }`}
            >
              <span className="relative z-10">{t('championships', 'Championships')}</span>
            </button>
            <button
              onClick={() => handleNavigation('admin')}
              className={`nav-cinematic ${
                currentPage === 'admin' 
                  ? 'text-accent font-bold nav-active' 
                  : 'text-primary nav-inactive'
              }`}
            >
              <span className="relative z-10">{t('admin', 'Admin')}</span>
            </button>
            <button
              onClick={() => handleNavigation('profile')}
              className={`nav-cinematic ${
                currentPage === 'profile' 
                  ? 'text-accent font-bold nav-active' 
                  : 'text-primary nav-inactive'
              }`}
            >
              <span className="relative z-10">{t('profile', 'Profile')}</span>
            </button>
          </div>

          {/* Action Buttons with Enhanced Effects */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="btn-cinematic px-4 py-2 text-sm font-semibold"
            >
              <span className="relative z-10">
                {language === 'en' ? 'العربية' : t('english', 'English')}
              </span>
            </button>
            
            {/* Mobile Menu Button with Animation */}
            <div className="md:hidden">
              <button 
                className="mobile-menu-btn text-primary hover:text-accent transition-all duration-300" 
                onClick={() => setMobileMenuOpen(true)}
              >
                <svg className="w-7 h-7 transform transition-transform duration-300 hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu - render ONLY on mobile (hidden on md and above) */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-500 animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="fixed top-0 right-0 w-80 h-full mobile-menu-container z-50 flex flex-col p-6 animate-slide-in-cinematic">
            {/* Close Button */}
            <button
              className="self-end mb-4 text-3xl text-primary hover:text-accent transition-all duration-300 hover:scale-110"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              <button
                onClick={() => handleNavigation('home')}
                className={`mobile-nav-cinematic w-full text-left ${
                  currentPage === 'home' 
                    ? 'text-accent font-bold mobile-nav-active' 
                    : 'text-primary mobile-nav-inactive'
                }`}
              >
                <span className="relative z-10 text-xl">{t('home', 'Home')}</span>
              </button>
              <button
                onClick={() => handleNavigation('courtAvailability')}
                className={`mobile-nav-cinematic w-full text-left ${
                  currentPage === 'courtAvailability' 
                    ? 'text-accent font-bold mobile-nav-active' 
                    : 'text-primary mobile-nav-inactive'
                }`}
              >
                <span className="relative z-10 text-xl">{t('court', 'Court')}</span>
              </button>
              <button
                onClick={() => handleNavigation('squashShop')}
                className={`mobile-nav-cinematic w-full text-left ${
                  currentPage === 'squashShop' 
                    ? 'text-accent font-bold mobile-nav-active' 
                    : 'text-primary mobile-nav-inactive'
                }`}
              >
                <span className="relative z-10 text-xl">{t('squashShop', 'Squash Shop')}</span>
              </button>
              <button
                onClick={() => handleNavigation('championships')}
                className={`mobile-nav-cinematic w-full text-left ${
                  currentPage === 'championships' 
                    ? 'text-accent font-bold mobile-nav-active' 
                    : 'text-primary mobile-nav-inactive'
                }`}
              >
                <span className="relative z-10 text-xl">{t('championships', 'Championships')}</span>
              </button>
              <button
                onClick={() => handleNavigation('admin')}
                className={`mobile-nav-cinematic w-full text-left ${
                  currentPage === 'admin' 
                    ? 'text-accent font-bold mobile-nav-active' 
                    : 'text-primary mobile-nav-inactive'
                }`}
              >
                <span className="relative z-10 text-xl">{t('admin', 'Admin')}</span>
              </button>
              <button
                onClick={() => handleNavigation('profile')}
                className={`mobile-nav-cinematic w-full text-left ${
                  currentPage === 'profile' 
                    ? 'text-accent font-bold mobile-nav-active' 
                    : 'text-primary mobile-nav-inactive'
                }`}
              >
                <span className="relative z-10 text-xl">{t('profile', 'Profile')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
