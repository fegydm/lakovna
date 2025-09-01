// File: front/src/hooks/useNavbarModals.ts
// Handles active modal state and modal-related handlers

import { useState } from 'react';
import { AuthStatus } from 'common/types/auth.types';
import { AccessRole } from 'common/types/access-role.types';

type ModalType =
  | 'avatar'
  | 'dots'
  | 'about'
  | 'confirmLogout'
  | 'demoWelcome'
  | 'login'
  | 'register'
  | null;

export const useNavbarModals = (
  setCookiesAllowed: (v: boolean) => void,
  setExplicitTopRole: (v: AccessRole | null) => void,
) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleModalOpen = (m: ModalType) => setActiveModal(m);
  const handleModalClose = () => setActiveModal(null);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setCookiesAllowed(true);
    handleModalClose();
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setCookiesAllowed(false);
    handleModalClose();
  };

  const handleDotsSelectionChange = async (top: AccessRole | null, bottom: AuthStatus | null) => {
    handleModalClose();
    if (top) setExplicitTopRole(top);
    if (bottom === AuthStatus.REGISTERED) handleModalOpen('register');
    if (bottom === AuthStatus.COOKIES) handleModalOpen('demoWelcome');
    if (bottom === AuthStatus.ANONYMOUS) handleDeclineCookies();
  };

  return {
    activeModal,
    handleModalOpen,
    handleModalClose,
    handleAcceptCookies,
    handleDeclineCookies,
    handleDotsSelectionChange,
  };
};
