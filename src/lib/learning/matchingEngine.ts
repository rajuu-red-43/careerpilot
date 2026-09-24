/**
 * Transparent Skill Gap & Future Job Matching Engine for CareerPilot v2
 * Deterministic, explainable matching based on structured skills taxonomy.
 */

import { normalizeSkill, normalizeSkillList } from './skillTaxonomy';
import { getCareerPath, CareerPath } from './careerPaths';
import { VERIFIED_COURSES, Course, getCoursesTeachingSkill } from './courseDataset';
import { JobPosting } from '../types';

export interface SkillGapReport {
  targetCareer: CareerPath;
  readinessPercentage: number; // 0 - 100
  acquiredSkills: string[];
  missingSkills: string[];
  nextSkillToLearn: string | null;
  skillsAwayCount: number;
  recommendedCourses: Course[];
  summary: string;
}

export interface JobMatchResult {
  jobId: string;
  jobTitle: string;
  company: string;
  matchScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  recommendedLearning: Course[];
  explanation: string;
  readinessStatus: 'Ready to Apply' | '1-2 Skills Away' | 'Upskilling Needed';
}

/**
 * Evaluates a student's skills against a target career path.
 */
export function analyzeCareerSkillGap(
  rawStudentSkills: string[],
  targetCareerIdOrTitle: string
): SkillGapReport {
  const career = getCareerPath(targetCareerIdOrTitle);
  const normalizedStudentSkills = new Set(
    normalizeSkillList(rawStudentSkills).map(s => s.toLowerCase())
  );

  const acquiredSkills: string[] = [];
  const missingSkills: string[] = [];

  // Check required skills
  for (const reqSkill of career.requiredSkills) {
    const normReq = normalizeSkill(reqSkill);
    if (normalizedStudentSkills.has(normReq.toLowerCase())) {
      acquiredSkills.push(normReq);
    } else {
      missingSkills.push(normReq);
    }
  }

  // Also check preferred skills
  for (const prefSkill of career.preferredSkills) {
    const normPref = normalizeSkill(prefSkill);
    if (normalizedStudentSkills.has(normPref.toLowerCase())) {
      if (!acquiredSkills.includes(normPref)) {
        acquiredSkills.push(normPref);
      }
    } else {
      if (!missingSkills.includes(normPref)) {
        missingSkills.push(normPref);
      }
    }
  }

  const totalEvaluatedSkills = acquiredSkills.length + missingSkills.length;
  const readinessPercentage =
    totalEvaluatedSkills > 0
      ? Math.round((acquiredSkills.length / totalEvaluatedSkills) * 100)
      : 0;

  // Determine the next skill to learn based on career's structured learningOrder
  let nextSkillToLearn: string | null = null;
  for (const orderedSkill of career.learningOrder) {
    const norm = normalizeSkill(orderedSkill);
    if (!normalizedStudentSkills.has(norm.toLowerCase())) {
      nextSkillToLearn = norm;
      break;
    }
  }
  if (!nextSkillToLearn && missingSkills.length > 0) {
    nextSkillToLearn = missingSkills[0];
  }

  // Gather recommended courses specifically targeting the missing skills
  const recommendedCourses: Course[] = [];
  const seenCourseIds = new Set<string>();

  const prioritizedSkillsToFind = nextSkillToLearn
    ? [nextSkillToLearn, ...missingSkills.filter(s => s !== nextSkillToLearn)]
    : missingSkills;

  for (const skill of prioritizedSkillsToFind) {
    const matchingCourses = getCoursesTeachingSkill(skill);
    for (const c of matchingCourses) {
      if (!seenCourseIds.has(c.id)) {
        seenCourseIds.add(c.id);
        recommendedCourses.push(c);
      }
      if (recommendedCourses.length >= 6) break;
    }
    if (recommendedCourses.length >= 6) break;
  }

  return {
    targetCareer: career,
    readinessPercentage,
    acquiredSkills,
    missingSkills,
    nextSkillToLearn,
    skillsAwayCount: missingSkills.length,
    recommendedCourses,
    summary:
      missingSkills.length === 0
        ? `You have mastered all core skills for ${career.title}!`
        : `You are ${missingSkills.length} skill${missingSkills.length === 1 ? '' : 's'} away from ${career.title}. Learn ${nextSkillToLearn || 'next course'} to boost your readiness.`,
  };
}

/**
 * Calculates a transparent, explainable job match score.
 */
export function calculateJobMatch(
  rawStudentSkills: string[],
  job: JobPosting
): JobMatchResult {
  const studentSkillSet = new Set(
    normalizeSkillList(rawStudentSkills).map(s => s.toLowerCase())
  );

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  const required = job.requiredSkills || [];
  const preferred = job.preferredSkills || [];

  let requiredMatches = 0;
  let preferredMatches = 0;

  for (const req of required) {
    const norm = normalizeSkill(req);
    if (studentSkillSet.has(norm.toLowerCase())) {
      matchedSkills.push(norm);
      requiredMatches++;
    } else {
      missingSkills.push(norm);
    }
  }

  for (const pref of preferred) {
    const norm = normalizeSkill(pref);
    if (studentSkillSet.has(norm.toLowerCase())) {
      if (!matchedSkills.includes(norm)) {
        matchedSkills.push(norm);
        preferredMatches++;
      }
    } else {
      if (!missingSkills.includes(norm)) {
        missingSkills.push(norm);
      }
    }
  }

  // Weight required skills 70%, preferred 30%
  const reqRatio = required.length > 0 ? requiredMatches / required.length : 1;
  const prefRatio = preferred.length > 0 ? preferredMatches / preferred.length : 0.5;
  const rawScore = Math.round(reqRatio * 75 + prefRatio * 25);
  const matchScore = Math.min(100, Math.max(10, rawScore));

  let readinessStatus: 'Ready to Apply' | '1-2 Skills Away' | 'Upskilling Needed' = 'Upskilling Needed';
  if (matchScore >= 80) {
    readinessStatus = 'Ready to Apply';
  } else if (matchScore >= 55) {
    readinessStatus = '1-2 Skills Away';
  }

  // Find courses that teach the missing skills
  const recommendedLearning: Course[] = [];
  const seenCourseIds = new Set<string>();

  for (const missing of missingSkills) {
    const courses = getCoursesTeachingSkill(missing);
    for (const c of courses) {
      if (!seenCourseIds.has(c.id)) {
        seenCourseIds.add(c.id);
        recommendedLearning.push(c);
      }
      if (recommendedLearning.length >= 3) break;
    }
    if (recommendedLearning.length >= 3) break;
  }

  const explanation =
    missingSkills.length === 0
      ? `Strong match! Your profile includes all ${required.length} required skills for ${job.title}.`
      : `Matched ${matchedSkills.length} of ${required.length + preferred.length} skills. Closing ${missingSkills.slice(0, 2).join(' and ')} will increase your fit.`;

  return {
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    matchScore,
    matchedSkills,
    missingSkills,
    recommendedLearning,
    explanation,
    readinessStatus,
  };
}
