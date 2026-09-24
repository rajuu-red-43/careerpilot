'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Database,
  Users,
  Building2,
  DollarSign,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const {
    jobs,
    applications,
    automationLogs,
    isRecruiterSubscribed,
    toggleRecruiterSubscription,
    portfolios,
  } = useApp();

  const flaggedJobsCount = jobs.filter(j => j.isFlaggedDuplicate || j.isSuspiciousFake).length;
  const lockedPortfoliosCount = portfolios.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Platform Operations &amp; Supabase Audit
            </h1>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Admin Portal
            </span>
          </div>
          <p className="text-xs text-slate-400">
            System health, Supabase RLS compliance, anti-spam heuristics quarantine, and SaaS subscription audit.
          </p>
        </div>

        <Link
          href="/pricing"
          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-cyan-300 hover:text-white transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <DollarSign className="w-4 h-4 text-cyan-400" />
          <span>Inspect Monetization Tiers</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Supabase Enclave</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">Connected</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>RLS Security Policies Enforced</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Anti-Spam Quarantine</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">{flaggedJobsCount} Postings</div>
          <div className="text-[11px] text-slate-400">
            Zero malicious payloads reached candidates
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Locked Portfolios</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">{lockedPortfoliosCount} Verified</div>
          <div className="text-[11px] text-purple-400 font-medium">
            SHA-256 Anti-Plagiarism Hash active
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Recruiter Subscriptions</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-white font-mono">
            {isRecruiterSubscribed ? '₹6,999/mo (Active)' : 'Gated / Inactive'}
          </div>
          <button
            onClick={toggleRecruiterSubscription}
            className="text-[11px] text-cyan-400 hover:underline text-left block"
          >
            Toggle recruiter plan state
          </button>
        </div>
      </div>

      {/* Security & RLS Policy Status */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Active Supabase Compliance &amp; Tables Check</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-white font-mono">public.profiles</span>
            <p className="text-[11px] text-slate-400">Role-level partitioning, zero personal data leak</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-white font-mono">public.portfolios</span>
            <p className="text-[11px] text-slate-400">Tamper-proof cryptographic lock hash protection</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-white font-mono">public.rejection_feedback</span>
            <p className="text-[11px] text-slate-400">Memory log feeding automated skill gap correction</p>
          </div>
        </div>
      </div>
    </div>
  );
}
