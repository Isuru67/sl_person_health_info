import React, { useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = ({ hospital }) => {
    const [searchNIC, setSearchNIC] = useState("");
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/hospital/patients?nic=${searchNIC}`, {
                headers: { Authorization: `Bearer ${hospital.token}` } // Assuming token-based auth
            });
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
            alert("Error fetching patients. Please try again.");
        }
    };

    const handleViewDetails = (patient) => {
        navigate(`/hospital/patient/${patient.id}`); // Navigate to patient details
    };

    return (
        <div className="container">
            <h2>Hospital Dashboard</h2>
            <form onSubmit={handleSearch}>
                <div className="mb-3">
                
                    <input type="text" name="searchNIC" className="form-control" onChange={(e) => setSearchNIC(e.target.value)} required />
                    <button type="submit" className="btn btn-primary">Search</button>
                </div>
             
            </form>

            <h3>Patients</h3>
            <ul className="list-group">
                {patients.map((patient) => (
                    <li key={patient.id} className="list-group-item">
                        {patient.fullName} - {patient.nic}
                        <button className="btn btn-info" onClick={() => handleViewDetails(patient)}>View Details</button>
                    </li>
                ))}
            </ul>

            <style jsx>{`
                .dashboard-container {
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color:rgb(18, 67, 109); /* Light background color for the dashboard */
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                .text-center {
                    text-align: center;
                }

                .search-form {
                    display: flex;
                    justify-content: center; /* Center the search form */
                    margin-bottom: 20px;
                }

                .list-group {
                    margin-top: 20px;
                }

                .list-group-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .btn {
                    margin-left: 10px;
                }
            `}</style>

        </div>
    );
};

export default HospitalDashboard;