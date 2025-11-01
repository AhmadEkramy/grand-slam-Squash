import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useChampionships } from '../hooks/useChampionships';

const Championships: React.FC = () => {
  const { t } = useLanguage();
  const { championships } = useChampionships();

  const handleRegister = (championship: any) => {
    const message = encodeURIComponent(`Hi! I want to register for ${championship.title} on ${championship.date}`);
    window.open(`https://wa.me/+201006115163?text=${message}`, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="championship-particle-1"></div>
        <div className="championship-particle-2"></div>
        <div className="championship-particle-3"></div>
        <div className="championship-particle-4"></div>
        <div className="championship-particle-5"></div>
        <div className="championship-particle-6"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-amber-50/60 to-orange-100/80"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="championship-title-container">
            <h2 className="championship-title-cinematic">
              <span className="championship-title-line-1">{t('championships', 'Championships')}</span>
              <span className="championship-title-line-2">{t('competeToWin', 'Compete to Win')}</span>
            </h2>
          </div>
          <div className="championship-subtitle-container">
            <p className="championship-subtitle-text">
              {t('championshipDescription', 'Join our exciting tournaments and championships. Showcase your skills and compete for glory!')}
            </p>
          </div>
        </div>

        {/* Championships Grid */}
        <div className="championship-grid-cinematic">
          {championships.map((championship, index) => (
            <div
              key={championship.id}
              className="championship-card-cinematic"
              style={{ animationDelay: `${index * 0.25}s` }}
            >
              {/* Card Glow Effect */}
              <div className="championship-card-glow"></div>
              
              {/* Card Content */}
              <div className="championship-card-content">
                {/* Championship Image Container */}
                <div className="championship-image-container">
                  <div className="championship-image-wrapper">
                    <img
                      src={championship.image || '/placeholder.svg'}
                      alt={championship.title}
                      className="championship-image"
                    />
                    <div className="championship-image-overlay">
                      <div className="championship-image-glow"></div>
                    </div>
                  </div>
                  
                  {/* Championship Badge */}
                  <div className="championship-trophy-badge">
                    <span className="championship-badge-text">🏆</span>
                  </div>
                </div>

                {/* Championship Info */}
                <div className="championship-info">
                  <h3 className="championship-name">{championship.title}</h3>
                  <p className="championship-description">{championship.description}</p>
                  
                  {/* Teams Playing */}
                  {championship.teams && (
                    <div className="championship-teams">
                      <h4 className="championship-teams-title">{t('teamsPlaying', 'Teams Playing:')}</h4>
                      <div className="championship-teams-list">
                        {Array.isArray(championship.teams)
                          ? championship.teams.map((matchup: any, idx: number) => (
                              <div key={idx} className="championship-matchup">
                                <span className="championship-team-a">{matchup.teamA}</span>
                                <span className="championship-vs">VS</span>
                                <span className="championship-team-b">{matchup.teamB}</span>
                              </div>
                            ))
                          : <span className="championship-teams-text">{championship.teams}</span>}
                      </div>
                    </div>
                  )}
                </div>

                {/* Championship Details */}
                <div className="championship-details">
                  <div className="championship-detail-item">
                    <svg className="championship-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="championship-detail-text">{championship.date}</span>
                  </div>
                  <div className="championship-detail-item">
                    <svg className="championship-detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="championship-detail-text">{championship.time}</span>
                  </div>
                </div>

                {/* Championship Footer */}
                <div className="championship-footer">
                  {championship.registrationEnabled ? (
                    <button
                      onClick={() => handleRegister(championship)}
                      className="championship-register-btn"
                    >
                      <span className="championship-register-btn-text">{t('register', 'Register')}</span>
                      <div className="championship-register-btn-glow"></div>
                      <svg className="championship-register-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  ) : (
                    <div className="championship-closed">
                      <span className="championship-closed-text">{t('registrationClosed', 'Registration Closed')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Shimmer Effect */}
              <div className="championship-shimmer-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Championships;
