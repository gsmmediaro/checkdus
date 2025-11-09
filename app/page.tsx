import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Luxury Nails & Spa
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Premium nail care services with exceptional attention to detail
        </p>
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

      {/* Business Hours Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Business Hours</h2>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-700 font-semibold">Monday - Friday:</div>
              <div className="text-gray-600">9:00 AM - 7:00 PM</div>

              <div className="text-gray-700 font-semibold">Saturday:</div>
              <div className="text-gray-600">9:00 AM - 6:00 PM</div>

              <div className="text-gray-700 font-semibold">Sunday:</div>
              <div className="text-gray-600">10:00 AM - 5:00 PM</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Services</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Manicures</h3>
            <p className="text-gray-600 text-sm">From basic to gel, we've got you covered</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Pedicures</h3>
            <p className="text-gray-600 text-sm">Relaxing spa treatments for your feet</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Nail Extensions</h3>
            <p className="text-gray-600 text-sm">Acrylic and gel extensions</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Nail Art</h3>
            <p className="text-gray-600 text-sm">Creative designs by expert artists</p>
          </div>
        </div>
      </section>
    </div>
  );
}
