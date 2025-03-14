import React from "react";
import { useNavigate } from "react-router-dom";

const MedicalHistory = ({ formData, setFormData }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, medicalHistory: { ...formData.medicalHistory, [e.target.name]: e.target.value } });
    };

    return (
        <div>
            <h2>Medical History</h2>
            <input type="text" name="allergies" placeholder="Allergies" onChange={handleChange} required />
            <button onClick={() => navigate("/treatment-plan")}>Next</button>
        </div>
    );
};

export default MedicalHistory;