import React from "react";
import { useNavigate } from "react-router-dom";

const Ho_AdmissionDetails = ({ formData, setFormData }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, admissionDetails: { ...formData.Ho_admissionDetails, [e.target.name]: e.target.value } });
    };

    return (
        <div>
            <h2>Admission Details</h2>

            <div className="mb-3">
            <label htmlFor="admissionDate" className="form-label"><h6>Patient Admission Date</h6></label>
            <input type="date" name="admissionDate" onChange={handleChange} required />
            </div>

            <div className="mb-3">
            <label htmlFor="admittingPhysician" className="form-label"><h6>Admitting Physician</h6></label>
            <input type="text" name="admittingPhysician" placeholder="Admitting Physician " onChange={handleChange} required />
            </div>


            <div className="mb-3">
            <label htmlFor="primaryDiagnosis" className="form-label"><h6>Patient Primary Diagnosis</h6></label>
            <input type="text" name="primaryDiagnosis" placeholder="Primary Diagnosis" onChange={handleChange} required />
            </div>

            <button onClick={() => navigate("/medical-history")}>Next</button>
        </div>
    );
};

export default Ho_AdmissionDetails;


