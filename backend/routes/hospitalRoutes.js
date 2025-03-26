import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { Hospital } from '../models/Hospitals.js';

dotenv.config();
const router = express.Router();

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Generate Hospital ID (Auto-incrementing)
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
    return `H${Math.floor(1000 + Math.random() * 9000)}`; // Fallback ID
  }
}

// Hospital Registration Route
router.post('/hospital/register', upload.single('image'), async (req, res) => {
  const { hospitalName, email, mobile1, mobile2, password } = req.body;
  const imageName = req.file?.filename || null;

  try {
    // Validate required fields
    if (!hospitalName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Hospital name, email, and password are required' });
    }

    // Check for existing hospital
    if (await Hospital.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
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

    // Generate JWT Token
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
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// Get All Hospitals with Selected Fields
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find({}, 'hospitalId hospitalName email mobile1 mobile2 status');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get Hospital by ID
router.get('/hospital/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.status(200).json(hospital);
  } catch (error) {
    console.error('Error while fetching hospital by ID:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Get Hospital Certificate Image by ID
router.get('/hospital/certificate/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital || !hospital.certificateImage) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imagePath = path.resolve('uploads', hospital.certificateImage);
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error fetching hospital certificate:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Delete Hospital by ID
router.delete('/hospital/:id', async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    console.error('Error deleting hospital:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

export default router;
