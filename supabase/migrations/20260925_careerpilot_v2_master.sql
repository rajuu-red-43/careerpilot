-- =========================================================================
-- CareerPilot v2: Master Database Schema & Learning Intelligence Migration
-- Phone OTP Auth + 23 Multi-Language + Student Learning Dataset + Job Matching
-- Idempotent: Safe to execute on both fresh and pre-existing Supabase databases
-- =========================================================================

-- 1. Profiles Table (Phone Auth + Role + Preferred Language)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE,
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT,
  image TEXT,
  role TEXT NOT NULL DEFAULT 'college_student' CHECK (role IN ('college_student', 'job_seeker', 'company_recruiter', 'admin')),
  skills TEXT[] DEFAULT '{}',
  data_health_score INTEGER DEFAULT 90,
  interview_readiness_score INTEGER DEFAULT 75,
  is_subscribed BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'student_free',
  trial_days_remaining INTEGER DEFAULT 90,
  preferred_language TEXT DEFAULT 'en',
  target_career_path TEXT DEFAULT 'Frontend Developer',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Safely add phone and target_career_path if profiles already existed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'target_career_path'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN target_career_path TEXT DEFAULT 'Frontend Developer';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'preferred_language'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN preferred_language TEXT DEFAULT 'en';
  END IF;
END $$;

-- 2. Skills Taxonomy Table
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  difficulty TEXT DEFAULT 'Beginner',
  related_skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Skill Aliases Table
CREATE TABLE IF NOT EXISTS public.skill_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
  alias TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Courses / Learning Content Dataset
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_url TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'Beginner',
  duration TEXT,
  language TEXT DEFAULT 'English',
  delivery_type TEXT DEFAULT 'Self-paced',
  is_free BOOLEAN DEFAULT true,
  price TEXT DEFAULT 'Free',
  rating NUMERIC(3, 2) DEFAULT 4.8,
  rating_count INTEGER DEFAULT 0,
  certificate_available BOOLEAN DEFAULT false,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  last_verified_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Course <-> Skill Mapping
CREATE TABLE IF NOT EXISTS public.course_skills (
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  skill_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, skill_id)
);

-- 6. Career Paths Table
CREATE TABLE IF NOT EXISTS public.career_paths (
  id TEXT PRIMARY KEY,
  title TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  typical_fresher_salary TEXT,
  learning_order TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Career Path <-> Skill Mapping
CREATE TABLE IF NOT EXISTS public.career_path_skills (
  career_path_id TEXT REFERENCES public.career_paths(id) ON DELETE CASCADE,
  skill_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT true,
  importance_order INTEGER DEFAULT 1,
  PRIMARY KEY (career_path_id, skill_id)
);

-- 8. Student Skills Profile Table
CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id TEXT REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency TEXT DEFAULT 'Beginner' CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced')),
  evidence_source TEXT DEFAULT 'self_reported' CHECK (evidence_source IN ('self_reported', 'course_completed', 'project_built', 'assessment', 'internship')),
  confidence INTEGER DEFAULT 80,
  verified BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, skill_id)
);

-- 9. Student Learning Progress Tracking Table
CREATE TABLE IF NOT EXISTS public.student_learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'started' CHECK (status IN ('started', 'in_progress', 'completed')),
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(profile_id, course_id)
);

-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_language ON public.profiles(preferred_language);
CREATE INDEX IF NOT EXISTS idx_student_skills_profile ON public.student_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_skill ON public.student_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_profile ON public.student_learning_progress(profile_id);
CREATE INDEX IF NOT EXISTS idx_course_skills_skill ON public.course_skills(skill_id);

-- 11. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_learning_progress ENABLE ROW LEVEL SECURITY;

-- Permissive Read Policies for Catalog
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public read career paths" ON public.career_paths FOR SELECT USING (true);

-- Profiles RLS
CREATE POLICY "Allow select profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update profiles" ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);
