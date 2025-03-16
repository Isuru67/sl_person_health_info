import React from "react";
import { useNavigate } from "react-router-dom";

const TreatmentPlan = ({ formData, setFormData }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            treatmentPlan: { 
                ...formData.treatmentPlan, 
                [e.target.name]: e.target.value 
            } 
        });
    };

    const handleNext = (e) => {
        e.preventDefault(); // Prevent default form submission
        navigate("/summ-submission");
    };

    return (
        <div className="container" style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", maxWidth: "600px", margin: "auto" }}>
            <h2 className="text-center">Treatment Plan</h2>
            <form onSubmit={handleNext}>
                <div className="mb-3">
                    <label htmlFor="medications" className="form-label"><h6>Medications</h6></label>
                    <input 
                        type="text" 
                        name="medications" 
                        className="form-control" 
                        placeholder="Medications" 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Next</button>
                </div>
            </form>
        </div>
    );
};

export default TreatmentPlan;