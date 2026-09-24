'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { JobPosting } from '../../lib/types';
import {
  GitCompare,
  Building,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Bug,
  RotateCcw,
  Plus,
  X,
  HelpCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function JobComparisonPage() {
  const {
    jobs,
    selectedCompareJobIds,
    toggleCompareJob,
    thirdJobClicks,
    handleThirdJobClick,
    resetDemoBug,
    setJudgeModeOpen,
    showToast,
  } = useApp();

  const [selectorOpen, setSelectorOpen] = useState(false);

  // Selected jobs objects
  const comparedJobs: JobPosting[] = selectedCompareJobIds
    .map(id => jobs.find(j => j.id === id))
    .filter((j): j is JobPosting => Boolean(j));

  // Handle clicking the fit score bar on the 3rd job (Intentional Demo Bug)
  const onFitBarClick = (jobIndex: number) => {
    if (jobIndex === 2) {
      // 3rd job
      handleThirdJobClick();
      if (thirdJobClicks === 0) {
        showToast('Async state delay observed: 3rd job fit bar did not refresh on 1st click.', 'warning');
      } else {
        showToast('2nd click registered: Async state synchronized and refreshed successfully!', 'success');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <GitCompare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Side-by-Side Job Comparison Matrix
            </h1>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {comparedJobs.length}/3 Selected
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Compare fit scores, corporate stability runway, turnover risk, and growth velocity
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Select Roles ({comparedJobs.length})</span>
          </button>

          <button
            onClick={() => setJudgeModeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors"
          >
            <Bug className="w-4 h-4 text-amber-400" />
            <span>Judge Demo Bug Guide</span>
          </button>
        </div>
      </div>

      {/* Role Picker Drawer (if open) */}
      {selectorOpen && (
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-4 backdrop-blur space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider">
              Choose up to 3 jobs for comparison:
            </span>
            <button
              onClick={() => setSelectorOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {jobs.map(j => {
              const selected = selectedCompareJobIds.includes(j.id);
              return (
                <button
                  key={j.id}
                  onClick={() => toggleCompareJob(j.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selected
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="line-clamp-1">
                    <span className="font-bold">{j.company}</span> - {j.title}
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 shrink-0 ml-2">
                    {j.matchBreakdown.fitPercentage}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Intentional Demo Bug Presenter Banner */}
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Bug className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>Live Hackathon Edge-Case Demo Bug:</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-200">
                Job #3 Fit Bar State
              </span>
            </div>
            <p className="text-amber-200/80 leading-relaxed">
              When 3 jobs are compared, the fit-score bar for the <strong>3rd job intentionally requires 2 clicks</strong> to update. Click the 3rd job fit bar below to trigger the bug live!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <span className="text-[11px] font-mono text-amber-300/80">
            Clicks on 3rd Job: <strong>{thirdJobClicks}</strong>
          </span>
          <button
            onClick={resetDemoBug}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-[11px] font-semibold transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Bug</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      {comparedJobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <GitCompare className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Jobs Selected for Comparison</h3>
          <p className="text-xs text-slate-400">
            Select 2 or 3 job postings from the Job Seeker dashboard to compare them side by side.
          </p>
          <Link
            href="/job-seeker"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <span>Back to Job Seeker Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparedJobs.map((job, idx) => {
            const isThirdJob = idx === 2;
            // Bug logic: if it's the 3rd job and clicks === 0, show stale / unhydrated 0% state!
            // When clicks >= 1, update to actual score!
            const displayedFitScore = isThirdJob
              ? thirdJobClicks === 0
                ? 0 // Stale un-updated bug state!
                : job.matchBreakdown.fitPercentage
              : job.matchBreakdown.fitPercentage;

            return (
              <div
                key={job.id}
                className={`rounded-2xl border p-5 backdrop-blur shadow-sm space-y-5 flex flex-col justify-between ${
                  isThirdJob
                    ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                {/* Job Card Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Comparison Slot #{idx + 1}
                    </span>
                    <button
                      onClick={() => toggleCompareJob(job.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400">{job.company}</span>
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                      {job.title}
                    </h3>
                  </div>

                  <div className="text-xs text-slate-300 font-mono flex items-center justify-between pt-1">
                    <span>{job.salaryRange}</span>
                    <span className="text-cyan-400">{job.workplaceType}</span>
                  </div>
                </div>

                {/* Section: Fit Score with Intentional Demo Bug */}
                <div
                  onClick={() => onFitBarClick(idx)}
                  className={`p-3.5 rounded-xl border space-y-2 transition-all cursor-pointer ${
                    isThirdJob
                      ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-400'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                  title={
                    isThirdJob
                      ? 'Click to test intentional demo bug (requires 2 clicks to refresh)'
                      : 'Fit Score'
                  }
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Candidate Fit Score
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isThirdJob && thirdJobClicks === 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
                      }`}
                    >
                      {displayedFitScore}%
                      {isThirdJob && thirdJobClicks === 0 && ' (Stale State)'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isThirdJob && thirdJobClicks === 0
                          ? 'bg-slate-800 w-0'
                          : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                      }`}
                      style={{ width: `${displayedFitScore}%` }}
                    ></div>
                  </div>

                  {isThirdJob && (
                    <div className="text-[10px] text-amber-300/80 italic flex items-center justify-between">
                      <span>{thirdJobClicks === 0 ? '👉 Click here to test async lag' : '✓ Synchronized on click #2'}</span>
                      <span className="font-mono text-amber-400">Click #{thirdJobClicks}</span>
                    </div>
                  )}
                </div>

                {/* Section: Company Stability / Job Security Signal */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      Company Stability
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {job.companyStability.score}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div>
                      <span className="text-slate-500">Runway:</span>{' '}
                      <strong className="text-slate-200">{job.companyStability.runwayMonths} mos</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Stage:</span>{' '}
                      <strong className="text-slate-200">{job.companyStability.fundingStage}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Glassdoor:</span>{' '}
                      <strong className="text-slate-200">★ {job.companyStability.glassdoorRating}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Turnover:</span>{' '}
                      <strong
                        className={
                          job.companyStability.turnoverRisk === 'Low'
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }
                      >
                        {job.companyStability.turnoverRisk}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Section: Growth Potential Index */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                      Growth Potential
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {job.growthPotential.score}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div>
                      <span className="text-slate-500">Promotion:</span>{' '}
                      <strong className="text-slate-200">{job.growthPotential.promotionPace}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Tech Stack:</span>{' '}
                      <strong className="text-slate-200">{job.growthPotential.techStackModernity}</strong>
                    </div>
                  </div>
                </div>

                {/* Required Tech Stack */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Core Stack
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.map(sk => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
