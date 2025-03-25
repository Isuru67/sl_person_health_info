import React from "react";
import { useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";
function sendData(e) {
    e.preventDefault();
}
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
        e.preventDefault(); // Prevent default form submission
        navigate("/medical-history");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
                    {/* Top Navigation Bar */}
             <DualNavbar />
        <div className="container" style={{ backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" ,minWidth:"230vh"}}>
        <form onSubmit={sendData} style={{ width: "30%", minHeight: "40vh",border: "2px solid blue", padding: "20px", borderRadius: "8px", backgroundColor: "rgba(80, 80, 83, 0.34)" }}>
            <h1 className="text-center"><b>Admission Details</b></h1>
            <form onSubmit={handleNext}>
                <div className="mb-3">
                    <label htmlFor="admissionDate" className="form-label"><b><h4>Patient Admission Date</h4></b></label>
                    <input type="date" name="admissionDate" className="form-control" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="admittingPhysician" className="form-label"><h4>Admitting Physician</h4></label>
                    <input type="text" name="admittingPhysician" className="form-control" placeholder="Admitting Physician" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label htmlFor="primaryDiagnosis" className="form-label"><h4>Patient Primary Diagnosis</h4></label>
                    <input type="text" name="primaryDiagnosis" className="form-control" placeholder="Primary Diagnosis" onChange={handleChange} required />
                </div>

                <div className="text-center">
                    <button  onClick={() => navigate("/h-patientdetails/medical-history")}>Next</button>
                </div>
            </form>
            </form>
        </div>
        
        </div>
    );
};

export default Ho_AdmissionDetails;