import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  siteName: { en: 'Grand Slam', ar: 'جراند سلام' },
  home: { en: 'Home', ar: 'الرئيسية' },
  myBookings: { en: 'My Bookings', ar: 'حجوزاتي' },
  admin: { en: 'Admin', ar: 'إدارة' },
  bookNow: { en: 'Book Now', ar: 'احجز الآن' },
  court: { en: 'Court', ar: 'الملعب' },
  court1: { en: 'Court 1', ar: 'ملعب 1' },
  court2: { en: 'Court 2', ar: 'ملعب 2' },
  available: { en: 'Available', ar: 'متاح' },
  booked: { en: 'Booked', ar: 'محجوز' },
  selectTime: { en: 'Select Time', ar: 'اختار الوقت' },
  squashShop: { en: 'Squash Shop', ar: 'منتجات الاسكواش' },
  heroTitle: { 
    en: 'Welcome to the Grand Slam Squash Academy', 
    ar: 'اهلا بكم فى أكاديمية جراند سلام للاسكواش' 
  },
  heroSubtitle: { 
    en: 'Book your court today and enjoy playing Squash on the best courts in Damietta Governorate inside the arena.', 
    ar: 'احجز ملعبك اليوم واستمتع بممارسة الاسكواش على أفضل ملاعب بمحافظة دمياط داخل الساحة' 
  },
  courtAvailability: { en: 'Court Availability', ar: 'توفر الملاعب' },
  shop: { en: 'Squash Shop', ar: 'متجر السكاش' },
  championships: { en: 'Championships', ar: 'البطولات' },
  advertisements: { en: 'Our Sponsors', ar: 'الرعاة الرسميين' },
  fullName: { en: 'Full Name', ar: 'الاسم الكامل' },
  phoneNumber: { en: 'Phone Number', ar: 'رقم الهاتف' },
  selectCourt: { en: 'Select Court', ar: 'اختر الملعب' },
  reservationType: { en: 'Reservation Type', ar: 'نوع الحجز' },
  startTime: { en: 'Start Time', ar: 'وقت البداية' },
  endTime: { en: 'End Time', ar: 'وقت النهاية' },
  submitBooking: { en: 'Submit Booking', ar: 'تأكيد الحجز' },
  bookingSuccess: { 
    en: '✅ You have successfully booked the court. Enjoy your game!', 
    ar: '✅ تم حجز الملعب بنجاح. استمتع بلعبتك!' 
  },
  price: { en: 'Price', ar: 'السعر' },
  buyNow: { en: 'Buy Now', ar: 'اشتري الآن' },
  egp: { en: 'EGP', ar: 'جنيه' },
  register: { en: 'Register', ar: 'سجل' },
  viewDetails: { en: 'View Details', ar: 'عرض التفاصيل' },
  loading: { en: 'Loading...', ar: 'جاري التحميل...' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  confirm: { en: 'Confirm', ar: 'تأكيد' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  save: { en: 'Save', ar: 'حفظ' },
  close: { en: 'Close', ar: 'إغلاق' },
  ourPackages: { en: 'Our Packages', ar: 'باقاتنا' },
  chooseDuration: { en: 'Choose the perfect duration for your game', ar: 'اختر المدة المثالية للعبتك' },
  packageDescription: { en: 'Select the ideal duration for your Squash experience. From quick games to extended sessions, we have the perfect package for you.', ar: 'اختر المدة المثالية لتجربة السكاش الخاصة بك. من الألعاب السريعة إلى الجلسات الممتدة، لدينا الباقة المثالية لك.' },
  vip: { en: 'VIP', ar: 'كبار الشخصيات' },
  hour: { en: 'Hour', ar: 'ساعة' },
  whatsappPurchaseMsg: { en: `Hi! I'm interested in purchasing {name} for {price} EGP`, ar: 'مرحبًا! أود شراء {name} مقابل {price} جنيه' },
  market: { en: 'Market', ar: 'السوق' },
  english: { en: 'English', ar: 'الإنجليزية' },
  trainingSectionTitle: { en: 'Training Section', ar: 'قسم التدريب' },
  trainingCard1Title: { en: 'Beginner Squash Training', ar: 'تدريب السكاش للمبتدئين' },
  trainingCard1Desc: { en: 'Learn the basics of Squash with our expert coaches. Perfect for newcomers!', ar: 'تعلم أساسيات السكاش مع مدربينا الخبراء. مثالي للمبتدئين!' },
  trainingCard2Title: { en: 'Advanced Squash Training', ar: 'تدريب السكاش المتقدم' },
  trainingCard2Desc: { en: 'Take your Squash skills to the next level with advanced drills and tactics.', ar: 'ارتق بمهاراتك في السكاش إلى المستوى التالي مع تدريبات وتكتيكات متقدمة.' },
  subscribeNow: { en: 'Subscribe now', ar: 'اشترك الآن' },
  followUs: { en: 'Follow Us', ar: 'تابعنا' },
  websiteBy: { en: 'Website by Ahmed Ekramy', ar: 'الموقع من تصميم أحمد إكرامي' },
  engineerTitle: { en: 'Computer and Communications Engineer', ar: 'مهندس حاسبات واتصالات' },
  allRightsReserved: { en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' },
  competeToWin: { en: 'Compete to Win', ar: 'تنافس للفوز' },
  championshipDescription: { en: 'Join our exciting tournaments and championships. Showcase your skills and compete for glory!', ar: 'انضم إلى بطولاتنا ومسابقاتنا المثيرة. أظهر مهاراتك وتنافس من أجل المجد!' },
  expertCoaching: { en: 'Expert Coaching', ar: 'تدريب خاص ' },
  trainingDescription: { en: 'Elevate your game with our professional training programs designed for all skill levels.', ar: 'ارتق بلعبتك مع برامجنا التدريبية المهنية المصممة لجميع مستويات المهارة.' },
  featuredContent: { en: 'Featured Content', ar: 'محتوى مميز' },
  adDescription: { en: 'Discover our latest promotions and featured content.', ar: 'اكتشف أحدث عروضنا والمحتوى المميز.' },
  premiumEquipment: { en: 'Premium Equipment', ar: 'معدات ممتازة' },
  shopDescription: { en: 'Discover our curated collection of professional-grade Squash equipment and accessories.', ar: 'اكتشف مجموعتنا المختارة من معدات وملحقات الاسكواش الاحترافية' },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key: string, fallback?: string): string => {
    const translation = translations[key];
    if (translation && translation[language]) {
      return translation[language];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
