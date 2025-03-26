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

            <div className="flex justify-center items-center min-h-screen bg-white p-6">
                <div className="w-full max-w-lg bg-gray-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-center text-2xl font-semibold mb-4">Review and Submit</h2>

                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Patient Information</h3>
                        <p><strong>Name:</strong> {formData.Ho_Pa_Details?.fullName}</p>
                        <p><strong>Date of Birth:</strong> {formData.Ho_Pa_Details?.dateOfBirth}</p>
                        <p><strong>Medical Record Number:</strong> {formData.Ho_Pa_Details?.medicalRecordNumber}</p>
                        <p><strong>Address:</strong> {formData.Ho_Pa_Details?.paAddress}</p>
                        <p><strong>Emergency Contact:</strong> {formData.Ho_Pa_Details?.emergencyContact}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Admission Details</h3>
                        <p><strong>Admission Date:</strong> {formData.Ho_admissionDetails?.admissionDate}</p>
                        <p><strong>Admitting Physician:</strong> {formData.Ho_admissionDetails?.admittingPhysician}</p>
                        <p><strong>Primary Diagnosis:</strong> {formData.Ho_admissionDetails?.primaryDiagnosis}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Medical History</h3>
                        <p><strong>Allergies:</strong> {formData.medicalHistory?.allergies}</p>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold text-lg">Treatment Plan</h3>
                        <p><strong>Medications:</strong> {formData.treatmentPlan?.medications}</p>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summ_Submission;
