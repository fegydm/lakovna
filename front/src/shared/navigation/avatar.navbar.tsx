// File: front/src/shared/navigation/avatar.navbar.tsx
// Last change: Refactored to be a pure presentational component by accepting props.

import React, { FC } from "react";

type Props = {
  src: string;
  alt: string;
  ariaLabel: string;
  onClick: () => void;
};

export const AvatarNavbar: FC<Props> = ({
  src,
  alt,
  ariaLabel,
  onClick,
}) => {
  return (
    <button
      className="navbar__avatar-btn"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <img
        className="navbar__avatar"
        src={src}
        alt={alt}
        width={32}
        height={32}
        loading="eager"
        onError={(e) => {
          // Fallback in case the primary avatar image fails to load
          e.currentTarget.src = "/avatars/zodiac/anonymous.png";
        }}
      />
    </button>
  );
};

export default AvatarNavbar;
