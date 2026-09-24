'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
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
} from 'lucide-react';

export default function LandingPage() {
  const { setRole } = useApp();
  const router = useRouter();

  const handleRoleSelect = (roleName: 'college_student' | 'job_seeker' | 'company_recruiter') => {
    setRole(roleName);
    if (roleName === 'college_student') router.push('/student');
    else if (roleName === 'company_recruiter') router.push('/recruiter');
    else router.push('/job-seeker');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Background ambient gradient orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-80 right-10 w-[400px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-[500px] h-[300px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Problem Statement AA-35 &bull; Autonomous Job-Search Agent</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stop Blind Spam.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Transparent, Human-Approved
            </span>{' '}
            AI Job Search.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            CareerPilot scans matching roles, computes transparent match vectors, tailors resumes with visible diffs, and enforces a mandatory human approval checkpoint before any submission.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Transparent Scoring Formulas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Mandatory Human Review Gate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>n8n Scheduled Automation Engine</span>
            </div>
          </div>
        </div>

        {/* 3 Role-Based Login / Gateway Cards */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Select Your Role Gateway
            </h2>
            <p className="text-xs text-slate-400">
              Interactive demo environment — 1-click switch between all 3 perspectives anytime
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Card 1: College Student */}
            <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur hover:border-blue-500/50 hover:bg-slate-900/90 transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                      College Student
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Learn &amp; Plan
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Explore multi-year roadmaps (1st to 4th year), future demand predictions, and interactive skill gap detectors.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>Domain Roadmaps (AI, Web, DevOps, Core)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>2024–2028 Tech Demand Projections</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>Actionable Skill Gap Checklists</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleRoleSelect('college_student')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 group-hover:gap-2.5"
                >
                  <span>Enter Student Portal</span>
                  <ArrowRight className="w-4 h-4 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 2: Job Seeker */}
            <div className="group relative rounded-2xl border-2 border-emerald-500/40 bg-slate-900/80 p-6 backdrop-blur hover:border-emerald-400 hover:bg-slate-900 transition-all duration-300 shadow-2xl shadow-emerald-500/10 flex flex-col justify-between">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                Featured Mode
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Job Seeker
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Match &amp; Apply
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Resume parser, transparent fit scoring breakdown, tailored resume/cover letter diffs, and strict human approval.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Explainable &quot;Why This Score&quot; Formula</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Side-by-Side Tailored Resume Diffs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Mandatory Human Sign-off Checkpoint</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleRoleSelect('job_seeker')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 group-hover:gap-2.5"
                >
                  <span>Enter Job Seeker Portal</span>
                  <ArrowRight className="w-4 h-4 transition-transform" />
                </button>
              </div>
            </div>

            {/* Card 3: Company / Recruiter */}
            <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur hover:border-purple-500/50 hover:bg-slate-900/90 transition-all duration-300 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      Company Recruiter
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      Sieve &amp; Hire
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Post jobs with duplicate/fake detection heuristics, and inspect transparent candidate fit vectors without spam.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>Duplicate &amp; Fake Job Heuristics Detector</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>High-Fit Ranked Candidate Pipeline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>Auditable Candidate Transparency Panel</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleRoleSelect('company_recruiter')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 group-hover:gap-2.5"
                >
                  <span>Enter Recruiter Portal</span>
                  <ArrowRight className="w-4 h-4 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cross-Cutting Core Differentiators Grid */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Built on 6 Core Cross-Cutting Pillars
            </h2>
            <p className="text-xs text-slate-400">
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
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">CareerPilot</span>
            <span>&bull; Hackathon Autonomous Agent Project AA-35</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Next.js 14 (App Router) + TailwindCSS</span>
            <span>&bull;</span>
            <Link href="/compare" className="text-cyan-400 hover:underline">
              Job Comparison (Bug Demo)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
