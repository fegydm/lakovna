// File: sendeliver/front/src/libs/hooks/use-language-selector.hook.ts
// Last change: Simplified by removing duplicate language restriction logic.

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "../contexts/translation.context";
import { useLanguages } from "../contexts/languages.context";
import type { Language } from "../types/domains/geo.types";

const IGNORED_CLASSES = [
  "dropdown__item",
  "location-select__dropdown",
  "dropdown__no-results",
];

export const useLanguageSelector = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  const componentRef = useRef<HTMLDivElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { lc, setLc } = useTranslation();
  const { languages: filteredLanguageList, isLoading, detectedLc } = useLanguages();

  useEffect(() => {
    if (!isLoading && filteredLanguageList.length > 0) {
      const isCurrentLangAllowed = filteredLanguageList.some(
        (lang) => lang.lc.toLowerCase() === lc?.toLowerCase()
      );
      
      if (!isCurrentLangAllowed) {
        setLc(filteredLanguageList[0].lc);
      }
    }
  }, [lc, filteredLanguageList, isLoading, setLc]);

  const currentLc = lc || 'en';
  const secLc = detectedLc;

  const tertiaryLc = useMemo(() => {
    const primaryAndSecondary = new Set([currentLc, secLc]);
    if (!primaryAndSecondary.has("en")) {
      return "en";
    }
    return null;
  }, [currentLc, secLc]);

  const filteredLanguages = useMemo(() => {
    const filtered = filteredLanguageList.filter((lang) => {
      const codeMatch = !codeSearch ||
        lang.cc?.toLowerCase().includes(codeSearch.toLowerCase()) ||
        lang.lc?.toLowerCase().includes(codeSearch.toLowerCase());
      const nameMatch = !nameSearch ||
        lang.name_en?.toLowerCase().includes(nameSearch.toLowerCase()) ||
        lang.native_name?.toLowerCase().includes(nameSearch.toLowerCase());
      return codeMatch && nameMatch;
    });

    const priorityLcs = new Set([currentLc, secLc, tertiaryLc].filter(Boolean) as string[]);

    const priority = filtered.filter(lang => priorityLcs.has(lang.lc)).sort((a, b) => {
      const aPriority = [currentLc, secLc, tertiaryLc].filter(Boolean).indexOf(a.lc);
      const bPriority = [currentLc, secLc, tertiaryLc].filter(Boolean).indexOf(b.lc);
      return aPriority - bPriority;
    });

    const other = filtered.filter(lang =>
      !priority.some(p => p.lc === lang.lc)
    ).sort((a, b) =>
      (a.name_en || "").localeCompare(b.name_en || "")
    );

    return { priority, other };
  }, [filteredLanguageList, codeSearch, nameSearch, currentLc, secLc, tertiaryLc]);

  const handleLanguageSelect = useCallback((lang: Language) => {
    setLc(lang.lc);
    setIsDropdownOpen(false);
    setCodeSearch("");
    setNameSearch("");
  }, [setLc]);

  const toggleDropdown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  }, []);

  const hasIgnoredClass = useCallback((element: Node | null): boolean => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
    const el = element as Element;
    for (const className of IGNORED_CLASSES) {
      if (el.classList?.contains(className)) return true;
    }
    if (el.closest('.location-select, .country-select, .dropdown')) return true;
    return hasIgnoredClass(el.parentNode);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!componentRef.current || !isDropdownOpen) return;
    const target = event.target as Node;
    if (componentRef.current.contains(target) || hasIgnoredClass(target)) {
      return;
    }
    setIsDropdownOpen(false);
  }, [isDropdownOpen, hasIgnoredClass]);

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => codeInputRef.current?.focus(), 10);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, handleClickOutside]);

  const handleCodeSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setIsDropdownOpen(false);
    else if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      nameInputRef.current?.focus();
    }
  }, []);

  const handleNameSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setIsDropdownOpen(false);
    else if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      codeInputRef.current?.focus();
    }
  }, []);

  const handleCodeSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCodeSearch(e.target.value.toUpperCase());
  }, []);

  const handleNameSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNameSearch(e.target.value);
  }, []);

  const currentLanguage = filteredLanguageList.find(l => l.lc === lc) || {
    lc: "en",
    cc: "gb",
    name_en: "English",
    native_name: "English"
  };

  return {
    isDropdownOpen,
    codeSearch,
    nameSearch,
    isLoading,
    currentLc,
    currentLanguage,
    filteredLanguages,
    componentRef,
    codeInputRef,
    nameInputRef,
    handleLanguageSelect,
    toggleDropdown,
    handleCodeSearchChange,
    handleNameSearchChange,
    handleCodeSearchKeyDown,
    handleNameSearchKeyDown,
  };
};
