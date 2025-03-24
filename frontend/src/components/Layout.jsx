import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserMd, FaFileAlt, FaUsers, FaTachometerAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

const DualNavbar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="w-full">
      {/* Top Navigation Bar */}
      <div className="bg-blue-800 text-white flex justify-between items-center px-4 py-2 shadow-md">
        <h1 className="text-xl font-bold tracking-wide">City Hospital</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src="https://placeholder.com/40"
              alt="Admin Profile"
              className="w-10 h-10 rounded-full border-2 border-white shadow"
            />
            <span className="text-sm font-medium">Admin</span>
          </div>
          <button className="text-white text-2xl hover:text-gray-300 transition-colors">
            <MdLogout />
          </button>
        </div>
      </div>

      {/* Second Navigation Bar - Enhanced Styling */}
      <div className="bg-blue-700 text-white flex gap-2 py-2 px-4 shadow">
        {[
          { name: "Dashboard", icon: <FaTachometerAlt />, path: "/hospitaldashboard" },
          { name: "Patients", icon: <FaUsers />, path: "/h-patientdetails" },
          { name: "Doctors", icon: <FaUserMd />, path: "/doctors" },
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

      
    </div>
  );
};

export default DualNavbar;