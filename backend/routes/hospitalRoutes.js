import express from "express";
import {Treatment} from "../models/hospitalModel.js"

const router = express.Router();

//**Add a New Patient**
router.post("/pregister", async (req, res) => {
    try {
        const newH_Patient = new Hospital_Patient(req.body);
        await newH_Patient.save();
        res.status(201).json(newH_Patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// router.post('/a', async (request, response) => {
//     try {
//         // Log the incoming request body to check the data being sent
//         console.log("Request Body:", request.body);

//         // Constructing the new manager object
//         const newManager = {
//             name: request.body.name,  // Match the schema field 'name'
//             uname: request.body.uname, // Match the schema field 'uname'
//         };
        
//         // Log the new manager object to check its structure before saving
//         console.log("New Manager Object:", newManager);

//         // Save the manager to the database
//         const manager = await Hospital.create(newManager);

//         // Log the result of the database operation
//         console.log("Manager Created:", manager);

//         // Respond with the created manager data
//         return response.status(201).send(manager);
//     } catch (error) {
//         // Log any error that occurs
//         console.log("Error:", error.message);

//         // Send the error response
//         response.status(500).send({ message: error.message });
//     }
//});  




export default router;
