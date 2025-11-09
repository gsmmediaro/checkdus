'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { validatePhone } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const salonInfo = {
    name: process.env.NEXT_PUBLIC_SALON_NAME || 'Luxury Nails & Spa',
    address: process.env.NEXT_PUBLIC_SALON_ADDRESS || '123 Main Street, Suite 100, City, State 12345',
    phone: process.env.NEXT_PUBLIC_SALON_PHONE || '(555) 123-4567',
    email: process.env.NEXT_PUBLIC_SALON_EMAIL || 'info@luxurynails.com',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Name, email, and message are required');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (phone && !validatePhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert({
          name,
          email,
          phone: phone || null,
          message,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>

              {success && (
                <div className="bg-green-50 border border-green-500 text-green-700 px-4 py-3 rounded mb-4">
                  Thank you! We'll get back to you soon.
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone <span className="text-gray-500 text-sm">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition font-semibold disabled:bg-gray-400"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pink-600 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                    <p className="text-gray-600">{salonInfo.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pink-600 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                    <p className="text-gray-600">{salonInfo.phone}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pink-600 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">{salonInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Hours</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700 font-semibold">Monday - Friday:</span>
                  <span className="text-gray-600">9:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-semibold">Saturday:</span>
                  <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 font-semibold">Sunday:</span>
                  <span className="text-gray-600">10:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Find Us</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '400px' }}>
            <MapComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
