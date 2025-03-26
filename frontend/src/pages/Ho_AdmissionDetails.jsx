import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import DualNavbar from "../components/layout";
import { useParams } from "react-router-dom";


const Ho_AdmissionDetails = ({ formData, setFormData }) => {
    const navigate = useNavigate();
    const { nic } = useParams(); // Get NIC from the URL
    console.log("NIC from URL:", nic);  // This should log the NIC value
    //const [selectedPatient] = useState(null);



    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            Ho_admissionDetails: { 
                ...formData.Ho_admissionDetails, 
                [e.target.name]: e.target.value 
            } 
        });
    };
   const[isSubmitting,setIsSubmitting]= useState(false);

    const handleNext = async (e) => {
        e.preventDefault();
        

    if (isSubmitting) return;//prevent multiple submition

    setIsSubmitting(true);//mark as submitting

    navigate(`/h-patientdetails/medical-history/${nic}`);

        // Prepare the data to be sent
        const treatmentData = {
            ho_admissionDetails: {
                admissionDate: formData.Ho_admissionDetails.admissionDate,
                admittingPhysician: formData.Ho_admissionDetails.admittingPhysician,
                primaryDiagnosis: formData.Ho_admissionDetails.primaryDiagnosis,
            }
        };
    
        try {
            // Send data to the backend
            const response = await fetch(`http://localhost:5555/api/treatment/${nic}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(treatmentData),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                console.log("Treatment added successfully:", result);
               
            } else {
                console.error("Error adding treatment:", result.error);
            }
        } catch (error) {
            console.error("Error sending data to the backend:", error);
        }

        setIsSubmitting(false);//re-enable button after submission
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Top Navigation Bar */}
            <DualNavbar />

            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6"
            >
                <motion.form 
                    onSubmit={handleNext} 
                    initial={{ scale: 0.9, rotate: -2 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring" }}
                    className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl border-t-4 border-purple-500"
                >
                    <motion.h1 
                        className="text-center text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
                        initial={{ y: -20 }}
                        whileInView={{ y: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring" }}
                    >
                        Admission Details 
                    </motion.h1>

                    <div className="mb-4">
                        <label className="block font-semibold">Patient Admission Date</label>
                        <motion.input
                            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.5)" }}
                            type="date"
                            name="admissionDate"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Admitting Physician</label>
                        <motion.input
                            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.5)" }}
                            type="text"
                            name="admittingPhysician"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            placeholder="Admitting Physician"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold">Patient Primary Diagnosis</label>
                        <motion.input
                            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(124, 58, 237, 0.5)" }}
                            type="text"
                            name="primaryDiagnosis"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            placeholder="Primary Diagnosis"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex justify-between mt-4">
                        <motion.button
                            whileHover={{ scale: 1.03, backgroundColor: "rgba(75, 85, 99, 0.9)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="px-4 py-2 rounded-lg bg-gray-500 text-white font-bold shadow-lg"
                            type="button"
                            onClick={() => navigate("/h-patientdetails")}
                        >
                            Back
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03, background: "linear-gradient(45deg, #a855f7, #6366f1)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg"
                            type="submit"
                        >
                            Next
                        </motion.button>
                    </div>
                </motion.form>
            </motion.section>
        </div>
    );
};

export default Ho_AdmissionDetails;
