import React, { useState, useEffect } from "react";
//import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";
// Add missing icon imports
import { FaUsers, FaFileAlt, FaUserMd } from "react-icons/fa";

const HospitalDashboard = () => {
  const { hospitalName } = useParams(); // Get hospital name from URL
  const [hospitalInfo, setHospitalInfo] = useState({});
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeTreatments: 0,
    pendingReports: 0
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get current hospital info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');
    
    if (user && user.hospitalName) {
      setHospitalInfo(user);
      
      // If there's no hospitalName in URL but we have the info, redirect to the proper URL
      if (!hospitalName && user.hospitalName && window.location.pathname === '/hospitaldashboard') {
        // Create URL-friendly hospital name
        const urlFriendlyName = user.hospitalName
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')  // Remove special characters
          .replace(/\s+/g, '-');     // Replace spaces with dashes
          
        navigate(`/hospitaldashboard/${urlFriendlyName}`, { replace: true });
      }
      
      // Fetch some mock statistics (would be replaced with real API calls)
      // In a real app, you'd fetch this data from your backend
      setStats({
        totalPatients: Math.floor(Math.random() * 100),
        activeTreatments: Math.floor(Math.random() * 50),
        pendingReports: Math.floor(Math.random() * 20)
      });
    } else {
      // If no user info is found, redirect to login
      navigate('/admin');
    }
  }, [hospitalName, navigate]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <DualNavbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to {hospitalInfo.hospitalName || "Hospital"} Dashboard
          </h2>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-500">HOSPITAL ID</p>
                <p className="text-lg font-medium">{hospitalInfo.hospitalId || "N/A"}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-500">EMAIL</p>
                <p className="text-lg font-medium">{hospitalInfo.email || "N/A"}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-500">STATUS</p>
                <p className="text-lg font-medium">
                  <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                    hospitalInfo.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    hospitalInfo.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {hospitalInfo.status || "Pending"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-md text-white">
            <h3 className="text-lg font-medium mb-2">Total Patients</h3>
            <p className="text-3xl font-bold">{stats.totalPatients}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-md text-white">
            <h3 className="text-lg font-medium mb-2">Active Treatments</h3>
            <p className="text-3xl font-bold">{stats.activeTreatments}</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-md text-white">
            <h3 className="text-lg font-medium mb-2">Pending Reports</h3>
            <p className="text-3xl font-bold">{stats.pendingReports}</p>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => {
                // Navigate to the patient details page with hospital name in URL
                const urlFriendlyName = hospitalInfo.hospitalName
                  ? hospitalInfo.hospitalName
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-')
                  : 'hospital';
                navigate(`/${urlFriendlyName}/h-patientdetails`);
              }}
              className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition flex items-center gap-3"
            >
              <FaUsers className="text-blue-600" size={24} />
              <div className="text-left">
                <p className="font-semibold">Patient Records</p>
                <p className="text-sm text-gray-600">View and manage patients</p>
              </div>
            </button>
            
            <button 
              className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition flex items-center gap-3"
            >
              <FaFileAlt className="text-green-600" size={24} />
              <div className="text-left">
                <p className="font-semibold">Treatment Reports</p>
                <p className="text-sm text-gray-600">View recent treatments</p>
              </div>
            </button>
            
            <button 
              className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition flex items-center gap-3"
            >
              <FaUserMd className="text-purple-600" size={24} />
              <div className="text-left">
                <p className="font-semibold">Hospital Profile</p>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;