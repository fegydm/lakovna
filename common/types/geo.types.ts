// File: common/types/geo.types.ts
// Last change: Updated types for naming consistency and clarity

export type IsoDateString = string;

// Country information (ISO + metadata)
export interface Country {
  cc_iso2: string;
  name_en: string;
  name_local: string;
  name_sk: string;

  cc_iso3?: string;
  numeric_code?: string;
  phone_code?: string;
  continent_id?: number;
  is_eu?: boolean;
  is_schengen?: boolean;
  capital_en?: string;
  currency_code?: string;
  driving_side?: 'left' | 'right';
  area_km2?: number;

  created_at?: IsoDateString;
  updated_at?: IsoDateString;
}

// Language information
export interface Language {
  lc_iso2: string;
  cc_iso2: string;
  name_en: string;
  native_name: string;
  is_rtl: boolean;
}

// Extended language with grouping for UI/selection purposes
export interface GroupedLanguage extends Language {
  group: 'primary' | 'secondary' | 'recent' | 'other';
}