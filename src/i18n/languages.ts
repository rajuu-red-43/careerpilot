/**
 * Centralized Language Registry for CareerPilot v2
 * Comprehensive support for English and official Eighth Schedule / Indian languages.
 */

export interface LanguageMeta {
  code: string;
  nativeName: string;
  englishName: string;
  script: string;
  direction: 'ltr' | 'rtl';
  isPopular?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    script: 'Latin',
    direction: 'ltr',
    isPopular: true,
  },
  {
    code: 'hi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    script: 'Devanagari',
    direction: 'ltr',
    isPopular: true,
  },
  {
    code: 'ta',
    nativeName: 'தமிழ்',
    englishName: 'Tamil',
    script: 'Tamil',
    direction: 'ltr',
    isPopular: true,
  },
  {
    code: 'te',
    nativeName: 'తెలుగు',
    englishName: 'Telugu',
    script: 'Telugu',
    direction: 'ltr',
    isPopular: true,
  },
  {
    code: 'bn',
    nativeName: 'বাংলা',
    englishName: 'Bengali',
    script: 'Bengali',
    direction: 'ltr',
    isPopular: true,
  },
  {
    code: 'mr',
    nativeName: 'मराठी',
    englishName: 'Marathi',
    script: 'Devanagari',
    direction: 'ltr',
    isPopular: true,
  },
  {
    code: 'gu',
    nativeName: 'ગુજરાતી',
    englishName: 'Gujarati',
    script: 'Gujarati',
    direction: 'ltr',
    isPopular: true,
  },
  {
    code: 'kn',
    nativeName: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    script: 'Kannada',
    direction: 'ltr',
    isPopular: true,
  },
  {
    code: 'ml',
    nativeName: 'മലയാളം',
    englishName: 'Malayalam',
    script: 'Malayalam',
    direction: 'ltr',
    isPopular: true,
  },
  {
    code: 'ur',
    nativeName: 'اردو',
    englishName: 'Urdu',
    script: 'Perso-Arabic',
    direction: 'rtl',
    isPopular: true,
  },
  {
    code: 'pa',
    nativeName: 'ਪੰਜਾਬੀ',
    englishName: 'Punjabi',
    script: 'Gurmukhi',
    direction: 'ltr',
    isPopular: true,
  },
  {
    code: 'or',
    nativeName: 'ଓଡ଼ିଆ',
    englishName: 'Odia',
    script: 'Odia',
    direction: 'ltr',
  },
  {
    code: 'as',
    nativeName: 'অসমীয়া',
    englishName: 'Assamese',
    script: 'Bengali-Assamese',
    direction: 'ltr',
  },
  {
    code: 'sa',
    nativeName: 'संस्कृतम्',
    englishName: 'Sanskrit',
    script: 'Devanagari',
    direction: 'ltr',
  },
  {
    code: 'ne',
    nativeName: 'नेपाली',
    englishName: 'Nepali',
    script: 'Devanagari',
    direction: 'ltr',
  },
  {
    code: 'kok',
    nativeName: 'कोंकणी',
    englishName: 'Konkani',
    script: 'Devanagari',
    direction: 'ltr',
  },
  {
    code: 'mai',
    nativeName: 'मैथिली',
    englishName: 'Maithili',
    script: 'Devanagari',
    direction: 'ltr',
  },
  {
    code: 'mni',
    nativeName: 'মৈতৈলোন্',
    englishName: 'Manipuri',
    script: 'Bengali / Meitei Mayek',
    direction: 'ltr',
  },
  {
    code: 'brx',
    nativeName: 'बड़ो',
    englishName: 'Bodo',
    script: 'Devanagari',
    direction: 'ltr',
  },
  {
    code: 'doi',
    nativeName: 'डोगरी',
    englishName: 'Dogri',
    script: 'Devanagari',
    direction: 'ltr',
  },
  {
    code: 'ks',
    nativeName: 'کٲشُر',
    englishName: 'Kashmiri',
    script: 'Perso-Arabic',
    direction: 'rtl',
  },
  {
    code: 'sat',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    englishName: 'Santali',
    script: 'Ol Chiki',
    direction: 'ltr',
  },
  {
    code: 'sd',
    nativeName: 'سنڌي',
    englishName: 'Sindhi',
    script: 'Perso-Arabic',
    direction: 'rtl',
  },
];

export const DEFAULT_LANGUAGE: LanguageMeta = SUPPORTED_LANGUAGES[0]; // English

export const LANGUAGE_MAP: Record<string, LanguageMeta> = SUPPORTED_LANGUAGES.reduce(
  (acc, lang) => {
    acc[lang.code] = lang;
    return acc;
  },
  {} as Record<string, LanguageMeta>
);

export function getLanguage(code?: string | null): LanguageMeta {
  if (!code) return DEFAULT_LANGUAGE;
  return LANGUAGE_MAP[code.toLowerCase()] || DEFAULT_LANGUAGE;
}

export function isSupportedLanguage(code: string): boolean {
  return Boolean(LANGUAGE_MAP[code.toLowerCase()]);
}

export function isRtlLanguage(code: string): boolean {
  return getLanguage(code).direction === 'rtl';
}
