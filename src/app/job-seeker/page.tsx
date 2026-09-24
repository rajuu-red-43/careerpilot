'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { JobPosting, Application } from '../../lib/types';
import WhyScoreModal from '../../components/WhyScoreModal';
import ResumeDiffModal from '../../components/ResumeDiffModal';
import DataHealthBadge from '../../components/DataHealthBadge';
import BottleneckFunnel from '../../components/BottleneckFunnel';
import AutomationDrawer from '../../components/AutomationDrawer';
import {
  Briefcase,
  Upload,
  FileText,
  Sparkles,
  HelpCircle,
  CheckCircle,
  XCircle,
  GitCompare,
  ArrowRight,
  ShieldAlert,
  FileCheck,
  Building,
  MapPin,
  DollarSign,
  TrendingUp,
  Check,
  Filter,
} from 'lucide-react';

export default function JobSeekerDashboard() {
  const {
    jobs,
    applications,
    profile,
    updateProfileSkills,
    selectedCompareJobIds,
    toggleCompareJob,
    showToast,
  } = useApp();

  const [activeScoreJob, setActiveScoreJob] = useState<JobPosting | null>(null);
  const [activeDiffApp, setActiveDiffApp] = useState<Application | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsedSuccess, setParsedSuccess] = useState<boolean>(false);

  // Filter jobs
  const filteredJobs = jobs.filter(j => {
    if (filterLevel === 'All') return true;
    if (filterLevel === 'HighFit') return j.matchBreakdown.fitPercentage >= 85;
    if (filterLevel === 'Remote') return j.workplaceType === 'Remote';
    return true;
  });

  // Simulated resume upload & parsing
  const handleSimulateResumeUpload = (resumeType: 'fullstack' | 'aiml' | 'cloud') => {
    setIsParsing(true);
    setParsedSuccess(false);

    setTimeout(() => {
      setIsParsing(false);
      setParsedSuccess(true);
      if (resumeType === 'fullstack') {
        updateProfileSkills([
          'Next.js',
          'React',
          'TypeScript',
          'TailwindCSS',
          'Node.js',
          'PostgreSQL',
          'GraphQL',
          'Git',
        ]);
        showToast('Parsed Junior Full-Stack Resume: 8 skills extracted & matches updated!', 'success');
      } else if (resumeType === 'aiml') {
        updateProfileSkills([
          'Python',
          'PyTorch',
          'LangChain',
          'FastAPI',
          'Vector DBs',
          'TypeScript',
          'Next.js',
        ]);
        showToast('Parsed AI & Agent Engineer Resume: High-fit matches updated!', 'success');
      } else {
        updateProfileSkills([
          'Linux',
          'Docker',
          'Kubernetes',
          'Terraform',
          'Git',
          'Go',
          'AWS',
        ]);
        showToast('Parsed Cloud & Platform Resume: Infrastructure roles scored!', 'success');
      }
    }, 900);
  };

  const getApplicationForJob = (jobId: string) => {
    return applications.find(a => a.jobId === jobId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Seeker Header & Data Health Layer */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Job Seeker Autonomous Agent
            </h1>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Seeker Mode
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Authenticated as <strong className="text-slate-200">{profile.name}</strong> &bull; {profile.headline}
          </p>
        </div>

        <div className="w-full lg:w-96">
          <DataHealthBadge />
        </div>
      </div>

      {/* Top Action Row: n8n Automation Engine Drawer */}
      <AutomationDrawer />

      {/* Resume / Skill Parser (Requirement 1) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Resume &amp; Skill Parser (Zero DB Extraction)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Upload a candidate PDF resume or trigger a instant pre-loaded sample profile
            </p>
          </div>

          {/* Quick preset resume loaders */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] text-slate-400 font-medium">Load Preset:</span>
            <button
              onClick={() => handleSimulateResumeUpload('fullstack')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
            >
              Full-Stack
            </button>
            <button
              onClick={() => handleSimulateResumeUpload('aiml')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
            >
              AI / LLM
            </button>
            <button
              onClick={() => handleSimulateResumeUpload('cloud')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
            >
              DevOps
            </button>
          </div>
        </div>

        {/* Drag and drop simulated dropzone */}
        <div
          onClick={() => handleSimulateResumeUpload('fullstack')}
          className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 space-y-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 mx-auto flex items-center justify-center transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-300">
            {isParsing ? (
              <span className="text-indigo-400 animate-pulse">Parsing Resume Tokens with OCR Heuristic Engine...</span>
            ) : (
              <span>Click to simulate parsing candidate resume (PDF / DOCX)</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            Instant deterministic skill extraction with ATS token scoring
          </p>
        </div>

        {/* Extracted skills tag cloud */}
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Currently Extracted Skills ({profile.skills.length})</span>
            {parsedSuccess && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" /> Tokens Synchronized
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Human Approval Checkpoint Callout Banner (Requirement 4) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Human Approval Checkpoint Protocol Active</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Anti-Spam Guarantee
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              No blind automatic submissions. Every application requires you to inspect the tailored resume diff and explicitly click &quot;Approve &amp; Submit&quot;.
            </p>
          </div>
        </div>

        <Link
          href="/applications"
          className="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
        >
          <span>View Approval Queue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Section 2 & 3: Job Fit Scoring & Postings List (Requirement 2 & 3) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ranked Job Openings &amp; Fit Scoring</span>
            </h2>
            <p className="text-xs text-slate-400">
              Each score includes an expandable &quot;Why this score&quot; mathematical breakdown
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setFilterLevel('All')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterLevel === 'All' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({jobs.length})
            </button>
            <button
              onClick={() => setFilterLevel('HighFit')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterLevel === 'HighFit' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              High Fit (&gt;85%)
            </button>
            <button
              onClick={() => setFilterLevel('Remote')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterLevel === 'Remote' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Remote Only
            </button>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map(job => {
            const isCompared = selectedCompareJobIds.includes(job.id);
            const app = getApplicationForJob(job.id);

            return (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar: Company, Fit Score Badge & Compare Checkbox */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400">{job.company}</span>
                        {job.verifiedCompany ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Unverified
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                        {job.title}
                      </h3>
                    </div>

                    {/* Fit score badge with Why button */}
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => setActiveScoreJob(job)}
                        className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold hover:bg-emerald-500/25 transition-all flex items-center gap-1.5"
                        title="Click to view transparent score breakdown"
                      >
                        <span>{job.matchBreakdown.fitPercentage}% Fit</span>
                        <HelpCircle className="w-3 h-3 text-emerald-400" />
                      </button>
                      <button
                        onClick={() => setActiveScoreJob(job)}
                        className="text-[10px] text-slate-400 hover:text-emerald-300 underline underline-offset-2"
                      >
                        Why this score?
                      </button>
                    </div>
                  </div>

                  {/* Metadata Chips: Salary, Location, Type */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.salaryRange}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.location}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="font-mono text-cyan-400">{job.workplaceType}</span>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {/* Required skills chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills.map(reqSkill => {
                      const matched = profile.skills.some(
                        ps => ps.toLowerCase() === reqSkill.toLowerCase()
                      );
                      return (
                        <span
                          key={reqSkill}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                            matched
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          {reqSkill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Actions: Compare Toggle + View Tailored Diff / Human Approval */}
                <div className="border-t border-slate-800/80 pt-3 flex flex-wrap items-center justify-between gap-2">
                  {/* Compare Toggle Button */}
                  <button
                    onClick={() => toggleCompareJob(job.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isCompared
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                  </button>

                  {/* Tailored Resume / Approval Checkpoint Button */}
                  {app ? (
                    <button
                      onClick={() => setActiveDiffApp(app)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        app.status === 'Applied'
                          ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/20'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>
                        {app.status === 'Applied' ? 'View Approved Packet' : 'Review & Approve Diff'}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const fallbackApp: Application = {
                          id: `app-dyn-${job.id}`,
                          jobId: job.id,
                          jobTitle: job.title,
                          company: job.company,
                          location: job.location,
                          appliedDate: new Date().toISOString().split('T')[0],
                          status: 'Pending Approval',
                          fitScore: job.matchBreakdown.fitPercentage,
                          humanApproved: false,
                          followUpDate: '2026-09-30',
                          tailoredKeywordsAdded: job.requiredSkills.slice(0, 3),
                          tailoredBulletPoints: [
                            {
                              original: 'Engineered web features and maintained legacy codebase.',
                              tailored: `Engineered high-performance ${job.requiredSkills[0]} features aligning with ${job.company}'s product standard, improving latency by 32%.`,
                              reason: `Directly targets ${job.title} job posting requirements.`,
                            },
                          ],
                          tailoredCoverLetter: `Dear ${job.company} Team,\n\nI am eager to submit my application for the ${job.title} role. My hands-on background with ${job.requiredSkills.slice(0, 2).join(' and ')} positions me well to deliver immediate value to ${job.company}.\n\nSincerely,\n${profile.name}`,
                        };
                        setActiveDiffApp(fallbackApp);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600/80 hover:bg-indigo-600 text-white transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Tailored Diff</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel & Conversion Bottleneck Visualizer */}
      <BottleneckFunnel />

      {/* Modal: Why Score Transparency */}
      <WhyScoreModal job={activeScoreJob} onClose={() => setActiveScoreJob(null)} />

      {/* Modal: Resume Diff & Human Approval Checkpoint */}
      <ResumeDiffModal application={activeDiffApp} onClose={() => setActiveDiffApp(null)} />
    </div>
  );
}
