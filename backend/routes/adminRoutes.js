import express from "express";
import { Admin } from "../models/adminModel.js";
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();


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


router.post('/register', async (request, response) => {
        const { role, username, password } = request.body;
      
        try {
          //const existingAdmin = await Admin.findOne({ username });
          //if (existingAdmin) return response.status(400).json({ message: 'Username already exists' });
          console.log('Received Data:', request.body);
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          
          const newAdmin = new Admin({ role,username, password: hashedPassword });
          await newAdmin.save();
        
      
          
          const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          response.status(201).json({ token });
        } catch (error) {
            response.status(500).json({ error: 'Server error' });
        }
      });

router.post('/login', async (request,response)=>{

    const { role, username, password } = request.body;

    try {
      // get user data from database
      const user = await Admin.findOne({ username });
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return response.status(401).json({ message: 'Invalid username or password' });
      }
      
      if (user.role !== role) {
        return response.status(403).json({ message: 'Unauthorized role' });
    }
      // genarate jwt token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // reply using token
      response.status(200).json({ token });
    } catch (error) {
      response.status(500).json({ message: 'Server error' });
    }





});


export default router;