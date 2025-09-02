// File: front/src/hooks/useNavbarDots.ts
// Last change: Switched to DotCategory + getCategoryColor for Lakovňa categories

import { useEffect, useState } from "react";
import type { DotCategory } from "common/types/dot-system.types";
import { DOTS_STATUS_COLORS, getCategoryColor } from "common/utils/dot-colors.utils";

type DotsArray = string[];

export interface UseNavbarDotsParams {
  isAuthenticated: boolean;
  cookiesAllowed: boolean;
  userCategory: DotCategory | null;
  explicitTopCategory?: DotCategory | null;
}

const initialDotsState: DotsArray = [
  DOTS_STATUS_COLORS.inactive,
  DOTS_STATUS_COLORS.inactive,
  DOTS_STATUS_COLORS.inactive,
];

export const useNavbarDots = ({
  isAuthenticated,
  cookiesAllowed,
  userCategory,
  explicitTopCategory = null,
}: UseNavbarDotsParams) => {
  const [topDots, setTopDots] = useState<DotsArray>(initialDotsState);
  const [bottomDots, setBottomDots] = useState<DotsArray>(initialDotsState);

  // bottom row = auth statuses
  useEffect(() => {
    const nb = [...initialDotsState];
    if (isAuthenticated) {
      nb[2] = DOTS_STATUS_COLORS.registered;
    } else if (cookiesAllowed) {
      nb[1] = DOTS_STATUS_COLORS.cookies;
    } else {
      nb[0] = DOTS_STATUS_COLORS.anonymous;
    }
    setBottomDots(nb);
  }, [isAuthenticated, cookiesAllowed]);

  // top row = categories
  useEffect(() => {
    const nt = [...initialDotsState];
    const categoryToDisplay = isAuthenticated ? userCategory : explicitTopCategory;
    if (categoryToDisplay) {
      nt[0] = getCategoryColor(categoryToDisplay);
    }
    setTopDots(nt);
  }, [userCategory, explicitTopCategory, isAuthenticated]);

  return { topDots, bottomDots };
};
