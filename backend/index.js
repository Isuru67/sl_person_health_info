import express, { request } from "express";
import {PORT,mongoDBURL} from "./config.js";
import mongoose from "mongoose";
//import { Admin } from "./models/adminModel.js";
import adminRoutes from "./routes/adminRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js"
import cors from "cors";

//defines an instance of the Express framework and assigns it to the variable

const app = express();

app.use(express.json());

app.use(cors());


app.get('/',(request,response)=>{

    console.log(request);
    return response.status(234).send('Welcome to mern stack')
    
    });



app.use('/admin', adminRoutes);
app.use('/Hospital_Patient', hospitalRoutes);


mongoose.connect(mongoDBURL)
.then(()=>{
  
console.log('app connected to database');

app.listen(PORT, () => {

    console.log(`App is listning to port: ${PORT}`);
    
    });

})
.catch((error)=>{

console.log(error);

});



