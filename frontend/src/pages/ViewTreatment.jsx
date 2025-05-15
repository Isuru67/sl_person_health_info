import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom/client';
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DualNavbar from "../components/layout";

const ImageModal = ({ image, onClose }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
            onClick={onClose}
        >
            <div className="relative max-w-4xl w-full mx-auto">
                <button
                    className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
                    onClick={onClose}
                >
                    ×
                </button>
                <img
                    src={image}
                    alt="Full size"
                    className="max-w-full max-h-[90vh] object-contain mx-auto rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};

const ImagePreview = ({ images, title }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!images || images.length === 0) return <span>No images</span>;

    return (
        <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
                <div key={index} className="relative group cursor-pointer">
                    <div 
                        className="w-24 h-24 relative overflow-hidden rounded-lg border border-gray-200"
                        onClick={() => setSelectedImage(image)}
                    >
                        <img
                            src={image}
                            alt={`${title} ${index + 1}`}
                            className="w-full h-full object-cover transition-transform hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-sm font-medium px-2 py-1 bg-black bg-opacity-50 rounded">
                                View
                            </span>
                        </div>
                    </div>
                </div>
            ))}
            {selectedImage && (
                <ImageModal 
                    image={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};

const TreatmentReportContent = ({ treatment }) => {
    return (
        <div className="p-8 bg-white print:p-4">
            <h1 className="text-2xl font-bold text-center mb-6">Treatment Report</h1>
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Patient Information</h2>
                <p><strong>NIC:</strong> {treatment.patient_nic}</p>
                <p><strong>Hospital:</strong> {treatment.hospitalName}</p>
            </div>
            
            {/* Admission Details */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Admission Details</h2>
                <p><strong>Date:</strong> {new Date(treatment.ho_admissionDetails?.admissionDate).toLocaleDateString()}</p>
                <p><strong>Physician:</strong> {treatment.ho_admissionDetails?.admittingPhysician?.join(", ")}</p>
                <p><strong>Diagnosis:</strong> {treatment.ho_admissionDetails?.primaryDiagnosis?.join(", ")}</p>
            </div>

            {/* Medical History */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Medical History</h2>
                <p><strong>Allergies:</strong> {treatment.medicalHistory?.allergies?.join(", ") || "None"}</p>
                <p><strong>Illnesses:</strong> {treatment.medicalHistory?.illnesses?.join(", ") || "None"}</p>
                <p><strong>Medications:</strong> {treatment.medicalHistory?.medications?.join(", ") || "None"}</p>
                <p><strong>Surgeries:</strong> {treatment.medicalHistory?.surgeries?.join(", ") || "None"}</p>
                <p><strong>Immunizations:</strong> {treatment.medicalHistory?.immunizations?.join(", ") || "None"}</p>
            </div>

            {/* Surgery Reports Section */}
            {treatment.medicalHistory?.su_imaging?.length > 0 && (
                <div className="mb-6 page-break-inside-avoid">
                    <h2 className="text-xl font-semibold mb-3">Surgery Reports</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {treatment.medicalHistory.su_imaging.map((image, index) => (
                            <div key={index} className="print:break-inside-avoid">
                                <img
                                    src={image}
                                    alt={`Surgery Report ${index + 1}`}
                                    className="w-full max-h-64 object-contain border rounded-lg"
                                />
                                <p className="text-center text-sm mt-1">Surgery Report {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Treatment Plan */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Treatment Plan</h2>
                <p><strong>Medications:</strong> {treatment.treatmentPlan?.medications?.join(", ") || "None"}</p>
                <p><strong>Lab Tests:</strong> {treatment.treatmentPlan?.labTests?.join(", ") || "None"}</p>
                <p><strong>Therapies:</strong> {treatment.treatmentPlan?.therapies?.join(", ") || "None"}</p>
            </div>

            {/* Lab Reports Section */}
            {treatment.treatmentPlan?.te_imaging?.length > 0 && (
                <div className="mb-6 page-break-inside-avoid">
                    <h2 className="text-xl font-semibold mb-3">Lab Reports</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {treatment.treatmentPlan.te_imaging.map((image, index) => (
                            <div key={index} className="print:break-inside-avoid">
                                <img
                                    src={image}
                                    alt={`Lab Report ${index + 1}`}
                                    className="w-full max-h-64 object-contain border rounded-lg"
                                />
                                <p className="text-center text-sm mt-1">Lab Report {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="text-center text-sm text-gray-500 mt-8">
                <p>Report generated on {new Date().toLocaleString()}</p>
                <p>{treatment.hospitalName}</p>
            </div>
        </div>
    );
};

const generateReport = (treatment) => {
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Treatment Report - ${treatment.patient_nic}</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                <style>
                    @media print {
                        body { padding: 20px; }
                        button { display: none; }
                        .page-break-inside-avoid { page-break-inside: avoid; }
                        img { max-width: 100%; height: auto; }
                        @page { margin: 2cm; }
                    }
                    .print-button {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 1000;
                    }
                </style>
            </head>
            <body>
                <button onclick="window.print()" class="print-button px-4 py-2 bg-blue-500 text-white rounded shadow">
                    Print Report
                </button>
                <div id="report-root"></div>
            </body>
        </html>
    `);

    const root = ReactDOM.createRoot(reportWindow.document.getElementById('report-root'));
    root.render(<TreatmentReportContent treatment={treatment} />);
};

// Example usage of generateReport
// Uncomment the following line if you want to use it in the component
// generateReport(treatments[0]); // Pass a treatment object as needed

// Add this helper function to ensure proper array handling
const ensureArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    // If it's a string, try to split it at commas
    if (typeof value === 'string') return value.split(',').map(item => item.trim());
    // For other types, wrap in array
    return [value];
};

const ViewTreatment = () => {
    const { nic } = useParams();  // Get NIC from URL
    const [treatments, setTreatments] = useState([]);  // Array to hold multiple treatments
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hospitalInfo, setHospitalInfo] = useState({});
    const navigate = useNavigate();

    // Add states for decryption
    const [showDecryptModal, setShowDecryptModal] = useState(false);
    const [decryptPassword, setDecryptPassword] = useState('');
    const [decryptError, setDecryptError] = useState('');
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [encryptedTreatmentId, setEncryptedTreatmentId] = useState(null);
    
    // Add state to track which treatment is currently being viewed
    const [currentTreatment, setCurrentTreatment] = useState(null);

    useEffect(() => {
        // Get hospital info from localStorage
        const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');
        setHospitalInfo(user);
        
        // Early return if no hospital info
        if (!user || !user.hospitalId) {
            setError("Hospital information not found. Please log in again.");
            setLoading(false);
            return;
        }

        // Fetch treatments with hospital filter
        axios.get(`http://localhost:5555/api/treatment/${nic}`, {
            params: { hospitalId: user.hospitalId }
        })
        .then((res) => {
            console.log("Fetched Treatments:", res.data);
            setTreatments(res.data);
            
            // Check if any treatments are encrypted
            const hasEncryptedTreatments = res.data.some(treatment => treatment.isEncrypted);
            
            // If there are encrypted treatments, prompt for decryption
            if (hasEncryptedTreatments && res.data.length === 1) {
                // If there's only one treatment and it's encrypted, auto-select it for decryption
                handleDecryptPrompt(res.data[0]);
            }
            
            setLoading(false);
        })
        .catch((error) => {
            if (error.response?.status === 404) {
                console.warn("No treatment record found for this NIC and hospital.");
                setTreatments([]);
                setError("No treatments found that were added by your hospital for this patient.");
            } else {
                console.error("Error fetching treatments:", error);
                setError("An error occurred while fetching treatments.");
            }
            setLoading(false);
        });
    }, [nic]);

    // Function to handle showing decrypt prompt for a specific treatment
    const handleDecryptPrompt = (treatment) => {
        if (!treatment.isEncrypted) {
            // If treatment is already decrypted, just set it as current
            setCurrentTreatment(treatment);
            return;
        }
        
        // Set the treatment to be decrypted
        setEncryptedTreatmentId(treatment._id);
        setCurrentTreatment(null); // Clear current treatment while decrypting
        setDecryptPassword('');
        setDecryptError('');
        setShowDecryptModal(true);
    };

    const handleDecryptSubmit = async () => {
        if (!decryptPassword) {
            setDecryptError('Password is required');
            return;
        }
        
        setIsDecrypting(true);
        setDecryptError('');
        
        try {
            // Get hospital data
            const hospitalData = JSON.parse(localStorage.getItem('user') || '{}');
            
            // Send decryption request
            const response = await axios.post(
                `http://localhost:5555/api/treatment/${nic}/${encryptedTreatmentId}/decrypt`,
                {
                    password: decryptPassword,
                    role: 'hospital'
                }
            );
            
            // Normalize data structure to ensure arrays are properly formatted
            const normalizedData = {
                ...response.data,
                medicalHistory: {
                    ...response.data.medicalHistory,
                    allergies: ensureArray(response.data.medicalHistory?.allergies),
                    illnesses: ensureArray(response.data.medicalHistory?.illnesses),
                    medications: ensureArray(response.data.medicalHistory?.medications),
                    surgeries: ensureArray(response.data.medicalHistory?.surgeries),
                    immunizations: ensureArray(response.data.medicalHistory?.immunizations),
                },
                treatmentPlan: {
                    ...response.data.treatmentPlan,
                    medications: ensureArray(response.data.treatmentPlan?.medications),
                    labTests: ensureArray(response.data.treatmentPlan?.labTests),
                    therapies: ensureArray(response.data.treatmentPlan?.therapies),
                },
                ho_admissionDetails: {
                    ...response.data.ho_admissionDetails,
                    admittingPhysician: ensureArray(response.data.ho_admissionDetails?.admittingPhysician),
                    primaryDiagnosis: ensureArray(response.data.ho_admissionDetails?.primaryDiagnosis),
                }
            };
            
            // Update treatment list with normalized decrypted data
            const updatedTreatments = treatments.map(treatment => 
                treatment._id === encryptedTreatmentId ? normalizedData : treatment
            );
            
            setTreatments(updatedTreatments);
            
            // Set current treatment to the normalized decrypted one
            setCurrentTreatment(normalizedData);
            setShowDecryptModal(false);
        } catch (error) {
            console.error('Decryption error:', error);
            setDecryptError('Failed to decrypt. Invalid password.');
        } finally {
            setIsDecrypting(false);
        }
    };

    // ✅ Working Delete Function for each treatment
    const handleDelete = async (treatmentId) => {
        // Verify this hospital owns the treatment before deleting
        const treatmentToDelete = treatments.find(t => t._id === treatmentId);
        
        if (treatmentToDelete.hospitalId !== hospitalInfo.hospitalId) {
            alert("You can only delete treatments added by your hospital.");
            return;
        }
        
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

    // Get hospital path for navigation
    const getHospitalPath = () => {
        if (hospitalInfo && hospitalInfo.hospitalName) {
            const urlFriendlyName = hospitalInfo.hospitalName
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            return `/${urlFriendlyName}/h-patientdetails`;
        }
        return "/h-patientdetails";
    };

    // Password Modal Component
    const DecryptModal = () => {
        if (!showDecryptModal) return null;
        
        // Set focus on password input
        React.useEffect(() => {
            const passwordInput = document.getElementById('decrypt-password-input');
            if (passwordInput) {
                setTimeout(() => passwordInput.focus(), 50);
            }
        }, []);
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">
                        This treatment record is encrypted. Please enter your hospital password to view the details.
                    </p>
                    
                    <div className="mb-4">
                        <input
                            id="decrypt-password-input"
                            type="password"
                            value={decryptPassword}
                            onChange={e => setDecryptPassword(e.target.value)}
                            placeholder="Enter hospital password"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleDecryptSubmit();
                                }
                            }}
                        />
                        {decryptError && (
                            <p className="text-red-500 text-sm mt-1">{decryptError}</p>
                        )}
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowDecryptModal(false)}
                            className="px-4 py-2 text-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDecryptSubmit}
                            disabled={isDecrypting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {isDecrypting ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Decrypting...
                                </div>
                            ) : "Decrypt and View"}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <DualNavbar />

            <div className="container mx-auto px-4 py-6">
                <h2 className="text-2xl font-semibold text-center mb-4">Patient Treatment Details</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                        <p>{error}</p>
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => navigate(getHospitalPath())}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Back to Patient List
                            </button>
                        </div>
                    </div>
                ) : treatments.length > 0 ? (
                    <div>
                        {/* Treatment selection section if multiple treatments exist */}
                        {treatments.length > 1 && (
                            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-blue-800 font-medium mb-2">Treatment Records</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {treatments.map((treatment) => (
                                        <button 
                                            key={treatment._id}
                                            onClick={() => handleDecryptPrompt(treatment)}
                                            className={`p-3 rounded border ${
                                                treatment._id === (currentTreatment?._id || encryptedTreatmentId)
                                                    ? 'bg-blue-100 border-blue-400'
                                                    : 'bg-white border-gray-200 hover:bg-blue-50'
                                            } text-left flex justify-between items-center`}
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    Record {treatments.indexOf(treatment) + 1}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {treatment.metadata?.admissionDate 
                                                        ? new Date(treatment.metadata.admissionDate).toLocaleDateString()
                                                        : "Date not available"}
                                                </div>
                                            </div>
                                            {treatment.isEncrypted && (
                                                <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs">
                                                    Encrypted
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    
                        {/* Treatment details section - Only show if a treatment is decrypted */}
                        {currentTreatment && !currentTreatment.isEncrypted ? (
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-full mx-auto mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold">Treatment Record for NIC: {currentTreatment.patient_nic}</h3>
                                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        Added by: {currentTreatment.hospitalName || "Unknown Hospital"}
                                    </div>
                                </div>

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
                                                {currentTreatment.ho_admissionDetails?.admissionDate
                                                    ? new Date(currentTreatment.ho_admissionDetails.admissionDate).toLocaleDateString()
                                                    : "N/A"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {ensureArray(currentTreatment.ho_admissionDetails?.admittingPhysician).join(", ") || "N/A"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {ensureArray(currentTreatment.ho_admissionDetails?.primaryDiagnosis).join(", ") || "N/A"}
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
                                            <td className="px-4 py-2 border">
                                                {ensureArray(currentTreatment.medicalHistory?.allergies).join(", ") || "None"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {ensureArray(currentTreatment.medicalHistory?.illnesses).join(", ") || "None"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {ensureArray(currentTreatment.medicalHistory?.medications).join(", ") || "None"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {ensureArray(currentTreatment.medicalHistory?.surgeries).join(", ") || "None"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <ImagePreview 
                                                    images={currentTreatment.medicalHistory?.su_imaging} 
                                                    title="Surgery Report"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {ensureArray(currentTreatment.medicalHistory?.immunizations).join(", ") || "None"}
                                            </td>
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
                                            <td className="px-4 py-2 border">
                                                {ensureArray(currentTreatment.treatmentPlan?.medications).join(", ") || "None"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {ensureArray(currentTreatment.treatmentPlan?.labTests).join(", ") || "None"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <ImagePreview 
                                                    images={currentTreatment.treatmentPlan?.te_imaging} 
                                                    title="Lab Report"
                                                />
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {ensureArray(currentTreatment.treatmentPlan?.therapies).join(", ") || "None"}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => navigate(`/h-patientdetails/update/${nic}/${currentTreatment._id}`)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
                                    >
                                        Update Treatment
                                    </button>
                                    
                                    {/* Add Report Button */}
                                    <button
                                        onClick={() => generateReport(currentTreatment)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mt-4"
                                    >
                                        Generate Report
                                    </button>

                                    <button
                                        onClick={() => handleDelete(currentTreatment._id)} 
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-4"
                                    >
                                        Delete Treatment
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Show prompt if no treatment is selected yet, or if it's encrypted
                            <div className="bg-blue-50 p-6 rounded-lg shadow-lg text-center">
                                {treatments.length === 1 ? (
                                    <p className="text-gray-600 mb-4">This treatment record is encrypted. Please enter your password to decrypt it.</p>
                                ) : encryptedTreatmentId ? (
                                    <p className="text-gray-600 mb-4">This treatment record is encrypted. Please enter your password to decrypt it.</p>
                                ) : (
                                    <p className="text-gray-600 mb-4">Please select a treatment record to view its details.</p>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-gray-600 mb-4">No treatment records found that were added by your hospital for this patient.</p>
                        <button
                            onClick={() => navigate(`/h-patientdetails/ho-admission/${nic}`)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Add Treatment
                        </button>
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate(getHospitalPath())}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Back
                    </button>
                </div>
            </div>
            
            {/* Decrypt Modal */}
            <DecryptModal />
        </div>
    );
};

export default ViewTreatment;
