-- =====================================================
-- CUSTOMER PROFILES & PREFERENCES
-- =====================================================
-- Add-on to existing schema for detailed customer tracking
-- Tracks nail preferences, service history, and notes
-- =====================================================

CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL UNIQUE,
  customer_email TEXT,

  -- Nail Preferences
  nail_shape TEXT,              -- e.g., "Square", "Round", "Almond", "Coffin"
  nail_length TEXT,             -- e.g., "Short", "Medium", "Long", "Extra Long"
  active_length TEXT,           -- Specific active length preference
  preferred_style TEXT,         -- e.g., "Natural Finish", "French", "Gel Extensions"
  preferred_polish TEXT,        -- e.g., "DND 650", "OPI Red"

  -- Service History
  last_service TEXT,            -- Last service received
  last_visit_date DATE,         -- Date of last visit
  preferred_technician_id UUID REFERENCES technicians(id),

  -- Additional Info
  notes TEXT,                   -- Detailed preference notes
  allergies TEXT,               -- Any allergies or sensitivities
  special_instructions TEXT,    -- Special handling instructions

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for customer_profiles
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public to view their own profile by phone
CREATE POLICY "Anyone can view their own profile"
  ON customer_profiles FOR SELECT
  TO anon
  USING (customer_phone IS NOT NULL);

-- Allow authenticated users (staff) to view all profiles
CREATE POLICY "Authenticated users can view all profiles"
  ON customer_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to create profiles
CREATE POLICY "Authenticated users can create profiles"
  ON customer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update profiles
CREATE POLICY "Authenticated users can update profiles"
  ON customer_profiles FOR UPDATE
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_profiles_phone ON customer_profiles(customer_phone);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_name ON customer_profiles(customer_name);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_last_visit ON customer_profiles(last_visit_date DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_customer_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_customer_profile_timestamp
  BEFORE UPDATE ON customer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_profile_timestamp();

-- =====================================================
-- APPOINTMENT HISTORY VIEW
-- =====================================================
-- View to show customer appointment history with profile data

CREATE OR REPLACE VIEW customer_appointment_history AS
SELECT
  cp.id as profile_id,
  cp.customer_name,
  cp.customer_phone,
  cp.customer_email,
  cp.nail_shape,
  cp.nail_length,
  cp.preferred_polish,
  cp.last_visit_date,
  a.id as appointment_id,
  a.appointment_date,
  a.appointment_time,
  a.services,
  a.status,
  a.notes as appointment_notes
FROM customer_profiles cp
LEFT JOIN appointments a ON cp.customer_phone = a.customer_phone
ORDER BY a.appointment_date DESC, a.appointment_time DESC;

-- =====================================================
-- FUNCTION: Update Last Visit Date
-- =====================================================
-- Automatically update customer profile when appointment is completed

CREATE OR REPLACE FUNCTION update_last_visit_on_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if status changed to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE customer_profiles
    SET
      last_visit_date = NEW.appointment_date,
      last_service = (
        SELECT string_agg(s.name, ', ')
        FROM services s
        WHERE s.id = ANY(NEW.services)
      )
    WHERE customer_phone = NEW.customer_phone;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last visit when appointment completed
CREATE TRIGGER update_last_visit_trigger
  AFTER INSERT OR UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_last_visit_on_completion();
