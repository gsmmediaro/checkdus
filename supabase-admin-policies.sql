-- =====================================================
-- Admin Access Policies for Management Dashboard
-- =====================================================
-- This adds policies so authenticated users (admins) can
-- view and manage all data in the system
-- =====================================================

-- Check-Ins: Allow authenticated users to view and delete all check-ins
CREATE POLICY "Authenticated users can view all check-ins"
  ON check_ins FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete check-ins"
  ON check_ins FOR DELETE
  TO authenticated
  USING (true);

-- Appointments: Allow authenticated users to view, update, and delete all appointments
CREATE POLICY "Authenticated users can view all appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (true);

-- Customer Profiles: Allow authenticated users full access
CREATE POLICY "Authenticated users can view all customer profiles"
  ON customer_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update customer profiles"
  ON customer_profiles FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete customer profiles"
  ON customer_profiles FOR DELETE
  TO authenticated
  USING (true);

-- Contact Messages: Allow authenticated users to view all messages
CREATE POLICY "Authenticated users can view all contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (true);
