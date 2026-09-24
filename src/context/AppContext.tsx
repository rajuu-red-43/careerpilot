'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  CandidateProfile,
  JobPosting,
  Application,
  AutomationLog,
  PortfolioProject,
  RejectionFeedback,
  InternshipPosting,
  PitchEvaluationResult,
} from '../lib/types';
import {
  mockCandidateProfiles,
  mockInitialApplications,
  initialAutomationLogs,
  initialMockPortfolio,
  initialMockRejectionFeedbacks,
} from '../data/mockProfiles';
import { mockJobs as defaultJobs } from '../data/mockJobs';
import { mockInternships } from '../data/mockInternships';
import { supabase } from '../lib/supabase';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  // Auth state
  isLoggedIn: boolean;
  userName: string;
  isHydrated: boolean;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
  profile: CandidateProfile;
  updateProfileSkills: (newSkills: string[]) => void;
  jobs: JobPosting[];
  applications: Application[];
  approveApplication: (appId: string) => void;
  rejectApplication: (appId: string) => void;
  markApplicationRejectedWithFeedback: (
    appId: string,
    reason: string,
    category: 'Skill Gap' | 'Experience Level' | 'System Design' | 'Cultural Fit / Other'
  ) => void;
  selectedCompareJobIds: string[];
  toggleCompareJob: (jobId: string) => void;
  clearComparison: () => void;
  // Intentional demo bug state
  thirdJobClicks: number;
  handleThirdJobClick: () => void;
  resetDemoBug: () => void;
  // Judge / Presentation Mode
  judgeModeOpen: boolean;
  setJudgeModeOpen: (open: boolean) => void;
  // Automation state (n8n-style)
  automationActive: boolean;
  toggleAutomation: () => void;
  automationLogs: AutomationLog[];
  triggerManualScan: () => void;
  // Recruiter action: post job with duplicate & fake heuristics
  addJobPosting: (newJob: {
    title: string;
    company: string;
    department: string;
    location: string;
    workplaceType: 'Remote' | 'Hybrid' | 'On-site';
    salaryRange: string;
    experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Internship';
    description: string;
    requiredSkills: string[];
  }) => { success: boolean; flaggedReason?: string; isDuplicate?: boolean; isSuspicious?: boolean; job: JobPosting };
  // Toast notifications
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // v2 PRODUCTION SAAS EXTENSIONS:
  // Subscription & Monetization (Feature 2)
  isRecruiterSubscribed: boolean;
  toggleRecruiterSubscription: () => void;
  seekerTrialDaysLeft: number;

  // Lockable Portfolio (Feature 10)
  portfolios: PortfolioProject[];
  isPortfolioLocked: boolean;
  portfolioLockedHash: string;
  portfolioLockedTimestamp: string;
  lockPortfolio: () => void;
  unlockPortfolio: () => void;
  addPortfolioProject: (p: Omit<PortfolioProject, 'id' | 'createdAt'>) => void;

  // 60-Second Project Pitch Challenge (Feature 13)
  evaluateAndSavePitch: (projectId: string, pitchText: string) => PitchEvaluationResult;
  pitchModalProject: PortfolioProject | null;
  setPitchModalProject: (proj: PortfolioProject | null) => void;

  // Application Feedback Memory (Feature 9)
  rejectionFeedbacks: RejectionFeedback[];
  addRejectionFeedback: (feedback: Omit<RejectionFeedback, 'id' | 'date'>) => void;
  rejectionModalApp: Application | null;
  setRejectionModalApp: (app: Application | null) => void;

  // Internship & Upskilling Board (Feature 11)
  internships: InternshipPosting[];
  applyToInternship: (internshipId: string) => void;

  // Graphical Fit Visualization Modal (Feature 14)
  graphicalFitJob: JobPosting | null;
  setGraphicalFitJob: (job: JobPosting | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('job_seeker');
  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [jobs, setJobs] = useState<JobPosting[]>(defaultJobs);
  const [applications, setApplications] = useState<Application[]>(mockInitialApplications);
  const [selectedCompareJobIds, setSelectedCompareJobIds] = useState<string[]>(['job-1', 'job-2']);
  
  // Intentional Demo Bug on Job Comparison Page:
  const [thirdJobClicks, setThirdJobClicks] = useState<number>(0);

  const [judgeModeOpen, setJudgeModeOpen] = useState<boolean>(false);
  const [automationActive, setAutomationActive] = useState<boolean>(true);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(initialAutomationLogs);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Switch role and update active profile
  const [profile, setProfile] = useState<CandidateProfile>(mockCandidateProfiles['job_seeker']);

  // v2: Subscriptions
  const [isRecruiterSubscribed, setIsRecruiterSubscribed] = useState<boolean>(true);
  const [seekerTrialDaysLeft] = useState<number>(74);

  // v2: Lockable Portfolio
  const [portfolios, setPortfolios] = useState<PortfolioProject[]>(initialMockPortfolio);
  const [isPortfolioLocked, setIsPortfolioLocked] = useState<boolean>(true);
  const [portfolioLockedHash, setPortfolioLockedHash] = useState<string>('CP-VERIFIED-98F4-4291');
  const [portfolioLockedTimestamp, setPortfolioLockedTimestamp] = useState<string>('Sept 20, 2026 at 14:32 UTC');

  // v2: Modals
  const [pitchModalProject, setPitchModalProject] = useState<PortfolioProject | null>(null);
  const [rejectionModalApp, setRejectionModalApp] = useState<Application | null>(null);
  const [graphicalFitJob, setGraphicalFitJob] = useState<JobPosting | null>(null);

  // v2: Rejection Feedback Memory
  const [rejectionFeedbacks, setRejectionFeedbacks] = useState<RejectionFeedback[]>(initialMockRejectionFeedbacks);

  // v2: Internships
  const [internships, setInternships] = useState<InternshipPosting[]>(mockInternships);

  // Hydrate auth state from localStorage on initial client mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('careerpilot_auth');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed && parsed.isLoggedIn && parsed.role) {
          setIsLoggedIn(true);
          setRoleState(parsed.role);
          const name = parsed.userName || '';
          setUserName(name);
          const baseProfile = mockCandidateProfiles[parsed.role as UserRole];
          if (baseProfile) {
            setProfile({
              ...baseProfile,
              name: name || baseProfile.name,
            });
          }
        }
      }

      // Hydrate portfolio lock state
      const savedLock = localStorage.getItem('careerpilot_portfolio_lock');
      if (savedLock) {
        const parsedLock = JSON.parse(savedLock);
        setIsPortfolioLocked(parsedLock.isLocked);
        if (parsedLock.hash) setPortfolioLockedHash(parsedLock.hash);
      }
    } catch {
      // LocalStorage access may fail in private mode or SSR
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    const base = mockCandidateProfiles[role];
    if (base) {
      setProfile(prev => ({
        ...base,
        name: userName || prev.name || base.name,
      }));
    }
  }, [role, userName]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const login = (name: string, newRole: UserRole) => {
    const trimmedName = name.trim();
    setIsLoggedIn(true);
    setRoleState(newRole);
    setUserName(trimmedName);

    const baseProfile = mockCandidateProfiles[newRole];
    setProfile({
      ...baseProfile,
      name: trimmedName || baseProfile.name,
    });

    try {
      localStorage.setItem(
        'careerpilot_auth',
        JSON.stringify({
          isLoggedIn: true,
          userName: trimmedName,
          role: newRole,
        })
      );
    } catch {
      // ignore
    }

    const roleLabels: Record<UserRole, string> = {
      college_student: 'Student',
      job_seeker: 'Job Seeker',
      company_recruiter: 'Company Recruiter',
      admin: 'System Admin',
    };
    showToast(`Welcome, ${trimmedName || roleLabels[newRole]}! Signed in as ${roleLabels[newRole]}.`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('');
    try {
      localStorage.removeItem('careerpilot_auth');
    } catch {
      // ignore
    }
    showToast('Signed out. Please select your role to continue.', 'info');
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    const baseProfile = mockCandidateProfiles[newRole];
    setProfile(prev => ({
      ...baseProfile,
      name: userName || baseProfile.name,
    }));
    if (isLoggedIn) {
      try {
        localStorage.setItem(
          'careerpilot_auth',
          JSON.stringify({
            isLoggedIn: true,
            userName,
            role: newRole,
          })
        );
      } catch {}
    }
    const roleLabels: Record<UserRole, string> = {
      college_student: 'Student View',
      job_seeker: 'Job Seeker View',
      company_recruiter: 'Recruiter View',
      admin: 'Admin Operations',
    };
    showToast(`Switched active mode to ${roleLabels[newRole]}`, 'info');
  };

  const updateProfileSkills = (newSkills: string[]) => {
    setProfile(prev => ({
      ...prev,
      skills: newSkills,
    }));
    showToast(`Profile skills synchronized (${newSkills.length} total skills)`, 'success');
  };

  const approveApplication = (appId: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'Applied',
            humanApproved: true,
            notes: 'Approved via Human-in-the-Loop review checkpoint on ' + new Date().toLocaleDateString(),
          };
        }
        return app;
      })
    );
    showToast('Human Checkpoint Passed: Application approved and dispatched!', 'success');
  };

  const rejectApplication = (appId: string) => {
    // Open feedback modal instead of blind deletion
    const foundApp = applications.find(a => a.id === appId);
    if (foundApp) {
      setRejectionModalApp(foundApp);
    } else {
      setApplications(prev =>
        prev.map(app => (app.id === appId ? { ...app, status: 'Rejected' } : app))
      );
      showToast('Application marked as Rejected.', 'warning');
    }
  };

  const markApplicationRejectedWithFeedback = (
    appId: string,
    reason: string,
    category: 'Skill Gap' | 'Experience Level' | 'System Design' | 'Cultural Fit / Other'
  ) => {
    const targetApp = applications.find(a => a.id === appId);
    const feedback: RejectionFeedback = {
      id: `fb-${Date.now()}`,
      applicationId: appId,
      jobTitle: targetApp?.jobTitle || 'Role',
      company: targetApp?.company || 'Company',
      category,
      notes: reason,
      suggestedAction:
        category === 'Skill Gap'
          ? 'Check the Internship Board or Free Courses to master missing prerequisites.'
          : category === 'System Design'
          ? 'Add architectural diagrams and distributed cache specs to your locked portfolio.'
          : 'Conduct 60-Second Pitch Challenges to polish interview communication depth.',
      actionUrl: '/internships',
      date: new Date().toLocaleDateString(),
    };

    setRejectionFeedbacks(prev => [feedback, ...prev]);

    setApplications(prev =>
      prev.map(app =>
        app.id === appId
          ? {
              ...app,
              status: 'Rejected',
              rejectionReason: reason,
              rejectionCategory: category,
              rejectionActionAdvice: feedback.suggestedAction,
            }
          : app
      )
    );

    showToast('Rejection logged into Application Memory. System generated upskilling recommendation!', 'info');
  };

  const toggleCompareJob = (jobId: string) => {
    setSelectedCompareJobIds(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      }
      if (prev.length >= 3) {
        showToast('Maximum 3 jobs can be compared side-by-side.', 'warning');
        return prev;
      }
      const next = [...prev, jobId];
      if (next.length === 3) {
        setThirdJobClicks(0);
      }
      return next;
    });
  };

  const clearComparison = () => {
    setSelectedCompareJobIds([]);
    setThirdJobClicks(0);
  };

  const handleThirdJobClick = () => {
    setThirdJobClicks(prev => prev + 1);
  };

  const resetDemoBug = () => {
    setThirdJobClicks(0);
    showToast('Demo Bug Reset: 3rd job state will now demonstrate async lag on next click.', 'info');
  };

  const toggleAutomation = () => {
    const newState = !automationActive;
    setAutomationActive(newState);
    showToast(
      newState
        ? 'n8n Workflow Active: Auto-scan scheduled daily at 08:00 AM'
        : 'Auto-scan workflow paused',
      newState ? 'success' : 'info'
    );
  };

  const triggerManualScan = () => {
    const newLog: AutomationLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      step: 'FILTER_FIT',
      title: 'Manual Ad-Hoc Vector Scan Completed',
      description: 'Re-evaluated all 10 postings against current candidate profile. 3 high-fit opportunities identified.',
      status: 'success',
    };
    setAutomationLogs(prev => [newLog, ...prev]);
    showToast('Autonomous agent executed real-time job scan and re-scored matches!', 'success');
  };

  // Recruiter Subscription Toggle (Feature 2)
  const toggleRecruiterSubscription = () => {
    const nextState = !isRecruiterSubscribed;
    setIsRecruiterSubscribed(nextState);
    showToast(
      nextState
        ? 'Recruiter Subscription Activated (Growth Tier: ₹6,999/mo) — Full talent sieve unlocked!'
        : 'Recruiter Subscription Inactive — Talent pipeline gated.',
      nextState ? 'success' : 'warning'
    );
  };

  // Lockable Portfolio (Feature 10)
  const lockPortfolio = () => {
    const hash = supabase.generatePortfolioHash(userName || profile.name, portfolios.length);
    const timestamp = new Date().toLocaleString() + ' UTC';
    setIsPortfolioLocked(true);
    setPortfolioLockedHash(hash);
    setPortfolioLockedTimestamp(timestamp);
    try {
      localStorage.setItem(
        'careerpilot_portfolio_lock',
        JSON.stringify({ isLocked: true, hash, timestamp })
      );
    } catch {}
    showToast(`Portfolio Authenticity Locked! Cryptographic stamp generated: ${hash}`, 'success');
  };

  const unlockPortfolio = () => {
    setIsPortfolioLocked(false);
    try {
      localStorage.setItem('careerpilot_portfolio_lock', JSON.stringify({ isLocked: false }));
    } catch {}
    showToast('Portfolio unlocked for editing. Lock again once updates are finalized.', 'info');
  };

  const addPortfolioProject = (p: Omit<PortfolioProject, 'id' | 'createdAt'>) => {
    const newProject: PortfolioProject = {
      ...p,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPortfolios(prev => [newProject, ...prev]);
    showToast(`Added "${newProject.title}" to portfolio!`, 'success');
  };

  // 60-Second Pitch Challenge Evaluation (Feature 13)
  const evaluateAndSavePitch = (projectId: string, pitchText: string): PitchEvaluationResult => {
    const textLower = pitchText.toLowerCase();
    const wordCount = pitchText.trim().split(/\s+/).length;

    // Deterministic rule-based evaluation for hackathon demo
    const mentionsTech = ['next.js', 'react', 'python', 'sql', 'docker', 'redis', 'api', 'postgres'].some(k =>
      textLower.includes(k)
    );
    const mentionsMetric = /\d+%|\d+ms|\d+x|\d+ users|\d+ seconds/.test(pitchText);
    const mentionsProblem = ['problem', 'solve', 'bottleneck', 'challenge', 'latency', 'spam'].some(k =>
      textLower.includes(k)
    );

    let clarityScore = Math.min(Math.max(wordCount * 1.5, 60), 96);
    let technicalDepthScore = mentionsTech ? 92 : 68;
    let impactScore = mentionsMetric ? 95 : 70;

    if (mentionsProblem) clarityScore += 4;
    const finalScore = Math.round((clarityScore * 0.35 + technicalDepthScore * 0.35 + impactScore * 0.3));

    const result: PitchEvaluationResult = {
      score: finalScore,
      clarityScore: Math.round(clarityScore),
      technicalDepthScore: Math.round(technicalDepthScore),
      impactScore: Math.round(impactScore),
      feedback: mentionsMetric
        ? 'Outstanding quantifiable outcome framing! You clearly conveyed technical architecture and measurable performance impact in under 60 seconds.'
        : 'Good technical overview. Adding measurable results (e.g. % speedup, user volume, latency numbers) will boost recruiter interview conversion.',
      strengths: [
        'Direct problem-solution articulation',
        mentionsTech ? 'Strong tech stack keyword fluency' : 'Accessible explanation',
        'Paced effectively within the 60-second window',
      ],
      improvementSuggestions: mentionsMetric
        ? ['Mention edge-case handling or failure mode resilience']
        : ['Quantify outcomes (e.g. latency reduced by X%, users supported)'],
    };

    // Update project with pitch score
    setPortfolios(prev =>
      prev.map(proj =>
        proj.id === projectId
          ? {
              ...proj,
              pitchText,
              pitchScore: finalScore,
              pitchClarityScore: result.clarityScore,
              pitchDepthScore: result.technicalDepthScore,
              pitchFeedback: result.feedback,
            }
          : proj
      )
    );

    // Boost candidate interview readiness score in profile
    setProfile(prev => ({
      ...prev,
      interviewReadinessScore: Math.min((prev.interviewReadinessScore || 75) + 3, 98),
    }));

    showToast(`60s Pitch Evaluated! Score: ${finalScore}/100 — Interview Readiness increased!`, 'success');
    return result;
  };

  const addRejectionFeedback = (fb: Omit<RejectionFeedback, 'id' | 'date'>) => {
    const full: RejectionFeedback = {
      ...fb,
      id: `fb-${Date.now()}`,
      date: new Date().toLocaleDateString(),
    };
    setRejectionFeedbacks(prev => [full, ...prev]);
    showToast('Feedback noted! System generated actionable skill upskilling recommendations.', 'success');
  };

  const applyToInternship = (internshipId: string) => {
    const item = internships.find(i => i.id === internshipId);
    showToast(`Application staged for ${item?.title || 'Internship'}! Passed Human-in-the-Loop Gate.`, 'success');
  };

  const addJobPosting = (newJob: {
    title: string;
    company: string;
    department: string;
    location: string;
    workplaceType: 'Remote' | 'Hybrid' | 'On-site';
    salaryRange: string;
    experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Internship';
    description: string;
    requiredSkills: string[];
  }) => {
    const isDuplicate = jobs.some(
      j =>
        j.title.toLowerCase().trim() === newJob.title.toLowerCase().trim() ||
        (j.description.toLowerCase().includes(newJob.description.toLowerCase().slice(0, 40)) &&
          newJob.description.length > 20)
    );

    const lowerDesc = newJob.description.toLowerCase();
    const lowerSalary = newJob.salaryRange.toLowerCase();
    const isSuspicious =
      lowerDesc.includes('fee') ||
      lowerDesc.includes('telegram') ||
      lowerDesc.includes('crypto payout') ||
      (newJob.experienceLevel === 'Entry' && (lowerSalary.includes('300k') || lowerSalary.includes('400k')));

    let duplicateReason = undefined;
    let fakeReason = undefined;

    if (isDuplicate) {
      duplicateReason = `Flagged by Duplicate Engine: High token overlap with an existing active listing (${newJob.title}). Verified to prevent candidate spam.`;
    }

    if (isSuspicious) {
      fakeReason = `Flagged by Trust & Safety Filter: Suspicious compensation/fee pattern detected in job listing description.`;
    }

    const createdJob: JobPosting = {
      id: `job-${Date.now()}`,
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      workplaceType: newJob.workplaceType,
      salaryRange: newJob.salaryRange,
      salaryBenchmark: {
        marketAvgSalary: '$135,000',
        comparisonPercent: 5,
        comparisonText: '+5% relative to verified department averages',
        benefits: ['Health & Dental', 'Remote Workspace Setup', 'Standard Equity'],
      },
      experienceLevel: newJob.experienceLevel,
      department: newJob.department,
      postedDaysAgo: 0,
      deadlineDate: 'In 14 days',
      deadlineDaysLeft: 14,
      trustScore: isSuspicious ? 15 : isDuplicate ? 45 : 95,
      verifiedCompany: !isSuspicious && !isDuplicate,
      isFlaggedDuplicate: isDuplicate,
      duplicateReason,
      isSuspiciousFake: isSuspicious,
      fakeReason,
      description: newJob.description,
      requiredSkills: newJob.requiredSkills,
      preferredSkills: ['Problem Solving', 'Team Collaboration'],
      companyStability: {
        score: isSuspicious ? 20 : 85,
        runwayMonths: 24,
        fundingStage: 'Active Employer',
        glassdoorRating: isSuspicious ? 1.5 : 4.2,
        turnoverRisk: isSuspicious ? 'Elevated' : 'Low',
      },
      growthPotential: {
        score: isSuspicious ? 15 : 82,
        promotionPace: '12-18 Months',
        techStackModernity: 'Modern',
        mentorshipScore: 80,
      },
      matchBreakdown: {
        fitPercentage: isSuspicious ? 25 : 82,
        matchedSkills: newJob.requiredSkills.slice(0, 3).map(skill => ({ skill, weight: 25 })),
        missingSkills: newJob.requiredSkills.slice(3).map(skill => ({ skill, weight: 15, impact: 'Additional requirement' })),
        experienceMatchScore: 80,
        domainMatchScore: 85,
        rationale: 'Newly ingested role evaluated via CareerPilot Transparent Vector Engine.',
      },
    };

    setJobs(prev => [createdJob, ...prev]);

    return {
      success: true,
      flaggedReason: duplicateReason || fakeReason,
      isDuplicate,
      isSuspicious,
      job: createdJob,
    };
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isLoggedIn,
        userName,
        isHydrated,
        login,
        logout,
        profile,
        updateProfileSkills,
        jobs,
        applications,
        approveApplication,
        rejectApplication,
        markApplicationRejectedWithFeedback,
        selectedCompareJobIds,
        toggleCompareJob,
        clearComparison,
        thirdJobClicks,
        handleThirdJobClick,
        resetDemoBug,
        judgeModeOpen,
        setJudgeModeOpen,
        automationActive,
        toggleAutomation,
        automationLogs,
        triggerManualScan,
        addJobPosting,
        toast,
        showToast,

        // v2 Production SaaS features:
        isRecruiterSubscribed,
        toggleRecruiterSubscription,
        seekerTrialDaysLeft,
        portfolios,
        isPortfolioLocked,
        portfolioLockedHash,
        portfolioLockedTimestamp,
        lockPortfolio,
        unlockPortfolio,
        addPortfolioProject,
        evaluateAndSavePitch,
        pitchModalProject,
        setPitchModalProject,
        rejectionFeedbacks,
        addRejectionFeedback,
        rejectionModalApp,
        setRejectionModalApp,
        internships,
        applyToInternship,
        graphicalFitJob,
        setGraphicalFitJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
