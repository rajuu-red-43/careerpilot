'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockJobs } from '../../data/mockJobs';
import { CAREER_PATHS, getCareerPath, CareerPath } from '../../lib/learning/careerPaths';
import {
  analyzeCareerSkillGap,
  calculateJobMatch,
  JobMatchResult,
} from '../../lib/learning/matchingEngine';
import {
  studentSkillService,
  StudentProfileData,
} from '../../lib/learning/studentSkillService';
import LockablePortfolioSection from '../../components/LockablePortfolioSection';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  ChevronRight,
  Plus,
  ExternalLink,
  Clock,
  Layers,
} from 'lucide-react';

export default function StudentDashboard() {
  const { profile, updateProfileSkills } = useApp();
  const { t } = useLanguage();

  const [studentData, setStudentData] = useState<StudentProfileData>(
    studentSkillService.getProfile()
  );
  const [selectedCareer, setSelectedCareer] = useState<CareerPath>(
    getCareerPath(studentData.targetCareerId)
  );

  useEffect(() => {
    const data = studentSkillService.getProfile();
    // Sync skills with app context if needed
    if (profile?.skills && profile.skills.length > 0) {
      for (const s of profile.skills) {
        studentSkillService.addSkill(s);
      }
    }
    const updated = studentSkillService.getProfile();
    setStudentData(updated);
    setSelectedCareer(getCareerPath(updated.targetCareerId));
  }, [profile?.skills]);

  const gapReport = analyzeCareerSkillGap(studentData.skills, selectedCareer.id);

  // Calculate job matches based on student's current skills
  const jobMatches: JobMatchResult[] = mockJobs
    .map(job => calculateJobMatch(studentData.skills, job))
    .sort((a, b) => b.matchScore - a.matchScore);

  const topJobMatches = jobMatches.slice(0, 3);

  const handleCareerChange = (careerId: string) => {
    const updated = studentSkillService.setTargetCareer(careerId);
    setStudentData(updated);
    setSelectedCareer(getCareerPath(careerId));
  };

  const handleToggleSkill = (skill: string) => {
    let updated: StudentProfileData;
    if (studentData.skills.includes(skill)) {
      updated = studentSkillService.removeSkill(skill);
    } else {
      updated = studentSkillService.addSkill(skill);
    }
    setStudentData(updated);
    if (updateProfileSkills) {
      updateProfileSkills(updated.skills);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Concise Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            Student Career Radar
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
            Good morning, {profile?.name?.split(' ')[0] || studentData.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Your career progress • Target: <strong className="text-slate-200">{selectedCareer.title}</strong>
          </p>
        </div>

        {/* Quick Career Goal Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 self-start">
          <span className="text-[11px] text-slate-400 px-2 font-medium">Goal:</span>
          <select
            value={selectedCareer.id}
            onChange={e => handleCareerChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
          >
            {CAREER_PATHS.map(path => (
              <option key={path.id} value={path.id}>
                {path.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Core Questions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Question 1: What Should I Learn? */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>1. What to Learn</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {gapReport.nextSkillToLearn || 'All skills ready!'}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {gapReport.skillsAwayCount > 0
                  ? `${gapReport.skillsAwayCount} skills away from this role`
                  : 'Ready for target interviews'}
              </p>
            </div>

            {/* Progress */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-slate-400">Readiness</span>
                <span className="text-indigo-400 font-bold">{gapReport.readinessPercentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${gapReport.readinessPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            href="/learn"
            className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Question 2: What Jobs Fit Me? */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>2. Jobs That Fit You</span>
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {jobMatches.filter(j => j.matchScore >= 60).length} Matching Jobs
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Based on your current skill profile
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              {topJobMatches.slice(0, 2).map(job => (
                <div
                  key={job.jobId}
                  className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80"
                >
                  <span className="text-slate-300 truncate max-w-[170px]">{job.jobTitle}</span>
                  <span className="font-mono text-emerald-400 font-bold text-[11px]">
                    {job.matchScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/job-seeker"
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Question 3: What Should I Do Next? */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>3. Next Step</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                Learn {gapReport.nextSkillToLearn || 'Next Core Skill'}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Closes your biggest job skill gap
              </p>
            </div>

            {gapReport.recommendedCourses[0] && (
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-indigo-400 font-semibold uppercase">
                  Top Recommended Course
                </span>
                <div className="text-xs font-bold text-white line-clamp-1">
                  {gapReport.recommendedCourses[0].title}
                </div>
                <div className="text-[10px] text-slate-400">
                  {gapReport.recommendedCourses[0].provider} • {gapReport.recommendedCourses[0].duration}
                </div>
              </div>
            )}
          </div>

          {gapReport.recommendedCourses[0] ? (
            <a
              href={gapReport.recommendedCourses[0].provider_url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
            >
              <span>Start Course</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link
              href="/learn"
              className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Browse Catalog</span>
            </Link>
          )}
        </div>
      </div>

      {/* Skills Checklist (Clean & Concise) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Skills Checklist</h2>
            <p className="text-xs text-slate-400">
              Required for {selectedCareer.title} • {gapReport.acquiredSkills.length} of{' '}
              {gapReport.acquiredSkills.length + gapReport.missingSkills.length} acquired
            </p>
          </div>
          <Link
            href="/learn"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Full Roadmap</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedCareer.learningOrder.map(skill => {
            const isAcquired = studentData.skills.some(
              s => s.toLowerCase() === skill.toLowerCase()
            );
            return (
              <button
                key={skill}
                type="button"
                onClick={() => handleToggleSkill(skill)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAcquired
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{isAcquired ? '✓' : '○'}</span>
                <span>{skill}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Recommended Courses</h2>
            <p className="text-xs text-slate-400">
              Directly targeted to close your skill gaps
            </p>
          </div>
          <Link
            href="/learn"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gapReport.recommendedCourses.slice(0, 3).map(course => (
            <div
              key={course.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-indigo-400 font-medium">{course.provider}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                    {course.is_free ? 'Free' : course.price}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-2">{course.title}</h3>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.level}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {course.skills.slice(0, 3).map(s => (
                    <span
                      key={s}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300 font-mono"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={course.provider_url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <span>Learn on {course.provider.split(' ')[0]}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Top Job Matches (Transparent Matching) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Top Job Matches</h2>
            <p className="text-xs text-slate-400">
              Transparent skill matching with real requirements
            </p>
          </div>
          <Link
            href="/job-seeker"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Explore All Jobs</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topJobMatches.map(match => (
            <div
              key={match.jobId}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{match.company}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold font-mono text-[11px] border border-emerald-500/40">
                    {match.matchScore}% Match
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white line-clamp-1">{match.jobTitle}</h3>
                <p className="text-[11px] text-slate-400 leading-snug">{match.explanation}</p>

                {/* Matched skills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {match.matchedSkills.slice(0, 3).map(s => (
                    <span
                      key={s}
                      className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 text-[9px] font-medium"
                    >
                      ✓ {s}
                    </span>
                  ))}
                  {match.missingSkills.slice(0, 2).map(s => (
                    <span
                      key={s}
                      className="px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 text-[9px] font-medium"
                    >
                      • {s}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/job-seeker"
                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <span>View Job Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="pt-4 border-t border-slate-800">
        <LockablePortfolioSection />
      </div>
    </div>
  );
}
