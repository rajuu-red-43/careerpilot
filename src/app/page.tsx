'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { UserRole } from '../lib/types';
import {
  Compass,
  GraduationCap,
  Briefcase,
  Building2,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  GitCompare,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  User,
  LogOut,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const { role, userName, isLoggedIn, isHydrated, login, logout, showToast } = useApp();
  const router = useRouter();

  // Login form state
  const [selectedRole, setSelectedRole] = useState<UserRole>(role || 'job_seeker');
  const [enteredName, setEnteredName] = useState<string>('');

  // Default suggested names per role
  const rolePresets: Record<UserRole, { defaultName: string; title: string; subtitle: string; icon: React.ElementType; color: string; badge: string; description: string; highlights: string[] }> = {
    college_student: {
      defaultName: 'Alex Patel',
      title: 'College Student',
      subtitle: 'Learn & Plan',
      icon: GraduationCap,
      color: 'blue',
      badge: 'Student Portal',
      description: 'Explore multi-year roadmaps (1st to 4th year), tech demand predictions, and interactive skill gap detectors.',
      highlights: [
        'Domain Roadmaps (AI, Web, DevOps, Core)',
        '2024–2028 Tech Demand Projections',
        'Actionable Skill Gap Checklists',
      ],
    },
    job_seeker: {
      defaultName: 'Sarah Chen',
      title: 'Job Seeker',
      subtitle: 'Match & Apply',
      icon: Briefcase,
      color: 'emerald',
      badge: 'Featured Mode',
      description: 'Upload real resumes (PDF/DOCX), inspect transparent fit scoring formulas, view tailored diffs, and approve before submit.',
      highlights: [
        'Real PDF / DOCX Resume File Parser',
        'Explainable "Why This Score" Formulas',
        'Mandatory Human Sign-off Checkpoint',
      ],
    },
    company_recruiter: {
      defaultName: 'Marcus Vance',
      title: 'Company Recruiter',
      subtitle: 'Sieve & Hire',
      icon: Building2,
      color: 'purple',
      badge: 'Recruiter Portal',
      description: 'Post jobs with duplicate/fake detection heuristics, and inspect transparent candidate fit vectors without spam.',
      highlights: [
        'Duplicate & Fake Job Heuristics Detector',
        'High-Fit Ranked Candidate Pipeline',
        'Auditable Transparency Panel',
      ],
    },
    admin: {
      defaultName: 'Alexa Reynolds',
      title: 'Platform Admin',
      subtitle: 'Audit & Govern',
      icon: ShieldCheck,
      color: 'amber',
      badge: 'Admin Console',
      description: 'Monitor Supabase RLS row-level security policies, spam quarantine telemetry, and SaaS monetization performance.',
      highlights: [
        'Supabase RLS & Local Enclave Audit',
        'Recruiter Spam Filter Quarantine',
        'MRR Health & Subscription Gating',
      ],
    },
  };

  // Sync initial input name with role preset or logged-in user
  useEffect(() => {
    if (isHydrated) {
      if (isLoggedIn && userName) {
        setEnteredName(userName);
        setSelectedRole(role);
      } else if (!enteredName) {
        setEnteredName(rolePresets[selectedRole].defaultName);
      }
    }
  }, [isHydrated, isLoggedIn, role, userName]);

  // When user clicks a role card, if name is currently a default preset or empty, update to the new role's default preset
  const handleSelectRole = (newRole: UserRole) => {
    setSelectedRole(newRole);
    // If the input was empty or matched one of the other defaults, switch it smoothly
    const currentNameIsPreset = Object.values(rolePresets).some(p => p.defaultName === enteredName);
    if (!enteredName.trim() || currentNameIsPreset) {
      setEnteredName(rolePresets[newRole].defaultName);
    }
  };

  // Login handler
  const handleLoginSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const finalName = enteredName.trim() || rolePresets[selectedRole].defaultName;
    login(finalName, selectedRole);

    if (selectedRole === 'college_student') {
      router.push('/student');
    } else if (selectedRole === 'company_recruiter') {
      router.push('/recruiter');
    } else if (selectedRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/job-seeker');
    }
  };

  // Eye cursor tracking state & refs
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const eyeContainerRef = useRef<HTMLDivElement>(null);

  // Check prefers-reduced-motion and track cursor
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) setPupilOffset({ x: 0, y: 0 });
    };

    motionQuery.addEventListener('change', handleMotionChange);

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (motionQuery.matches || !eyeContainerRef.current) return;

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (!eyeContainerRef.current) return;
        const rect = eyeContainerRef.current.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const dx = e.clientX - eyeCenterX;
        const dy = e.clientY - eyeCenterY;
        const angle = Math.atan2(dy, dx);
        const distance = Math.hypot(dx, dy);

        // Constrain pupil inside eye socket
        const scale = rect.width / 100;
        const distInSvg = distance / (scale || 1);

        const maxRadiusX = 8.5;
        const maxRadiusY = 5.8;
        const clampedDistX = Math.min(distInSvg, maxRadiusX);
        const clampedDistY = Math.min(distInSvg, maxRadiusY);

        const targetX = Math.cos(angle) * clampedDistX;
        const targetY = Math.sin(angle) * clampedDistY;

        setPupilOffset({ x: targetX, y: targetY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      motionQuery.removeEventListener('change', handleMotionChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Smooth scroll down to login section
  const handleScrollDown = () => {
    const nextSection = document.getElementById('role-gateways');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getDashboardHrefForRole = (r: UserRole) => {
    if (r === 'college_student') return '/student';
    if (r === 'company_recruiter') return '/recruiter';
    if (r === 'admin') return '/admin';
    return '/job-seeker';
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Self-contained CSS keyframes and reduced-motion rules */}
      <style jsx global>{`
        @keyframes floatBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(clamp(-0.45rem, -0.9vh, -0.3rem));
          }
        }

        .scroll-indicator-float {
          animation: floatBounce 1.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-indicator-float {
            animation: none !important;
          }
          .pupil-animated {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Background ambient gradient orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[clamp(20rem,50vw,45rem)] h-[clamp(12rem,30vh,22rem)] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-80 right-10 w-[clamp(15rem,35vw,25rem)] h-[clamp(10rem,25vh,18rem)] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-[clamp(18rem,40vw,30rem)] h-[clamp(10rem,25vh,20rem)] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[clamp(2rem,4vh,3.5rem)] space-y-[clamp(2rem,4vh,3.5rem)]">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-[clamp(1.2rem,2.5vh,1.8rem)] flex flex-col items-center">
          {/* Micro-Interaction: Eye-Following Cursor Animation */}
          <div className="flex flex-col items-center gap-[clamp(0.4rem,0.8vh,0.7rem)]">
            <div
              ref={eyeContainerRef}
              className="relative inline-flex items-center justify-center p-[clamp(0.2rem,0.4vw,0.35rem)] rounded-full bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-indigo-500/30 shadow-[0_0_clamp(1rem,2vw,2rem)_rgba(99,102,241,0.25)] backdrop-blur-md transition-transform duration-300 hover:scale-105"
              style={{
                width: 'clamp(4.5rem, 8vw + 1.2rem, 7.5rem)',
                height: 'clamp(2.8rem, 5vw + 0.7rem, 4.6rem)',
              }}
              title="Autonomous AI Vision — Pupil smoothly tracks your cursor"
              role="img"
              aria-label="Interactive AI vision agent eye that tracks cursor movement"
            >
              <svg
                viewBox="0 0 100 60"
                className="w-full h-full overflow-visible select-none pointer-events-none"
              >
                <defs>
                  <linearGradient id="eyeStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                  <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="45%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </radialGradient>
                  <radialGradient id="scleraGrad" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="70%" stopColor="#090d16" />
                    <stop offset="100%" stopColor="#020617" />
                  </radialGradient>
                  <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Outer eye shape */}
                <path
                  d="M 6 30 Q 50 -6 94 30 Q 50 66 6 30 Z"
                  fill="url(#scleraGrad)"
                  stroke="url(#eyeStrokeGrad)"
                  strokeWidth="3.2"
                  strokeLinejoin="round"
                  filter="url(#eyeGlow)"
                />

                {/* Radar scanner arcs */}
                <path
                  d="M 16 30 Q 50 6 84 30"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                  opacity="0.5"
                />
                <path
                  d="M 16 30 Q 50 54 84 30"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                  opacity="0.3"
                />

                {/* Inner Pupil Group */}
                <g
                  className="pupil-animated"
                  style={{
                    transform: reducedMotion
                      ? 'none'
                      : `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                    transition: reducedMotion
                      ? 'none'
                      : 'transform 0.1s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
                    willChange: 'transform',
                  }}
                >
                  <circle
                    cx="50"
                    cy="30"
                    r="14"
                    fill="url(#irisGrad)"
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    opacity="0.95"
                  />
                  <circle cx="50" cy="30" r="7.5" fill="#020617" />
                  <circle cx="47" cy="26" r="2.8" fill="#ffffff" opacity="0.85" />
                  <circle cx="52.5" cy="32" r="1.2" fill="#ffffff" opacity="0.5" />
                </g>
              </svg>
            </div>

            <div className="flex items-center gap-1.5 text-[clamp(0.65rem,0.8vw,0.75rem)] text-slate-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AI Agent Vision Engine &bull; Tracks Your Focus</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-[clamp(0.6rem,1.2vw,0.9rem)] py-[clamp(0.25rem,0.5vh,0.4rem)] rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[clamp(0.7rem,0.85vw,0.8rem)] font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Problem Statement AA-35 &bull; Autonomous Job-Search Agent</span>
          </div>

          <h1 className="text-[clamp(2.2rem,5vw+1rem,3.8rem)] font-extrabold tracking-tight text-white leading-[1.12]">
            Stop Blind Spam.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Transparent, Human-Approved
            </span>{' '}
            AI Job Search.
          </h1>

          <p className="text-[clamp(0.875rem,1.1vw,1.125rem)] text-slate-400 leading-relaxed max-w-2xl mx-auto">
            CareerPilot scans matching roles, computes transparent match vectors, tailors resumes with visible diffs, and enforces a mandatory human approval checkpoint before any submission.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-[clamp(0.75rem,1.8vw,2rem)] text-[clamp(0.72rem,0.85vw,0.825rem)] font-medium text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Transparent Scoring</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Mandatory Human Review Gate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Real PDF/DOCX Parsing</span>
            </div>
          </div>

          {/* Scroll Down Button */}
          <div className="pt-[clamp(0.5rem,1.5vh,1.25rem)]">
            <button
              onClick={handleScrollDown}
              className="scroll-indicator-float inline-flex items-center gap-[clamp(0.4rem,0.8vw,0.6rem)] px-[clamp(0.9rem,1.8vw,1.4rem)] py-[clamp(0.45rem,1vh,0.7rem)] rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-cyan-500/50 shadow-[0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-md transition-colors duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
              aria-label="Scroll down to sign in"
            >
              <span className="text-[clamp(0.72rem,0.85vw,0.825rem)] font-medium tracking-wide">
                Role Sign-In Screen
              </span>
              <ChevronDown className="w-[clamp(0.85rem,1vw,1rem)] h-[clamp(0.85rem,1vw,1rem)] text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROPER ROLE-BASED LOGIN SCREEN (REQUIREMENT 1) */}
        {/* ========================================================================= */}
        <section
          id="role-gateways"
          className="space-y-6 pt-4 scroll-mt-[clamp(4rem,8vh,6rem)] max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-purple-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Role-Based Authentication Gateway</span>
            </div>
            <h2 className="text-[clamp(1.5rem,2.5vw,2rem)] font-extrabold text-white tracking-tight">
              Select Your Role &amp; Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Choose your perspective (Student, Job Seeker, or Company Recruiter) and enter your name to unlock role-tailored navigation and tools.
            </p>
          </div>

          {/* Active Session Callout (if already logged in) */}
          {isHydrated && isLoggedIn && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Currently Authenticated:</span>
                    <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {userName || rolePresets[role].defaultName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {rolePresets[role].title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Your navbar is filtered to {rolePresets[role].title} pages only.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link
                  href={getDashboardHrefForRole(role)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20 text-center"
                >
                  Go to Dashboard ➔
                </Link>
                <button
                  onClick={logout}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Logout / Switch Role</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Login Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            {/* Step 1: Role Selection Cards */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Step 1: Select Your Role</span>
                <span className="text-[11px] text-indigo-400 lowercase font-normal">
                  (Determines visible navbar tabs)
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 1. College Student */}
                <div
                  onClick={() => handleSelectRole('college_student')}
                  className={`group relative rounded-2xl p-4 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    selectedRole === 'college_student'
                      ? 'bg-blue-950/40 border-blue-500/80 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                  }`}
                >
                  {selectedRole === 'college_student' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        selectedRole === 'college_student'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                          : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                        College Student
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 mt-0.5 inline-block">
                        Learn &amp; Plan
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        Curriculum roadmaps, tech demand forecasts, and skill gap checklists with free courses.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 mt-3 text-[10px] text-blue-400 font-medium">
                    Navbar: Dashboard &bull; Roadmap &bull; Internships
                  </div>
                </div>

                {/* 2. Job Seeker */}
                <div
                  onClick={() => handleSelectRole('job_seeker')}
                  className={`group relative rounded-2xl p-4 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    selectedRole === 'job_seeker'
                      ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                  }`}
                >
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {selectedRole === 'job_seeker' ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        selectedRole === 'job_seeker'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                          : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      <Briefcase className="w-4 h-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Job Seeker
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 mt-0.5 inline-block">
                        Match &amp; Apply
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        PDF/DOCX file upload, transparent score formulas, radar fit &amp; human sign-off checkpoint.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 mt-3 text-[10px] text-emerald-400 font-medium">
                    Navbar: Dashboard &bull; Compare &bull; Applications
                  </div>
                </div>

                {/* 3. Company Recruiter */}
                <div
                  onClick={() => handleSelectRole('company_recruiter')}
                  className={`group relative rounded-2xl p-4 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    selectedRole === 'company_recruiter'
                      ? 'bg-purple-950/40 border-purple-500/80 shadow-lg shadow-purple-500/20 ring-2 ring-purple-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                  }`}
                >
                  {selectedRole === 'company_recruiter' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        selectedRole === 'company_recruiter'
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                          : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        Company Recruiter
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 mt-0.5 inline-block">
                        Sieve &amp; Hire
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        Anti-spam quarantine drawer, duplicate/scam heuristics, and auditable talent vectors.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 mt-3 text-[10px] text-purple-400 font-medium">
                    Navbar: Dashboard &bull; Post Job &bull; Pipeline
                  </div>
                </div>

                {/* 4. Platform Admin */}
                <div
                  onClick={() => handleSelectRole('admin')}
                  className={`group relative rounded-2xl p-4 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    selectedRole === 'admin'
                      ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-500/20 ring-2 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90'
                  }`}
                >
                  {selectedRole === 'admin' && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        selectedRole === 'admin'
                          ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30'
                          : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        Platform Admin
                      </h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 mt-0.5 inline-block">
                        Audit &amp; Govern
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        Supabase RLS health check, quarantine telemetry, and SaaS monetization MRR audit.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 mt-3 text-[10px] text-amber-400 font-medium">
                    Navbar: Dashboard &bull; Supabase RLS &bull; Quarantine
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Enter Name & Quick Presets */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Step 2: Enter Your Name / Identity
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Type any custom name or pick a preset persona:
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={enteredName}
                    onChange={e => setEnteredName(e.target.value)}
                    placeholder="Enter your name (e.g. Sarah Chen)"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-inner"
                  />
                </div>

                {/* Quick Presets Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">Quick Persona:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('job_seeker');
                      setEnteredName('Sarah Chen');
                    }}
                    className={`px-2.5 py-1 rounded-lg border transition-all ${
                      enteredName === 'Sarah Chen' && selectedRole === 'job_seeker'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Sarah Chen (Seeker)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('college_student');
                      setEnteredName('Alex Patel');
                    }}
                    className={`px-2.5 py-1 rounded-lg border transition-all ${
                      enteredName === 'Alex Patel' && selectedRole === 'college_student'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Alex Patel (Student)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('company_recruiter');
                      setEnteredName('Marcus Vance');
                    }}
                    className={`px-2.5 py-1 rounded-lg border transition-all ${
                      enteredName === 'Marcus Vance' && selectedRole === 'company_recruiter'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Marcus Vance (Recruiter)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('admin');
                      setEnteredName('Alexa Reynolds');
                    }}
                    className={`px-2.5 py-1 rounded-lg border transition-all ${
                      enteredName === 'Alexa Reynolds' && selectedRole === 'admin'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Alexa Reynolds (Admin)
                  </button>
                </div>
              </div>

              {/* Alternative Auth Methods: Google OAuth & OTP */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => {
                    const finalName = enteredName.trim() || rolePresets[selectedRole].defaultName;
                    login(`${finalName} (Google OAuth)`, selectedRole);
                    showToast(`Authenticated via Google OAuth 2.0 as ${rolePresets[selectedRole].title}!`, 'success');
                    router.push(getDashboardHrefForRole(selectedRole));
                  }}
                  className="w-full sm:flex-1 py-2 px-3.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const finalName = enteredName.trim() || rolePresets[selectedRole].defaultName;
                    login(`${finalName} (OTP Verified)`, selectedRole);
                    showToast(`OTP Code 849201 Verified! Logged in as ${rolePresets[selectedRole].title}.`, 'success');
                    router.push(getDashboardHrefForRole(selectedRole));
                  }}
                  className="w-full sm:flex-1 py-2 px-3.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verify with OTP (One-Time Password)</span>
                </button>
              </div>

              {/* Step 3: Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="sign-in-submit-btn"
                  className={`w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                    selectedRole === 'college_student'
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25 ring-1 ring-blue-400/40'
                      : selectedRole === 'company_recruiter'
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/25 ring-1 ring-purple-400/40'
                      : selectedRole === 'admin'
                      ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/25 ring-1 ring-amber-400/40'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/25 ring-1 ring-emerald-400/40'
                  }`}
                >
                  <span>
                    Sign In as {rolePresets[selectedRole].title} ({enteredName.trim() || 'New User'})
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Cross-Cutting Core Differentiators Grid */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-1">
            <h2 className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-bold text-white tracking-tight">
              Built on 6 Core Cross-Cutting Pillars
            </h2>
            <p className="text-[clamp(0.72rem,0.85vw,0.825rem)] text-slate-400">
              Directly addressing the pain points outlined in the AA-35 Autonomous Agent specification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Consistency Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eliminates unexplained black-box numbers. Every score reveals the exact formula weights and matched skills behind it.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Data Validation Layer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Active health check identifies missing portfolio links, outdated graduation dates, and inconsistencies between profile and resume.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h4 className="text-sm font-bold text-white">Human-in-the-Loop Checkpoint</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous agent stages applications and generates diffs, but submission is securely halted until the user clicks &quot;Approve&quot;.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                04
              </div>
              <h4 className="text-sm font-bold text-white">Bottleneck Visualizer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conversion funnel diagnostics highlighting stage drop-offs (e.g. 14 applied ➔ 3 shortlisted ➔ 0 interviewed) with targeted coaching.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                05
              </div>
              <h4 className="text-sm font-bold text-white">Transparency-First Design</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Expandable explanations for every match, including positive skill contributions, missing skill penalties, and company stability.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                06
              </div>
              <h4 className="text-sm font-bold text-white">n8n-Style Workflow Hook</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulated scheduled agent with a visual node DAG pipeline and real-time execution logs for autonomous background scanning.
              </p>
            </div>
          </div>
        </div>

        {/* CareerPilot v2 SaaS Pricing Callout */}
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 p-6 sm:p-8 backdrop-blur shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>CareerPilot v2 Monetization</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Fair, Predictable SaaS Pricing for Every Career Stage
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Permanently free for students (₹0), generous 3-month full trial for job seekers (then ₹499/mo), and scalable talent suites for recruiters (₹2,499 - ₹6,999/mo).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/pricing"
              className="px-5 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              <span>Explore Pricing Plans</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">CareerPilot v2</span>
            <span>&bull; Autonomous Agent SaaS Upgrade</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <Link href="/pricing" className="text-indigo-400 hover:text-indigo-300 hover:underline">
              Pricing Plans
            </Link>
            <span>&bull;</span>
            <Link href="/internships" className="text-cyan-400 hover:text-cyan-300 hover:underline">
              Internship Board
            </Link>
            <span>&bull;</span>
            <Link href="/compare" className="text-slate-400 hover:text-slate-300 hover:underline">
              Job Comparison (Bug Demo)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
