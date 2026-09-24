'use client';

import React from 'react';
import { JobPosting } from '../lib/types';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface WhyScoreModalProps {
  job: JobPosting | null;
  onClose: () => void;
}

export default function WhyScoreModal({ job, onClose }: WhyScoreModalProps) {
  if (!job) return null;

  const breakdown = job.matchBreakdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-lg">
              {breakdown.fitPercentage}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Transparent Score Breakdown
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Zero Black-Box AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {job.title} &bull; <span className="text-white font-medium">{job.company}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Executive Summary Rationale */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-indigo-400 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deterministic Match Rationale</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              &ldquo;{breakdown.rationale}&rdquo;
            </p>
          </div>

          {/* Mathematical Decomposition Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Weighted Scoring Formula</span>
              </h3>
              <span className="text-[11px] text-slate-500">Summation: Core 50% + Exp 25% + Domain 15% + Context 10%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 font-medium">Core Skills</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">
                  {breakdown.matchedSkills.reduce((acc, s) => acc + s.weight, 0)}%
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 font-medium">Experience Fit</div>
                <div className="text-base font-bold text-cyan-400 mt-0.5">
                  {breakdown.experienceMatchScore}%
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 font-medium">Domain Synergy</div>
                <div className="text-base font-bold text-indigo-400 mt-0.5">
                  {breakdown.domainMatchScore}%
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 font-medium">Overall Composite</div>
                <div className="text-base font-bold text-white mt-0.5">
                  {breakdown.fitPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Matched Skills vs Missing Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Skills */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Matched Skills ({breakdown.matchedSkills.length})</span>
              </div>
              <div className="space-y-2">
                {breakdown.matchedSkills.map(m => (
                  <div
                    key={m.skill}
                    className="flex items-center justify-between p-2 rounded-lg bg-emerald-900/20 border border-emerald-500/10 text-xs"
                  >
                    <span className="font-medium text-emerald-200">{m.skill}</span>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded">
                      +{m.weight}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Missing / Desired Skills ({breakdown.missingSkills.length})</span>
              </div>
              <div className="space-y-2">
                {breakdown.missingSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No missing skills detected! 100% skill coverage.</p>
                ) : (
                  breakdown.missingSkills.map(m => (
                    <div
                      key={m.skill}
                      className="p-2 rounded-lg bg-amber-900/20 border border-amber-500/10 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-amber-200">{m.skill}</span>
                        <span className="font-mono font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                          -{m.weight}%
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-300/70">{m.impact}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Company Stability & Growth Factor Signals */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Company Health & Growth Context</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Runway:</span>{' '}
                <span className="text-slate-300 font-medium">{job.companyStability.runwayMonths} months</span>
              </div>
              <div>
                <span className="text-slate-500">Stage:</span>{' '}
                <span className="text-slate-300 font-medium">{job.companyStability.fundingStage}</span>
              </div>
              <div>
                <span className="text-slate-500">Glassdoor:</span>{' '}
                <span className="text-slate-300 font-medium">★ {job.companyStability.glassdoorRating}</span>
              </div>
              <div>
                <span className="text-slate-500">Turnover:</span>{' '}
                <span className="text-slate-300 font-medium">{job.companyStability.turnoverRisk} Risk</span>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
