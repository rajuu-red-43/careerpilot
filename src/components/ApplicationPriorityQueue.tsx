'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Application } from '../lib/types';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Clock, AlertTriangle, Eye, Layers } from 'lucide-react';

interface ApplicationPriorityQueueProps {
  onSelectApplication: (app: Application) => void;
}

export default function ApplicationPriorityQueue({ onSelectApplication }: ApplicationPriorityQueueProps) {
  const { applications, setGraphicalFitJob, jobs } = useApp();
  const [activeTab, setActiveTab] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  // Categorize
  const highMatch = applications.filter(a => a.fitScore >= 85);
  const mediumMatch = applications.filter(a => a.fitScore >= 70 && a.fitScore < 85);
  const lowMatch = applications.filter(a => a.fitScore < 70);

  const displayedList =
    activeTab === 'High'
      ? highMatch
      : activeTab === 'Medium'
      ? mediumMatch
      : activeTab === 'Low'
      ? lowMatch
      : [...applications].sort((a, b) => b.fitScore - a.fitScore);

  const handleOpenRadar = (app: Application) => {
    const matchedJob = jobs.find(j => j.id === app.jobId);
    if (matchedJob) {
      setGraphicalFitJob(matchedJob);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 backdrop-blur shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Application Priority Queue
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Feature #6 Auto-Ranked
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Auto-sorted into High (85%+), Medium (70-84%), and Low (&lt;70%) match buckets to prioritize highest-ROI applications.
          </p>
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('All')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'All' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('High')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              activeTab === 'High' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400 hover:bg-slate-900'
            }`}
          >
            <span>High</span>
            <span className="text-[10px] font-mono">({highMatch.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('Medium')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              activeTab === 'Medium' ? 'bg-amber-600 text-white font-bold' : 'text-amber-400 hover:bg-slate-900'
            }`}
          >
            <span>Med</span>
            <span className="text-[10px] font-mono">({mediumMatch.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('Low')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              activeTab === 'Low' ? 'bg-rose-600 text-white font-bold' : 'text-rose-400 hover:bg-slate-900'
            }`}
          >
            <span>Low</span>
            <span className="text-[10px] font-mono">({lowMatch.length})</span>
          </button>
        </div>
      </div>

      {/* Priority List */}
      <div className="space-y-2.5">
        {displayedList.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
            No applications in this priority bucket.
          </div>
        ) : (
          displayedList.map(app => (
            <div
              key={app.id}
              className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{app.jobTitle}</span>
                  <span className="text-slate-400">&bull; {app.company}</span>
                  <span
                    className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded font-bold ${
                      app.fitScore >= 85
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : app.fitScore >= 70
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {app.fitScore >= 85 ? 'High Priority' : app.fitScore >= 70 ? 'Medium Priority' : 'Low Match'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Status: <strong className="text-slate-200">{app.status}</strong></span>
                  {app.deadlineDate && (
                    <span className="flex items-center gap-1 text-amber-400">
                      <Clock className="w-3 h-3" />
                      <span>{app.deadlineDate}</span>
                    </span>
                  )}
                  {app.rejectionReason && (
                    <span className="text-rose-400 font-medium">
                      Feedback: {app.rejectionCategory}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenRadar(app)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Layers className="w-3 h-3 text-cyan-400" />
                  <span>Fit Radar</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectApplication(app)}
                  className="px-3 py-1 rounded-lg text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
