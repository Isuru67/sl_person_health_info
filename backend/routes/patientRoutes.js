import express, { request, response } from "express";
import { Patient } from '../models/patientModel.js';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

router.post('/register', async (request, response) => {
        const { name, nic, dob,blood, tele,email, username, password, pic } = request.body;
      
        try {
          const existingPatient = await Patient.findOne({ nic });
          if (existingPatient) return response.status(400).json({ message: 'User already exists' });
          
          const salt = await bcrypt.genSalt(10);
          const hashedName = await bcrypt.hash(name, salt);
          const hashedBloodGroup = await bcrypt.hash(blood, salt);
          const hashedTelephone = await bcrypt.hash(tele, salt);
          const hashedEmail = await bcrypt.hash(email, salt);
          const hashedUsername = await bcrypt.hash(username, salt);
          const hashedPassword = await bcrypt.hash(password, salt);

          
          const newPatient = new Patient({ name: hashedName, nic, dob: hashedDob, blood: hashedBloodGroup, tele: hashedTelephone,email: hashedEmail, username: hashedUsername, password: hashedPassword, pic});
          await newPatient.save();
        
          const token = jwt.sign({ id: newPatient._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          response.status(201).json({ token });
        } catch (error) {
            response.status(500).json({ error: 'Server error' });
        }
      });

//Route for save a new patient
router.post('/create', async (request, response) => {
    try {
        console.log("Incoming Request Body:", request.body);

        if (
            !request.body.name ||
            !request.body.nic ||
            !request.body.dob ||
            !request.body.blood ||
            !request.body.tele ||
            !request.body.email ||
            !request.body.username ||
            !request.body.password ||
            !request.body.pic
        ) {
            console.log(" Missing Fields in Request");
            return response.status(400).send({
                message: 'Send all required fields: name, nic, dob, blood, tele, email, username, password, pic',
            });
        }

        console.log(" All Required Fields Present");

        const newPatient = {
            name: request.body.name,
            nic: request.body.nic,
            dob: request.body.dob,
            blood: request.body.blood,
            tele: request.body.tele,
            email: request.body.email,
            username: request.body.username,
            password: request.body.password,
            pic: request.body.pic,
        };

        console.log(" Creating New Patient:", newPatient);

        const patient = await Patient.create(newPatient);

        console.log(" Patient Created Successfully:", patient);

        return response.status(201).send(patient);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for get all patient with database
router.get('/', async (request,response) => {

    try{
        const patient = await Patient.find({});
        return response.status(200).json({
            count: patient.length,
            data: patient
    });

    }catch (error) {

        console.log(error.message);
        response.status(500).send( {message: error.message});
    }

});

//Route for get one patient by id with database
router.get('/:id', async (request,response)=>{
    
    try{
    
        const {id} = request.params;
    
     const patient = await Patient.findById(id);
    
     return response.status(200).json(patient);
    
    }catch(error){
    
        console.log(error.message);
        response.status(500).send( {message: error.message});
    
    }
    
});

//Route for update a patient
router.put('/patient', async (request, response) => {
        try {
            if (
                !request.body.name ||
                !request.body.nic ||
                !request.body.dob ||
                !request.body.blood ||
                !request.body.tele ||
                !request.body.email ||
                !request.body.username ||
                !request.body.password ||
                !request.body.pic
            ) {
                return response.status(400).send({
                    message: 'Send all required fields: name, nic, dob, blood, tele, email, username, password, pic',
                });
            }

            const { id } = request.params;

            const result = await Patient.findByIdAndUpdate(id, request.body);

            if (!result) {
                return response.status(404).json({ message: 'Patient not found' });
            }
    
        return response.status(200).send({ message: 'Patient updated successfully '});

        }catch (error) {
            console.log(error.message);
            response.status(500).send({message: error.message});
        }
});

//Route for delete a patient
router.delete('/patient/:id', async (request, response) => {
        try {
            const { id } = request.params;

            const result = await Patient.findByIdAndDelete(id);

            if (!result) {
                return response.status(404).json({ message: 'Patient not found' });
            }
    
        return response.status(200).send({ message: 'Patient deleted successfully '});

        }catch (error) {
            console.log(error.message);
            response.status(500).send({message: error.message});
        }
});

export default router;