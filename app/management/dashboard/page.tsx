'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManagementDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/management/login');
      return;
    }

    setUser(user);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/management/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Management Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
          <p className="text-gray-600 mb-2">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="text-gray-600">
            <strong>Name:</strong> {user?.user_metadata?.full_name || 'Not provided'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/management/appointments" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-400">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition">Appointments</h3>
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm mb-2">View and manage customer appointments</p>
              <p className="text-purple-600 text-sm font-semibold">Click to manage →</p>
            </div>
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Check-Ins</h3>
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Monitor walk-in customer check-ins</p>
            <p className="text-gray-400 text-xs mt-2">Coming soon</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">View customer contact messages</p>
            <p className="text-gray-400 text-xs mt-2">Coming soon</p>
          </div>
        </div>

        <div className="mt-8 bg-green-50 border border-green-300 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-2">✨ New: Admin Appointment Management</h3>
          <p className="text-green-700 text-sm mb-3">
            The appointment management system is now live! Features include:
          </p>
          <ul className="mt-2 text-green-700 text-sm list-disc list-inside space-y-1">
            <li>✅ View all appointments with calendar and list views</li>
            <li>✅ Create manual bookings for walk-in clients</li>
            <li>✅ Search existing clients or add new ones</li>
            <li>✅ Filter by status (pending, confirmed, completed, cancelled)</li>
            <li>✅ Update appointment status with one click</li>
            <li>✅ Custom time slots with 15-minute intervals</li>
            <li>✅ Add notes and manage appointment details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
