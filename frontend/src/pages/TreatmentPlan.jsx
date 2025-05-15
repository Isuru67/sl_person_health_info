import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import DualNavbar from "../components/layout";
import { useParams } from "react-router-dom";
import axios from "axios";

const TreatmentPlan = ({ formData, setFormData }) => {
    const navigate = useNavigate();
    const { nic } = useParams(); // Get NIC from the URL
    console.log("NIC from useParams:", nic);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Handle input changes for arrays
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Split the input into an array, assuming comma-separated input
        const valueArray = value.split(",").map(item => item.trim());

        setFormData({
            ...formData,
            treatmentPlan: {
                ...formData.treatmentPlan,
                [name]: valueArray
            }
        });
    };

    // Handle file selection
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        // Convert files to base64
        const base64Files = await Promise.all(
            files.map(file => new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            }))
        );

        setFormData({
            ...formData,
            treatmentPlan: {
                ...formData.treatmentPlan,
                te_imaging: base64Files
            }
        });
    };

    // **Submit the entire form data to the database**
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Get hospital info
            const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');
            
            if (!user.hospitalId || !user.hospitalName) {
                alert("Hospital information is missing. Please log in again.");
                navigate("/admin");
                return;
            }

            // Verify all required data is present
            if (!formData.ho_admissionDetails || !formData.medicalHistory || !formData.treatmentPlan) {
                alert("Please fill in all required information");
                return;
            }

            const updatedFormData = {
                ho_admissionDetails: formData.ho_admissionDetails,
                medicalHistory: formData.medicalHistory,
                treatmentPlan: formData.treatmentPlan,
                hospitalId: user.hospitalId,
                hospitalName: user.hospitalName
            };

            console.log('Sending treatment data:', updatedFormData);

            const response = await axios({
                method: 'post',
                url: `http://localhost:5555/api/treatment/${nic}`,
                data: updatedFormData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                alert("Treatment added successfully!");
                navigate("/h-patientdetails");
            }
        } catch (error) {
            if (error.response) {
                // Server responded with error
                console.error('Server error:', error.response.data);
                alert(`Server error: ${error.response.data.message}`);
            } else if (error.request) {
                // No response received
                console.error('Network error:', error.request);
                alert("Server not responding. Please try again later.");
            } else {
                // Error in request setup
                console.error('Request error:', error.message);
                alert("Error setting up request. Please try again.");
            }
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <DualNavbar />
            
            <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen p-6">
                {/* Progress Indicator */}
                <div className="w-full max-w-2xl mb-8">
                    <div className="flex items-center justify-between relative">
                        <div className="w-full h-2 bg-gray-200 absolute"></div>
                        <div className="w-full h-2 bg-blue-600 absolute"></div>
                        <div className="flex justify-between w-full relative">
                            <div className="flex flex-col items-center">
                                <div className="rounded-full w-8 h-8 bg-blue-600 text-white flex items-center justify-center z-10">✓</div>
                                <span className="text-sm mt-2 font-medium">Admission</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="rounded-full w-8 h-8 bg-blue-600 text-white flex items-center justify-center z-10">✓</div>
                                <span className="text-sm mt-2 font-medium">Medical History</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="rounded-full w-8 h-8 bg-blue-600 text-white flex items-center justify-center z-10">3</div>
                                <span className="text-sm mt-2 font-medium">Treatment Plan</span>
                            </div>
                        </div>
                    </div>
                </div>

                <motion.form
                    onSubmit={handleSubmit} // **Submit instead of navigating**
                    initial={{ scale: 0.9, rotate: -2 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring" }}
                    className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-blue-500"
                >
                    <motion.h2
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ type: "spring" }}
                        className="text-center text-2xl font-semibold mb-4"
                    >
                        Treatment Plan
                    </motion.h2>

                    <div className="mb-4">
                        <label className="block font-semibold">Medications</label>
                        <motion.input
                            whileFocus={{
                                scale: 1.02,
                                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                            }}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            type="text"
                            name="medications"
                            placeholder="Medications (comma-separated)"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Lab Tests</label>
                        <motion.input
                            whileFocus={{
                                scale: 1.02,
                                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                            }}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            type="text"
                            name="labTests"
                            placeholder="Lab Tests (comma-separated)"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Lab Report</label>
                        <motion.input
                            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                            type="file"
                            accept="image/*"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onChange={handleFileChange}
                            multiple
                        />

                        {selectedFiles.length > 0 && (
                            <ul className="mt-2 text-sm text-gray-700">
                                {selectedFiles.map((file, index) => (
                                    <li key={index}>📄 {file.name}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Therapies</label>
                        <motion.input
                            whileFocus={{
                                scale: 1.02,
                                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
                            }}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            type="text"
                            name="therapies"
                            placeholder="Therapies (comma-separated)"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex justify-between mt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </motion.button>

                        <motion.button
                            whileHover={{
                                scale: 1.05,
                                background: "linear-gradient(45deg, #3b82f6, #2563eb)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                            type="submit" // Changed from "Next" to "Submit"
                        >
                            Submit
                        </motion.button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

                            

export default TreatmentPlan;