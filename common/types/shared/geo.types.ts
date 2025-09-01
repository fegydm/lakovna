// Shared geo domain models – used across all projects

export interface Country {
  cc: string;                  // ISO 2-char code
  name_en: string;             // English name
  name_local: string;          // Localized name
  name_sk: string;             // Slovak name
  logistics_priority: number;  // Priority for logistics
  code_3?: string;             // ISO3 code
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
  lc: string;        // ISO language code
  cc: string;        // Related country code
  name_en: string;
  native_name: string;
  is_rtl: boolean;
}

export interface GroupedLanguage extends Language {
  group: 'primary' | 'secondary' | 'recent' | 'other';
}
