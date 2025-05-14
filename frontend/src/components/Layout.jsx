import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserMd, FaFileAlt, FaUsers, FaTachometerAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

const DualNavbar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hospitalInfo, setHospitalInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Get hospital info from localStorage
    const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');
    setHospitalInfo(user);
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    
    // Redirect to login page
    navigate('/admin');
  };

  // Get hospital name for URLs
  const getHospitalNameForUrl = () => {
    if (hospitalInfo.hospitalName) {
      return hospitalInfo.hospitalName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }
    return 'hospital';
  };

  // Check if hospital is pending approval
  const isPending = hospitalInfo.status === 'pending';

  return (
    <div className="w-full">
      {/* Top Navigation Bar */}
      <div className="bg-green-600 text-white flex justify-between items-center px-6 py-3 shadow-md">
        <h1 className="text-xl font-bold tracking-wide">
          {hospitalInfo.hospitalName || "Healthcare HIMS"}
          {isPending && <span className="ml-2 text-sm bg-yellow-400 text-blue-900 px-2 py-0.5 rounded-full">Pending Approval</span>}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center border-2 border-white shadow">
              <span className="text-lg font-bold">{hospitalInfo.hospitalName ? hospitalInfo.hospitalName[0] : "H"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{hospitalInfo.hospitalName || "Hospital"}</span>
              <span className="text-xs opacity-80">{hospitalInfo.email || ""}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-white text-2xl hover:text-red-200 transition-colors flex items-center gap-1"
            title="Logout"
          >
            <MdLogout />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Second Navigation Bar - Show only if hospital is approved */}
      {!isPending && (
        <div className="bg-green-500 text-white flex gap-2 py-2 px-4 shadow">
          {[
            { name: "Dashboard", icon: <FaTachometerAlt />, path: hospitalInfo.hospitalName ? `/hospitaldashboard/${getHospitalNameForUrl()}` : "/hospitaldashboard" },
            { name: "Patients", icon: <FaUsers />, path: `/${getHospitalNameForUrl()}/h-patientdetails` },
            { name: "Reports", icon: <FaFileAlt />, path: "/reports" },
          ].map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={`${
                activeTab === tab.name.toLowerCase()
                  ? "bg-blue-900 text-white font-semibold shadow-lg"
                  : "hover:bg-blue-600 text-white"
              } px-4 py-1 rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-300`}
              onClick={() => setActiveTab(tab.name.toLowerCase())}
            >
              {tab.icon} {tab.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DualNavbar;