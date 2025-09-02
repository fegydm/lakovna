// File: common/utils/language-group.utils.ts
// Last change: Updated functions to use snake_case for consistency

import type { Language, GroupedLanguage } from '../types/geo.types';

export const group_languages_by_priority = (
  languages: Language[], 
  primary_lc: string, 
  secondary_lc: string | null, 
  tertiary_lc: string | null
): { priority_languages: GroupedLanguage[]; other_languages: GroupedLanguage[] } => {
  const priority_languages: GroupedLanguage[] = [];
  const other_languages: GroupedLanguage[] = [];

  languages.forEach(lang => {
    const grouped_lang: GroupedLanguage = { ...lang, group: 'other' };
    
    if (lang.lc_iso2 === primary_lc) {
      grouped_lang.group = 'primary';
      priority_languages.push(grouped_lang);
    } else if (lang.lc_iso2 === secondary_lc) {
      grouped_lang.group = 'secondary';
      priority_languages.push(grouped_lang);
    } else if (lang.lc_iso2 === tertiary_lc) {
      grouped_lang.group = 'recent';
      priority_languages.push(grouped_lang);
    } else {
      other_languages.push(grouped_lang);
    }
  });

  priority_languages.sort((a, b) => {
    const order = [primary_lc, secondary_lc, tertiary_lc];
    const index_a = order.indexOf(a.lc_iso2);
    const index_b = order.indexOf(b.lc_iso2);
    return index_a - index_b;
  });

  other_languages.sort((a, b) => a.name_en.localeCompare(b.name_en));

  return { priority_languages, other_languages };
};

export const filter_languages = (languages: Language[], search_term: string): Language[] => {
  if (!search_term.trim()) return languages;
  const lower_search_term = search_term.toLowerCase();
  
  return languages.filter(
    lang =>
      lang.lc_iso2.toLowerCase().includes(lower_search_term) ||
      lang.name_en.toLowerCase().includes(lower_search_term) ||
      lang.native_name.toLowerCase().includes(lower_search_term)
  );
};