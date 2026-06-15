import { useState } from 'react';
import { services, bedroomOptions, propertyTypes, MONTH_SHORT } from '../data';
import './BookingSummary.css';

export default function BookingSummary({ serviceId, date, time, timezone, onClose, onServiceChange }) {
  const service = services.find((s) => s.id === serviceId);
  const isLeadPaint = serviceId === 9; // Lead-Based Paint Visual Assessment
  const [showServicePicker, setShowServicePicker] = useState(false);

  const [form, setForm] = useState({
    propertyAddress: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    contactNumber: '',
    bedrooms: '',
    lockBoxCode: '',
    tenantInfo: '',
    howDidYouHear: '',
    propertyType: '',
    paymentOption: 'payNow',
  });

  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const AZURE_FUNCTION_URL = import.meta.env.VITE_AZURE_FUNCTION_URL;

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }

  function formatDate() {
    if (!date) return '';
    return `${date.getDate()} ${MONTH_SHORT[date.getMonth()]} ${date.getFullYear()} ${time}`;
  }

  function validate() {
    const errs = {};
    if (!form.propertyAddress.trim()) errs.propertyAddress = 'Required';
    if (!isLeadPaint && !form.apartment.trim()) errs.apartment = 'Required';
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.state.trim()) errs.state = 'Required';
    if (!form.zipCode.trim()) errs.zipCode = 'Required';
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.contactNumber.trim()) errs.contactNumber = 'Required';
    if (!form.bedrooms) errs.bedrooms = 'Required';
    if (!form.lockBoxCode.trim()) errs.lockBoxCode = 'Required';
    if (!isLeadPaint && !form.tenantInfo.trim()) errs.tenantInfo = 'Required';
    if (!form.howDidYouHear.trim()) errs.howDidYouHear = 'Required';
    if (!isLeadPaint && !form.propertyType) errs.propertyType = 'Required';
    return errs;
  }

  async function handlePayment() {
    setPaymentLoading(true);
    try {
      const response = await fetch(AZURE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // ── Service info ──────────────────────────────
          serviceId:    service?.id,
          serviceName:  service?.name,
          servicePrice: service?.price,
          duration:     service?.duration,

          // ── Appointment details ───────────────────────
          bookingDate:   date ? date.toISOString() : null,
          bookingTime:   time,
          timezone:      timezone?.value  || '',
          timezoneLabel: timezone?.label  || '',
          paymentOption: form.paymentOption,

          // ── Customer contact ──────────────────────────
          firstName:     form.firstName,
          lastName:      form.lastName,
          email:         form.email,
          countryCode:   form.countryCode,
          contactNumber: form.contactNumber,

          // ── Property details ──────────────────────────
          propertyAddress: form.propertyAddress,
          apartment:       form.apartment,
          city:            form.city,
          state:           form.state,
          zipCode:         form.zipCode,
          bedrooms:        form.bedrooms,
          lockBoxCode:     form.lockBoxCode,
          tenantInfo:      form.tenantInfo,
          propertyType:    form.propertyType,
          howDidYouHear:   form.howDidYouHear,
        }),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = await response.json();
      if (!data.url) {
        throw new Error('No checkout URL returned from server.');
      }
      window.location.href = data.url;
    } catch (err) {
      console.error('[Stripe Payment Error]', err);
      alert(
        'Unable to start payment. Please check your connection and try again.\n\nDetails: ' +
        err.message
      );
      setPaymentLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // Lead-Based Paint with Pay Later → show confirmation screen (no payment)
    if (isLeadPaint && form.paymentOption === 'payLater') {
      setSubmitted(true);
      return;
    }
    // All other cases (Pay Now, or any non-Lead-Paint service) → Stripe Checkout
    await handlePayment();
  }

  function handleSelectService(id) {
    onServiceChange(id);
    setShowServicePicker(false);
  }

  if (submitted) {
    return (
      <>
        <div className="summary-overlay" onClick={onClose} />
        <div className="summary-panel" id="booking-summary-panel">
          <div className="summary-panel__header">
            <h2 className="summary-panel__title">Booking Confirmed!</h2>
            <button className="summary-panel__close" onClick={onClose} type="button" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="summary-panel__success">
            <div className="summary-panel__success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="summary-panel__success-title">Thank you, {form.firstName}!</h3>
            <p className="summary-panel__success-text">
              Your appointment for <strong>{service?.name}</strong> has been scheduled for <strong>{formatDate()}</strong>.
            </p>
            <p className="summary-panel__success-text">
              We'll send a confirmation email to <strong>{form.email}</strong>.
            </p>
            <div className="summary-panel__success-details">
              <div className="summary-panel__success-row">
                <span>Service:</span>
                <span>{service?.name}</span>
              </div>
              <div className="summary-panel__success-row">
                <span>Date & Time:</span>
                <span>{formatDate()}</span>
              </div>
              <div className="summary-panel__success-row">
                <span>Property:</span>
                <span>{form.propertyAddress}, {form.city}, {form.state} {form.zipCode}</span>
              </div>
              <div className="summary-panel__success-row">
                <span>Amount:</span>
                <span className="summary-panel__success-price">{service?.price} USD</span>
              </div>
              {isLeadPaint && (
                <div className="summary-panel__success-row">
                  <span>Payment:</span>
                  <span>{form.paymentOption === 'payNow' ? 'Pay Now' : 'Pay Later'}</span>
                </div>
              )}
            </div>
            <button className="summary-panel__done-btn" onClick={onClose} type="button">
              Done
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="summary-overlay" onClick={onClose} />
      <div className="summary-panel" id="booking-summary-panel">
        {/* Header */}
        <div className="summary-panel__header">
          <h2 className="summary-panel__title">Booking Summary</h2>
          <button className="summary-panel__close" onClick={onClose} type="button" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="summary-panel__body">
          {/* Service summary */}
          <div className="summary-panel__service">
            <span
              className="summary-panel__service-badge"
              style={{ backgroundColor: service?.number === 'L' ? '#4ade80' : '#FDE68A' }}
            >
              {service?.number}
            </span>
            <div className="summary-panel__service-info">
              <span className="summary-panel__service-name">{service?.name}</span>
              <span className="summary-panel__service-meta">
                ( {service?.duration} | {service?.price} USD | {service?.type} )
              </span>
            </div>
            <button
              className="summary-panel__change-btn"
              onClick={() => setShowServicePicker(!showServicePicker)}
              type="button"
            >
              Change
            </button>
          </div>

          {/* Inline Service Picker (shown when Change is clicked) */}
          {showServicePicker && (
            <div className="summary-panel__service-picker" id="summary-service-picker">
              <div className="summary-panel__service-picker-header">
                <span className="summary-panel__service-picker-title">Select a Service</span>
                <button
                  className="summary-panel__service-picker-close"
                  onClick={() => setShowServicePicker(false)}
                  type="button"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="summary-panel__service-list">
                {services.map((s) => (
                  <button
                    key={s.id}
                    className={`summary-panel__service-option ${serviceId === s.id ? 'summary-panel__service-option--selected' : ''}`}
                    onClick={() => handleSelectService(s.id)}
                    type="button"
                  >
                    <span
                      className="summary-panel__service-option-badge"
                      style={{ backgroundColor: s.number === 'L' ? '#4ade80' : '#FDE68A' }}
                    >
                      {s.number}
                    </span>
                    <div className="summary-panel__service-option-info">
                      <span className="summary-panel__service-option-name">{s.name}</span>
                      <span className="summary-panel__service-option-meta">
                        {s.duration} | {s.price} USD
                      </span>
                    </div>
                    {serviceId === s.id && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date/time row */}
          <div className="summary-panel__datetime">
            <div className="summary-panel__datetime-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2AB3A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{formatDate()}</span>
            </div>
            <div className="summary-panel__datetime-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2AB3A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{timezone?.label}</span>
            </div>
          </div>

          {/* Form */}
          <form className="summary-panel__form" onSubmit={handleSubmit} id="booking-details-form">
            <h3 className="summary-panel__form-title">Please enter your details</h3>

            {/* Property Address */}
            <div className="form-group">
              <label className="form-label">
                Property Address <span className="form-required">*</span>
              </label>
              <input
                className={`form-input ${errors.propertyAddress ? 'form-input--error' : ''}`}
                type="text"
                placeholder="Property Address"
                value={form.propertyAddress}
                onChange={(e) => handleChange('propertyAddress', e.target.value)}
                id="input-property-address"
              />
              {errors.propertyAddress && <span className="form-error">{errors.propertyAddress}</span>}
            </div>

            {/* Apartment — only for bedroom services */}
            {!isLeadPaint && (
              <div className="form-group">
                <label className="form-label">
                  Apartment # <span className="form-required">*</span>
                </label>
                <input
                  className={`form-input ${errors.apartment ? 'form-input--error' : ''}`}
                  type="text"
                  placeholder="Apartment #"
                  value={form.apartment}
                  onChange={(e) => handleChange('apartment', e.target.value)}
                  id="input-apartment"
                />
                {errors.apartment && <span className="form-error">{errors.apartment}</span>}
              </div>
            )}

            {/* City */}
            <div className="form-group">
              <label className="form-label">
                City <span className="form-required">*</span>
              </label>
              <input
                className={`form-input ${errors.city ? 'form-input--error' : ''}`}
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                id="input-city"
              />
              {errors.city && <span className="form-error">{errors.city}</span>}
            </div>

            {/* State */}
            <div className="form-group">
              <label className="form-label">
                State <span className="form-required">*</span>
              </label>
              <input
                className={`form-input ${errors.state ? 'form-input--error' : ''}`}
                type="text"
                placeholder="State"
                value={form.state}
                onChange={(e) => handleChange('state', e.target.value)}
                id="input-state"
              />
              {errors.state && <span className="form-error">{errors.state}</span>}
            </div>

            {/* Zip Code */}
            <div className="form-group">
              <label className="form-label">
                Zip Code <span className="form-required">*</span>
              </label>
              <input
                className={`form-input ${errors.zipCode ? 'form-input--error' : ''}`}
                type="text"
                placeholder="Zip Code"
                value={form.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                id="input-zip-code"
              />
              {errors.zipCode && <span className="form-error">{errors.zipCode}</span>}
            </div>

            {/* First / Last Name */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  First Name <span className="form-required">*</span>
                </label>
                <input
                  className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
                  type="text"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  id="input-first-name"
                />
                {errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">
                  Last Name <span className="form-required">*</span>
                </label>
                <input
                  className={`form-input ${errors.lastName ? 'form-input--error' : ''}`}
                  type="text"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  id="input-last-name"
                />
                {errors.lastName && <span className="form-error">{errors.lastName}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                Email <span className="form-required">*</span>
              </label>
              <input
                className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                id="input-email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Contact Number */}
            <div className="form-group">
              <label className="form-label">
                Contact Number <span className="form-required">*</span>
              </label>
              <div className="form-phone">
                <select
                  className="form-phone__code"
                  value={form.countryCode}
                  onChange={(e) => handleChange('countryCode', e.target.value)}
                  id="input-country-code"
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+92">🇵🇰 +92</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>
                <input
                  className={`form-input form-phone__number ${errors.contactNumber ? 'form-input--error' : ''}`}
                  type="tel"
                  placeholder="Contact Number"
                  value={form.contactNumber}
                  onChange={(e) => handleChange('contactNumber', e.target.value)}
                  id="input-contact-number"
                />
              </div>
              {errors.contactNumber && <span className="form-error">{errors.contactNumber}</span>}
            </div>

            {/* Bedrooms */}
            <div className="form-group">
              <label className="form-label">
                How many bedrooms do property have? <span className="form-required">*</span>
              </label>
              <select
                className={`form-select ${errors.bedrooms ? 'form-input--error' : ''}`}
                value={form.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                id="input-bedrooms"
              >
                <option value="">Select Option</option>
                {bedroomOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors.bedrooms && <span className="form-error">{errors.bedrooms}</span>}
            </div>

            {/* Lock Box Code */}
            <div className="form-group">
              <label className="form-label">
                Lock Box Code <span className="form-required">*</span>
              </label>
              <input
                className={`form-input ${errors.lockBoxCode ? 'form-input--error' : ''}`}
                type="text"
                placeholder="Lock Box Code"
                value={form.lockBoxCode}
                onChange={(e) => handleChange('lockBoxCode', e.target.value)}
                id="input-lockbox-code"
              />
              {errors.lockBoxCode && <span className="form-error">{errors.lockBoxCode}</span>}
            </div>

            {/* Tenant Name & Phone — only for bedroom services */}
            {!isLeadPaint && (
              <div className="form-group">
                <label className="form-label">
                  Tenant Name & Phone number. <span className="form-required">*</span>
                </label>
                <input
                  className={`form-input ${errors.tenantInfo ? 'form-input--error' : ''}`}
                  type="text"
                  placeholder="Tenant Name & Phone number."
                  value={form.tenantInfo}
                  onChange={(e) => handleChange('tenantInfo', e.target.value)}
                  id="input-tenant-info"
                />
                {errors.tenantInfo && <span className="form-error">{errors.tenantInfo}</span>}
              </div>
            )}

            {/* How did you hear */}
            <div className="form-group">
              <label className="form-label">
                How did you hear about our business? <span className="form-required">*</span>
              </label>
              <input
                className={`form-input ${errors.howDidYouHear ? 'form-input--error' : ''}`}
                type="text"
                placeholder="How did you hear about our business?"
                value={form.howDidYouHear}
                onChange={(e) => handleChange('howDidYouHear', e.target.value)}
                id="input-referral"
              />
              {errors.howDidYouHear && <span className="form-error">{errors.howDidYouHear}</span>}
            </div>

            {/* Property Type — only for bedroom services */}
            {!isLeadPaint && (
              <div className="form-group">
                <label className="form-label">
                  Please select which best describe your property <span className="form-required">*</span>
                </label>
                <select
                  className={`form-select ${errors.propertyType ? 'form-input--error' : ''}`}
                  value={form.propertyType}
                  onChange={(e) => handleChange('propertyType', e.target.value)}
                  id="input-property-type"
                >
                  <option value="">Select Option</option>
                  {propertyTypes.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {errors.propertyType && <span className="form-error">{errors.propertyType}</span>}
              </div>
            )}

            {/* Payment Amount */}
            <div className="summary-panel__payment">
              <div className="summary-panel__payment-top">
                <span className="summary-panel__payment-label">Payment Amount</span>
                <span className="summary-panel__payment-amount">{service?.price} USD</span>
              </div>
              {/* Pay Later / Pay Now — only for Lead-Based Paint */}
              {isLeadPaint && (
                <div className="summary-panel__payment-options">
                  <span className="summary-panel__payment-options-label">Payment</span>
                  <label className="summary-panel__radio-label">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="payLater"
                      checked={form.paymentOption === 'payLater'}
                      onChange={(e) => handleChange('paymentOption', e.target.value)}
                      className="summary-panel__radio"
                      id="input-pay-later"
                    />
                    <span className="summary-panel__radio-custom" />
                    <span>Pay Later</span>
                  </label>
                  <label className="summary-panel__radio-label">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="payNow"
                      checked={form.paymentOption === 'payNow'}
                      onChange={(e) => handleChange('paymentOption', e.target.value)}
                      className="summary-panel__radio"
                      id="input-pay-now"
                    />
                    <span className="summary-panel__radio-custom" />
                    <span>Pay Now</span>
                  </label>
                </div>
              )}
            </div>

            {/* Disclaimer — different text for Lead-Based Paint */}
            <div className="summary-panel__disclaimer">
              <label className="summary-panel__checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="summary-panel__checkbox"
                  id="input-agree-terms"
                />
                <span className="summary-panel__disclaimer-text">
                  {isLeadPaint ? (
                    <>
                      <strong>All units in the First-Start Homebuyer program are subject to Lead-Based Paint requirements.</strong>{' '}
                      This form must be completed and included in each program participant file.
                    </>
                  ) : (
                    <>
                      <strong>Turn around time for Lead Test results are 10-20 business days.</strong>{' '}
                      Landlords will be required to test and certify rental properties as lead safe or lead free in order to:
                      <br />
                      A. Execute a new or renewed lease.
                      <br />
                      B. Receive or renew a rental license.
                    </>
                  )}
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              className="summary-panel__submit-btn"
              type="submit"
              id="pay-schedule-btn"
              disabled={!agreed || paymentLoading}
            >
              {paymentLoading ? 'Processing...' : 'Pay and Schedule Appointment'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
