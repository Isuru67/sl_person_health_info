import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";


const MedicalHistory = ({ formData, setFormData }) => {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            medicalHistory: { 
                ...formData.medicalHistory, 
                [e.target.name]: e.target.value 
            } 
        });
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        console.log("Selected Files:", files);
    };

    // Handle form submission
    const handleNext = (e) => {
        e.preventDefault(); 
        navigate("/h-patientdetails/treatment-plan");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <DualNavbar />

            <div className="flex justify-center items-center min-h-screen bg-white p-6">
                <form onSubmit={handleNext} className="w-full max-w-lg bg-gray-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-center text-2xl font-semibold mb-4">Medical History</h2>

                    <div className="mb-4">
                        <label className="block font-semibold">Allergies</label>
                        <input 
                            type="text" 
                            name="allergies" 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                            placeholder="Allergies" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Illnesses</label>
                        <input 
                            type="text" 
                            name="illnesses" 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                            placeholder="Illnesses" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Medications</label>
                        <input 
                            type="text" 
                            name="medications" 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                            placeholder="Medications" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Surgeries</label>
                        <input 
                            type="text" 
                            name="surgeries" 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                            placeholder="Surgeries" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Surgeries Report</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            onChange={handleFileChange}
                            multiple 
                            
                        />
                        {/* Display selected files */}
                        {selectedFiles.length > 0 && (
                            <ul className="mt-2 text-sm text-gray-700">
                                {selectedFiles.map((file, index) => (
                                    <li key={index}>📄 {file.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Immunizations</label>
                        <input 
                            type="text" 
                            name="immunizations" 
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                            placeholder="Immunizations" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                            onClick={() => navigate(-1)}
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

export default MedicalHistory;
