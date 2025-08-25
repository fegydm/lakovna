// File: front/src/shared/navigation/register.navbar.tsx
// Last change: Prispôsobený názov komponentu, interface, export a CSS triedy.

import { FC } from "react";
import { Button } from "@/shared/base/button.base"; 
import './register.navbar.css';

export interface RegisterNavbarProps {
  onOpen: () => void;
}

export const RegisterNavbar: FC<RegisterNavbarProps> = ({ onOpen }) => {
  return (
    <Button onClick={onOpen} variant="secondary" size="small" className="register-navbar">
      Create account
    </Button>
  );
};