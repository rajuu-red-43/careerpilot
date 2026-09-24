'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, MessageSquareQuote, CheckCircle2, AlertCircle, ArrowRight, BookOpen, Layers } from 'lucide-react';

export default function RejectionFeedbackModal() {
  const { rejectionModalApp, setRejectionModalApp, markApplicationRejectedWithFeedback } = useApp();

  const [category, setCategory] = useState<'Skill Gap' | 'Experience Level' | 'System Design' | 'Cultural Fit / Other'>('Skill Gap');
  const [notes, setNotes] = useState<string>('');

  if (!rejectionModalApp) return null;

  const app = rejectionModalApp;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markApplicationRejectedWithFeedback(
      app.id,
      notes.trim() || `Recruiter cited ${category} as the primary consideration factor.`,
      category
    );
    setRejectionModalApp(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <MessageSquareQuote className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Application Feedback Memory
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              {app.jobTitle} &bull; <strong className="text-slate-300">{app.company}</strong>
            </p>
          </div>

          <button
            onClick={() => setRejectionModalApp(null)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Record why this application didn’t proceed. CareerPilot’s feedback memory analyzes multi-rejection patterns to suggest precise portfolio &amp; skill corrections.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">
              Primary Factor / Reason Cited:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Skill Gap', 'System Design', 'Experience Level', 'Cultural Fit / Other'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    category === cat
                      ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-md shadow-indigo-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes / Recruiter Feedback */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">
              Optional Notes / Feedback from Email or Interview:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Recruiter mentioned they were looking for candidates with more deep Kubernetes and cloud failover experience..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed shadow-inner"
            ></textarea>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setRejectionModalApp(null)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Skip Feedback
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20"
            >
              Save to Memory &amp; Generate Advice ➔
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
