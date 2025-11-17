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
        <div className="card-hover animate-slide-up">
          <h2 className="heading-sm mb-8">Select Services</h2>
          <div className="space-y-4 mb-8">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-smooth flex items-center shadow-md ${
                  selectedServices.includes(service.id)
                    ? 'border-pink-600 bg-pink-50 shadow-lg'
                    : 'border-gray-300 hover:border-pink-400 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <div className={`w-7 h-7 rounded-md border-2 flex items-center justify-center mr-5 flex-shrink-0 transition-smooth ${
                  selectedServices.includes(service.id) ? 'bg-pink-600 border-pink-600 scale-110' : 'border-gray-400'
                }`}>
                  {selectedServices.includes(service.id) && (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-gray-600 font-medium">{service.duration_minutes} minutes</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleBack}
              className="btn-outline flex-1 text-lg"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="btn-primary flex-1 text-lg"
            >
              Continue to Date & Time
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date & Time */}
      {step === 3 && (
        <div className="card-hover animate-slide-up">
          <h2 className="heading-sm mb-8">Select Date & Time</h2>

          <div className="mb-10">
            <h3 className="font-bold text-lg text-gray-800 mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Choose a Date
            </h3>
            <div className="grid grid-cols-7 gap-3">
              {getAvailableDates().map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`p-4 rounded-xl border-2 transition-smooth shadow-sm hover:shadow-md ${
                    selectedDate?.toDateString() === date.toDateString()
                      ? 'border-pink-600 bg-pink-600 text-white shadow-lg scale-105'
                      : 'border-gray-300 hover:border-pink-400 hover:-translate-y-1'
                  }`}
                >
                  <div className={`text-xs font-medium mb-1 ${selectedDate?.toDateString() === date.toDateString() ? 'text-pink-100' : 'text-gray-600'}`}>
                    {format(date, 'EEE')}
                  </div>
                  <div className={`text-xl font-bold mb-1 ${selectedDate?.toDateString() === date.toDateString() ? 'text-white' : 'text-gray-900'}`}>
                    {format(date, 'd')}
                  </div>
                  <div className={`text-xs font-medium ${selectedDate?.toDateString() === date.toDateString() ? 'text-pink-100' : 'text-gray-600'}`}>
                    {format(date, 'MMM')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div className="mb-10 animate-slide-up">
              <h3 className="font-bold text-lg text-gray-800 mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Available Times for {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {getTimeSlots().map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-4 rounded-xl border-2 transition-smooth font-bold shadow-sm hover:shadow-md ${
                      selectedTime === time
                        ? 'border-pink-600 bg-pink-600 text-white shadow-lg scale-105'
                        : 'border-gray-300 hover:border-pink-400 text-gray-700 hover:-translate-y-1'
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
              className="btn-outline flex-1 text-lg"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="btn-primary flex-1 text-lg"
            >
              Continue to Notes
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Additional Notes */}
      {step === 4 && (
        <div className="card-hover animate-slide-up">
          <h2 className="heading-sm mb-8">Review & Confirm</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="form-label">
                Special Requests or Notes <span className="text-gray-500 text-sm font-normal">(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="form-input"
                placeholder="Any special requests or preferences?"
              />
              <p className="text-sm text-gray-500 mt-2">
                Let us know if you have any specific preferences or requirements
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200 p-8 rounded-xl shadow-md">
              <h3 className="font-bold text-2xl text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Appointment Summary
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start bg-white rounded-lg p-4 shadow-sm">
                  <span className="font-bold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date:
                  </span>
                  <span className="font-semibold text-gray-900">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between items-start bg-white rounded-lg p-4 shadow-sm">
                  <span className="font-bold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Time:
                  </span>
                  <span className="font-semibold text-gray-900">{formatTime12Hour(selectedTime)}</span>
                </div>
                <div className="flex justify-between items-start bg-white rounded-lg p-4 shadow-sm">
                  <span className="font-bold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Name:
                  </span>
                  <span className="font-semibold text-gray-900">{customerName}</span>
                </div>
                <div className="flex justify-between items-start bg-white rounded-lg p-4 shadow-sm">
                  <span className="font-bold text-gray-700 flex items-center gap-2">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone:
                  </span>
                  <span className="font-semibold text-gray-900">{customerPhone}</span>
                </div>
              </div>
              <div className="border-t-2 border-pink-200 pt-6">
                <div className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Services Selected:
                </div>
                <ul className="space-y-3">
                  {getSelectedServicesData().map((service) => (
                    <li key={service.id} className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-pink-600"></div>
                      <span className="font-medium text-gray-900">{service.name}</span>
                      <span className="ml-auto text-sm text-gray-600">{service.duration_minutes} min</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="btn-outline flex-1 text-lg"
                disabled={loading}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 text-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Appointment
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}
