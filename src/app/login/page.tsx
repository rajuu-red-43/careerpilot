'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserRole } from '../../lib/types';
import { SUPPORTED_LANGUAGES, getLanguage } from '../../i18n/languages';
import { useLanguage } from '../../context/LanguageContext';
import {
  Compass,
  GraduationCap,
  Briefcase,
  Building2,
  ShieldCheck,
  Phone,
  KeyRound,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'college_student';
  const callbackUrl = searchParams.get('callbackUrl') || '';

  const { currentLanguage, setLanguage, t } = useLanguage();

  // Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [selectedLang, setSelectedLang] = useState(currentLanguage.code);
  const [userName, setUserName] = useState('');

  // Flow State
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [demoOtpNotice, setDemoOtpNotice] = useState<string | null>(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

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

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter your mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to send OTP. Please check your number.');
        if (data.cooldownSeconds) setCooldown(data.cooldownSeconds);
      } else {
        setStep('otp');
        setSuccessMsg(data.message || 'OTP sent successfully.');
        setCooldown(data.cooldownSeconds || 60);
        if (data.demoOtp) {
          setDemoOtpNotice(data.demoOtp);
          setOtpCode(data.demoOtp); // Auto-fill for convenience
        }
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: otpCode.trim(),
          role: selectedRole,
          preferredLanguage: selectedLang,
          name: userName.trim() || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Verification failed. Please try again.');
      } else {
        // Update language in context
        if (selectedLang !== currentLanguage.code) {
          await setLanguage(selectedLang);
        }
        setSuccessMsg('Authenticated! Opening your workspace...');
        const destination = callbackUrl || data.redirectUrl || '/student';
        setTimeout(() => {
          router.push(destination);
        }, 300);
      }
    } catch {
      setErrorMsg('Network error during verification.');
    } finally {
      setIsLoading(false);
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
          <h1 className="text-xl font-bold text-white tracking-tight">
            {step === 'phone' ? 'Sign In' : 'Enter OTP'}
          </h1>
          <p className="text-xs text-slate-400">
            {step === 'phone'
              ? 'Enter your mobile number to get started'
              : `Verification code sent to ${phoneNumber}`}
          </p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-200 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="flex-1">{successMsg}</span>
          </div>
        )}

        {demoOtpNotice && step === 'otp' && (
          <div className="p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/30 text-cyan-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Demo OTP: <strong className="font-mono text-white text-sm">{demoOtpNotice}</strong></span>
            </div>
            <span className="text-[10px] text-cyan-300">Auto-filled</span>
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-4">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
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
                <label className="text-[11px] font-semibold text-slate-300">
                  Preferred Language
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

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    id="phone-input"
                    placeholder="9876543210"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  Indian 10-digit mobile number or international with country code.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="send-otp-btn"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* Optional Name for new profiles */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arun Kumar"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* OTP Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">Enter 6-Digit OTP</label>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-[10px] text-indigo-400 hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="otp-input"
                    maxLength={6}
                    placeholder="••••••"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-center text-lg tracking-widest font-mono text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                </div>
              </div>

              {/* Resend Cooldown */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Didn&apos;t receive code?</span>
                {cooldown > 0 ? (
                  <span className="text-slate-400 font-mono">Resend in {cooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={isLoading}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                id="verify-otp-btn"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-2 text-center border-t border-slate-800/80">
            <p className="text-[10px] text-slate-500">
              By continuing, you agree to our Terms of Service. Fast, secure, passwordless authentication.
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
          Loading login...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
