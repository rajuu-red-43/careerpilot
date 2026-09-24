export type UserRole = 'college_student' | 'job_seeker' | 'company_recruiter' | 'admin';

export interface CompanyStability {
  score: number; // 0 - 100
  runwayMonths: number;
  fundingStage: string; // e.g. "Series B", "Profitable / Bootstrapped", "Public"
  glassdoorRating: number; // 1.0 - 5.0
  turnoverRisk: 'Low' | 'Moderate' | 'Elevated';
}

export interface GrowthPotential {
  score: number; // 0 - 100
  promotionPace: string; // e.g. "6-12 Months avg", "18 Months avg"
  techStackModernity: string; // "Bleeding Edge", "Modern", "Legacy"
  mentorshipScore: number; // 0 - 100
}

export interface JobMatchBreakdown {
  fitPercentage: number;
  matchedSkills: { skill: string; weight: number }[];
  missingSkills: { skill: string; weight: number; impact: string }[];
  experienceMatchScore: number;
  domainMatchScore: number;
  rationale: string;
}

export interface SalaryMarketBenchmark {
  marketAvgSalary: string;
  comparisonPercent: number; // e.g. +8 (8% above average) or -5
  comparisonText: string; // e.g. "8% above Bangalore Tech Market Avg"
  benefits: string[];
  equityText?: string;
  bonusText?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  salaryRange: string;
  salaryBenchmark?: SalaryMarketBenchmark;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Internship';
  department: string;
  postedDaysAgo: number;
  deadlineDate?: string;
  deadlineDaysLeft?: number;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  companyStability: CompanyStability;
  growthPotential: GrowthPotential;
  matchBreakdown: JobMatchBreakdown;
  isFlaggedDuplicate?: boolean;
  duplicateReason?: string;
  isSuspiciousFake?: boolean;
  fakeReason?: string;
  trustScore?: number; // 0 - 100
  verifiedCompany: boolean;
}

export interface TailoredBulletPoint {
  original: string;
  tailored: string;
  reason: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  deadlineDate?: string;
  deadlineHoursLeft?: number;
  status: 'Pending Approval' | 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Rejected';
  fitScore: number;
  fitConfidenceRange?: string; // e.g. "88% - 93% (High Confidence)"
  matchBucket: 'High' | 'Medium' | 'Low';
  tailoredKeywordsAdded: string[];
  tailoredBulletPoints: TailoredBulletPoint[];
  tailoredCoverLetter: string;
  humanApproved: boolean;
  followUpDate: string;
  notes?: string;
  rejectionReason?: string;
  rejectionCategory?: 'Skill Gap' | 'Experience Level' | 'System Design' | 'Cultural Fit / Other';
  rejectionActionAdvice?: string;
}

export interface SkillGapItem {
  skill: string;
  category: 'Core' | 'Recommended' | 'Bonus';
  estimatedWeeks: number;
  resourceTitle: string;
  resourceType: 'Interactive Lab' | 'Doc Guide' | 'Project Spec' | 'Free Course' | 'Internship Opportunity';
  resourceLink?: string;
  internshipOpportunityId?: string;
  acquired: boolean;
}

export interface SkillRoadmapYear {
  yearNumber: number;
  yearTitle: string;
  milestone: string;
  skills: string[];
  recommendedProjects: string[];
  recommendedCerts: string[];
}

export interface FutureDemandData {
  year: string;
  demandIndex: number;
  yoyGrowth: string;
  trendHeadline: string;
}

export interface SkillRoadmapDomain {
  id: string;
  name: string;
  tagline: string;
  demandGrowthRate: string;
  avgFresherSalary: string;
  description: string;
  years: SkillRoadmapYear[];
  futureProjections: FutureDemandData[];
}

export interface UserSession {
  id: string; // User ID / UUID
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  role: UserRole;
  provider: 'session' | 'credential' | 'supabase';
  expiresAt?: number;
  preferredLanguage?: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role: string;
  headline: string;
  yearsExperience: number;
  education: string;
  location: string;
  skills: string[];
  dataHealthScore: number;
  dataHealthChecks: { label: string; passed: boolean; tip: string }[];
  currentProgressStage: 'Skill Building' | 'Resume Ready' | 'Applying' | 'Interview' | 'Offered';
  interviewReadinessScore?: number;
  trialDaysLeft?: number;
  image?: string;
  preferredLanguage?: string;
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  step: 'TRIGGER' | 'SCAN_JOBS' | 'FILTER_FIT' | 'TAILOR_RESUME' | 'HUMAN_CHECKPOINT' | 'DISPATCH';
  title: string;
  description: string;
  status: 'success' | 'paused_checkpoint' | 'running';
}

export interface PortfolioProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  role: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  quantifiableImpact: string;
  pitchRecording?: string;
  pitchText?: string;
  pitchScore?: number;
  pitchClarityScore?: number;
  pitchDepthScore?: number;
  pitchFeedback?: string;
  createdAt: string;
}

export interface LockablePortfolio {
  id: string;
  ownerName: string;
  ownerRole: string;
  isLocked: boolean;
  lockedHash?: string;
  lockedTimestamp?: string;
  verificationId?: string;
  projects: PortfolioProject[];
}

export interface RejectionFeedback {
  id: string;
  applicationId: string;
  jobTitle: string;
  company: string;
  category: 'Skill Gap' | 'Experience Level' | 'System Design' | 'Cultural Fit / Other';
  notes: string;
  suggestedAction: string;
  actionUrl: string;
  date: string;
}

export interface InternshipPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  stipend: string;
  duration: string;
  targetSkills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  spotsLeft: number;
  description: string;
  deadlineDate: string;
  mentorName: string;
  mentorTitle: string;
}

export interface PitchEvaluationResult {
  score: number; // 0 - 100
  clarityScore: number;
  technicalDepthScore: number;
  impactScore: number;
  feedback: string;
  strengths: string[];
  improvementSuggestions: string[];
}
