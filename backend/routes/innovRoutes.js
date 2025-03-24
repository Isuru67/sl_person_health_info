import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();

const router = express.Router();
const STRAICO_KEY = process.env.STRAICO_KEY; // Make sure the env variable name matches

router.post('/analyze', async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        const { prompt } = req.body; // Extract prompt from the frontend request

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        


        const response = await axios.post(
            'https://api.straico.com/v1/prompt/completion',
            {
                models: ["openai/gpt-3.5-turbo-0125"], // Corrected to match Postman
                message: prompt, // Corrected to match Postman
            },
            {
                headers: {
                    'Authorization': `Bearer ${STRAICO_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("DeepSeek API response:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error analyzing health data:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error processing data' });
    }
});

export default router;
