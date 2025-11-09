'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { validatePhone, formatCurrency, formatDuration } from '@/lib/utils';

type Service = {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
};

type Technician = {
  id: string;
  full_name: string;
  initials: string;
  specialty: string;
  status: string;
};

export default function CheckInPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadServices();
    loadTechnicians();
  }, []);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');

    if (data) setServices(data);
    if (error) console.error('Error loading services:', error);
  };

  const loadTechnicians = async () => {
    const { data, error } = await supabase
      .from('technicians')
      .select('*')
      .eq('status', 'available')
      .order('full_name');

    if (data) setTechnicians(data);
    if (error) console.error('Error loading technicians:', error);
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

  const handleNext = () => {
    if (step === 1 && selectedServices.length === 0) {
      setError('Please select at least one service');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Name is required');
      return;
    }

    if (customerPhone && !validatePhone(customerPhone)) {
      setError('Invalid phone format');
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('check_ins')
        .insert({
          customer_name: customerName,
          customer_phone: customerPhone || null,
          services: selectedServices,
          technician_id: selectedTechnician,
          total_price: getTotalPrice(),
          total_duration: getTotalDuration(),
        });

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to check in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check-in Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you, {customerName}! We'll be with you shortly.
            </p>
            <a
              href="/"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
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
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Walk-In Check In</h1>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${step >= 1 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span className="ml-2 font-semibold">Services</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="ml-2 font-semibold">Technician</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 3 ? 'text-pink-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <span className="ml-2 font-semibold">Your Info</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Step 1: Select Services */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Services</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition ${
                  selectedServices.includes(service.id)
                    ? 'border-pink-600 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-400'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    selectedServices.includes(service.id) ? 'bg-pink-600 border-pink-600' : 'border-gray-400'
                  }`}>
                    {selectedServices.includes(service.id) && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <p className="text-gray-600">{formatDuration(service.duration_minutes)}</p>
                <p className="text-pink-600 font-bold text-xl">{formatCurrency(service.price)}</p>
              </div>
            ))}
          </div>

          {selectedServices.length > 0 && (
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-2">Summary</h3>
              <div className="flex justify-between text-gray-700">
                <span>Total Time:</span>
                <span className="font-semibold">{formatDuration(getTotalDuration())}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Total Price:</span>
                <span className="font-semibold">{formatCurrency(getTotalPrice())}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleNext}
            className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold"
          >
            Continue to Technician Selection
          </button>
        </div>
      )}

      {/* Step 2: Choose Technician */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Technician</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Next Available Option */}
            <div
              onClick={() => setSelectedTechnician(null)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition ${
                selectedTechnician === null
                  ? 'border-pink-600 bg-pink-50'
                  : 'border-gray-300 hover:border-pink-400'
              }`}
            >
              <div className="flex items-start">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mr-4 text-purple-600 font-bold text-xl">
                  NA
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">Next Available</h3>
                  <p className="text-sm text-gray-600">Fastest Service</p>
                  <p className="text-xs text-gray-500 mt-1">Get served by the first available technician</p>
                </div>
              </div>
            </div>

            {technicians.map((tech) => (
              <div
                key={tech.id}
                onClick={() => setSelectedTechnician(tech.id)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition ${
                  selectedTechnician === tech.id
                    ? 'border-pink-600 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-400'
                }`}
              >
                <div className="flex items-start">
                  <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mr-4 text-pink-600 font-bold text-xl">
                    {tech.initials}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{tech.full_name}</h3>
                    <p className="text-sm text-gray-600">{tech.specialty}</p>
                    <div className="mt-2 inline-block">
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Available</span>
                    </div>
                  </div>
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
              Continue to Your Information
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Customer Information */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Your Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number <span className="text-gray-500 text-sm">(optional)</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                placeholder="(555) 123-4567"
              />
              <p className="text-sm text-gray-500 mt-1">
                Optional - for appointment reminders and updates
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {getSelectedServicesData().map((service) => (
                  <div key={service.id} className="flex justify-between text-gray-700">
                    <span>{service.name}</span>
                    <span>{formatCurrency(service.price)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-gray-700 font-semibold text-lg">
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
                {loading ? 'Checking In...' : 'Complete Check-In'}
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}
