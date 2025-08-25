// File: front/src/shared/navigation/darkmode.navbar.tsx
// Last change: Prispôsobený názov komponentu, interface, export a CSS triedy.

import { FC } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import "./darkmode.navbar.css";

export interface DarkmodeNavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const DarkmodeNavbar: FC<DarkmodeNavbarProps> = ({
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <button
      onClick={onToggleDarkMode}
      className="darkmode-navbar"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <FiMoon className="darkmode-navbar__icon" />
      ) : (
        <FiSun className="darkmode-navbar__icon" />
      )}
    </button>
  );
};