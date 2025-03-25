import React, { useState } from "react";
import axios from "axios";

function Innovate() {
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("male");
    const [symptoms, setSymptoms] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!age || !symptoms) {
            setError("Please fill in all fields.");
            return;
        }

        // Format the input as a readable prompt for the backend
        const symptomList = symptoms.split(",").map(s => s.trim()).join(", ");
        const prompt = `The patient is ${age} years old, gender is ${sex}. They have the following symptoms: ${symptomList}. What possible health conditions or risks might they face in the future?`;

        try {
            const response = await axios.post("http://localhost:5555/ino/analyze", {
                prompt
            });

            // Extract the answer from the backend response
            const answer = response.data.answer;
            setResult(answer);
            setError(""); // Clear any previous errors
        } catch (error) {
            console.error("Error analyzing health:", error);
            setError("An error occurred while processing your request. Please try again.");
            setResult(null); // Clear any previous results
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Health Risk Analysis</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Age: </label>
                    <input
                        type="number"
                        placeholder="Enter Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        style={{ padding: "5px", marginLeft: "10px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Gender: </label>
                    <select
                        value={sex}
                        onChange={(e) => setSex(e.target.value)}
                        style={{ padding: "5px", marginLeft: "10px" }}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Symptoms: </label>
                    <input
                        type="text"
                        placeholder="Enter symptoms (comma-separated)"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        style={{ padding: "5px", marginLeft: "10px", width: "300px" }}
                    />
                </div>
                <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px" }}>
                    Analyze
                </button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {result && (
                <div style={{ marginTop: "20px" }}>
                    <h2>Analysis Results</h2>
                    <p style={{ whiteSpace: "pre-wrap", background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>{result}</p>
                </div>
            )}
        </div>
    );
}

export default Innovate;