// File: front/src/shared/base/alert.base.tsx
// Last change: Improved accessibility (role/status), close button safety, default icon map, and className support. Presentation-only (no i18n).

import { FC, ReactNode, useMemo } from "react";
import "./alert.base.css";

export type AlertType = "info" | "success" | "warning" | "error";

export interface AlertBaseProps {
  type?: AlertType;
  icon?: ReactNode;
  title: ReactNode; // Accept ReactNode to keep this component purely presentational
  description?: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  className?: string;
  /** Override ARIA role if needed; defaults to 'alert' for error/warning and 'status' for info/success. */
  role?: "alert" | "status";
  /** Accessible label for the close button. */
  closeAriaLabel?: string;
}

const DEFAULT_ICONS: Record<AlertType, ReactNode> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "❌",
};

export const Alert: FC<AlertBaseProps> = ({
  type = "info",
  icon,
  title,
  description,
  children,
  onClose,
  className,
  role,
  closeAriaLabel = "Close alert",
}) => {
  // Determine ARIA role and live region politeness
  const effectiveRole = useMemo<"alert" | "status">(() => {
    if (role) return role;
    return type === "error" || type === "warning" ? "alert" : "status";
  }, [role, type]);

  // Compose BEM + external classes
  const rootClass = useMemo(() => {
    const base = "alert-base";
    const mod = `${base}--${type}`;
    return [base, mod, className].filter(Boolean).join(" ");
  }, [type, className]);

  return (
    <div
      className={rootClass}
      role={effectiveRole}
      // For 'status' role, ensure polite updates; for 'alert' it's assertive by default.
      {...(effectiveRole === "status" ? { "aria-live": "polite" } : {})}
      data-testid="alert-base"
    >
      <div className="alert-base__icon">{icon ?? DEFAULT_ICONS[type]}</div>

      <div className="alert-base__content">
        {/* Title is a <p> to keep layout consistent; upstream can pass <strong> etc. */}
        <p className="alert-base__title">{title}</p>
        {description ? (
          <p className="alert-base__description">{description}</p>
        ) : null}
      </div>

      {/* Action slot (e.g., buttons, inputs) */}
      {children ? <div className="alert-base__actions">{children}</div> : null}

      {onClose ? (
        <button
          type="button" // prevent form submissions
          onClick={onClose}
          className="alert-base__close"
          aria-label={closeAriaLabel}
        >
          ✕
        </button>
      ) : null}
    </div>
  );
};
