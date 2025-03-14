import React from "react";
import { useNavigate } from "react-router-dom";

const TreatmentPlan = ({ formData, setFormData }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, treatmentPlan: { ...formData.treatmentPlan, [e.target.name]: e.target.value } });
    };

    return (
        <div>
            <h2>Treatment Plan</h2>
            <input type="text" name="medications" placeholder="Medications" onChange={handleChange} required />
            <button onClick={() => navigate("/Summ_Submission")}>Next</button>
        </div>
    );
};

export default TreatmentPlan;
