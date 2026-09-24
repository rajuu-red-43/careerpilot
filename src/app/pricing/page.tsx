'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Briefcase,
  Building2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function PricingPage() {
  const { isRecruiterSubscribed, toggleRecruiterSubscription, seekerTrialDaysLeft } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Transparent Pricing &bull; Student-First License</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Fair, Predictable SaaS Pricing.
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Free for Students Forever.
          </span>
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed">
          Zero surprise charges. Students never pay a single rupee. Job seekers get a generous 3-month free trial. Recruiters invest in high-signal, zero-spam candidate sieving.
        </p>

        {/* Demo Subscribed Toggle Switch */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-lg">
            <span className="font-semibold text-slate-400">Recruiter Live Demo Switch:</span>
            <button
              onClick={toggleRecruiterSubscription}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                isRecruiterSubscribed
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-rose-600/80 text-white'
              }`}
            >
              {isRecruiterSubscribed ? (
                <>
                  <ToggleRight className="w-4 h-4 text-emerald-200" />
                  <span>Subscribed (Active)</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-rose-200" />
                  <span>Unsubscribed (Gated)</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              (Toggle to test recruiter feature access live)
            </span>
          </div>
        </div>
      </div>

      {/* 3 Tier Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Tier 1: College Students (Permanently Free) */}
        <div className="group relative rounded-3xl border-2 border-blue-500/40 bg-slate-900/80 p-6 sm:p-7 backdrop-blur hover:border-blue-400 transition-all duration-300 shadow-xl flex flex-col justify-between">
          <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            100% Free Forever
          </div>

          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">College Students</h2>
              <p className="text-xs text-slate-400 mt-1">
                Permanent free educational license. Verified with any .edu or college enrollment.
              </p>
            </div>

            <div className="space-y-1 py-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white font-mono">₹0</span>
                <span className="text-xs text-slate-400">/ forever</span>
              </div>
              <div className="text-[11px] text-blue-400 font-medium">
                No credit card required &bull; No paywall ever
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Multi-Year Academic Skill Roadmaps (1st - 4th yr)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>2024-2028 Tech Demand Predictions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Skill Gap Detector linked to Free Courses</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Lockable Authentic Portfolio (Anti-Plagiarism)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>60-Second Project Pitch AI Challenge</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <Link
              href="/student"
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-500/20 text-center flex items-center justify-center gap-1.5"
            >
              <span>Access Student Portal (Free)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tier 2: Job Seekers (3-Month Free Trial, then paid) */}
        <div className="group relative rounded-3xl border-2 border-emerald-500/50 bg-slate-900/90 p-6 sm:p-7 backdrop-blur hover:border-emerald-400 transition-all duration-300 shadow-2xl shadow-emerald-500/10 flex flex-col justify-between">
          <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            Most Popular
          </div>

          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">Job Seekers</h2>
              <p className="text-xs text-slate-400 mt-1">
                Full autonomous AI job-search agent for career professionals and job changers.
              </p>
            </div>

            <div className="space-y-1 py-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white font-mono">₹499</span>
                <span className="text-xs text-slate-400">/ month (after trial)</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>3-Month Free Trial ({seekerTrialDaysLeft} days remaining)</span>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real PDF &amp; DOCX Resume File Parser</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Interview Readiness Score &amp; 60s Pitch Coach</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Application Priority Queue (High / Med / Low)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Salary &amp; Market Benchmark + Scam Detector</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mandatory Human Approval Gate &amp; Feedback Memory</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <Link
              href="/job-seeker"
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-lg shadow-emerald-500/20 text-center flex items-center justify-center gap-1.5"
            >
              <span>Start 3-Month Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tier 3: Recruiters & Companies (Paid Subscription) */}
        <div className="group relative rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 backdrop-blur hover:border-purple-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">Companies &amp; Recruiters</h2>
              <p className="text-xs text-slate-400 mt-1">
                Zero-spam candidate intelligence with transparent deterministic ranking.
              </p>
            </div>

            <div className="space-y-1 py-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white font-mono">₹6,999</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <div className="text-[11px] text-purple-400 font-medium">
                Growth Plan &bull; Starter from ₹2,499 &bull; Enterprise custom
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Duplicate &amp; Fake Job Scam Quarantine</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Recruiter Spam Filter (Quarantines Low-Fit Apps)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Auditable Transparency Panel (Formula Breakdown)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Locked Authentic Portfolio Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Unlimited Job Postings &amp; Ranked Pipeline</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <Link
              href="/recruiter"
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-500/20 text-center flex items-center justify-center gap-1.5"
            >
              <span>{isRecruiterSubscribed ? 'Open Recruiter Dashboard ➔' : 'Activate Recruiter Plan'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Compliance & FAQ Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Fair AI Guarantee &bull; Problem Statement AA-35 Compliance</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          CareerPilot is built on the anti-displacement principle: our agent empowers human judgment and saves time, but never makes unilateral hiring decisions. Applications are never automatically dispatched without human approval. All applicant data is processed within your personal secure session with zero external cloud leakage.
        </p>
      </div>
    </div>
  );
}
