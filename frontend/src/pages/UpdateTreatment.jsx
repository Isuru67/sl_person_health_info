<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";

const UpdateTreatment = () => {
    const { nic } = useParams(); // Get NIC from URL
    const navigate = useNavigate();

    // State to manage form data
    const [formData, setFormData] = useState({
        ho_admissionDetails: {
            admissionDate: "",
            admittingPhysician: "",
            primaryDiagnosis: ""
        },
        medicalHistory: {
            allergies: "",
            illnesses: "",
            medications: "",
            surgeries: "",
            su_imaging: [],
            immunizations: ""
        },
        treatmentPlan: {
            medications: "",
            labTests: "",
            te_imaging: [],
            therapies: ""
        }
    });
<<<<<<< Updated upstream
    

    // Fetch treatment data when component mounts
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5555/api/treatment/${nic}`)
            .then((res) => {
                console.log("API Response:", res.data); // Debugging
                if (res.data && res.data.ho_admissionDetails) {
                    setFormData(res.data.data);
                } else {
                    console.error("Invalid or empty response.");
                    alert("No treatment data available.");
                }
=======

    // Fetch treatment data when component mounts
    useEffect(() => {
        axios.get(`http://localhost:5555/api/treatment/${nic}`)
            .then((res) => {
                setFormData(res.data);
>>>>>>> Stashed changes
            })
            .catch((error) => {
                console.error("Error fetching treatment:", error);
                alert("Failed to load treatment data.");
<<<<<<< Updated upstream
            })
            .finally(() => {
                setLoading(false);
            });
    }, [nic]);
    

=======
            });
    }, [nic]);
>>>>>>> Stashed changes

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type } = e.target;
<<<<<<< Updated upstream
        const keys = name.split(".");
    
        setFormData((prevData) => {
            const updatedData = { ...prevData };
            let ref = updatedData;
    
            for (let i = 0; i < keys.length - 1; i++) {
                ref = ref[keys[i]];
            }
    
            ref[keys[keys.length - 1]] = type === "file" ? Array.from(e.target.files) : value;
    
            return { ...updatedData };
        });
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.put(`http://localhost:5555/api/treatment/${nic}`, formData, {
                headers: { "Content-Type": "application/json" } 
            });
    
