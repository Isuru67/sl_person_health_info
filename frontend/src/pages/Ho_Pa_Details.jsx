import React from "react";
import { useNavigate } from "react-router-dom";

const Ho_Pa_Details = ({ formData, setFormData }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, Ho_Pa_Details: { ...formData.ho_patientInfo, [e.target.name]: e.target.value } });
    };

    return (
        <div>
            <h2>Patient Information</h2>

            <div className="mb-3">
                <label htmlFor="emergencyContact" className="form-label"><h6>Patient Name</h6></label>
                <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
            </div>

            <div className="mb-3">
                <label htmlFor="edateOfBirth" className="form-label"><h6>Date Of Birth</h6></label>    
            <input type="date" name="dateOfBirth" onChange={handleChange} required />
            </div>

            <div className="mb-3">
                <label htmlFor="medicalRecordNumber" className="form-label"><h6>Medical RecordNumber</h6></label>
                <input type="text" name="medicalRecordNumber" placeholder="Medical RecordNumber"onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="paAddress" className="form-label"><h6>Patient Address</h6></label>
                <input type="text" name="paAddress" placeholder="Patient Address" onChange={handleChange} required />
            </div>

            <div className="mb-3">
                <label htmlFor="emergencyContact" className="form-label"><h6>Emergency Contact</h6></label>
                <input type="text" name="emergencyContact" placeholder="Emergency Contact"onChange={handleChange} required />
            </div>

            <button onClick={() => navigate("/Ho-admtission")}>Next</button>
        </div>
    );
};



export default Ho_Pa_Details;