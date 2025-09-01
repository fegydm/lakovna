// File: front/src/App.tsx
// Last change: Removed BrowserRouter to avoid duplication with main.tsx.

import React from "react";
import { ThemeProvider } from "./contexts/theme.context";
import { TranslationProvider } from "./contexts/translation.context";
import { LanguagesProvider } from "./contexts/languages.context";
import { CountriesProvider } from "./contexts/countries.context";
import { AuthProvider } from "./contexts/auth.context";
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
