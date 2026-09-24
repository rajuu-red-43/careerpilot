'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Cpu,
  Clock,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Activity,
  Layers,
  FileCheck,
} from 'lucide-react';

export default function AutomationDrawer() {
  const { automationActive, toggleAutomation, automationLogs, triggerManualScan } = useApp();
  const [showLogs, setShowLogs] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-4">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
              automationActive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Cpu className={`w-5 h-5 ${automationActive ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                n8n Autonomous Workflow Agent
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  automationActive
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {automationActive ? 'Active Schedule: 08:00 AM' : 'Workflow Paused'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous background crawler matching jobs, generating diffs, and staging for approval
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={triggerManualScan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
            <span>Trigger Scan Now</span>
          </button>

          <button
            onClick={toggleAutomation}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              automationActive
                ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {automationActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Auto-Scan</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Enable Daily Auto-Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual n8n Workflow Canvas Nodes */}
      <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 overflow-x-auto">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Activity className="w-3.5 h-3.5" />
            Live Workflow Graph
          </span>
          <span className="text-slate-500">n8n Execution Pipeline</span>
        </div>

        <div className="flex items-center gap-2 min-w-[650px] py-2">
          {/* Node 1 */}
          <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 relative group">
            <div className="text-[10px] text-slate-400 font-mono">Trigger</div>
            <div className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-cyan-400" />
              Cron 08:00 AM
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Daily scheduled poll</div>
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950"></div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />

          {/* Node 2 */}
          <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 relative">
            <div className="text-[10px] text-slate-400 font-mono">Crawler</div>
            <div className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
              <Layers className="w-3 h-3 text-indigo-400" />
              Ingest Postings
            </div>
            <div className="text-[10px] text-slate-400 mt-1">APIs & Web Feeds</div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />

          {/* Node 3 */}
          <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 relative">
            <div className="text-[10px] text-slate-400 font-mono">Vector AI</div>
            <div className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-purple-400" />
              Fit Filter &gt; 80%
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Scoring transparency</div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />

          {/* Node 4 */}
          <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 relative">
            <div className="text-[10px] text-slate-400 font-mono">Generator</div>
            <div className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
              <FileCheck className="w-3 h-3 text-pink-400" />
              Tailor Resume Diff
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Keyword alignment</div>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />

          {/* Node 5 - Human Gate Checkpoint */}
          <div className="flex-1 bg-slate-900 border-2 border-amber-500/70 rounded-xl p-3 relative shadow-lg shadow-amber-500/10">
            <div className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              HUMAN GATE
            </div>
            <div className="text-xs font-bold text-amber-200 mt-0.5">
              Approval Check
            </div>
            <div className="text-[10px] text-amber-300/80 mt-1">Zero Blind Submit</div>
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-amber-400 animate-ping"></div>
          </div>
        </div>
      </div>

      {/* Toggle View Execution Logs */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          <span>{showLogs ? 'Hide Workflow Execution Logs' : 'View Real-Time Execution Logs'}</span>
          <span className="font-mono text-slate-500">({automationLogs.length} events)</span>
        </button>

        <span className="text-[11px] text-slate-500">
          Simulating n8n autonomous webhook triggers & execution traces
        </span>
      </div>

      {/* Logs View */}
      {showLogs && (
        <div className="space-y-2 pt-2 border-t border-slate-800 animate-in fade-in duration-150">
          {automationLogs.map(log => (
            <div
              key={log.id}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start justify-between gap-3 font-mono"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-semibold">{log.title}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold ${
                      log.status === 'paused_checkpoint'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {log.status === 'paused_checkpoint' ? 'Human Review Required' : 'Success'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans">{log.description}</div>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
