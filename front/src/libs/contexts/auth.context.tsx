// File: lakovna/front/src/libs/contexts/auth.context.tsx
// Last change: Completed all function implementations to create the final, centralized provider.

import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback, useRef } from 'react';
import type { AppRole } from '../types/systems/app_role.types';
import type { AccessRole } from '../types/systems/access_role.types';
import { useTabManager } from '../hooks/use-tab-manager.hook';
import { useTranslation } from './translation.context';

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

export interface VerificationResponse {
  success: boolean;
  message: string;
  user?: User;
  alreadyVerified?: boolean;
}

export interface ResendResponse {
  ok: boolean;
  expiresIn?: number;
  error?: string;
}

export interface VerifyCodeResponse {
  ok: boolean;
  user?: User;
  error?: string;
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
  registerOrganization: (details: { organizationName: string; vatNumber?: string; adminEmail: string; adminPassword: string; adminName: string; }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  updateSelectedRole: (role: AppRole) => Promise<void>;
  updateUserAvatar: (imageUrl: string) => Promise<void>;
  verifyEmailByToken: (token: string) => Promise<VerificationResponse>;
  verifyEmailByCode: (email: string, code: string) => Promise<VerifyCodeResponse>;
  resendVerificationEmail: (email: string) => Promise<ResendResponse>;
  completeAccountLink: (token: string, password: string) => Promise<void>;
  activeTabCount: number;
  showLogoutModal: boolean;
  setShowLogoutModal: (show: boolean) => void;
  logoutCurrentTab: () => Promise<void>;
  logoutAllTabsHandler: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:10001';

const handleFetchResponse = async (response: Response): Promise<any> => {
  if (response.status === 401) return null;
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'error.unknown' }));
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
  const { t } = useTranslation();
  const { activeTabCount, logoutAllTabs } = useTabManager();

  const fetchUserProfile = useCallback(async () => {
    const controller = new AbortController();
    const { signal } = controller;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include', signal: signal,
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
      if (err.name === 'AbortError') return;
      setError(err.message || 'error.fetch_profile_failed');
      setUser(null);
    } finally {
      if (signal.aborted) return;
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }), credentials: 'include',
      });
      const data = await handleFetchResponse(response);
      if (data && !data.user.emailVerified) {
        const verification = { email: data.user.email, expiresAt: Date.now() + (15 * 60 * 1000) };
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

  const registerOrganization = useCallback(async (details: { organizationName: string; vatNumber?: string; adminEmail: string; adminPassword: string; adminName: string; }): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register-organization`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(details),
      });
      await handleFetchResponse(response);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }), credentials: 'include',
      });
      const data = await handleFetchResponse(response);
      if (data && data.user) {
        if (!data.user.emailVerified) {
          const errorMessage = t('common', 'error.email_not_verified');
          setError(errorMessage);
          setUser(null);
          const verification = { email: data.user.email, expiresAt: Date.now() + (15 * 60 * 1000) };
          setPendingEmailVerification(verification);
          localStorage.setItem('pendingEmailVerification', JSON.stringify(verification));
          throw new Error(errorMessage);
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
  }, [t]);

  const performLogout = useCallback(async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
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

  const logoutCurrentTab = useCallback(async (): Promise<void> => { await performLogout(); }, [performLogout]);
  
  const logoutAllTabsHandler = useCallback(async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
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

  const updateSelectedRole = useCallback(async (role: AppRole) => {
    if (!user) return;
    const previousUser = { ...user };
    setUser(currentUser => currentUser ? { ...currentUser, selectedRole: role } : null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me/role`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ selectedRole: role }), credentials: 'include',
      });
      await handleFetchResponse(response);
    } catch (err: any) {
      console.error("Failed to update user role:", err);
      setUser(previousUser);
      throw err;
    }
  }, [user]);

  const updateUserAvatar = useCallback(async (imageUrl: string) => {
    if (!user) return;
    const previousUser = { ...user };
    setUser(currentUser => currentUser ? { ...currentUser, imageUrl: imageUrl } : null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me/avatar`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: imageUrl }), credentials: 'include',
      });
      await handleFetchResponse(response);
    } catch (err: any) {
      console.error("Failed to update user avatar:", err);
      setUser(previousUser);
      throw err;
    }
  }, [user]);

  const verifyEmailByToken = useCallback(async (token: string): Promise<VerificationResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-email-by-link?token=${token}`, {
      method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
    });
    const data: VerificationResponse = await response.json().catch(() => ({ success: false, message: t("common", "error.invalidServerResponse") }));
    if (response.ok && data.success && !data.alreadyVerified && data.user) {
      setUser(data.user);
      setPendingEmailVerification(null);
      localStorage.removeItem('pendingEmailVerification');
    }
    return data;
  }, [t]);
  
  const resendVerificationEmail = useCallback(async (email: string): Promise<ResendResponse> => {
    const res = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json: ResendResponse = await res.json().catch(() => ({ ok: false, error: "Bad JSON" }));
    if (res.ok && json.ok) {
        const expiresInSec = typeof json.expiresIn === "number" ? json.expiresIn : 15 * 60;
        const next: PendingVerificationInfo = { email, expiresAt: Date.now() + expiresInSec * 1000 };
        setPendingEmailVerification(next);
        localStorage.setItem('pendingEmailVerification', JSON.stringify(next));
    }
    return json;
  }, []);

  const verifyEmailByCode = useCallback(async (email: string, code: string): Promise<VerifyCodeResponse> => {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-email-code`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const json: VerifyCodeResponse = await res.json().catch(() => ({ ok: false, error: "Bad JSON" }));
    if (res.ok && json.ok && json.user) {
        setUser(json.user);
        setPendingEmailVerification(null);
        localStorage.removeItem('pendingEmailVerification');
        
        try {
            const bc = new BroadcastChannel("email_verification_channel");
            bc.postMessage({ type: "EMAIL_VERIFIED_SUCCESS", user: json.user });
            bc.close();
        } catch {}
    }
    return json;
  }, []);

  const completeAccountLink = useCallback(async (token: string, password: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/complete-account-link`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password })
    });
    await handleFetchResponse(response);
    await fetchUserProfile();
  }, [fetchUserProfile]);

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
    return () => { effectRan.current = true; };
  }, [fetchUserProfile]);

  const isAuthenticated = !loading && !!user;
  const isAdmin = !loading && (user?.role === 'superadmin' || user?.role === 'org_admin');

  const value: AuthContextType = {
    user, isAuthenticated, isAdmin, loading, error, pendingEmailVerification, setPendingEmailVerification,
    setUser, register, registerOrganization, login, logout, checkAuthStatus: fetchUserProfile, updateSelectedRole,
    updateUserAvatar, verifyEmailByToken, resendVerificationEmail, verifyEmailByCode, completeAccountLink,
    activeTabCount, showLogoutModal, setShowLogoutModal, logoutCurrentTab, logoutAllTabsHandler,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
