// File: common/utils/language-group.utils.ts
// Last change: Aligned functions to use camelCase and replaced hardcoded values with constants.

import type { Language, GroupedLanguage } from '../types/project.types';
import { GROUPED_LANGUAGE_TYPES } from '../configs/01-constants.config';

export const groupLanguagesByPriority = (
  languages: Language[], 
  primaryLc: string, 
  secondaryLc: string | null, 
  tertiaryLc: string | null
): { priorityLanguages: GroupedLanguage[]; otherLanguages: GroupedLanguage[] } => {
  const priorityLanguages: GroupedLanguage[] = [];
  const otherLanguages: GroupedLanguage[] = [];

  languages.forEach(lang => {
    const groupedLang: GroupedLanguage = { ...lang, group: GROUPED_LANGUAGE_TYPES.OTHER };
    
    if (lang.lcIso2 === primaryLc) {
      groupedLang.group = GROUPED_LANGUAGE_TYPES.PRIMARY;
      priorityLanguages.push(groupedLang);
    } else if (lang.lcIso2 === secondaryLc) {
      groupedLang.group = GROUPED_LANGUAGE_TYPES.SECONDARY;
      priorityLanguages.push(groupedLang);
    } else if (lang.lcIso2 === tertiaryLc) {
      groupedLang.group = GROUPED_LANGUAGE_TYPES.RECENT;
      priorityLanguages.push(groupedLang);
    } else {
      otherLanguages.push(groupedLang);
    }
  });

  priorityLanguages.sort((a, b) => {
    const order = [primaryLc, secondaryLc, tertiaryLc];
    const indexA = order.indexOf(a.lcIso2);
    const indexB = order.indexOf(b.lcIso2);
    return indexA - indexB;
  });

  otherLanguages.sort((a, b) => a.nameEn.localeCompare(b.nameEn));

  return { priorityLanguages, otherLanguages };
};

export const filterLanguages = (languages: Language[], searchTerm: string): Language[] => {
  if (!searchTerm.trim()) return languages;
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return languages.filter(
    lang =>
      lang.lcIso2.toLowerCase().includes(lowerSearchTerm) ||
      lang.nameEn.toLowerCase().includes(lowerSearchTerm) ||
      lang.nativeName.toLowerCase().includes(lowerSearchTerm)
  );
};