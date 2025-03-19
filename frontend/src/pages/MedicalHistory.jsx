import React from "react";
import { useNavigate } from "react-router-dom";

const MedicalHistory = ({ formData, setFormData }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            medicalHistory: { 
                ...formData.medicalHistory, 
                [e.target.name]: e.target.value 
            } 
        });
    };

    const handleNext = (e) => {
        e.preventDefault(); // Prevent default form submission
        navigate("/treatment-plan");
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 className="text-center">Medical History</h2>
                <form onSubmit={handleNext}>
                    <div className="mb-3">
                        <label htmlFor="allergies" className="form-label"><h6>Allergies</h6></label>
                        <input 
                            type="text" 
                            name="allergies" 
                            className="form-control" 
                            placeholder="Allergies" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Next</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Styles for centering the form
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Full viewport height
        backgroundColor: '#f8f9fa', // Light background color
    },
    formContainer: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%', // Responsive width
    }
};

export default MedicalHistory;