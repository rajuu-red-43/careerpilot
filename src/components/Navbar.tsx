'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import {
  Compass,
  GraduationCap,
  Briefcase,
  Building2,
  GitCompare,
  FileCheck2,
  Cpu,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const {
    role,
    setRole,
    selectedCompareJobIds,
    applications,
    automationActive,
    setJudgeModeOpen,
  } = useApp();

  const pendingApprovalsCount = applications.filter(a => a.status === 'Pending Approval').length;

  const getDashboardHref = () => {
    if (role === 'college_student') return '/student';
    if (role === 'company_recruiter') return '/recruiter';
    return '/job-seeker';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
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
                    AA-35
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Transparent AI Job Agent
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href={getDashboardHref()}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                pathname === '/student' || pathname === '/job-seeker' || pathname === '/recruiter'
                  ? 'bg-slate-800/80 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/compare"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                pathname === '/compare'
                  ? 'bg-slate-800/80 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <GitCompare className="w-4 h-4 text-cyan-400" />
              <span>Compare</span>
              {selectedCompareJobIds.length > 0 && (
                <span className="w-5 h-5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
                  {selectedCompareJobIds.length}
                </span>
              )}
            </Link>

            <Link
              href="/applications"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                pathname === '/applications'
                  ? 'bg-slate-800/80 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Applications</span>
              {pendingApprovalsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  {pendingApprovalsCount} Checkpoint
                </span>
              )}
            </Link>
          </nav>

          {/* Right Action Bar: Quick Role Switcher + Judge Mode Pill */}
          <div className="flex items-center gap-2">
            {/* Quick Role Switcher */}
            <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center shadow-inner">
              <button
                onClick={() => setRole('college_student')}
                title="Student Mode"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  role === 'college_student'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Student</span>
              </button>

              <button
                onClick={() => setRole('job_seeker')}
                title="Job Seeker Mode"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  role === 'job_seeker'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Seeker</span>
              </button>

              <button
                onClick={() => setRole('company_recruiter')}
                title="Recruiter Mode"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  role === 'company_recruiter'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Recruiter</span>
              </button>
            </div>

            {/* n8n Automation status badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                automationActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span className="hidden xl:inline">n8n Agent:</span>
              <span>{automationActive ? 'Running' : 'Paused'}</span>
            </div>

            {/* Judge Mode Button */}
            <button
              onClick={() => setJudgeModeOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-sm group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Judge Guide</span>
              <HelpCircle className="w-3 h-3 text-amber-400/80" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
