import express from "express";
import { Patient } from "../models/patientModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from 'multer';
import { getPatientByNIC } from "../controllers/patientController.js";

dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: (request, file, cb) => cb(null, 'uploads/'),
  filename: (request, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });
// Patient Registration Route

router.post('/register', upload.single('pic'), async (req, response) => {
  const { name, nic, dob, blood, tele, email, username, password } = req.body;
  const imageName = req.file?.filename || null;

  try {
    // Check if patient already exists by NIC
    const existingPatient = await Patient.findOne({ nic });
    if (existingPatient) {
      return response.status(400).json({ error: "User already exists with this NIC" });
    }


    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new patient
    const newPatient = new Patient({
      name,
      nic,
      dob,
      blood,
      tele,
      email,
      username,
      password: hashedPassword,
      pic:imageName
    });

    await newPatient.save();

    // Generate JWT token
    const token = jwt.sign({ id: newPatient._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return response.status(201).json({
      message: "Patient registered successfully",
      token,
      patient: newPatient,
    });
  } catch (error) {
    console.error("Error during patient registration:", error);
    return response.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Get All Patients Route
router.get("/", async (request, response) => {
  try {
    const patients = await Patient.find({});
    return response.status(200).json({
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error("Error while fetching patients:", error);
    return response.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Get Patient by ID Route
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const patient = await Patient.findById(id);

    if (!patient) {
      return response.status(404).json({ error: "Patient not found" });
    }

    return response.status(200).json(patient);
  } catch (error) {
    console.error("Error while fetching patient by ID:", error);
    return response.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Update Patient Route
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    // Check if patient exists
    const patient = await Patient.findById(id);
    if (!patient) {
      return response.status(404).json({ error: "Patient not found" });
    }

    const { name, nic, tele, email, password } = request.body;

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      request.body.password = await bcrypt.hash(password, salt);
    }

    const updatedPatient = await Patient.findByIdAndUpdate(id, request.body, { new: true });

    return response.status(200).json({
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Error while updating patient:", error);
    return response.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Delete Patient Route
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    // Check if patient exists
    const patient = await Patient.findById(id);
    if (!patient) {
      return response.status(404).json({ error: "Patient not found" });
    }

    await Patient.findByIdAndDelete(id);
    return response.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error while deleting patient:", error);
    return response.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

router.get('/search/:nic', async (request,response)=>{
    
    try{
    
        const nic = request.params.nic;
    
     const patient = await Patient.findOne({ nic });
    
     return response.status(200).json(patient);
    
    }catch(error){
    
        console.log(error.message);
        response.status(500).send( {message: error.message});
    
    }
    
});


export default router;
