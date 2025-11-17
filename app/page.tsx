import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Premium Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Luxury Nail Spa
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-gray-700 hover:text-pink-600 font-medium transition-smooth">Services</a>
              <a href="#hours" className="text-gray-700 hover:text-pink-600 font-medium transition-smooth">Hours</a>
              <a href="tel:+12394546289" className="text-gray-700 hover:text-pink-600 font-medium transition-smooth">
                (239) 454-6289
              </a>
              <Link href="/book-appointment" className="btn-primary text-sm px-6 py-2">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium Split Layout */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block">
                <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold tracking-wide uppercase">
                  Gulf Coast Town Center
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Luxury
                </span>
                <br />
                <span className="text-gray-900">Nail Care</span>
                <br />
                <span className="text-gray-700 text-5xl md:text-6xl">Redefined</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Experience Fort Myers' premier nail spa where artistry meets relaxation.
                Trusted by <strong className="text-pink-600">500+ clients</strong> with a 4.0★ rating.
              </p>

              {/* Enhanced CTA Group */}
              <div className="flex flex-wrap gap-4">
                <Link href="/book-appointment" className="btn-primary text-lg px-8 py-4 shadow-xl shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Appointment
                </Link>
                <a href="tel:+12394546289" className="btn-outline text-lg px-8 py-4 group">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Us Today
                </a>
              </div>

              {/* Social Proof Badges */}
              <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">500+ Happy Clients</span>
                </div>
                <div className="h-8 w-px bg-gray-300" />
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                  <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="text-sm text-gray-600 ml-2">4.0 Rating</span>
                </div>
              </div>
            </div>

            {/* Right: Image with decorative elements */}
            <div className="relative">
              {/* Decorative blob */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/salon-storefront.jpg"
                  alt="Luxury Nail Spa storefront"
                  width={600}
                  height={700}
                  className="w-full h-auto"
                  priority
                />
                {/* Floating info card overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Open Today</p>
                      <p className="text-lg font-bold text-gray-900">9:30 AM – 7:00 PM</p>
                    </div>
                    <Link href="/book-appointment" className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-smooth">
                      Book Now
                    </Link>
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
      <section id="services" className="section-spacing bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-pink-600 font-semibold tracking-wide uppercase text-sm">Our Expertise</span>
            <h2 className="heading-md mt-3">Signature Services</h2>
            <p className="text-subtitle max-w-3xl mx-auto">
              From classic manicures to artistic nail extensions, every service is delivered with precision and care
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

      {/* Testimonials Section */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-pink-600 font-semibold tracking-wide uppercase text-sm">Testimonials</span>
            <h2 className="heading-md mt-3">What Our Clients Say</h2>
            <p className="text-subtitle max-w-2xl mx-auto">
              Real reviews from real clients who trust us with their beauty care
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                service: "Gel Manicure",
                rating: 5,
                text: "The attention to detail is incredible! My nails have never looked better. The staff is so welcoming and the salon is absolutely pristine.",
              },
              {
                name: "Maria Rodriguez",
                service: "Pedicure & Waxing",
                rating: 5,
                text: "I've been coming here for over a year and wouldn't go anywhere else. The quality of service and products is unmatched in Fort Myers.",
              },
              {
                name: "Emily Chen",
                service: "Acrylic Extensions",
                rating: 5,
                text: "Finally found a nail spa that understands what I want! They're artists who truly care about making you feel pampered and beautiful.",
              }
            ].map((review, i) => (
              <div key={i} className="card-hover group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-400" />
                  <div>
                    <p className="font-bold text-gray-900">{review.name}</p>
                    <p className="text-sm text-gray-600">{review.service}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Hours Section - Enhanced */}
      <section id="hours" className="section-spacing bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-pink-600 font-semibold tracking-wide uppercase text-sm">Visit Us</span>
            <h2 className="heading-md mt-3">Hours of Operation</h2>
          </div>
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

      {/* Floating CTA Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Book Now Button */}
        <Link
          href="/book-appointment"
          className="bg-pink-600 text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-smooth flex items-center justify-center group"
          aria-label="Book Appointment"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="absolute right-16 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-smooth whitespace-nowrap">
            Book Now
          </span>
        </Link>

        {/* Call Button */}
        <a
          href="tel:+12394546289"
          className="bg-purple-600 text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-smooth flex items-center justify-center group"
          aria-label="Call Us"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="absolute right-16 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition-smooth whitespace-nowrap">
            Call Now
          </span>
        </a>
      </div>
    </div>
  );
}
