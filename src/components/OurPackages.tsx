import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TrainingCard } from '../types';

const packages = [
  { hours: 1, price: 150, vip: false },
  { hours: 2, price: 300, vip: false },
  { hours: 3, price: 450, vip: false },
  { hours: 4, price: 600, vip: true },
];

const OurPackages: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="package-particle-1"></div>
        <div className="package-particle-2"></div>
        <div className="package-particle-3"></div>
        <div className="package-particle-4"></div>
        <div className="package-particle-5"></div>
        <div className="package-particle-6"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-slate-50/60 to-gray-100/80"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="package-title-container">
            <h2 className="package-title-cinematic">
              <span className="package-title-line-1">{t('ourPackages', 'Our Packages')}</span>
              <span className="package-title-line-2">{t('chooseDuration', 'Choose Your Perfect Game')}</span>
            </h2>
          </div>
          <div className="package-subtitle-container">
            <p className="package-subtitle-text">
              {t('packageDescription', 'Select the ideal duration for your Squash experience. From quick games to extended sessions, we have the perfect package for you.')}
            </p>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="package-grid-cinematic">
          {packages.map((pkg, index) => (
            <div
              key={pkg.hours}
              className={`package-card-cinematic ${pkg.vip ? 'package-card-vip' : 'package-card-standard'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card Glow Effect */}
              <div className="package-card-glow"></div>
              
              {/* Card Content */}
              <div className="package-card-content">
                {/* VIP Badge */}
                {pkg.vip && (
                  <div className="package-vip-badge">
                    <span className="package-vip-text">{t('vip', 'VIP')}</span>
                    <svg className="package-vip-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" />
                    </svg>
                  </div>
                )}

                {/* Package Icon and Duration */}
                <div className="package-duration-container">
                  <div className="package-icon-wrapper">
                    <svg className="package-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div className="package-duration-text">
                    <span className="package-hours">{pkg.hours}</span>
                    <span className="package-hours-label">
                      {pkg.hours === 1 ? t('hour', 'Hour') : t('hours', 'Hours')}
                    </span>
                  </div>
                </div>

                {/* Package Price */}
                <div className="package-price-container">
                  <span className="package-price-amount">{pkg.price}</span>
                  <span className="package-price-currency">{t('egp', 'EGP')}</span>
                </div>

                {/* Package Features */}
                <div className="package-features">
                  <div className="package-feature-item">
                    <svg className="package-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t('courtAccess', 'Court Access')}</span>
                  </div>
                  <div className="package-feature-item">
                    <svg className="package-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{t('equipmentIncluded', 'Equipment Included')}</span>
                  </div>
                  {pkg.vip && (
                    <div className="package-feature-item package-feature-vip">
                      <svg className="package-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{t('priorityBooking', 'Priority Booking')}</span>
                    </div>
                  )}
                </div>

                {/* Book Now Button */}
                <button
                  className={`package-book-btn ${pkg.vip ? 'package-book-btn-vip' : 'package-book-btn-standard'}`}
                >
                  <span className="package-book-btn-text">{t('bookNow', 'Book Now')}</span>
                  <div className="package-book-btn-glow"></div>
                  <svg className="package-book-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Hover Shimmer Effect */}
              <div className="package-shimmer-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface TrainingSectionProps {
  trainings: TrainingCard[];
}

export const TrainingSection: React.FC<TrainingSectionProps> = ({ trainings }) => {
  const { t } = useLanguage();
  const whatsappNumber = '201006115163';
  const whatsappMsg = encodeURIComponent('I want to subscribe in the Squash training');
  
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="training-particle-1"></div>
        <div className="training-particle-2"></div>
        <div className="training-particle-3"></div>
        <div className="training-particle-4"></div>
        <div className="training-particle-5"></div>
        <div className="training-particle-6"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-emerald-50/60 to-teal-100/80"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="training-title-container">
            <h2 className="training-title-cinematic">
              <span className="training-title-line-1">{t('trainingSectionTitle', 'Training Section')}</span>
              <span className="training-title-line-2">{t('expertCoaching', 'Expert Coaching')}</span>
            </h2>
          </div>
          <div className="training-subtitle-container">
            <p className="training-subtitle-text">
              {t('trainingDescription', 'Elevate your game with our professional training programs designed for all skill levels.')}
            </p>
          </div>
        </div>

        {/* Training Cards Grid */}
        <div className="training-grid-cinematic">
          {trainings.map((training, index) => (
            <div
              key={training.id || index}
              className="training-card-cinematic"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Card Glow Effect */}
              <div className="training-card-glow"></div>
              
              {/* Card Content */}
              <div className="training-card-content">
                {/* Training Image Container */}
                <div className="training-image-container">
                  <div className="training-image-wrapper">
                    <img
                      src={training.image}
                      alt={training.title}
                      className="training-image"
                    />
                    <div className="training-image-overlay">
                      <div className="training-image-glow"></div>
                    </div>
                  </div>
                  
                  {/* Training Badge */}
                  <div className="training-level-badge">
                    <span className="training-badge-text">{t('professional', 'PRO')}</span>
                  </div>
                </div>

                {/* Training Info */}
                <div className="training-info">
                  <h3 className="training-name">{training.title}</h3>
                  <p className="training-description">{training.description}</p>
                  
                  {/* Training Features */}
                  <div className="training-features">
                    <div className="training-feature-item">
                      <svg className="training-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{t('certifiedCoaches', 'Certified Coaches')}</span>
                    </div>
                    <div className="training-feature-item">
                      <svg className="training-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{t('flexibleSchedule', 'Flexible Schedule')}</span>
                    </div>
                    <div className="training-feature-item">
                      <svg className="training-feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{t('rapidProgress', 'Rapid Progress')}</span>
                    </div>
                  </div>
                </div>

                {/* Training Footer */}
                <div className="training-footer">
                  <div className="training-price-container">
                    <span className="training-price-currency">{t('egp', 'EGP')}</span>
                    <span className="training-price-amount">{training.price}</span>
                  </div>
                  
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="training-subscribe-btn"
                  >
                    <span className="training-subscribe-btn-text">{t('subscribeNow', 'Subscribe Now')}</span>
                    <div className="training-subscribe-btn-glow"></div>
                    <svg className="training-subscribe-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Hover Shimmer Effect */}
              <div className="training-shimmer-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPackages; 