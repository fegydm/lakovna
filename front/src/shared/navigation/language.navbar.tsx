// File: sendeliver/front/src/shared/navigation/language.navbar.tsx
// Last change: Replaced hardcoded fallback country code with a centralized constant.

import React from "react";
import { useLanguageSelector } from "../../hooks/use-language-selector.hook";
import type { Language } from "../../../../common/types/geo.types";
import { getFlagUrl, FALLBACK_COUNTRY_CODE } from "../../libs/configs/language.config";
import "./language.navbar.css";

export const LanguageNavbar: React.FC = () => {
  const {
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
  } = useLanguageSelector();

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
        onError={(e) => { e.currentTarget.src = getFlagUrl(FALLBACK_COUNTRY_CODE); }}
      />
      <span className="language-navbar__item-code">{lang.cc}</span>
      <span className="language-navbar__item-lc">{lang.lc}</span>
      <span className="language-navbar__item-name">{lang.name_en}</span>
      <span className="language-navbar__item-native-name">{lang.native_name}</span>
    </div>
  );

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
          onError={(e) => { e.currentTarget.src = getFlagUrl(FALLBACK_COUNTRY_CODE); }}
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
              onChange={handleNameSearchChange}
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
                  renderLanguageItem(lang, lang.lc === filteredLanguages.priority[1]?.lc ? 'secondary' : 'tertiary')
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
