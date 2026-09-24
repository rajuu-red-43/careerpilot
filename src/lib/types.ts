export type UserRole = 'college_student' | 'job_seeker' | 'company_recruiter';

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

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  salaryRange: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Internship';
  department: string;
  postedDaysAgo: number;
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
  status: 'Pending Approval' | 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Rejected';
  fitScore: number;
  tailoredKeywordsAdded: string[];
  tailoredBulletPoints: TailoredBulletPoint[];
  tailoredCoverLetter: string;
  humanApproved: boolean;
  followUpDate: string;
  notes?: string;
}

export interface SkillGapItem {
  skill: string;
  category: 'Core' | 'Recommended' | 'Bonus';
  estimatedWeeks: number;
  resourceTitle: string;
  resourceType: 'Interactive Lab' | 'Doc Guide' | 'Project Spec';
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

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  headline: string;
  yearsExperience: number;
  education: string;
  location: string;
  skills: string[];
  dataHealthScore: number;
  dataHealthChecks: { label: string; passed: boolean; tip: string }[];
  currentProgressStage: 'Skill Building' | 'Resume Ready' | 'Applying' | 'Interview' | 'Offered';
}

export interface AutomationLog {
  id: string;
  timestamp: string;
  step: 'TRIGGER' | 'SCAN_JOBS' | 'FILTER_FIT' | 'TAILOR_RESUME' | 'HUMAN_CHECKPOINT' | 'DISPATCH';
  title: string;
  description: string;
  status: 'success' | 'paused_checkpoint' | 'running';
}
