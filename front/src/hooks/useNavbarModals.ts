// File: front/src/hooks/useNavbarModals.ts
// Handles all modal open/close logic and related actions for Navbar

import { useState } from 'react';
import type { AuthStatus } from 'common/types/auth backup.types';

export type ModalType =
  | 'avatar'
  | 'dots'
  | 'about'
  | 'confirmLogout'
  | 'demoWelcome'
  | 'login'
  | 'register'
  | null;

interface UseNavbarModalsParams {
  isAuthenticated: boolean;
  cookiesAllowed: boolean;
  onLogout?: () => Promise<void>;
  onAvatarSave?: (avatarId: string) => Promise<void>;
  onDotsSelectionChange?: (top: string | null, bottom: AuthStatus | null) => Promise<void>;
  onNavigateToPolicy?: () => void;
  onNavigateToThemeSettings?: () => void;
}

export const useNavbarModals = ({
  isAuthenticated,
  cookiesAllowed,
  onLogout,
  onAvatarSave,
  onDotsSelectionChange,
  onNavigateToPolicy,
  onNavigateToThemeSettings,
}: UseNavbarModalsParams) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleModalOpen = (modal: ModalType) => setActiveModal(modal);
  const handleModalClose = () => setActiveModal(null);

  const handlers = {
    handleModalOpen,
    handleModalClose,
    handleLogout: async () => {
      handleModalClose();
      if (onLogout) await onLogout();
    },
    handleAvatarSave: async (avatarId: string) => {
      if (onAvatarSave) {
        await onAvatarSave(avatarId);
      }
      handleModalClose();
    },
    handleDotsSelectionChange: async (top: string | null, bottom: AuthStatus | null) => {
      if (onDotsSelectionChange) {
        await onDotsSelectionChange(top, bottom);
      }
      handleModalClose();
    },
    handleNavigateToPolicy: () => {
      handleModalClose();
      if (onNavigateToPolicy) onNavigateToPolicy();
    },
    handleNavigateToThemeSettings: () => {
      handleModalClose();
      if (onNavigateToThemeSettings) onNavigateToThemeSettings();
    },
  };

  const modalProps = {
    about: {
      isOpen: activeModal === 'about',
      onClose: handleModalClose,
      onNavigateToRegister: () => handleModalOpen('register'),
    },
    avatar: {
      isOpen: activeModal === 'avatar',
      onClose: handleModalClose,
      onLogout: () => handleModalOpen('confirmLogout'),
      onSave: handlers.handleAvatarSave,
      isGuestMode: !isAuthenticated,
      cookiesAllowed,
    },
    dots: {
      isOpen: activeModal === 'dots',
      onClose: handleModalClose,
      onSelectionChange: handlers.handleDotsSelectionChange,
      onCustomizeClick: handlers.handleNavigateToThemeSettings,
    },
    confirmLogout: {
      isOpen: activeModal === 'confirmLogout',
      onClose: handleModalClose,
      onConfirm: handlers.handleLogout,
    },
    demoWelcome: {
      isOpen: activeModal === 'demoWelcome',
      onAccept: () => handleModalClose(),
      onDecline: () => handleModalClose(),
      onAcceptAndRegister: () => handleModalOpen('register'),
      onNavigateToPolicy: handlers.handleNavigateToPolicy,
    },
    login: {
      isOpen: activeModal === 'login',
      onClose: handleModalClose,
      onNavigateToRegister: () => handleModalOpen('register'),
    },
    register: {
      isOpen: activeModal === 'register',
      onClose: handleModalClose,
    },
  };

  return {
    activeModal,
    setActiveModal,
    handlers,
    modalProps,
  };
};
