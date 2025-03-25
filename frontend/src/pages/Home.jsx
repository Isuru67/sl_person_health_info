import React, { useState } from 'react';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold">HealthCare HIMS</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="hover:text-blue-200">Home</a>
              <a href="#" className="hover:text-blue-200">Features</a>
              <a href="#" className="hover:text-blue-200">Pricing</a>
              <a href="#" className="hover:text-blue-200">About Us</a>
              <a href="#" className="hover:text-blue-200">Contact</a>
            </nav>
            <div className="hidden md:flex space-x-4">
              <button className="px-4 py-2 rounded hover:bg-blue-700 transition">Sign In</button>
              <button className="px-4 py-2 bg-white text-blue-800 rounded hover:bg-blue-100 transition">Register</button>
            </div>
            <button className="md:hidden text-xl">☰</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section with Main Image */}
        <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">Modern Healthcare Information Management</h1>
                <p className="text-lg md:text-xl mb-6">Streamline your healthcare facility with our comprehensive Health Information Management System. Secure, efficient, and user-friendly.</p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button className="px-6 py-3 bg-white text-blue-800 rounded-lg font-semibold hover:bg-blue-100 transition">Request Demo</button>
                  <button className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-blue-700 transition">Learn More</button>
                </div>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="../src/components/images/hospital.jpeg" 
                  alt="Healthcare Management Dashboard" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Healthcare Providers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl text-blue-600 mb-4">🏥</div>
                <h3 className="text-xl font-semibold mb-3">Patient Management</h3>
                <p className="text-gray-600">Comprehensive patient records, medical history tracking, and appointment scheduling all in one place.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl text-blue-600 mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-3">Analytics & Reporting</h3>
                <p className="text-gray-600">Generate insights with advanced analytics and customizable reports for better decision making.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-4xl text-blue-600 mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-3">Secure & Compliant</h3>
                <p className="text-gray-600">HIPAA-compliant security measures to keep patient information safe and confidential.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Login/Register Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="******************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <a className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800" href="#">
                    Forgot Password?
                  </a>
                </div>
                <div className="flex flex-col space-y-3">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Sign In
                  </button>
                  <button
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Trusted by Healthcare Professionals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <span className="text-xl">👩‍⚕️</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Dr. Sarah Johnson</h3>
                    <p className="text-gray-600 text-sm">Primary Care Physician</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"This system has revolutionized how we manage patient information. The intuitive interface saves us hours every week."</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <span className="text-xl">👨‍⚕️</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Dr. Michael Chen</h3>
                    <p className="text-gray-600 text-sm">Hospital Administrator</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"The analytics tools have given us insights we never had before. We've been able to improve patient care significantly."</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <span className="text-xl">👩‍⚕️</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Nurse Rebecca Taylor</h3>
                    <p className="text-gray-600 text-sm">Head Nurse</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"The scheduling and record-keeping features have made our daily operations so much smoother. Highly recommended!"</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">HealthCare HIMS</h3>
              <p className="text-gray-400 mb-4">Providing advanced healthcare information management solutions since 2010.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span>📱</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span>💻</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span>📧</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span>📞</span>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and features.</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 w-full rounded-l text-gray-800 focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 HealthCare HIMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;