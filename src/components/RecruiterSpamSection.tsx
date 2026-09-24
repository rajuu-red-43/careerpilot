'use client';

import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, AlertTriangle, UserX, Info } from 'lucide-react';

interface QuarantinedCandidate {
  name: string;
  role: string;
  fitScore: number;
  reason: string;
  category: 'Low Fit Match (<50%)' | 'Duplicate Submission' | 'Blanket Spam Pattern';
}

export default function RecruiterSpamSection() {
  const [isOpen, setIsOpen] = useState(false);

  const quarantinedList: QuarantinedCandidate[] = [
    {
      name: 'Bot_Submitter_99',
      role: 'Generic Applicant',
      fitScore: 22,
      category: 'Blanket Spam Pattern',
      reason: 'Quarantined by AA-35 Anti-Spam Gate: Blanket submission lacking human-in-the-loop review packet.',
    },
    {
      name: 'Duplicate_Lead_Agency_8',
      role: 'Frontend Candidate',
      fitScore: 35,
      category: 'Duplicate Submission',
      reason: 'Identical resume tokens already received from a separate third-party recruiting agency feed.',
    },
    {
      name: 'Unqualified_Sub_14',
      role: 'Entry Applicant',
      fitScore: 28,
      category: 'Low Fit Match (<50%)',
      reason: 'Zero overlap with required engineering stack [Next.js, TypeScript, PostgreSQL].',
    },
  ];

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 overflow-hidden text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-rose-950/30 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">
                Recruiter Spam Filtered Applications ({quarantinedList.length})
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Feature #15 Quarantined
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Low-fit (&lt;50%) and duplicate content submissions automatically separated to keep your review queue clean
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-xs">
          <span>{isOpen ? 'Collapse Filtered' : 'Inspect Filtered'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 pt-1 space-y-3 border-t border-rose-500/20 bg-slate-950/60">
          {quarantinedList.map((cand, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/15 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserX className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-bold text-white">{cand.name}</span>
                  <span className="text-slate-400">&bull; {cand.role}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  Fit: {cand.fitScore}%
                </span>
              </div>
              <div className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                <span className="text-rose-400 font-semibold">{cand.category}:</span> {cand.reason}
              </div>
            </div>
          ))}
          <div className="text-[11px] text-slate-500 italic text-center pt-1">
            These candidates are hidden from your primary pipeline. No false positive rejections are dispatched unilaterally.
          </div>
        </div>
      )}
    </div>
  );
}
