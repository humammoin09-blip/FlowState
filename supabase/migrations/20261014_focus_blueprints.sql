-- Supabase Migration: Create focus_blueprints table
-- Supports FlowState's Focus Blueprint pre-session setup flow

CREATE TABLE IF NOT EXISTS public.focus_blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    goal TEXT NOT NULL,
    planned_work TEXT,
    allowlist TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    session_duration INTEGER NOT NULL DEFAULT 25,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance on user queries and recent history
CREATE INDEX IF NOT EXISTS idx_focus_blueprints_user_id ON public.focus_blueprints(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_blueprints_created_at ON public.focus_blueprints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_focus_blueprints_user_created ON public.focus_blueprints(user_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.focus_blueprints ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to view their own blueprints or anonymous blueprints
CREATE POLICY "Allow users to view own or public blueprints"
ON public.focus_blueprints
FOR SELECT
USING (
    auth.uid() = user_id 
    OR user_id IS NULL 
    OR auth.role() = 'anon'
);

-- Policy: Allow users to insert blueprints
CREATE POLICY "Allow users to insert blueprints"
ON public.focus_blueprints
FOR INSERT
WITH CHECK (
    auth.uid() = user_id 
    OR user_id IS NULL 
    OR auth.role() = 'anon'
);

-- Policy: Allow users to update their own blueprints
CREATE POLICY "Allow users to update own blueprints"
ON public.focus_blueprints
FOR UPDATE
USING (
    auth.uid() = user_id 
    OR user_id IS NULL
);

-- Policy: Allow users to delete their own blueprints
CREATE POLICY "Allow users to delete own blueprints"
ON public.focus_blueprints
FOR DELETE
USING (
    auth.uid() = user_id 
    OR user_id IS NULL
);
