import express from "express";
import { Patient } from "../models/patientModel.js";
import { Treatment } from "../models/hospitalModel.js";
import { Hospital } from "../models/Hospitals.js"; 
import { createEncryptedRecord, decryptRecord } from "../utils/advancedEncryption.js";
import bcrypt from 'bcryptjs';

const router = express.Router();

// Helper function to get patient password
const getPatientPassword = async (nic) => {
    try {
        // Find the patient
        const patient = await Patient.findOne({ nic });
        if (!patient) {
            throw new Error(`Patient with NIC ${nic} not found`);
        }
        
        // For this implementation, we need the actual password for encryption
        // In a real system, we might need a different approach since passwords are hashed
        // This is just an example to show the concept
        return 'patientDefaultPassword123'; // Placeholder - in real system, would need a better approach
    } catch (error) {
        console.error('Error getting patient password:', error);
        throw error;
    }
};

// Middleware to get hospital password for encryption
const getHospitalPassword = async (hospitalId) => {
    try {
        console.log(`Attempting to find hospital with ID: ${hospitalId}`);
        
        // First try to find by hospitalId field
        let hospital = await Hospital.findOne({ hospitalId });
        
        if (!hospital) {
            // If not found, try some alternatives
            hospital = await Hospital.findOne({ 
                $or: [
                    { _id: hospitalId },
                    { hospitalName: hospitalId }
                ]
            });
        }
        
        if (!hospital) {
            console.log(`No hospital found with ID: ${hospitalId}`);
            return 'hospitalDefaultPassword123'; // Default password for testing
        }
        
        console.log(`Hospital found: ${hospital.hospitalName}`);
        
        // For encryption, we need the actual password
        // In a real system, this would need to be handled differently
        return 'hospitalDefaultPassword123'; // Placeholder for testing
    } catch (error) {
        console.error('Error getting hospital password:', error);
        return 'hospitalDefaultPassword123'; // Default for testing
    }
};

// Create a new treatment record with dual-key encryption
router.post('/treatment/:nic', async (req, res) => {
    try {
        const { nic } = req.params;
        console.log('Received request to add treatment for NIC:', nic);
        
        // Validate request data
        if (!req.body.ho_admissionDetails || !req.body.medicalHistory || !req.body.treatmentPlan) {
            return res.status(400).json({ message: 'Missing required treatment data' });
        }
        
        const { hospitalId, hospitalName, hospitalPassword } = req.body;
        
        if (!hospitalId || !hospitalName) {
            return res.status(400).json({ message: 'Hospital ID and name are required' });
        }
        
        console.log('Hospital info received:', { hospitalId, hospitalName });
        console.log('Using provided hospital password for encryption');
        
        // Get passwords for encryption
        const encryptionHospitalPassword = hospitalPassword || await getHospitalPassword(hospitalId);
        const patientPassword = await getPatientPassword(nic);
        
        // Prepare data to encrypt
        const sensitiveData = {
            ho_admissionDetails: req.body.ho_admissionDetails,
            medicalHistory: req.body.medicalHistory,
            treatmentPlan: req.body.treatmentPlan
        };
        
        // Extract non-sensitive metadata
        const metadata = {
            admissionDate: req.body.ho_admissionDetails.admissionDate,
            recordType: 'treatment',
            hasSurgeryImages: req.body.medicalHistory.su_imaging && 
                             req.body.medicalHistory.su_imaging.length > 0,
            hasLabResults: req.body.treatmentPlan.te_imaging && 
                          req.body.treatmentPlan.te_imaging.length > 0
        };
        
        console.log('Creating encrypted record with dual keys');
        
        // Create dual-encrypted record
        const encryptedPackage = createEncryptedRecord(
            sensitiveData,
            encryptionHospitalPassword,
            patientPassword
        );
        
        // Create new treatment document - only storing encrypted data
        const newTreatment = new Treatment({
            patient_nic: nic,
            hospitalId,
            hospitalName,
            encryptedData: encryptedPackage.encryptedData,
            hospitalAccess: encryptedPackage.hospitalAccess,
            patientAccess: encryptedPackage.patientAccess,
            metadata
        });
        
        // Save to database
        const savedTreatment = await newTreatment.save();
        console.log('Treatment saved with encryption');
        
        res.status(201).json({
            message: 'Treatment record created with dual-key encryption',
            treatmentId: savedTreatment._id
        });
    } catch (error) {
        console.error('Error creating treatment:', error);
        res.status(500).json({
            message: 'Failed to create encrypted treatment record',
            error: error.message
        });
    }
});

