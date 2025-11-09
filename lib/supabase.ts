import { createClient } from '@supabase/supabase-js';

// Use dummy values during build if env vars are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU4MzI0MDAsImV4cCI6MTk2MTE5MjQwMH0.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          name: string;
          price: number;
          duration_minutes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          duration_minutes: number;
          created_at?: string;
        };
      };
      technicians: {
        Row: {
          id: string;
          full_name: string;
          initials: string;
          specialty: string;
          status: 'available' | 'busy' | 'off';
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          initials: string;
          specialty: string;
          status?: 'available' | 'busy' | 'off';
          created_at?: string;
        };
      };
      check_ins: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string | null;
          services: string[];
          technician_id: string | null;
          check_in_time: string;
          total_price: number;
          total_duration: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone?: string | null;
          services: string[];
          technician_id?: string | null;
          check_in_time?: string;
          total_price: number;
          total_duration: number;
          created_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          services: string[];
          appointment_date: string;
          appointment_time: string;
          notes: string | null;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone: string;
          services: string[];
          appointment_date: string;
          appointment_time: string;
          notes?: string | null;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          created_at?: string;
        };
      };
    };
  };
};
