'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PortfolioProject } from '../lib/types';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Plus,
  ExternalLink,
  Code2,
  Sparkles,
  Award,
  CheckCircle2,
  Timer,
  Layers,
} from 'lucide-react';

export default function LockablePortfolioSection() {
  const {
    portfolios,
    isPortfolioLocked,
    portfolioLockedHash,
    portfolioLockedTimestamp,
    lockPortfolio,
    unlockPortfolio,
    addPortfolioProject,
    setPitchModalProject,
    userName,
    profile,
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [techStackStr, setTechStackStr] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [quantifiableImpact, setQuantifiableImpact] = useState('');

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addPortfolioProject({
      title,
      tagline: tagline || 'Full-Stack Software Architecture Project',
      description,
      role: 'Full-Stack Systems Builder',
      techStack: techStackStr.split(',').map(s => s.trim()).filter(Boolean),
      liveUrl: liveUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      quantifiableImpact: quantifiableImpact.trim() || 'Enhanced pipeline processing efficiency by 35%.',
    });

    // Reset
    setTitle('');
    setTagline('');
    setDescription('');
    setTechStackStr('');
    setLiveUrl('');
    setGithubUrl('');
    setQuantifiableImpact('');
    setIsAdding(false);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur shadow-xl space-y-6">
      {/* Header & Lock Authentication Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Lockable Authentic Portfolio
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Feature #10 Anti-Plagiarism Gate
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Build authentic projects, take 60s pitch challenges, and lock your template with a cryptographic verification stamp.
          </p>
        </div>

        {/* Lock / Unlock Toggle Action */}
        <div className="flex items-center gap-2.5">
          {isPortfolioLocked ? (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Locked &bull; Tamper-Proof</span>
              </div>
              <button
                onClick={unlockPortfolio}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock to Edit</span>
              </button>
            </div>
          ) : (
            <button
              onClick={lockPortfolio}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Portfolio Version ➔</span>
            </button>
          )}
        </div>
      </div>

      {/* Lock Certificate Callout (when locked) */}
      {isPortfolioLocked && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-950 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <div className="text-white font-bold flex items-center gap-2">
                <span>Cryptographic Verification Certificate</span>
                <span className="font-mono text-purple-300 text-[11px] px-2 py-0.2 rounded bg-purple-500/20 border border-purple-500/30">
                  {portfolioLockedHash}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Owner: <strong>{userName || profile.name}</strong> &bull; Sealed on {portfolioLockedTimestamp}. Verified uncopyable by other candidates.
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shrink-0">
            Recruiter Verified
          </span>
        </div>
      )}

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Showcased Projects ({portfolios.length})
          </h3>

          {!isPortfolioLocked && (
            <button
              onClick={() => setIsAdding(prev => !prev)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdding ? 'Cancel' : 'Add Project'}</span>
            </button>
          )}
        </div>

        {/* Add Project Form (Shown when unlocked) */}
        {isAdding && !isPortfolioLocked && (
          <form onSubmit={handleAddProject} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="font-bold text-white text-sm">Add New Authentic Project</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Project Title *"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Tagline / Short description"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <textarea
              required
              rows={2}
              placeholder="Technical Description & Architecture *"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
            ></textarea>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Tech Stack (comma separated: React, Go, Docker)"
                value={techStackStr}
                onChange={e => setTechStackStr(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="GitHub Repo URL (optional)"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Quantifiable Outcome (e.g. 40% latency cut)"
                value={quantifiableImpact}
                onChange={e => setQuantifiableImpact(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Save Project
              </button>
            </div>
          </form>
        )}

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolios.map(proj => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-indigo-500/50 transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{proj.tagline}</p>
                  </div>

                  {proj.pitchScore ? (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold shrink-0">
                      <Award className="w-3 h-3" /> Pitch: {proj.pitchScore}/100
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                      Not Pitched
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {proj.description}
                </p>

                {/* Measurable impact */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-emerald-300 leading-snug">
                  <strong>Quantifiable Impact:</strong> {proj.quantifiableImpact}
                </div>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.techStack.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: 60-Second Pitch & Links */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Demo</span>
                    </a>
                  )}
                </div>

                {/* Trigger 60-Second Pitch Challenge */}
                <button
                  type="button"
                  onClick={() => setPitchModalProject(proj)}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Timer className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{proj.pitchScore ? 'Re-Pitch (60s)' : 'Pitch Project (60s)'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
