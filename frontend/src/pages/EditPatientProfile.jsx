import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { motion } from 'framer-motion';
import { MdLogout } from "react-icons/md"; // Import logout icon

const EditPatientProfile = () => {
  const [patient, setPatient] = useState({
    name: '',
    nic: '',
    dob: '',
    blood: '',
    tele: '',
    email: '',
    username: '',
    pic: ''
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/patient/${id}`)
      .then((response) => {
        const patientData = response.data;
        // Format the date properly
        if (patientData.dob) {
          patientData.dob = new Date(patientData.dob).toISOString().split('T')[0]; // Extract YYYY-MM-DD
        }
        setPatient(patientData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check console');
        console.log(error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      
      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };

  const handleEditPatient = () => {
    setLoading(true);
    
    // Create FormData object to handle file uploads
    const formData = new FormData();
    formData.append('name', patient.name);
    formData.append('nic', patient.nic);
    formData.append('dob', patient.dob);
    formData.append('blood', patient.blood);
    formData.append('tele', patient.tele);
    formData.append('email', patient.email);
    formData.append('username', patient.username);
    
    // Only append the file if a new one was selected
    if (newImageFile) {
      formData.append('pic', newImageFile);
    }

    axios
      .put(`http://localhost:5555/patient/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(() => {
        setLoading(false);
        navigate(`/patient/view/${id}`);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check console');
        console.log(error);
      });
  };

  // Add logout function
  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    
    // Redirect to login page
    navigate('/admin');
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
                {patient.name || 'Edit Patient'}
              </motion.div>
              
              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center text-white hover:text-red-200 transition-colors"
                title="Logout"
              >
                <MdLogout className="text-xl mr-1" />
                <span className="hidden md:inline">Logout</span>
              </motion.button>
              
              {patient.pic && (
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  src={`http://localhost:5555/uploads/${patient.pic}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white cursor-pointer object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 container mx-auto">
        {/* BackButton */}
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
          Edit Patient Profile
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
            className="bg-white rounded-xl shadow-xl overflow-hidden p-8 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={patient.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
                  <input
                    type="text"
                    name="nic"
                    value={patient.nic}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={patient.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <select
                    name="blood"
                    value={patient.blood}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                  <input
                    type="tel"
                    name="tele"
                    value={patient.tele}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={patient.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={patient.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <div className="flex flex-col space-y-4">
                    {/* Current profile image */}
                    {patient.pic && !previewImage && (
                      <div className="flex items-center space-x-4">
                        <img 
                          src={`http://localhost:5555/uploads/${patient.pic}`} 
                          alt="Current profile" 
                          className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                        />
                        <span className="text-sm text-gray-600">Current: {patient.pic}</span>
                      </div>
                    )}
                    
                    {/* New image preview */}
                    {previewImage && (
                      <div className="flex items-center space-x-4">
                        <img 
                          src={previewImage} 
                          alt="New profile preview" 
                          className="w-20 h-20 rounded-lg object-cover border border-gray-300"
                        />
                        <span className="text-sm text-gray-600">New image selected</span>
                      </div>
                    )}
                    
                    {/* File input */}
                    <div className="flex items-center mt-2">
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 transition">
                        Choose New File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <motion.button
                variants={buttonSpring}
                whileHover="hover"
                whileTap="tap"
                onClick={() => navigate(`/patient/view/${id}`)}
                className="px-6 py-2 rounded-lg bg-gray-300 text-gray-800 font-medium shadow-md"
              >
                Cancel
              </motion.button>
              <motion.button
                variants={buttonSpring}
                whileHover="hover"
                whileTap="tap"
                onClick={handleEditPatient}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md"
              >
                Save Changes
              </motion.button>
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
              <p className="text-blue-200">Comprehensive Patient Management</p>
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

export default EditPatientProfile;

