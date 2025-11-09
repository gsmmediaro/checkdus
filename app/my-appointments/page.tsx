'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { validatePhone, formatCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

type Appointment = {
  id: string;
  customer_name: string;
  customer_phone: string;
  services: string[];
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  status: string;
  created_at: string;
};

type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

export default function MyAppointmentsPage() {
  const [phone, setPhone] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSearched(false);

    if (!phone.trim()) {
      setError('Please enter a phone number');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      // Load services first
      const { data: servicesData } = await supabase
        .from('services')
        .select('*');

      if (servicesData) {
        setServices(servicesData);
      }

      // Search for appointments
      const { data, error: searchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('customer_phone', phone)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (searchError) throw searchError;

      setAppointments(data || []);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to search appointments. Please try again.');
    } finally {
      setLoading(false);
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="page-wrapper">
      <div className="page-container">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Appointments</h1>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Enter Your Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="(555) 123-4567"
            />
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search Appointments'}
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div>
          {appointments.length === 0 ? (
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-8 text-center">
              <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Appointments Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any appointments with this phone number.
              </p>
              <a
                href="/book-appointment"
                className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
              >
                Book Your First Appointment
              </a>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Appointments ({appointments.length})
              </h2>

              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const appointmentServices = getServiceDetails(appointment.services);
                  const totalPrice = getTotalPrice(appointment.services);
                  const appointmentDate = parseISO(appointment.appointment_date);
                  const isPast = appointmentDate < new Date();

                  return (
                    <div
                      key={appointment.id}
                      className="bg-white rounded-lg shadow-md p-6 border-l-4 border-pink-600"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {format(appointmentDate, 'EEEE, MMMM d, yyyy')}
                          </h3>
                          <p className="text-lg text-gray-600">
                            {appointment.appointment_time}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </div>

                      <div className="border-t pt-4 mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">Services:</h4>
                        <div className="space-y-2">
                          {appointmentServices.map((service) => (
                            <div key={service.id} className="flex justify-between text-gray-700">
                              <span>{service.name}</span>
                              <span>{formatCurrency(service.price)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-gray-800 font-semibold text-lg mt-3 pt-3 border-t">
                          <span>Total:</span>
                          <span>{formatCurrency(totalPrice)}</span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <h4 className="font-semibold text-gray-700 text-sm mb-1">Notes:</h4>
                          <p className="text-gray-600 text-sm">{appointment.notes}</p>
                        </div>
                      )}

                      <div className="text-sm text-gray-500">
                        <p>Name: {appointment.customer_name}</p>
                        <p>Phone: {appointment.customer_phone}</p>
                        <p className="mt-2">Booked on: {format(parseISO(appointment.created_at), 'MMMM d, yyyy')}</p>
                      </div>

                      {isPast && appointment.status === 'pending' && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm text-yellow-800">
                          This appointment date has passed. Please contact us to reschedule.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      {!searched && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-3">Need Help?</h3>
          <div className="space-y-2 text-gray-600">
            <p>• Enter the phone number you used when booking</p>
            <p>• If you can't find your appointment, please contact us</p>
            <p>• To reschedule or cancel, please call us at (555) 123-4567</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
