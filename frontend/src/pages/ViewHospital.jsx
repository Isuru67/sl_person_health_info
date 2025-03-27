import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { motion } from 'framer-motion';

const ViewHospital = () => {
  const [hospital, setHospital] = useState({});
  const [loading, setLoading] = useState(false);
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/hospitaldashboard/${hospitalId}`)
      .then((response) => {
        setHospital(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching hospital:', error);
        setLoading(false);
      });
  }, [hospitalId]);

  const handleEditHospital = () => {
    navigate(`/hospital-edit/${hospitalId}`);
  };

  const handleDeleteHospital = () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this hospital profile? This action cannot be undone.'
    );

    if (isConfirmed) {
      axios
        .delete(`http://localhost:5555/hospitaldashboard/${hospitalId}`)
        .then(() => {
          alert('Hospital profile deleted successfully');
          navigate('/admin-dashboard');
        })
        .catch((error) => {
          console.error('Error deleting hospital:', error);
        });
    }
  };

  // Animation variants
  const navItem = {
    hidden: { y: -20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: {
      scale: 1.1,
      textShadow: "0 0 8px rgba(255,255,255,0.8)",
      transition: { type: "spring", stiffness: 300 }
    },
    tap: { scale: 0.95 }
  };

  const buttonSpring = {
    hover: { 
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
    },
    tap: { 
      scale: 0.95,
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
    }
  };

  const navItems = ['Home', 'Features', 'Pricing', 'About Us', 'Contact'];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Fixed Navigation Bar */}
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
              className="flex items-center"
            >
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400"
              >
                HealthCare HIMS
              </motion.span>
            </motion.div>
            
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item, i) => (
                <motion.div
                  key={item}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  variants={navItem}
                  onClick={() => setActiveNav(item)}
                  className={`px-4 py-2 rounded-full cursor-pointer ${activeNav === item ? 
                    'bg-white text-purple-600 font-bold' : 
                    'text-white hover:bg-white/20'}`}
                >
                  {item}
                </motion.div>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-white font-medium hidden md:block"
              >
                {hospital.hospitalName || 'Hospital Profile'}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="pt-24 pb-12 px-4 container mx-auto">
        {/* BackButton positioned perfectly in left corner */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-6 top-20 z-40"
        >
          <BackButton className="text-gray-700 hover:text-indigo-600" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-4xl font-bold text-gray-800 mb-8 pl-12"
        >
          Hospital Profile Details
        </motion.h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <div className="md:flex">
              {/* Left Column - Certificate Image */}
              <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col items-center">
                <div className="relative mb-6">
                  {hospital.certificateImage ? (
                    <motion.img
                      whileHover={{ scale: 1.03 }}
                      src={`http://localhost:5555/uploads/${hospital.certificateImage}`}
                      alt="Hospital Certificate"
                      className="w-48 h-48 rounded-lg border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-48 h-48 rounded-lg bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center text-gray-400">
                      <span>No Certificate Available</span>
                    </div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute -bottom-3 -right-3 bg-blue-500 text-white rounded-full p-2 shadow-md cursor-pointer"
                    onClick={handleEditHospital}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </motion.div>
                </div>

                <motion.h2 
                  className="text-2xl font-bold text-gray-800 mb-1 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {hospital.hospitalName}
                </motion.h2>
                <motion.p 
                  className="text-blue-600 font-medium mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Hospital ID: {hospitalId}
                </motion.p>

                <div className="flex space-x-4 mt-6">
                  <motion.button
                    variants={buttonSpring}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleEditHospital}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md"
                  >
                    Edit Profile
                  </motion.button>
                  <motion.button
                    variants={buttonSpring}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleDeleteHospital}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium shadow-md"
                  >
                    Delete Profile
                  </motion.button>
                </div>
              </div>

              {/* Right Column - Hospital Details */}
              <div className="md:w-2/3 p-8">
                <motion.h3 
                  className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Hospital Information
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</h4>
                    <p className="text-lg font-medium text-gray-800">
                      {hospital.email ? (
                        <a href={`mailto:${hospital.email}`} className="text-blue-600 hover:underline">
                          {hospital.email}
                        </a>
                      ) : 'Not provided'}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Primary Contact</h4>
                    <p className="text-lg font-medium text-gray-800">
                      {hospital.mobile1 || 'Not provided'}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Secondary Contact</h4>
                    <p className="text-lg font-medium text-gray-800">
                      {hospital.mobile2 || 'Not provided'}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</h4>
                    <p className="text-lg font-medium text-gray-800">
                      {hospital.status ? (
                        <span className={`px-3 py-1 rounded-full ${
                          hospital.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {hospital.status}
                        </span>
                      ) : 'Not provided'}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-8"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="mb-4 md:mb-0"
            >
              <h3 className="text-xl font-bold">HealthCare HIMS</h3>
              <p className="text-blue-200">Comprehensive Hospital Management</p>
            </motion.div>
            <div className="flex space-x-6">
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="text-blue-200 hover:text-white"
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="text-blue-200 hover:text-white"
              >
                Terms of Service
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="text-blue-200 hover:text-white"
              >
                Contact Support
              </motion.a>
            </div>
          </div>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="border-t border-blue-600 mt-6 pt-6 text-center text-blue-200"
          >
            <p>&copy; {new Date().getFullYear()} HealthCare HIMS. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default ViewHospital;