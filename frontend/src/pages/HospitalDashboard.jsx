import React  from "react";
// eslint-disable-next-line no-unused-vars
import axios from "axios";
//import { useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";

const HospitalDashboard = () => {
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
    {/* Top Navigation Bar */}
    <DualNavbar />
      <div className="container">
          <h2>Hospital Dashboard</h2>
          
      </div>
      </div>
  );
};

export default HospitalDashboard;