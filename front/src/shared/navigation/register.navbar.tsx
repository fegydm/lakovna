// File: front/src/shared/navigation/register.navbar.tsx
// Last change: Refactored to accept an external label prop.

import { FC } from "react";
import { Button } from "../base/button.base"; 
import './register.navbar.css';

export interface RegisterNavbarProps {
  label: string;
  onOpen: () => void;
}

export const RegisterNavbar: FC<RegisterNavbarProps> = ({ label, onOpen }) => {
  return (
    <Button onClick={onOpen} variant="secondary" size="small" className="register-navbar">
      {label}
    </Button>
  );
};
