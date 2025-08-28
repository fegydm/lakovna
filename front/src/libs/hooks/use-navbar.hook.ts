// File: src/libs/hooks/use-navbar.hook.ts
// Last change: Fixed missing properties in the main return object.

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/theme.context';
import { useAuthOptional } from '../contexts/auth.optional';
import { useTranslation } from '../contexts/translation.context';
import { AppRole, APP_ROLES, APP_ROLE_PATHS, APP_ROLE_MAP } from '../../../../common/types/app-role.types';
import { AuthStatus, AUTH_STATUSES } from '../types/systems/auth_status.types';
import { DOTS_STATUS_COLORS, DOTS_ROLE_COLORS } from '../configs/colors.config';
import { ZODIAC_SIGNS } from '../constants/zodiac.constants';
import { getCookie, setCookie } from '../utils/cookie.utils';
import { APP_PATHS } from '../configs/paths.config';

type ModalType =
  | "avatar"
  | "dots"
  | "about"
  | "confirmLogout"
  | "demoWelcome"
  | "login"
  | "register"
  | null;

type DotsArray = string[];

const initialDotsState: DotsArray = [
  DOTS_STATUS_COLORS.inactive,
  DOTS_STATUS_COLORS.inactive,
  DOTS_STATUS_COLORS.inactive,
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
  const [explicitTopRole, setExplicitTopRole] = useState<AppRole | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === "accepted") {
      setCookiesAllowed(true);
      return;
    } else if (consent === null) {
      const timer = setTimeout(() => {
        if (!isAuthenticated) setActiveModal("demoWelcome");
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && cookiesAllowed) {
      const savedGuestAvatar = getCookie("guestAvatar");
      if (savedGuestAvatar && ZODIAC_SIGNS.includes(savedGuestAvatar as any)) {
        setGuestAvatar(savedGuestAvatar);
      }
      const savedGuestRole = getCookie("guestRole") as AppRole;
      if (savedGuestRole) setExplicitTopRole(savedGuestRole);
    }
  }, [isAuthenticated, cookiesAllowed]);

  useEffect(() => {
    const nb = [...initialDotsState];
    const statusMap = {
      [AUTH_STATUSES[0]]: 0,
      [AUTH_STATUSES[1]]: 1,
      [AUTH_STATUSES[2]]: 2,
    };

    let currentStatus: AuthStatus = 'anonymous';
    if (isAuthenticated) {
      currentStatus = AUTH_STATUSES[2];
    } else if (cookiesAllowed) {
      currentStatus = AUTH_STATUSES[1];
    } else {
      currentStatus = AUTH_STATUSES[0];
    }

    const index = statusMap[currentStatus];
    nb[index] = DOTS_STATUS_COLORS[currentStatus];

    setBottomDots(nb);
  }, [isAuthenticated, cookiesAllowed]);

  useEffect(() => {
    const nt = [...initialDotsState];
    const roleToDisplay = isAuthenticated ? user?.selectedRole : explicitTopRole;

    if (roleToDisplay) {
      const idx = APP_ROLES.indexOf(roleToDisplay);
      if (idx !== -1) {
        const mappedRole = APP_ROLE_MAP[roleToDisplay as keyof typeof APP_ROLE_MAP];
        if (mappedRole) {
          nt[idx] = DOTS_ROLE_COLORS[mappedRole as keyof typeof DOTS_ROLE_COLORS];
        }
      }
    } else {
      const path = location.pathname;
      APP_ROLES.forEach((role, index) => {
        const rolePath = APP_ROLE_PATHS[role as keyof typeof APP_ROLE_PATHS];
        const mappedRole = APP_ROLE_MAP[role as keyof typeof APP_ROLE_MAP];
        if (rolePath && mappedRole && (path.includes(rolePath) || path.includes(mappedRole))) {
          nt[index] = DOTS_ROLE_COLORS[mappedRole as keyof typeof DOTS_ROLE_COLORS];
        }
      });
    }
    setTopDots(nt);
  }, [location.pathname, user?.selectedRole, explicitTopRole, isAuthenticated]);

  const handleModalClose = () => setActiveModal(null);
  const handleModalOpen = (m: ModalType) => setActiveModal(m);
  const handleBreadcrumbsToggle = () => setShowBreadcrumbs((p) => !p);

  const handleAcceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setCookiesAllowed(true);
    handleModalClose();
  };

  const handleDeclineCookies = () => {
    localStorage.setItem("cookie_consent", "declined");
    setCookiesAllowed(false);
    handleModalClose();
  };

  const handleAcceptAndRegister = () => {
    handleAcceptCookies();
    handleModalOpen("register");
  };

  const handleNavigateToPolicy = () => {
    handleModalClose();
    navigate(APP_PATHS.public.cookiePolicy);
  };

  const handleNavigateToRegister = () => {
    handleModalClose();
    handleModalOpen("register");
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
        setCookie("guestAvatar", avatarId, 30);
        setGuestAvatar(avatarId);
      }
    } else if (user && auth?.updateUserAvatar) {
      try {
        const avatarUrl = `/avatars/zodiac/${avatarId}.png`;
        await auth.updateUserAvatar(avatarUrl);
      } catch (e) {
        console.error("Failed to save user avatar:", e);
      }
    }
    handleModalClose();
  };

  const handleDotsSelectionChange = async (top: AppRole | null, bottom: AuthStatus | null) => {
    handleModalClose();
    if (top) {
      setExplicitTopRole(top);
      if (isAuthenticated && user && auth?.updateSelectedRole) {
        await auth.updateSelectedRole(top);
      } else if (!isAuthenticated && cookiesAllowed) {
        setCookie("guestRole", top, 30);
      }
    }
    if (bottom) {
      if (bottom === AUTH_STATUSES[2]) handleModalOpen("register");
      if (bottom === AUTH_STATUSES[1]) handleModalOpen("demoWelcome");
      if (bottom === AUTH_STATUSES[0]) handleDeclineCookies();
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
    onLoginClick: () => handleModalOpen("login"),
    onRegisterClick: () => handleModalOpen("register"),
    onShowAbout: () => handleModalOpen("about"),
  };

  const logoProps = {
    logoSrc: "/pics/logo.png",
    logoAlt: t("common", "navbar.logoAlt"),
    homePath: APP_PATHS.public.home,
    toggleAriaLabel: t("common", "navbar.toggleBreadcrumbs"),
    onBreadcrumbToggle: handleBreadcrumbsToggle,
    showBreadcrumbs,
  };

  const nameProps = {
    appName: t("common", "appName"),
    onShowAbout: () => handleModalOpen("about"),
  };

  const dotsProps = {
    topDots,
    bottomDots,
    onClick: () => handleModalOpen("dots"),
  };

  const avatarProps = useMemo(() => ({
    src: isAuthenticated
      ? (user?.imageUrl || "/avatars/default-user.png")
      : (cookiesAllowed
          ? `/avatars/zodiac/${guestAvatar}.png`
          : "/avatars/zodiac/anonymous.png"),
    alt: isAuthenticated 
      ? t("common", "navbar.userAvatarAlt") 
      : t("common", "navbar.guestAvatarAlt"),
    ariaLabel: t("common", "navbar.avatarAriaLabel"),
    onClick: () => handleModalOpen("avatar"),
  }), [isAuthenticated, user, cookiesAllowed, guestAvatar, t]);
  
  const userInfoProps = (isAuthenticated && user) ? { user: { name: user.name, email: user.email } } : null;

  const loginProps = {
    label: t("common", "navbar.login"),
    onOpen: () => handleModalOpen("login"),
  };

  const registerProps = {
    label: t("common", "navbar.register"),
    onOpen: () => handleModalOpen("register"),
  };

  const darkmodeProps = {
    isDarkMode,
    onToggleDarkMode: toggleDarkMode,
  };

  const modalProps = {
    about: {
      isOpen: activeModal === "about",
      onClose: handleModalClose,
      onNavigateToRegister: () => handleModalOpen("register"),
    },
    avatar: {
      isOpen: activeModal === "avatar",
      onClose: handleModalClose,
      onLogout: () => handleModalOpen("confirmLogout"),
      onSave: handleAvatarSave,
      isGuestMode: !isAuthenticated,
      cookiesAllowed,
      initialAvatar: !isAuthenticated ? guestAvatar : user?.imageUrl,
    },
    dots: {
      isOpen: activeModal === "dots",
      onClose: handleModalClose,
      initialTopDots: topDots,
      initialBottomDots: bottomDots,
      onSelectionChange: handleDotsSelectionChange,
      onCustomizeClick: handleNavigateToThemeSettings,
    },
    confirmLogout: {
      isOpen: activeModal === "confirmLogout",
      onClose: handleModalClose,
      onConfirm: handleLogout,
    },
    demoWelcome: {
      isOpen: activeModal === "demoWelcome",
      onAccept: handleAcceptCookies,
      onDecline: handleDeclineCookies,
      onAcceptAndRegister: handleAcceptAndRegister,
      onNavigateToPolicy: handleNavigateToPolicy,
    },
    login: {
      isOpen: activeModal === "login",
      onClose: handleModalClose,
      onNavigateToRegister: handleNavigateToRegister,
    },
    register: {
      isOpen: activeModal === "register",
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
