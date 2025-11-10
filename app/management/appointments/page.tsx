'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { format, parseISO, startOfWeek, addDays, isSameDay } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

type Appointment = {
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

type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

export default function AdminAppointmentsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadAppointments();
      loadServices();
    }
  }, [user, selectedDate, filterStatus]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/management/login');
      return;
    }

    setUser(user);
    setLoading(false);
  };

  const loadAppointments = async () => {
    let query = supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }

    const { data, error } = await query;

    if (data) setAppointments(data);
    if (error) console.error('Error loading appointments:', error);
  };

  const loadServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*');

    if (data) setServices(data);
    if (error) console.error('Error loading services:', error);
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (!error) {
      loadAppointments();
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (!error) {
      loadAppointments();
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

  // Filter appointments by search term
  const filteredAppointments = appointments.filter(apt =>
    apt.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.customer_phone.includes(searchTerm)
  );

  // Get appointments for the week
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

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
              <h1 className="text-2xl font-bold text-gray-800">Appointment Management</h1>
            </div>
            <Link
              href="/management/appointments/new"
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition"
            >
              + New Appointment
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search by Name or Phone
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Enter name or phone..."
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
              >
                <option value="all">All Appointments</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Quick Stats */}
            <div className="flex items-end">
              <div className="bg-pink-50 rounded-lg p-4 w-full">
                <div className="text-sm text-gray-600">Total Appointments</div>
                <div className="text-2xl font-bold text-pink-600">{filteredAppointments.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Week View Calendar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Week View</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                ← Previous Week
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Next Week →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayAppointments = filteredAppointments.filter(apt =>
                isSameDay(parseISO(apt.appointment_date), day)
              );

              return (
                <div key={day.toISOString()} className={`border rounded-lg p-3 min-h-32 ${
                  isSameDay(day, new Date()) ? 'bg-pink-50 border-pink-300' : 'bg-gray-50'
                }`}>
                  <div className="text-center mb-2">
                    <div className="text-xs text-gray-600">{format(day, 'EEE')}</div>
                    <div className="text-lg font-bold text-gray-800">{format(day, 'd')}</div>
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.map(apt => (
                      <div
                        key={apt.id}
                        className={`text-xs p-1 rounded ${getStatusColor(apt.status)}`}
                      >
                        {apt.appointment_time} - {apt.customer_name.split(' ')[0]}
                      </div>
                    ))}
                    {dayAppointments.length === 0 && (
                      <div className="text-xs text-gray-400 text-center">No bookings</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">All Appointments</h2>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No appointments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => {
                const appointmentServices = getServiceDetails(appointment.services);
                const totalPrice = getTotalPrice(appointment.services);

                return (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">
                            {appointment.customer_name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          📞 {appointment.customer_phone}
                        </p>
                        <p className="text-gray-700 font-semibold mt-1">
                          📅 {format(parseISO(appointment.appointment_date), 'EEEE, MMMM d, yyyy')} at {appointment.appointment_time}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-pink-600">
                          {formatCurrency(totalPrice)}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Services:</h4>
                      <div className="flex flex-wrap gap-2">
                        {appointmentServices.map((service) => (
                          <span
                            key={service.id}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {service.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mb-4 bg-gray-50 p-3 rounded">
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Notes:</h4>
                        <p className="text-sm text-gray-600">{appointment.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                        >
                          Confirm
                        </button>
                      )}
                      {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                        >
                          Mark Complete
                        </button>
                      )}
                      {appointment.status !== 'cancelled' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition text-sm"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
