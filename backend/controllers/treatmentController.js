import { Patient } from "../models/patientModel.js";

// Add Treatment
export const addTreatment = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        patient.treatments = patient.treatments || [];
        patient.treatments.push(req.body);
        await patient.save();

        res.json({ message: "Treatment added", treatments: patient.treatments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Treatment
export const updateTreatment = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        const treatment = patient.treatments.id(req.params.treatmentId);
        if (!treatment) return res.status(404).json({ message: "Treatment not found" });

        Object.assign(treatment, req.body);
        await patient.save();

        res.json({ message: "Treatment updated", treatments: patient.treatments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Treatment
export const deleteTreatment = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        patient.treatments = patient.treatments.filter(t => t._id.toString() !== req.params.treatmentId);
        await patient.save();

        res.json({ message: "Treatment deleted", treatments: patient.treatments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
