// File: front/src/shared/base/label.base.tsx
// Last change: Migrated to the final base directory and naming convention.

import React from "react";
import './label.base.css';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  variant?: "default" | "required" | "optional" | "helper" | "description" | "neutral";
  role?: "sender" | "hauler";
  className?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      variant = "default",
      role,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const labelClasses = [
      "label",
      variant !== "default" && `label--${variant}`,
      role && `label--${role}`,
      className,
    ]
    .filter(Boolean)
    .join(" ");

    return (
      <label ref={ref} className={labelClasses} {...props}>
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";
