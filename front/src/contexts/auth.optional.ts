// File: front/src/libs/contexts/auth.optional.ts
// Purpose: Safe-to-use wrapper around useAuth() that returns null when AuthProvider
//          is not mounted. Useful for components (e.g., Navbar) that should render
//          in anonymous mode without hard dependency on AuthProvider.

import { useAuth as useAuthStrict } from "./auth.context";

// Reuse the exact value type that your strict hook returns
export type AuthOptional = ReturnType<typeof useAuthStrict> | null;

/**
 * useAuthOptional()
 * Always call this hook unconditionally (top-level of your component). If
 * AuthProvider is missing, it will return null instead of throwing.
 */
export function useAuthOptional(): AuthOptional {
  try {
    // If AuthProvider exists, this returns the real context value
    return useAuthStrict();
  } catch (err) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[auth-optional] AuthProvider not present; running in anonymous mode.");
    }
    return null;
  }
}
