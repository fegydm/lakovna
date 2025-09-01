// File: front/src/hooks/useNavbarDots.ts
// Handles top/bottom dots state and colors

import { useState, useEffect } from 'react';
import { AuthStatus } from 'common/types/auth.types';
import { AccessRole } from 'common/types/access-role.types';

type DotsArray = string[];

const initialDotsState: DotsArray = [
  'var(--color-muted)',
  'var(--color-muted)',
  'var(--color-muted)',
];

export const useNavbarDots = (
  isAuthenticated: boolean,
  cookiesAllowed: boolean,
  userRole?: AccessRole | null,
  explicitTopRole?: AccessRole | null,
  locationPath?: string,
) => {
  const [topDots, setTopDots] = useState<DotsArray>(initialDotsState);
  const [bottomDots, setBottomDots] = useState<DotsArray>(initialDotsState);

  // bottom dots by AuthStatus
  useEffect(() => {
    const nb = [...initialDotsState];
    if (isAuthenticated) nb[2] = 'var(--color-success)';
    else if (cookiesAllowed) nb[1] = 'var(--color-warning)';
    else nb[0] = 'var(--color-secondary)';
    setBottomDots(nb);
  }, [isAuthenticated, cookiesAllowed]);

  // top dots by role/path
  useEffect(() => {
    const nt = [...initialDotsState];
    const roleToDisplay = isAuthenticated ? userRole : explicitTopRole;

    if (roleToDisplay) {
      nt[1] = 'var(--color-primary)'; // example mapping
    } else if (locationPath) {
      if (locationPath.includes('/client')) nt[0] = 'var(--color-primary)';
      if (locationPath.includes('/carrier')) nt[2] = 'var(--color-primary)';
    }
    setTopDots(nt);
  }, [isAuthenticated, userRole, explicitTopRole, locationPath]);

  return { topDots, bottomDots, setTopDots, setBottomDots };
};
