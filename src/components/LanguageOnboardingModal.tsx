'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageMeta } from '../i18n/languages';
import {
  Globe,
  Search,
  Check,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';

export default function LanguageOnboardingModal() {
  const {
    currentLanguage,
    setLanguage,
    availableLanguages,
    showOnboardingModal,
    setShowOnboardingModal,
    t,
  } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState<string>(currentLanguage.code || 'en');
  const [isSaving, setIsSaving] = useState(false);

  // Filter languages by search query across englishName, nativeName, and script
  const filteredLanguages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return availableLanguages;
    return availableLanguages.filter(
      l =>
        l.englishName.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        l.script.toLowerCase().includes(q)
    );
  }, [availableLanguages, searchQuery]);

  const popularList = useMemo(
    () => filteredLanguages.filter(l => l.isPopular),
    [filteredLanguages]
  );
  const otherList = useMemo(
    () => filteredLanguages.filter(l => !l.isPopular),
    [filteredLanguages]
  );

  if (!showOnboardingModal) return null;

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      await setLanguage(selectedCode);
      setShowOnboardingModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    setIsSaving(true);
    try {
      await setLanguage('en');
      setShowOnboardingModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedMeta = availableLanguages.find(l => l.code === selectedCode) || currentLanguage;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl shadow-indigo-500/10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Globe className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h2
                  id="language-modal-title"
                  className="text-lg sm:text-xl font-bold text-white flex items-center gap-2"
                >
                  <span>{t('onboarding.chooseLanguageTitle', 'Choose your preferred language')}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                    23+ Languages
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {t(
                    'onboarding.chooseLanguageSubtitle',
                    'Select your language for the interface and AI career assistance. You can change this anytime in Settings.'
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowOnboardingModal(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label={t('common.close', 'Close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t(
                'onboarding.searchPlaceholder',
                'Search by language or script (e.g. தமிழ், Hindi, বাংলা)...'
              )}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Language Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Popular Languages */}
          {popularList.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('onboarding.popularLanguages', 'Popular Languages')}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {popularList.map(lang => (
                  <LanguageCard
                    key={lang.code}
                    lang={lang}
                    isSelected={selectedCode === lang.code}
                    onSelect={() => setSelectedCode(lang.code)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Regional / Official Languages */}
          {otherList.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {t('onboarding.allLanguages', 'All Official & Regional Languages')}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {otherList.map(lang => (
                  <LanguageCard
                    key={lang.code}
                    lang={lang}
                    isSelected={selectedCode === lang.code}
                    onSelect={() => setSelectedCode(lang.code)}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredLanguages.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-sm">
              No language found matching &quot;{searchQuery}&quot;. Please try another keyword or script.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSaving}
            className="w-full sm:w-auto text-xs text-slate-400 hover:text-slate-200 transition-colors py-2 px-3 cursor-pointer"
          >
            {t('onboarding.skipToEnglish', 'Skip (Continue in English)')}
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSaving}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <span>
                {t('onboarding.continueWithSelection', 'Continue in')}{' '}
                <strong className="underline underline-offset-2">
                  {selectedMeta.nativeName} ({selectedMeta.englishName})
                </strong>
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LanguageCard({
  lang,
  isSelected,
  onSelect,
}: {
  lang: LanguageMeta;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50 shadow-md shadow-indigo-500/10'
          : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
      }`}
    >
      <div className="flex items-center justify-between gap-1 w-full">
        <span className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
          {lang.nativeName}
        </span>
        {isSelected ? (
          <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
            <Check className="w-2.5 h-2.5" />
          </div>
        ) : (
          <span className="text-[10px] text-slate-500 font-mono uppercase">{lang.code}</span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 w-full text-[11px] text-slate-400">
        <span>{lang.englishName}</span>
        <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
          {lang.direction === 'rtl' ? 'RTL' : lang.script}
        </span>
      </div>
    </button>
  );
}
