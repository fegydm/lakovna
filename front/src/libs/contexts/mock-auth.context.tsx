// File: front/src/libs/contexts/mock-auth.context.tsx
// Last change: Replaced duplicate types with direct imports from the real auth context.

import React, { createContext, useContext, ReactNode } from 'react';
import type { AuthContextType } from './auth.context';

const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

export const MockAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const mockValue: AuthContextType = {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: false,
    error: null,
    pendingEmailVerification: null,
    setPendingEmailVerification: () => {},
    setUser: () => {},
    register: async () => {},
    login: async () => {},
    logout: async () => {},
    checkAuthStatus: async () => {},
    updateSelectedRole: async () => {},
    updateUserAvatar: async () => {},
    activeTabCount: 1,
    showLogoutModal: false,
    setShowLogoutModal: () => {},
    logoutCurrentTab: async () => {},
    logoutAllTabsHandler: async () => {},
  };

  return (
    <MockAuthContext.Provider value={mockValue}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a MockAuthProvider');
  }
  return context;
};

export { MockAuthProvider as AuthProvider };
