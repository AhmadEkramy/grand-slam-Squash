import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { RESERVATION_TYPES, TIME_SLOTS } from '../types';
import { X, User, Phone, Calendar, MapPin, Clock, CreditCard } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingData: any) => void;
  loading: boolean;
  getAvailableSlots: (date: string) => { time: string; available: boolean; court: 1 | 2 }[];
  selectedCourt?: 1 | 2 | null;
  selectedTime?: string;
  selectedDate?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit, loading, getAvailableSlots, selectedCourt, selectedTime, selectedDate }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Get today's date properly
  const today = new Date();
  const todayString = today.getFullYear() + '-' + 
    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
    String(today.getDate()).padStart(2, '0');
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    court: selectedCourt || 1,
    reservationType: '1hour' as keyof typeof RESERVATION_TYPES,
    startTime: selectedTime || '',
    date: selectedDate || todayString
  });

  // Get available slots for the selected date
  const availableSlots = getAvailableSlots(formData.date).filter(slot => slot.court === formData.court && slot.available);
  const availableTimes = availableSlots.map(slot => slot.time);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    setFormData({...formData, phoneNumber: value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reservationInfo = RESERVATION_TYPES[formData.reservationType];
    const startIdx = TIME_SLOTS.indexOf(formData.startTime);
    const endIdx = startIdx + reservationInfo.duration;
    const endTime = TIME_SLOTS[endIdx];

    const bookingData = {
      ...formData,
      endTime,
      price: reservationInfo.price
    };

    onSubmit(bookingData);
  };

  useEffect(() => {
    setFormData(f => ({
      ...f,
      court: selectedCourt || 1,
      startTime: selectedTime || '',
      date: selectedDate || todayString
    }));
  }, [selectedCourt, selectedTime, selectedDate, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 booking-modal-overlay">
      <div className="booking-modal-container">
        {/* Modal Header */}
        <div className="booking-modal-header">
          <div className="flex items-center gap-3">
            <div className="booking-modal-icon">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="booking-modal-title">
              {t('bookNow', 'Book Now')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="booking-modal-close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="booking-modal-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div className="booking-field-group">
              <label className="booking-field-label">
                <User className="w-5 h-5" />
                {t('fullName', 'Full Name')}
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="booking-field-input"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone Number Field */}
            <div className="booking-field-group">
              <label className="booking-field-label">
                <Phone className="w-5 h-5" />
                {t('phoneNumber', 'Phone Number')}
              </label>
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handlePhoneNumberChange}
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="0123456789"
                className="booking-field-input"
              />
            </div>

            {/* Date Field */}
            <div className="booking-field-group">
              <label className="booking-field-label">
                <Calendar className="w-5 h-5" />
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value, startTime: ''})}
                className="booking-field-input"
                min={todayString}
              />
            </div>

            {/* Court Selection */}
            <div className="booking-field-group">
              <label className="booking-field-label">
                <MapPin className="w-5 h-5" />
                {t('selectCourt', 'Select Court')}
              </label>
              <select
                value={formData.court}
                onChange={(e) => setFormData({...formData, court: parseInt(e.target.value) as 1 | 2, startTime: ''})}
                className="booking-field-select"
              >
                <option value={1}>{t('court', 'Court')} 1</option>
                <option value={2}>{t('court', 'Court')} 2</option>
              </select>
            </div>

            {/* Reservation Type */}
            <div className="booking-field-group">
              <label className="booking-field-label">
                <CreditCard className="w-5 h-5" />
                {t('reservationType', 'Reservation Type')}
              </label>
              <select
                value={formData.reservationType}
                onChange={(e) => setFormData({...formData, reservationType: e.target.value as keyof typeof RESERVATION_TYPES})}
                className="booking-field-select"
              >
                {Object.entries(RESERVATION_TYPES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label} - {value.price} {t('egp', 'EGP')}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Selection */}
            <div className="booking-field-group">
              <label className="booking-field-label">
                <Clock className="w-5 h-5" />
                {t('startTime', 'Start Time')}
              </label>
              <div className="booking-time-container">
                <div className="booking-time-header">Available Times</div>
                <div className="booking-time-grid">
                  {TIME_SLOTS.filter(slot => availableTimes.includes(slot)).map((slot, index) => (
                    <button
                      type="button"
                      key={slot}
                      className={`booking-time-slot ${formData.startTime === slot ? 'selected' : ''}`}
                      onClick={() => setFormData({...formData, startTime: slot})}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <span className="relative z-10 font-semibold">{slot}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="booking-submit-container">
              <button
                type="submit"
                disabled={loading}
                className="booking-submit-btn"
              >
                <span className="relative z-10">
                  {loading ? t('loading', 'Loading...') : t('submitBooking', 'Submit Booking')}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
