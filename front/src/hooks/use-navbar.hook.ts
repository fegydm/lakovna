// File: front/src/hooks/use-navbar.hook.ts
// Last change: Replaced AppRole with AccessRole, updated imports and mappings.

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/theme.context';
import { useAuthOptional } from '../contexts/auth.optional';
import { useTranslation } from '../contexts/translation.context';
import { AccessRole } from 'common/types/access-role.types';
import { ACCESS_ROLE_ORDER } from 'common/configs/access-role.configgg';
import { AuthStatus } from 'common/types/auth backup.types';
import { AUTH_STATUS_LABELS } from 'common/configs/_backaup/auth.config';
import { DOT_CATEGORY_MAP } from 'common/configs/dot-category.config';
import { ZODIAC_SIGNS } from 'common/constants/zodiac.constants';
import { getLocalStorage, setLocalStorage } from 'front/src/utils/theme-storage.utils';
import { APP_PATHS } from 'common/configs/_backaup/paths.config';

type ModalType =
  | 'avatar'
  | 'dots'
  | 'about'
  | 'confirmLogout'
  | 'demoWelcome'
  | 'login'
  | 'register'
  | null;

type DotsArray = string[];

const initialDotsState: DotsArray = [
  'hsl(var(--muted))',
  'hsl(var(--muted))',
  'hsl(var(--muted))',
];

