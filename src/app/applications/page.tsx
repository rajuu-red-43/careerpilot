'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application } from '../../lib/types';
import ResumeDiffModal from '../../components/ResumeDiffModal';
import BottleneckFunnel from '../../components/BottleneckFunnel';
import {
  FileCheck2,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function ApplicationsPage() {
  const { applications, approveApplication, rejectApplication } = useApp();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredApps = applications.filter(a => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Pending') return a.status === 'Pending Approval';
    if (statusFilter === 'Active') return a.status !== 'Pending Approval' && a.status !== 'Rejected';
    return a.status === statusFilter;
  });

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'Pending Approval':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse';
      case 'Applied':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Screening':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Interview':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Offered':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Application Tracker &amp; Review Queue
            </h1>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {applications.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Monitor active applications, inspection diffs, and follow-up reminder calendar
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'All' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('Pending')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'Pending' ? 'bg-amber-500/30 text-amber-200 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Checkpoint
          </button>
          <button
            onClick={() => setStatusFilter('Active')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'Active' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Pipeline
          </button>
        </div>
      </div>

      {/* Bottleneck Visualizer Component */}
      <BottleneckFunnel />

      {/* Applications Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur shadow-sm overflow-hidden space-y-0">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Submission Queue &amp; Follow-up Schedule</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredApps.length} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Role &amp; Company</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Fit Score</th>
                <th className="py-3 px-4">Status &amp; Human Approval</th>
                <th className="py-3 px-4">Follow-up Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredApps.map(app => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{app.jobTitle}</div>
                    <div className="text-slate-400 font-medium">{app.company}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{app.location}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {app.fitScore}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {app.humanApproved ? '✓ Human-Approved' : '⚠️ Awaiting Human Click'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{app.followUpDate}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                    >
                      Inspect Diff
                    </button>

                    {app.status === 'Pending Approval' && (
                      <button
                        onClick={() => approveApplication(app.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20 transition-all"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resume Diff and Review Modal */}
      <ResumeDiffModal application={selectedApp} onClose={() => setSelectedApp(null)} />
    </div>
  );
}
