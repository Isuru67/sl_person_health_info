import React from "react";
import axios from "axios";

const Summ_Submission = ({ formData }) => {
    const handleSubmit = () => {
        axios.post("http://localhost:5000/patients", formData)
            .then(() => alert("Patient Data Submitted!"))
            .catch(err => console.log(err));
    };

    return (
        <div>
            <h2>Review and Submit</h2>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Summ_Submission;