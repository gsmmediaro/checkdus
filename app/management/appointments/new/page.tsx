'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { format, addDays, startOfDay, setHours, setMinutes } from 'date-fns';
import { validatePhone, formatCurrency } from '@/lib/utils';
import Link from 'next/link';

type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

type Client = {
  customer_name: string;
  customer_phone: string;
};

export default function NewAppointmentPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'pending' | 'confirmed'>('confirmed');

  // Data
  const [services, setServices] = useState<Service[]>([]);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [searchResults, setSearchResults] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadServices();
      loadRecentClients();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.length >= 3) {
      searchClients();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/management/login');
      return;
    }

    setUser(user);
    setLoading(false);
  };

  const loadServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');

    if (data) setServices(data);
    if (error) console.error('Error loading services:', error);
  };

  const loadRecentClients = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('customer_name, customer_phone')
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      // Remove duplicates
      const unique = data.filter((client, index, self) =>
        index === self.findIndex((c) => c.customer_phone === client.customer_phone)
      );
      setRecentClients(unique);
    }
    if (error) console.error('Error loading recent clients:', error);
  };

  const searchClients = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('customer_name, customer_phone')
      .or(`customer_name.ilike.%${searchTerm}%,customer_phone.ilike.%${searchTerm}%`)
      .limit(5);

    if (data) {
      const unique = data.filter((client, index, self) =>
        index === self.findIndex((c) => c.customer_phone === client.customer_phone)
      );
      setSearchResults(unique);
    }
    if (error) console.error('Error searching clients:', error);
  };

  const selectClient = (client: Client) => {
    setCustomerName(client.customer_name);
    setCustomerPhone(client.customer_phone);
    setSearchTerm('');
    setSearchResults([]);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getSelectedServicesData = () => {
    return services.filter(s => selectedServices.includes(s.id));
  };

  const getTotalPrice = () => {
    return getSelectedServicesData().reduce((sum, s) => sum + s.price, 0);
  };

  const getTotalDuration = () => {
    return getSelectedServicesData().reduce((sum, s) => sum + s.duration_minutes, 0);
  };

  // Generate next 30 days
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      dates.push(addDays(startOfDay(new Date()), i));
    }
    return dates;
  };

  // Generate time slots from 9 AM to 7 PM (15-minute intervals for admin)
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      for (let minute of [0, 15, 30, 45]) {
        if (hour === 19 && minute > 0) break;
        const time = setMinutes(setHours(new Date(), hour), minute);
        slots.push(format(time, 'HH:mm'));
      }
    }
    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!customerName.trim()) {
      setError('Customer name is required');
      return;
    }

    if (!customerPhone.trim()) {
      setError('Customer phone is required');
      return;
    }

    if (!validatePhone(customerPhone)) {
      setError('Please enter a valid phone number');
      return;
    }

    if (selectedServices.length === 0) {
      setError('Please select at least one service');
      return;
    }

    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    const timeToUse = customTime || selectedTime;
    if (!timeToUse) {
      setError('Please select or enter a time');
      return;
    }

    setSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone,
          services: selectedServices,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: timeToUse,
          notes: notes || null,
          status: status,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/management/appointments');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create appointment. Please try again.');
    } finally {
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

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Created!</h2>
            <p className="text-gray-600">
              Redirecting to appointments list...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <Link href="/management/appointments" className="text-pink-600 hover:text-pink-700 text-sm mb-2 inline-block">
            ← Back to Appointments
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Create New Appointment</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Client Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Client Information</h2>

            {/* Search Existing Clients */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Search Existing Clients
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Search by name or phone..."
              />
              {searchResults.length > 0 && (
                <div className="mt-2 border rounded-lg divide-y max-h-48 overflow-y-auto">
                  {searchResults.map((client, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectClient(client)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition"
                    >
                      <div className="font-semibold text-gray-800">{client.customer_name}</div>
                      <div className="text-sm text-gray-600">{client.customer_phone}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Clients */}
            {recentClients.length > 0 && !searchTerm && (
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Recent Clients
                </label>
                <div className="flex flex-wrap gap-2">
                  {recentClients.slice(0, 5).map((client, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectClient(client)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm"
                    >
                      {client.customer_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    placeholder="Enter client name"
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
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Select Services</h2>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition flex items-center justify-between ${
                    selectedServices.includes(service.id)
                      ? 'border-pink-600 bg-pink-50'
                      : 'border-gray-300 hover:border-pink-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedServices.includes(service.id) ? 'bg-pink-600 border-pink-600' : 'border-gray-400'
                    }`}>
                      {selectedServices.includes(service.id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.duration_minutes} minutes</p>
                    </div>
                  </div>
                  <div className="text-pink-600 font-bold text-lg">
                    {formatCurrency(service.price)}
                  </div>
                </div>
              ))}
            </div>

            {selectedServices.length > 0 && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <div className="flex justify-between text-gray-700 font-semibold">
                  <span>Total Duration: {getTotalDuration()} minutes</span>
                  <span>Total Price: {formatCurrency(getTotalPrice())}</span>
                </div>
              </div>
            )}
          </div>

          {/* Date & Time Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Date & Time</h2>

            {/* Date Picker */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">
                Select Date <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-7 gap-2">
                {getAvailableDates().slice(0, 14).map((date) => (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-lg border-2 transition ${
                      selectedDate?.toDateString() === date.toDateString()
                        ? 'border-pink-600 bg-pink-50'
                        : 'border-gray-300 hover:border-pink-400'
                    }`}
                  >
                    <div className="text-xs text-gray-600">{format(date, 'EEE')}</div>
                    <div className="text-lg font-bold">{format(date, 'd')}</div>
                    <div className="text-xs text-gray-600">{format(date, 'MMM')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  Select Time <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {getTimeSlots().map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setSelectedTime(time);
                        setCustomTime('');
                      }}
                      className={`p-2 rounded-lg border-2 transition font-semibold text-sm ${
                        selectedTime === time && !customTime
                          ? 'border-pink-600 bg-pink-600 text-white'
                          : 'border-gray-300 hover:border-pink-400 text-gray-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                {/* Custom Time Input */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Or Enter Custom Time (HH:MM)
                  </label>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => {
                      setCustomTime(e.target.value);
                      setSelectedTime('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Additional Options</h2>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Appointment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'pending' | 'confirmed')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Any special requests or notes..."
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Link
              href="/management/appointments"
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold disabled:bg-gray-400"
            >
              {submitting ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
