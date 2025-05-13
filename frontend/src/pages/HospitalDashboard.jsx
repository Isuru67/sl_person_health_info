import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";

const HospitalDashboard = () => {
  const { hospitalName } = useParams(); // Get hospital name from URL
  const [hospitalInfo, setHospitalInfo] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get current hospital info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo'));
    
    if (user) {
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
    }
  }, [hospitalName, navigate]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <DualNavbar />
      
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {hospitalInfo.hospitalName || hospitalName?.replace(/-/g, ' ') || "Hospital"} Dashboard
        </h2>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-lg text-gray-700">
            Welcome to your hospital dashboard. From here, you can manage patient treatments and medical records.
          </p>
          
          {hospitalInfo.hospitalId && (
            <div className="mt-4 text-sm text-gray-600">
              Hospital ID: {hospitalInfo.hospitalId}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;