'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { validatePhone, formatCurrency, formatTime12Hour } from '@/lib/utils';
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
      // Validate all required data before submitting
      if (!customerName.trim()) {
        throw new Error('Customer name is required');
      }
      if (!customerPhone.trim()) {
        throw new Error('Phone number is required');
      }
      if (selectedServices.length === 0) {
        throw new Error('Please select at least one service');
      }
      if (!selectedDate) {
        throw new Error('Please select a date');
      }
      if (!selectedTime) {
        throw new Error('Please select a time');
      }

      console.log('Submitting appointment:', {
        customer_name: customerName,
        customer_phone: customerPhone,
        services: selectedServices,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
      });

      const { data, error: insertError } = await supabase
        .from('appointments')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone,
          services: selectedServices,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: selectedTime,
          notes: notes || null,
          status: 'pending',
        })
        .select();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw insertError;
      }

      if (!data || data.length === 0) {
        console.error('No data returned from insert');
        throw new Error('Booking failed - no confirmation received');
      }

      console.log('Appointment created successfully:', data);
      setSuccess(true);
    } catch (err: any) {
      console.error('Appointment booking error:', err);
      setError(err.message || 'Failed to book appointment. Please try again.');
      setLoading(false);
      // Don't set loading to false in finally - keep it true on success
      return;
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container mx-auto px-6 py-16 max-w-3xl">
          <div className="card-hover text-center animate-slide-up">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="heading-lg text-green-700 mb-4">Appointment Booked!</h2>
            <p className="text-xl text-gray-700 mb-3">
              Thank you, <span className="font-bold text-gray-900">{customerName}</span>!
            </p>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully scheduled.
            </p>
            <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-6 mb-8">
              <p className="text-gray-700 font-semibold text-lg mb-2">
                {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-pink-600 font-bold text-2xl">
                {formatTime12Hour(selectedTime)}
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-8">
              We'll send you a confirmation at <span className="font-semibold">{customerPhone}</span>
            </p>
            <a
              href="/"
              className="btn-primary text-lg px-10 py-4"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-container">
      <h1 className="heading-lg text-center mb-12">Book an Appointment</h1>

      {/* Progress Indicator - Enhanced */}
      <div className="card mb-12">
        <div className="flex items-center justify-between">
          <div className={`flex items-center transition-smooth ${step >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-smooth ${step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span className="ml-3 font-bold">Your Info</span>
          </div>
          <div className={`flex-1 h-2 mx-4 rounded-full transition-smooth ${step >= 2 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center transition-smooth ${step >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-smooth ${step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="ml-3 font-bold">Services</span>
          </div>
          <div className={`flex-1 h-2 mx-4 rounded-full transition-smooth ${step >= 3 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center transition-smooth ${step >= 3 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-smooth ${step >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <span className="ml-3 font-bold">Date & Time</span>
          </div>
          <div className={`flex-1 h-2 mx-4 rounded-full transition-smooth ${step >= 4 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center transition-smooth ${step >= 4 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-smooth ${step >= 4 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              4
            </div>
            <span className="ml-3 font-bold">Notes</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="card-hover bg-red-50 border-2 border-red-500 mb-8 animate-slide-up">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Customer Information */}
      {step === 1 && (
        <div className="card-hover animate-slide-up">
          <h2 className="heading-sm mb-8">Your Information</h2>
          <div className="space-y-8">
            <div>
              <label className="form-label">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="form-label">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="form-input"
                placeholder="(555) 123-4567"
              />
              <p className="text-sm text-gray-500 mt-2">
                We'll use this to send appointment confirmations and reminders
              </p>
            </div>

            <button
              onClick={handleNext}
              className="btn-primary w-full text-lg"
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
                    {formatTime12Hour(time)}
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
                  <span>{formatTime12Hour(selectedTime)}</span>
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
                <ul className="space-y-1">
                  {getSelectedServicesData().map((service) => (
                    <li key={service.id} className="text-gray-700">
                      • {service.name}
                    </li>
                  ))}
                </ul>
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
    </div>
  );
}
