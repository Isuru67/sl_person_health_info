import express, { request, response } from "express";
import {PORT,mongoDBURL} from "./config.js";
import mongoose from "mongoose";
import { Admin } from "./models/adminModel.js";
import { Patient } from "./models/patientModel.js";
import adminRoutes from "./routes/adminRoutes.js";
import patientRoutes from './routes/patientRoutes.js';
import cors from "cors";

//defines an instance of the Express framework and assigns it to the variable
const app = express();

//Middleware for parsing request body
app.use(express.json());

//Middleware for handling CORS policy
//Option 1: Allow all origins with default of cors(*)
app.use(cors());


app.get('/',(request,response)=>{
    console.log(request);
    return response.status(234).send('Welcome to mern stack')
    });

app.use('/admin', adminRoutes);
app.use('/patient', patientRoutes);

mongoose
.connect(mongoDBURL)
.then(()=>{
  console.log('app connected to database');
  app.listen(PORT, () => {
    console.log(`App is listning to port: ${PORT}`);
    }); 
})
.catch((error)=>{
    console.log(error);
});