=======
        const [category, field] = name.split(".");

        if (type === "file") {
            setFormData((prevData) => ({
                ...prevData,
                [category]: {
                    ...prevData[category],
                    [field]: Array.from(e.target.files)
                }
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [category]: {
                    ...prevData[category],
                    [field]: value
                }
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("ho_admissionDetails", JSON.stringify(formData.ho_admissionDetails));
        formDataToSend.append("medicalHistory", JSON.stringify(formData.medicalHistory));
        formDataToSend.append("treatmentPlan", JSON.stringify(formData.treatmentPlan));

        // Append multiple images for su_imaging (Surgeries Imaging)
        formData.medicalHistory.su_imaging.forEach((file, index) => {
            formDataToSend.append(`su_imaging_${index}`, file);
        });

        // Append multiple images for te_imaging (Treatment Imaging)
        formData.treatmentPlan.te_imaging.forEach((file, index) => {
            formDataToSend.append(`te_imaging_${index}`, file);
        });

        try {
            await axios.put(`http://localhost:5555/api/treatment/${nic}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

>>>>>>> Stashed changes
            alert("Treatment updated successfully.");
            navigate(`/h-patientdetails/view/${nic}`);
        } catch (error) {
            console.error("Error updating treatment:", error);
            alert("Error updating treatment.");
        }
    };
<<<<<<< Updated upstream
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <DualNavbar />
            <div>
        {loading ? (
            <p>Loading treatment details...</p>
        ) : (
=======

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <DualNavbar />

>>>>>>> Stashed changes
            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Update Treatment Details</h2>

                <div className="bg-white p-6 rounded-lg shadow-lg max-w-full mx-auto">
                    <h3 className="text-xl font-semibold mb-4">Patient NIC: {nic}</h3>

                    <form onSubmit={handleSubmit}>
                        {/* Admission Details */}
                        <h3 className="text-lg font-semibold mt-4">Admission Details</h3>
                        <input type="text" name="ho_admissionDetails.admissionDate" value={formData.ho_admissionDetails.admissionDate} onChange={handleChange} placeholder="Admission Date" className="w-full p-2 border border-gray-300 mb-4" />
                        <input type="text" name="ho_admissionDetails.admittingPhysician" value={formData.ho_admissionDetails.admittingPhysician} onChange={handleChange} placeholder="Admitting Physician" className="w-full p-2 border border-gray-300 mb-4" />
                        <input type="text" name="ho_admissionDetails.primaryDiagnosis" value={formData.ho_admissionDetails.primaryDiagnosis} onChange={handleChange} placeholder="Primary Diagnosis" className="w-full p-2 border border-gray-300 mb-4" />

                        {/* Medical History */}
                        <h3 className="text-lg font-semibold mt-4">Medical History</h3>
                        <input type="text" name="medicalHistory.allergies" value={formData.medicalHistory.allergies} onChange={handleChange} placeholder="Allergies" className="w-full p-2 border border-gray-300 mb-4" />
                        <input type="text" name="medicalHistory.illnesses" value={formData.medicalHistory.illnesses} onChange={handleChange} placeholder="Illnesses" className="w-full p-2 border border-gray-300 mb-4" />
                        <input type="text" name="medicalHistory.medications" value={formData.medicalHistory.medications} onChange={handleChange} placeholder="Medications" className="w-full p-2 border border-gray-300 mb-4" />
<<<<<<< Updated upstream
                        <input type="file" name="su_imaging" multiple onChange={handleChange} className="w-full p-2 border border-gray-300 mb-4" />
                        {formData.medicalHistory.su_imaging.map((file, index) => (
                                <img 
                                    key={index} 
                                    src={typeof file === "string" ? file : URL.createObjectURL(file)} 
                                    alt={`su_imaging-${index}`} 
                                    className="w-24 h-24 object-cover" 
                                />
                            ))}

                        <input type="text" name="medicalHistory.immunizations" value={formData.medicalHistory.immunizations} onChange={handleChange} placeholder="Immunizations" className="w-full p-2 border border-gray-300 mb-4" />
=======
                        <input type="file" name="medicalHistory.su_imaging" multiple onChange={handleChange} className="w-full p-2 border border-gray-300 mb-4" />
>>>>>>> Stashed changes

                        {/* Treatment Plan */}
                        <h3 className="text-lg font-semibold mt-4">Treatment Plan</h3>
                        <input type="text" name="treatmentPlan.medications" value={formData.treatmentPlan.medications} onChange={handleChange} placeholder="Medications" className="w-full p-2 border border-gray-300 mb-4" />
                        <input type="text" name="treatmentPlan.labTests" value={formData.treatmentPlan.labTests} onChange={handleChange} placeholder="Lab Tests" className="w-full p-2 border border-gray-300 mb-4" />
<<<<<<< Updated upstream
                        <input type="file" name="te_imaging" multiple onChange={handleChange} className="w-full p-2 border border-gray-300 mb-4" />
                        {formData.treatmentPlan.te_imaging.map((file, index) => (
                            <img 
                                key={index} 
                                src={typeof file === "string" ? file : URL.createObjectURL(file)} 
                                alt={`te_imaging-${index}`} 
                                className="w-24 h-24 object-cover" 
                            />
                        ))}

                        <input type="text" name="treatmentPlan.therapies" value={formData.treatmentPlan.therapies} onChange={handleChange} placeholder="Therapies" className="w-full p-2 border border-gray-300 mb-4" />

                        <div className="flex justify-between mt-4">
                            <button onClick={() => navigate(`/view/${nic}`)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button>
                            <button onClick={handleSubmit} type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Update Treatment</button>
=======
                        <input type="file" name="treatmentPlan.te_imaging" multiple onChange={handleChange} className="w-full p-2 border border-gray-300 mb-4" />
                        <input type="text" name="treatmentPlan.therapies" value={formData.treatmentPlan.therapies} onChange={handleChange} placeholder="Therapies" className="w-full p-2 border border-gray-300 mb-4" />

                        <div className="flex justify-between mt-4">
                            <button onClick={() => navigate(`/view-treatment/${nic}`)} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Update Treatment</button>
>>>>>>> Stashed changes
                        </div>
                    </form>
                </div>
            </div>
<<<<<<< Updated upstream
            )}
    </div>
=======
>>>>>>> Stashed changes
        </div>
    );
};

<<<<<<< Updated upstream
export default UpdateTreatment;
=======
export default UpdateTreatment;
>>>>>>> Stashed changes
