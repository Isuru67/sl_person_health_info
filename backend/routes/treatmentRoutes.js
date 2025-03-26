import express, { request, response } from "express";
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
router.get('/treatment/:nic', async (req, res) => {
    try {
        const treatment = await Treatment.findOne({ patient_nic: req.params.nic });
        if (!treatment) {
            return res.status(404).json({ error: "Treatment not found" });
        }
        res.json(treatment);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/treatment/:nic", async (req, res) => {
    const { nic } = req.params;
    const treatment = await TreatmentModel.findOne({ Patient_nic: nic });

    if (!treatment) {
        return res.status(404).json({ error: "Treatment not found for NIC: " + nic });
    }

    res.json(treatment);
});

<<<<<<< Updated upstream
router.delete("/:patientId/treatment/:treatmentId", deleteTreatment); // Delete treatment
=======
router.put("/treatment/:nic", async (req, res) => {
    try {
        const updatedTreatment = await Treatment.findOneAndUpdate(
            { patient_nic: req.params.nic },
            req.body,
            { new: true }
        );

        if (!updatedTreatment) {
            return res.status(404).json({ message: "Treatment not found" });
        }

        res.json(updatedTreatment);
    } catch (error) {
        console.error("Error updating treatment:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete treatment by NIC
router.delete("/api/treatment/:nic", async (req, res) => {
    try {
        const { nic } = req.params;
        const deletedTreatment = await Treatment.findOneAndDelete({ patient_nic: nic });

        if (!deletedTreatment) {
            return res.status(404).json({ message: "Treatment not found" });
        }

        res.json({ message: "Treatment deleted successfully" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


>>>>>>> Stashed changes

export default router;
