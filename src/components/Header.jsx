import './Header.css';

export default function Header() {
  return (
    <header className="header" id="header">
      <div className="header__inner">
        <div className="header__logo">
          <svg className="header__icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="#2AB3A0" strokeWidth="2.5" fill="none" />
            <path d="M12 26 L20 14 L28 26" stroke="#2AB3A0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="20" cy="12" r="2" fill="#2AB3A0" />
          </svg>
          <h1 className="header__title">EPA Lead Base</h1>
        </div>
      </div>
    </header>
  );
}
