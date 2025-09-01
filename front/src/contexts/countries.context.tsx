// File: sendeliver/front/src/libs/contexts/countries.context.tsx
// Last change: Removed redundant getFlagUrl to maintain a single source of truth.

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import type { Country } from "common/types/geo.types";

export interface CountriesContextValue {
  countries: Country[];
  isLoading: boolean;
}

const CountriesContext = createContext<CountriesContextValue | undefined>(undefined);

interface CountriesProviderProps {
  children: ReactNode;
  geoApi: {
    getCountries: () => Promise<Country[]>;
  };
}

export const CountriesProvider: React.FC<CountriesProviderProps> = ({ children, geoApi }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const loadCountries = async () => {
      try {
        setIsLoading(true);
        const data = await geoApi.getCountries();
        if (!cancelledRef.current) {
          setCountries(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("[CountriesContext] Failed to load countries.", err);
        if (!cancelledRef.current) setCountries([]);
      } finally {
        if (!cancelledRef.current) setIsLoading(false);
      }
    };

    loadCountries();

    return () => {
      cancelledRef.current = true;
    };
  }, [geoApi]);

  const value = useMemo<CountriesContextValue>(
    () => ({
      countries,
      isLoading,
    }),
    [countries, isLoading]
  );

  return <CountriesContext.Provider value={value}>{children}</CountriesContext.Provider>;
};

export const useCountries = (): CountriesContextValue => {
  const ctx = useContext(CountriesContext);
  if (!ctx) {
    throw new Error("useCountries must be used within a CountriesProvider");
  }
  return ctx;
};
