import React from "react";
import { useNavigate } from "react-router-dom";

const Ho_AdmissionDetails = ({ formData, setFormData }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            Ho_admissionDetails: { 
                ...formData.Ho_admissionDetails, 
                [e.target.name]: e.target.value 
            } 
        });
    };

    const handleNext = (e) => {
        e.preventDefault(); // Prevent default form submission
        navigate("/medical-history");
    };

    return (
        <div className="container" style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", maxWidth: "600px", margin: "auto" }}>
            <h2 className="text-center">Admission Details</h2>
            <form onSubmit={handleNext}>
                <div className="mb-3">
                    <label htmlFor="admissionDate" className="form-label"><h6>Patient Admission Date</h6></label>
                    <input type="date" name="admissionDate" className="form-control" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="admittingPhysician" className="form-label"><h6>Admitting Physician</h6></label>
                    <input type="text" name="admittingPhysician" className="form-control" placeholder="Admitting Physician" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="primaryDiagnosis" className="form-label"><h6>Patient Primary Diagnosis</h6></label>
                    <input type="text" name="primaryDiagnosis" className="form-control" placeholder="Primary Diagnosis" onChange={handleChange} required />
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Next</button>
                </div>
            </form>
        </div>
    );
};

export default Ho_AdmissionDetails;