'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { formatTime12Hour, formatCurrency } from '@/lib/utils';

type CheckIn = {
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

type Technician = {
  id: string;
  full_name: string;
  initials: string;
};

type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

export default function CheckInsManagementPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/management/login');
      return;
    }

    setUser(user);
    setLoading(false);
  };

  const loadData = async () => {
    // Load check-ins
    const { data: checkInsData } = await supabase
      .from('check_ins')
      .select('*')
      .order('check_in_time', { ascending: false });

    if (checkInsData) setCheckIns(checkInsData);

    // Load technicians
    const { data: techData } = await supabase
      .from('technicians')
      .select('id, full_name, initials');

    if (techData) setTechnicians(techData);

    // Load services
    const { data: servicesData } = await supabase
      .from('services')
      .select('*');

    if (servicesData) setServices(servicesData);
  };

  const getTechnicianName = (techId: string | null) => {
    if (!techId) return 'Next Available';
    const tech = technicians.find(t => t.id === techId);
    return tech ? tech.full_name : 'Unknown';
  };

  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds
      .map(id => services.find(s => s.id === id)?.name || 'Unknown Service')
      .join(', ');
  };

  const deleteCheckIn = async (id: string) => {
    if (!confirm('Are you sure you want to delete this check-in?')) return;

    const { error } = await supabase
      .from('check_ins')
      .delete()
      .eq('id', id);

    if (!error) {
      setCheckIns(checkIns.filter(c => c.id !== id));
    }
  };

  const filteredCheckIns = checkIns.filter(checkIn => {
    const query = searchQuery.toLowerCase();
    return (
      checkIn.customer_name.toLowerCase().includes(query) ||
      (checkIn.customer_phone && checkIn.customer_phone.toLowerCase().includes(query))
    );
  });

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <Link href="/management/dashboard" className="text-pink-600 hover:text-pink-700 text-sm mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Walk-In Check-Ins</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or phone..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Check-Ins</h3>
            <p className="text-3xl font-bold text-gray-800">{checkIns.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Today's Check-Ins</h3>
            <p className="text-3xl font-bold text-pink-600">
              {checkIns.filter(c => {
                const checkInDate = parseISO(c.check_in_time);
                const today = new Date();
                return checkInDate.toDateString() === today.toDateString();
              }).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(checkIns.reduce((sum, c) => sum + c.total_price, 0))}
            </p>
          </div>
        </div>

        {/* Check-Ins List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              All Check-Ins ({filteredCheckIns.length})
            </h2>
          </div>

          {filteredCheckIns.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? 'No check-ins found matching your search.' : 'No check-ins yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Check-In Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Technician
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCheckIns.map((checkIn) => {
                    const checkInDateTime = parseISO(checkIn.check_in_time);
                    return (
                      <tr key={checkIn.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-800">{checkIn.customer_name}</div>
                            {checkIn.customer_phone && (
                              <div className="text-sm text-gray-600">{checkIn.customer_phone}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-800">
                            {format(checkInDateTime, 'MMM d, yyyy')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {format(checkInDateTime, 'h:mm a')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-800">
                            {getServiceNames(checkIn.services)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-800">
                            {getTechnicianName(checkIn.technician_id)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-800">
                            {checkIn.total_duration} min
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-800">
                            {formatCurrency(checkIn.total_price)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => deleteCheckIn(checkIn.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ About Walk-In Check-Ins</h3>
          <p className="text-blue-800 text-sm mb-2">
            This page displays all walk-in customers who checked in using the "Walk-In Check-In" flow from the customer portal.
          </p>
          <p className="text-blue-800 text-sm">
            Check-ins are created when customers arrive at the salon without an appointment. They select their services and preferred technician at the front desk.
          </p>
        </div>
      </div>
    </div>
  );
}
