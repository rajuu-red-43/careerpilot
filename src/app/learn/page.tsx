'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import {
  CAREER_PATHS,
  CareerPath,
  getCareerPath,
} from '../../lib/learning/careerPaths';
import {
  VERIFIED_COURSES,
  Course,
  getCoursesTeachingSkill,
  getCoursesForCareerPath,
} from '../../lib/learning/courseDataset';
import {
  analyzeCareerSkillGap,
  SkillGapReport,
} from '../../lib/learning/matchingEngine';
import {
  studentSkillService,
  StudentProfileData,
} from '../../lib/learning/studentSkillService';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Award,
  Layers,
  Search,
  Filter,
  Flame,
  ChevronRight,
  PlusCircle,
  Check,
} from 'lucide-react';

export default function LearnPage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<StudentProfileData>(studentSkillService.getProfile());
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'recommended' | 'paths'>('all');
  const [selectedCareer, setSelectedCareer] = useState<CareerPath>(
    getCareerPath(profile.targetCareerId)
  );
  const [gapReport, setGapReport] = useState<SkillGapReport>(
    analyzeCareerSkillGap(profile.skills, profile.targetCareerId)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const updated = studentSkillService.getProfile();
    setProfile(updated);
    const career = getCareerPath(updated.targetCareerId);
    setSelectedCareer(career);
    setGapReport(analyzeCareerSkillGap(updated.skills, updated.targetCareerId));
  }, []);

  const handleCareerChange = (careerId: string) => {
    const updated = studentSkillService.setTargetCareer(careerId);
    setProfile(updated);
    const career = getCareerPath(careerId);
    setSelectedCareer(career);
    setGapReport(analyzeCareerSkillGap(updated.skills, careerId));
  };

  const handleToggleSkill = (skill: string) => {
    let updated: StudentProfileData;
    if (profile.skills.includes(skill)) {
      updated = studentSkillService.removeSkill(skill);
    } else {
      updated = studentSkillService.addSkill(skill);
    }
    setProfile(updated);
    setGapReport(analyzeCareerSkillGap(updated.skills, selectedCareer.id));
  };

  const handleCourseAction = (course: Course) => {
    const existing = profile.courseProgress.find(c => c.courseId === course.id);
    if (!existing) {
      const updated = studentSkillService.updateCourseProgress(course.id, course.title, 25);
      setProfile(updated);
    } else if (existing.progressPercent < 100) {
      const nextPercent = Math.min(100, existing.progressPercent + 25);
      const updated = studentSkillService.updateCourseProgress(course.id, course.title, nextPercent);
      if (nextPercent >= 100) {
        // Also award skills taught by this course
        for (const s of course.skills) {
          studentSkillService.addSkill(s);
        }
      }
      setProfile(studentSkillService.getProfile());
      setGapReport(analyzeCareerSkillGap(studentSkillService.getProfile().skills, selectedCareer.id));
    }
  };

  const filteredCourses = VERIFIED_COURSES.filter(c => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.provider.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    }
    if (activeTab === 'in_progress') {
      return profile.courseProgress.some(
        cp => cp.courseId === c.id && cp.status === 'in_progress'
      );
    }
    if (activeTab === 'recommended') {
      return gapReport.recommendedCourses.some(rc => rc.id === c.id);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Learn</h1>
          <p className="text-xs text-slate-400 mt-1">
            Verified courses & roadmaps to close your skill gaps.
          </p>
        </div>

        {/* Target Career Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 self-start">
          <span className="text-[11px] text-slate-400 px-2 font-medium">Target:</span>
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

      {/* Overview Cards: 3 Questions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: What Should I Learn */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">1. What to Learn</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {gapReport.nextSkillToLearn || 'All skills mastered!'}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {gapReport.skillsAwayCount > 0
                ? `${gapReport.skillsAwayCount} skills away from ${selectedCareer.title}`
                : 'Ready for target roles'}
            </p>
          </div>
          {/* Readiness Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-slate-400">Readiness</span>
              <span className="text-indigo-400 font-bold">{gapReport.readinessPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${gapReport.readinessPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Your Skills */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">2. Your Skills</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {gapReport.acquiredSkills.length} / {gapReport.acquiredSkills.length + gapReport.missingSkills.length}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Required skills mastered</p>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {gapReport.acquiredSkills.slice(0, 3).map(skill => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-medium text-emerald-300"
              >
                ✓ {skill}
              </span>
            ))}
            {gapReport.missingSkills.slice(0, 2).map(skill => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-[10px] font-medium text-slate-400"
              >
                ○ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Card 3: What to do Next */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">3. Next Step</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-white mt-3">
              Learn {gapReport.nextSkillToLearn || 'System Design'}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Top recommended course ready
            </p>
          </div>
          {gapReport.recommendedCourses[0] && (
            <button
              onClick={() => setSelectedCourse(gapReport.recommendedCourses[0])}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Explore Course</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Courses' },
            { id: 'recommended', label: 'Recommended for You' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'paths', label: 'Skills Checklist' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab !== 'paths' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search courses or skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      {activeTab === 'paths' ? (
        /* Skills Checklist View */
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60">
            <h2 className="text-sm font-bold text-white mb-1">
              Skills Needed for {selectedCareer.title}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Click any skill to toggle whether you have acquired it.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedCareer.learningOrder.map((skill, index) => {
                const isAcquired = profile.skills.some(
                  s => s.toLowerCase() === skill.toLowerCase()
                );
                return (
                  <div
                    key={skill}
                    onClick={() => handleToggleSkill(skill)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isAcquired
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono text-slate-500 w-4">
                        #{index + 1}
                      </span>
                      <span className="text-xs font-semibold">{skill}</span>
                    </div>
                    {isAcquired ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <PlusCircle className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Course Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 text-xs">
              No courses matching your filter.
            </div>
          ) : (
            filteredCourses.map(course => {
              const progress = profile.courseProgress.find(
                cp => cp.courseId === course.id
              );
              const isRecommended = gapReport.recommendedCourses.some(
                rc => rc.id === course.id
              );

              return (
                <div
                  key={course.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4 group"
                >
                  <div className="space-y-2.5">
                    {/* Provider & Badges */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-indigo-400 font-medium truncate max-w-[160px]">
                        {course.provider}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isRecommended && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 text-[10px] border border-indigo-500/40">
                            Fit
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                          {course.is_free ? 'Free' : course.price}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setSelectedCourse(course)}
                      className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2"
                    >
                      {course.title}
                    </h3>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {course.duration}
                      </span>
                      <span>•</span>
                      <span>{course.level}</span>
                    </div>

                    {/* Key Skills */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {course.skills.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded bg-slate-800/60 text-[10px] text-slate-300 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* In-Progress Bar */}
                    {progress && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Progress</span>
                          <span className="text-indigo-400 font-semibold">
                            {progress.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${progress.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleCourseAction(course)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-all text-center cursor-pointer"
                    >
                      {progress
                        ? progress.progressPercent >= 100
                          ? 'Completed ✓'
                          : 'Update Progress (+25%)'
                        : 'Start Learning'}
                    </button>
                    <a
                      href={course.provider_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
                      title="Open Course Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-indigo-400">
                  {selectedCourse.provider}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedCourse.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">Duration</span>
                {selectedCourse.duration}
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Level</span>
                {selectedCourse.level}
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Price</span>
                {selectedCourse.is_free ? 'Free' : selectedCourse.price}
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Verified Source</span>
                {selectedCourse.source} ({selectedCourse.last_verified_at})
              </div>
            </div>

            {/* Skills Learned */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Skills You Will Learn
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCourse.skills.map(s => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={selectedCourse.provider_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Visit Official Course</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => {
                  handleCourseAction(selectedCourse);
                  setSelectedCourse(null);
                }}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Mark as In-Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
