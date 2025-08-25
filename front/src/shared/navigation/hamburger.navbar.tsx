// File: front/src/shared/navigation/hamburger.navbar.tsx
// Last change: Prispôsobený názov komponentu, interface, export a CSS triedy.

import { type FC, useState, useCallback } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
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
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {isOpen && (
        <div className="hamburger-navbar__menu" role="menu">
          <div className="hamburger-navbar__content">
            <HamburgerNavbarItem onClick={() => handleItemClick(onShowAbout)}>
              About
            </HamburgerNavbarItem>
            <HamburgerNavbarItem onClick={() => handleItemClick(onLoginClick)}>
              Log In
            </HamburgerNavbarItem>
            <HamburgerNavbarItem onClick={() => handleItemClick(onRegisterClick)}>
              Create Account
            </HamburgerNavbarItem>
          </div>
        </div>
      )}
    </div>
  );
};