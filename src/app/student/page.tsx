'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { mockRoadmaps, sampleSkillGaps } from '../../data/mockRoadmaps';
import { SkillGapItem } from '../../lib/types';
import DataHealthBadge from '../../components/DataHealthBadge';
import PrivacyBadge from '../../components/PrivacyBadge';
import LockablePortfolioSection from '../../components/LockablePortfolioSection';
import {
  GraduationCap,
  TrendingUp,
  Target,
  CheckSquare,
  Square,
  BookOpen,
  Building,
  Sparkles,
  ArrowRight,
  Plus,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  Briefcase,
} from 'lucide-react';

export default function StudentDashboard() {
  const { profile, updateProfileSkills } = useApp();
  const [selectedDomainId, setSelectedDomainId] = useState<string>('ai-ml');
  const [activeRoadmapYear, setActiveRoadmapYear] = useState<number>(3);
  const [gapChecklist, setGapChecklist] = useState<SkillGapItem[]>(
    sampleSkillGaps['ai-ml'] || []
  );
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  const currentDomain =
    mockRoadmaps.find(d => d.id === selectedDomainId) || mockRoadmaps[0];

  const handleDomainChange = (domainId: string) => {
    setSelectedDomainId(domainId);
    setGapChecklist(sampleSkillGaps[domainId] || []);
  };

  const toggleGapSkill = (skillName: string) => {
    setGapChecklist(prev =>
      prev.map(item =>
        item.skill === skillName ? { ...item, acquired: !item.acquired } : item
      )
    );
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!profile.skills.includes(newSkillInput.trim())) {
      updateProfileSkills([...profile.skills, newSkillInput.trim()]);
    }
    setNewSkillInput('');
  };

  const stages = [
    { name: 'Skill Building', status: 'In Progress (Active)', current: true, date: 'Current Semester' },
    { name: 'Resume Ready', status: 'Next Target', current: false, date: 'Next 30 Days' },
    { name: 'Applying', status: 'Queued', current: false, date: 'Campus Drive / Internships' },
    { name: 'Interview', status: 'Upcoming', current: false, date: 'Final Round Placement' },
    { name: 'Offer Accepted', status: 'Goal', current: false, date: 'Graduation Capstone' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Welcome Header & Data Health Check */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Student Career &amp; Skill Radar
            </h1>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Student Portal
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Welcome back, <strong className="text-slate-200">{profile.name}</strong> &bull; {profile.education}
          </p>
        </div>

        <div className="w-full lg:w-96">
          <DataHealthBadge />
        </div>
      </div>

      {/* Progress Tracker (Requirement 4) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Career Journey Progress Tracker</span>
            </h2>
            <p className="text-xs text-slate-400">
              Track student milestone transitions from foundational training to placement offer
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Stage 1: Skill Building
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {stages.map((stage, idx) => (
            <div
              key={stage.name}
              className={`p-3.5 rounded-xl border transition-all ${
                stage.current
                  ? 'bg-blue-950/40 border-blue-500/50 shadow-md shadow-blue-500/10'
                  : 'bg-slate-950/60 border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                {stage.current ? (
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                )}
              </div>
              <div className="text-xs font-bold text-white">{stage.name}</div>
              <div className="text-[11px] text-blue-300/80 font-medium mt-0.5">{stage.status}</div>
              <div className="text-[10px] text-slate-500 mt-1">{stage.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Domain Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Pick Target Engineering Domain for Curriculum &amp; Predictions</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mockRoadmaps.map(domain => (
            <button
              key={domain.id}
              onClick={() => handleDomainChange(domain.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedDomainId === domain.id
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="text-xs font-bold">{domain.name}</div>
              <div className="text-[10px] text-indigo-400 font-mono mt-0.5">
                Demand: {domain.demandGrowthRate}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Skill Roadmap & Future Demand Prediction (Requirement 1) */}
      <div id="skill-roadmap" className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-20">
        {/* Academic Year Roadmap (1st to 4th year) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Multi-Year Academic Skill Roadmap (1st ➔ 4th Year)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Curated curriculum milestones tailored for {currentDomain.name}
              </p>
            </div>

            {/* Year Switcher Pills */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
              {currentDomain.years.map(y => (
                <button
                  key={y.yearNumber}
                  onClick={() => setActiveRoadmapYear(y.yearNumber)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeRoadmapYear === y.yearNumber
                      ? 'bg-cyan-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Year {y.yearNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Active Year Details */}
          {(() => {
            const yr = currentDomain.years.find(y => y.yearNumber === activeRoadmapYear) || currentDomain.years[0];
            return (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-400">{yr.yearTitle}</span>
                    <span className="text-slate-400 font-mono text-[11px]">Academic Year #{yr.yearNumber}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Milestone:</strong> {yr.milestone}
                  </p>
                </div>

                {/* Skills tags */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Core Skills to Master
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {yr.skills.map(sk => {
                      const hasSkill = profile.skills.some(
                        s => s.toLowerCase() === sk.toLowerCase() || sk.toLowerCase().includes(s.toLowerCase())
                      );
                      return (
                        <span
                          key={sk}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border ${
                            hasSkill
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-slate-950 text-slate-300 border-slate-800'
                          }`}
                        >
                          {hasSkill && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {sk}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Recommended Projects & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Benchmark Projects</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {yr.recommendedProjects.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-indigo-400">&bull;</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Industry Certifications</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {yr.recommendedCerts.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-purple-400">&bull;</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Future-Demand Prediction Chart (Requirement 1) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Future-Demand Projections</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                2024–2028
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Macro hiring forecast &amp; industry momentum index
            </p>
          </div>

          {/* Demand Bars */}
          <div className="space-y-3 py-2">
            {currentDomain.futureProjections.map(item => (
              <div key={item.year} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white font-mono">{item.year}</span>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-emerald-400 font-semibold">{item.yoyGrowth}</span>
                    <span className="text-slate-400 font-mono">Index: {item.demandIndex}</span>
                  </div>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"
                    style={{ width: `${Math.min((item.demandIndex / 120) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-400 italic">{item.trendHeadline}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <div className="text-slate-400">Typical Fresher Compensation:</div>
            <div className="text-sm font-bold text-emerald-400">{currentDomain.avgFresherSalary}</div>
          </div>
        </div>
      </div>

      {/* Section 2: Skill Gap Detector & Checklist (Requirement 2) */}
      <div id="skill-gap" className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-5 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Skill Gap Detector &amp; Missing Skills Checklist</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Action Plan
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Comparing your profile skills against target-role prerequisites in {currentDomain.name}
            </p>
          </div>

          {/* Quick Skill Add Input */}
          <form onSubmit={handleAddSkill} className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={e => setNewSkillInput(e.target.value)}
              placeholder="Add skill (e.g. Docker, PyTorch)..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-52"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Current profile skills chips */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Your Current Verified Skills ({profile.skills.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Gap Checklist */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Identified Skill Gaps &amp; Interactive Learning Checklist
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gapChecklist.map(item => (
              <div
                key={item.skill}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  item.acquired
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div
                  onClick={() => toggleGapSkill(item.skill)}
                  className="flex items-start gap-3 cursor-pointer"
                >
                  <div className="mt-0.5">
                    {item.acquired ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${item.acquired ? 'line-through text-slate-400' : 'text-white'}`}>
                        {item.skill}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        ~{item.estimatedWeeks} wks
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{item.resourceTitle}</span>
                    </div>
                  </div>
                </div>

                {/* Free Course Link & Internship Shortcut */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  {item.resourceLink ? (
                    <a
                      href={item.resourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Free Course / Guide</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-500">Self-Paced Guide</span>
                  )}

                  <Link
                    href={`/internships?skill=${encodeURIComponent(item.skill)}`}
                    onClick={e => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                  >
                    <Briefcase className="w-3 h-3" />
                    <span>Find Internships</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Career Path Recommendations (Requirement 3) */}
      <div id="career-path" className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-4 scroll-mt-20">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-400" />
            <span>Career Path &amp; Company Recommendations</span>
          </h2>
          <p className="text-xs text-slate-400">
            Suggested entry-level positions and target employers based on your {currentDomain.name} profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300">Fast-Paced Startups</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300">
                High Velocity
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Target companies: <strong>Scale AI, Linear, Perplexity</strong>
            </p>
            <div className="text-[11px] text-slate-300">
              Recommended role: <strong>Junior Systems &amp; Application Engineer</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300">Tier-1 Cloud Infrastructure</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300">
                High Stability
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Target companies: <strong>Vercel, Cloudflare, Stripe</strong>
            </p>
            <div className="text-[11px] text-slate-300">
              Recommended role: <strong>Associate Platform &amp; Frontend Engineer</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300">Frontier R&amp;D Labs</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300">
                Bleeding Edge
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Target companies: <strong>Anthropic, Tesla Optimus, Boom Supersonic</strong>
            </p>
            <div className="text-[11px] text-slate-300">
              Recommended role: <strong>AI Integration &amp; Autonomous Systems Intern</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 10: Student Lockable Portfolio Templates & Cryptographic Verification */}
      <LockablePortfolioSection />

      {/* Privacy-First Local Enclave Guarantee Badge */}
      <div className="pt-2">
        <PrivacyBadge />
      </div>
    </div>
  );
}
