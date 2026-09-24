'use client';

import React, { useState } from 'react';
import { Application } from '../lib/types';
import { useApp } from '../context/AppContext';
import {
  X,
  FileText,
  Sparkles,
  CheckCircle,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Layers,
  FileCheck,
} from 'lucide-react';

interface ResumeDiffModalProps {
  application: Application | null;
  onClose: () => void;
}

export default function ResumeDiffModal({ application, onClose }: ResumeDiffModalProps) {
  const { approveApplication, rejectApplication } = useApp();
  const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter'>('resume');

  if (!application) return null;

  const handleApprove = () => {
    approveApplication(application.id);
    onClose();
  };

  const handleReject = () => {
    rejectApplication(application.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 relative text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Auto-Tailored Application & Human Checkpoint
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Diff Preview
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Target Role: <strong className="text-white">{application.jobTitle}</strong> &bull; {application.company}
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

        {/* Human in the loop guarantee banner */}
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-indigo-300">Strict Human Approval Enforced (AA-35):</span>{' '}
              <span className="text-slate-300">
                The autonomous agent paused before submitting. Nothing will be dispatched to {application.company} without your explicit review and sign-off.
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <span
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                application.status === 'Applied'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}
            >
              {application.status}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'resume'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tailored Resume Diff & Keywords</span>
          </button>
          <button
            onClick={() => setActiveTab('coverLetter')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'coverLetter'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>AI-Synthesized Cover Letter</span>
          </button>
        </div>

        {/* Tab 1: Resume Diff */}
        {activeTab === 'resume' && (
          <div className="space-y-6">
            {/* Injected Keywords Highlight */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Job-Specific Keywords Injected (Passes ATS Screeners)</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {application.tailoredKeywordsAdded.map(kw => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    +{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Side by side bullet point diffs */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bullet Point Enhancements (Original vs Tailored)</span>
              </h3>

              <div className="space-y-4">
                {application.tailoredBulletPoints.map((bp, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
                    <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="font-semibold text-slate-300">Experience Item #{idx + 1}</span>
                      <span className="text-indigo-400 font-mono text-[10px]">Rationale: {bp.reason}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-xs">
                      {/* Original */}
                      <div className="p-3.5 space-y-1.5 bg-red-950/10">
                        <div className="font-semibold text-rose-400/90 flex items-center gap-1.5 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-rose-500/50"></span>
                          Original Bullet (Generic)
                        </div>
                        <p className="text-slate-300/80 italic font-mono text-xs leading-relaxed">
                          &ldquo;{bp.original}&rdquo;
                        </p>
                      </div>

                      {/* Tailored */}
                      <div className="p-3.5 space-y-1.5 bg-emerald-950/20">
                        <div className="font-semibold text-emerald-400 flex items-center gap-1.5 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Tailored Bullet (Targeted & Quantified)
                        </div>
                        <p className="text-emerald-100 font-medium font-mono text-xs leading-relaxed">
                          &ldquo;{bp.tailored}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cover Letter */}
        {activeTab === 'coverLetter' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-line shadow-inner">
              {application.tailoredCoverLetter}
            </div>
            <div className="text-[11px] text-slate-400 italic">
              Tailored specifically to match {application.company}&apos;s engineering values, products, and culture.
            </div>
          </div>
        )}

        {/* Mandatory Action Checkpoint Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Current Status:{' '}
            <span className="font-semibold text-white">{application.status}</span>
            {application.humanApproved ? ' (Approved by you)' : ' (Awaiting your click)'}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleReject}
              disabled={application.status === 'Rejected'}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>Reject / Revise</span>
            </button>

            <button
              onClick={handleApprove}
              disabled={application.status === 'Applied'}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{application.status === 'Applied' ? 'Already Approved' : 'Approve & Submit'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
