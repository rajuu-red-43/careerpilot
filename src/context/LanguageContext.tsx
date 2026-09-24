'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  LanguageMeta,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  getLanguage,
  isSupportedLanguage,
} from '../i18n/languages';
import { translateKey } from '../i18n/config';

interface LanguageContextType {
  currentLanguage: LanguageMeta;
  setLanguage: (code: string) => Promise<void>;
  t: (keyPath: string, defaultValue?: string) => string;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  availableLanguages: LanguageMeta[];
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageMeta>(DEFAULT_LANGUAGE);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync document direction and lang attribute whenever language changes
  const applyHtmlAttributes = useCallback((lang: LanguageMeta) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang.code;
      document.documentElement.dir = lang.direction;
      if (lang.direction === 'rtl') {
        document.documentElement.classList.add('rtl-layout');
      } else {
        document.documentElement.classList.remove('rtl-layout');
      }
    }
  }, []);

  // Hydrate language on mount: check localStorage, then sync with server session
  useEffect(() => {
    let active = true;

    async function hydrateLanguage() {
      // 1. Instant client-side hydration from localStorage cache
      try {
        const cached = localStorage.getItem('careerpilot_language');
        if (cached && isSupportedLanguage(cached) && active) {
          const meta = getLanguage(cached);
          setCurrentLanguageState(meta);
          applyHtmlAttributes(meta);
        }
      } catch {
        // ignore localStorage access issues
      }

      // 2. Fetch language preference from server-side cookie
      try {
        const res = await fetch('/api/user/preferences');
        if (res.ok) {
          const data = await res.json();
          if (data && data.preferredLanguage && active) {
            const serverMeta = getLanguage(data.preferredLanguage);
            setCurrentLanguageState(serverMeta);
            applyHtmlAttributes(serverMeta);
            try {
              localStorage.setItem('careerpilot_language', serverMeta.code);
            } catch {}
          }
        }
      } catch {
        // If offline, keep cached or default
      }
    }

    hydrateLanguage();

    return () => {
      active = false;
    };
  }, [applyHtmlAttributes]);

  // Set language and persist across browser cookie and local storage
  const setLanguage = useCallback(
    async (code: string) => {
      const cleanCode = code.trim().toLowerCase();
      if (!isSupportedLanguage(cleanCode)) return;

      const newMeta = getLanguage(cleanCode);
      setCurrentLanguageState(newMeta);
      applyHtmlAttributes(newMeta);

      // Cache locally
      try {
        localStorage.setItem('careerpilot_language', cleanCode);
      } catch {}

      // Persist to visitor preferences cookie
      setIsLoading(true);
      try {
        await fetch('/api/user/preferences', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferredLanguage: cleanCode }),
        });
      } catch (err) {
        console.warn('Could not persist language to server:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [applyHtmlAttributes]
  );

  // Translation function t(key, defaultValue)
  const t = useCallback(
    (keyPath: string, defaultValue?: string): string => {
      return translateKey(currentLanguage.code, keyPath, defaultValue);
    },
    [currentLanguage.code]
  );

  const dir = currentLanguage.direction;
  const isRtl = dir === 'rtl';

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        dir,
        isRtl,
        availableLanguages: SUPPORTED_LANGUAGES,
        showOnboardingModal,
        setShowOnboardingModal,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, currentLanguage, dir, isRtl } = useLanguage();
  return { t, currentLanguage, dir, isRtl };
}
