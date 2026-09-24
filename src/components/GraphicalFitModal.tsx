'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { JobPosting } from '../lib/types';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp, Layers, HelpCircle, Sparkles } from 'lucide-react';

export default function GraphicalFitModal() {
  const { graphicalFitJob, setGraphicalFitJob, profile } = useApp();

  if (!graphicalFitJob) return null;

  const job = graphicalFitJob;
  const breakdown = job.matchBreakdown;

  // Radar / Multi-axis dimensions (0 - 100)
  const dimensions = [
    { label: 'Skill Match', value: breakdown.fitPercentage, color: 'from-cyan-500 to-blue-500', fill: 'bg-cyan-500' },
    { label: 'Experience Level', value: breakdown.experienceMatchScore, color: 'from-emerald-500 to-teal-500', fill: 'bg-emerald-500' },
    { label: 'Domain Synergy', value: breakdown.domainMatchScore, color: 'from-purple-500 to-indigo-500', fill: 'bg-purple-500' },
    { label: 'Company Stability', value: job.companyStability.score, color: 'from-amber-500 to-orange-500', fill: 'bg-amber-500' },
    { label: 'Growth Potential', value: job.growthPotential.score, color: 'from-pink-500 to-rose-500', fill: 'bg-pink-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Graphical Fit Visualization
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Multi-Vector Analysis
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {job.title} &bull; <strong className="text-slate-300">{job.company}</strong>
            </p>
          </div>

          <button
            onClick={() => setGraphicalFitJob(null)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Fit Score Gauge Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center">
                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 font-mono">
                  {breakdown.fitPercentage}%
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Vector Fit Confidence</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Range: {Math.max(breakdown.fitPercentage - 3, 50)}% - {Math.min(breakdown.fitPercentage + 2, 100)}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Computed via CareerPilot transparent deterministic scoring model (zero black-box algorithms)
              </p>
            </div>
          </div>
        </div>

        {/* 5-Axis Horizontal Comparison Bars */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Vector Dimension Breakdown
          </h3>
          <div className="space-y-3">
            {dimensions.map(dim => (
              <div key={dim.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{dim.label}</span>
                  <span className="text-white font-mono font-bold">{dim.value}/100</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${dim.color} transition-all duration-500`}
                    style={{ width: `${dim.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matched vs Missing Skills Visual Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Matched Skills */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Matched Skills ({breakdown.matchedSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {breakdown.matchedSkills.map(m => (
                <span
                  key={m.skill}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/15 text-emerald-200 border border-emerald-500/30"
                >
                  +{m.weight}% &bull; {m.skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Missing Prerequisites ({breakdown.missingSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {breakdown.missingSkills.length > 0 ? (
                breakdown.missingSkills.map(ms => (
                  <span
                    key={ms.skill}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/15 text-amber-200 border border-amber-500/30"
                  >
                    -{ms.weight}% &bull; {ms.skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">100% of required skills present</span>
              )}
            </div>
          </div>
        </div>

        {/* Mathematical Rationale */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
          <div className="font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mathematical Formula Rationale</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {breakdown.rationale}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={() => setGraphicalFitJob(null)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close Visualization
          </button>
        </div>
      </div>
    </div>
  );
}
