// File: front/src/apps/home/settings/settings.tab.tsx

import React, { useState, useEffect } from "react";
import type { AccessRole } from "../../../../../common/types/access-role.types";
import { logger } from "../../../../../common/utils/logger.utils";
import "./settings.tab.css";

interface SettingsTabProps {
  isAuthenticated: boolean;
  accessRole: AccessRole;
}

interface LocalSettings {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  language: 'sk' | 'en' | 'cs';
  compactMode: boolean;
  animationsEnabled: boolean;
  autoSave: boolean;
}

interface UserSettings extends LocalSettings {
  notifications: boolean;
  emailAlerts: boolean;
  dashboardLayout: 'grid' | 'list';
  defaultView: 'dashboard' | 'schema';
}

const SettingsTab: React.FC<SettingsTabProps> = ({ isAuthenticated, accessRole }) => {
  const [localSettings, setLocalSettings] = useState<LocalSettings>({
    theme: 'light',
    primaryColor: '#3b82f6',
    language: 'sk',
    compactMode: false,
    animationsEnabled: true,
    autoSave: true
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    ...localSettings,
    notifications: true,
    emailAlerts: false,
    dashboardLayout: 'grid',
    defaultView: 'dashboard'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const predefinedColors = [
    { name: 'Modrá', value: '#3b82f6', class: 'color-blue' },
    { name: 'Zelená', value: '#10b981', class: 'color-green' },
    { name: 'Fialová', value: '#8b5cf6', class: 'color-purple' },
    { name: 'Oranžová', value: '#f59e0b', class: 'color-orange' },
    { name: 'Červená', value: '#ef4444', class: 'color-red' },
    { name: 'Ružová', value: '#ec4899', class: 'color-pink' },
    { name: 'Tyrkysová', value: '#06b6d4', class: 'color-cyan' },
    { name: 'Limetková', value: '#84cc16', class: 'color-lime' }
  ];

  const canManageSystem = accessRole === 'owner' || accessRole === 'superadmin';

  useEffect(() => {
    loadLocalSettings();
    if (isAuthenticated) {
      loadUserSettings();
    }
  }, [isAuthenticated]);

  const loadLocalSettings = () => {
    try {
      const stored = localStorage.getItem('lakovna_local_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocalSettings(prev => ({ ...prev, ...parsed }));
        applyTheme(parsed.theme || 'light');
        applyPrimaryColor(parsed.primaryColor || '#3b82f6');
      }
    } catch (error) {
      logger.error('Failed to load local settings', { error });
    }
  };

  const loadUserSettings = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch('/api/user/settings', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const settings = await response.json();
        setUserSettings(prev => ({ ...prev, ...settings }));
        logger.info('User settings loaded', { settings });
      }
    } catch (error) {
      logger.error('Failed to load user settings', { error });
    }
  };

  const saveLocalSettings = (newSettings: Partial<LocalSettings>) => {
    const updated = { ...localSettings, ...newSettings };
    setLocalSettings(updated);
    localStorage.setItem('lakovna_local_settings', JSON.stringify(updated));
    logger.info('Local settings saved', { settings: updated });
  };

  const syncUserSettings = async (newSettings: Partial<UserSettings>) => {
    if (!isAuthenticated || !userSettings.autoSave) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newSettings)
      });

      if (response.ok) {
        setLastSaved(new Date());
        logger.info('User settings synced', { settings: newSettings });
      }
    } catch (error) {
      logger.error('Failed to sync user settings', { error });
    } finally {
      setIsSaving(false);
    }
  };

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  };

  const applyPrimaryColor = (color: string) => {
    const root = document.documentElement;
    const rgb = hexToRgb(color);
    if (rgb) {
      root.style.setProperty('--color-primary', color);
      root.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const handleThemeChange = (theme: LocalSettings['theme']) => {
    applyTheme(theme);
    saveLocalSettings({ theme });
    if (isAuthenticated) {
      setUserSettings(prev => ({ ...prev, theme }));
      syncUserSettings({ theme });
    }
  };

  const handleColorChange = (color: string) => {
    applyPrimaryColor(color);
    saveLocalSettings({ primaryColor: color });
    if (isAuthenticated) {
      setUserSettings(prev => ({ ...prev, primaryColor: color }));
      syncUserSettings({ primaryColor: color });
    }
  };

  const handleLocalSettingChange = <K extends keyof LocalSettings>(
    key: K, 
    value: LocalSettings[K]
  ) => {
    saveLocalSettings({ [key]: value });
    if (isAuthenticated) {
      const updated = { [key]: value };
      setUserSettings(prev => ({ ...prev, ...updated }));
      syncUserSettings(updated);
    }
  };

  const handleUserSettingChange = <K extends keyof UserSettings>(
    key: K, 
    value: UserSettings[K]
  ) => {
    if (!isAuthenticated) return;
    
    const updated = { [key]: value };
    setUserSettings(prev => ({ ...prev, ...updated }));
    syncUserSettings(updated);
  };

  const resetToDefaults = () => {
    const defaults: LocalSettings = {
      theme: 'light',
      primaryColor: '#3b82f6',
      language: 'sk',
      compactMode: false,
      animationsEnabled: true,
      autoSave: true
    };
    
    saveLocalSettings(defaults);
    applyTheme(defaults.theme);
    applyPrimaryColor(defaults.primaryColor);
    
    if (isAuthenticated) {
      syncUserSettings(defaults);
    }
    
    logger.info('Settings reset to defaults');
  };

  return (
    <div className="settings-tab">
      <div className="settings-header">
        <h2 className="settings-title">Nastavenia</h2>
        {isAuthenticated && (
          <div className="sync-status">
            {isSaving && <span className="saving">Ukladá sa...</span>}
            {lastSaved && !isSaving && (
              <span className="last-saved">
                Uložené {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="settings-content">
        <div className="settings-main">
          {/* Vzhľad */}
          <div className="settings-section">
            <div className="section-header">
              <h3>🎨 Vzhľad a téma</h3>
            </div>
            
            <div className="setting-item">
              <label className="setting-label">Téma</label>
              <div className="theme-selector">
                {(['light', 'dark', 'auto'] as const).map(theme => (
                  <button
                    key={theme}
                    className={`theme-option ${localSettings.theme === theme ? 'active' : ''}`}
                    onClick={() => handleThemeChange(theme)}
                  >
                    {theme === 'light' && '☀️ Svetlá'}
                    {theme === 'dark' && '🌙 Tmavá'}
                    {theme === 'auto' && '🔄 Auto'}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-item">
              <label className="setting-label">Primárna farba</label>
              <div className="color-selector">
                <div className="color-grid">
                  {predefinedColors.map(color => (
                    <button
                      key={color.value}
                      className={`color-option ${localSettings.primaryColor === color.value ? 'active' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleColorChange(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={localSettings.primaryColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="custom-color-picker"
                  title="Vlastná farba"
                />
              </div>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={localSettings.compactMode}
                  onChange={(e) => handleLocalSettingChange('compactMode', e.target.checked)}
                />
                Kompaktný režim
              </label>
            </div>

            <div className="setting-item">
              <label className="setting-label">
                <input
                  type="checkbox"
                  checked={localSettings.animationsEnabled}
                  onChange={(e) => handleLocalSettingChange('animationsEnabled', e.target.checked)}
                />
                Animácie a prechody
              </label>
            </div>
          </div>

          {/* Jazyk a región */}
          <div className="settings-section">
            <div className="section-header">
              <h3>🌍 Jazyk a región</h3>
            </div>
            
            <div className="setting-item">
              <label className="setting-label">Jazyk rozhrania</label>
              <select
                value={localSettings.language}
                onChange={(e) => handleLocalSettingChange('language', e.target.value as LocalSettings['language'])}
                className="setting-select"
              >
                <option value="sk">Slovenčina</option>
                <option value="cs">Čeština</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* User-specific settings */}
          {isAuthenticated && (
            <>
              <div className="settings-section">
                <div className="section-header">
                  <h3>📊 Rozloženie a správanie</h3>
                </div>
                
                <div className="setting-item">
                  <label className="setting-label">Dashboard rozloženie</label>
                  <div className="layout-selector">
                    {(['grid', 'list'] as const).map(layout => (
                      <button
                        key={layout}
                        className={`layout-option ${userSettings.dashboardLayout === layout ? 'active' : ''}`}
                        onClick={() => handleUserSettingChange('dashboardLayout', layout)}
                      >
                        {layout === 'grid' ? '⚏ Grid' : '☰ List'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="setting-item">
                  <label className="setting-label">Predvolená stránka</label>
                  <select
                    value={userSettings.defaultView}
                    onChange={(e) => handleUserSettingChange('defaultView', e.target.value as UserSettings['defaultView'])}
                    className="setting-select"
                  >
                    <option value="dashboard">📊 Dashboard</option>
                    <option value="schema">🏭 Schema</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={userSettings.autoSave}
                      onChange={(e) => handleLocalSettingChange('autoSave', e.target.checked)}
                    />
                    Automatické ukladanie nastavení
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <div className="section-header">
                  <h3>🔔 Notifikácie</h3>
                </div>
                
                <div className="setting-item">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={userSettings.notifications}
                      onChange={(e) => handleUserSettingChange('notifications', e.target.checked)}
                    />
                    Push notifikácie
                  </label>
                </div>

                <div className="setting-item">
                  <label className="setting-label">
                    <input
                      type="checkbox"
                      checked={userSettings.emailAlerts}
                      onChange={(e) => handleUserSettingChange('emailAlerts', e.target.checked)}
                    />
                    Email upozornenia
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="settings-actions">
            <button 
              onClick={resetToDefaults}
              className="reset-btn"
            >
              🔄 Resetovať na predvolené
            </button>
          </div>
        </div>

        <div className="settings-sidebar">
          <div className="info-panel">
            <div className="panel-header">Systémové informácie</div>
            <div className="info-content">
              <div className="info-item">
                <span>Verzia:</span>
                <strong>v2.1.0</strong>
              </div>
              <div className="info-item">
                <span>Režim:</span>
                <strong>{isAuthenticated ? 'Prihlásený' : 'Demo'}</strong>
              </div>
              <div className="info-item">
                <span>Téma:</span>
                <strong>{localSettings.theme}</strong>
              </div>
              <div className="info-item">
                <span>Browser:</span>
                <strong>{navigator.userAgent.split(' ').slice(-1)[0]}</strong>
              </div>
            </div>
          </div>

          {canManageSystem && (
            <div className="admin-panel">
              <div className="panel-header">⚙️ Správca</div>
              <div className="admin-content">
                <div className="admin-item">
                  <span>Global cache:</span>
                  <button className="admin-btn">Vyčistiť</button>
                </div>
                <div className="admin-item">
                  <span>Debug logs:</span>
                  <button className="admin-btn">Export</button>
                </div>
                <div className="admin-item">
                  <span>System restart:</span>
                  <button className="admin-btn danger">Reštart</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="demo-notice">
          <p>💡 V demo režime sa nastavenia ukladajú iba lokálne. Prihlás sa pre synchronizáciu naprieč zariadeniami.</p>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;