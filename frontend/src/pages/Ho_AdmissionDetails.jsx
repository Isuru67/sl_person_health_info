import React from "react";
import { useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";

const Ho_AdmissionDetails = ({ formData, setFormData }) => {
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            Ho_admissionDetails: { 
                ...formData.Ho_admissionDetails, 
                [e.target.name]: e.target.value 
            } 
        });
    };

    const handleNext = (e) => {
        e.preventDefault(); 
        navigate("/h-patientdetails/medical-history");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <DualNavbar />

            <div className="flex justify-center items-center min-h-screen bg-white p-6">
                <form onSubmit={handleNext} className="w-full max-w-lg bg-gray-50 p-6 rounded-lg shadow-md">
                    <h1 className="text-center text-2xl font-semibold mb-4">Admission Details</h1>

                    <div className="mb-4">
                        <label className="block font-semibold">Patient Admission Date</label>
                        <input 
                            type="date" 
                            name="admissionDate" 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Admitting Physician</label>
                        <input 
                            type="text" 
                            name="admittingPhysician" 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                            placeholder="Admitting Physician" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Patient Primary Diagnosis</label>
                        <input 
                            type="text" 
                            name="primaryDiagnosis" 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                            placeholder="Primary Diagnosis" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                            onClick={() => navigate("/h-patientdetails")}
                        >
                            Back
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Ho_AdmissionDetails;
