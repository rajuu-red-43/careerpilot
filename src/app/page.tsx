'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';
import { UserRole } from '../lib/types';
import {
  Compass,
  GraduationCap,
  Briefcase,
  Building2,
  ShieldCheck,
  Cpu,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  GitCompare,
  BookOpen,
  User,
  Check,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const { role, setRole, userName, setUserName, isHydrated, showToast } = useApp();
  const { t } = useLanguage();

  // Local state for optional greeting name input
  const [tempName, setTempName] = useState<string>(userName || '');

  // Keep tempName in sync if userName changes in context
  useEffect(() => {
    if (userName) {
      setTempName(userName);
    }
  }, [userName]);

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

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(tempName);
    if (tempName.trim()) {
      showToast(`Welcome, ${tempName.trim()}! Personalized greeting saved locally.`, 'success');
    } else {
      showToast('Greeting name cleared.', 'info');
    }
  };

  const perspectives: Array<{
    role: UserRole;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    color: string;
    borderActive: string;
    bgActive: string;
    href: string;
    cta: string;
    description: string;
    highlights: string[];
  }> = [
    {
      role: 'college_student',
      title: 'College Student',
      subtitle: 'Learn & Plan',
      icon: GraduationCap,
      color: 'blue',
      borderActive: 'border-blue-500/80 ring-2 ring-blue-500/30',
      bgActive: 'bg-blue-950/40',
      href: '/student',
      cta: 'Explore Student Hub',
      description: 'Explore multi-year curriculum roadmaps (1st–4th year), tech demand forecasts, and skill gap checklists with verified free courses.',
      highlights: [
        'Domain Roadmaps (AI, Web, DevOps, Core)',
        '2024–2028 Tech Demand Projections',
        'Actionable Skill Gap Checklists & Courses',
      ],
    },
    {
      role: 'job_seeker',
      title: 'Job Seeker',
      subtitle: 'Match & Apply',
      icon: Briefcase,
      color: 'emerald',
      borderActive: 'border-emerald-500/80 ring-2 ring-emerald-500/30',
      bgActive: 'bg-emerald-950/40',
      href: '/job-seeker',
      cta: 'Explore Job Seeker Portal',
      description: 'Upload real resumes (PDF/DOCX), inspect transparent fit scoring formulas, view tailored diffs, and approve before submit.',
      highlights: [
        'Real PDF / DOCX Resume File Parser',
        'Explainable "Why This Score" Formulas',
        'Mandatory Human Sign-off Checkpoint',
      ],
    },
    {
      role: 'company_recruiter',
      title: 'Company Recruiter',
      subtitle: 'Sieve & Hire',
      icon: Building2,
      color: 'purple',
      borderActive: 'border-purple-500/80 ring-2 ring-purple-500/30',
      bgActive: 'bg-purple-950/40',
      href: '/recruiter',
      cta: 'Explore Recruiter Tools',
      description: 'Post jobs with duplicate/fake detection heuristics, and inspect transparent candidate fit vectors without spam.',
      highlights: [
        'Duplicate & Fake Job Heuristics Detector',
        'High-Fit Ranked Candidate Pipeline',
        'Auditable Transparency Panel',
      ],
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[clamp(20rem,50vw,45rem)] h-[clamp(12rem,30vh,22rem)] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-80 right-10 w-[clamp(15rem,35vw,25rem)] h-[clamp(10rem,25vh,18rem)] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-[clamp(18rem,40vw,30rem)] h-[clamp(10rem,25vh,20rem)] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[clamp(2rem,4vh,3.5rem)] space-y-[clamp(2.5rem,5vh,4rem)]">
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
            <span>Problem Statement AA-35 &bull; Autonomous Career &amp; Job Platform</span>
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
            CareerPilot is completely open to all visitors without accounts or logins. Scan matching opportunities, inspect transparent fit formulas, close skill gaps with verified courses, and explore freely.
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

          {/* Direct Product Exploration CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/job-seeker"
              className="px-6 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Browse Jobs &amp; Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/learn"
              className="px-5 py-3.5 rounded-2xl text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-cyan-500/50 transition-all flex items-center gap-2 shadow-lg"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Explore Learning &amp; Skills</span>
            </Link>

            <Link
              href="/compare"
              className="px-5 py-3.5 rounded-2xl text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 hover:border-indigo-500/50 transition-all flex items-center gap-2 shadow-lg"
            >
              <GitCompare className="w-4 h-4 text-indigo-400" />
              <span>Career Paths &amp; Compare</span>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OPTIONAL PERSONALIZATION & PERSPECTIVE EXPLORER */}
        {/* ========================================================================= */}
        <section
          id="explore-perspectives"
          className="space-y-6 pt-4 max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Optional Visitor Personalization</span>
            </div>
            <h2 className="text-[clamp(1.5rem,2.5vw,2rem)] font-extrabold text-white tracking-tight">
              {userName ? `Welcome, ${userName}` : 'Welcome to CareerPilot'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              No account or signup is required. You can jump straight into any workspace or optionally personalize your greeting below.
            </p>
          </div>

          {/* Perspective Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {perspectives.map(p => {
              const Icon = p.icon;
              const isCurrent = role === p.role;
              return (
                <div
                  key={p.role}
                  className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                    isCurrent
                      ? `${p.bgActive} ${p.borderActive} shadow-xl`
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-white">
                        <Icon className="w-5 h-5 text-indigo-400" />
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                        {p.subtitle}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{p.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <ul className="space-y-1.5 pt-2 text-[11px] text-slate-300">
                      {p.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-800/80 flex flex-col gap-2">
                    <Link
                      href={p.href}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-center bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5"
                    >
                      <span>{p.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setRole(p.role)}
                      className={`text-[11px] font-medium py-1 transition-colors ${
                        isCurrent
                          ? 'text-indigo-300 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isCurrent ? '✓ Active Perspective Preview' : 'Preview this perspective'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Display Name Personalization Card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm max-w-xl mx-auto">
            <form onSubmit={handleSaveName} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  placeholder="Personalize greeting with your name (optional)"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors shrink-0"
              >
                Save Name
              </button>
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
              <span>CareerPilot v2 Access</span>
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
            <span>&bull; Open Public Access</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <Link href="/job-seeker" className="text-emerald-400 hover:text-emerald-300 hover:underline">
              Jobs
            </Link>
            <span>&bull;</span>
            <Link href="/learn" className="text-cyan-400 hover:text-cyan-300 hover:underline">
              Learning Roadmaps
            </Link>
            <span>&bull;</span>
            <Link href="/internships" className="text-blue-400 hover:text-blue-300 hover:underline">
              Internships
            </Link>
            <span>&bull;</span>
            <Link href="/compare" className="text-indigo-400 hover:text-indigo-300 hover:underline">
              Career Paths
            </Link>
            <span>&bull;</span>
            <Link href="/pricing" className="text-slate-400 hover:text-slate-300 hover:underline">
              Pricing Plans
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
