import { useLanguage } from '../contexts/LanguageContext';

// Website social links (like the floating links)
const websiteSocialLinks = [
  {
    href: 'https://wa.me/201006115163?text=' + encodeURIComponent("Hello! I'm interested in booking a Squash court."),
    label: 'WhatsApp',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 transition-all duration-500 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="whatsapp-website-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#25d366" />
            <stop offset="100%" stopColor="#128c7e" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#whatsapp-website-gradient)" strokeWidth="2" fill="none" />
        <path d="M21.5 17.5c-.3-.2-1.7-.9-2-.9-.2 0-.4-.1-.6.1-.2.2-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5 0 1.5 1.1 2.9 1.2 3.1.1.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.3-.2-.6-.3z" stroke="url(#whatsapp-website-gradient)" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    color: 'text-green-500',
    glowColor: 'rgba(37, 211, 102, 0.6)',
  },
  {
    href: 'https://www.facebook.com/share/16X9br8kBe/',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 transition-all duration-500 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="facebook-website-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1877f2" />
            <stop offset="100%" stopColor="#42a5f5" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#facebook-website-gradient)" strokeWidth="2" fill="none" />
        <path d="M18 10.5h2V8h-2c-2.2 0-4 1.8-4 4v2H10v3h4v7h3v-7h2.1l.4-3H17v-2c0-.6.4-1 1-1z" stroke="url(#facebook-website-gradient)" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    color: 'text-blue-500',
    glowColor: 'rgba(24, 119, 242, 0.6)',
  },
  {
    href: 'https://www.instagram.com/grandslamacademy1?igsh=MTV3OW1qNDA4NXE5ZA==',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 transition-all duration-500 group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="instagram-website-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="8" stroke="url(#instagram-website-gradient)" strokeWidth="2" fill="none" className="group-hover:stroke-[url(#instagram-website-gradient)]" />
        <rect x="9.5" y="9.5" width="13" height="13" rx="6.5" stroke="url(#instagram-website-gradient)" strokeWidth="2" fill="none" />
        <circle cx="23" cy="9" r="1.5" fill="url(#instagram-website-gradient)" />
      </svg>
    ),
    color: 'text-pink-400',
    glowColor: 'rgba(236, 72, 153, 0.6)',
  },
];

const Footer = () => {
  const { t } = useLanguage();
  
  return (
  <footer className="relative w-full overflow-hidden">
    {/* Animated Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 animate-gradient-shift bg-[length:400%_400%]"></div>
    
    {/* Floating Particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>

    {/* Main Content */}
    <div className="relative z-10 py-12 mt-12">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center">
        {/* Website Social Links Section */}
        <div className="mb-12 animate-fade-in-up">
          <h3 className="text-lg font-semibold text-gray-300 mb-6 tracking-wide">{t('followUs', 'Follow Us')}</h3>
          <div className="flex gap-8 justify-center">
            {websiteSocialLinks.map(({ href, label, icon, color, glowColor }, index) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group relative flex flex-col items-center"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                {/* Glowing Background Effect */}
                <div 
                  className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"
                  style={{ backgroundColor: glowColor }}
                ></div>
                
                {/* Icon Container */}
                <div className="relative z-10 rounded-2xl p-4 border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm group-hover:border-transparent group-hover:bg-gray-800/80 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 animate-glow-pulse">
                  <div className="relative">
                    {icon}
                    {/* Sparkle Effect */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-sparkle"></div>
                  </div>
                </div>
                
                {/* Label with Enhanced Typography */}
                <span className={`mt-3 text-sm font-semibold ${color} group-hover:text-white transition-all duration-500 group-hover:animate-text-glow tracking-wide`}>
                  {label}
                </span>
                
                {/* Hover Ripple Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-ping"></div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-12"></div>

        {/* Creator Section with Enhanced Glow */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="group relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative px-6 py-3 bg-gray-900 rounded-lg leading-none flex items-center">
              <span className="font-bold text-xl text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500 animate-text-glow">
                {t('websiteBy', 'Website by Ahmed Ekramy')}
              </span>
            </div>
          </div>
          <div className="mt-3 relative">
            <span className="text-sm text-gray-300 font-medium tracking-wide">{t('engineerTitle', 'Computer and Communications Engineer')}</span>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
          </div>
          <div className="mt-4">
            <a
              href="https://wa.me/201094543689"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.305 1.262.489 1.694.625.712.227 1.36.195 1.873.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.28.173-1.413-.074-.133-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span className="font-medium">01094543689</span>
            </a>
          </div>
        </div>

        {/* Copyright with Subtle Animation */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <span className="text-xs text-gray-400 font-medium tracking-wider">
            &copy; {new Date().getFullYear()} {t('siteName', 'Grand Slam')}. {t('allRightsReserved', 'All rights reserved.')}
          </span>
          <div className="mt-2 w-24 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto"></div>
        </div>
      </div>
    </div>

    {/* Bottom Glow Line */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse"></div>
  </footer>
  );
};

export default Footer; 