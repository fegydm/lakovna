// File: front/src/shared/navigation/navbar.tsx
// Last change: Removed unused variables and fixed missing return statement in useEffect.

import { useState, FC, useEffect, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/libs/hooks/use-theme.hook";
import { useAuthOptional } from "@/libs/contexts/auth.optional";
import { AppRole } from "@/libs/types/domains/roles.types";
import { AuthStatus } from "@/libs/types/domains/auth.types";

import { LogoNavbar } from "./logo.navbar";
import { NameNavbar } from "./name.navbar";
import { LanguageNavbar } from "./language.navbar";
import { DarkmodeNavbar } from "./darkmode.navbar";
import { DotsNavbar } from "./dots.navbar";
import { AvatarNavbar } from "./avatar.navbar";
import { UserInfoNavbar } from "./user-info.navbar";
import { LoginNavbar } from "./login.navbar";
import { RegisterNavbar } from "./register.navbar";
import { BreadcrumbNavbar } from "./breadcrumb.navbar";
import { HamburgerNavbar } from "./hamburger.navbar";
import "./navbar.css";

const AvatarModal = lazy(() => import("@/apps/portal/auth/avatar.modal"));
const DotsModal = lazy(() => import("@/shared/modals/dots.modal"));
const AboutModal = lazy(() => import("@/shared/modals/about.modal"));
const ConfirmLogoutModal = lazy(() => import("@/shared/modals/confirm-logout.modal"));
const DemoWelcomeModal = lazy(() => import("@/shared/modals/demo-welcome.modal"));
const RegisterModal = lazy(() => import("@/apps/portal/auth/register.modal"));
const LoginModal = lazy(() => import("@/apps/portal/auth/login.modal"));

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

const DOTS_COLORS = {
  inactive: "var(--color-secondary-200)",
  client: "var(--color-primary-500)",
  forwarder: "var(--color-primary-500)",
  carrier: "var(--color-primary-500)",
  anonymous: "var(--color-secondary-500)",
  cookies: "var(--color-warning-500)",
  registered: "var(--color-success-500)",
};

const ZODIAC_SIGNS = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + d.toUTCString();
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
};

const initialDotsState: DotsArray = [
  DOTS_COLORS.inactive,
  DOTS_COLORS.inactive,
  DOTS_COLORS.inactive,
];

