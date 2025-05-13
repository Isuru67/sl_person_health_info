import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { User, Bell, X } from 'lucide-react';

const HospitalRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hospitalName: '',
    email: '',
    mobile1: '',
    mobile2: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    hospitalName: '',
    email: '',
    mobile1: '',
    mobile2: '',
    password: '',
    confirmPassword: '',
    image: ''
  });

  const [touched, setTouched] = useState({
    hospitalName: false,
    email: false,
    mobile1: false,
    mobile2: false,
    password: false,
    confirmPassword: false,
    image: false
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState('Register');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const navItems = ['Home', 'Features', 'About Us', 'Contact'];

  // Validation Functions
  const validateHospitalName = (name) => {
    if (!name.trim()) return 'Hospital name is required';
    const nameRegex = /^[A-Za-z0-9\s&.-]{3,100}$/;
    if (!nameRegex.test(name.trim())) {
      return 'Hospital name must be 3-100 characters and can include letters, numbers, spaces, &, ., -';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Invalid email address';
    }
    return '';
  };

  const validateMobileNumber = (mobile, isRequired = true) => {
    if (!mobile.trim()) return isRequired ? 'Mobile number is required' : '';
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.trim())) {
      return 'Mobile number must be 10 digits';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters, include uppercase, lowercase, and number';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const validateImage = (img) => {
    if (!img) return 'Government registration certificate is required';
    return '';
  };

  // Real-time validation effect
  useEffect(() => {
    const newErrors = {
      hospitalName: touched.hospitalName ? validateHospitalName(formData.hospitalName) : '',
      email: touched.email ? validateEmail(formData.email) : '',
      mobile1: touched.mobile1 ? validateMobileNumber(formData.mobile1) : '',
      mobile2: touched.mobile2 ? validateMobileNumber(formData.mobile2, false) : '',
      password: touched.password ? validatePassword(formData.password) : '',
      confirmPassword: touched.confirmPassword ? 
        validateConfirmPassword(formData.confirmPassword, formData.password) : '',
      image: touched.image ? validateImage(image) : ''
    };
    setErrors(newErrors);
  }, [formData, image, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For mobile fields, only allow numeric input
    if (name === 'mobile1' || name === 'mobile2') {
      // Remove all non-numeric characters
      const numericValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      const limitedValue = numericValue.slice(0, 10);
      
      setFormData(prev => ({
        ...prev,
        [name]: limitedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Mark the field as touched when it changes
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setTouched(prev => ({
        ...prev,
        image: true
      }));
    }
  };

  const validateForm = () => {
    // Mark all fields as touched to show all errors
    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Check if any errors exist
    const hasErrors = Object.values(errors).some(error => error !== '');
    return !hasErrors;
  };

  const handleSaveHospital = () => {
    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (image) {
      formDataToSend.append('image', image);
    }
    
    setLoading(true);
    axios
      .post('http://localhost:5555/hospitaldashboard/hospital/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(() => {
        setLoading(false);
        setShowSuccessPopup(true);
        // Clear form after successful registration
        setFormData({
          hospitalName: '',
          email: '',
          mobile1: '',
          mobile2: '',
          password: '',
          confirmPassword: ''
        });
        setImage(null);
      })
      .catch((error) => {
        setLoading(false);
        alert('An error occurred. Please check the console');
        console.log(error);
      });
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    navigate('/admin'); // Redirect to login page after closing popup
  };

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${showSuccessPopup ? 'overflow-hidden' : ''}`}>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-blue-50 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-blue-100"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-blue-600">Registration Successful</h3>
              <button 
                onClick={handleClosePopup}
                className="text-blue-500 hover:text-blue-700"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-blue-700 mb-6">Successfully Registered, Please Sign In</p>
            <div className="flex justify-end">
              <button
                onClick={handleClosePopup}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                OK
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content with conditional blur */}
      <div className={`${showSuccessPopup ? 'blur-sm' : ''}`}>
        {/* Navigation Bar */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
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
              
              <nav className="hidden md:flex space-x-2 items-center">
                {navItems.map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveNav(item)}
                    className={`px-4 py-2 rounded-full cursor-pointer ${activeNav === item ?
                      'bg-white text-purple-600 font-bold' :
                      'text-white hover:bg-white/20'}`}
                  >
                    {item}
                  </motion.div>
                ))}
                
                <div className="flex items-center space-x-4 ml-4">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white cursor-pointer"
                  >
                    <Bell size={20} />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-white cursor-pointer"
                  >
                    <User size={20} />
                  </motion.div>
                </div>
              </nav>
              
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden text-xl text-white"
              >
                ☰
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Registration Form */}
        <div className="flex-1 pt-20 pb-8 px-4">
          <div className="absolute left-4 top-24 z-10">
            <BackButton />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                <h1 className="text-3xl font-bold text-white">Hospital Registration</h1>
                <p className="text-blue-100 mt-1">
                  Register your hospital to join our healthcare network
                </p>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hospital Name *
                        </label>
                        <input
                          type="text"
                          name="hospitalName"
                          value={formData.hospitalName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-2.5 border ${
                            errors.hospitalName ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          required
                        />
                        {errors.hospitalName && touched.hospitalName && (
                          <p className="text-red-500 text-sm mt-1">{errors.hospitalName}</p>
                        )}
                      </div>

                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-2.5 border ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          required
                        />
                        {errors.email && touched.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="mobile1"
                          value={formData.mobile1}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className={`w-full px-4 py-2.5 border ${
                            errors.mobile1 ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          required
                        />
                        {errors.mobile1 && touched.mobile1 && (
                          <p className="text-red-500 text-sm mt-1">{errors.mobile1}</p>
                        )}
                      </div>

                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondary Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="mobile2"
                          value={formData.mobile2}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className={`w-full px-4 py-2.5 border ${
                            errors.mobile2 ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.mobile2 && touched.mobile2 && (
                          <p className="text-red-500 text-sm mt-1">{errors.mobile2}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-2.5 border ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          required
                        />
                        {errors.password && touched.password && (
                          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                      </div>

                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-2.5 border ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          required
                        />
                        {errors.confirmPassword && touched.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Government Registration Certificate *
                        </label>
                        <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                          errors.image && touched.image ? 'border-red-500' : 'border-gray-300'
                        }`}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer flex flex-col items-center justify-center"
                          >
                            <svg
                              className="w-12 h-12 text-gray-400 mb-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <span className="text-sm text-gray-600">
                              {image ? image.name : 'Click to upload certificate'}
                            </span>
                          </label>
                        </div>
                        {errors.image && touched.image && (
                          <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                        )}
                        {image && (
                          <p className="mt-2 text-sm text-gray-500">
                            Selected: {image.name}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={handleSaveHospital}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                      >
                        Register Hospital
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegister;