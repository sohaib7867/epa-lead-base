import './PaymentStatus.css';

export default function PaymentStatus({ status }) {
  const isSuccess = status === 'success';

  function handleReturn() {
    // Remove query param and reload booking form
    window.location.href = window.location.pathname;
  }

  if (isSuccess) {
    return (
      <div className="ps__page">
        <div className="ps__card">

          {/* Animated checkmark */}
          <div className="ps__icon ps__icon--success">
            <svg className="ps__checkmark" viewBox="0 0 52 52">
              <circle className="ps__checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path  className="ps__checkmark-check"  fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>

          <h1 className="ps__title ps__title--success">Payment Successful!</h1>
          <p className="ps__subtitle">
            Your booking has been confirmed and saved. You'll receive a
            confirmation email shortly.
          </p>

          {/* What happens next */}
          <div className="ps__steps">
            <h2 className="ps__steps-title">What Happens Next</h2>
            <div className="ps__step">
              <span className="ps__step-num">1</span>
              <div>
                <strong>Confirmation Email</strong>
                <p>Check your inbox for booking details and appointment info.</p>
              </div>
            </div>
            <div className="ps__step">
              <span className="ps__step-num">2</span>
              <div>
                <strong>Inspection Appointment</strong>
                <p>Our inspector will arrive at the property on your selected date and time.</p>
              </div>
            </div>
            <div className="ps__step">
              <span className="ps__step-num">3</span>
              <div>
                <strong>Lab Results</strong>
                <p>Turn around time for Lead Test results is <strong>10–20 business days</strong>.</p>
              </div>
            </div>
            <div className="ps__step">
              <span className="ps__step-num">4</span>
              <div>
                <strong>Report Delivery</strong>
                <p>Your certified lead inspection report will be emailed directly to you.</p>
              </div>
            </div>
          </div>

          <div className="ps__notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>Questions? Email us at <a href="mailto:info@EPALeadBase.com">info@EPALeadBase.com</a></span>
          </div>

          <button className="ps__btn ps__btn--primary" onClick={handleReturn}>
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  // Cancelled
  return (
    <div className="ps__page">
      <div className="ps__card">

        {/* X icon */}
        <div className="ps__icon ps__icon--cancel">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        <h1 className="ps__title ps__title--cancel">Payment Cancelled</h1>
        <p className="ps__subtitle">
          Your payment was not completed and your booking has <strong>not</strong> been confirmed.
          No charge was made to your card.
        </p>

        <div className="ps__cancel-box">
          <p>Would you like to try again? Your form details are still available.</p>
        </div>

        <div className="ps__notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Need help? Contact us at <a href="mailto:info@EPALeadBase.com">info@EPALeadBase.com</a></span>
        </div>

        <button className="ps__btn ps__btn--primary" onClick={handleReturn}>
          Try Again
        </button>
      </div>
    </div>
  );
}
