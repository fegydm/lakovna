// File: common/utils/language-group.utils.ts
// Last change: Refactored for clarity and aligned type imports after atomization.

import type { Language, GroupedLanguage } from '../types/shared.types';
import { GROUPED_LANGUAGE_TYPES } from '../configs/01-constants.config';
import type { GroupedLanguageType } from '../types/shared.types';

export const groupLanguagesByPriority = (
  languages: Language[],
  primaryLc: string,
  secondaryLc: string | null,
  tertiaryLc: string | null
): { priorityLanguages: GroupedLanguage[]; otherLanguages: GroupedLanguage[] } => {
  // 1. Vytvoríme si mapu pre jednoduchšie a rýchlejšie vyhľadávanie a triedenie.
  const priorityMap = new Map<string, { group: GroupedLanguageType; rank: number }>();
  if (primaryLc) priorityMap.set(primaryLc, { group: GROUPED_LANGUAGE_TYPES.PRIMARY, rank: 1 });
  if (secondaryLc) priorityMap.set(secondaryLc, { group: GROUPED_LANGUAGE_TYPES.SECONDARY, rank: 2 });
  if (tertiaryLc) priorityMap.set(tertiaryLc, { group: GROUPED_LANGUAGE_TYPES.RECENT, rank: 3 });

  // 2. Pomocou `reduce` rozdelíme jazyky do dvoch skupín v jednom prechode.
  const categorized = languages.reduce(
    (acc, lang) => {
      const priorityInfo = priorityMap.get(lang.lcIso2);

      if (priorityInfo) {
        acc.priority.push({ ...lang, group: priorityInfo.group });
      } else {
        acc.other.push({ ...lang, group: GROUPED_LANGUAGE_TYPES.OTHER });
      }
      return acc;
    },
    { priority: [] as GroupedLanguage[], other: [] as GroupedLanguage[] }
  );

  // 3. Utriedime obe polia.
  categorized.priority.sort(
    (a, b) =>
      (priorityMap.get(a.lcIso2)?.rank ?? 99) -
      (priorityMap.get(b.lcIso2)?.rank ?? 99)
  );
  categorized.other.sort((a, b) => a.nameEn.localeCompare(b.nameEn));

  return {
    priorityLanguages: categorized.priority,
    otherLanguages: categorized.other,
  };
};

export const filterLanguages = (languages: Language[], searchTerm: string): Language[] => {
  if (!searchTerm.trim()) return languages;
  const lowerSearchTerm = searchTerm.toLowerCase();

  return languages.filter(
    (lang) =>
      lang.lcIso2.toLowerCase().includes(lowerSearchTerm) ||
      lang.nameEn.toLowerCase().includes(lowerSearchTerm) ||
      lang.nativeName.toLowerCase().includes(lowerSearchTerm)
  );
};