import { useState, useRef, useEffect } from 'react';
import { services } from '../data';
import './ServiceSelector.css';

export default function ServiceSelector({ selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedService = services.find((s) => s.id === selected);

  return (
    <div className="service-selector" ref={ref} id="service-selector">
      {/* Collapsed trigger */}
      <button
        className="service-selector__trigger"
        onClick={() => setOpen(!open)}
        type="button"
        id="service-selector-trigger"
      >
        <span className="service-selector__trigger-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2AB3A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </span>
        <div className="service-selector__trigger-content">
          <span className="service-selector__trigger-text">
            {selectedService
              ? selectedService.name
              : 'Select a Service'}
          </span>
          {selectedService && (
            <span className="service-selector__trigger-meta">
              ( {selectedService.duration} | {selectedService.price} USD )
            </span>
          )}
        </div>
        <span className={`service-selector__chevron ${open ? 'service-selector__chevron--open' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Dropdown list */}
      {open && (
        <div className="service-selector__dropdown" id="service-dropdown">
          <div className="service-selector__list">
            {services.map((service) => (
              <button
                key={service.id}
                className={`service-selector__item ${selected === service.id ? 'service-selector__item--selected' : ''}`}
                onClick={() => {
                  onSelect(service.id);
                  setOpen(false);
                }}
                type="button"
                id={`service-item-${service.id}`}
              >
                <span
                  className="service-selector__badge"
                  style={{
                    backgroundColor:
                      service.number === 'L' ? '#d1d5db' : '#FDE68A',
                  }}
                >
                  {service.number}
                </span>
                <div className="service-selector__info">
                  <span className="service-selector__name">{service.name}</span>
                  <span className="service-selector__meta">
                    {service.duration} | {service.price} USD
                  </span>
                </div>
                {selected === service.id && (
                  <span className="service-selector__check">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
