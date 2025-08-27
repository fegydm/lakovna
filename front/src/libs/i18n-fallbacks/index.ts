// File: front/src/libs/i18n-fallbacks/index.ts
// Last change: Centralized all static fallback imports for project-specific configuration.

import en_homepage from "./en/homepage";
import en_ai_form from "./en/ai.form";
import en_manual_form from "./en/manual.form";
import en_result_table from "./en/result.table";
import en_common from "./en/common";
import { docs as en_docs } from "./en/docs";

export const staticFallbacks = {
  en: {
    homepage: en_homepage,
    "ai.form": en_ai_form,
    "manual.form": en_manual_form,
    "result.table": en_result_table,
    common: en_common,
    docs: en_docs,
  },
};
