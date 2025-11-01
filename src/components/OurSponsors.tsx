import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const sponsors = [
  {
    id: 1,
    name: 'Lavie - لاقي',
    logo: '/logo.png',
    category: 'Water Products',
    description: 'A Quality Product by the Nile Water factory. منتج عالي الجودة من مصنع مياه النيل',
    website: 'https://lavie.com',
    tier: 'platinum'
  },
  {
    id: 2,
    name: 'Wilson - ويلسون',
    logo: '/logo.png',
    category: 'Sports Equipment',
    description: 'هي واحدة من أشهر شركات الأدوات الرياضية في العالم، (ويلسون) مقرها في شيكاغو - أمريكا، واتأسست سنة 1913',
    website: 'https://wilson.com',
    tier: 'gold'
  },
  {
    id: 3,
    name: 'الخياط للجملة',
    logo: '/logo.png',
    category: 'Stationery & Gifts',
    description: 'متجر خاص ببيع الادوات المكتبية والهدايا و الاكسسوارات ولعب الأطفال بأسعار الجملة العنوان اول ش العطارين خلف مسجد البحر',
    website: 'https://alkhayyat.com',
    tier: 'silver'
  }
];

const OurSponsors: React.FC = () => {
  const { t } = useLanguage();

  const handleSponsorClick = (sponsor: any) => {
    window.open(sponsor.website, '_blank');
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'from-gray-100 to-gray-200';
      case 'gold': return 'from-yellow-100 to-yellow-200';
      case 'silver': return 'from-gray-100 to-gray-200';
      case 'bronze': return 'from-orange-100 to-orange-200';
      default: return 'from-gray-100 to-gray-200';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 'bronze': return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-600';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="sponsor-particle-1"></div>
        <div className="sponsor-particle-2"></div>
        <div className="sponsor-particle-3"></div>
        <div className="sponsor-particle-4"></div>
        <div className="sponsor-particle-5"></div>
        <div className="sponsor-particle-6"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-purple-50/60 to-indigo-100/80"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="sponsor-title-container">
            <h2 className="sponsor-title-cinematic">
              <span className="sponsor-title-line-1">{t('ourSponsors', 'Our Sponsors')}</span>
              <span className="sponsor-title-line-2">{t('trustedPartners', 'Trusted Partners')}</span>
            </h2>
          </div>
          <div className="sponsor-subtitle-container">
            <p className="sponsor-subtitle-text">
              {t('sponsorDescription', 'We are proud to partner with industry leaders who share our passion for excellence in sports.')}
            </p>
          </div>
        </div>

        {/* Sponsors Grid */}
        <div className="sponsor-grid-cinematic">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.id}
              className="sponsor-card-cinematic"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleSponsorClick(sponsor)}
            >
              {/* Card Glow Effect */}
              <div className="sponsor-card-glow"></div>
              
              {/* Card Content */}
              <div className="sponsor-card-content">
                {/* Sponsor Logo Container */}
                <div className="sponsor-logo-container">
                  <div className="sponsor-logo-wrapper">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="sponsor-logo"
                    />
                    <div className="sponsor-logo-overlay">
                      <div className="sponsor-logo-glow"></div>
                    </div>
                  </div>
                  
                  {/* Tier Badge */}
                  <div className={`sponsor-tier-badge ${getTierBadgeColor(sponsor.tier)}`}>
                    <span className="sponsor-tier-text">{sponsor.tier.toUpperCase()}</span>
                  </div>
                </div>

                {/* Sponsor Info */}
                <div className="sponsor-info">
                  <h3 className="sponsor-name">{sponsor.name}</h3>
                  <p className="sponsor-category">{sponsor.category}</p>
                  <p className="sponsor-description">{sponsor.description}</p>
                  
                  {/* Sponsor Features */}
                  <div className="sponsor-features">
                    <div className="sponsor-feature-item">
                      <svg className="sponsor-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{t('verifiedPartner', 'Verified Partner')}</span>
                    </div>
                    <div className="sponsor-feature-item">
                      <svg className="sponsor-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{t('premiumQuality', 'Premium Quality')}</span>
                    </div>
                  </div>
                </div>

                {/* Sponsor Footer */}
                <div className="sponsor-footer">
                  <button className="sponsor-visit-btn">
                    <span className="sponsor-visit-btn-text">{t('visitWebsite', 'Visit Website')}</span>
                    <div className="sponsor-visit-btn-glow"></div>
                    <svg className="sponsor-visit-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Hover Shimmer Effect */}
              <div className="sponsor-shimmer-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurSponsors;
