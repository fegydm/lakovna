// File: common/types/universal/theme-mode.types.ts
// Last change: Extracted ThemeMode to universal scope for cross-platform use

// ThemeMode is universal: can be extended by projects if needed
export type ThemeMode = 'light' | 'dark' | (string & {});
