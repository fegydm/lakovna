// File: front/src/shared/navigation/language.navbar.tsx
// Last change: Auto-switch to the first language from the restriction list.

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "@/libs/contexts/translation.context";
import { useLanguages } from "@/libs/contexts/languages.context";
import type { Language } from "@/libs/types/domains/geo.types";
import { languageRestrictions } from "@/libs/configs/language.config";
import "./language.navbar.css";

const IGNORED_CLASSES = [
  "dropdown__item",
  "location-select__dropdown",
  "dropdown__no-results",
];

export const LanguageNavbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  const componentRef = useRef<HTMLDivElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const { lc, setLc } = useTranslation();
  const { languages, isLoading, getFlagUrl, detectedLc } = useLanguages();

  const availableLangs = useMemo(() => {
    const restrictionKey = Object.keys(languageRestrictions).find(key =>
      location.pathname.includes(`/${key}`)
    );
    return restrictionKey ? languageRestrictions[restrictionKey] : undefined;
  }, [location.pathname]);

  const filteredLanguageList = useMemo(() => {
    if (availableLangs && availableLangs.length > 0) {
      const lowercasedAvailableLangs = availableLangs.map(l => l.toLowerCase());
      return languages.filter(lang =>
        lang.lc && lowercasedAvailableLangs.includes(lang.lc.toLowerCase())
      );
    }
    return languages;
  }, [languages, availableLangs]);

  useEffect(() => {
    if (!isLoading && availableLangs && availableLangs.length > 0) {
      const isCurrentLangAllowed = availableLangs.some(
        (allowedLc) => allowedLc.toLowerCase() === lc?.toLowerCase()
      );
      
      if (!isCurrentLangAllowed) {
        setLc(availableLangs[0]);
      }
    }
  }, [lc, availableLangs, isLoading, setLc]);

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

  const renderLanguageItem = (lang: Language, type: 'primary' | 'secondary' | 'tertiary' | 'default') => (
    <div
      key={lang.lc}
      className={`language-navbar__item ${type !== 'default' ? `language-navbar__item--${type}` : ''}`}
      onClick={() => handleLanguageSelect(lang)}
      tabIndex={0}
    >
      <img
        src={getFlagUrl(lang.cc || "")}
        alt={`${lang.cc} flag`}
        className="language-navbar__item-flag"
        onError={(e) => { e.currentTarget.src = getFlagUrl("GB"); }}
      />
      <span className="language-navbar__item-code">{lang.cc}</span>
      <span className="language-navbar__item-lc">{lang.lc}</span>
      <span className="language-navbar__item-name">{lang.name_en}</span>
      <span className="language-navbar__item-native-name">{lang.native_name}</span>
    </div>
  );

  const currentLanguage = languages.find(l => l.lc === lc) || { lc: "en", cc: "gb", name_en: "English", native_name: "English" };

  return (
    <div className="language-navbar" ref={componentRef}>
      <button
        onClick={toggleDropdown}
        className="language-navbar__button"
        aria-expanded={isDropdownOpen}
      >
        <img
          src={getFlagUrl(currentLanguage.cc)}
          alt={`${currentLc} flag`}
          className={`language-navbar__flag ${!isDropdownOpen ? "language-navbar__flag--grayscale" : ""}`}
          onError={(e) => { e.currentTarget.src = getFlagUrl("GB"); }}
        />
        <span className="language-navbar__lc">{currentLc}</span>
      </button>

      {isDropdownOpen && (
        <div className="language-navbar__dropdown" onClick={(e) => e.stopPropagation()}>
          <div className="language-navbar__search">
            <input
              ref={codeInputRef}
              type="text"
              placeholder="CC/LC"
              className="language-navbar__search-input language-navbar__search-input--code"
              value={codeSearch}
              onChange={handleCodeSearchChange}
              onKeyDown={handleCodeSearchKeyDown}
              maxLength={2}
              autoFocus
            />
            <input
              ref={nameInputRef}
              type="text"
              placeholder="Search name..."
              className="language-navbar__search-input language-navbar__search-input--name"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              onKeyDown={handleNameSearchKeyDown}
            />
          </div>
          <div className="language-navbar__list">
            {isLoading ? (
              <div className="language-navbar__message">Loading...</div>
            ) : (
              <>
                {filteredLanguages.priority[0] &&
                  renderLanguageItem(filteredLanguages.priority[0], 'primary')
                }
                {filteredLanguages.priority.slice(1).map(lang =>
                  renderLanguageItem(lang, lang.lc === secLc ? 'secondary' : 'tertiary')
                )}
                {filteredLanguages.priority.length > 0 && filteredLanguages.other.length > 0 && (
                  <div className="language-navbar__divider" />
                )}
                {filteredLanguages.other.map(lang =>
                  renderLanguageItem(lang, 'default')
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};