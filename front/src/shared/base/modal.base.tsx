// File: front/src/shared/base/modal.base.tsx
// Last change: Reverted to simple 'Modal' export name for consistency.

import { useEffect, FC, ReactNode } from "react";
import { Button } from "@/shared/base/button.base"; 
import "./modal.base.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string | ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  className,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="modal__backdrop" onClick={onClose} />
      
      <div className="modal__container">
        <div className={`modal__content ${className || ""}`}>
          <div className="modal__header">
            {title && <h2 className="modal__title">{title}</h2>}
            <Button
              variant="close"
              size="icon"
              onClick={onClose}
              aria-label="Close modal"
              className="modal__close"
            >
              &times;
            </Button>
          </div>
          
          {description && <p className="modal__description">{description}</p>}
          
          <div className="modal__body">{children}</div>

          {actions && (
            <div className="modal__footer">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Modal.displayName = "Modal";

export default Modal;
