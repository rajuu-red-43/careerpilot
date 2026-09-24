'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Check,
  ShieldCheck,
  User,
  ArrowLeft,
  Sparkles,
  Lock,
  Layers,
  Cpu,
} from 'lucide-react';

export default function SettingsPage() {
  const { currentLanguage, setLanguage, availableLanguages, setShowOnboardingModal, t, isRtl } =
    useLanguage();
  const { userName, role, profile } = useApp();

  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const handleSelectLanguage = async (code: string) => {
    setSavingCode(code);
    await setLanguage(code);
    setSavingCode(null);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb & Return to Dashboard */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back', 'Back')}</span>
        </Link>

        {successToast && (
          <div className="animate-fadeIn inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('settings.languageUpdatedSuccess', 'Preferred language updated successfully!')}</span>
          </div>
        )}
      </div>

      {/* Page Header */}
      <div className="mb-8 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{t('settings.title', 'Platform Settings')}</span>
              <span className="text-sm font-normal text-slate-400 font-mono">/ भाषा</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {t(
                'settings.subtitle',
                'Manage your global preferences, language, and account configuration.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-400" />
              <span>{t('settings.activeSession', 'Active Google Session')}</span>
            </h3>

            <div className="flex items-center gap-3">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={userName || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-lg">
                  {(userName || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white truncate">{userName || 'Authenticated User'}</span>
                <span className="text-xs text-slate-400 truncate">{profile?.email || 'google-user@domain.com'}</span>
                <span className="text-[10px] text-indigo-400 font-mono uppercase mt-0.5">Role: {role}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between items-center">
                <span>{t('settings.currentLanguageLabel', 'Active Interface Language')}:</span>
                <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {currentLanguage.nativeName} ({currentLanguage.englishName})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Direction:</span>
                <span className="font-mono text-slate-300 uppercase">{currentLanguage.direction}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Script:</span>
                <span className="text-slate-300">{currentLanguage.script}</span>
              </div>
            </div>
          </div>

          {/* Security & Token Banner */}
          <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs mb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>{t('settings.securitySection', 'Security & Session')}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                'settings.securityDesc',
                'Your session is encrypted via server-side HttpOnly cookies with PKCE verification.'
              )}
            </p>
          </div>
        </div>

        {/* Right Column: Preferred Language Grid & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <span>{t('settings.preferredLanguage', 'Preferred Language')}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {t(
                    'settings.preferredLanguageDesc',
                    'The entire application UI and AI recommendations will be presented in this language.'
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowOnboardingModal(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t('settings.changeLanguageBtn', 'Change Language')}</span>
              </button>
            </div>

            {/* Language Selection Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availableLanguages.map(lang => {
                const isSelected = currentLanguage.code === lang.code;
                const isSavingThis = savingCode === lang.code;

                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    disabled={isSelected || Boolean(savingCode)}
                    className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/60 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="text-base font-bold text-white leading-tight">
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

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/80 w-full text-[11px] text-slate-400">
                      <span>{lang.englishName}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                        {lang.direction === 'rtl' ? 'RTL' : lang.script}
                      </span>
                    </div>

                    {isSavingThis && (
                      <div className="absolute inset-0 bg-slate-950/80 rounded-xl flex items-center justify-center text-xs text-indigo-400 font-medium">
                        Updating...
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* AI Career Assistant Guidance note */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-200">AI Prompt Ingestion:</strong> Your selected language is automatically injected into all transparent AI evaluation models, skill roadmaps, and pitch scoring. Universal technical keywords (such as Python, React, Next.js, and SQL) remain preserved for clarity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
