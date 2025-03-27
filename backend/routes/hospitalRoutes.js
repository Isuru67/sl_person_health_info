import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import { Hospital } from '../models/Hospitals.js';

dotenv.config();
const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Improved ID generator with "H" prefix
async function generateHospitalId() {
  try {
    const lastHospital = await Hospital.findOne().sort({ _id: -1 });
    
    if (!lastHospital) return 'H0001'; // First hospital
    
    const lastId = lastHospital.hospitalId;
    const lastNum = parseInt(lastId.substring(1));
    const nextNum = lastNum + 1;
    
    return `H${nextNum.toString().padStart(4, '0')}`;
  } catch (error) {
    console.error('ID Generation Error:', error);
    // Fallback: Generate random H-prefixed ID
    return `H${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

// Registration Endpoint
router.post('/hospital/register', upload.single('image'), async (req, res) => {
  const { hospitalName, email, mobile1, mobile2, password } = req.body;
  const imageName = req.file?.filename || null;

  try {
    // Validate required fields
    if (!hospitalName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Hospital name, email and password are required' 
      });
    }

    // Check for existing hospital
    if (await Hospital.findOne({ email })) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }

    // Create new hospital
    const newHospital = new Hospital({
      hospitalId: await generateHospitalId(),
      hospitalName,
      email,
      mobile1,
      mobile2,
      password: await bcrypt.hash(password, 10),
      certificateImage: imageName,
      status: 'pending'
    });

    await newHospital.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newHospital._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      hospitalId: newHospital.hospitalId,
      token,
      message: 'Registration successful - pending approval'
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});
// Get all hospitals
// Get all hospitals with selected fields
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find({}, 'hospitalId hospitalName email mobile1 mobile2 status');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



router.get("/:hospitalId", async (request, response) => {
  try {
    const hospitalId = request.params.hospitalId;
    const hospital = await Hospital.findOne({ hospitalId });

    if (!hospital) {
      return response.status(404).json({ error: "hospital not found" });
    }

    return response.status(200).json(hospital);
  } catch (error) {
    console.error("Error while fetching hospital by ID:", error);
    return response.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

router.put("/:hospitalId", async (request, response) => {
  try {
    const { hospitalId } = request.params;
    const { status } = request.body;

    // Ensure status is a valid value
    if (!["pending", "approved", "rejected"].includes(status)) {
      return response.status(400).json({ error: "Invalid status value" });
    }

    // Find and update the hospital's status
    const updatedHospital = await Hospital.findOneAndUpdate(
      { hospitalId },
      { status }, // Only update the status field
      { new: true } // Return the updated document
    );

    if (!updatedHospital) {
      return response.status(404).json({ error: "Hospital not found" });
    }

    return response.status(200).json(updatedHospital);
  } catch (error) {
    console.error("Error updating hospital status:", error);
    return response.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});




router.get('/hospital/certificate/:id', async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital || !hospital.certificateImage) {
    return res.status(404).json({ error: "Image not found" });
  }

  // Reconstruct full path (if needed)
  const imagePath = path.join(__dirname, '../uploads', hospital.certificateImage);
  res.sendFile(imagePath);
});

router.delete("/:hospitalId", async (request, response) => {
  try {
    const { hospitalId } = request.params;

    // Check if hospital exists
    const hospital = await Hospital.findOne({ hospitalId });
    if (!hospital) {
      return response.status(404).json({ error: "Hospital not found" });
    }

    // Delete the hospital using hospitalId
    await Hospital.findOneAndDelete({ hospitalId });
    return response.status(200).json({ message: "Hospital deleted successfully" });
  } catch (error) {
    console.error("Error while deleting hospital:", error);
    return response.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;