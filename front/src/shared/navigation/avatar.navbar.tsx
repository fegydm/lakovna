// File: front/src/shared/navigation/avatar.navbar.tsx
// Last change: Removed useAuth; works without AuthProvider (props-only).

import React, { FC } from "react";

type Props = {
  isAuthenticated: boolean;
  userAvatarUrl?: string | null;   // full URL or null
  guestAvatar: string;             // zodiac id, e.g. "aries"
  cookiesAllowed: boolean;
  onUserClick: () => void;
  onGuestClick: () => void;
};

export const AvatarNavbar: FC<Props> = ({
  isAuthenticated,
  userAvatarUrl,
  guestAvatar,
  cookiesAllowed,
  onUserClick,
  onGuestClick,
}) => {
  const src = isAuthenticated
    ? (userAvatarUrl || "/avatars/default-user.png")
    : (cookiesAllowed
        ? `/avatars/zodiac/${guestAvatar}.png`
        : "/avatars/zodiac/anonymous.png");

  const alt = isAuthenticated ? "User avatar" : "Guest avatar";
  const handleClick = isAuthenticated ? onUserClick : onGuestClick;

  return (
    <button
      className="navbar__avatar-btn"
      onClick={handleClick}
      aria-label="Open avatar menu"
    >
      <img
        className="navbar__avatar"
        src={src}
        alt={alt}
        width={32}
        height={32}
        loading="eager"
      />
    </button>
  );
};

export default AvatarNavbar;
