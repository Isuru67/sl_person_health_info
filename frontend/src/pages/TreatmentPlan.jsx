import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import DualNavbar from "../components/layout";
import { useParams } from "react-router-dom";

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
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
        console.log("Selected Files:", files);
    };

    // **Submit the entire form data to the database**
    const handleSubmit = async (e) => {
        e.preventDefault();
        
           // Ensure NIC is included in the request data
        const updatedFormData = {
        ...formData,
        nic,  // Add NIC to associate with the patient
    };


        try {
            const response = await fetch(`http://localhost:5555/api/treatment/${nic}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData), // send full form data
            });

            if (response.ok) {
                alert("Form submitted successfully!");
                navigate("/h-patientdetails"); // Redirect after submission
            } else {
                alert("Failed to submit form.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <DualNavbar />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center items-center min-h-screen bg-white p-6"
            >
                <motion.form
                    onSubmit={handleSubmit} // **Submit instead of navigating**
                    initial={{ scale: 0.9, rotate: -2 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring" }}
                    className="w-full max-w-lg bg-gray-50 p-6 rounded-lg shadow-md"
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
            </motion.div>
        </div>
    );
};

                            

export default TreatmentPlan;