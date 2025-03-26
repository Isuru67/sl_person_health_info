/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Spinner from "../components/Spinner";

const H_PatientDetails = () => {
    const [patients, setPatients] = useState([]);
    const [searchNIC, setSearchNIC] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeNav, setActiveNav] = useState("Patients");

        // User data

        const [currentUser] = useState({

            name: "John Doe",
    
            role: "Asiri Hospital Admin",
    
            avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    
        });
    

    useEffect(() => {
        axios.get("http://localhost:5555/patient/")
            .then((res) => {
                console.log("API Response:", res.data);
                setPatients(res.data.data);  // ✅ Ensure correct extraction
            })
            .catch((error) => console.error("Error fetching patients:", error));
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5555/patient/search/${searchNIC}`);
            setSelectedPatient(res.data);
            setLoading(false);
        } catch (error) {
            alert("Patient not found");
            setSelectedPatient(null);
            setLoading(false);

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



    const cardSpring = {

        hover: { 

            y: -5,

            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"

        },

        tap: { 

            scale: 0.98,

            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"

        }

    };



    const navItems = ['Dashboard', 'Patients', 'Reports'];


    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">

        {/* Professional Navigation Bar */}

        <motion.header 

            initial={{ y: -100 }}

            animate={{ y: 0 }}

            transition={{ type: "spring", stiffness: 200 }}

            className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"

        >

            <div className="container mx-auto px-4 py-3">

                <div className="flex justify-between items-center">

                    {/* HealthCare HIMS on Left Side */}

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

                    

                    {/* Center Navigation */}

                    <nav className="hidden md:flex space-x-2 mx-auto">

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

                    

                    {/* User Profile in Right Corner */}

                    <div className="ml-auto">

                        <motion.div

                            whileHover={{ scale: 1.02 }}

                            className="flex items-center space-x-3 bg-white/20 rounded-full pl-4 pr-1 py-1 cursor-pointer"

                        >

                            <div className="text-white text-right">

                                <p className="font-medium text-sm">{currentUser.name}</p>

                                <p className="text-xs opacity-80">{currentUser.role}</p>

                            </div>

                            <motion.img

                                whileHover={{ rotate: [0, 10, -10, 0] }}

                                transition={{ duration: 0.5 }}

                                src={currentUser.avatar}

                                alt="User Avatar"

                                className="w-10 h-10 rounded-full border-2 border-white"

                            />

                        </motion.div>

                    </div>

                </div>

            </div>

        </motion.header>
      
                    {/* Main Content */}

                    <div className="pt-24 pb-12 px-4 container mx-auto">

<motion.h1 

    initial={{ opacity: 0, y: -20 }}

    animate={{ opacity: 1, y: 0 }}

    transition={{ duration: 0.4 }}

    className="text-3xl font-bold text-center text-gray-800 mb-8"

>

    Hospital Patient Details

</motion.h1>



                {/* Search Section */}

                <motion.div 

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    transition={{ delay: 0.2 }}

                    className="bg-white rounded-xl shadow-md p-6 mb-8"

                >

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">

                        <input

                            type="text"

                            className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"

                            placeholder="Enter Patient NIC"

                            value={searchNIC}

                            onChange={(e) => setSearchNIC(e.target.value)}

                        />

                        <motion.button

                            whileHover={{ scale: 1.05 }}

                            whileTap={{ scale: 0.95 }}

                            onClick={handleSearch}

                            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition"

                        >

                            Search Patient

                        </motion.button>

                    </div>

                </motion.div>



                {loading ? (

                    <div className="flex justify-center items-center h-64">

                        <Spinner />

                    </div>

                ) : (

                    <>

                        {/* Selected Patient Card */}

                        {selectedPatient && (

                            <motion.div 

                                initial={{ opacity: 0, y: 20 }}

                                animate={{ opacity: 1, y: 0 }}

                                transition={{ duration: 0.4 }}

                                className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 max-w-2xl mx-auto"

                            >

                                <div className="p-6">

                                    <div className="flex items-start">

                                        <div className="flex-1">

                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedPatient.name}</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                <div>

                                                    <p className="text-gray-600"><span className="font-semibold">NIC:</span> {selectedPatient.nic}</p>

                                                    <p className="text-gray-600"><span className="font-semibold">Blood Group:</span> 

                                                        <span className={`ml-2 px-2 py-1 rounded-full ${selectedPatient.blood ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>

                                                            {selectedPatient.blood || 'N/A'}

                                                        </span>

                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-gray-600"><span className="font-semibold">Date of Birth:</span> {selectedPatient.dob ? new Date(selectedPatient.dob).toLocaleDateString() : 'N/A'}</p>

                                                    <p className="text-gray-600"><span className="font-semibold">Phone:</span> {selectedPatient.tele || 'N/A'}</p>

                                                </div>

                                            </div>

                                            <p className="text-gray-600 mt-2"><span className="font-semibold">Email:</span> {selectedPatient.email || 'N/A'}</p>

                                        </div>

                                    </div>



                                    <div className="flex justify-end space-x-4 mt-6">

                                        <motion.button

                                            whileHover={{ scale: 1.05 }}

                                            whileTap={{ scale: 0.95 }}

                                            onClick={() => navigate(`/h-patientdetails/ho-admission/${selectedPatient.nic}`)}

                                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-md"

                                        >

                                            Add Treatment

                                        </motion.button>

                                        <motion.button

                                            whileHover={{ scale: 1.05 }}

                                            whileTap={{ scale: 0.95 }}

                                            onClick={() => navigate(`/h-patientdetails/view/${selectedPatient.nic}`)}

                                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md"

                                        >

                                            View Treatments

                                        </motion.button>

                                    </div>

                                </div>

                            </motion.div>

                        )}



                        {/* All Patients Section */}

                        <motion.div 

                            initial={{ opacity: 0 }}

                            animate={{ opacity: 1 }}

                            transition={{ delay: 0.4 }}

                            className="mt-12"

                        >

                            <motion.h2 

                                initial={{ opacity: 0 }}

                                animate={{ opacity: 1 }}

                                transition={{ delay: 0.5 }}

                                className="text-2xl font-bold text-gray-800 mb-6 text-center"

                            >

                                Patient Registry

                            </motion.h2>



                            {Array.isArray(patients) && patients.length > 0 ? (

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {patients.map((patient) => (

                                        <motion.div

                                            key={patient._id}

                                            variants={cardSpring}

                                            initial="hidden"

                                            animate="visible"

                                            whileHover="hover"

                                            whileTap="tap"

                                            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"

                                        >

                                            <div className="p-6">

                                                <h3 className="text-xl font-bold text-gray-800 mb-2">{patient.name}</h3>

                                                <p className="text-gray-600 mb-1"><span className="font-semibold">NIC:</span> {patient.nic}</p>

                                                <p className="text-gray-600 mb-1">

                                                    <span className="font-semibold">Blood Group:</span> 

                                                    <span className={`ml-2 px-2 py-1 rounded-full ${patient.blood ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>

                                                        {patient.blood || 'N/A'}

                                                    </span>

                                                </p>

                                                <div className="flex justify-end mt-4">

                                                    <motion.button

                                                        whileHover={{ scale: 1.05 }}

                                                        whileTap={{ scale: 0.95 }}

                                                        onClick={() => setSelectedPatient(patient)}

                                                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium shadow-sm"

                                                    >

                                                        View Details

                                                    </motion.button>

                                                </div>

                                            </div>

                                        </motion.div>

                                    ))}

                                </div>

                            ) : (

                                <motion.div 

                                    initial={{ opacity: 0 }}

                                    animate={{ opacity: 1 }}

                                    className="bg-white rounded-xl shadow-md p-8 text-center"

                                >

                                    <p className="text-gray-600 text-lg">No patients found in the system.</p>

                                </motion.div>

                            )}

                        </motion.div>

                    </>

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

                            <p className="text-blue-200">Advanced Patient Management System</p>

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



export default H_PatientDetails;