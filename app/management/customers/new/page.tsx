'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { validatePhone } from '@/lib/utils';
import Link from 'next/link';

type Technician = {
  id: string;
  full_name: string;
};

export default function NewCustomerPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const router = useRouter();

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [nailShape, setNailShape] = useState('');
  const [nailLength, setNailLength] = useState('');
  const [activeLength, setActiveLength] = useState('');
  const [preferredStyle, setPreferredStyle] = useState('');
  const [preferredPolish, setPreferredPolish] = useState('');
  const [preferredTechnicianId, setPreferredTechnicianId] = useState('');
  const [notes, setNotes] = useState('');
  const [allergies, setAllergies] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadTechnicians();
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

  const loadTechnicians = async () => {
    const { data } = await supabase
      .from('technicians')
      .select('id, full_name')
      .order('full_name');

    if (data) setTechnicians(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Customer name is required');
      return;
    }

    if (!customerPhone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (!validatePhone(customerPhone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setSubmitting(true);

    try {
      console.log('Creating customer profile:', {
        customer_name: customerName,
        customer_phone: customerPhone,
      });

      const { data, error: insertError } = await supabase
        .from('customer_profiles')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail || null,
          nail_shape: nailShape || null,
          nail_length: nailLength || null,
          active_length: activeLength || null,
          preferred_style: preferredStyle || null,
          preferred_polish: preferredPolish || null,
          preferred_technician_id: preferredTechnicianId || null,
          notes: notes || null,
          allergies: allergies || null,
          special_instructions: specialInstructions || null,
        })
        .select();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw insertError;
      }

      if (!data || data.length === 0) {
        console.error('No data returned from insert');
        throw new Error('Failed to create customer profile - no confirmation received');
      }

      console.log('Customer profile created successfully:', data);
      router.push('/management/customers');
    } catch (err: any) {
      console.error('Customer creation error:', err);
      if (err.code === '23505') {
        setError('A customer with this phone number already exists');
      } else if (err.code === '42P01') {
        setError('Database table not found. Please run the customer_profiles schema in Supabase.');
      } else {
        setError(err.message || 'Failed to create customer profile');
      }
      setSubmitting(false);
    }
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
          <Link href="/management/customers" className="text-pink-600 hover:text-pink-700 text-sm mb-2 inline-block">
            ← Back to Customers
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">New Customer Profile</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="(555) 123-4567"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Nail Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">💅 Nail Preferences</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Shape & Length
                </label>
                <input
                  type="text"
                  value={nailShape}
                  onChange={(e) => setNailShape(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="e.g., Square Round"
                />
                <p className="text-xs text-gray-500 mt-1">Shape preference (Square, Round, Almond, Coffin, etc.)</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Length Preference
                </label>
                <select
                  value={nailLength}
                  onChange={(e) => setNailLength(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                >
                  <option value="">Select length...</option>
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Long">Long</option>
                  <option value="Extra Long">Extra Long</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Active Length
                </label>
                <input
                  type="text"
                  value={activeLength}
                  onChange={(e) => setActiveLength(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="Specific length measurement"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Preferred Style
                </label>
                <input
                  type="text"
                  value={preferredStyle}
                  onChange={(e) => setPreferredStyle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="e.g., Natural Finish"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Preferred Polish
                </label>
                <input
                  type="text"
                  value={preferredPolish}
                  onChange={(e) => setPreferredPolish(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="e.g., DND 650"
                />
              </div>
            </div>
          </div>

          {/* Service Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Service Preferences</h2>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Preferred Technician
              </label>
              <select
                value={preferredTechnicianId}
                onChange={(e) => setPreferredTechnicianId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              >
                <option value="">No preference</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Notes & Preferences
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="e.g., She likes it even on the sides; keep same shape and length as previous set"
                />
                <p className="text-xs text-gray-500 mt-1">Detailed preferences and instructions</p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Allergies & Sensitivities
                </label>
                <textarea
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="Any allergies or product sensitivities"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  placeholder="Special handling or service instructions"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Link
              href="/management/customers"
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold disabled:bg-gray-400"
            >
              {submitting ? 'Creating...' : 'Create Customer Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
