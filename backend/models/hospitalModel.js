import mongoose from "mongoose";


const Schema = mongoose.Schema;

const patient_hSchema = new Schema({
    ho_patientInfo: {
        fullName: String,
        dateOfBirth: String,
        nic: String,
        medicalRecordNumber: String,
        paAddress: String,
        emergencyContact: String,
    },
    ho_admissionDetails: {
        admissionDate: String,
        admittingPhysician: String,
        primaryDiagnosis: String,
    },
    medicalHistory: {
        pastConditions: [String],
        allergies: [String],
        medications: [String],
        surgicalHistory: [String],
    },
    treatmentPlan: {
        medications: [{ name: String, dosage: String, route: String, frequency: String }],
        labTests: [String],
        imaging: [String],
        therapies: [String],
    },
    progressNotes: [{
        date: String,
        clinician: String,
        condition: String,
        vitalSigns: { temp: String, bp: String, hr: String, rr: String },
        changes: String,
        modifications: String,
        followUp: String
    }],
    procedures: [{
        date: String,
        name: String,
        physician: String,
        complications: String
    }],
    discharge: {
        date: String,
        physician: String,
        finalDiagnosis: String,
        instructions: String,
        followUpAppointments: [String]
    }
});

export const Hospital_Patient = mongoose.model("Hospital_Patient", patient_hSchema);


