/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_API_BASE_URL: string;
  // tu môžeš pridať ďalšie premenné
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}