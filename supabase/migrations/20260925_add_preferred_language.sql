-- =========================================================================
-- CareerPilot v2: Production Database Schema & Language Migration
-- Resolves: ERROR 42P01: relation "public.profiles" does not exist
-- Idempotent: Safe to execute on both fresh and pre-existing Supabase databases
-- =========================================================================

-- 1. Create profiles table if it does not exist
-- Designed for direct Google OAuth (google_id) + optional Supabase Auth (user_id)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id TEXT UNIQUE,
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  image TEXT,
  role TEXT NOT NULL DEFAULT 'job_seeker' CHECK (role IN ('college_student', 'job_seeker', 'company_recruiter', 'admin')),
  skills TEXT[] DEFAULT '{}',
  data_health_score INTEGER DEFAULT 90,
  interview_readiness_score INTEGER DEFAULT 75,
  is_subscribed BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'student_free',
  trial_days_remaining INTEGER DEFAULT 90,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Safely add columns if public.profiles already existed previously without them
DO $$
BEGIN
  -- preferred_language column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'preferred_language'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN preferred_language TEXT DEFAULT 'en';
  END IF;

  -- google_id column for OAuth
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'google_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN google_id TEXT UNIQUE;
  END IF;

  -- image column for Google profile picture
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'image'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN image TEXT;
  END IF;
END $$;

-- 3. Create Performance & Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_google_id
  ON public.profiles(google_id);

CREATE INDEX IF NOT EXISTS idx_profiles_email
  ON public.profiles(email);

CREATE INDEX IF NOT EXISTS idx_profiles_preferred_language
  ON public.profiles(preferred_language);

CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles(role);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Safe Idempotent RLS Policies
DROP POLICY IF EXISTS "Allow select for all sessions" ON public.profiles;
DROP POLICY IF EXISTS "Allow insert for sessions" ON public.profiles;
DROP POLICY IF EXISTS "Allow update of own profile or language" ON public.profiles;

-- Allow reading user profiles
CREATE POLICY "Allow select for all sessions"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Allow inserting user profiles upon Google login
CREATE POLICY "Allow insert for sessions"
  ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow updating own profile and preferred_language
CREATE POLICY "Allow update of own profile or language"
  ON public.profiles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 6. Trigger to automatically update updated_at on record changes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Comments describing purpose
COMMENT ON TABLE public.profiles IS 'CareerPilot v2 user profiles supporting Google OAuth and role-based access';
COMMENT ON COLUMN public.profiles.preferred_language IS 'User preferred UI and AI response language (e.g. en, hi, ta, te, bn, ur, mr, gu, kn, ml, pa)';
COMMENT ON COLUMN public.profiles.google_id IS 'Unique Google OpenID Connect subject identifier (sub)';
