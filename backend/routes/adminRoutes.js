import express from "express";
import { Admin } from "../models/adminModel.js";

const router = express.Router();


router.get('/', async (request,response) =>{

    try{
      const admins = await Admin.find({});
      return response.status(200).json(admins)
    
    }catch (error){
    
        console.log(error.message);
        response.status(500).send( {message: error.message});
    }
    
    
    });
    
router.get('/:id', async (request,response)=>{
    
    try{
    
        const {id} = request.params;
    
     const admin = await Admin.findById(id);
    
     return response.status(200).json(admin);
    
    }catch(error){
    
        console.log(error.message);
        response.status(500).send( {message: error.message});
    
    }
    
    });


export default router;