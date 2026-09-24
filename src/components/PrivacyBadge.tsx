'use client';

import React from 'react';
import { ShieldCheck, Lock, Database } from 'lucide-react';

export default function PrivacyBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 shadow-sm">
      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
      <span>Zero Third-Party Cloud Data Leakage</span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      <span className="text-[10px] font-mono text-slate-500">Supabase RLS Enclave</span>
    </div>
  );
}
