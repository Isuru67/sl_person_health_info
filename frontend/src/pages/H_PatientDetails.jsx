import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const H_PatientDetails = ({ hospital }) => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [treatmentDetails, setTreatmentDetails] = useState({ treatment: "", report: "" });

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/hospital/patient/${id}`, {
                    headers: { Authorization: `Bearer ${hospital.token}` }
                });
                setPatient(response.data);
            } catch (error) {
                console.error("Error fetching patient details:", error);
            }
        };
        fetchPatientDetails();
    }, [id, hospital.token]);

    const handleChange = (e) => {
        setTreatmentDetails({ ...treatmentDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/hospital/patient/${id}/treatment`, treatmentDetails, {
                headers: { Authorization: `Bearer ${hospital.token}` }
            });
            alert("Treatment details added successfully!");
        } catch (error) {
            console.error("Error adding treatment details:", error);
            alert("Error adding treatment details. Please try again.");
        }
    };

    if (!patient) return <div>Loading...</div>;

    return (
        <div className="container">
            <h2>Patient Details</h2>
            <p><strong>Name:</strong> {patient.fullName}</p>
            <p><strong>NIC:</strong> {patient.nic}</p>
            <p><strong>Address:</strong> {patient.address}</p>
            {/* Add more patient details as needed */}

            <h3>Add Treatment Details</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="treatment" className="form-label">Treatment</label>
                    <input type="text" name="treatment" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="report" className="form-label">Upload Report</label>
                    <input type="file" name="report" className="form-control" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit Treatment</button>
            </form>
        </div>
    );
};

export default H_PatientDetails;