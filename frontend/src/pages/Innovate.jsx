import React, { useState } from "react";
import axios from "axios";

function Innovate() {
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("male");
    const [symptoms, setSymptoms] = useState("");
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Format the input as a readable prompt for ChatGPT API
        const symptomList = symptoms ? symptoms.split(",").map(s => s.trim()).join(", ") : "no symptoms";
        const prompt = `The patient is ${age} years old, gender is ${sex}. They have the following symptoms: ${symptomList}. What possible health conditions or risks might they face in the future?`;

        try {
            const response = await axios.post("http://localhost:5555/ino/analyze", {
                prompt
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error analyzing health:", error);
        }
    };

    return (
        <div>
            <h1>Health Risk Analysis</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Enter Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
                <select value={sex} onChange={(e) => setSex(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <input
                    type="text"
                    placeholder="Enter symptoms (comma-separated)"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                />
                <button type="submit">Analyze</button>
            </form>

            {result && (
                <div>
                    <h2>Results</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Innovate;
