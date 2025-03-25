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
        axios.get("http://localhost:5555/api/patients")
            .then((res) => {
                console.log("API Response:", res.data);
                setPatients(res.data);
            })
            .catch((error) => console.error("Error fetching patients:", error));
    }, []);

    const handleSearch = async () => {
        try {
            const res = await axios.get(`http://localhost:5555/api/patients/${searchNIC}`);
            setSelectedPatient(res.data);
        } catch (error) {
            alert("Patient not found");
            setSelectedPatient(null);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <DualNavbar />
            <div className="container">
                <h2>Hospital Patient Details</h2>
                <input
                    type="text"
                    placeholder="Enter NIC to Search"
                    value={searchNIC}
                    onChange={(e) => setSearchNIC(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>

                {selectedPatient && (
                    <div className="patient-card">
                        <h3>{selectedPatient.name}</h3>
                        <p>NIC: {selectedPatient.nic}</p>
                        <p>Blood Group: {selectedPatient.blood}</p>
                        <button  onClick={() => navigate("/ho-admtission")}>Treatment</button>
                    </div>
                    
                )}
                <div className="text-center">
                    <button  onClick={() => navigate("/h-patientdetails/ho-admtission")}>Next</button>
                </div>

                <h3>All Patients</h3>
                {patients && patients.length > 0 ? (
                    patients.map((p) => (
                        <div key={p._id} className="patient-card">
                            <h3>{p.name}</h3>
                            <p>NIC: {p.nic}</p>
                            <p>Blood Group: {p.blood}</p>
                            <button onClick={() => setSelectedPatient(p)}>View</button>
                        </div>
                    ))
                ) : (
                    <p>No patients found.</p>
                )}
            </div>
        </div>
    );
};

export default H_PatientDetails
