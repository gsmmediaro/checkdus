import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Luxury Nail Spa
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Premium nail care and beauty services at Gulf Coast Town Center
        </p>

        {/* Google Rating */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center">
            {[...Array(4)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
            <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </div>
          <span className="text-gray-700 font-semibold">4.0</span>
          <span className="text-gray-500">(315 reviews)</span>
        </div>

        {/* Salon Image */}
        <div className="max-w-4xl mx-auto mb-12 rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/salon-storefront.jpg"
            alt="Luxury Nail Spa storefront at Gulf Coast Town Center"
            width={1200}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Contact Info Bar */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Location</p>
                <p className="text-gray-600 text-sm">10029 Gulf Center Dr #150</p>
                <p className="text-gray-600 text-sm">Fort Myers, FL 33913</p>
                <p className="text-gray-500 text-xs mt-1">Gulf Coast Town Center</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Contact</p>
                <a href="tel:+12394546289" className="text-pink-600 hover:text-pink-700 font-semibold text-lg">
                  (239) 454-6289
                </a>
                <p className="text-gray-500 text-xs mt-1">Call for appointments or inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Action Cards */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Check In Now Card */}
          <Link href="/check-in" className="group">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-pink-400">
              <div className="text-center">
                <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-200 transition">
                  <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Check In Now</h2>
                <p className="text-gray-600">
                  Walk-in customers: Select your services and check in for immediate attention
                </p>
              </div>
            </div>
          </Link>

          {/* Book Appointment Card */}
          <Link href="/book-appointment" className="group">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-pink-400">
              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Book Appointment</h2>
                <p className="text-gray-600">
                  Schedule your visit in advance and secure your preferred time slot
                </p>
              </div>
            </div>
          </Link>

          {/* My Appointments Card */}
          <Link href="/my-appointments" className="group">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-pink-400">
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">My Appointments</h2>
                <p className="text-gray-600">
                  View and manage your existing appointments
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gradient-to-b from-white to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Our Services</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Experience exceptional nail care and beauty services in a luxurious, relaxing environment
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Manicures</h3>
              <p className="text-gray-600 text-sm">Professional gel and acrylic manicures with premium products</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Pedicures</h3>
              <p className="text-gray-600 text-sm">Luxurious spa pedicures for ultimate relaxation and foot care</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Nail Extensions</h3>
              <p className="text-gray-600 text-sm">Beautiful acrylic and gel extensions tailored to your style</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Waxing Services</h3>
              <p className="text-gray-600 text-sm">Professional waxing and hair removal services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Hours of Operation</h2>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700 font-semibold">Monday</span>
              <span className="text-gray-600">9:30 AM – 7:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700 font-semibold">Tuesday</span>
              <span className="text-gray-600">9:30 AM – 7:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700 font-semibold">Wednesday</span>
              <span className="text-gray-600">9:30 AM – 7:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700 font-semibold">Thursday</span>
              <span className="text-gray-600">9:30 AM – 7:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700 font-semibold">Friday</span>
              <span className="text-gray-600">9:30 AM – 7:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700 font-semibold">Saturday</span>
              <span className="text-gray-600">9:30 AM – 7:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700 font-semibold">Sunday</span>
              <span className="text-gray-600">10:00 AM – 5:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Luxury?</h2>
          <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
            Book your appointment today and discover why we're Gulf Coast Town Center's premier nail spa
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/book-appointment" className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition">
              Book Appointment
            </Link>
            <a href="tel:+12394546289" className="bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-800 transition">
              Call (239) 454-6289
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
