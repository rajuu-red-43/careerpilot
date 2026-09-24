'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  DollarSign,
  UserCheck,
  Filter,
  ArrowRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

function InternshipsContent() {
  const { internships, applyToInternship, role, profile } = useApp();
  const searchParams = useSearchParams();
  const initialSkillFilter = searchParams.get('skill') || 'All';

  const [selectedSkill, setSelectedSkill] = useState<string>(initialSkillFilter);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const allSkills = Array.from(
    new Set(internships.flatMap(i => i.targetSkills))
  );

  const filteredInternships = internships.filter(item => {
    if (selectedSkill !== 'All' && !item.targetSkills.some(s => s.toLowerCase() === selectedSkill.toLowerCase())) {
      return false;
    }
    if (selectedDifficulty !== 'All' && item.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Internship &amp; Upskilling Board
            </h1>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Feature #11
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Targeted hands-on opportunities matched to your missing skill checklist. Bridge experience gaps with direct mentorship.
          </p>
        </div>

        <Link
          href={role === 'college_student' ? '/student#skill-gap' : '/job-seeker'}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Back to Skill Gap Checklist</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Skill:</span>
          </span>
          <button
            onClick={() => setSelectedSkill('All')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              selectedSkill === 'All'
                ? 'bg-cyan-600 text-white border-cyan-500 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Skills
          </button>
          {allSkills.map(sk => (
            <button
              key={sk}
              onClick={() => setSelectedSkill(sk)}
              className={`px-2.5 py-1 rounded-lg border transition-all ${
                selectedSkill.toLowerCase() === sk.toLowerCase()
                  ? 'bg-cyan-600 text-white border-cyan-500 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {sk}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Level:</span>
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-2 py-0.5 rounded-lg border text-[11px] transition-all ${
                selectedDifficulty === diff
                  ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Internship Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredInternships.map(intern => (
          <div
            key={intern.id}
            className="p-6 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {intern.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-semibold text-slate-200">{intern.company}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {intern.location}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border shrink-0 ${
                    intern.difficulty === 'Beginner'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : intern.difficulty === 'Intermediate'
                      ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                  }`}
                >
                  {intern.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {intern.description}
              </p>

              {/* Stipend, duration, mentor */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Monthly Stipend</span>
                  <span className="font-bold text-emerald-400 font-mono">{intern.stipend}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Duration &amp; Spots</span>
                  <span className="font-bold text-white">{intern.duration} ({intern.spotsLeft} left)</span>
                </div>
              </div>

              {/* Mentor quote */}
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Mentor: <strong>{intern.mentorName}</strong> &bull; {intern.mentorTitle}
                </span>
              </div>

              {/* Target skill tags */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  Skills You Will Master:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {intern.targetSkills.map(sk => (
                    <span
                      key={sk}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom action row */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Apply: {intern.deadlineDate}</span>
              </span>

              <button
                type="button"
                onClick={() => applyToInternship(intern.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Stage Application (Human Gate)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InternshipsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs">Loading verified internship postings...</p>
        </div>
      }
    >
      <InternshipsContent />
    </Suspense>
  );
}
