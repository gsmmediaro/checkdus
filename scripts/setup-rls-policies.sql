-- Setup Row Level Security (RLS) Policies for Services Table
-- This ensures the public can read services but only authenticated users can modify them

-- Enable RLS on services table (if not already enabled)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON services;

-- Allow anyone (including anonymous users) to read services
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT
  USING (true);

-- Only authenticated users can insert services
CREATE POLICY "Authenticated users can insert services" ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update services
CREATE POLICY "Authenticated users can update services" ON services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete services
CREATE POLICY "Authenticated users can delete services" ON services
  FOR DELETE
  TO authenticated
  USING (true);
