/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import DualNavbar from "../components/layout";
import { useNavigate } from "react-router-dom";

const H_PatientDetails = () => {
    const [patients, setPatients] = useState([]);
    const [searchNIC, setSearchNIC] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5555/patient/")
            .then((res) => {
                console.log("API Response:", res.data);
                setPatients(res.data.data);  // ✅ Ensure correct extraction
            })
            .catch((error) => console.error("Error fetching patients:", error));
    }, []);

    const handleSearch = async () => {
        try {
            const res = await axios.get(`http://localhost:5555/patient/search/${searchNIC}`);
            setSelectedPatient(res.data);
        } catch (error) {
            alert("Patient not found");
            setSelectedPatient(null);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <DualNavbar />

            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Hospital Patient Details</h2>

                {/* Search Section */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                    <input
                        type="text"
                        className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter NIC to Search"
                        value={searchNIC}
                        onChange={(e) => setSearchNIC(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

                {/* Selected Patient Section */}
                {selectedPatient && (
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-1/3 mx-auto">
                        <h3 className="text-xl font-semibold mb-2">{selectedPatient.name}</h3>
                        <p className="text-gray-700"><strong>NIC:</strong> {selectedPatient.nic}</p>
                        <p className="text-gray-700"><strong>Blood Group:</strong> {selectedPatient.blood}</p>
                        <p className="text-gray-700"><strong>Date of Birth:</strong> {new Date(selectedPatient.dob).toLocaleDateString()}</p>
                        <p className="text-gray-700"><strong>Phone:</strong> {selectedPatient.tele}</p>
                        <p className="text-gray-700"><strong>Email:</strong> {selectedPatient.email}</p>

                        <button 
                            onClick={() => navigate(`/h-patientdetails/ho-admission/${selectedPatient.nic}`)} 
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mr-2"
                        >
                            Add Treatment
                        </button>

                        <button 
                            onClick={() => navigate(`/h-patientdetails/view/${selectedPatient.nic}`)} 
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            View Treatment
                        </button>
                    </div>
                )}

                {/* Patient List Section */}
                <h3 className="text-xl font-semibold text-center mb-4">All Patients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.isArray(patients) && patients.length > 0 ? (
                        patients.map((p) => (
                            <div 
                                key={p._id} 
                                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                            >
                                <h3 className="text-lg font-semibold">{p.name}</h3>
                                <p className="text-gray-600"><strong>NIC:</strong> {p.nic}</p>
                                <p className="text-gray-600"><strong>Blood Group:</strong> {p.blood}</p>
                                <button 
                                    onClick={() => setSelectedPatient(p)} 
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    View
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No patients found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default H_PatientDetails;
