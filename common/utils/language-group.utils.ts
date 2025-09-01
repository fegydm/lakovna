// File: common/utils/language-group.utils.ts
// Last change: Moved from sendeliver/front/libs/utils to common/utils for reuse across projects

import type { Language, GroupedLanguage } from '../types/geo.types';

export const groupLanguagesByPriority = (
  languages: Language[], 
  primaryLc: string, 
  secondaryLc: string | null, 
  tertiaryLc: string | null
): { priorityLanguages: GroupedLanguage[]; otherLanguages: GroupedLanguage[] } => {
  const priorityLanguages: GroupedLanguage[] = [];
  const otherLanguages: GroupedLanguage[] = [];

  languages.forEach(lang => {
    const groupedLang: GroupedLanguage = { ...lang, group: 'other' };
    
    if (lang.lc === primaryLc) {
      groupedLang.group = 'primary';
      priorityLanguages.push(groupedLang);
    } else if (lang.lc === secondaryLc) {
      groupedLang.group = 'secondary';
      priorityLanguages.push(groupedLang);
    } else if (lang.lc === tertiaryLc) {
      groupedLang.group = 'recent';
      priorityLanguages.push(groupedLang);
    } else {
      otherLanguages.push(groupedLang);
    }
  });

  priorityLanguages.sort((a, b) => {
    const order = [primaryLc, secondaryLc, tertiaryLc];
    const indexA = order.indexOf(a.lc);
    const indexB = order.indexOf(b.lc);
    return indexA - indexB;
  });

  otherLanguages.sort((a, b) => a.name_en.localeCompare(b.name_en));

  return { priorityLanguages, otherLanguages };
};

export const filterLanguages = (languages: Language[], searchTerm: string): Language[] => {
  if (!searchTerm.trim()) return languages;
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return languages.filter(
    lang =>
      lang.lc.toLowerCase().includes(lowerSearchTerm) ||
      lang.name_en.toLowerCase().includes(lowerSearchTerm) ||
      lang.native_name.toLowerCase().includes(lowerSearchTerm)
  );
};
