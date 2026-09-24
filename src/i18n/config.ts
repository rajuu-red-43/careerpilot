import { en, TranslationKeys } from './translations/en';
import { hi } from './translations/hi';
import { ta } from './translations/ta';
import { te } from './translations/te';
import { bn } from './translations/bn';
import { mr } from './translations/mr';
import { gu } from './translations/gu';
import { kn } from './translations/kn';
import { ml } from './translations/ml';
import { ur } from './translations/ur';
import { pa } from './translations/pa';
import { DEFAULT_LANGUAGE, getLanguage, isRtlLanguage, LanguageMeta } from './languages';

export const TRANSLATIONS: Record<string, TranslationKeys> = {
  en,
  hi,
  ta,
  te,
  bn,
  mr,
  gu,
  kn,
  ml,
  ur,
  pa,
};

/**
 * Resolves a nested translation key such as "nav.home" or "settings.preferredLanguage".
 * Falls back to English if the key is missing in the target language.
 */
export function translateKey(langCode: string, keyPath: string, defaultValue?: string): string {
  const primaryLang = langCode.toLowerCase();
  const targetDict = TRANSLATIONS[primaryLang] || TRANSLATIONS['en'];
  const fallbackDict = TRANSLATIONS['en'];

  const keys = keyPath.split('.');
  
  // Try target language dictionary
  let current: any = targetDict;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      current = undefined;
      break;
    }
  }

  if (typeof current === 'string') {
    return current;
  }

  // Fallback to English dictionary
  let fallback: any = fallbackDict;
  for (const k of keys) {
    if (fallback && typeof fallback === 'object' && k in fallback) {
      fallback = fallback[k];
    } else {
      fallback = undefined;
      break;
    }
  }

  if (typeof fallback === 'string') {
    return fallback;
  }

  return defaultValue || keyPath;
}

export { DEFAULT_LANGUAGE, getLanguage, isRtlLanguage };
export type { LanguageMeta };
