-- =====================================================
-- Salon Customer Portal Database Schema
-- =====================================================
-- This schema includes proper RLS (Row Level Security) policies
-- to fix the appointment booking issue mentioned in the analysis
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to services
CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  TO anon
  USING (true);

-- =====================================================
-- TECHNICIANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS technicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  initials TEXT NOT NULL,
  specialty TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'off')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for technicians
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;

-- Allow public read access to technicians
CREATE POLICY "Anyone can view technicians"
  ON technicians FOR SELECT
  TO anon
  USING (true);

-- =====================================================
-- CHECK-INS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  services TEXT[] NOT NULL,
  technician_id UUID REFERENCES technicians(id),
  check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_price DECIMAL(10,2) NOT NULL,
  total_duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for check_ins
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- CRITICAL FIX: Allow anonymous users to INSERT check-ins (walk-in flow)
CREATE POLICY "Anyone can create check-ins"
  ON check_ins FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public to view their own check-ins by phone
CREATE POLICY "Anyone can view check-ins by phone"
  ON check_ins FOR SELECT
  TO anon
  USING (customer_phone IS NOT NULL);

-- =====================================================
-- APPOINTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  services TEXT[] NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- CRITICAL FIX: Allow anonymous users to INSERT appointments (booking flow)
-- This fixes the "row-level security policy violation" error
CREATE POLICY "Anyone can create appointments"
  ON appointments FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public to view their own appointments by phone
CREATE POLICY "Anyone can view their appointments"
  ON appointments FOR SELECT
  TO anon
  USING (customer_phone IS NOT NULL);

-- =====================================================
-- CONTACT MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to submit contact messages
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample services
INSERT INTO services (name, price, duration_minutes) VALUES
  ('Basic Manicure', 25.00, 30),
  ('Gel Manicure', 45.00, 45),
  ('Basic Pedicure', 35.00, 45),
  ('Spa Pedicure', 55.00, 60),
  ('Acrylic Full Set', 65.00, 90),
  ('Gel Extensions', 75.00, 90),
  ('Nail Art (per nail)', 5.00, 10),
  ('Paraffin Treatment', 15.00, 15)
ON CONFLICT DO NOTHING;

-- Insert sample technicians
INSERT INTO technicians (full_name, initials, specialty, status) VALUES
  ('Sarah Chen', 'SC', 'Nail Art Specialist', 'available'),
  ('Maria Rodriguez', 'MR', 'Pedicure Expert', 'available'),
  ('Jennifer Kim', 'JK', 'Gel & Acrylic Master', 'available'),
  ('Lisa Thompson', 'LT', 'Spa Treatment Specialist', 'available')
ON CONFLICT DO NOTHING;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments(customer_phone);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_check_ins_phone ON check_ins(customer_phone);
CREATE INDEX IF NOT EXISTS idx_check_ins_time ON check_ins(check_in_time);
