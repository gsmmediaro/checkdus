'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { validatePhone, formatCurrency } from '@/lib/utils';
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

type Appointment = {
  id: string;
  appointment_date: string;
  appointment_time: string;
  services: string[];
  status: string;
  notes: string | null;
};

type Service = {
  id: string;
  name: string;
  price: number;
};

type Technician = {
  id: string;
  full_name: string;
};

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  // Edit form fields
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
      loadCustomer();
      loadAppointments();
      loadServices();
      loadTechnicians();
    }
  }, [user, customerId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/management/login');
      return;
    }

    setUser(user);
    setLoading(false);
  };

  const loadCustomer = async () => {
    const { data, error } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', customerId)
      .single();

    if (data) {
      setCustomer(data);
      populateForm(data);
    }
    if (error) console.error('Error loading customer:', error);
  };

  const loadAppointments = async () => {
    const { data: customerData } = await supabase
      .from('customer_profiles')
      .select('customer_phone')
      .eq('id', customerId)
      .single();

    if (customerData) {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('customer_phone', customerData.customer_phone)
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false });

      if (data) setAppointments(data);
    }
  };

  const loadServices = async () => {
    const { data } = await supabase.from('services').select('*');
    if (data) setServices(data);
  };

  const loadTechnicians = async () => {
    const { data } = await supabase
      .from('technicians')
      .select('id, full_name')
      .order('full_name');
    if (data) setTechnicians(data);
  };

  const populateForm = (data: CustomerProfile) => {
    setCustomerName(data.customer_name);
    setCustomerPhone(data.customer_phone);
    setCustomerEmail(data.customer_email || '');
    setNailShape(data.nail_shape || '');
    setNailLength(data.nail_length || '');
    setActiveLength(data.active_length || '');
    setPreferredStyle(data.preferred_style || '');
    setPreferredPolish(data.preferred_polish || '');
    setPreferredTechnicianId(data.preferred_technician_id || '');
    setNotes(data.notes || '');
    setAllergies(data.allergies || '');
    setSpecialInstructions(data.special_instructions || '');
  };

  const handleUpdate = async (e: React.FormEvent) => {
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
      const { error: updateError } = await supabase
        .from('customer_profiles')
        .update({
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
        .eq('id', customerId);

      if (updateError) throw updateError;

      await loadCustomer();
      setEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update customer profile');
    } finally {
      setSubmitting(false);
    }
  };

  const getServiceDetails = (serviceIds: string[]) => {
    return services.filter(s => serviceIds.includes(s.id));
  };

  const getTotalPrice = (serviceIds: string[]) => {
    const selectedServices = getServiceDetails(serviceIds);
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTechnicianName = (id: string | null) => {
    if (!id) return null;
    const tech = technicians.find(t => t.id === id);
    return tech?.full_name;
  };

  if (loading || !customer) {
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">{customer.customer_name}</h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                {/* Basic Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Nail Preferences */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">💅 Preferences</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Shape</label>
                      <input
                        type="text"
                        value={nailShape}
                        onChange={(e) => setNailShape(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                        placeholder="e.g., Square Round"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Length</label>
                      <select
                        value={nailLength}
                        onChange={(e) => setNailLength(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                      >
                        <option value="">Select...</option>
                        <option value="Short">Short</option>
                        <option value="Medium">Medium</option>
                        <option value="Long">Long</option>
                        <option value="Extra Long">Extra Long</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Active Length</label>
                      <input
                        type="text"
                        value={activeLength}
                        onChange={(e) => setActiveLength(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Style</label>
                      <input
                        type="text"
                        value={preferredStyle}
                        onChange={(e) => setPreferredStyle(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                        placeholder="e.g., Natural Finish"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Polish</label>
                      <input
                        type="text"
                        value={preferredPolish}
                        onChange={(e) => setPreferredPolish(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                        placeholder="e.g., DND 650"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Technician</label>
                      <select
                        value={preferredTechnicianId}
                        onChange={(e) => setPreferredTechnicianId(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                      >
                        <option value="">No preference</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>{tech.full_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Additional Info</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                        placeholder="e.g., She likes it even on the sides; keep same shape and length as previous set"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Allergies</label>
                      <textarea
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Special Instructions</label>
                      <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      populateForm(customer);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition text-sm font-semibold disabled:bg-gray-400"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* View Mode */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Contact Information</h2>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p className="font-semibold text-gray-800">{customer.customer_phone}</p>
                    </div>
                    {customer.customer_email && (
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-semibold text-gray-800">{customer.customer_email}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">💅 Nail Preferences</h2>
                  <div className="space-y-3 text-sm">
                    {customer.nail_shape && (
                      <div>
                        <span className="text-gray-500">Shape & Length:</span>
                        <p className="font-semibold text-gray-800">{customer.nail_shape}</p>
                      </div>
                    )}
                    {customer.nail_length && (
                      <div>
                        <span className="text-gray-500">Length:</span>
                        <p className="font-semibold text-gray-800">{customer.nail_length}</p>
                      </div>
                    )}
                    {customer.active_length && (
                      <div>
                        <span className="text-gray-500">Active Length:</span>
                        <p className="font-semibold text-gray-800">{customer.active_length}</p>
                      </div>
                    )}
                    {customer.preferred_style && (
                      <div>
                        <span className="text-gray-500">Style:</span>
                        <p className="font-semibold text-gray-800">{customer.preferred_style}</p>
                      </div>
                    )}
                    {customer.preferred_polish && (
                      <div>
                        <span className="text-gray-500">Polish:</span>
                        <p className="font-semibold text-gray-800">{customer.preferred_polish}</p>
                      </div>
                    )}
                    {customer.preferred_technician_id && (
                      <div>
                        <span className="text-gray-500">Preferred Technician:</span>
                        <p className="font-semibold text-gray-800">{getTechnicianName(customer.preferred_technician_id)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {(customer.notes || customer.allergies || customer.special_instructions) && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Additional Information</h2>
                    <div className="space-y-3 text-sm">
                      {customer.notes && (
                        <div>
                          <span className="text-gray-500">Notes:</span>
                          <p className="text-gray-800 mt-1">{customer.notes}</p>
                        </div>
                      )}
                      {customer.allergies && (
                        <div>
                          <span className="text-gray-500">Allergies:</span>
                          <p className="text-gray-800 mt-1">{customer.allergies}</p>
                        </div>
                      )}
                      {customer.special_instructions && (
                        <div>
                          <span className="text-gray-500">Special Instructions:</span>
                          <p className="text-gray-800 mt-1">{customer.special_instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Visit History</h2>
                  <div className="space-y-2 text-sm">
                    {customer.last_visit_date ? (
                      <>
                        <div>
                          <span className="text-gray-500">Last Visit:</span>
                          <p className="font-semibold text-gray-800">
                            {format(parseISO(customer.last_visit_date), 'MMMM d, yyyy')}
                          </p>
                        </div>
                        {customer.last_service && (
                          <div>
                            <span className="text-gray-500">Last Service:</span>
                            <p className="text-gray-800">{customer.last_service}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500">No visit history</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Appointment History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Appointment History</h2>

              {appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No appointments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((apt) => {
                    const aptServices = getServiceDetails(apt.services);
                    const total = getTotalPrice(apt.services);

                    return (
                      <div key={apt.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-bold text-gray-800">
                              {format(parseISO(apt.appointment_date), 'EEEE, MMMM d, yyyy')}
                            </div>
                            <div className="text-gray-600">{apt.appointment_time}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm font-semibold text-gray-700 mb-1">Services:</div>
                          <div className="flex flex-wrap gap-2">
                            {aptServices.map((service) => (
                              <span key={service.id} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {service.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        {apt.notes && (
                          <div className="mb-3 text-sm">
                            <span className="text-gray-500">Notes:</span>
                            <p className="text-gray-700">{apt.notes}</p>
                          </div>
                        )}

                        <div className="text-right">
                          <span className="text-lg font-bold text-pink-600">
                            {formatCurrency(total)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
