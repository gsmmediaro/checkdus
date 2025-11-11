'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

type CustomerProfile = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  nail_shape: string | null;
  nail_length: string | null;
  active_length: string | null;
  preferred_style: string | null;
  preferred_polish: string | null;
  last_service: string | null;
  last_visit_date: string | null;
  preferred_technician_id: string | null;
  notes: string | null;
  allergies: string | null;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
};

export default function CustomersPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadCustomers();
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

  const loadCustomers = async () => {
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .order('last_visit_date', { ascending: false, nullsFirst: false });

    if (data) setCustomers(data);
    if (error) console.error('Error loading customers:', error);
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer profile?')) return;

    const { error } = await supabase
      .from('customer_profiles')
      .delete()
      .eq('id', id);

    if (!error) {
      loadCustomers();
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customer_phone.includes(searchTerm) ||
    (customer.customer_email && customer.customer_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          <div className="flex justify-between items-center">
            <div>
              <Link href="/management/dashboard" className="text-pink-600 hover:text-pink-700 text-sm mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Customer Profiles</h1>
            </div>
            <Link
              href="/management/customers/new"
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
            >
              + New Customer
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Search by name, phone, or email..."
              />
            </div>
            <div className="bg-pink-50 rounded-lg px-6 py-3">
              <div className="text-sm text-gray-600">Total Customers</div>
              <div className="text-2xl font-bold text-pink-600">{filteredCustomers.length}</div>
            </div>
          </div>
        </div>

        {/* Customer Grid */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600">No customers found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Link
                key={customer.id}
                href={`/management/customers/${customer.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-pink-400"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {customer.customer_name}
                    </h3>
                    <p className="text-sm text-gray-600">📞 {customer.customer_phone}</p>
                    {customer.customer_email && (
                      <p className="text-sm text-gray-600">✉️ {customer.customer_email}</p>
                    )}
                  </div>
                  {customer.last_visit_date && (
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      Active
                    </div>
                  )}
                </div>

                {/* Preferences Summary */}
                <div className="space-y-2 mb-4">
                  {customer.nail_shape && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Shape:</span>
                      <span className="font-semibold text-gray-700">{customer.nail_shape}</span>
                    </div>
                  )}
                  {customer.preferred_polish && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Polish:</span>
                      <span className="font-semibold text-gray-700">{customer.preferred_polish}</span>
                    </div>
                  )}
                  {customer.last_service && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Last Service:</span>
                      <span className="font-semibold text-gray-700 truncate">{customer.last_service}</span>
                    </div>
                  )}
                </div>

                {/* Last Visit */}
                {customer.last_visit_date ? (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">Last Visit</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {format(parseISO(customer.last_visit_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                ) : (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">No visit history</p>
                  </div>
                )}

                {/* Hover indicator */}
                <div className="mt-4 text-pink-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                  View Full Profile →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
