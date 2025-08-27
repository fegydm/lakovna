// File: front/src/App.tsx
// Last change: Removed BrowserRouter to avoid duplication with main.tsx.

import React from "react";
import { ThemeProvider } from "./libs/contexts/theme.context";
import { TranslationProvider } from "./libs/contexts/translation.context";
import { LanguagesProvider } from "./libs/contexts/languages.context";
import { CountriesProvider } from "./libs/contexts/countries.context";
import { AuthProvider } from "./libs/contexts/auth.context";
import { GeoApi } from "./services/geo.api";
import { I18nApi } from "./services/i18n.api";
import { AppRouter } from "./AppRouter";
import { staticFallbacks } from "./libs/i18n-fallbacks";

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <TranslationProvider
        staticFallbacks={staticFallbacks}
        i18nApi={I18nApi}
      >
        <LanguagesProvider geoApi={GeoApi}>
          <CountriesProvider geoApi={GeoApi}>
            <AuthProvider>
              <AppRouter />
            </AuthProvider>
          </CountriesProvider>
        </LanguagesProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
};
