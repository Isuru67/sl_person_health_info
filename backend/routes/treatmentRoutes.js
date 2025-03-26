import express from "express";
import { addTreatment, updateTreatment, deleteTreatment } from "../controllers/treatmentController.js";
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
router.put("/:patientId/treatment/:treatmentId", updateTreatment); // Update treatment
router.delete("/:patientId/treatment/:treatmentId", deleteTreatment); // Delete treatment

export default router;
