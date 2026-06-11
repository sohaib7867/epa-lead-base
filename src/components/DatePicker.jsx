import { useState } from 'react';
import { MONTH_NAMES, DAY_NAMES } from '../data';
import './DatePicker.css';

export default function DatePicker({ selectedDate, onSelect }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(selectedDate ? selectedDate.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate ? selectedDate.getMonth() : today.getMonth());
  const [open, setOpen] = useState(false);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function isDisabled(day) {
    const d = new Date(viewYear, viewMonth, day);
    return d < today;
  }

  function isSelected(day) {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    );
  }

  function isToday(day) {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  }

  function handleSelect(day) {
    if (!isDisabled(day)) {
      onSelect(new Date(viewYear, viewMonth, day));
      setOpen(false);
    }
  }

  function formatDisplay() {
    if (!selectedDate) return 'Select Date';
    const d = selectedDate.getDate();
    const m = MONTH_NAMES[selectedDate.getMonth()].slice(0, 3);
    const y = selectedDate.getFullYear();
    return `${d} ${m} ${y}`;
  }

  const blanks = Array.from({ length: firstDay }, (_, i) => (
    <div key={`blank-${i}`} className="datepicker__cell datepicker__cell--blank" />
  ));

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const disabled = isDisabled(day);
    const sel = isSelected(day);
    const tod = isToday(day);

    let className = 'datepicker__cell';
    if (disabled) className += ' datepicker__cell--disabled';
    if (sel) className += ' datepicker__cell--selected';
    if (tod && !sel) className += ' datepicker__cell--today';

    return (
      <button
        key={day}
        className={className}
        onClick={() => handleSelect(day)}
        disabled={disabled}
        type="button"
      >
        {day}
      </button>
    );
  });

  return (
    <div className="datepicker" id="date-picker">
      <button
        className="datepicker__trigger"
        onClick={() => setOpen(!open)}
        type="button"
        id="date-picker-trigger"
      >
        <span className="datepicker__trigger-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2AB3A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        <span className="datepicker__trigger-text">{formatDisplay()}</span>
        <span className={`datepicker__chevron ${open ? 'datepicker__chevron--open' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="datepicker__dropdown" id="date-calendar">
          <div className="datepicker__header">
            <button className="datepicker__nav" onClick={prevMonth} type="button" aria-label="Previous month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="datepicker__month-year">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button className="datepicker__nav" onClick={nextMonth} type="button" aria-label="Next month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="datepicker__grid">
            {DAY_NAMES.map((d) => (
              <div key={d} className="datepicker__day-name">{d}</div>
            ))}
            {blanks}
            {days}
          </div>
        </div>
      )}
    </div>
  );
}
