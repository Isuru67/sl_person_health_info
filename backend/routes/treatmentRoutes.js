import express from "express";
import { addTreatment, updateTreatment, deleteTreatment } from "../controllers/treatmentController.js";

const router = express.Router();

router.post("/:patientId/treatment", addTreatment); // Add treatment
router.put("/:patientId/treatment/:treatmentId", updateTreatment); // Update treatment
router.delete("/:patientId/treatment/:treatmentId", deleteTreatment); // Delete treatment

export default router;
