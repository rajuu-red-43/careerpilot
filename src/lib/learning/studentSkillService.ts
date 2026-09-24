/**
 * Student Skill & Learning Progress Service
 * Manages student skills, progress tracking, and sync with local/Supabase storage.
 */

export interface StudentSkillProgress {
  courseId: string;
  courseTitle: string;
  progressPercent: number; // 0 - 100
  status: 'started' | 'in_progress' | 'completed';
  startedAt: string;
  completedAt?: string;
}

export interface StudentProfileData {
  id: string;
  name: string;
  targetCareerId: string;
  skills: string[];
  courseProgress: StudentSkillProgress[];
  completedSkillCount: number;
}

const DEFAULT_STUDENT_PROFILE: StudentProfileData = {
  id: 'student-default',
  name: 'Arun Kumar',
  targetCareerId: 'career-frontend',
  skills: ['HTML & CSS', 'JavaScript', 'Git & GitHub'],
  courseProgress: [
    {
      courseId: 'course-fcc-responsive-web',
      courseTitle: 'Responsive Web Design Certification',
      progressPercent: 100,
      status: 'completed',
      startedAt: '2026-08-10',
      completedAt: '2026-09-05',
    },
    {
      courseId: 'course-meta-front-end',
      courseTitle: 'Meta Front-End Developer Professional Certificate',
      progressPercent: 65,
      status: 'in_progress',
      startedAt: '2026-09-08',
    },
  ],
  completedSkillCount: 3,
};

const STORAGE_KEY = 'careerpilot_student_profile_v2';

export class StudentSkillService {
  private static instance: StudentSkillService;

  private constructor() {}

  public static getInstance(): StudentSkillService {
    if (!StudentSkillService.instance) {
      StudentSkillService.instance = new StudentSkillService();
    }
    return StudentSkillService.instance;
  }

  public getProfile(): StudentProfileData {
    if (typeof window === 'undefined') {
      return DEFAULT_STUDENT_PROFILE;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return DEFAULT_STUDENT_PROFILE;
  }

  public saveProfile(profile: StudentProfileData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }

  public addSkill(skill: string): StudentProfileData {
    const profile = this.getProfile();
    if (!profile.skills.includes(skill)) {
      profile.skills.push(skill);
      profile.completedSkillCount = profile.skills.length;
      this.saveProfile(profile);
    }
    return profile;
  }

  public removeSkill(skill: string): StudentProfileData {
    const profile = this.getProfile();
    profile.skills = profile.skills.filter(s => s !== skill);
    profile.completedSkillCount = profile.skills.length;
    this.saveProfile(profile);
    return profile;
  }

  public setTargetCareer(careerId: string): StudentProfileData {
    const profile = this.getProfile();
    profile.targetCareerId = careerId;
    this.saveProfile(profile);
    return profile;
  }

  public updateCourseProgress(
    courseId: string,
    courseTitle: string,
    percent: number
  ): StudentProfileData {
    const profile = this.getProfile();
    const existing = profile.courseProgress.find(c => c.courseId === courseId);
    const now = new Date().toISOString().split('T')[0];

    if (existing) {
      existing.progressPercent = Math.min(100, Math.max(0, percent));
      existing.status = percent >= 100 ? 'completed' : 'in_progress';
      if (percent >= 100) existing.completedAt = now;
    } else {
      profile.courseProgress.push({
        courseId,
        courseTitle,
        progressPercent: percent,
        status: percent >= 100 ? 'completed' : 'started',
        startedAt: now,
        completedAt: percent >= 100 ? now : undefined,
      });
    }

    this.saveProfile(profile);
    return profile;
  }
}

export const studentSkillService = StudentSkillService.getInstance();
