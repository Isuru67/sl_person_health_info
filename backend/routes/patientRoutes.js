import express, { request, response } from "express";
import { Patient } from '../models/patientModel.js';

const router = express.Router();

//Route for save a new patient
router.post('/create', async (request, response) => {
    try {
        console.log("Incoming Request Body:", request.body);

        if (
            !request.body.name ||
            !request.body.nic ||
            !request.body.blood ||
            !request.body.tele ||
            !request.body.email ||
            !request.body.username ||
            !request.body.password
        ) {
            console.log(" Missing Fields in Request");
            return response.status(400).send({
                message: 'Send all required fields: name, nic, blood, tele, email, username, password',
            });
        }

        console.log(" All Required Fields Present");

        const newPatient = {
            name: request.body.name,
            nic: request.body.nic,
            blood: request.body.blood,
            tele: request.body.tele,
            email: request.body.email,
            username: request.body.username,
            password: request.body.password,
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
                !request.body.password 
            ) {
                return response.status(400).send({
                    message: 'Send all required fields: name, nic, dob, blood, tele, email, username, password',
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