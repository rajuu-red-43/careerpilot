'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserRole } from '../../lib/types';
import { SUPPORTED_LANGUAGES } from '../../i18n/languages';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  GraduationCap,
  Briefcase,
  Building2,
  ShieldCheck,
  ArrowRight,
  Globe,
  Sparkles,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'college_student';
  const callbackUrl = searchParams.get('callbackUrl') || '';

  const { currentLanguage, setLanguage } = useLanguage();
  const { login } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [selectedLang, setSelectedLang] = useState(currentLanguage.code);
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleConfigs: Record<
    UserRole,
    { title: string; subtitle: string; icon: React.ElementType }
  > = {
    college_student: {
      title: 'College Student',
      subtitle: 'Learn skills & match jobs',
      icon: GraduationCap,
    },
    job_seeker: {
      title: 'Job Seeker',
      subtitle: 'Transparent skill matching',
      icon: Briefcase,
    },
    company_recruiter: {
      title: 'Recruiter',
      subtitle: 'Verified candidate pipelines',
      icon: Building2,
    },
    admin: {
      title: 'Admin',
      subtitle: 'Manage curriculum & paths',
      icon: ShieldCheck,
    },
  };

  const getDashboardHref = (r: UserRole): string => {
    if (r === 'college_student') return '/student';
    if (r === 'company_recruiter') return '/recruiter';
    if (r === 'admin') return '/admin';
    return '/job-seeker';
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalName = userName.trim() || roleConfigs[selectedRole].title;

      // 1. Establish server-side session
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          name: finalName,
          preferredLanguage: selectedLang,
        }),
      });

      // 2. Sync client context
      if (login) {
        login(finalName, selectedRole);
      }

      // 3. Sync language
      if (selectedLang !== currentLanguage.code) {
        await setLanguage(selectedLang);
      }

      const destination = callbackUrl || getDashboardHref(selectedRole);
      router.push(destination);
    } catch {
      const destination = callbackUrl || getDashboardHref(selectedRole);
      router.push(destination);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-10 relative">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Compass className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">CareerPilot</span>
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">Choose Your Portal</h1>
          <p className="text-xs text-slate-400">
            Select your workspace portal and preferred language to continue.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-5">
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(roleConfigs) as UserRole[]).map(r => {
                  const conf = roleConfigs[r];
                  const Icon = conf.icon;
                  const isSelected = selectedRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{conf.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{conf.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>Preferred Language</span>
              </label>
              <select
                value={selectedLang}
                onChange={e => setSelectedLang(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.nativeName} ({lang.englishName})
                  </option>
                ))}
              </select>
            </div>

            {/* Name Input (Optional) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">
                Your Name <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Arun Kumar"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Enter Portal Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <span>{isSubmitting ? 'Entering Workspace...' : 'Enter Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800/80">
            <p className="text-[10px] text-slate-500">
              CareerPilot v2 • Transparent AI career platform for students and job seekers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-400 text-xs">
          Loading portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
