// File: common/types/theme-mode.types.ts
// Theme mode definition (universal, extendable by projects)

// Default modes: light + dark
// Project can extend with custom strings if needed
export type ThemeMode = 'light' | 'dark' | (string & {});
