'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function DataHealthBadge() {
  const { profile } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const passedCount = profile.dataHealthChecks.filter(c => c.passed).length;
  const totalCount = profile.dataHealthChecks.length;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 backdrop-blur shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center font-bold text-xs font-mono text-emerald-400">
              {profile.dataHealthScore}%
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Data Health & Validation</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {passedCount}/{totalCount} Validated
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cross-checking resume tokens against candidate target job criteria
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
        >
          <span className="text-[11px] font-medium hidden sm:inline">{isOpen ? 'Hide Checklist' : 'View Checklist'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-150">
          {profile.dataHealthChecks.map((item, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg text-xs flex items-start gap-2.5 ${
                item.passed
                  ? 'bg-emerald-950/20 text-emerald-300/90 border border-emerald-500/10'
                  : 'bg-amber-950/20 text-amber-300/90 border border-amber-500/20'
              }`}
            >
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-200">{item.label}</div>
                <div className="text-[11px] text-slate-400">{item.tip}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
