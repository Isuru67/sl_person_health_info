import express from "express";
import { Patient } from "../models/patientModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getPatientByNIC } from "../controllers/patientController.js";

dotenv.config();

const router = express.Router();

// Validation functions
const validateName = (name) => {
  if (!name) return "Name is required";
  if (!/^[A-Za-z\s]+$/.test(name)) return "Name must contain only letters and spaces";
  return null;
};

const validateNIC = (nic) => {
  if (!nic) return "NIC is required";
  if (!/^\d+$/.test(nic)) return "NIC must contain only numbers";
  return null;
};

const validateTelephone = (tele) => {
  if (!tele) return "Telephone is required";
  if (!/^\d{10}$/.test(tele)) return "Telephone must be exactly 10 digits";
  return null;
};

const validateEmail = (email) => {
  if (!email) return "Email is required";
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) return "Email must be a valid Gmail address (e.g., user@gmail.com)";
  return null;
};

const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (!/^[a-zA-Z0-9]{8,10}$/.test(password)) return "Password must be 8-10 alphanumeric characters";
  return null;
};

// Patient Registration Route
router.post("/register", async (request, response) => {
  const { name, nic, dob, blood, tele, email, username, password, pic } = request.body;

  try {
    // Check if patient already exists by NIC
    const existingPatient = await Patient.findOne({ nic });
    if (existingPatient) {
      return response.status(400).json({ error: "User already exists with this NIC" });
    }

    // Validate input
    const errors = [
      validateName(name),
      validateNIC(nic),
      validateTelephone(tele),
      validateEmail(email),
      validatePassword(password),
    ].filter(Boolean);

    if (errors.length > 0) {
      return response.status(400).json({ error: "Validation failed", details: errors });
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
      pic,
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

    // Validate updated data
    const errors = [
      name && validateName(name),
      nic && validateNIC(nic),
      tele && validateTelephone(tele),
      email && validateEmail(email),
      password && validatePassword(password),
    ].filter(Boolean);

    if (errors.length > 0) {
      return response.status(400).json({ error: "Validation failed", details: errors });
    }

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
