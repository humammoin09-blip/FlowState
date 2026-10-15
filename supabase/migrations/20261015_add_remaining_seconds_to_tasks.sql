-- Migration: Add remaining_seconds column to tasks table
-- Ensures task timer persistence at 0:00 and across page refreshes, browser reopens, and devices

ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS remaining_seconds INTEGER DEFAULT NULL;

COMMENT ON COLUMN public.tasks.remaining_seconds IS 'Remaining countdown seconds for the task timer; 0 indicates the task has completed';
