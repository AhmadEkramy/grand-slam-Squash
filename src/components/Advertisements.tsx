import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAdvertisements } from '../hooks/useAdvertisements';

const Advertisements: React.FC = () => {
  const { t } = useLanguage();
  const { advertisements } = useAdvertisements();

  const handleAdClick = (ad: any) => {
    if (ad.link) {
      window.open(ad.link, '_blank');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="ad-particle-1"></div>
        <div className="ad-particle-2"></div>
        <div className="ad-particle-3"></div>
        <div className="ad-particle-4"></div>
        <div className="ad-particle-5"></div>
        <div className="ad-particle-6"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/60 to-indigo-100/80"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="ad-title-container">
            <h2 className="ad-title-cinematic">
              <span className="ad-title-line-1">{t('advertisements', 'Advertisements')}</span>
              <span className="ad-title-line-2">{t('featuredContent', 'Featured Content')}</span>
            </h2>
          </div>
          <div className="ad-subtitle-container">
            <p className="ad-subtitle-text">
              {t('adDescription', 'Discover our latest promotions and featured content.')}
            </p>
          </div>
        </div>

        {/* Advertisements Grid */}
        <div className="ad-grid-cinematic">
          {advertisements.map((ad, index) => (
            <div
              key={ad.id}
              className="ad-card-cinematic"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleAdClick(ad)}
            >
              {/* Card Glow Effect */}
              <div className="ad-card-glow"></div>
              
              {/* Card Content */}
              <div className="ad-card-content">
                {/* Image Container */}
                <div className="ad-image-container">
                  <div className="ad-image-wrapper">
                    <img
                      src={ad.image}
                      alt={ad.title || 'Advertisement'}
                      className="ad-image"
                    />
                    <div className="ad-image-overlay">
                      <div className="ad-image-glow"></div>
                    </div>
                  </div>
                  
                  {/* Featured Badge */}
                  <div className="ad-featured-badge">
                    <span className="ad-featured-text">FEATURED</span>
                  </div>
                </div>

                {/* Ad Info */}
                <div className="ad-info">
                  {ad.title && (
                    <h3 className="ad-title">{ad.title}</h3>
                  )}
                  {ad.description && (
                    <p className="ad-description">{ad.description}</p>
                  )}
                  
                  {/* Ad Features */}
                  <div className="ad-features">
                    <div className="ad-feature-item">
                      <svg className="ad-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{t('trending', 'Trending')}</span>
                    </div>
                    <div className="ad-feature-item">
                      <svg className="ad-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{t('verified', 'Verified')}</span>
                    </div>
                  </div>
                </div>

                {/* Ad Footer */}
                <div className="ad-footer">
                  <button className="ad-view-btn">
                    <span className="ad-view-btn-text">{t('viewDetails', 'View Details')}</span>
                    <div className="ad-view-btn-glow"></div>
                    <svg className="ad-view-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Hover Shimmer Effect */}
              <div className="ad-shimmer-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advertisements;
