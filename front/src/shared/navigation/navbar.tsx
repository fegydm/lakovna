// File: src/shared/navigation/navbar.tsx
// Last change: Fixed missing label props for LoginNavbar and RegisterNavbar.

import { FC, Suspense, lazy } from "react";
import { useNavbar } from "../../libs/hooks/use-navbar.hook";

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

const AvatarModal = lazy(() => import("../../apps/portal/auth/avatar.modal"));
const DotsModal = lazy(() => import("../modals/dots.modal"));
const AboutModal = lazy(() => import("../modals/about.modal"));
const ConfirmLogoutModal = lazy(() => import("../modals/confirm-logout.modal"));
const DemoWelcomeModal = lazy(() => import("../modals/demo-welcome.modal"));
const RegisterModal = lazy(() => import("../../apps/portal/auth/register.modal"));
const LoginModal = lazy(() => import("../../apps/portal/auth/login.modal"));

export const Navbar: FC = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    isAuthenticated,
    user,
    activeModal,
    showBreadcrumbs,
    topDots,
    bottomDots,
    cookiesAllowed,
    guestAvatar,
    logoProps,
    nameProps,
    loginProps,
    registerProps,
    avatarProps,
    handlers: {
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
    },
  } = useNavbar();

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
          <LogoNavbar {...logoProps} onBreadcrumbToggle={handleBreadcrumbsToggle} showBreadcrumbs={showBreadcrumbs} />
          <NameNavbar {...nameProps} onShowAbout={() => handleModalOpen("about")} />
        </div>
        <div className="navbar__group navbar__group--center">
          <DotsNavbar topDots={topDots} bottomDots={bottomDots} onClick={() => handleModalOpen("dots")} />
          <AvatarNavbar {...avatarProps} onClick={() => handleModalOpen("avatar")} />
          {isAuthenticated && user ? (
            <UserInfoNavbar user={{ name: user.name, email: user.email }} />
          ) : (
            <>
              <LoginNavbar {...loginProps} onOpen={() => handleModalOpen("login")} />
              <RegisterNavbar {...registerProps} onOpen={() => handleModalOpen("register")} />
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
            initialAvatar={!isAuthenticated ? guestAvatar : user?.imageUrl}
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
