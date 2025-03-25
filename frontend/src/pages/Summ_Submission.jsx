import React from "react";
import axios from "axios";
import DualNavbar from "../components/layout";

const Summ_Submission = ({ formData }) => {
    const handleSubmit = () => {
        console.log("Submitting data:", formData); // Debugging line
        axios.post("http://localhost:5000/patients", formData)
            .then(() => {
                alert("Patient Data Submitted!");
                // Optionally, navigate to a different page or reset form data
            })
            .catch(err => {
                console.error("Submission error:", err); // Debugging line
                alert("Error submitting data. Please try again.");
            });
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
                    {/* Top Navigation Bar */}
                    <DualNavbar />
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 className="text-center">Review and Submit</h2>
                <div>
                    <h3>Patient Information</h3>
                    <p><strong>Name:</strong> {formData.Ho_Pa_Details?.fullName}</p>
                    <p><strong>Date of Birth:</strong> {formData.Ho_Pa_Details?.dateOfBirth}</p>
                    <p><strong>Medical Record Number:</strong> {formData.Ho_Pa_Details?.medicalRecordNumber}</p>
                    <p><strong>Address:</strong> {formData.Ho_Pa_Details?.paAddress}</p>
                    <p><strong>Emergency Contact:</strong> {formData.Ho_Pa_Details?.emergencyContact}</p>
                </div>

                <div>
                    <h3>Admission Details</h3>
                    <p><strong>Admission Date:</strong> {formData.Ho_admissionDetails?.admissionDate}</p>
                    <p><strong>Admitting Physician:</strong> {formData.Ho_admissionDetails?.admittingPhysician}</p>
                    <p><strong>Primary Diagnosis:</strong> {formData.Ho_admissionDetails?.primaryDiagnosis}</p>
                </div>

                <div>
                    <h3>Medical History</h3>
                    <p><strong>Allergies:</strong> {formData.medicalHistory?.allergies}</p>
                </div>

                <div>
                    <h3>Treatment Plan</h3>
                    <p><strong>Medications:</strong> {formData.treatmentPlan?.medications}</p>
                </div>
                
                <div className="text-center">
                    <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
                </div>
            </div>
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

export default Summ_Submission;