'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, CandidateProfile, JobPosting, Application, AutomationLog } from '../lib/types';
import { mockCandidateProfiles, mockInitialApplications, initialAutomationLogs } from '../data/mockProfiles';
import { mockJobs as defaultJobs } from '../data/mockJobs';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  profile: CandidateProfile;
  updateProfileSkills: (newSkills: string[]) => void;
  jobs: JobPosting[];
  applications: Application[];
  approveApplication: (appId: string) => void;
  rejectApplication: (appId: string) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('job_seeker');
  const [jobs, setJobs] = useState<JobPosting[]>(defaultJobs);
  const [applications, setApplications] = useState<Application[]>(mockInitialApplications);
  const [selectedCompareJobIds, setSelectedCompareJobIds] = useState<string[]>(['job-1', 'job-2']);
  
  // Intentional Demo Bug on Job Comparison Page:
  // When comparing 3 jobs, the 3rd job fit bar stays stale on 1st click, and refreshes on 2nd click
  const [thirdJobClicks, setThirdJobClicks] = useState<number>(0);

  const [judgeModeOpen, setJudgeModeOpen] = useState<boolean>(false);
  const [automationActive, setAutomationActive] = useState<boolean>(true);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(initialAutomationLogs);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Switch role and update active profile
  const [profile, setProfile] = useState<CandidateProfile>(mockCandidateProfiles['job_seeker']);

  useEffect(() => {
    setProfile(mockCandidateProfiles[role]);
  }, [role]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    const roleLabels: Record<UserRole, string> = {
      college_student: 'Student View',
      job_seeker: 'Job Seeker View',
      company_recruiter: 'Recruiter View',
    };
    showToast(`Switched active mode to ${roleLabels[newRole]}`, 'info');
  };

  const updateProfileSkills = (newSkills: string[]) => {
    setProfile(prev => ({
      ...prev,
      skills: newSkills,
    }));
    showToast(`Profile skills updated (${newSkills.length} total skills)`, 'success');
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
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'Rejected',
            humanApproved: false,
            notes: 'Rejected by candidate during human review checkpoint.',
          };
        }
        return app;
      })
    );
    showToast('Application rejected and removed from submission queue', 'warning');
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
      // If adding a 3rd job, reset the intentional bug click count so the demo bug can be observed
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
    // Duplicate detection heuristic: check title and description similarity with existing jobs
    const isDuplicate = jobs.some(
      j =>
        j.title.toLowerCase().trim() === newJob.title.toLowerCase().trim() ||
        (j.description.toLowerCase().includes(newJob.description.toLowerCase().slice(0, 40)) &&
          newJob.description.length > 20)
    );

    // Fake / Suspicious heuristic:
    // 1. Extreme salary for entry level (e.g. > $200k or > $150/hr)
    // 2. Suspicious keywords like "deposit", "equipment fee", "no exp $150/hr", "crypto payout"
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
      experienceLevel: newJob.experienceLevel,
      department: newJob.department,
      postedDaysAgo: 0,
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
        profile,
        updateProfileSkills,
        jobs,
        applications,
        approveApplication,
        rejectApplication,
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
