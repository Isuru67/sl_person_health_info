import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();

const router = express.Router();
const STRAICO_KEY = process.env.STRAICO_KEY; // Make sure the env variable name matches

router.post('/analyze', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        // Structure the prompt for better analysis
        const structuredPrompt = `
            Based on the following information:
            ${prompt}
            
            Please provide a structured analysis in the following format:

            1. Primary Disease:
            - Identify and explain the main disease or condition
            - List all possible/existing symptoms associated with this primary disease
            
            2. Current Conditions:
            - List and briefly explain any current health conditions identified
            
            3. Future Risk Assessment:
            For each condition, use exactly this format:
            [Condition Name] - XX% (where XX is a number between 0-100)
            Description: Brief description of the condition
            Treatment/Prevention: Recommended measures
            
            Example format:
            Primary Disease: Diabetes Type 2
            Associated Symptoms:
            - Increased thirst
            - Frequent urination
            - Fatigue
            - Blurred vision
            
            [Heart Disease] - 35%
            Description: Risk of developing cardiovascular issues
            Treatment/Prevention: Regular exercise, healthy diet

            Please ensure all risks are listed with exact percentages in the [Condition] - XX% format.
        `;

        const response = await axios.post(
            'https://api.straico.com/v1/prompt/completion',
            {
                models: ["openai/gpt-3.5-turbo-0125"],
                message: structuredPrompt,
            },
            {
                headers: {
                    'Authorization': `Bearer ${STRAICO_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const answer = response.data?.data?.completions?.["openai/gpt-3.5-turbo-0125"]?.completion?.choices?.[0]?.message?.content || "No answer found";
        res.json({ answer });
    } catch (error) {
        console.error('Error analyzing health data:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error processing data' });
    }
});

export default router;