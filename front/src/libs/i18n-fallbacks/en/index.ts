// File: front/src/libs/i18n-fallbacks/en/index.ts
// Purpose: Export map of namespace → fallback entries
// ================================

import common from './common';
import manual_form from './manual.form';
import homepage from './homepage';
import ai_form from './ai.form';
import result_table from './result.table';

export const EN_FALLBACKS: Record<string, Record<string, string>> = {
  'common': common,
  'manual.form': manual_form,
  'homepage': homepage,
  'ai.form': ai_form,
  'result.table': result_table,
};