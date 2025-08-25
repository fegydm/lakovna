// File: front/src/shared/navigation/name.navbar.tsx
// Last change: Prispôsobený názov komponentu, interface, export a CSS triedy.

import { FC } from "react";
import "./name.navbar.css";

export interface NameNavbarProps {
  onShowAbout: () => void;
}

export const NameNavbar: FC<NameNavbarProps> = ({ onShowAbout }) => {
  return (
    <button onClick={onShowAbout} className="name-navbar">
      <span className="name-navbar__text">Sendeliver</span>
      <span className="name-navbar__underline" />
    </button>
  );
};