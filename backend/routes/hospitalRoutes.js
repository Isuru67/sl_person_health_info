import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import {Hospital} from '../models/Hospitals.js';

dotenv.config();
const router = express.Router();

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Store uploaded files in the "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Rename file with timestamp
  }
});

const upload = multer({ storage });

// Hospital registration route (supports file upload)
router.post('/hospital/register', upload.single('image'), async (req, res) => {
  const { hospitalName, email, mobile1, mobile2, password } = req.body;
  const imageName = req.file ? req.file.filename : null;

  try {
    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).json({ message: 'Hospital already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new hospital
    const newHospital = new Hospital({
      hospitalName,
      email,
      mobile1,
      mobile2,
      password: hashedPassword,
      certificateImage: imageName, // Store file path in DB
    });

    // Save to database
    await newHospital.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newHospital._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, message: "Hospital registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
