-- =====================================================
-- BLOCKED TIME SLOTS TABLE (Add-on to existing schema)
-- =====================================================
-- Run this after running the main supabase-schema.sql
-- This allows staff to block time slots for breaks, meetings, etc.
-- =====================================================

CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocked_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for blocked_slots
ALTER TABLE blocked_slots ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view blocked slots
CREATE POLICY "Authenticated users can view blocked slots"
  ON blocked_slots FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert blocked slots
CREATE POLICY "Authenticated users can create blocked slots"
  ON blocked_slots FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to delete blocked slots
CREATE POLICY "Authenticated users can delete blocked slots"
  ON blocked_slots FOR DELETE
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots(blocked_date);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_time ON blocked_slots(start_time, end_time);
