import { useState } from 'react';
import ServiceSelector from './ServiceSelector';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import BookingSummary from './BookingSummary';
import TimezoneSelect from './TimezoneSelect';
import { timezones } from '../data';
import './BookingForm.css';

export default function BookingForm() {
  const [selectedService, setSelectedService] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('05:30 pm');
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Karachi');
  const [showSummary, setShowSummary] = useState(false);

  const currentTz = timezones.find((t) => t.value === selectedTimezone);

  function handleServiceChange(newServiceId) {
    setSelectedService(newServiceId);
  }

  return (
    <main className="booking" id="booking-section">
      {/* Background watermark */}
      <div className="booking__watermark">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="170" stroke="rgba(42,179,160,0.08)" strokeWidth="8" />
          <circle cx="200" cy="200" r="140" stroke="rgba(42,179,160,0.06)" strokeWidth="4" />
          <text x="200" y="160" textAnchor="middle" fill="rgba(42,179,160,0.1)" fontSize="42" fontWeight="800" fontFamily="Inter">EPA</text>
          <text x="200" y="210" textAnchor="middle" fill="rgba(42,179,160,0.08)" fontSize="32" fontWeight="700" fontFamily="Inter">LEAD-SAFE</text>
          <text x="200" y="260" textAnchor="middle" fill="rgba(42,179,160,0.06)" fontSize="18" fontWeight="600" fontFamily="Inter">CERTIFIED FIRM</text>
          <path d="M140 110 L200 70 L260 110" stroke="rgba(42,179,160,0.07)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="200" cy="80" r="12" stroke="rgba(42,179,160,0.08)" strokeWidth="3" fill="none" />
          <path d="M175 300 C175 280 225 280 225 300" stroke="rgba(42,179,160,0.06)" strokeWidth="3" fill="none" />
        </svg>
      </div>

      <div className="booking__container">
        {/* Welcome */}
        <div className="booking__welcome">
          <h2 className="booking__welcome-title">Welcome!</h2>
          <p className="booking__welcome-text">
            Book your appointment in few simple steps: Choose a service, pick your date and time, and fill in your details. See you soon!
          </p>
        </div>

        {/* Form grid */}
        <div className="booking__grid">
          {/* Row 1 */}
          <div className="booking__row">
            <div className="booking__col booking__col--service">
              <ServiceSelector selected={selectedService} onSelect={setSelectedService} />
            </div>
            <div className="booking__col booking__col--staff">
              <div className="booking__staff-card">
                <span className="booking__staff-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2AB3A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <span className="booking__staff-name">EPA Lead Base</span>
              </div>
            </div>
            <div className="booking__col booking__col--date">
              <DatePicker selectedDate={selectedDate} onSelect={setSelectedDate} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="booking__row">
            <div className="booking__col booking__col--timezone">
              <TimezoneSelect
                value={selectedTimezone}
                onChange={setSelectedTimezone}
              />
            </div>
            <div className="booking__col booking__col--time">
              <TimePicker selected={selectedTime} onSelect={setSelectedTime} />
            </div>
            <div className="booking__col booking__col--book">
              <button
                className="booking__book-btn"
                onClick={() => setShowSummary(true)}
                type="button"
                id="book-appointment-btn"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Summary Slide-in Panel */}
      {showSummary && (
        <BookingSummary
          serviceId={selectedService}
          date={selectedDate}
          time={selectedTime}
          timezone={currentTz}
          onClose={() => setShowSummary(false)}
          onServiceChange={handleServiceChange}
        />
      )}
    </main>
  );
}
