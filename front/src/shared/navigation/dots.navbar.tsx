// File: front/src/shared/navigation/dots.navbar.tsx
// Last change: CSS triedy upravené pre konzistenciu s názvom komponentu.

import { FC } from 'react';
import './dots.navbar.css';

type DotsArray = string[];

export interface DotsNavbarProps {
  topDots: DotsArray;
  bottomDots: DotsArray;
  onClick: () => void;
}

export const DotsNavbar: FC<DotsNavbarProps> = ({ topDots, bottomDots, onClick }) => {
  return (
    <button onClick={onClick} className="dots-navbar" aria-label="Open user status menu">
      <div className="dots-navbar__grid">
        <div className="dots-navbar__row">
          {topDots.map((color, index) => (
            <div key={`top-${index}`} className="dots-navbar__dot" style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className="dots-navbar__row">
          {bottomDots.map((color, index) => (
            <div key={`bottom-${index}`} className="dots-navbar__dot" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
    </button>
  );
};