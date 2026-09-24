'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Target, Award, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function InterviewReadinessCard() {
  const { profile, portfolios } = useApp();

  const pitchedCount = portfolios.filter(p => Boolean(p.pitchScore)).length;
  const avgPitchScore = pitchedCount > 0
    ? Math.round(portfolios.reduce((acc, p) => acc + (p.pitchScore || 0), 0) / pitchedCount)
    : 70;

  const resumeCompleteness = Math.min(profile.dataHealthScore || 88, 100);
  const skillCoverage = Math.min(profile.skills.length * 10, 92);
  const compositeScore = Math.round(
    resumeCompleteness * 0.35 + avgPitchScore * 0.35 + skillCoverage * 0.3
  );

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Target className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>Interview Readiness Score</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Composite Metric
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Evaluates resume completeness, 60s project pitch fluency, and market skill coverage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono">
            {compositeScore}%
          </span>
        </div>
      </div>

      {/* Sub-bar metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Resume Completeness</span>
            <span className="font-bold text-white font-mono">{resumeCompleteness}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-500"
              style={{ width: `${resumeCompleteness}%` }}
            ></div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">60s Pitch Fluency</span>
            <span className="font-bold text-white font-mono">{avgPitchScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${avgPitchScore}%` }}
            ></div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Market Skill Match</span>
            <span className="font-bold text-white font-mono">{skillCoverage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${skillCoverage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tips to Boost */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-white">Actionable Coach Recommendation:</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {pitchedCount === 0
              ? 'Complete at least one 60-Second Project Pitch Challenge below to increase your verbal articulation score by +8%.'
              : 'Great job pitching! Lock your portfolio version to verify authentic ownership and bridge remaining system design gaps.'}
          </p>
        </div>
      </div>
    </div>
  );
}
