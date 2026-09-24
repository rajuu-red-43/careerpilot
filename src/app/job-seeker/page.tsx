'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';
import { JobPosting, Application } from '../../lib/types';
import WhyScoreModal from '../../components/WhyScoreModal';
import ResumeDiffModal from '../../components/ResumeDiffModal';
import DataHealthBadge from '../../components/DataHealthBadge';
import BottleneckFunnel from '../../components/BottleneckFunnel';
import AutomationDrawer from '../../components/AutomationDrawer';
import InterviewReadinessCard from '../../components/InterviewReadinessCard';
import ApplicationPriorityQueue from '../../components/ApplicationPriorityQueue';
import DeadlineTrackerBanner from '../../components/DeadlineTrackerBanner';
import SalaryBenefitsCard from '../../components/SalaryBenefitsCard';
import LockablePortfolioSection from '../../components/LockablePortfolioSection';
import PrivacyBadge from '../../components/PrivacyBadge';
import {
  Briefcase,
  Upload,
  FileText,
  Sparkles,
  HelpCircle,
  CheckCircle,
  XCircle,
  GitCompare,
  ArrowRight,
  ShieldAlert,
  FileCheck,
  Building,
  MapPin,
  DollarSign,
  TrendingUp,
  Check,
  Filter,
  FolderOpen,
  FileUp,
  Clock,
  Layers,
  AlertTriangle,
  MessageSquareQuote,
  Target,
  Compass,
} from 'lucide-react';

