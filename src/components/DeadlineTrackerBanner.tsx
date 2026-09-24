'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function DeadlineTrackerBanner() {
  const { applications } = useApp();

  // Find applications with urgent deadlines (pending approval or due within 48h)
  const urgentApps = applications.filter(
    a => a.status === 'Pending Approval' || (a.deadlineHoursLeft !== undefined && a.deadlineHoursLeft <= 48 && a.deadlineHoursLeft > 0)
  );

  if (urgentApps.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 p-4 shadow-lg backdrop-blur flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 animate-pulse">
          <Clock className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Application Deadline Alerts</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
              {urgentApps.length} Action Needed
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            {urgentApps[0].jobTitle} at {urgentApps[0].company}:{' '}
            <strong className="text-amber-300 font-semibold">{urgentApps[0].deadlineDate || 'Closing soon'}</strong>. Human approval checkpoint required before auto-dispatch.
          </p>
        </div>
      </div>

      <Link
        href="/applications"
        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 shrink-0 text-center flex items-center justify-center gap-1"
      >
        <span>Review Queue</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
