import express, { request, response } from "express";
import { addTreatment } from "../controllers/treatmentController.js";
import { Patient } from "../models/patientModel.js";
import { Treatment } from "../models/hospitalModel.js";


const router = express.Router();

router.post('/treatment/:nic',addTreatment, async (request, response) => {
    const { nic } = request.params;
    const { ho_admissionDetails, medicalHistory, treatmentPlan  } = request.body;

    try {
        // Check if the patient exists by NIC
        const patient = await Patient.findOne({ nic });
        if (!patient) {
            return response.status(404).json({ error: 'Patient not found with this NIC' });
        }

        //Create a new treatment using the Treatment model (assuming you are using Treatment model here)
        const newTreatment = new Treatment({
            patient_nic: nic,  // Link the treatment to the patient's ID
            ho_admissionDetails,
            medicalHistory,
            treatmentPlan,
        });

        await newTreatment.save();  // Save the new treatment to the database

        return res.status(201).json({ message: 'Treatment added successfully', treatment: newTreatment });
    } catch (error) {
        console.error('Error while adding treatment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/treatment/:nic', async (req, res) => {
    try {
        const treatments = await Treatment.find({ patient_nic: req.params.nic });
        if (treatments.length === 0) {
            return res.status(404).json({ error: "Treatment not found" });
        }
        res.json(treatments);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.put('/treatment/:nic/:treatmentId', async (req, res) => {
    const { nic, treatmentId } = req.params;
    console.log("Received NIC:", nic, "Received Treatment ID:", treatmentId);

    try {
        // Find patient by NIC
        const patient = await Patient.findOne({ patient_nic: nic });
        if (!patient) {
            console.log("❌ Patient not found.");
            return res.status(404).json({ message: "Patient not found" });
        }

        // Find treatment within the patient
        const treatment = patient.treatments.id(treatmentId);
        if (!treatment) {
            console.log("❌ Treatment not found.");
            return res.status(404).json({ message: "Treatment not found" });
        }

        // Update treatment details
        Object.assign(treatment, req.body);
        await patient.save();

        res.status(200).json({ message: "Treatment updated successfully", treatment });
    } catch (error) {
        console.error("❌ Error updating treatment:", error);
        res.status(500).json({ message: "Server error", error: error.message });
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


export default router;
