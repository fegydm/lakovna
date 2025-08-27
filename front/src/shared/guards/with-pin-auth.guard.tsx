// File: front/src/shared/guards/with-pin-auth.guard.tsx
// Last change: Refactored to accept an external auth service and use centralized types and styles.

import React, { useState, useEffect, useCallback } from 'react';
import PinForm from '../elements/pin-form.element';
import { ProtectedResourceType } from '../../libs/configs/pin-auth.config';
import './with-pin-auth.guard.css';

interface PinAuthOptions {
  type: ProtectedResourceType;
  storageKey: string;
  authService: {
    verifyPin: (pin: string, type: ProtectedResourceType) => Promise<{ success: boolean; token?: string }>;
  };
}

export function withPinAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: PinAuthOptions
) {
  const { type, storageKey, authService } = options;

  const WithPinAuth: React.FC<P> = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetTrigger, setResetTrigger] = useState(0);

    useEffect(() => {
      try {
        if (localStorage.getItem(storageKey)) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Could not read from localStorage", e);
      }
    }, []);

    const handleSubmit = useCallback(async (pin: string) => {
      setIsLoading(true);
      setError(null);

      const result = await authService.verifyPin(pin, type);

      if (result.success && result.token) {
        try {
          localStorage.setItem(storageKey, result.token);
          setIsAuthenticated(true);
        } catch (e) {
          console.error("Could not write to localStorage", e);
          setError("Chyba pri ukladaní overenia.");
        }
      } else {
        setError("Nesprávny PIN. Skúste znova.");
        setResetTrigger(key => key + 1);
      }
      setIsLoading(false);
    }, [type, storageKey, authService]);

    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    return (
      <div className="pin-auth-container">
        <div className="pin-auth-wrapper">
           <PinForm
             onSubmit={handleSubmit}
             title="Zadajte prístupový PIN"
             error={error}
             isDisabled={isLoading}
             resetTrigger={resetTrigger}
           />
        </div>
      </div>
    );
  };

  WithPinAuth.displayName = `WithPinAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithPinAuth;
}
