import mongoose from "mongoose";

const patientSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        nic: {
            type: Number,
            required: true,
        },
        blood: {
            type: String,
            required: true,
        },
        tele: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        }, 
    },
    {
        timestamps: true,
    }
);

export const Patient = mongoose.model('Patients', patientSchema);