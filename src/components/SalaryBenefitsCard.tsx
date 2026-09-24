'use client';

import React from 'react';
import { JobPosting } from '../lib/types';
import { DollarSign, TrendingUp, CheckCircle2, Gift, ShieldCheck } from 'lucide-react';

interface SalaryBenefitsCardProps {
  job: JobPosting;
}

export default function SalaryBenefitsCard({ job }: SalaryBenefitsCardProps) {
  const benchmark = job.salaryBenchmark || {
    marketAvgSalary: '$140,000',
    comparisonPercent: 8,
    comparisonText: '+8% vs verified market benchmark',
    benefits: ['Comprehensive Medical, Dental & Vision', '401(k) Matching Program', 'Remote Work Setup Stipend', 'Generous Paid Time Off'],
  };

  const isAboveMarket = benchmark.comparisonPercent >= 0;

  return (
    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
      {/* Salary & Comparison Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Compensation &amp; Market Benchmark
          </span>
          <div className="text-base font-extrabold text-emerald-400 font-mono mt-0.5">
            {job.salaryRange}
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-mono border ${
              isAboveMarket
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}
          >
            {isAboveMarket ? `+${benchmark.comparisonPercent}%` : `${benchmark.comparisonPercent}%`} vs Market
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400">
        Estimated Market Average: <strong className="text-slate-300">{benchmark.marketAvgSalary}</strong> &bull; {benchmark.comparisonText}
      </p>

      {/* Benefits Summary List */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Gift className="w-3 h-3 text-cyan-400" />
          <span>Verified Benefits &amp; Perks Package</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {benchmark.benefits.map((b, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
