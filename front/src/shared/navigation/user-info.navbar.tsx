// File: front/src/shared/navigation/user-info.navbar.tsx
// Change: Decoupled from auth.context types. Accepts a minimal, relaxed shape.

import React from 'react';
import './user-info.navbar.css';

export type NavbarUser = {
  name?: string | null;
  email?: string | null;
  // zvyšok nech je voľný – vďaka index signature sa sem zmestí hocičo z reálneho usera
  [key: string]: unknown;
};

export interface UserInfoNavbarProps {
  user: NavbarUser;
}

export const UserInfoNavbar: React.FC<UserInfoNavbarProps> = ({ user }) => {
  return (
    <div className="user-info-navbar">
      <span className="user-info-navbar__name">{user.name ?? 'User'}</span>
      {user.email && (
        <span className="user-info-navbar__email">{user.email}</span>
      )}
    </div>
  );
};
