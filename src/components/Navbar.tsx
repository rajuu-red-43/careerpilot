'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  LogOut,
  LogIn,
  Layers,
  CheckSquare,
  Target,
  PlusCircle,
  Users,
  DollarSign,
  BookOpen,
  ShieldAlert,
  Clock,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role,
    isLoggedIn,
    userName,
    isHydrated,
    logout,
    selectedCompareJobIds,
    applications,
    automationActive,
    setJudgeModeOpen,
    isRecruiterSubscribed,
    seekerTrialDaysLeft,
  } = useApp();

  const pendingApprovalsCount = applications.filter(a => a.status === 'Pending Approval').length;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getRoleConfig = () => {
    if (role === 'college_student') {
      return {
        label: 'Student',
        fullName: 'College Student',
        gradient: 'from-blue-600 to-indigo-600',
        badgeBorder: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
        icon: GraduationCap,
        dashboardHref: '/student',
      };
    }
    if (role === 'company_recruiter') {
      return {
        label: 'Recruiter',
        fullName: 'Company Recruiter',
        gradient: 'from-purple-600 to-pink-600',
        badgeBorder: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
        icon: Building2,
        dashboardHref: '/recruiter',
      };
    }
    if (role === 'admin') {
      return {
        label: 'Admin',
        fullName: 'System Admin',
        gradient: 'from-amber-600 to-red-600',
        badgeBorder: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
        icon: ShieldAlert,
        dashboardHref: '/admin',
      };
    }
    return {
      label: 'Job Seeker',
      fullName: 'Job Seeker',
      gradient: 'from-emerald-600 to-teal-600',
      badgeBorder: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      icon: Briefcase,
      dashboardHref: '/job-seeker',
    };
  };

  const roleConfig = getRoleConfig();
  const RoleIcon = roleConfig.icon;

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
                    v2 SaaS
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Transparent AI Job Agent
                </span>
              </div>
            </Link>
          </div>

          {/* Role-Specific Navigation Links */}
          {isHydrated && isLoggedIn ? (
            <nav className="hidden md:flex items-center gap-1.5">
              {/* STUDENT Role Navigation */}
              {role === 'college_student' && (
                <>
                  <Link
                    href="/student"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      pathname === '/student'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/student#skill-roadmap"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 flex items-center gap-1.5 transition-all"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Skill Roadmap</span>
                  </Link>

                  <Link
                    href="/student#career-path"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 flex items-center gap-1.5 transition-all"
                  >
                    <Target className="w-3.5 h-3.5 text-purple-400" />
                    <span>Career Path</span>
                  </Link>

                  <Link
                    href="/internships"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      pathname === '/internships'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Internships</span>
                  </Link>
                </>
              )}

              {/* JOB SEEKER Role Navigation */}
              {role === 'job_seeker' && (
                <>
                  <Link
                    href="/job-seeker"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      pathname === '/job-seeker'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/compare"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      pathname === '/compare'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Compare</span>
                    {selectedCompareJobIds.length > 0 && (
                      <span className="w-4 h-4 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center">
                        {selectedCompareJobIds.length}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/applications"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      pathname === '/applications'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Applications</span>
                    {pendingApprovalsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                        {pendingApprovalsCount} Checkpoint
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/internships"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      pathname === '/internships'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Internships</span>
                  </Link>
                </>
              )}

              {/* COMPANY RECRUITER Role Navigation */}
              {role === 'company_recruiter' && (
                <>
                  <Link
                    href="/recruiter"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      pathname === '/recruiter'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/recruiter#post-job"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 flex items-center gap-1.5 transition-all"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Post a Job</span>
                  </Link>

                  <Link
                    href="/recruiter#applicant-pipeline"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 flex items-center gap-1.5 transition-all"
                  >
                    <Users className="w-3.5 h-3.5 text-pink-400" />
                    <span>Applicant Pipeline</span>
                  </Link>
                </>
              )}

              {/* ADMIN Role Navigation */}
              {role === 'admin' && (
                <>
                  <Link
                    href="/admin"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      pathname === '/admin'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Operations Audit</span>
                  </Link>
                </>
              )}

              {/* Pricing Link (Available for all roles) */}
              <Link
                href="/pricing"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  pathname === '/pricing'
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pricing</span>
              </Link>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 font-medium">
              <Link href="/pricing" className="text-slate-400 hover:text-cyan-300 transition-colors">
                Pricing &amp; Plans
              </Link>
              <span>&bull;</span>
              <Link href="/internships" className="text-slate-400 hover:text-cyan-300 transition-colors">
                Upskilling Board
              </Link>
            </div>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {isHydrated && isLoggedIn ? (
              <>
                {/* User Identity Chip */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
                  <div
                    className={`w-6 h-6 rounded-lg bg-gradient-to-r ${roleConfig.gradient} flex items-center justify-center text-white shadow-sm`}
                  >
                    <RoleIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white max-w-[110px] truncate leading-tight">
                      {userName || roleConfig.fullName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium leading-none">
                      {roleConfig.label}
                    </span>
                  </div>
                </div>

                {/* Role Specific Status Pill */}
                {role === 'job_seeker' && (
                  <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 font-mono">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>Trial: {seekerTrialDaysLeft}d</span>
                  </div>
                )}

                {role === 'company_recruiter' && (
                  <div className={`hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-mono ${
                    isRecruiterSubscribed
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}>
                    <span>{isRecruiterSubscribed ? 'Growth: Active' : 'Plan Inactive'}</span>
                  </div>
                )}

                {role === 'college_student' && (
                  <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300 font-mono">
                    <span>Free Edu License</span>
                  </div>
                )}

                {/* Logout / Switch Role Button */}
                <button
                  onClick={handleLogout}
                  id="logout-switch-role-btn"
                  title="Sign out and return to role selection"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Logout / Switch Role</span>
                  <span className="sm:hidden">Logout</span>
                </button>
              </>
            ) : (
              /* Not logged in: Show "Sign In" button */
              <div className="flex items-center gap-2">
                <Link
                  href="/pricing"
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
                >
                  <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pricing</span>
                </Link>
                <Link
                  href="/#role-gateways"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20 active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            )}

            {/* n8n Automation status badge */}
            <div
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border ${
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-sm group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Judge Guide</span>
              <HelpCircle className="w-3 h-3 text-amber-400/80" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
