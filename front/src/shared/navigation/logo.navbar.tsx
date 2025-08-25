// File: front/src/shared/navigation/logo.navbar.tsx
// Last change: Prispôsobený názov komponentu, interface, export a CSS triedy.

import { FC } from "react";
import { Link } from "react-router-dom";
import "./logo.navbar.css";

export interface LogoNavbarProps {
  onBreadcrumbToggle: () => void;
  showBreadcrumbs: boolean;
}

const ChevronIcon: FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`logo-navbar__toggle-icon ${isOpen ? 'logo-navbar__toggle-icon--open' : ''}`}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export const LogoNavbar: FC<LogoNavbarProps> = ({ onBreadcrumbToggle, showBreadcrumbs }) => {
  return (
    <div className="logo-navbar">
      <Link to="/" className="logo-navbar__link" aria-label="Home page">
        <img src="/pics/logo.png" alt="Sendeliver Logo" className="logo-navbar__image" />
      </Link>
      <button 
        className="logo-navbar__toggle"
        onClick={onBreadcrumbToggle}
        aria-label="Toggle breadcrumbs"
        aria-expanded={showBreadcrumbs}
      >
        <ChevronIcon isOpen={showBreadcrumbs} />
      </button>
    </div>
  );
};