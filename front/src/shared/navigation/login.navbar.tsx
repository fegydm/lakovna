// File: front/src/shared/navigation/login.navbar.tsx
// Last change: Combined custom Button component with external label prop.

import { FC } from "react";
import { Button } from "../base/button.base";
import "./login.navbar.css";

export interface LoginNavbarProps {
  label: string;
  onOpen: () => void;
}

export const LoginNavbar: FC<LoginNavbarProps> = ({ label, onOpen }) => {
  return (
    <Button onClick={onOpen} variant="primary" size="small" className="login-navbar">
      {label}
    </Button>
  );
};
