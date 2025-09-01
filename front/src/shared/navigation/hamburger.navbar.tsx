// File: front/src/shared/navigation/hamburger.navbar.tsx
// Last change: Replaced hardcoded text with translation keys.

import { type FC, useState, useCallback } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "../../contexts/translation.context";
import "./hamburger.navbar.css";

export interface HamburgerNavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onShowAbout: () => void;
}

interface HamburgerNavbarItemProps {
  onClick: () => void;
  children: React.ReactNode;
}

const HamburgerNavbarItem: FC<HamburgerNavbarItemProps> = ({ onClick, children }) => (
  <button onClick={onClick} className="hamburger-navbar__item">
    {children}
  </button>
);

export const HamburgerNavbar: FC<HamburgerNavbarProps> = ({
  onLoginClick,
  onRegisterClick,
  onShowAbout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleItemClick = useCallback((handler: () => void) => {
    handler();
    setIsOpen(false);
  }, []);

  return (
    <div className="hamburger-navbar">
      <button
        onClick={toggleMenu}
        className="hamburger-navbar__toggle"
        aria-label={t("common", "navbar.toggleMenu")}
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {isOpen && (
        <div className="hamburger-navbar__menu" role="menu">
          <div className="hamburger-navbar__content">
            <HamburgerNavbarItem onClick={() => handleItemClick(onShowAbout)}>
              {t("common", "navbar.about")}
            </HamburgerNavbarItem>
            <HamburgerNavbarItem onClick={() => handleItemClick(onLoginClick)}>
              {t("common", "navbar.login")}
            </HamburgerNavbarItem>
            <HamburgerNavbarItem onClick={() => handleItemClick(onRegisterClick)}>
              {t("common", "navbar.register")}
            </HamburgerNavbarItem>
          </div>
        </div>
      )}
    </div>
  );
};
