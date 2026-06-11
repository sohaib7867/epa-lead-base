import { useState, useRef, useEffect, useMemo } from 'react';
import { timezones } from '../data';
import './TimezoneSelect.css';

export default function TimezoneSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  const selected = timezones.find((t) => t.value === value);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return timezones;
    return timezones.filter(
      (t) =>
        t.value.toLowerCase().includes(q) ||
        t.label.toLowerCase().includes(q)
    );
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  function handleSelect(tz) {
    onChange(tz.value);
    setOpen(false);
    setQuery('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  }

  return (
    <div
      className={`tz-select ${open ? 'tz-select--open' : ''}`}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger button */}
      <button
        type="button"
        className="tz-select__trigger"
        onClick={() => setOpen((prev) => !prev)}
        id="timezone-select"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="tz-select__trigger-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2AB3A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </span>
        <span className="tz-select__trigger-label">
          {selected ? selected.label : 'Select Timezone'}
        </span>
        <span className={`tz-select__chevron ${open ? 'tz-select__chevron--up' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="tz-select__dropdown" role="listbox">
          {/* Search */}
          <div className="tz-select__search-wrapper">
            <span className="tz-select__search-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2AB3A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              ref={searchRef}
              type="text"
              className="tz-select__search"
              placeholder="Search timezone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              id="timezone-search-input"
            />
            {query && (
              <button
                type="button"
                className="tz-select__search-clear"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Count badge */}
          <div className="tz-select__count">
            {filtered.length} timezone{filtered.length !== 1 ? 's' : ''}
          </div>

          {/* List */}
          <ul className="tz-select__list" ref={listRef} role="listbox">
            {filtered.length === 0 ? (
              <li className="tz-select__empty">No timezones found</li>
            ) : (
              filtered.map((tz) => (
                <li
                  key={tz.value}
                  role="option"
                  aria-selected={tz.value === value}
                  className={`tz-select__option ${tz.value === value ? 'tz-select__option--selected' : ''}`}
                  onClick={() => handleSelect(tz)}
                >
                  <span className="tz-select__option-label">{tz.label}</span>
                  {tz.value === value && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2AB3A0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
