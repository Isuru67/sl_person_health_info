import mongoose from "mongoose";


const Schema = mongoose.Schema;

const patient_hSchema = new Schema({
    ho_admissionDetails: {
        admissionDate: String,
        admittingPhysician: String,
        primaryDiagnosis: String,
    },
    medicalHistory: {
        allergies: [String],
        illnesses: [String],
        medications: [String],
        surgeries: [String],
        su_imaging: [String],
        immunizations:[String],
    },
    treatmentPlan: {
        medications: [{ name: String, dosage: String, route: String, frequency: String }],
        labTests: [String],
        te_imaging: [String],
        therapies: [String],
    }
  
  
});

export const Treatment = mongoose.model("Treatment", patient_hSchema);


