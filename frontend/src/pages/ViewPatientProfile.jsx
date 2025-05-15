import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { motion } from 'framer-motion';
import { MdLogout, MdPrint, MdAnalytics } from "react-icons/md"; // Add MdAnalytics icon

const ImageModal = ({ image, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full mx-auto">
        <button
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
          onClick={onClose}
        >
          ×
        </button>
        <img
          src={image}
          alt="Full size"
          className="max-w-full max-h-[90vh] object-contain mx-auto rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

const ImagePreview = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return <span>No images</span>;

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((image, index) => (
        <div key={index} className="relative group cursor-pointer">
          <div 
            className="w-24 h-24 relative overflow-hidden rounded-lg border border-gray-200"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`${title} ${index + 1}`}
              className="w-full h-full object-cover transition-transform hover:scale-110"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium px-2 py-1 bg-black bg-opacity-50 rounded">
                View
              </span>
            </div>
          </div>
        </div>
      ))}
      {selectedImage && (
        <ImageModal 
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

const ViewPatientProfile = () => {
  const [patient, setPatient] = useState({});
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [treatmentsLoading, setTreatmentsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/patient/${id}`)
      .then((response) => {
        setPatient(response.data);
        setLoading(false);
        
        // Once we have the patient data, fetch their treatments using their NIC
        if (response.data.nic) {
          fetchPatientTreatments(response.data.nic);
        }
      })
      .catch((error) => {
        console.error('Error fetching patient:', error);
        setLoading(false);
      });
  }, [id]);
  
  // Fetch all treatments for this patient (from all hospitals)
  const fetchPatientTreatments = (nic) => {
    setTreatmentsLoading(true);
    axios
      .get(`http://localhost:5555/api/treatment/${nic}`)
      .then((response) => {
        setTreatments(response.data);
        setTreatmentsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching treatments:', error);
        setTreatmentsLoading(false);
      });
  };

  // Function to group treatments by hospital
  const getTreatmentsByHospital = () => {
    const groupedTreatments = {};
    
    treatments.forEach(treatment => {
      const hospitalName = treatment.hospitalName || 'Unknown Hospital';
      
      if (!groupedTreatments[hospitalName]) {
        groupedTreatments[hospitalName] = [];
      }
      
      groupedTreatments[hospitalName].push(treatment);
    });
    
    return groupedTreatments;
  };

  // Function to filter hospitals based on search term and date filter
  const getFilteredTreatmentsByHospital = () => {
    const groupedTreatments = {};
    
    treatments.forEach(treatment => {
      const hospitalName = treatment.hospitalName || 'Unknown Hospital';
      const treatmentDate = treatment.ho_admissionDetails?.admissionDate 
        ? new Date(treatment.ho_admissionDetails.admissionDate).toISOString().split('T')[0]
        : '';
      
      // Check both hospital name and date filters
      const matchesHospital = hospitalName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !dateFilter || treatmentDate === dateFilter;
      
      if (matchesHospital && matchesDate) {
        if (!groupedTreatments[hospitalName]) {
          groupedTreatments[hospitalName] = [];
        }
        groupedTreatments[hospitalName].push(treatment);
      }
    });
    
    return groupedTreatments;
  };

  const handleEditPatient = () => {
    navigate(`/patient/Edit/${id}`);
  };
  const handleDeletePatient = () => {
    if (window.confirm('Are you sure you want to delete this patient profile?')) {
      axios
        .delete(`http://localhost:5555/patient/${id}`)
        .then(() => {
          alert('Patient profile deleted successfully');
          navigate('/');
        })
        .catch((error) => {
          console.error('Error deleting patient:', error);
          alert('Error deleting patient profile');
        });
    }
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

  const handleGenerateReport = () => {
    const printContent = document.getElementById('reportContent');
    const originalContent = document.body.innerHTML;

    // Create print-specific styling
    const printStyles = `
      <style>
        @media print {
          body { background: white; }
          .no-print { display: none; }
          .print-only { display: block; }
          .page-break { page-break-before: always; }
          
          @page {
            margin: 2cm;
            size: A4;
          }
          
          .report-header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .report-section {
            margin-bottom: 20px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          
          th {
            background-color: #f0f0f0;
          }
        }
      </style>
    `;

    // Set print content
    document.body.innerHTML = printStyles + printContent.innerHTML;

    // Print
    window.print();

    // Restore original content
    document.body.innerHTML = originalContent;
    
    // Reattach event handlers
    window.location.reload();
  };

  // Add handleAnalyze function
  const handleAnalyze = () => {
    navigate('/innov', { 
      state: { 
        patientData: {
          age: patient.dob ? calculateAge(patient.dob) : '',
          symptoms: '', // You can pass symptoms if available
          sex: patient.gender || 'male' // Default to male if not available
        }
      }
    });
  };

  // Add calculateAge helper function
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
  const navItems = ['Home', 'Features', 'About Us', 'Contact'];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      {/* Fixed Navigation Bar (exact copy from home page) */}
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
                {patient.name || 'Patient Profile'}
              </motion.div>
              
              {patient.pic && (
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  src={`http://localhost:5555/uploads/${patient.pic}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                />
              )}
              
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
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <div className="pt-24 pb-12 px-4 container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl font-bold text-gray-800 pl-12"
          >
            Patient Profile Details
          </motion.h1>
          
          <div className="flex space-x-4">
            <motion.button
              variants={buttonSpring}
              whileHover="hover"
              whileTap="tap"
              onClick={handleAnalyze}
              className="flex items-center px-6 py-2 rounded-lg bg-purple-600 text-white font-medium shadow-md"
            >
              <MdAnalytics className="mr-2" />
              Analyze Health
            </motion.button>

            <motion.button
              variants={buttonSpring}
              whileHover="hover"
              whileTap="tap"
              onClick={handleGenerateReport}
              className="flex items-center px-6 py-2 rounded-lg bg-green-600 text-white font-medium shadow-md"
            >
              <MdPrint className="mr-2" />
              Generate Report
            </motion.button>
          </div>
        </div>

        {/* Add print-specific content wrapper */}
        <div id="reportContent">
          <div className="print-only report-header" style={{ display: 'none' }}>
            <h1 className="text-2xl font-bold">HealthCare HIMS - Patient Report</h1>
            <p>Generated on: {new Date().toLocaleString()}</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 no-print">
              <Spinner />
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden report-section"
            >
              <div className="md:flex">
                {/* Left Column - Profile Picture */}
                <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col items-center">
                  <div className="relative mb-6">
                    {patient.pic ? (
                      <motion.img
                        whileHover={{ scale: 1.03 }}
                        src={`http://localhost:5555/uploads/${patient.pic}`}
                        alt="Profile"
                        className="w-48 h-48 rounded-full border-4 border-white shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-48 h-48 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center text-gray-400">
                        <span>No Image</span>
                      </div>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="absolute -bottom-3 -right-3 bg-blue-500 text-white rounded-full p-2 shadow-md cursor-pointer"
                      onClick={handleEditPatient}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </motion.div>
                  </div>
                  <motion.h2 
                    className="text-2xl font-bold text-gray-800 mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {patient.name}
                  </motion.h2>
                  <motion.p 
                    className="text-blue-600 font-medium mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Patient ID: {id}
                  </motion.p>

                  <div className="flex space-x-4 mt-6">
                    <motion.button
                      variants={buttonSpring}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleEditPatient}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md"
                    >
                      Edit Profile
                    </motion.button>
                    <motion.button
                      variants={buttonSpring}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={handleDeletePatient}
                      className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium shadow-md"
                    >
                      Delete Profile
                    </motion.button>
                  </div>
                </div>
                {/* Right Column - Patient Details */}

                <div className="md:w-2/3 p-8">
                  <motion.h3 
                    className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Personal Information
                  </motion.h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">NIC Number</h4>
                      <p className="text-lg font-medium text-gray-800">{patient.nic || 'Not provided'}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Date of Birth</h4>
                      <p className="text-lg font-medium text-gray-800">
                        {patient.dob ? new Date(patient.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Not provided'}
                      </p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Blood Group</h4>
                      <p className="text-lg font-medium text-gray-800">
                        {patient.blood ? (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full">{patient.blood}</span>
                        ) : 'Not provided'}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact Number</h4>
                      <p className="text-lg font-medium text-gray-800">{patient.tele || 'Not provided'}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="bg-gray-50 p-4 rounded-lg md:col-span-2"
                    >
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</h4>
                      <p className="text-lg font-medium text-gray-800 break-all">
                        {patient.email ? (
                          <a href={`mailto:${patient.email}`} className="text-blue-600 hover:underline">
                            {patient.email}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Medical Summary Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 px-8 pb-8"
              >
                <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800">Medical Summary</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="Search hospitals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div className="relative w-48">
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {dateFilter && (
                        <button
                          onClick={() => setDateFilter('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {treatmentsLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                ) : treatments.length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(getFilteredTreatmentsByHospital()).map(([hospitalName, hospitalTreatments]) => (
                      <motion.div 
                        key={hospitalName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg overflow-hidden shadow-md"
                      >
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3">
                          <h4 className="text-lg font-semibold text-white">
                            {hospitalName}
                          </h4>
                        </div>
                        
                        <div className="p-4">
                          {hospitalTreatments.map((treatment, index) => (
                            <div key={treatment._id} className={`p-4 ${index > 0 ? 'border-t border-gray-200 mt-4' : ''}`}>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="font-medium text-gray-700">Admission Details</h5>
                                  <p className="text-sm mt-1">
                                    <span className="font-medium">Date:</span>{' '}
                                    {treatment.ho_admissionDetails?.admissionDate
                                      ? new Date(treatment.ho_admissionDetails.admissionDate).toLocaleDateString()
                                      : 'N/A'}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Physician:</span>{' '}
                                    {treatment.ho_admissionDetails?.admittingPhysician?.join(', ') || 'N/A'}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Diagnosis:</span>{' '}
                                    {treatment.ho_admissionDetails?.primaryDiagnosis?.join(', ') || 'N/A'}
                                  </p>
                                </div>
                                
                                <div>
                                  <h5 className="font-medium text-gray-700">Treatment Plan</h5>
                                  <p className="text-sm mt-1">
                                    <span className="font-medium">Medications:</span>{' '}
                                    {treatment.treatmentPlan?.medications?.join(', ') || 'None'}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Lab Tests:</span>{' '}
                                    {treatment.treatmentPlan?.labTests?.join(', ') || 'None'}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Therapies:</span>{' '}
                                    {treatment.treatmentPlan?.therapies?.join(', ') || 'None'}
                                  </p>
                                  
                                  {/* Add Lab Reports */}
                                  <div className="mt-2">
                                    <span className="font-medium">Lab Reports:</span>
                                    <div className="mt-1">
                                      <ImagePreview 
                                        images={treatment.treatmentPlan?.te_imaging} 
                                        title="Lab Report"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4">
                                <h5 className="font-medium text-gray-700">Medical History</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-1">
                                  <p className="text-sm">
                                    <span className="font-medium">Allergies:</span>{' '}
                                    {treatment.medicalHistory?.allergies?.join(', ') || 'None'}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Illnesses:</span>{' '}
                                    {treatment.medicalHistory?.illnesses?.join(', ') || 'None'}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Surgeries:</span>{' '}
                                    {treatment.medicalHistory?.surgeries?.join(', ') || 'None'}
                                  </p>
                                </div>
                                
                                {/* Add Surgeries Report Images */}
                                <div className="mt-2">
                                  <span className="font-medium">Surgeries Report Images:</span>
                                  <div className="mt-1">
                                    <ImagePreview 
                                      images={treatment.medicalHistory?.su_imaging} 
                                      title="Surgery Report"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* No results message */}
                    {Object.keys(getFilteredTreatmentsByHospital()).length === 0 && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-yellow-800">
                          No hospitals found matching "{searchTerm}". Try a different search term.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-gray-700">
                      No treatment records available yet. Please consult with your healthcare provider.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-8 no-print"
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
            <p>&copy; {new Date().toLocaleDateString()} HealthCare HIMS. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default ViewPatientProfile;

