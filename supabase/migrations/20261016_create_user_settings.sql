-- Supabase Migration: Create user_settings table
-- Stores user streak tracking data, last active dates, and monthly streak saver status

CREATE TABLE IF NOT EXISTS public.user_settings (
    id TEXT PRIMARY KEY DEFAULT 'current_user',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    last_active_date DATE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    max_streak INTEGER NOT NULL DEFAULT 0,
    last_break_date DATE,
    last_streak_saver_used TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on user_id
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for public and authenticated access
CREATE POLICY "Allow users to read user settings"
ON public.user_settings
FOR SELECT
USING (true);

CREATE POLICY "Allow users to insert or update user settings"
ON public.user_settings
FOR ALL
USING (true)
WITH CHECK (true);
