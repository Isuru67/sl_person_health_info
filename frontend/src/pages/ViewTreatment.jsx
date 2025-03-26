import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";

const ViewTreatment = () => {
    const { nic } = useParams();  // Get NIC from URL
    const [treatment, setTreatment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:5555/api/treatment/${nic}`)
            .then((res) => {
                console.log("Fetched Treatment:", res.data);
                setTreatment(res.data);
            })
<<<<<<< Updated upstream
            .catch((error) => {
                if (error.response?.status === 404) {
                    console.warn("No treatment record found for this NIC.");
                    setTreatment(null); // Set state to null if not found
                } else {
                    console.error("Error fetching treatment:", error);
                }
            });
=======
            .catch((error) => console.error("Error fetching treatment:", error));
>>>>>>> Stashed changes
    }, [nic]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <DualNavbar />

            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Patient Treatment Details</h2>

                {treatment ? (
<<<<<<< Updated upstream
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-full mx-auto">
                        <h3 className="text-xl font-semibold mb-4">Patient NIC: {treatment.patient_nic}</h3>

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
                                    <td className="px-4 py-2 border">{treatment.ho_admissionDetails?.admissionDate?.join(", ") || "N/A"}</td>
                                    <td className="px-4 py-2 border">{treatment.ho_admissionDetails?.admittingPhysician?.join(", ") || "N/A"}</td>
                                    <td className="px-4 py-2 border">{treatment.ho_admissionDetails?.primaryDiagnosis?.join(", ") || "N/A"}</td>
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

                        {/* Buttons Section - Back, Update, Delete */}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => navigate("/h-patientdetails")}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Back
                            </button>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => alert('Update function')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => alert('Delete function')}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
=======
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                        <h3 className="text-xl font-semibold mb-2">{treatment.patientName}</h3>
                        <p><strong>NIC:</strong> {treatment.nic}</p>
                        <p><strong>Admission Date:</strong> {new Date(treatment.ho_admissionDetails.admissionDate).toLocaleDateString()}</p>
                        <p><strong>Admitting Physician:</strong> {treatment.ho_admissionDetails.admittingPhysician}</p>
                        <p><strong>Primary Diagnosis:</strong> {treatment.ho_admissionDetails.primaryDiagnosis}</p>

                        <button 
                            onClick={() => navigate("/h-patientdetails")} 
                            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Back
                        </button>
>>>>>>> Stashed changes
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No treatment found for this patient.</p>
                )}
            </div>
        </div>
    );
};

export default ViewTreatment;
