import React, { useState } from "react";
import { motion } from 'framer-motion';
import { User, Bell, Activity } from 'lucide-react';
import axios from "axios";

function Innovate() {
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("male");
    const [symptoms, setSymptoms] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeNav, setActiveNav] = useState('Features');

    // Navigation animation variants
    const navItem = {
        hidden: { y: -20, opacity: 0 },
        visible: (i) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.1,
                type: "spring",
                stiffness: 100
            }
        }),
        hover: {
            scale: 1.1,
            textShadow: "0 0 8px rgba(255,255,255,0.8)",
            transition: { type: "spring", stiffness: 300 }
        },
        tap: { scale: 0.95 }
    };

    const navItems = ['Home', 'Features', 'Pricing', 'About Us', 'Contact'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setResult(null);

        // Validate inputs
        if (!age || !symptoms) {
            setError("Please fill in all fields.");
            setIsLoading(false);
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
        } catch (error) {
            console.error("Error analyzing health:", error);
            setError("An error occurred while processing your request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Navigation Bar - Unchanged */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
            >
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <motion.div
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center"
                        >
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400"
                            >
                                HealthCare HIMS
                            </motion.span>
                        </motion.div>
                        <nav className="hidden md:flex space-x-2 items-center">
                            {navItems.map((item, i) => (
                                <motion.div
                                    key={item}
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={navItem}
                                    onClick={() => setActiveNav(item)}
                                    className={`px-4 py-2 rounded-full cursor-pointer ${activeNav === item ?
                                        'bg-white text-purple-600 font-bold' :
                                        'text-white hover:bg-white/20'}`}
                                >
                                    {item}
                                </motion.div>
                            ))}
                            
                            {/* Profile and Notification Icons */}
                            <div className="flex items-center space-x-4 ml-4">
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-white cursor-pointer"
                                >
                                    <Bell size={20} />
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-white cursor-pointer"
                                >
                                    <User size={20} />
                                </motion.div>
                            </div>
                        </nav>
                        <motion.button
                            whileHover={{ rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="md:hidden text-xl text-white"
                        >
                            ☰
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Main Content with Professional Horizontal Layout */}
            <div className="min-h-screen bg-white flex items-center justify-center p-4 mt-16">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Input Section - Left Side */}
                    <div className="lg:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center mb-6">
                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                    <Activity className="text-blue-600" size={24} />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    Health Risk Analysis
                                </h1>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        placeholder="Enter age"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Gender
                                    </label>
                                    <select
                                        value={sex}
                                        onChange={(e) => setSex(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Symptoms
                                    </label>
                                    <textarea
                                        value={symptoms}
                                        onChange={(e) => setSymptoms(e.target.value)}
                                        placeholder="Enter symptoms (comma separated)"
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Separate multiple symptoms with commas
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing...
                                        </span>
                                    ) : 'Analyze Health Risks'}
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Results Section - Right Side (Square Layout) */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="h-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                        >
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <Activity className="text-blue-600 mr-2" size={20} />
                                    Health Analysis Report
                                </h2>
                            </div>
                            
                            <div className="p-6 h-[calc(100%-72px)] overflow-y-auto">
                                {result ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <h3 className="text-sm font-medium text-blue-800 mb-1">Patient Details</h3>
                                                <p className="text-gray-700">
                                                    Age: <span className="font-medium">{age}</span><br />
                                                    Gender: <span className="font-medium">{sex}</span>
                                                </p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg">
                                                <h3 className="text-sm font-medium text-green-800 mb-1">Report Generated</h3>
                                                <p className="text-gray-700">
                                                    {new Date().toLocaleDateString('en-US', { 
                                                        weekday: 'long', 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                            <h3 className="text-lg font-medium text-gray-800 mb-3">Analysis Results</h3>
                                            <div className="prose max-w-none text-gray-700">
                                                {result.split('\n').map((paragraph, i) => (
                                                    <p key={i} className="mb-3">{paragraph}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-8">
                                        <Activity size={48} className="text-gray-300 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-500 mb-2">No Analysis Yet</h3>
                                        <p className="text-sm max-w-md">
                                            Submit your health information to receive a comprehensive risk analysis report.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Innovate;