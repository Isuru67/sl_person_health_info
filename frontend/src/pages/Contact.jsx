import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [activeNav, setActiveNav] = useState('Contact');
  const navigate = useNavigate();
  const navItems = ['Home', 'Features', 'About Us', 'Contact'];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/')}
            >
              <motion.span className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400">
                HealthCare HIMS
              </motion.span>
            </motion.div>
            
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveNav(item);
                    if (item === 'Home') navigate('/');
                  }}
                  className={`px-4 py-2 rounded-full cursor-pointer ${
                    activeNav === item ? 'bg-white text-purple-600 font-bold' : 'text-white hover:bg-white/20'
                  }`}
                >
                  {item}
                </motion.div>
              ))}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h1>
            <p className="text-gray-600">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Building className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-600">Headquarters</p>
                    <p className="text-gray-800 font-medium">HealthCare HIMS</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <MapPin className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="text-gray-800 font-medium">123 Healthcare Street, Colombo 07, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Phone className="text-purple-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="text-gray-800 font-medium">+94 11 234 5678</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Mail className="text-red-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="text-gray-800 font-medium">support@healthcarehims.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Operating Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <Mail className="w-5 h-5 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-700 mb-2">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Message
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
