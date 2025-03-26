/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import DualNavbar from "../components/layout";
import { useNavigate } from "react-router-dom";

function sendData(e) {
    e.preventDefault();
}

const H_PatientDetails = () => {
    const [patients, setPatients] = useState([]);
    const [searchNIC, setSearchNIC] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5555/patient/")
            .then((res) => {
                console.log("API Response:", res.data); 
                setPatients(res.data.data);  // ✅ Extract the array correctly
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

    console.log("Patients State:", patients);

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
                        className="bg-blue-500 text-white px-2 py-1   rounded-lg hover:bg-blue-600 transition duration-200"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

                {/* Selected Patient Section */}
                {selectedPatient && (
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-1/3 mx-auto">
                        <h3 className="text-xl font-semibold mb-2">{selectedPatient.name}</h3>
                        <p className="text-gray-700">NIC: {selectedPatient.nic}</p>
                        <p className="text-gray-700">Blood Group: {selectedPatient.blood}</p>
                        <button 
                            onClick={() => navigate("/h-patientdetails/ho-admtission")} 
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Add Treatment
                        </button>
                        <button 
                            onClick={() => navigate("/h-patientdetails")} 
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
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
                            <div key={p._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                                <h3 className="text-lg font-semibold">{p.name}</h3>
                                <p className="text-gray-600">NIC: {p.nic}</p>
                                <p className="text-gray-600">Blood Group: {p.blood}</p>
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
