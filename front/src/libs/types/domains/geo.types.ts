// File: front/src/libs/types/domains/geo.types.ts
// Last change: Consolidated all geo, language, and translation domain models.

export interface Country {
  cc: string;
  name_en: string;
  name_local: string;
  name_sk: string;
  logistics_priority: number;
  code_3?: string;
  numeric_code?: string;
  phone_code?: string;
  continent_id?: number;
  is_eu?: boolean;
  capital_en?: string;
  currency_code?: string;
  driving_side?: string;
  created_at?: Date;
  updated_at?: Date;
  is_schengen?: boolean;
  area_km2?: number;
  flag?: string;
}

export interface Language {
  lc: string;
  cc: string;
  name_en: string;
  native_name: string;
  is_rtl: boolean;
}

export interface GroupedLanguage extends Language {
  group: 'primary' | 'secondary' | 'recent' | 'other';
}

export type TranslationData = Record<string, string>;