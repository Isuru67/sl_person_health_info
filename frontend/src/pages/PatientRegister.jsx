import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Bell } from 'lucide-react';

const PatientRegister = () => {
  const navigate = useNavigate();

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const [formData, setFormData] = useState({
    name: '',
    nic: '',
    dob: '',
    blood: '',
    tele: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [pic, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeNav, setActiveNav] = useState('Register');

  const navItems = ['Home', 'Features', 'Pricing', 'About Us', 'Contact'];

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  const validateNIC = (nic) => {
    // Assuming Sri Lankan NIC format: 12 characters (old) or 10+2 characters (new)
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    return nicRegex.test(nic.trim());
  };

  const validateTelephone = (tele) => {
    const teleRegex = /^[0-9]{10}$/;
    return teleRegex.test(tele.trim());
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateDOB = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    return age > 0 && (age > 18 || (age === 18 && monthDiff >= 0));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};

    if (!validateName(formData.name)) {
      newErrors.name = 'Name must be 2-50 characters and contain only letters';
    }

    if (!validateNIC(formData.nic)) {
      newErrors.nic = 'Invalid NIC number';
    }

    if (!validateDOB(formData.dob)) {
      newErrors.dob = 'You must be at least 18 years old';
    }

    if (!formData.blood) {
      newErrors.blood = 'Blood group is required';
    }

    if (!validateTelephone(formData.tele)) {
      newErrors.tele = 'Invalid telephone number (10 digits)';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePatient = async () => {
    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') {
        formDataToSend.append(key, formData[key]);
      }
    });

    if (pic) {
      formDataToSend.append('pic', pic);
    }

    setLoading(true);
    try {
      const response =await axios.post('http://localhost:5555/patient/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Store the token in localStorage
    localStorage.setItem('patientToken', response.data.token);
    
    setLoading(false);
    // Navigate to profile page with the new patient's ID
    navigate(`/patient/view/${response.data.patient._id}`)
    } catch (error) {
      setLoading(false);
      alert('An error occurred. Please check the console.');
      console.error(error);
    }
  };

  // Rest of the component remains the same as the previous implementation
  // (Navigation bar and other UI components)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar (same as previous implementation) */}
      <motion.header>
        {/* ... */}
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 pt-20 pb-8 px-4">
        <div className="absolute left-4 top-24 z-10">
          <BackButton />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
              <h1 className="text-3xl font-bold text-white">Patient Registration</h1>
              <p className="text-blue-100 mt-1">
                Register to access our healthcare services
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
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIC Number *
                      </label>
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${
                          errors.nic ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.nic && (
                        <p className="text-red-500 text-sm mt-1">{errors.nic}</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${
                          errors.dob ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.dob && (
                        <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Group *
                      </label>
                      <select
                        name="blood"
                        value={formData.blood}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${
                          errors.blood ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      >
                        <option value="">Select Blood Group</option>
                        {bloodTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.blood && (
                        <p className="text-red-500 text-sm mt-1">{errors.blood}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telephone Number *
                      </label>
                      <input
                        type="tel"
                        name="tele"
                        value={formData.tele}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${
                          errors.tele ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.tele && (
                        <p className="text-red-500 text-sm mt-1">{errors.tele}</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username *
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${
                          errors.username ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.password && (
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
                        className={`w-full px-4 py-2.5 border ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        required
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="mb-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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
                            {pic ? pic.name : 'Click to upload profile picture'}
                          </span>
                        </label>
                      </div>
                      {pic && (
                        <p className="mt-2 text-sm text-gray-500">
                          Selected: {pic.name}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleSavePatient}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                    >
                      Register Patient
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;