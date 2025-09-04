// File: front/src/hooks/useNavbarAuth.ts
// Last change: Added logout passthrough from auth context

import { useState, useEffect } from "react";
import { useAuthOptional } from "../contexts/auth.optional";
import { getCookie, setCookie } from "front/src/utils/cookie.utils";
import { ZODIAC_SIGNS, type ZodiacSign } from "common/constants/zodiac.constants";
import type { DotCategory } from "common/types/dot-system.types";

export const useNavbarAuth = () => {
  const auth = useAuthOptional();
  const isAuthenticated = !!auth?.isAuthenticated;
  const user = auth?.user ?? null;

  const [cookiesAllowed, setCookiesAllowed] = useState(false);
  const [guestAvatar, setGuestAvatar] = useState<ZodiacSign>(ZODIAC_SIGNS[0]);
  const [explicitTopCategory, setExplicitTopCategory] = useState<DotCategory | null>(null);

  // check cookie consent
  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === "accepted") {
      setCookiesAllowed(true);
    }
  }, []);

  // restore guest avatar + category from cookies
  useEffect(() => {
    if (!isAuthenticated && cookiesAllowed) {
      const savedGuestAvatar = getCookie("guestAvatar");
      if (savedGuestAvatar && ZODIAC_SIGNS.includes(savedGuestAvatar as ZodiacSign)) {
        setGuestAvatar(savedGuestAvatar as ZodiacSign);
      }
      const savedGuestCategory = getCookie("guestCategory") as DotCategory;
      if (savedGuestCategory) {
        setExplicitTopCategory(savedGuestCategory);
      }
    }
  }, [isAuthenticated, cookiesAllowed]);

  const handleAvatarSave = async (avatarId: ZodiacSign) => {
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
  };

  const logout = async () => {
    await auth?.logout?.();
  };

  return {
    isAuthenticated,
    user,
    cookiesAllowed,
    setCookiesAllowed,
    guestAvatar,
    explicitTopCategory,
    setExplicitTopCategory,
    handleAvatarSave,
    logout, 
  };
};
