'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, TrendingDown, CheckCircle2, ArrowRight } from 'lucide-react';

export default function BottleneckFunnel() {
  const { applications } = useApp();

  const totalScanned = 16;
  const filtered = 10;
  const tailored = applications.length; // usually 4
  const appliedCount = applications.filter(a => a.status === 'Applied' || a.status === 'Screening' || a.status === 'Interview' || a.status === 'Offered').length;
  const screeningCount = applications.filter(a => a.status === 'Screening' || a.status === 'Interview' || a.status === 'Offered').length;
  const interviewCount = applications.filter(a => a.status === 'Interview' || a.status === 'Offered').length;

  const stages = [
    { name: 'Jobs Scanned', count: totalScanned, color: 'from-blue-600 to-indigo-600', pct: 100 },
    { name: 'Fit Score > 80%', count: filtered, color: 'from-indigo-600 to-violet-600', pct: Math.round((filtered / totalScanned) * 100) },
    { name: 'Tailored Packet', count: tailored, color: 'from-violet-600 to-purple-600', pct: Math.round((tailored / totalScanned) * 100) },
    { name: 'Human Approved', count: appliedCount, color: 'from-purple-600 to-emerald-600', pct: Math.round((appliedCount / totalScanned) * 100) },
    { name: 'Screening', count: screeningCount, color: 'from-emerald-600 to-teal-600', pct: Math.round((screeningCount / totalScanned) * 100) },
    { name: 'Technical Interview', count: interviewCount, color: 'from-teal-600 to-cyan-500', pct: Math.round((interviewCount / totalScanned) * 100) },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Application Funnel & Bottleneck Visualizer
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Live Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Diagnosing stage drop-offs to improve conversion from application to offer
          </p>
        </div>

        {/* Bottleneck Diagnostic Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold self-start sm:self-auto">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Stage Bottleneck: Screening ➔ Interview</span>
        </div>
      </div>

      {/* Visual Funnel Bars */}
      <div className="space-y-2.5 pt-2">
        {stages.map((stage, idx) => (
          <div key={stage.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <span className="w-4 text-slate-500 font-mono text-[11px]">{idx + 1}.</span>
                {stage.name}
              </span>
              <span className="font-mono text-slate-400">
                <strong className="text-white">{stage.count}</strong> candidates ({stage.pct}%)
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${stage.color} transition-all duration-500`}
                style={{ width: `${Math.max(stage.pct, 8)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Diagnostic Insight Card */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-cyan-300">
          <TrendingDown className="w-4 h-4 text-cyan-400" />
          <span>AI Process Bottleneck Analysis</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          Strong top-of-funnel matching ({stages[1].count} jobs over 80% fit). Drop-off occurs at the 
          <strong> Technical Interview transition</strong>. Adding an open-source Next.js microservices 
          demo to your GitHub repo is projected to increase interview invite velocity by <strong>+35%</strong>.
        </p>
      </div>
    </div>
  );
}