export const useNavbar = () => {
  const { isDarkMode, toggleDarkMode, activeRole } = useTheme();
  const auth = useAuthOptional();
  const { t } = useTranslation();
  const isAuthenticated = !!auth?.isAuthenticated;
  const user = auth?.user;
  const navigate = useNavigate();
  const location = useLocation();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(false);
  const [topDots, setTopDots] = useState<DotsArray>(initialDotsState);
  const [bottomDots, setBottomDots] = useState<DotsArray>(initialDotsState);
  const [cookiesAllowed, setCookiesAllowed] = useState(false);
  const [guestAvatar, setGuestAvatar] = useState<string>(ZODIAC_SIGNS[0]);
  const [explicitTopRole, setExplicitTopRole] = useState<AccessRole | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') {
      setCookiesAllowed(true);
      return;
    } else if (consent === null) {
      const timer = setTimeout(() => {
        if (!isAuthenticated) setActiveModal('demoWelcome');
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && cookiesAllowed) {
      const savedGuestAvatar = getLocalStorage('guestAvatar');
      if (savedGuestAvatar && ZODIAC_SIGNS.includes(savedGuestAvatar as any)) {
        setGuestAvatar(savedGuestAvatar);
      }
      const savedGuestRole = getLocalStorage('guestRole') as AccessRole;
      if (savedGuestRole) setExplicitTopRole(savedGuestRole);
    }
  }, [isAuthenticated, cookiesAllowed]);

  useEffect(() => {
    const nb = [...initialDotsState];

    let currentStatus: AuthStatus = AuthStatus.ANONYMOUS;
    if (isAuthenticated) {
      currentStatus = AuthStatus.REGISTERED;
    } else if (cookiesAllowed) {
      currentStatus = AuthStatus.COOKIES;
    } else {
      currentStatus = AuthStatus.ANONYMOUS;
    }

    if (DOT_CATEGORY_MAP['A']) {
      // we just simulate color mapping for auth status
      nb[0] = currentStatus === AuthStatus.ANONYMOUS ? 'hsl(var(--warning))' : nb[0];
      nb[1] = currentStatus === AuthStatus.COOKIES ? 'hsl(var(--info))' : nb[1];
      nb[2] = currentStatus === AuthStatus.REGISTERED ? 'hsl(var(--success))' : nb[2];
    }

    setBottomDots(nb);
  }, [isAuthenticated, cookiesAllowed]);

  useEffect(() => {
    const nt = [...initialDotsState];
    const roleToDisplay = isAuthenticated ? user?.accessRole : explicitTopRole;

    if (roleToDisplay) {
      const hierarchy = ACCESS_ROLE_ORDER[roleToDisplay];
      if (hierarchy >= 80) nt[0] = 'hsl(var(--primary))';
      else if (hierarchy >= 50) nt[1] = 'hsl(var(--secondary))';
      else nt[2] = 'hsl(var(--accent))';
    } else {
      const path = location.pathname;
      Object.keys(ACCESS_ROLE_ORDER).forEach((role, index) => {
        if (path.includes(role)) {
          nt[index % 3] = 'hsl(var(--accent))';
        }
      });
    }
    setTopDots(nt);
  }, [location.pathname, user?.accessRole, explicitTopRole, isAuthenticated]);

  const handleModalClose = () => setActiveModal(null);
  const handleModalOpen = (m: ModalType) => setActiveModal(m);
  const handleBreadcrumbsToggle = () => setShowBreadcrumbs((p) => !p);

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

  const handleAcceptAndRegister = () => {
    handleAcceptCookies();
    handleModalOpen('register');
  };

  const handleNavigateToPolicy = () => {
    handleModalClose();
    navigate(APP_PATHS.public.cookiePolicy);
  };

  const handleNavigateToRegister = () => {
    handleModalClose();
    handleModalOpen('register');
  };

  const handleNavigateToThemeSettings = () => {
    if (!activeRole) return;
    navigate(APP_PATHS.portal.appearance);
    handleModalClose();
  };

  const handleLogout = async () => {
    handleModalClose();
    await auth?.logout?.();
  };

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
    handleModalClose();
  };

  const handleDotsSelectionChange = async (top: AccessRole | null, bottom: AuthStatus | null) => {
    handleModalClose();
    if (top) {
      setExplicitTopRole(top);
      if (isAuthenticated && user && auth?.updateSelectedRole) {
        await auth.updateSelectedRole(top);
      } else if (!isAuthenticated && cookiesAllowed) {
        setLocalStorage('guestRole', top);
      }
    }
    if (bottom) {
      if (bottom === AuthStatus.REGISTERED) handleModalOpen('register');
      if (bottom === AuthStatus.COOKIES) handleModalOpen('demoWelcome');
      if (bottom === AuthStatus.ANONYMOUS) handleDeclineCookies();
    }
  };

  const handlers = {
    handleModalClose,
    handleModalOpen,
    handleBreadcrumbsToggle,
    handleAcceptCookies,
    handleDeclineCookies,
    handleAcceptAndRegister,
    handleNavigateToPolicy,
    handleNavigateToRegister,
    handleNavigateToThemeSettings,
    handleLogout,
    handleAvatarSave,
    handleDotsSelectionChange,
  };

  const hamburgerProps = {
    onLoginClick: () => handleModalOpen('login'),
    onRegisterClick: () => handleModalOpen('register'),
    onShowAbout: () => handleModalOpen('about'),
  };

  const logoProps = {
    logoSrc: '/pics/logo.png',
    logoAlt: t('common', 'navbar.logoAlt'),
    homePath: APP_PATHS.public.home,
    toggleAriaLabel: t('common', 'navbar.toggleBreadcrumbs'),
    onBreadcrumbToggle: handleBreadcrumbsToggle,
    showBreadcrumbs,
  };

  const nameProps = {
    appName: t('common', 'appName'),
    onShowAbout: () => handleModalOpen('about'),
  };

  const dotsProps = {
    topDots,
    bottomDots,
    onClick: () => handleModalOpen('dots'),
  };

  const avatarProps = useMemo(
    () => ({
      src: isAuthenticated
        ? user?.imageUrl || '/avatars/default-user.png'
        : cookiesAllowed
        ? `/avatars/zodiac/${guestAvatar}.png`
        : '/avatars/zodiac/anonymous.png',
      alt: isAuthenticated
        ? t('common', 'navbar.userAvatarAlt')
        : t('common', 'navbar.guestAvatarAlt'),
      ariaLabel: t('common', 'navbar.avatarAriaLabel'),
      onClick: () => handleModalOpen('avatar'),
    }),
    [isAuthenticated, user, cookiesAllowed, guestAvatar, t],
  );

  const userInfoProps =
    isAuthenticated && user ? { user: { name: user.name, email: user.email } } : null;

  const loginProps = {
    label: t('common', 'navbar.login'),
    onOpen: () => handleModalOpen('login'),
  };

  const registerProps = {
    label: t('common', 'navbar.register'),
    onOpen: () => handleModalOpen('register'),
  };

  const darkmodeProps = {
    isDarkMode,
    onToggleDarkMode: toggleDarkMode,
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
      onSave: handleAvatarSave,
      isGuestMode: !isAuthenticated,
      cookiesAllowed,
      initialAvatar: !isAuthenticated ? guestAvatar : user?.imageUrl,
    },
    dots: {
      isOpen: activeModal === 'dots',
      onClose: handleModalClose,
      initialTopDots: topDots,
      initialBottomDots: bottomDots,
      onSelectionChange: handleDotsSelectionChange,
      onCustomizeClick: handleNavigateToThemeSettings,
    },
    confirmLogout: {
      isOpen: activeModal === 'confirmLogout',
      onClose: handleModalClose,
      onConfirm: handleLogout,
    },
    demoWelcome: {
      isOpen: activeModal === 'demoWelcome',
      onAccept: handleAcceptCookies,
      onDecline: handleDeclineCookies,
      onAcceptAndRegister: handleAcceptAndRegister,
      onNavigateToPolicy: handleNavigateToPolicy,
    },
    login: {
      isOpen: activeModal === 'login',
      onClose: handleModalClose,
      onNavigateToRegister: handleNavigateToRegister,
    },
    register: {
      isOpen: activeModal === 'register',
      onClose: handleModalClose,
    },
  };

  return {
    isAuthenticated,
    user,
    showBreadcrumbs,
    isDarkMode,
    toggleDarkMode,
    activeModal,
    topDots,
    bottomDots,
    cookiesAllowed,
    guestAvatar,
    handlers,
    hamburgerProps,
    logoProps,
    nameProps,
    dotsProps,
    avatarProps,
    userInfoProps,
    loginProps,
    registerProps,
    darkmodeProps,
    modalProps,
  };
};
