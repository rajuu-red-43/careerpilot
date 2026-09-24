'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import {
  Compass,
  GraduationCap,
  Briefcase,
  GitCompare,
  Building2,
  DollarSign,
  BookOpen,
  Cpu,
  HelpCircle,
  Sparkles,
  Globe,
  Settings,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { currentLanguage, setShowOnboardingModal, t } = useLanguage();
  const {
    automationActive,
    setJudgeModeOpen,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                  <Compass className="w-5 h-5 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    CareerPilot
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Open Access
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Transparent AI Career Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Product Navigation Links (Always Public) */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                pathname === '/'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>{t('nav.home', 'Home')}</span>
            </Link>

            <Link
              href="/job-seeker"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                pathname === '/job-seeker'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('nav.jobSeeker', 'Jobs')}</span>
            </Link>

            <Link
              href="/learn"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                pathname === '/learn'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('nav.learn', 'Learn')}</span>
            </Link>

            <Link
              href="/compare"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                pathname === '/compare'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('nav.compare', 'Career Paths')}</span>
            </Link>

            <Link
              href="/internships"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                pathname === '/internships'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('nav.internships', 'Internships')}</span>
            </Link>

            <Link
              href="/student"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                pathname === '/student'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span>Student Hub</span>
            </Link>

            <Link
              href="/recruiter"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                pathname === '/recruiter'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Recruiter Tools</span>
            </Link>

            <Link
              href="/pricing"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                pathname === '/pricing'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('nav.pricing', 'Pricing')}</span>
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Global Language Switcher Chip */}
            <button
              type="button"
              id="navbar-language-btn"
              onClick={() => setShowOnboardingModal(true)}
              title="Change preferred language / भाषा"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 text-slate-200 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-bold text-white">{currentLanguage.nativeName}</span>
              <span className="hidden xl:inline text-slate-400 font-normal text-[11px]">
                ({currentLanguage.englishName})
              </span>
            </button>

            {/* Visitor Settings / Personalization */}
            <Link
              href="/settings"
              id="navbar-settings-btn"
              title={t('common.settings', 'Settings')}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center cursor-pointer ${
                pathname === '/settings'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
            </Link>

            {/* n8n Automation status badge */}
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border ${
                automationActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span className="hidden xl:inline">{t('nav.agentStatus', 'n8n Agent')}:</span>
              <span>{automationActive ? t('common.active', 'Running') : 'Paused'}</span>
            </div>

            {/* Judge Mode Button */}
            <button
              onClick={() => setJudgeModeOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-sm group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">{t('nav.judgeGuide', 'Judge Guide')}</span>
              <HelpCircle className="w-3 h-3 text-amber-400/80" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
