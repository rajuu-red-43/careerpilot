'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { JobPosting } from '../../lib/types';
import DataHealthBadge from '../../components/DataHealthBadge';
import RecruiterSpamSection from '../../components/RecruiterSpamSection';
import PrivacyBadge from '../../components/PrivacyBadge';
import {
  Building2,
  PlusCircle,
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  MapPin,
  HelpCircle,
  FileText,
  Search,
  Crown,
  Radar,
  ArrowRight,
  Lock,
} from 'lucide-react';

export default function RecruiterDashboard() {
  const {
    profile,
    jobs,
    addJobPosting,
    showToast,
    isRecruiterSubscribed,
    toggleRecruiterSubscription,
    setGraphicalFitJob,
  } = useApp();

  // Job creation form state
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('CloudScale Labs');
  const [department, setDepartment] = useState('Core Engineering');
  const [location, setLocation] = useState('Remote (Worldwide)');
  const [workplaceType, setWorkplaceType] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [salaryRange, setSalaryRange] = useState('$130,000 - $160,000');
  const [experienceLevel, setExperienceLevel] = useState<'Entry' | 'Mid' | 'Senior' | 'Internship'>('Mid');
  const [skillsString, setSkillsString] = useState('React, TypeScript, Next.js, Node.js');
  const [description, setDescription] = useState(
    'Seeking a skilled engineer to build high-performance distributed web applications.'
  );

  // Candidate pipeline selection for Transparency Panel
  const [selectedCandidate, setSelectedCandidate] = useState<{
    name: string;
    role: string;
    fitScore: number;
    matchDetails: {
      skillsScore: number;
      experienceScore: number;
      domainSynergy: number;
      rationale: string;
      matchedSkills: string[];
      missingSkills: string[];
    };
  } | null>({
    name: 'Sarah Chen',
    role: 'Junior Full-Stack Engineer',
    fitScore: 92,
    matchDetails: {
      skillsScore: 94,
      experienceScore: 90,
      domainSynergy: 92,
      rationale:
        'Demonstrates deep Next.js App Router and TypeScript proficiency. Portfolio contains verifiable GitHub repos with sub-second LCP optimizations.',
      matchedSkills: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Node.js', 'PostgreSQL'],
      missingSkills: ['Edge Computing'],
    },
  });

  const candidatesList = [
    {
      name: 'Sarah Chen',
      role: 'Junior Full-Stack Engineer',
      fitScore: 92,
      experience: '1.5 yrs exp',
      status: 'High Fit Match',
      matchDetails: {
        skillsScore: 94,
        experienceScore: 90,
        domainSynergy: 92,
        rationale:
          'Demonstrates deep Next.js App Router and TypeScript proficiency. Portfolio contains verifiable GitHub repos with sub-second LCP optimizations.',
        matchedSkills: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Node.js', 'PostgreSQL'],
        missingSkills: ['Edge Computing'],
      },
    },
    {
      name: 'Alex Rivera',
      role: 'Frontend Systems Specialist',
      fitScore: 88,
      experience: '2.0 yrs exp',
      status: 'Qualified Candidate',
      matchDetails: {
        skillsScore: 88,
        experienceScore: 86,
        domainSynergy: 90,
        rationale:
          'Strong UI ergonomics and component library contributor. High fluency in design token pipelines.',
        matchedSkills: ['React', 'TypeScript', 'TailwindCSS', 'REST APIs'],
        missingSkills: ['Next.js App Router', 'Turbopack'],
      },
    },
    {
      name: 'Vikram Mehta',
      role: 'Backend API Developer',
      fitScore: 74,
      experience: '3.0 yrs exp',
      status: 'Moderate Fit',
      matchDetails: {
        skillsScore: 70,
        experienceScore: 80,
        domainSynergy: 72,
        rationale:
          'Exceptional Node.js and SQL skills, but minimal client-side Next.js/Tailwind experience.',
        matchedSkills: ['Node.js', 'PostgreSQL', 'Git', 'REST APIs'],
        missingSkills: ['Next.js', 'TailwindCSS', 'Web Performance'],
      },
    },
    {
      name: 'Bot_Submitter_99 (Filtered Out)',
      role: 'Generic Applicant',
      fitScore: 22,
      experience: 'Unknown',
      status: 'Spam Quarantined',
      matchDetails: {
        skillsScore: 20,
        experienceScore: 25,
        domainSynergy: 20,
        rationale:
          'Quarantined by AA-35 Anti-Spam Gate: Blanket submission lacking human-in-the-loop review packet.',
        matchedSkills: ['JavaScript'],
        missingSkills: ['Next.js', 'TypeScript', 'TailwindCSS', 'React', 'Node.js'],
      },
    },
  ];

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please fill in required job title and description.', 'warning');
      return;
    }

    const skills = skillsString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const result = addJobPosting({
      title,
      company,
      department,
      location,
      workplaceType,
      salaryRange,
      experienceLevel,
      description,
      requiredSkills: skills,
    });

    if (result.isDuplicate) {
      showToast('Posting created but FLAGGED as potential duplicate!', 'warning');
    } else if (result.isSuspicious) {
      showToast('Posting created but FLAGGED by Trust & Safety Filter!', 'warning');
    } else {
      showToast('New job successfully posted and verified!', 'success');
    }

    // Reset form
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Recruiter Header & Data Health Layer */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Building2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Recruiter &amp; Talent Intelligence Portal
            </h1>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Recruiter Mode
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Welcome, <strong className="text-slate-200">{profile.name}</strong> &bull; {profile.headline}
          </p>
        </div>

        <div className="w-full lg:w-96">
          <DataHealthBadge />
        </div>
      </div>

      {/* Recruiter Monetization Banner (Feature 2) */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isRecruiterSubscribed
            ? 'bg-purple-950/20 border-purple-500/30 text-purple-200'
            : 'bg-amber-950/25 border-amber-500/30 text-amber-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                isRecruiterSubscribed
                  ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                  : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
              }`}
            >
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {isRecruiterSubscribed
                    ? 'Recruiter Growth Tier Active (₹6,999/mo)'
                    : 'Recruiter Tier Inactive / Gated (₹2,499 - ₹6,999/mo)'}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    isRecruiterSubscribed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {isRecruiterSubscribed ? 'Active Paid SaaS' : 'Subscription Required'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRecruiterSubscribed
                  ? 'Unlimited candidate match vectors, real-time spam shield, and automated quarantine drawer active.'
                  : 'Enterprise talent intelligence features require an active recruiter seat subscription.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/pricing"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1"
            >
              <span>View Pricing Tiers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={toggleRecruiterSubscription}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isRecruiterSubscribed
                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20'
              }`}
            >
              {isRecruiterSubscribed ? 'Simulate Unsubscribed' : 'Activate Demo Subscription'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Post a Job Form (Requirement 1 & 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post a Job Form */}
        <div id="post-job" className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-5 scroll-mt-20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <span>Post a Job with Real-Time Heuristic Guardrails</span>
              </h2>
              <p className="text-xs text-slate-400">
                Automatic duplicate and scam pattern detection on submit
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
              AA-35 Compliance
            </span>
          </div>

          <form onSubmit={handlePostJob} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Job Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Company Name *</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Location &amp; Policy</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Salary Band</label>
                <input
                  type="text"
                  value={salaryRange}
                  onChange={e => setSalaryRange(e.target.value)}
                  placeholder="e.g. $130,000 - $160,000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={e =>
                    setExperienceLevel(e.target.value as 'Entry' | 'Mid' | 'Senior' | 'Internship')
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Internship">Internship</option>
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Workplace Type</label>
                <select
                  value={workplaceType}
                  onChange={e =>
                    setWorkplaceType(e.target.value as 'Remote' | 'Hybrid' | 'On-site')
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Required Skills (Comma separated)</label>
              <input
                type="text"
                value={skillsString}
                onChange={e => setSkillsString(e.target.value)}
                placeholder="React, TypeScript, Next.js, Node.js"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Job Description *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe role responsibilities, tech stack, and qualifications..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                <span>Checked against duplicate tokens &amp; phishing patterns</span>
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Job Opening</span>
              </button>
            </div>
          </form>
        </div>

        {/* Duplicate & Fake Job Detector Panel (Requirement 2) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Duplicate &amp; Fake Job Detector</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Live Audit
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Heuristic engine flagging deceptive listings and scraped duplicate spam
            </p>
          </div>

          {/* Active Flagged Postings in Database */}
          <div className="space-y-3 py-1">
            {jobs
              .filter(j => j.isFlaggedDuplicate || j.isSuspiciousFake)
              .map(flaggedJob => (
                <div
                  key={flaggedJob.id}
                  className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                    flaggedJob.isSuspiciousFake
                      ? 'bg-rose-950/25 border-rose-500/30 text-rose-200'
                      : 'bg-amber-950/25 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white line-clamp-1">{flaggedJob.title}</span>
                    <span
                      className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                        flaggedJob.isSuspiciousFake
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {flaggedJob.isSuspiciousFake ? 'Scam Flag' : 'Duplicate'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{flaggedJob.company}</div>
                  <div className="text-[11px] leading-relaxed italic bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    <strong>Heuristic Reason:</strong>{' '}
                    {flaggedJob.fakeReason || flaggedJob.duplicateReason}
                  </div>
                </div>
              ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <strong>Detector Guarantee:</strong> Protects candidates from deceptive postings while preventing duplicate spam across agency networks.
          </div>
        </div>
      </div>

      {/* Applicant Pipeline & Transparency Panel (Requirement 3 & 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applicant Pipeline List (Requirement 3) */}
        <div id="applicant-pipeline" className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-4 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Ranked Applicant Pipeline (Zero Spam Queue)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Applicants ranked transparently by deterministic skill &amp; project vector fit
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {candidatesList.length} Active In Pipeline
            </span>
          </div>

          <div className="space-y-3">
            {candidatesList.map(cand => {
              const isSelected = selectedCandidate?.name === cand.name;
              return (
                <div
                  key={cand.name}
                  onClick={() => setSelectedCandidate(cand)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{cand.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {cand.experience}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{cand.role}</p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        {cand.fitScore}% Fit
                      </div>
                      <div className="text-[10px] text-slate-400">{cand.status}</div>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedCandidate(cand);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                      Audit Score
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (jobs && jobs.length > 0) {
                          setGraphicalFitJob(jobs[0]);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 transition-colors flex items-center gap-1"
                      title="View 5-Axis Spider Radar Fit"
                    >
                      <Radar className="w-3.5 h-3.5" />
                      <span>Fit Radar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transparency Panel (Requirement 4) */}
        <div id="transparency-panel" className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-4 flex flex-col justify-between scroll-mt-20">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Transparency Panel</span>
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                Audit Trail
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Explaining how the fit ranking was calculated for {selectedCandidate?.name}
            </p>
          </div>

          {selectedCandidate ? (
            <div className="space-y-4 text-xs">
              {/* Score Breakdown Cards */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Skills</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {selectedCandidate.matchDetails.skillsScore}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Experience</div>
                  <div className="text-sm font-bold text-cyan-400 mt-0.5">
                    {selectedCandidate.matchDetails.experienceScore}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400">Synergy</div>
                  <div className="text-sm font-bold text-indigo-400 mt-0.5">
                    {selectedCandidate.matchDetails.domainSynergy}%
                  </div>
                </div>
              </div>

              {/* Rationale explanation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explainable Decision Vector</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed italic">
                  &ldquo;{selectedCandidate.matchDetails.rationale}&rdquo;
                </p>
              </div>

              {/* Skills breakdown */}
              <div className="space-y-2">
                <div>
                  <span className="text-[11px] text-emerald-400 font-semibold">Matched Prerequisites:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedCandidate.matchDetails.matchedSkills.map(sk => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-amber-400 font-semibold">Missing Elements:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedCandidate.matchDetails.missingSkills.map(sk => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs italic">
              Select an applicant to view transparent audit metrics.
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <strong>Recruiter Trust Shield:</strong> Eliminates black-box screening bias by providing auditable scoring weights.
          </div>
        </div>
      </div>

      {/* Feature 15: Recruiter Spam Quarantined Drawer */}
      <RecruiterSpamSection />

      {/* Local Enclave Privacy Badge */}
      <div className="pt-2">
        <PrivacyBadge />
      </div>
    </div>
  );
}
