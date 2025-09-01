// File: common/types/geo.types.ts
// Shared geo domain models – pure type contracts

export type ISODateString = string;

// Country information (ISO + metadata)
export interface Country {
  cc: string;                  // ISO 3166-1 alpha-2 code (e.g., "SK")
  name_en: string;             // English name
  name_local: string;          // Localized name (native language)
  name_sk: string;             // Slovak name

  // Optional metadata from ISO / DB
  code_3?: string;             // ISO 3166-1 alpha-3 code
  numeric_code?: string;       // ISO 3166-1 numeric code
  phone_code?: string;         // Country calling code
  continent_id?: number;
  is_eu?: boolean;
  is_schengen?: boolean;
  capital_en?: string;
  currency_code?: string;
  driving_side?: 'left' | 'right';
  area_km2?: number;

  // Timestamps
  created_at?: ISODateString;
  updated_at?: ISODateString;
}

// Language information
export interface Language {
  lc: string;          // ISO 639-1 language code (e.g., "en", "sk")
  cc: string;          // Related country ISO2 code
  name_en: string;     // English name
  native_name: string; // Native name of the language
  is_rtl: boolean;     // Is right-to-left
}

// Extended language with grouping for UI/selection purposes
export interface GroupedLanguage extends Language {
  group: 'primary' | 'secondary' | 'recent' | 'other';
}
