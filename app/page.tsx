import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Hero Section - Enhanced Spacing */}
      <section className="section-spacing">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <h1 className="heading-xl">
              Luxury Nail Spa
            </h1>
            <p className="text-subtitle max-w-2xl mx-auto">
              Premium nail care and beauty services at Gulf Coast Town Center
            </p>

            {/* Google Rating - Enhanced Spacing */}
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400 fill-current transition-transform hover:scale-110" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <svg className="w-6 h-6 text-gray-300 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </div>
              <span className="text-gray-800 font-bold text-lg">4.0</span>
              <span className="text-gray-600 font-medium">(315 reviews)</span>
            </div>

            {/* Salon Image - Enhanced with proper spacing */}
            <div className="max-w-5xl mx-auto mb-16">
              <div className="image-container shadow-2xl">
                <Image
                  src="/salon-storefront.jpg"
                  alt="Luxury Nail Spa storefront at Gulf Coast Town Center"
                  width={1200}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Contact Info Bar - Redesigned with better spacing */}
            <div className="max-w-5xl mx-auto mb-16">
              <div className="card-hover">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4 group">
                    <div className="bg-pink-100 p-4 rounded-xl group-hover:bg-pink-200 transition-smooth">
                      <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-gray-900 text-lg mb-2">Location</p>
                      <p className="text-gray-700 font-medium">10029 Gulf Center Dr #150</p>
                      <p className="text-gray-700 font-medium">Fort Myers, FL 33913</p>
                      <p className="text-gray-500 text-sm mt-2 italic">Gulf Coast Town Center</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="bg-purple-100 p-4 rounded-xl group-hover:bg-purple-200 transition-smooth">
                      <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-gray-900 text-lg mb-2">Contact</p>
                      <a href="tel:+12394546289" className="text-pink-600 hover:text-pink-700 font-bold text-2xl block transition-smooth">
                        (239) 454-6289
                      </a>
                      <p className="text-gray-500 text-sm mt-2">Call for appointments or inquiries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Action Cards - Enhanced with better spacing */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-6">
          <h2 className="heading-md text-center mb-12">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Check In Now Card */}
            <Link href="/check-in" className="group">
              <div className="feature-card text-center">
                <div className="feature-icon bg-pink-100 group-hover:bg-pink-200">
                  <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="heading-sm">Check In Now</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Walk-in customers: Select your services and check in for immediate attention
                </p>
                <span className="text-pink-600 font-semibold group-hover:text-pink-700 inline-flex items-center gap-2 transition-smooth">
                  Get Started
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Book Appointment Card */}
            <Link href="/book-appointment" className="group">
              <div className="feature-card text-center">
                <div className="feature-icon bg-purple-100 group-hover:bg-purple-200">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="heading-sm">Book Appointment</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Schedule your visit in advance and secure your preferred time slot
                </p>
                <span className="text-purple-600 font-semibold group-hover:text-purple-700 inline-flex items-center gap-2 transition-smooth">
                  Schedule Now
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* My Appointments Card */}
            <Link href="/my-appointments" className="group">
              <div className="feature-card text-center">
                <div className="feature-icon bg-blue-100 group-hover:bg-blue-200">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="heading-sm">My Appointments</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  View and manage your existing appointments
                </p>
                <span className="text-blue-600 font-semibold group-hover:text-blue-700 inline-flex items-center gap-2 transition-smooth">
                  View All
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section className="section-spacing bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="heading-md">Our Services</h2>
            <p className="text-subtitle max-w-3xl mx-auto">
              Experience exceptional nail care and beauty services in a luxurious, relaxing environment
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <div className="card-hover text-center group">
              <div className="bg-gradient-to-br from-pink-100 to-pink-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-smooth shadow-md">
                <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Manicures</h3>
              <p className="text-gray-600 leading-relaxed">Professional gel and acrylic manicures with premium products</p>
            </div>
            <div className="card-hover text-center group">
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-smooth shadow-md">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Pedicures</h3>
              <p className="text-gray-600 leading-relaxed">Luxurious spa pedicures for ultimate relaxation and foot care</p>
            </div>
            <div className="card-hover text-center group">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-smooth shadow-md">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Nail Extensions</h3>
              <p className="text-gray-600 leading-relaxed">Beautiful acrylic and gel extensions tailored to your style</p>
            </div>
            <div className="card-hover text-center group">
              <div className="bg-gradient-to-br from-teal-100 to-teal-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-smooth shadow-md">
                <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Waxing Services</h3>
              <p className="text-gray-600 leading-relaxed">Professional waxing and hair removal services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours Section - Enhanced */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-6">
          <h2 className="heading-md text-center mb-12">Hours of Operation</h2>
          <div className="max-w-3xl mx-auto">
            <div className="card-hover">
              <div className="space-y-4">
                {[
                  { day: 'Monday', hours: '9:30 AM – 7:00 PM' },
                  { day: 'Tuesday', hours: '9:30 AM – 7:00 PM' },
                  { day: 'Wednesday', hours: '9:30 AM – 7:00 PM' },
                  { day: 'Thursday', hours: '9:30 AM – 7:00 PM' },
                  { day: 'Friday', hours: '9:30 AM – 7:00 PM' },
                  { day: 'Saturday', hours: '9:30 AM – 7:00 PM' },
                  { day: 'Sunday', hours: '10:00 AM – 5:00 PM', special: true },
                ].map(({ day, hours, special }) => (
                  <div key={day} className={`flex justify-between items-center py-4 border-b border-gray-100 last:border-0 ${special ? 'bg-pink-50 -mx-8 px-8 rounded-lg' : ''}`}>
                    <span className="text-gray-900 font-bold text-lg">{day}</span>
                    <span className="text-gray-700 font-medium text-lg">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA - Enhanced */}
      <section className="section-spacing bg-gradient-to-r from-pink-600 via-pink-700 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience Luxury?
          </h2>
          <p className="text-pink-100 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
            Book your appointment today and discover why we're Gulf Coast Town Center's premier nail spa
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/book-appointment" className="btn-primary text-lg px-10 py-4 bg-white text-pink-600 hover:bg-pink-50">
              Book Appointment
            </Link>
            <a href="tel:+12394546289" className="btn-secondary text-lg px-10 py-4 bg-pink-700 hover:bg-pink-800">
              Call (239) 454-6289
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
