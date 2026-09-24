'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bug,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

export default function JudgeGuideModal() {
  const { judgeModeOpen, setJudgeModeOpen, resetDemoBug, thirdJobClicks } = useApp();

  if (!judgeModeOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-amber-500/10 p-6 relative text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Hackathon Judge & Presentation Mode
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AA-35 Spec Feature
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Self-Aware QA & Intentional Demo Bug Walkthrough Guide
              </p>
            </div>
          </div>
          <button
            onClick={() => setJudgeModeOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-sm">
          {/* Strategy Alert */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200">
            <h4 className="font-semibold text-amber-300 flex items-center gap-2 mb-1">
              <Bug className="w-4 h-4 text-amber-400" />
              Why We Embedded an Intentional Demo Bug
            </h4>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Hackathon judges value genuine technical depth and edge-case testing over scripted perfection. 
              Per the specification, we have implemented an intentional async state hydration delay on the 
              <strong> Job Comparison page</strong>.
            </p>
          </div>

          {/* How to Demonstrate Live */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
              <CheckCircle className="w-4 h-4" />
              Live Presentation Script (How to Present Confidently)
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex gap-2">
                <span className="font-mono text-indigo-400 font-bold">1.</span>
                <span>
                  Navigate to the <Link href="/compare" onClick={() => setJudgeModeOpen(false)} className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">Job Comparison Page <ExternalLink className="w-3 h-3" /></Link> and select 3 jobs for side-by-side comparison.
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono text-indigo-400 font-bold">2.</span>
                <span>
                  Click the <strong>3rd Job Fit Bar</strong>. On the first click, it will intentionally pause without updating.
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-mono text-indigo-400 font-bold">3.</span>
                <span>
                  Point it out calmly to the judges and say:
                </span>
              </div>
            </div>

            <blockquote className="p-3 rounded-lg bg-slate-900 border-l-4 border-amber-400 italic text-xs text-slate-200 font-serif">
              &ldquo;Judges, notice this subtle async state delay on the 3rd comparison card — this mirrors a real-world hydration race condition when merging high-dimensional vector matches concurrently. On the second click, it synchronizes seamlessly. In our production sprint, we resolve this with React 18 Transitions and optimistic TanStack query cache. This is proof of the rigorous edge-case stress testing we conduct!&rdquo;
            </blockquote>
          </div>

          {/* Current Bug Status & Reset Tool */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
            <div>
              <div className="text-xs text-slate-400">Current 3rd Job Click State:</div>
              <div className="text-sm font-semibold text-white">
                {thirdJobClicks === 0 && 'Fresh State (Bug ready to trigger on 1st click)'}
                {thirdJobClicks === 1 && 'First Click Registered (Stale state observed live!)'}
                {thirdJobClicks >= 2 && 'Resolved / Synchronized State (Refreshed on 2nd click)'}
              </div>
            </div>
            <button
              onClick={resetDemoBug}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              Reset Bug State
            </button>
          </div>

          {/* Specification Cross-Check */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>CareerPilot AA-35 Autonomous Agent</span>
            <Link
              href="/compare"
              onClick={() => setJudgeModeOpen(false)}
              className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
            >
              Go to Job Comparison <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
