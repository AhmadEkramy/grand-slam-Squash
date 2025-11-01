import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBookings } from '../hooks/useBookings';
import { TIME_SLOTS } from '../types';
import { MapPin, Clock, Calendar } from 'lucide-react';

interface CourtAvailabilityProps {
  onBookSlot: (court: 1 | 2, time: string, date: string) => void;
  isAdmin?: boolean;
}

const CourtAvailability: React.FC<CourtAvailabilityProps> = ({ onBookSlot, isAdmin }) => {
  const { t, language } = useLanguage();
  const { getAvailableSlots } = useBookings();
  
  // Get today's date properly
  const today = new Date();
  const todayString = today.getFullYear() + '-' + 
    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
    String(today.getDate()).padStart(2, '0');
  
  const [selectedDate, setSelectedDate] = useState(todayString);
  
  const availableSlots = getAvailableSlots(selectedDate);

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-success rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section with Cinematic Effects */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-primary mb-6 court-title-cinematic">
            {t('courtAvailability', 'Court Availability')}
          </h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-accent" />
            <p className="text-2xl text-gray-700 court-date-cinematic">
              {formatDate(selectedDate)}
            </p>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Date Picker with Enhanced Styling */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="court-date-picker"
                {...(isAdmin ? {} : { min: todayString })}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
            </div>
          </div>

          {/* Courts Grid with Cinematic Effects */}
          <div className="grid lg:grid-cols-2 gap-12">
            {[1, 2].map((courtNumber, index) => (
              <div 
                key={courtNumber} 
                className="court-card-cinematic group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Court Header */}
                <div className="court-header-cinematic">
                  <div className="flex items-center gap-3">
                    <div className="court-icon-cinematic">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-bold text-white court-name-cinematic">
                      {t(`court${courtNumber}`, `Court ${courtNumber}`)}
                    </span>
                  </div>
                  <div className="court-status-indicator"></div>
                </div>

                {/* Court Content */}
                <div className="p-8">
                  {/* Time Selection Header */}
                  <div className="flex items-center gap-3 mb-8">
                    <Clock className="w-6 h-6 text-accent court-icon-glow" />
                    <h3 className="text-2xl font-bold text-primary court-subtitle-cinematic">
                      {t('selectTime', 'Select Time')}
                    </h3>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-4 gap-4 mb-10">
                    {TIME_SLOTS.map((timeSlot, slotIndex) => {
                      const slot = availableSlots.find(s => s.time === timeSlot && s.court === courtNumber);
                      const isAvailable = slot?.available || false;
                      
                      // Format time for Arabic
                      let displayTime = timeSlot;
                      if (language === 'ar') {
                        displayTime = timeSlot.replace('AM', 'ص').replace('PM', 'م');
                      }
                      
                      return (
                        <button
                          key={`${courtNumber}-${timeSlot}`}
                          className={`court-time-slot ${isAvailable ? 'available' : 'booked'}`}
                          disabled={!isAvailable}
                          onClick={isAvailable ? () => onBookSlot(courtNumber as 1 | 2, timeSlot, selectedDate) : undefined}
                          style={{ animationDelay: `${slotIndex * 0.05}s` }}
                        >
                          <span className="relative z-10 font-semibold">{displayTime}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-8 court-legend">
                    <div className="flex items-center gap-3">
                      <div className="court-legend-indicator available"></div>
                      <span className="text-gray-700 font-semibold text-lg">
                        {t('available', 'Available')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="court-legend-indicator booked"></div>
                      <span className="text-gray-700 font-semibold text-lg">
                        {t('booked', 'Booked')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourtAvailability;
