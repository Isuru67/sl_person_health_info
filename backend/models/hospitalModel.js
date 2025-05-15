import mongoose from "mongoose";

const Schema = mongoose.Schema;

const patient_hSchema = new Schema({
    // Basic fields that aren't sensitive (not encrypted)
    patient_nic: {
        type: String,
        required: true,
    },
    hospitalId: {
        type: String,
        required: true,
    },
    hospitalName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    
    // Encrypted data package
    encryptedData: {
        encryptedData: {
            type: String,
            required: true
        },
        iv: {
            type: String,
            required: true
        }
    },
    
    // Hospital access package
    hospitalAccess: {
        encryptedKey: {
            type: String,
            required: true
        },
        iv: {
            type: String,
            required: true
        }
    },
    
    // Patient access package
    patientAccess: {
        encryptedKey: {
            type: String,
            required: true
        },
        iv: {
            type: String,
            required: true
        }
    },
    
    // Non-sensitive metadata (can be used for filtering without decryption)
    metadata: {
        admissionDate: Date,
        updatedDate: Date,
        recordType: String,
        hasSurgeryImages: Boolean,
        hasLabResults: Boolean
    }
});

// Add pre-save middleware to update the updatedAt field
patient_hSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    if (this.isModified('encryptedData')) {
        this.metadata.updatedDate = new Date();
    }
    next();
});

export const Treatment = mongoose.model("Treatment", patient_hSchema);