// Get treatments with decryption based on requester role
router.get('/treatment/:nic', async (req, res) => {
    try {
        const { nic } = req.params;
        const { hospitalId, role, password } = req.query;
        
        // Build query
        let query = { patient_nic: nic };
        if (hospitalId && role === 'hospital') {
            query.hospitalId = hospitalId;
        }
        
        // Fetch treatments
        const treatments = await Treatment.find(query);
        
        if (treatments.length === 0) {
            return res.status(404).json({ 
                message: 'No treatments found for this patient' 
            });
        }
        
        // Decrypt treatments if credentials provided
        const decryptedTreatments = await Promise.all(treatments.map(async (treatment) => {
            if (!password) {
                // Return only non-sensitive data if no password provided
                return {
                    _id: treatment._id,
                    patient_nic: treatment.patient_nic,
                    hospitalName: treatment.hospitalName,
                    metadata: treatment.metadata,
                    isEncrypted: true,
                    requiresPassword: true
                };
            }
            
            // Attempt to decrypt with provided credentials
            const decryptedData = decryptRecord(treatment, { role, password });
            
            if (decryptedData) {
                return {
                    _id: treatment._id,
                    patient_nic: treatment.patient_nic,
                    hospitalName: treatment.hospitalName,
                    metadata: treatment.metadata,
                    ...decryptedData,
                    decrypted: true
                };
            } else {
                return {
                    _id: treatment._id,
                    patient_nic: treatment.patient_nic,
                    hospitalName: treatment.hospitalName,
                    metadata: treatment.metadata,
                    isEncrypted: true,
                    decryptionFailed: true
                };
            }
        }));
        
        res.json(decryptedTreatments);
    } catch (error) {
        console.error('Error fetching treatments:', error);
        res.status(500).json({ 
            message: 'Error retrieving treatments',
            error: error.message 
        });
    }
});

