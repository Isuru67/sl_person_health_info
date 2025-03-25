import React from "react";
import { useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";
import "../styles/formStyles.css";


function sendData(e) {
    e.preventDefault();
}

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
        <div className="flex flex-col h-screen bg-gray-100">
                    {/* Top Navigation Bar */}
          <DualNavbar />
          
        <div style={styles.container}>
        <form onSubmit={sendData} style={{ width: "30%", minHeight: "40vh",border: "2px solid blue", padding: "20px", borderRadius: "8px", backgroundColor: "rgba(80, 80, 83, 0.34)" }}>
            
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
                        <button onClick={() => navigate("/h-patientdetails/treatment-plan")}>Next</button>
                    </div>
                </form>
           
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
        minHeight: '75vh', // Full viewport height
        backgroundColor: '#f8f9fa', // Light background color
    },
    formContainer: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        maxWidth: '600px',
        width: '100%', // Responsive width
    }
};

export default MedicalHistory;