// File: front/src/shared/base/pin-input.base.tsx
// Last change: Migrated to the final ui/primitives directory.

import { useState, useRef, useEffect } from "react";
import './pin-input.base.css';

interface PinInputProps {
  length: number;
  onComplete: (pin: string) => void;
  isDisabled?: boolean;
}

const PinInput: React.FC<PinInputProps> = ({ length, onComplete, isDisabled = false }) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  useEffect(() => {
    const pin = values.join('');
    if (pin.length === length) {
      onComplete(pin);
    }
  }, [values, length, onComplete]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || isDisabled) return;

    const newValues = [...values];
    newValues[index] = value.slice(-1);
    setValues(newValues);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pastedData) {
      const newValues = Array(length).fill('');
      pastedData.split('').forEach((char, i) => {
        newValues[i] = char;
      });
      setValues(newValues);
      const nextFocusIndex = Math.min(pastedData.length, length - 1);
      inputsRef.current[nextFocusIndex]?.focus();
    }
  };

  return (
    <div className="pin-input" role="group" aria-label="PIN input" onPaste={handlePaste}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => (inputsRef.current[index] = el)}
          aria-label={`PIN digit ${index + 1}`}
          className="pin-input__digit"
          disabled={isDisabled}
        />
      ))}
    </div>
  );
};

export default PinInput;