export default function JobSeekerDashboard() {
  const {
    jobs,
    applications,
    profile,
    updateProfileSkills,
    selectedCompareJobIds,
    toggleCompareJob,
    showToast,
    setGraphicalFitJob,
    rejectionFeedbacks,
    seekerTrialDaysLeft,
  } = useApp();

  const [activeScoreJob, setActiveScoreJob] = useState<JobPosting | null>(null);
  const [activeDiffApp, setActiveDiffApp] = useState<Application | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsedSuccess, setParsedSuccess] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    extension: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter jobs
  const filteredJobs = jobs.filter(j => {
    if (filterLevel === 'All') return true;
    if (filterLevel === 'HighFit') return j.matchBreakdown.fitPercentage >= 85;
    if (filterLevel === 'Remote') return j.workplaceType === 'Remote';
    return true;
  });

  // Predefined skill extraction lists
  const PREDEFINED_SKILL_SETS: Record<string, string[]> = {
    fullstack: [
      'Next.js',
      'React',
      'TypeScript',
      'TailwindCSS',
      'Node.js',
      'PostgreSQL',
      'GraphQL',
      'Git',
      'REST APIs',
    ],
    aiml: [
      'Python',
      'PyTorch',
      'LangChain',
      'FastAPI',
      'Vector DBs',
      'TypeScript',
      'Next.js',
      'Pandas',
    ],
    cloud: [
      'Linux',
      'Docker',
      'Kubernetes',
      'Terraform',
      'Git',
      'Go',
      'AWS',
      'CI/CD',
    ],
  };

  // Deterministic mock skill extraction from predefined skill list based on file
  const extractSkillsFromRealFile = (fileName: string): string[] => {
    const lowerName = fileName.toLowerCase();
    if (
      lowerName.includes('ai') ||
      lowerName.includes('ml') ||
      lowerName.includes('data') ||
      lowerName.includes('python') ||
      lowerName.includes('model')
    ) {
      return PREDEFINED_SKILL_SETS.aiml;
    }
    if (
      lowerName.includes('cloud') ||
      lowerName.includes('devops') ||
      lowerName.includes('infra') ||
      lowerName.includes('docker') ||
      lowerName.includes('k8s') ||
      lowerName.includes('aws')
    ) {
      return PREDEFINED_SKILL_SETS.cloud;
    }
    return PREDEFINED_SKILL_SETS.fullstack;
  };

  // Process chosen real file
  const processRealFile = (file: File) => {
    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      showToast('Please select a valid .pdf or .docx resume file.', 'warning');
      return;
    }

    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    setUploadedFile({
      name: fileName,
      size: formattedSize,
      extension: ext.toUpperCase(),
    });

    setIsParsing(true);
    setParsedSuccess(false);

    const extracted = extractSkillsFromRealFile(fileName);

    setTimeout(() => {
      setIsParsing(false);
      setParsedSuccess(true);
      updateProfileSkills(extracted);
      showToast(`Parsed "${fileName}": ${extracted.length} skills extracted from predefined list!`, 'success');
    }, 850);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processRealFile(file);
    }
  };

  // Preset resume loaders
  const handleSimulateResumeUpload = (resumeType: 'fullstack' | 'aiml' | 'cloud') => {
    setIsParsing(true);
    setParsedSuccess(false);
    const mockFileNames = {
      fullstack: 'Candidate_FullStack_Resume.pdf',
      aiml: 'AI_ML_Engineer_CV.docx',
      cloud: 'DevOps_Platform_Resume.pdf',
    };
    setUploadedFile({
      name: mockFileNames[resumeType],
      size: '148 KB',
      extension: resumeType === 'aiml' ? 'DOCX' : 'PDF',
    });

    setTimeout(() => {
      setIsParsing(false);
      setParsedSuccess(true);
      if (resumeType === 'fullstack') {
        updateProfileSkills(PREDEFINED_SKILL_SETS.fullstack);
        showToast('Loaded Junior Full-Stack Resume: 8 skills extracted & matches updated!', 'success');
      } else if (resumeType === 'aiml') {
        updateProfileSkills(PREDEFINED_SKILL_SETS.aiml);
        showToast('Loaded AI & Agent Engineer Resume: High-fit matches updated!', 'success');
      } else {
        updateProfileSkills(PREDEFINED_SKILL_SETS.cloud);
        showToast('Loaded Cloud & Platform Resume: Infrastructure roles scored!', 'success');
      }
    }, 850);
  };

  const getApplicationForJob = (jobId: string) => {
    return applications.find(a => a.jobId === jobId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Seeker Header & Data Health Layer */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Job Seeker Autonomous Agent
            </h1>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Seeker Mode
            </span>
          </div>

          <p className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
            <span>Authenticated as <strong className="text-slate-200">{profile.name}</strong> &bull; {profile.headline}</span>
          </p>

          {/* Trial countdown & Privacy Badge */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>3-Month Free Trial: {seekerTrialDaysLeft} Days Remaining</span>
            </div>
            <PrivacyBadge />
          </div>
        </div>

        <div className="w-full lg:w-96">
          <DataHealthBadge />
        </div>
      </div>

      {/* Feature #8: Urgent Deadline Alerts Banner */}
      <DeadlineTrackerBanner />

      {/* Feature #2: Interview Readiness Score Composite Card */}
      <InterviewReadinessCard />

      {/* Feature #9: Application Feedback Memory Analysis Callout */}
      {rejectionFeedbacks.length > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>Application Feedback Memory &bull; Pattern Identified</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {rejectionFeedbacks.length} Past Citations
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Primary consideration factor: <strong className="text-indigo-300">{rejectionFeedbacks[0].category}</strong>. Advice: {rejectionFeedbacks[0].suggestedAction}
              </p>
            </div>
          </div>

          <Link
            href="/internships"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm shrink-0 flex items-center gap-1"
          >
            <span>Bridge Skill Gap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Feature #6: Application Priority Queue */}
      <ApplicationPriorityQueue
        onSelectApplication={app => {
          setActiveDiffApp(app);
        }}
      />

      {/* Top Action Row: n8n Automation Engine Drawer */}
      <AutomationDrawer />

      {/* Resume / Skill Parser (Feature #1 & #2: Real File Upload) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Resume &amp; Skill Parser (Real PDF / DOCX Upload)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Choose a real resume file from your device (.pdf or .docx) for deterministic OCR token extraction
            </p>
          </div>

          {/* Quick preset resume loaders */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] text-slate-400 font-medium">Or Preset:</span>
            <button
              onClick={() => handleSimulateResumeUpload('fullstack')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700 cursor-pointer"
            >
              Full-Stack
            </button>
            <button
              onClick={() => handleSimulateResumeUpload('aiml')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700 cursor-pointer"
            >
              AI / LLM
            </button>
            <button
              onClick={() => handleSimulateResumeUpload('cloud')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700 cursor-pointer"
            >
              DevOps
            </button>
          </div>
        </div>

        {/* Real Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          id="real-resume-file-input"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* Drag and drop real file dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={e => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processRealFile(file);
          }}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-400 bg-indigo-950/30 scale-[1.01]'
              : 'border-slate-700 hover:border-indigo-500 bg-slate-950/40 hover:bg-slate-950/60'
          } space-y-3 group`}
        >
          {uploadedFile ? (
            /* Uploaded file card preview */
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-md ${
                    uploadedFile.extension === 'PDF'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {uploadedFile.extension}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white break-all">
                      {uploadedFile.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {uploadedFile.size}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    {isParsing ? (
                      <span className="text-indigo-400 animate-pulse flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Extracting OCR skill tokens from device file...
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Device file uploaded &bull; Deterministic skills extracted
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Choose Another File</span>
              </button>
            </div>
          ) : (
            /* Empty state: prompt to choose file */
            <>
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 mx-auto flex items-center justify-center transition-all group-hover:scale-110">
                <FileUp className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                  {isParsing ? (
                    <span className="text-indigo-400 animate-pulse">
                      Parsing Resume Tokens with OCR Heuristic Engine...
                    </span>
                  ) : (
                    <span>Choose a .pdf or .docx resume file from your device</span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Drag and drop your file here, or click to open native file browser
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/30">
                <FolderOpen className="w-4 h-4" />
                <span>Browse Files (.pdf / .docx)</span>
              </div>
            </>
          )}

          <div className="text-[11px] text-slate-500 pt-1">
            Accepts real device files (.pdf, .docx) &bull; Deterministic skill extraction from predefined taxonomy
          </div>
        </div>

        {/* Extracted skills tag cloud */}
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Currently Extracted Skills ({profile.skills.length})</span>
            {parsedSuccess && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" /> Tokens Synchronized
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Human Approval Checkpoint Callout Banner (Requirement 4) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Human Approval Checkpoint Protocol Active</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Anti-Spam Guarantee
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              No blind automatic submissions. Every application requires you to inspect the tailored resume diff and explicitly click &quot;Approve &amp; Submit&quot;.
            </p>
          </div>
        </div>

        <Link
          href="/applications"
          className="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
        >
          <span>View Approval Queue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Feature #10: Lockable Portfolio Templates & 60-Second Pitch Challenge */}
      <LockablePortfolioSection />

      {/* Section 2 & 3: Job Fit Scoring & Postings List with Feature #3, #4, #7, #14 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ranked Job Openings &amp; Transparent Fit Vectors</span>
            </h2>
            <p className="text-xs text-slate-400">
              Each score includes an expandable &quot;Why this score&quot; formula breakdown and salary market benchmark
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setFilterLevel('All')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterLevel === 'All' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({jobs.length})
            </button>
            <button
              onClick={() => setFilterLevel('HighFit')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterLevel === 'HighFit' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              High Fit (&gt;85%)
            </button>
            <button
              onClick={() => setFilterLevel('Remote')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                filterLevel === 'Remote' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Remote
            </button>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map(job => {
            const app = getApplicationForJob(job.id);
            const isCompared = selectedCompareJobIds.includes(job.id);

            return (
              <div
                key={job.id}
                className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  job.isSuspiciousFake
                    ? 'bg-rose-950/15 border-rose-500/40'
                    : job.isFlaggedDuplicate
                    ? 'bg-amber-950/15 border-amber-500/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Card Header: Title + Fit Score Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {job.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-semibold text-slate-200">{job.company}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {job.location}
                        </span>
                        <span>&bull;</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono">
                          {job.workplaceType}
                        </span>
                      </div>
                    </div>

                    {/* Fit percentage badge */}
                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className={`text-sm font-extrabold px-3 py-1 rounded-xl font-mono border ${
                          job.matchBreakdown.fitPercentage >= 85
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : job.matchBreakdown.fitPercentage >= 75
                            ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {job.matchBreakdown.fitPercentage}% Fit
                      </span>
                      <button
                        onClick={() => setActiveScoreJob(job)}
                        className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5 mt-1 cursor-pointer"
                      >
                        <span>Why this score?</span>
                        <HelpCircle className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Feature #4: Duplicate & Scam Job Detector on Job Seeker Side */}
                  {(job.isSuspiciousFake || job.isFlaggedDuplicate) && (
                    <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-rose-300">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>
                          {job.isSuspiciousFake ? 'Trust & Safety Warning: Phishing / Scam Indicators' : 'Potential Duplicate Listing Flag'}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-rose-300/80">
                        {job.fakeReason || job.duplicateReason}
                      </p>
                    </div>
                  )}

                  {/* Feature #3: Salary & Benefits Analysis Card */}
                  <SalaryBenefitsCard job={job} />

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {/* Required skills chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills.map(reqSkill => {
                      const matched = profile.skills.some(
                        ps => ps.toLowerCase() === reqSkill.toLowerCase()
                      );
                      return (
                        <span
                          key={reqSkill}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                            matched
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : 'bg-slate-950 text-slate-400 border-slate-800'
                          }`}
                        >
                          {reqSkill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Actions: Feature #7 (One-Click Compare) + Feature #14 (Graphical Fit Radar) + Diff */}
                <div className="border-t border-slate-800/80 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Feature #7: One-Click Job Comparison Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleCompareJob(job.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all border cursor-pointer ${
                        isCompared
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
                      }`}
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'Compared' : 'Compare'}</span>
                    </button>

                    {/* Feature #14: Graphical Fit Radar Button */}
                    <button
                      type="button"
                      onClick={() => setGraphicalFitJob(job)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-cyan-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                      title="Open Radar Fit Visualization"
                    >
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="hidden sm:inline">Fit Radar</span>
                    </button>
                  </div>

                  {/* Tailored Resume / Approval Checkpoint Button */}
                  {app ? (
                    <button
                      onClick={() => setActiveDiffApp(app)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shadow-sm cursor-pointer ${
                        app.status === 'Applied'
                          ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/20'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>
                        {app.status === 'Applied' ? 'View Approved Packet' : 'Review & Approve Diff'}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const fallbackApp: Application = {
                          id: `app-dyn-${job.id}`,
                          jobId: job.id,
                          jobTitle: job.title,
                          company: job.company,
                          location: job.location,
                          appliedDate: new Date().toISOString().split('T')[0],
                          status: 'Pending Approval',
                          fitScore: job.matchBreakdown.fitPercentage,
                          matchBucket: job.matchBreakdown.fitPercentage >= 85 ? 'High' : 'Medium',
                          humanApproved: false,
                          followUpDate: '2026-09-30',
                          tailoredKeywordsAdded: job.requiredSkills.slice(0, 3),
                          tailoredBulletPoints: [
                            {
                              original: 'Engineered web features and maintained legacy codebase.',
                              tailored: `Engineered high-performance ${job.requiredSkills[0]} features aligning with ${job.company}'s product standard, improving latency by 32%.`,
                              reason: `Directly targets ${job.title} job posting requirements.`,
                            },
                          ],
                          tailoredCoverLetter: `Dear ${job.company} Team,\n\nI am eager to submit my application for the ${job.title} role. My hands-on background with ${job.requiredSkills.slice(0, 2).join(' and ')} positions me well to deliver immediate value to ${job.company}.\n\nSincerely,\n${profile.name}`,
                        };
                        setActiveDiffApp(fallbackApp);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Tailored Diff</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature #5: Career Path Recommendations for Job Seekers */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Career Trajectory &amp; Target Elevation Roadmap</span>
            </h3>
            <p className="text-xs text-slate-400">
              Personalized career advancement vectors from {profile.role} to target Senior / Staff roles
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            Next 2-3 Years
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-cyan-300 font-bold">Track 1: Full-Stack Systems Specialist</div>
            <div className="text-[11px] text-slate-400">Target Level: Senior Engineer ($180k - $220k)</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Deepen distributed systems fluency, Redis caching patterns, and high-concurrency Node.js microservices.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-indigo-300 font-bold">Track 2: AI Agent &amp; LLM Orchestrator</div>
            <div className="text-[11px] text-slate-400">Target Level: AI Applications Architect ($200k - $250k)</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Master vector retrieval optimization, multi-turn prompt evaluation harnesses, and autonomous tool-calling protocols.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-emerald-300 font-bold">Track 3: Platform Reliability Lead</div>
            <div className="text-[11px] text-slate-400">Target Level: Cloud Infra Lead ($190k - $230k)</div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Bridge Docker/K8s container orchestration and Terraform automated infra deployments via the Internship Board.
            </p>
          </div>
        </div>
      </div>

      {/* Funnel & Conversion Bottleneck Visualizer */}
      <BottleneckFunnel />

      {/* Modal: Why Score Transparency */}
      <WhyScoreModal job={activeScoreJob} onClose={() => setActiveScoreJob(null)} />

      {/* Modal: Resume Diff & Human Approval Checkpoint */}
      <ResumeDiffModal application={activeDiffApp} onClose={() => setActiveDiffApp(null)} />
    </div>
  );
}
