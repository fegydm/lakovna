// File: front/src/libs/types/apps/portal/homepage.types.ts

export type PortalSection = 'sender' | 'hauler';

export interface Country {
  cc: string;
  flag?: string;
}

export interface Location {
  country: Country;
  psc: string;
  city: string;
  time: string;
  lat?: number | null;
  lng?: number | null;
}

export interface TransportFormData {
  pickup: Location;
  delivery: Location;
  cargo: {
    pallets: number;
    weight: number;
  };
}

export enum LocationType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

const EMPTY_COUNTRY: Country = { cc: '', flag: undefined };
const EMPTY_LOCATION: Location = {
  country: EMPTY_COUNTRY,
  psc: '',
  city: '',
  time: '',
  lat: null,
  lng: null,
};

export const createEmptyTransportFormData = (): TransportFormData => ({
  pickup: { ...EMPTY_LOCATION, country: { ...EMPTY_COUNTRY } },
  delivery: { ...EMPTY_LOCATION, country: { ...EMPTY_COUNTRY } },
  cargo: { pallets: 0, weight: 0 },
});

export const DEFAULT_TRANSPORT_FORM_DATA: TransportFormData = createEmptyTransportFormData();

export interface SenderData {
  distance: number;
  type: string;
  status: string;
  availability_date: string;
  availability_time: string;
  transit: string;
  rating: number;
  id_pp: number;
  name_carrier: string;
  is_public: boolean;
}

export interface HaulerData {
  pickup: string;
  destination: string;
  cargoType: string;
  weight: number;
  price: number;
  distance: number;
  status: 'available' | 'bidding' | 'urgent';
  client: string;
  postedTime: string;
  is_public: boolean;
}
