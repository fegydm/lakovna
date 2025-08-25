// File: front/src/shared/base/button.base.tsx
// Last change: Updated 'role' prop to use UserRole from theme types

import React from "react";
import type { UserRole } from "@/libs/types/systems/theme.types";
import './button.base.css';

type ButtonProps<T extends React.ElementType> = {
  as?: T;
  variant?: "primary" | "secondary" | "danger" | "cancel" | "close" | "ghost" | "floating" | "link" | "success" | "warning";
  size?: "default" | "small" | "large" | "icon";
  fullWidth?: boolean;
  role?: UserRole;
  position?: "left" | "right" | "center";
  active?: boolean;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as">;

export const Button = <T extends React.ElementType = "button">({
  as,
  variant = "primary",
  size = "default",
  fullWidth = false,
  role,
  position,
  active = true,
  className,
  children,
  ...props
}: ButtonProps<T>) => {
  const Component = as || "button";

  const buttonClasses = [
    "button",
    variant && `button--${variant}`,
    size !== "default" && `button--${size}`,
    fullWidth && "button--full-width",
    role && `button--${role}`,
    position && `button--${position}`,
    !active && "button--inactive",
    className,
  ]
  .filter(Boolean)
  .join(" ");

  return (
    <Component className={buttonClasses} {...props}>
      {children}
    </Component>
  );
};

Button.displayName = "Button";
