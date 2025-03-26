import mongoose from "mongoose";


const Schema = mongoose.Schema;

const patient_hSchema = new Schema({
    ho_admissionDetails: {
        admissionDate: [String],
        admittingPhysician: [String],
        primaryDiagnosis: [String],
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
        medications: [ String ],
        labTests: [String],
        te_imaging: [String],
        therapies: [String],
    },

    patient_nic: {  // Store the patient's NIC directly here
        type: String,   // NIC will be stored as a String
        required: true, // Ensure NIC is required
    },
  
  
});

export const Treatment = mongoose.model("Treatment", patient_hSchema);


