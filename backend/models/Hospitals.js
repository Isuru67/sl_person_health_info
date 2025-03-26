import mongoose from "mongoose";

const hospitalSchema = mongoose.Schema(
    {
        hospitalName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        mobile1: {
            type: Date,
            required: true,
        },
        mobile2: {
            type: String
        },
        password: {
            type: String,
            required: true,
        },
        certificateImage: {
            type: String,
            required: true,
        },
        
    },
    {
        timestamps: true,
    }
);

export const Hospital = mongoose.model('hospital', hospitalSchema);