'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { UserRole } from '../../lib/types';
import {
  Compass,
  GraduationCap,
  Briefcase,
  Building2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Shield,
  Lock,
} from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const messageParam = searchParams.get('message');
  const callbackUrl = searchParams.get('callbackUrl') || '';

  const [selectedRole, setSelectedRole] = useState<UserRole>('job_seeker');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const roleConfigs: Record<
    UserRole,
    { title: string; subtitle: string; icon: React.ElementType; color: string; badge: string }
  > = {
    college_student: {
      title: 'College Student',
      subtitle: 'Skill Roadmaps & Internships',
      icon: GraduationCap,
      color: 'blue',
      badge: 'Student Portal',
    },
    job_seeker: {
      title: 'Job Seeker',
      subtitle: 'Transparent Matching & Real Resumes',
      icon: Briefcase,
      color: 'emerald',
      badge: 'Featured',
    },
    company_recruiter: {
      title: 'Company Recruiter',
      subtitle: 'Talent Sieve & Spam Filter',
      icon: Building2,
      color: 'purple',
      badge: 'Recruiter Suite',
    },
    admin: {
      title: 'Platform Admin',
      subtitle: 'Operations & Supabase Audit',
      icon: ShieldCheck,
      color: 'amber',
      badge: 'Admin Console',
    },
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const targetUrl = new URL('/api/auth/google', window.location.origin);
    targetUrl.searchParams.set('role', selectedRole);
    if (callbackUrl) {
      targetUrl.searchParams.set('callbackUrl', callbackUrl);
    }
    window.location.href = targetUrl.toString();
  };

  const getErrorMessage = () => {
    if (!errorParam) return null;
    if (errorParam === 'AccessDenied') {
      return {
        title: 'Sign-in Cancelled',
        desc: 'Google authorization was cancelled. You can retry whenever you are ready.',
        type: 'info',
      };
    }
    if (errorParam === 'ConfigurationMissing') {
      return {
        title: 'Google OAuth Setup Required',
        desc:
          messageParam ||
          'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required. Please configure them in your environment variables.',
        type: 'warning',
      };
    }
    if (errorParam === 'InvalidState') {
      return {
        title: 'Session Expired',
        desc: 'Security state verification failed or timed out. Please click Continue with Google to start a fresh login.',
        type: 'warning',
      };
    }
    return {
      title: 'Authentication Error',
      desc: messageParam || 'An error occurred during Google authentication. Please try again.',
      type: 'warning',
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[30rem] h-[20rem] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-[20rem] h-[15rem] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand Card */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1px] shadow-xl shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-indigo-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">CareerPilot</span>
          </Link>

          <div className="pt-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in securely to your CareerPilot workspace
            </p>
          </div>
        </div>

        {/* Error / Alert Banner if redirected from OAuth with error */}
        {errorInfo && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-start gap-3 animate-in fade-in duration-200 ${
              errorInfo.type === 'info'
                ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div className="space-y-0.5">
              <div className="font-bold text-white">{errorInfo.title}</div>
              <p className="text-[11px] leading-relaxed text-slate-300">{errorInfo.desc}</p>
            </div>
          </div>
        )}

        {/* Main Login Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 backdrop-blur-xl shadow-2xl space-y-5">
          {/* Step 1: Select Target Perspective / Role */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Select Your Role</span>
              <span className="text-[10px] text-indigo-400 lowercase font-normal">
                (Tailors your dashboard)
              </span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(roleConfigs) as UserRole[]).map(roleKey => {
                const conf = roleConfigs[roleKey];
                const IconComponent = conf.icon;
                const isSelected = selectedRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setSelectedRole(roleKey)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/80 ring-1 ring-indigo-500/40 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {conf.badge}
                      </span>
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {conf.title}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {conf.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action: Continue with Google */}
          <div className="pt-2 space-y-3">
            <button
              type="button"
              id="google-login-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 transition-all flex items-center justify-center gap-3 shadow-lg shadow-white/5 active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Continue securely with your Google account
            </p>
          </div>

          {/* Privacy & Security Guarantees */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Official Google OAuth 2.0 &bull; OpenID Connect</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              We only request basic profile info (email, name, picture). We never see or store your Google password.
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors inline-flex items-center gap-1">
            <span>&larr; Back to CareerPilot Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-slate-400 text-xs">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-3"></div>
          <span>Loading CareerPilot Login...</span>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
