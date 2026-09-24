-- CareerPilot v2: Add preferred_language column to profiles table
-- Supports ISO 639-1 / 639-2 language codes with English ('en') default

ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Create index for quick user preference lookups
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_language
ON public.profiles(preferred_language);

-- Comment describing purpose
COMMENT ON COLUMN public.profiles.preferred_language IS 'User preferred UI and AI response language (e.g. en, hi, ta, te, bn, ur)';
