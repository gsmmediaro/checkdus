-- Complete RLS Setup for Salon Customer Portal
-- Run this in Supabase SQL Editor to fix all permission issues

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
DROP POLICY IF EXISTS "Anyone can view appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON appointments;

-- Allow anyone (including anonymous users) to create appointments
CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to view appointments (needed for "My Appointments" page)
-- In production, you might want to restrict this to specific phone numbers
CREATE POLICY "Anyone can view appointments" ON appointments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users (staff/admin) can update appointments
CREATE POLICY "Authenticated users can update appointments" ON appointments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users (staff/admin) can delete appointments
CREATE POLICY "Authenticated users can delete appointments" ON appointments
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- SERVICES TABLE
-- ============================================

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON services;

-- Allow anyone to view services (needed for booking flow)
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated users can manage services
CREATE POLICY "Authenticated users can insert services" ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services" ON services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services" ON services
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- WALK_INS TABLE (if exists)
-- ============================================

-- Enable RLS if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'walk_ins') THEN
    ALTER TABLE walk_ins ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if any
    DROP POLICY IF EXISTS "Anyone can create walk-ins" ON walk_ins;
    DROP POLICY IF EXISTS "Anyone can view walk-ins" ON walk_ins;
    DROP POLICY IF EXISTS "Authenticated users can update walk-ins" ON walk_ins;
    DROP POLICY IF EXISTS "Authenticated users can delete walk-ins" ON walk_ins;

    -- Allow anyone to create walk-ins
    CREATE POLICY "Anyone can create walk-ins" ON walk_ins
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);

    -- Allow anyone to view walk-ins
    CREATE POLICY "Anyone can view walk-ins" ON walk_ins
      FOR SELECT
      TO anon, authenticated
      USING (true);

    -- Only authenticated users can update walk-ins
    CREATE POLICY "Authenticated users can update walk-ins" ON walk_ins
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);

    -- Only authenticated users can delete walk-ins
    CREATE POLICY "Authenticated users can delete walk-ins" ON walk_ins
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

-- ============================================
-- CUSTOMER_PROFILES TABLE (if exists)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customer_profiles') THEN
    ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if any
    DROP POLICY IF EXISTS "Anyone can view customer profiles" ON customer_profiles;
    DROP POLICY IF EXISTS "Authenticated users can manage customer profiles" ON customer_profiles;

    -- Allow anyone to view customer profiles (needed for autocomplete)
    CREATE POLICY "Anyone can view customer profiles" ON customer_profiles
      FOR SELECT
      TO anon, authenticated
      USING (true);

    -- Only authenticated users can insert/update/delete customer profiles
    CREATE POLICY "Authenticated users can manage customer profiles" ON customer_profiles
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
