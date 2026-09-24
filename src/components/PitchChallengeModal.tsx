'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PitchEvaluationResult } from '../lib/types';
import { X, Timer, Play, RotateCcw, CheckCircle2, Sparkles, Mic, Award, AlertCircle } from 'lucide-react';

export default function PitchChallengeModal() {
  const { pitchModalProject, setPitchModalProject, evaluateAndSavePitch } = useApp();

  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [pitchText, setPitchText] = useState<string>('');
  const [result, setResult] = useState<PitchEvaluationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Reset when opening a project
  useEffect(() => {
    if (pitchModalProject) {
      setTimeLeft(60);
      setIsActive(false);
      setPitchText(pitchModalProject.pitchText || '');
      setResult(null);
    }
  }, [pitchModalProject]);

  if (!pitchModalProject) return null;

  const handleStartTimer = () => {
    setIsActive(true);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setTimeLeft(60);
  };

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const evaluation = evaluateAndSavePitch(pitchModalProject.id, pitchText);
      setResult(evaluation);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Timer className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                60-Second Project Pitch Challenge
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Coach
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pitch <strong>&quot;{pitchModalProject.title}&quot;</strong> to an engineering hiring manager in 60 seconds.
            </p>
          </div>

          <button
            onClick={() => setPitchModalProject(null)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live 60-Second Timer Bar */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-extrabold text-lg border transition-all ${
                timeLeft <= 10
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                  : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
              }`}
            >
              {timeLeft}s
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {isActive
                  ? 'Pitch in progress — speak or type your pitch'
                  : timeLeft === 0
                  ? "Time's up! Submit for AI critique"
                  : 'Click Start when ready to pitch'}
              </div>
              <p className="text-[11px] text-slate-400">
                Target: State the problem, your architectural solution, and measurable results.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isActive ? (
              <button
                type="button"
                onClick={handleStartTimer}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-all cursor-pointer"
              >
                Pause
              </button>
            )}

            <button
              type="button"
              onClick={handleResetTimer}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pitch Input Form */}
        <form onSubmit={handleEvaluate} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="font-semibold text-slate-300">
                Your 60-Second Verbal / Written Pitch:
              </label>
              <span className="font-mono text-[11px]">
                {pitchText.trim() ? pitchText.trim().split(/\s+/).length : 0} words
              </span>
            </div>

            <textarea
              required
              rows={4}
              value={pitchText}
              onChange={e => setPitchText(e.target.value)}
              placeholder="e.g., In this project, I identified a bottleneck where document retrieval was causing 400ms lag. To solve this, I designed an asynchronous ingestion pipeline in Python with Redis caching, which reduced p95 latency down to 38ms while handling 500 concurrent req/sec..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed shadow-inner"
            ></textarea>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Evaluates: Clarity (35%), Tech Depth (35%), Impact (30%)</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !pitchText.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Evaluating Pitch...' : 'Evaluate Pitch ➔'}</span>
            </button>
          </div>
        </form>

        {/* Pitch Evaluation Results Display */}
        {result && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-white">Evaluation Complete</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Composite Score:</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  {result.score}/100
                </span>
              </div>
            </div>

            {/* Score sub-bars */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-slate-400">Clarity</div>
                <div className="font-bold text-white mt-0.5">{result.clarityScore}/100</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-slate-400">Tech Depth</div>
                <div className="font-bold text-white mt-0.5">{result.technicalDepthScore}/100</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-slate-400">Impact</div>
                <div className="font-bold text-white mt-0.5">{result.impactScore}/100</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
              <strong>Coach Feedback:</strong> {result.feedback}
            </p>

            <div className="text-[11px] text-emerald-300 font-medium">
              &bull; Your Interview Readiness Score has been upgraded based on this pitch!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
