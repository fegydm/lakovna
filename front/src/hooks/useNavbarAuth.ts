// File: front/src/hooks/useNavbarAuth.ts
// Handles authentication state, cookies, guest avatar/role, logout and avatar save

import { useState, useEffect } from 'react';
import { useAuthOptional } from '../contexts/auth.optional';
import { ZODIAC_SIGNS } from 'common/constants/zodiac.constants';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage.utils';
import { AccessRole } from 'common/types/access-role.types';

export const useNavbarAuth = () => {
  const auth = useAuthOptional();
  const isAuthenticated = !!auth?.isAuthenticated;
  const user = auth?.user;

  const [cookiesAllowed, setCookiesAllowed] = useState(false);
  const [guestAvatar, setGuestAvatar] = useState<string>(ZODIAC_SIGNS[0]);
  const [explicitTopRole, setExplicitTopRole] = useState<AccessRole | null>(null);

  // Check cookie consent on mount
  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') {
      setCookiesAllowed(true);
    }
  }, []);

  // Load guest avatar & role if cookies are allowed and user not authenticated
  useEffect(() => {
    if (!isAuthenticated && cookiesAllowed) {
      const savedGuestAvatar = getLocalStorage('guestAvatar');
      if (savedGuestAvatar && ZODIAC_SIGNS.includes(savedGuestAvatar)) {
        setGuestAvatar(savedGuestAvatar);
      }
      const savedGuestRole = getLocalStorage('guestRole') as AccessRole;
      if (savedGuestRole) {
        setExplicitTopRole(savedGuestRole);
      }
    }
  }, [isAuthenticated, cookiesAllowed]);

  // Logout handler
  const handleLogout = async () => {
    await auth?.logout?.();
  };

  // Avatar save handler
  const handleAvatarSave = async (avatarId: string) => {
    if (!isAuthenticated) {
      if (cookiesAllowed) {
        setLocalStorage('guestAvatar', avatarId);
        setGuestAvatar(avatarId);
      }
    } else if (user && auth?.updateUserAvatar) {
      try {
        const avatarUrl = `/avatars/zodiac/${avatarId}.png`;
        await auth.updateUserAvatar(avatarUrl);
      } catch (e) {
        console.error('Failed to save user avatar:', e);
      }
    }
  };

  return {
    isAuthenticated,
    user,
    cookiesAllowed,
    setCookiesAllowed,
    guestAvatar,
    setGuestAvatar,
    explicitTopRole,
    setExplicitTopRole,
    handleLogout,
    handleAvatarSave,
  };
};
