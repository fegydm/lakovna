// File: common/types/geo.types.ts
// Last change: Updated types for naming consistency and clarity

import type { IsoDateString } from './primitives.types';

// Country metadata
export interface CountryMetadata {
  ccIso2: string;
  nameEn: string;
  nameLocal: string;
  nameSk: string;

  ccIso3?: string;
  numericCode?: string;
  phoneCode?: string;
  continentId?: number;
  isEu?: boolean;
  isSchengen?: boolean;
  capitalEn?: string;
  currencyCode?: string;
  drivingSide?: 'left' | 'right';
  areaKm2?: number;

  createdAt?: IsoDateString;
  updatedAt?: IsoDateString;
}

// Language information
export interface Language {
  lcIso2: string;
  ccIso2: string;
  nameEn: string;
  nativeName: string;
  isRtl: boolean;
}

// Extended language with grouping for UI/selection purposes
export interface GroupedLanguage extends Language {
  group: 'primary' | 'secondary' | 'recent' | 'other';
}