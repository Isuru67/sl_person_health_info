import React from "react";
import { useNavigate } from "react-router-dom";

const Ho_Pa_Details = ({ formData, setFormData }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            Ho_Pa_Details: { 
                ...formData.Ho_Pa_Details, 
                [e.target.name]: e.target.value 
            } 
        });
    };

    const handleNext = (e) => {
        e.preventDefault(); // Prevent default form submission
        navigate("/Ho-admission"); // Corrected the spelling of the route
    };

    return (
        <div className="container" style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", maxWidth: "600px", margin: "auto" }}>
            <h2 className="text-center">Patient Information</h2>
            <form onSubmit={handleNext}>
                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label"><h6>Patient Name</h6></label>
                    <input type="text" name="fullName" className="form-control" placeholder="Full Name" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="dateOfBirth" className="form-label"><h6>Date Of Birth</h6></label>
                    <input type="date" name="dateOfBirth" className="form-control" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="medicalRecordNumber" className="form-label"><h6>Medical Record Number</h6></label>
                    <input type="text" name="medicalRecordNumber" className="form-control" placeholder="Medical Record Number" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="paAddress" className="form-label"><h6>Patient Address</h6></label>
                    <input type="text" name="paAddress" className="form-control" placeholder="Patient Address" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="emergencyContact" className="form-label"><h6>Emergency Contact</h6></label>
                    <input type="text" name="emergencyContact" className="form-control" placeholder="Emergency Contact" onChange={handleChange} required />
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Next</button>
                </div>
            </form>
        </div>
    );
};

export default Ho_Pa_Details;