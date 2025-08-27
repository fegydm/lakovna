// File: sendeliver/front/src/libs/contexts/auth.context.tsx
// Last change: Replaced inline  with external AccessRole and updated imports to be relative.

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback, useRef } from 'react';
import type { AppRole } from '../types/systems/app_role.types';
import type { AccessRole } from '../types/systems/access_role.types';
import { useTabManager } from '../hooks/use-tab-manager.hook';
import LogoutModal from '../../shared/modals/logout.modal';
import EmailVerificationBanner from '../../shared/elements/email-verification-banner.element';

export interface User {
  id: number;
  name: string;
  email: string;
  role: AccessRole;
  imageUrl?: string;
  selectedRole?: AppRole;
  emailVerified?: boolean;
  isAdmin?: boolean;
}

export interface PendingVerificationInfo {
  email: string;
  expiresAt: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  pendingEmailVerification: PendingVerificationInfo | null;
  setPendingEmailVerification: (info: PendingVerificationInfo | null) => void;
  setUser: (user: User | null) => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  update: (role: AppRole) => Promise<void>;
  updateUserAvatar: (imageUrl: string) => Promise<void>;
  activeTabCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:10001';

const handleFetchResponse = async (response: Response): Promise<any> => {
  if (response.status === 401) {
    return null;
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `Request failed with status: ${response.status}`);
  }
  
  return response.json();
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingEmailVerification, setPendingEmailVerification] = useState<PendingVerificationInfo | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const effectRan = useRef(false);

  const { activeTabCount, logoutAllTabs } = useTabManager();

  const fetchUserProfile = useCallback(async () => {
    const controller = new AbortController();
    const { signal } = controller;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: signal,
      });

      const data = await handleFetchResponse(response);

      if (data) {
        setUser(data);
        if (data.emailVerified) {
          setPendingEmailVerification(null);
          localStorage.removeItem('pendingEmailVerification');
        }
      } else if (response.status === 401) {
        setUser(null);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      
      setError(err.message || 'Failed to fetch user profile.');
      setUser(null);
    } finally {
      if (signal.aborted) {
        return;
      }
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include',
      });
      
      const data = await handleFetchResponse(response);

      if (data && !data.user.emailVerified) {
        const verification = {
          email: data.user.email,
          expiresAt: Date.now() + (15 * 60 * 1000)
        };
        setPendingEmailVerification(verification);
        localStorage.setItem('pendingEmailVerification', JSON.stringify(verification));
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      const data = await handleFetchResponse(response);

      if (data && data.user) {
        if (!data.user.emailVerified) {
          setError("Váš e-mail nie je overený. Prosím, skontrolujte si schránku a overte si účet.");
          setUser(null);
          const verification = {
            email: data.user.email,
            expiresAt: Date.now() + (15 * 60 * 1000)
          };
          setPendingEmailVerification(verification);
          localStorage.setItem('pendingEmailVerification', JSON.stringify(verification));
          throw new Error("Email not verified.");
        }
        setUser(data.user);
        setPendingEmailVerification(null);
        localStorage.removeItem('pendingEmailVerification');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const performLogout = useCallback(async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout request failed, continuing with client-side logout:', err);
    } finally {
      setUser(null);
      setPendingEmailVerification(null);
      localStorage.removeItem('pendingEmailVerification');
      setShowLogoutModal(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    if (activeTabCount > 1) {
      setShowLogoutModal(true);
      return;
    }
    await performLogout();
  }, [activeTabCount, performLogout]);

  const logoutCurrentTab = useCallback(async (): Promise<void> => {
    await performLogout();
  }, [performLogout]);

  const logoutAllTabsHandler = useCallback(async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    }
    logoutAllTabs();
    setUser(null);
    setPendingEmailVerification(null);
    localStorage.removeItem('pendingEmailVerification');
    setShowLogoutModal(false);
  }, [logoutAllTabs]);

  const update = useCallback(async (role: AppRole) => {
    if (!user) return;
    const previousUser = user;
    setUser(currentUser => currentUser ? { ...currentUser, selectedRole: role } : null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedRole: role }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role.');
      }
    } catch (err: any) {
      console.error("Failed to update user role:", err);
      setUser(previousUser);
      throw err;
    }
  }, [user]);

  const updateUserAvatar = useCallback(async (imageUrl: string) => {
    if (!user) return;
    const previousUser = user;
    setUser(currentUser => currentUser ? { ...currentUser, imageUrl: imageUrl } : null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me/avatar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: imageUrl }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user avatar.');
      }
    } catch (err: any) {
      console.error("Failed to update user avatar:", err);
      setUser(previousUser);
      throw err;
    }
  }, [user]);

  useEffect(() => {
    if (!import.meta.env.DEV || effectRan.current) {
      fetchUserProfile();
      const storedPending = localStorage.getItem('pendingEmailVerification');
      if (storedPending) {
        try {
          const parsedPending = JSON.parse(storedPending);
          if (parsedPending.expiresAt > Date.now()) {
            setPendingEmailVerification(parsedPending);
          } else {
            localStorage.removeItem('pendingEmailVerification');
          }
        } catch (e) {
          localStorage.removeItem('pendingEmailVerification');
        }
      }
    }

    return () => {
      effectRan.current = true;
    };
  }, [fetchUserProfile]);

  useEffect(() => {
    if (pendingEmailVerification) {
      localStorage.setItem('pendingEmailVerification', JSON.stringify(pendingEmailVerification));
    } else {
      localStorage.removeItem('pendingEmailVerification');
    }
  }, [pendingEmailVerification]);

  const isAuthenticated = !loading && !!user;
  const isAdmin = !loading && (user?.role === 'superadmin' || user?.role === 'org_admin');

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    pendingEmailVerification,
    setPendingEmailVerification,
    setUser,
    register,
    login,
    logout,
    checkAuthStatus: fetchUserProfile,
    update,
    updateUserAvatar,
    activeTabCount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <EmailVerificationBanner />
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        activeTabCount={activeTabCount}
        onLogoutCurrent={logoutCurrentTab}
        onLogoutAll={logoutAllTabsHandler}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};