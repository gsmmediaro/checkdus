'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { validatePhone, formatCurrency } from '@/lib/utils';
import { format, addDays, startOfDay, setHours, setMinutes } from 'date-fns';

type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

export default function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');

    if (data) setServices(data);
    if (error) console.error('Error loading services:', error);
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

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      dates.push(addDays(startOfDay(new Date()), i));
    }
    return dates;
  };

  // Generate time slots from 9 AM to 7 PM (30-minute intervals)
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 19 && minute === 30) break; // Don't go past 7 PM
        const time = setMinutes(setHours(new Date(), hour), minute);
        slots.push(format(time, 'HH:mm'));
      }
    }
    return slots;
  };

  const handleNext = () => {
    setError('');

    if (step === 1) {
      if (!customerName.trim()) {
        setError('Name is required');
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
    }

    if (step === 2 && selectedServices.length === 0) {
      setError('Please select at least one service');
      return;
    }

    if (step === 3) {
      if (!selectedDate) {
        setError('Please select a date');
        return;
      }
      if (!selectedTime) {
        setError('Please select a time');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone,
          services: selectedServices,
          appointment_date: format(selectedDate!, 'yyyy-MM-dd'),
          appointment_time: selectedTime,
          notes: notes || null,
          status: 'pending',
        });

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h2>
          <p className="text-gray-600 mb-2">
            Thank you, {customerName}! Your appointment has been scheduled.
          </p>
          <p className="text-gray-700 font-semibold mb-6">
            {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
          </p>
          <p className="text-sm text-gray-600 mb-6">
            We'll send you a confirmation at {customerPhone}
          </p>
          <a
            href="/"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Book an Appointment</h1>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${step >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span className="ml-2 font-semibold text-sm">Your Info</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="ml-2 font-semibold text-sm">Services</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 3 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <span className="ml-2 font-semibold text-sm">Date & Time</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 4 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 4 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              4
            </div>
            <span className="ml-2 font-semibold text-sm">Notes</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Step 1: Customer Information */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Enter your full name"
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
              <p className="text-sm text-gray-500 mt-1">
                We'll use this to send appointment confirmations and reminders
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold"
            >
              Continue to Service Selection
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Services */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Services</h2>
          <div className="space-y-4 mb-8">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition flex items-center ${
                  selectedServices.includes(service.id)
                    ? 'border-pink-600 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-400'
                }`}
              >
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-4 flex-shrink-0 ${
                  selectedServices.includes(service.id) ? 'bg-pink-600 border-pink-600' : 'border-gray-400'
                }`}>
                  {selectedServices.includes(service.id) && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                  <p className="text-gray-600">{service.duration_minutes} minutes</p>
                </div>
                <div className="text-pink-600 font-bold text-xl">
                  {formatCurrency(service.price)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold"
            >
              Continue to Date & Time
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date & Time */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Date & Time</h2>

          <div className="mb-8">
            <h3 className="font-semibold text-gray-700 mb-4">Choose a Date</h3>
            <div className="grid grid-cols-7 gap-2">
              {getAvailableDates().map((date) => (
                <button
                  key={date.toISOString()}
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

          {selectedDate && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-700 mb-4">
                Available Times for {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {getTimeSlots().map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg border-2 transition font-semibold ${
                      selectedTime === time
                        ? 'border-pink-600 bg-pink-600 text-white'
                        : 'border-gray-300 hover:border-pink-400 text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold"
            >
              Continue to Notes
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Additional Notes */}
      {step === 4 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Notes</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Special Requests or Notes <span className="text-gray-500 text-sm">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Any special requests or preferences?"
              />
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Appointment Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Date:</span>
                  <span>{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Time:</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Name:</span>
                  <span>{customerName}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Phone:</span>
                  <span>{customerPhone}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="font-semibold text-gray-700 mb-2">Services:</div>
                {getSelectedServicesData().map((service) => (
                  <div key={service.id} className="flex justify-between text-gray-700 mb-1">
                    <span>{service.name}</span>
                    <span>{formatCurrency(service.price)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-gray-700 font-semibold text-lg mt-4 pt-4 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(getTotalPrice())}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
