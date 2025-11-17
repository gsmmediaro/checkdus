-- Seed Services for Luxury Nail Spa
-- Run this in your Supabase SQL Editor to populate services

-- Clear existing services first (optional - comment out if you want to keep existing data)
-- DELETE FROM services;

INSERT INTO services (name, price, duration_minutes) VALUES
  ('Classic Manicure', 25.00, 30),
  ('Gel Manicure', 35.00, 45),
  ('Acrylic Full Set', 55.00, 90),
  ('Acrylic Fill', 40.00, 60),
  ('Dip Powder Manicure', 45.00, 60),
  ('Nail Art (per nail)', 5.00, 10),

  ('Basic Pedicure', 35.00, 45),
  ('Deluxe Spa Pedicure', 50.00, 60),
  ('Luxury Spa Pedicure', 65.00, 75),
  ('Gel Pedicure', 45.00, 60),

  ('Manicure & Pedicure Combo', 55.00, 90),
  ('Gel Manicure & Pedicure Combo', 70.00, 105),

  ('Eyebrow Waxing', 12.00, 15),
  ('Lip Waxing', 8.00, 10),
  ('Full Face Waxing', 35.00, 30),
  ('Underarm Waxing', 20.00, 15);
