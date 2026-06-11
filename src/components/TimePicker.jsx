import { useState, useRef, useEffect } from 'react';
import { timeSlotGroups } from '../data';
import './TimePicker.css';

export default function TimePicker({ selected, onSelect }) {
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

  return (
    <div className="timepicker" ref={ref} id="time-picker">
      {/* Trigger */}
      <button
        className="timepicker__trigger"
        onClick={() => setOpen(!open)}
        type="button"
        id="time-picker-trigger"
      >
        <span className="timepicker__trigger-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2AB3A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
        <span className="timepicker__trigger-text">
          {selected || 'Select Time'}
        </span>
        <span className={`timepicker__chevron ${open ? 'timepicker__chevron--open' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Dropdown grid */}
      {open && (
        <div className="timepicker__dropdown" id="time-dropdown">
          <div className="timepicker__scroll">
            {timeSlotGroups.map((group) => (
              <div key={group.label} className="timepicker__group">
                <div className="timepicker__group-header">
                  <span className="timepicker__group-line" />
                  <span className="timepicker__group-label">{group.label}</span>
                  <span className="timepicker__group-line" />
                </div>
                <div className="timepicker__grid">
                  {group.slots.map((slot) => (
                    <button
                      key={slot}
                      className={`timepicker__slot ${selected === slot ? 'timepicker__slot--selected' : ''}`}
                      onClick={() => {
                        onSelect(slot);
                        setOpen(false);
                      }}
                      type="button"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
