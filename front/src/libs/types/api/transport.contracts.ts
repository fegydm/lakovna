// File: front/src/libs/types/api/transport.contracts.ts
// Last change: Grouped all transport and AI related API contracts.

import { Country } from "@/libs/types/domains/geo.types";

export interface AIRequest {
  message: string;
  type: "sender" | "hauler";
  lang1?: string;
}

export interface AIResponse {
  content?: string;
  data?: {
    pickupLocation?: string;
    deliveryLocation?: string;
    pickupTime?: string;
    deliveryTime?: string;
    weight?: string;
    palletCount?: number;
    coordinates?: {
      pickup?: { lat: number; lng: number };
      delivery?: { lat: number; lng: number };
    };
  };
}

export interface LocationSuggestion {
  cc: string;
  psc: string;
  city: string;
  country?: string;
  flag_url?: string;
  flag?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  logistics_priority?: number;
  priority?: number;
}

export interface LocationApiResponse {
  results: LocationSuggestion[];
  hasMore: boolean;
  total: number;
}

export interface CountryApiResponse {
  results: Country[];
}