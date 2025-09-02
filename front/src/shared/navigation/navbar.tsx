// File: front/src/shared/navigation/Navbar.tsx
// Clean Navbar component wired to custom hooks

import { FC, Suspense, lazy } from 'react';
import { useNavbarAuth } from '../../hooks/useNavbarAuth';
import { useNavbarDots } from '../../hooks/useNavbarDots';
import { useNavbarModals } from '../../hooks/useNavbarModals';
import { useNavbarTheme } from '../../hooks/useNavbarTheme';
import { useAuthOptional } from '../../contexts/auth.optional';
import { useTranslation } from '../../contexts/translation.context';

import { LogoNavbar } from './logo.navbar';
import { NameNavbar } from './name.navbar';
import { LanguageNavbar } from './language.navbar';
import { DarkmodeNavbar } from './darkmode.navbar';
import { DotsNavbar } from './dots.navbar';
import { AvatarNavbar } from './avatar.navbar';
import { UserInfoNavbar } from './user-info.navbar';
import { LoginNavbar } from './login.navbar';
import { RegisterNavbar } from './register.navbar';
import { BreadcrumbNavbar } from './breadcrumb.navbar';
import { HamburgerNavbar } from './hamburger.navbar';

import './navbar.css';

// Lazy-loaded modals
const AvatarModal = lazy(() => import('../../apps/portal/auth/avatar.modal'));
const DotsModal = lazy(() => import('../modals/dots.modal'));
const AboutModal = lazy(() => import('../modals/about.modal'));
const ConfirmLogoutModal = lazy(() => import('../modals/confirm-logout.modal'));
const DemoWelcomeModal = lazy(() => import('../modals/demo-welcome.modal'));
const RegisterModal = lazy(() => import('../../apps/portal/auth/register.modal'));
const LoginModal = lazy(() => import('../../apps/portal/auth/login.modal'));

const Navbar: FC = () => {
  const { t } = useTranslation();
  const auth = useAuthOptional();

  // hooks
  const { isAuthenticated, user, cookiesAllowed, guestAvatar, explicitTopCategory } = useNavbarAuth();
  const { topDots, bottomDots } = useNavbarDots({
    isAuthenticated,
    cookiesAllowed,
    userCategory: (user as any)?.category ?? null,
    explicitTopCategory,
  });
  const { isDarkMode, toggleDarkMode, showBreadcrumbs, handleBreadcrumbsToggle } = useNavbarTheme();
  const { activeModal, handlers, modalProps } = useNavbarModals({
    isAuthenticated,
    cookiesAllowed,
    onLogout: async () => auth?.logout?.(),
    onAvatarSave: async (avatarId) =>
      auth?.updateUserAvatar?.(`/avatars/zodiac/${avatarId}.png`),
    onDotsSelectionChange: async () => Promise.resolve(), // TODO
    onNavigateToPolicy: () => console.log('navigate policy'),
    onNavigateToThemeSettings: () => console.log('navigate theme settings'),
  });

  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        <div className="navbar__group navbar__group--left">
          {!isAuthenticated && (
            <HamburgerNavbar
              onLoginClick={() => handlers.handleModalOpen('login')}
              onRegisterClick={() => handlers.handleModalOpen('register')}
              onShowAbout={() => handlers.handleModalOpen('about')}
            />
          )}
          <LogoNavbar
            onBreadcrumbToggle={handleBreadcrumbsToggle}
            showBreadcrumbs={showBreadcrumbs}
          />
          <NameNavbar onShowAbout={() => handlers.handleModalOpen('about')} />
        </div>

        <div className="navbar__group navbar__group--center">
          <DotsNavbar
            topDots={topDots}
            bottomDots={bottomDots}
            onClick={() => handlers.handleModalOpen('dots')}
          />
          <AvatarNavbar
            src={
              isAuthenticated
                ? user?.imageUrl || '/avatars/default-user.png'
                : cookiesAllowed
                ? `/avatars/zodiac/${guestAvatar}.png`
                : '/avatars/zodiac/anonymous.png'
            }
            alt={isAuthenticated ? t('common', 'navbar.userAvatarAlt') : t('common', 'navbar.guestAvatarAlt')}
            ariaLabel={t('common', 'navbar.avatarAriaLabel')}
            onClick={() => handlers.handleModalOpen('avatar')}
          />
          {isAuthenticated && user ? (
            <UserInfoNavbar user={{ name: user.name, email: user.email }} />
          ) : (
            <>
              <LoginNavbar
                label={t('common', 'navbar.login')}
                onOpen={() => handlers.handleModalOpen('login')}
              />
              <RegisterNavbar
                label={t('common', 'navbar.register')}
                onOpen={() => handlers.handleModalOpen('register')}
              />
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

      {/* Modals */}
      <Suspense fallback={null}>
        {activeModal === 'about' && <AboutModal {...modalProps.about} />}
        {activeModal === 'avatar' && <AvatarModal {...modalProps.avatar} />}
        {activeModal === 'dots' && (
  <DotsModal
    {...modalProps.dots}
    initialTopDots={topDots}
    initialBottomDots={bottomDots}
  />)}
        {activeModal === 'confirmLogout' && (
          <ConfirmLogoutModal {...modalProps.confirmLogout} />
        )}
        {activeModal === 'demoWelcome' && (
          <DemoWelcomeModal {...modalProps.demoWelcome} />
        )}
        {activeModal === 'login' && <LoginModal {...modalProps.login} />}
        {activeModal === 'register' && <RegisterModal {...modalProps.register} />}
      </Suspense>
    </header>
  );
};

export default Navbar;
