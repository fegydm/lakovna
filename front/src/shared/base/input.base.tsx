// File: front/src/shared/base/input.base.tsx
// Last change: Reverted to simple 'Input' export name for consistency.

import React, { useId } from "react";
// import './input.base.css';

type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 
                'date' | 'time' | 'datetime-local' | 'checkbox' | 'radio' | 'hidden';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: "default" | "search";
  state?: "normal" | "error" | "success";
  error?: string;
  type?: InputType;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      variant = "default",
      state = "normal",
      error,
      className,
      type = "text",
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || `input-${generatedId}`;
    const errorId = error ? `${id}-error` : undefined;

    const inputClasses = [
      "input",
      variant !== "default" && `input--${variant}`,
      state !== "normal" && `input--${state}`,
      className,
    ]
    .filter(Boolean)
    .join(" ");

    return (
      <div className="input-container">
        {label && (
          <label htmlFor={id} className="input-label">
            {label}
          </label>
        )}
        <div className="input-wrapper">
          <input
            ref={ref}
            id={id}
            className={inputClasses}
            type={type}
            aria-invalid={state === "error"}
            aria-describedby={errorId}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="input-error-message" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
