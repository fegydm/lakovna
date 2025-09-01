// File: front/src/shared/layouts/app.layout.tsx
// Last change: Moved auth-related UI components here from AuthProvider for better separation.

import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/auth.context";

import Navbar from "../navigation/navbar";
import FooterLayout from "./footer/footer";
import FloatingButton from "../elements/floating-button.element";
import EmailVerificationBanner from "../elements/email-verification-banner.element";
import LogoutModal from "../modals/logout.modal";

export const AppLayout: React.FC = () => {
  const {
    user,
    showLogoutModal,
    setShowLogoutModal,
    activeTabCount,
    logoutCurrentTab,
    logoutAllTabsHandler,
  } = useAuth();
  
  const isAdmin = user?.isAdmin || false;

  return (
    <div className="app-container">
      <header>
        <Navbar />
      </header>
      
      <EmailVerificationBanner />
      
      <main>
        <Outlet />
      </main>
      
      <footer>
        <FooterLayout isAdmin={isAdmin} />
        <div className="footer__floating">
          <FloatingButton />
        </div>
      </footer>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        activeTabCount={activeTabCount}
        onLogoutCurrent={logoutCurrentTab}
        onLogoutAll={logoutAllTabsHandler}
      />
    </div>
  );
};
