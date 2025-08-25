// File: front/src/components/shared/navbars/login.navbar.tsx
// Last change: Prispôsobený názov komponentu, interface, export a CSS triedy.

import { FC } from "react";
import "./login.navbar.css";

export interface LoginNavbarProps {
  onOpen: () => void;
}

export const LoginNavbar: FC<LoginNavbarProps> = ({ onOpen }) => {
  return (
    <button onClick={onOpen} className="login-navbar">
      <span>Log In</span>
    </button>
  );
};