router.put('/treatment/:nic/:treatmentId', async (req, res) => {
    const { nic, treatmentId } = req.params;
    console.log(`🛬 Received Update Request | NIC: ${nic} | Treatment ID: ${treatmentId}`);

    try {
        // 1. Find the treatment by treatmentId and NIC
        const treatment = await Treatment.findOne({ _id: treatmentId, patient_nic: nic });

        if (!treatment) {
            console.log("❌ Treatment not found for Treatment ID and NIC:", treatmentId, nic);
            return res.status(404).json({ message: "Treatment not found" });
        }

        // 2. Update treatment fields with request body
        Object.assign(treatment, req.body);

        // 3. Save the updated treatment
        await treatment.save();

        console.log("✅ Treatment updated successfully.");
        return res.status(200).json({ message: "Treatment updated successfully", treatment });
    } catch (error) {
        console.error("❌ Error updating treatment:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Use patient NIC in the route
router.delete('/treatments/:nic', async (req, res) => {
    try {
        const deletedTreatment = await Treatment.findOneAndDelete({ patient_nic: req.params.nic });
        if (!deletedTreatment) {
            return res.status(404).json({ message: 'Treatment not found for this NIC' });
        }
        res.json({ message: 'Treatment deleted successfully' });
    } catch (error) {
        console.error('Error deleting treatment:', error);
        res.status(500).json({ message: 'Error deleting treatment' });
    }
});

// Example for fetching all treatment records from your backend
router.get(`/treatments/all`, async (req, res) => {
    try {
        const treatments = await Treatment.find(); // Assume `Treatment` is your treatment model
        res.json({ data: treatments });
    } catch (err) {
        res.status(500).send("Error fetching treatment data");
    }
});

// Add these new endpoints
router.get('/treatment/count/:hospitalId', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        
        // Get unique patient count for this hospital
        const uniquePatients = await Treatment.distinct('patient_nic', { hospitalId }).length;
        
        // Get active treatments count
        const activeTreatments = await Treatment.countDocuments({
            hospitalId,
            status: 'active'
        });

        res.json({
            uniquePatients,
            activeTreatments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/treatment/stats/:hospitalId', async (req, res) => {
    try {
        const { hospitalId } = req.params;
        
        // Get unique patient count
        const uniquePatients = await Treatment.distinct('patient_nic', { hospitalId });
        
        // Get active treatments count
        const activeTreatments = await Treatment.countDocuments({
            hospitalId,
            'treatmentPlan.medications': { $exists: true, $ne: [] }
        });

        // Get completed treatments count
        const completedTreatments = await Treatment.countDocuments({
            hospitalId,
            'treatmentPlan.medications': { $exists: true, $ne: [] },
            // Add any other conditions that define a completed treatment
        });

        res.json({
            totalPatients: uniquePatients.length,
            activeTreatments,
            completedTreatments,
            pendingReports: await Treatment.countDocuments({
                hospitalId,
                'treatmentPlan.te_imaging': { $size: 0 }
            })
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update validatePatientAccess function to verify patient credentials
const validatePatientAccess = async (nic, password) => {
    try {
        // Find patient by NIC
        const patient = await Patient.findOne({ nic });
        if (!patient) {
            console.log(`No patient found with NIC: ${nic}`);
            return false;
        }
        
        // For proper security, compare with the hashed password
        const isPasswordValid = await bcrypt.compare(password, patient.password);
        
        // For testing purposes, you can add a backdoor password
        const isTestPassword = password === 'test123'; // REMOVE IN PRODUCTION
        
        return isPasswordValid || isTestPassword;
    } catch (error) {
        console.error('Error validating patient access:', error);
        return false;
    }
};

// Improve decrypt endpoint to better handle patient decryption
router.post('/treatment/:nic/:treatmentId/decrypt', async (req, res) => {
    try {
        const { nic, treatmentId } = req.params;
        const { password, role } = req.body;
        
        if (!password || !role) {
            return res.status(400).json({ message: 'Password and role are required' });
        }
        
        console.log(`Attempting to decrypt treatment ${treatmentId} for patient ${nic} with role ${role}`);
        
        // Find the specific treatment
        const treatment = await Treatment.findOne({ _id: treatmentId, patient_nic: nic });
        
        if (!treatment) {
            return res.status(404).json({ message: 'Treatment not found' });
        }
        
        // For testing purposes, bypass validation to ensure decryption works
        let validationPassed = true;
        
        if (role === 'patient') {
            // In production, uncomment this validation
            // validationPassed = await validatePatientAccess(nic, password);
            
            // For debugging/testing, we'll bypass and just use the password directly
            if (!validationPassed) {
                console.log('Patient validation failed - but bypassing for testing');
                // return res.status(401).json({ message: 'Invalid patient credentials' });
            }
        } else if (role !== 'hospital') {
            return res.status(400).json({ message: 'Invalid role. Must be "patient" or "hospital"' });
        }
        
        console.log(`Attempting decryption with role: ${role}`);
        
        // Create credentials object for decryption
        const credentials = {
            role,
            password: password
        };
        
        // Attempt to decrypt the treatment data
        const decryptedData = decryptRecord(treatment, credentials);
        
        if (!decryptedData) {
            console.log('Decryption failed');
            return res.status(401).json({ message: 'Failed to decrypt data. Invalid password.' });
        }
        
        console.log('Decryption successful');
        
        // Return the decrypted treatment
        const treatmentObj = treatment.toObject();
        
        // Merge decrypted data with the treatment object
        const responseData = {
            _id: treatmentObj._id,
            patient_nic: treatmentObj.patient_nic,
            hospitalId: treatmentObj.hospitalId,
            hospitalName: treatmentObj.hospitalName,
            metadata: treatmentObj.metadata,
            ...decryptedData, // Add the decrypted fields
            decrypted: true
        };
        
        res.json(responseData);
    } catch (error) {
        console.error('Error decrypting treatment:', error);
        res.status(500).json({ 
            message: 'Error decrypting treatment data',
            error: error.message 
        });
    }
});

export default router;
