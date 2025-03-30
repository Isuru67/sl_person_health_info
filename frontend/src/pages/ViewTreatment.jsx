import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";

const ViewTreatment = () => {
    const { nic } = useParams();  // Get NIC from URL
    const [treatments, setTreatments] = useState([]);  // Array to hold multiple treatments
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5555/api/treatment/${nic}`)
            .then((res) => {
                console.log("Fetched Treatments:", res.data);
                setTreatments(res.data);  // Set multiple treatments
            })
            .catch((error) => {
                if (error.response?.status === 404) {
                    console.warn("No treatment record found for this NIC.");
                    setTreatments([]);  // Set empty array if no treatments found
                } else {
                    console.error("Error fetching treatments:", error);
                }
            });
    }, [nic]);

    // ✅ Working Delete Function for each treatment
    const handleDelete = async (treatmentId) => {
        if (!window.confirm("Are you sure you want to delete this treatment record?")) return;

        try {
            const response = await axios.delete(`http://localhost:5555/api/treatments/${treatmentId}`);  // Ensure the correct endpoint for deletion
            console.log("Delete response:", response);
            alert("Treatment deleted successfully!");
            setTreatments(treatments.filter(t => t._id !== treatmentId)); // Remove the deleted treatment from state
        } catch (error) {
            console.error("Error deleting treatment:", error.response ? error.response.data : error.message);
            alert(`Error deleting treatment: ${error.response?.data?.message || "Server error"}`);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <DualNavbar />

            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Patient Treatment Details</h2>

                {treatments.length > 0 ? (
                    treatments.map((treatment) => (
                        <div key={treatment._id} className="bg-white p-6 rounded-lg shadow-lg max-w-full mx-auto mb-6">
                            <h3 className="text-xl font-semibold mb-4">Treatment Record for NIC: {treatment.patient_nic}</h3>

                            {/* Admission Details Table */}
                            <table className="min-w-full table-auto text-left text-sm mb-4">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 border">Admission Date</th>
                                        <th className="px-4 py-2 border">Admitting Physician</th>
                                        <th className="px-4 py-2 border">Primary Diagnosis</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border">
                                            {treatment.ho_admissionDetails?.admissionDate
                                                ? new Date(treatment.ho_admissionDetails.admissionDate).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {treatment.ho_admissionDetails?.admittingPhysician?.join(", ") || "N/A"}
                                        </td>
                                        <td className="px-4 py-2 border">
                                            {treatment.ho_admissionDetails?.primaryDiagnosis?.join(", ") || "N/A"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Medical History Table */}
                            <h3 className="text-lg font-semibold mt-4">Medical History</h3>
                            <table className="min-w-full table-auto text-left text-sm mb-4">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 border">Allergies</th>
                                        <th className="px-4 py-2 border">Illnesses</th>
                                        <th className="px-4 py-2 border">Medications</th>
                                        <th className="px-4 py-2 border">Surgeries</th>
                                        <th className="px-4 py-2 border">Surgeries Report</th>
                                        <th className="px-4 py-2 border">Immunizations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border">{treatment.medicalHistory?.allergies?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.medicalHistory?.illnesses?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.medicalHistory?.medications?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.medicalHistory?.surgeries?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.medicalHistory?.su_imaging?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.medicalHistory?.immunizations?.join(", ") || "None"}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Treatment Plan Table */}
                            <h3 className="text-lg font-semibold mt-4">Treatment Plan</h3>
                            <table className="min-w-full table-auto text-left text-sm mb-4">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2 border">Medications</th>
                                        <th className="px-4 py-2 border">Lab Tests</th>
                                        <th className="px-4 py-2 border">Lab Reports</th>
                                        <th className="px-4 py-2 border">Therapies</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-2 border">{treatment.treatmentPlan?.medications?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.treatmentPlan?.labTests?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.treatmentPlan?.te_imaging?.join(", ") || "None"}</td>
                                        <td className="px-4 py-2 border">{treatment.treatmentPlan?.therapies?.join(", ") || "None"}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="flex space-x-2">
                            <button
                                    onClick={() => navigate(`/h-patientdetails/update/${nic}`)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
                                >
                                    Update Treatment
                                </button>
                              
                            {/* Delete Button for this treatment */}
                            <button
                                onClick={() => handleDelete(treatment._id)}  // Delete specific treatment
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-4"
                            >
                                Delete Treatment
                            </button>
                        </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No treatment records found for this patient.</p>
                )}

                {/* Back Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate("/h-patientdetails")}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewTreatment;
