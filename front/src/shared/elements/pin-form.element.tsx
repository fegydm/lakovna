// File: front/src/shared/elements/pin-form.element.tsx
// Last change: Switched from alias to relative import paths.

import React, { useEffect, useMemo, useState } from "react";
import PinInput from "../base/pin-input.base";
import { useTranslation } from "../../contexts/translation.context";
import "./pin-form.element.css";

interface PinFormProps {
  onSubmit: (pin: string) => void;
  title?: string;
  error?: string | null;
  isDisabled?: boolean;
  resetTrigger?: number;
  className?: string;
  ns?: string;
}

const PinForm: React.FC<PinFormProps> = ({
  onSubmit,
  title,
  error,
  isDisabled = false,
  resetTrigger = 0,
  className,
  ns = "elements",
}) => {
  const { t, hasNamespace, ensureNamespace } = useTranslation();
  
  const [internalResetKey, setInternalResetKey] = useState(0);

  useEffect(() => {
    void ensureNamespace(ns);
  }, [ns, ensureNamespace]);
  
  useEffect(() => {
    if (resetTrigger > 0) {
      setInternalResetKey(k => k + 1);
    }
  }, [resetTrigger]);

  const blockClass = useMemo(() => {
    const base = "pin-form";
    const mods = [
      isDisabled ? `${base}--disabled` : "",
      error ? `${base}--error` : "",
      !hasNamespace(ns) ? `${base}--loading` : "",
    ].filter(Boolean);
    return [base, ...mods, className].filter(Boolean).join(" ");
  }, [className, isDisabled, error, ns, hasNamespace]);

  const resolvedTitle = useMemo(() => title ?? t(ns, "pinForm.title"), [title, ns, t]);

  return (
    <div className={blockClass} data-testid="pin-form">
      <h3 className="pin-form__title" data-testid="pin-form-title">
        {resolvedTitle}
      </h3>

      <div className="pin-form__input pin-form__pin-input" data-testid="pin-form-input">
        <PinInput
          key={internalResetKey}
          length={4}
          onComplete={onSubmit}
          isDisabled={isDisabled}
        />
      </div>

      {error && (
        <p className="pin-form__error" data-testid="pin-form-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default PinForm;
