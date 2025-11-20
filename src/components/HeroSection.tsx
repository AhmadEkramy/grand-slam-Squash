import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, MapPin, Star, Trophy, Play } from 'lucide-react';

interface HeroSectionProps {
  onBookNowClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onBookNowClick }) => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-cinematic-section">
      {/* Enhanced Background with new image */}
      <div className="hero-cinematic-bg" aria-hidden />
      <div className="hero-cinematic-overlay" aria-hidden />
      
      {/* Animated background elements */}
      <div className="hero-cinematic-particles" aria-hidden>
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      <div className="container mx-auto px-4 text-center hero-cinematic-container">
        <div className="max-w-6xl mx-auto">
          {/* Main Title with Enhanced Effects */}
          <div className="hero-cinematic-title-container">
            <h1 className="hero-cinematic-title">
              <span className="title-line-1">{t('heroTitle', 'Welcome to the')}</span>
              <span className="title-line-2">Grand Slam Squash Academy</span>
            </h1>
            <div className="hero-cinematic-subtitle">
              <p className="subtitle-text">
                {t('heroSubtitle', 'Book your court today and enjoy playing Squash on the best courts in Damietta Governorate inside the arena.')}
              </p>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="hero-cinematic-cta">
            <button
              onClick={onBookNowClick}
              className="hero-cinematic-btn primary-btn"
            >
              <Play className="w-5 h-5" />
              <span>{t('bookNow', 'Book Now')}</span>
              <div className="btn-glow"></div>
            </button>

            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' })}
              className="hero-cinematic-btn secondary-btn"
            >
              <Calendar className="w-5 h-5" />
              <span>{t('ourPackages', 'Our Packages')}</span>
              <div className="btn-glow"></div>
            </button>
          </div>

          {/* Enhanced Court Visualization */}
          <div className="hero-cinematic-courts">
            <div className="court-cinematic-card" style={{ animationDelay: '0.3s' }}>
              <div className="court-card-header">
                <MapPin className="w-6 h-6" />
                <span>{t('court', 'Court')} 1</span>
                <div className="court-status available"></div>
              </div>
              <div className="court-card-visual">
                <div className="court-lines"></div>
                <div className="court-net"></div>
              </div>
              <div className="court-card-footer">
                <Star className="w-4 h-4" />
                <span>Premium Court</span>
              </div>
            </div>

            <div className="court-cinematic-card" style={{ animationDelay: '0.5s' }}>
              <div className="court-card-header">
                <MapPin className="w-6 h-6" />
                <span>{t('court', 'Court')} 2</span>
                <div className="court-status available"></div>
              </div>
              <div className="court-card-visual">
                <div className="court-lines"></div>
                <div className="court-net"></div>
              </div>
              <div className="court-card-footer">
                <Star className="w-4 h-4" />
                <span>Premium Court</span>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="hero-cinematic-floating">
            <div className="floating-element floating-racket" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl">🎾</div>
            </div>
            <div className="floating-element floating-trophy" style={{ animationDelay: '0.4s' }}>
              <Trophy className="w-16 h-16 text-yellow-400" />
            </div>
          </div>

          {/* Stats Section */}
          <div className="hero-cinematic-stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Happy Players</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2</div>
              <div className="stat-label">Premium Courts</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