const Navbar: FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const auth = useAuthOptional();
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
    navigate("/cookie-policy");
  };
  const handleNavigateToRegister = () => {
    handleModalClose();
    handleModalOpen("register");
  };
  const handleNavigateToThemeSettings = () => {
    navigate("/hauler/settings/appearance");
    handleModalClose();
  };

  useEffect(() => {
    if (!isAuthenticated && cookiesAllowed) {
      const savedGuestAvatar = getCookie("guestAvatar");
      if (savedGuestAvatar && ZODIAC_SIGNS.includes(savedGuestAvatar)) {
        setGuestAvatar(savedGuestAvatar);
      }
      const savedGuestRole = getCookie("guestRole") as AppRole;
      if (savedGuestRole) setExplicitTopRole(savedGuestRole);
    }
  }, [isAuthenticated, cookiesAllowed]);

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

  useEffect(() => {
    const nb = [...initialDotsState];
    if (isAuthenticated) {
      nb[2] = DOTS_COLORS.registered;
    } else if (cookiesAllowed) {
      nb[1] = DOTS_COLORS.cookies;
    } else {
      nb[0] = DOTS_COLORS.anonymous;
    }
    setBottomDots(nb);
  }, [isAuthenticated, cookiesAllowed]);

  useEffect(() => {
    const nt = [...initialDotsState];
    const topKeys: AppRole[] = ["client", "forwarder", "carrier"];
    const roleToDisplay = isAuthenticated ? (user as any)?.selectedRole : explicitTopRole;

    if (roleToDisplay) {
      const idx = topKeys.indexOf(roleToDisplay);
      if (idx !== -1 && roleToDisplay in DOTS_COLORS) {
        nt[idx] = DOTS_COLORS[roleToDisplay as keyof typeof DOTS_COLORS];
      }
    } else {
      const path = location.pathname;
      if (path.includes("/sender") || path.includes("/client")) nt[0] = DOTS_COLORS.client;
      else if (path.includes("/hauler") || path.includes("/carrier")) nt[2] = DOTS_COLORS.carrier;
    }
    setTopDots(nt);
  }, [location.pathname, (user as any)?.selectedRole, explicitTopRole, isAuthenticated]);

  const handleDotsSelectionChange = async (top: AppRole | null, bottom: AuthStatus | null) => {
    handleModalClose();
    if (top) {
      setExplicitTopRole(top);
      if (isAuthenticated && user && auth?.updateUserRole) {
        await auth.updateUserRole(top);
      } else if (!isAuthenticated && cookiesAllowed) {
        setCookie("guestRole", top, 30);
      }
    }
    if (bottom) {
      if (bottom === "registered") handleModalOpen("register");
      if (bottom === "cookies") handleModalOpen("demoWelcome");
      if (bottom === "anonymous") handleDeclineCookies();
    }
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        <div className="navbar__group navbar__group--left">
          {!isAuthenticated && (
            <HamburgerNavbar
              onLoginClick={() => handleModalOpen("login")}
              onRegisterClick={() => handleModalOpen("register")}
              onShowAbout={() => handleModalOpen("about")}
            />
          )}
          <LogoNavbar onBreadcrumbToggle={handleBreadcrumbsToggle} showBreadcrumbs={showBreadcrumbs} />
          <NameNavbar onShowAbout={() => handleModalOpen("about")} />
        </div>

        <div className="navbar__group navbar__group--center">
          <DotsNavbar topDots={topDots} bottomDots={bottomDots} onClick={() => handleModalOpen("dots")} />
          <AvatarNavbar
            isAuthenticated={isAuthenticated}
            onUserClick={() => handleModalOpen("avatar")}
            onGuestClick={() => handleModalOpen("avatar")}
            cookiesAllowed={cookiesAllowed}
            guestAvatar={guestAvatar}
          />
          {isAuthenticated && user ? (
            <UserInfoNavbar user={{ name: (user as any).name, email: (user as any).email }} />
          ) : (
            <>
              <LoginNavbar onOpen={() => handleModalOpen("login")} />
              <RegisterNavbar onOpen={() => handleModalOpen("register")} />
            </>
          )}
        </div>

        <div className="navbar__group navbar__group--right">
          <LanguageNavbar />
          <DarkmodeNavbar isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        </div>
      </div>

      {showBreadcrumbs && (
        <div className="navbar__breadcrumb-container">
          <BreadcrumbNavbar />
        </div>
      )}

      <Suspense fallback={null}>
        {activeModal === "about" && (
          <AboutModal
            isOpen
            onClose={handleModalClose}
            onNavigateToRegister={() => handleModalOpen("register")}
          />
        )}
        {activeModal === "avatar" && (
          <AvatarModal
            isOpen
            onClose={handleModalClose}
            onLogout={() => handleModalOpen("confirmLogout")}
            onSave={handleAvatarSave}
            isGuestMode={!isAuthenticated}
            cookiesAllowed={cookiesAllowed}
            initialAvatar={!isAuthenticated ? guestAvatar : (user as any)?.imageUrl}
          />
        )}
        {activeModal === "dots" && (
          <DotsModal
            isOpen
            onClose={handleModalClose}
            initialTopDots={topDots}
            initialBottomDots={bottomDots}
            onSelectionChange={handleDotsSelectionChange}
            onCustomizeClick={handleNavigateToThemeSettings}
          />
        )}
        {activeModal === "confirmLogout" && (
          <ConfirmLogoutModal isOpen onClose={handleModalClose} onConfirm={handleLogout} />
        )}
        {activeModal === "demoWelcome" && (
          <DemoWelcomeModal
            isOpen
            onAccept={handleAcceptCookies}
            onDecline={handleDeclineCookies}
            onAcceptAndRegister={handleAcceptAndRegister}
            onNavigateToPolicy={handleNavigateToPolicy}
          />
        )}
        {activeModal === "login" && (
          <LoginModal isOpen onClose={handleModalClose} onNavigateToRegister={handleNavigateToRegister} />
        )}
        {activeModal === "register" && <RegisterModal isOpen onClose={handleModalClose} />}
      </Suspense>
    </header>
  );
};

export default Navbar;
