import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { User, Bell, Activity, File, FileText, AlertTriangle, Download, Award, Stethoscope, Brain, Heart, TrendingUp, Calendar } from 'lucide-react';
import axios from "axios";
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf'; // Import jsPDF for PDF generation
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Radar } from 'react-chartjs-2';

// Register ChartJS components (add this before the Innovate function)
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Get the PDF.js version and set up the worker
const setupPdfWorker = () => {
  const pdfVersion = pdfjsLib.version;
  console.log(`Using PDF.js version: ${pdfVersion}`);
  
  // Try to load the worker script directly from your node_modules (Vite/Webpack should handle this)
  try {
    // For Vite, we need to use the import.meta.url approach
    const workerUrl = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url);
    console.log("Attempting to load PDF worker from:", workerUrl.toString());
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  } catch (err) {
    console.warn("Failed to load worker directly, falling back to alternatives:", err);
    
    // For specific versions like 5.2.133, we might need to adjust the path pattern
    if (pdfVersion === "5.2.133") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.mjs';
    } else {
      // Try CDN as last resort
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfVersion}/pdf.worker.min.js`;
    }
  }
};

setupPdfWorker();

const calculateHealthScore = (result) => {
    if (!result) return null;
    
    const risks = result.match(/\[(.*?)\]\s*-\s*(\d+)%/g) || [];
    if (risks.length === 0) return null;

    const totalRisk = risks.reduce((acc, risk) => {
        const percentage = parseInt(risk.match(/(\d+)%/)[1]);
        return acc + percentage;
    }, 0);

    // Calculate health score (100 - average risk)
    return Math.max(0, 100 - (totalRisk / risks.length));
};

const getRecommendations = (healthScore) => {
    if (!healthScore) return [];
    
    const recommendations = [
        {
            category: "Lifestyle",
            items: [
                "Regular exercise (30 minutes daily)",
                "Balanced diet rich in nutrients",
                "Adequate sleep (7-8 hours)",
                "Stress management techniques"
            ]
        },
        {
            category: "Medical",
            items: [
                "Regular health check-ups",
                "Blood pressure monitoring",
                "Cholesterol screening",
                "Blood sugar testing"
            ]
        },
        {
            category: "Prevention",
            items: [
                "Vaccination updates",
                "Regular dental check-ups",
                "Vision examinations",
                "Mental health counseling"
            ]
        }
    ];

    // Filter recommendations based on health score
    return recommendations.map(category => ({
        ...category,
        items: category.items.filter((_, index) => {
            if (healthScore < 50) return true; // Show all recommendations
            if (healthScore < 75) return index < 3; // Show first 3
            return index < 2; // Show first 2
        })
    }));
};

// Add new component for Health Score
const HealthScoreGauge = ({ score }) => {
    const gaugeValue = Math.min(Math.max(score, 0), 100);
    const color = gaugeValue > 75 ? '#22c55e' : gaugeValue > 50 ? '#eab308' : '#ef4444';

    return (
        <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                />
                {/* Score circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={`${gaugeValue * 2.83} ${283 - gaugeValue * 2.83}`}
                    transform="rotate(-90 50 50)"
                />
                <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="24"
                    fontWeight="bold"
                    fill={color}
                >
                    {Math.round(gaugeValue)}
                </text>
                <text
                    x="50"
                    y="65"
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                >
                    Health Score
                </text>
            </svg>
        </div>
    );
};

function Innovate() {
    const [age, setAge] = useState("");
    const [sex, setSex] = useState("male");
    const [symptoms, setSymptoms] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeNav, setActiveNav] = useState('Features');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [pdfContent, setPdfContent] = useState(""); // Store extracted PDF content
    const [pdfProcessingStatus, setPdfProcessingStatus] = useState(""); // To show PDF processing status
    const [chartData, setChartData] = useState(null);
    const [chartType, setChartType] = useState('pie');
    const [ageError, setAgeError] = useState("");
    const [healthScore, setHealthScore] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [showGlossary, setShowGlossary] = useState(false);

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

    // Enhanced function to extract text from PDF with OCR-like capabilities
    const extractTextFromPDF = async (file) => {
        try {
            // Display a loading message in the UI
            setPdfProcessingStatus("Starting PDF processing...");
            setPdfContent("Processing PDF, please wait...");
            
            // First, let's see if PDF.js is properly initialized
            if (!pdfjsLib.getDocument) {
                throw new Error("PDF.js library is not properly initialized");
            }
            
            // Simple text extraction as fallback if we encounter issues
            const useFallbackMethod = async () => {
                console.log("Using fallback text extraction method");
                setPdfProcessingStatus("Using alternative extraction method...");
                
                // For basic text extraction, we'll use FileReader API
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        // This will get some text but won't be perfect
                        const text = e.target.result;
                        resolve(`Basic text extraction (may be incomplete):\n\n${text}`);
                    };
                    reader.onerror = () => {
                        resolve("Error: Could not read the PDF file using fallback method.");
                    };
                    reader.readAsText(file);
                });
            };
            
            try {
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                
                // Set timeout for PDF loading
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error("PDF loading timed out after 15 seconds")), 15000);
                });
                
                // Add progress monitoring
                loadingTask.onProgress = ({ loaded, total }) => {
                    const progress = total ? Math.round((loaded / total) * 100) : 'unknown';
                    setPdfProcessingStatus(`Loading PDF: ${progress}% complete`);
                };
                
                // Race between loading and timeout
                const pdf = await Promise.race([loadingTask.promise, timeoutPromise]);
                setPdfProcessingStatus(`PDF loaded with ${pdf.numPages} pages. Beginning text extraction...`);
                
                let text = `PDF Loaded: ${pdf.numPages} pages\n\n`;
                let textLayerFound = false;

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    setPdfProcessingStatus(`Extracting text from page ${pageNum}/${pdf.numPages}...`);
                    const page = await pdf.getPage(pageNum);

                    // Standard text extraction
                    try {
                        const textContent = await page.getTextContent();
                        
                        // Check if this page has actual text content
                        if (textContent.items && textContent.items.length > 0) {
                            textLayerFound = true;
                            const pageText = textContent.items.map(item => item.str).join(" ");
                            text += `Page ${pageNum}: ${pageText}\n\n`;
                        } else {
                            text += `Page ${pageNum}: [No selectable text found - using image processing]\n\n`;
                            
                            // For non-selectable text, we'll try to process as image
                            try {
                                setPdfProcessingStatus(`Page ${pageNum} has no selectable text. Extracting as image...`);
                                
                                // Get viewport and prepare canvas
                                const viewport = page.getViewport({ scale: 1.5 }); // Higher scale for better OCR
                                const canvas = document.createElement('canvas');
                                const context = canvas.getContext('2d');
                                canvas.height = viewport.height;
                                canvas.width = viewport.width;
                                
                                // Render PDF page to canvas
                                await page.render({
                                    canvasContext: context,
                                    viewport: viewport
                                }).promise;
                                
                                text += `[Image-based content detected on page ${pageNum}. In production, this would be sent to an OCR service like Tesseract.js or Google Vision API for text extraction.]\n\n`;
                            } catch (renderErr) {
                                console.warn(`Failed to render page ${pageNum} as image:`, renderErr);
                                text += `[Failed to process page ${pageNum} as image: ${renderErr.message}]\n\n`;
                            }
                        }
                    } catch (textErr) {
                        console.warn(`Failed to extract text from page ${pageNum}:`, textErr);
                        text += `[Error extracting text from page ${pageNum}: ${textErr.message}]\n\n`;
                    }

                    // Extract clickable text (hyperlinks) from annotations
                    try {
                        const annotations = await page.getAnnotations();
                        if (annotations && annotations.length > 0) {
                            let linksFound = false;
                            annotations.forEach(annotation => {
                                if (annotation.subtype === 'Link' && annotation.url) {
                                    if (!linksFound) {
                                        text += `Links on page ${pageNum}:\n`;
                                        linksFound = true;
                                    }
                                    text += `- ${annotation.url} (${annotation.title || 'No title'})\n`;
                                }
                            });
                            if (linksFound) text += "\n";
                        }
                    } catch (annotationErr) {
                        console.warn(`Could not extract annotations from page ${pageNum}:`, annotationErr);
                    }
                }

                if (!textLayerFound) {
                    text += "\nNote: This PDF appears to contain mostly image-based or scanned content. To fully extract text from this document, consider using a dedicated OCR service.\n";
                }

                setPdfProcessingStatus("PDF processing complete!");
                return text;
                
            } catch (pdfError) {
                console.error("PDF.js extraction error:", pdfError);
                
                // Check if it's a version mismatch error
                if (pdfError.message && pdfError.message.includes("version")) {
                    console.warn("Version mismatch detected, using fallback extraction");
                    return await useFallbackMethod();
                }
                
                throw pdfError;
            }
        } catch (err) {
            console.error("Error extracting PDF text:", err);
            const errorMessage = `Failed to process PDF: ${err.message || 'Unknown error'}`;
            setError(errorMessage);
            setPdfProcessingStatus("PDF processing failed!");
            return `Error: ${errorMessage}`;
        }
    };

    // Handle file upload and extract PDF content
    const handleFileUpload = async (e) => {
        setError(""); // Clear any previous errors
        const file = e.target.files[0];
        
        if (!file) {
            return; // No file selected
        }
        
        if (file.type === "application/pdf") {
            try {
                setUploadedFile(file);
                setIsLoading(true); // Show loading state
                
                // Update UI to show we're processing
                setPdfContent(`Processing ${file.name}...`);
                setPdfProcessingStatus(`Starting to process ${file.name}...`);
                
                const extractedText = await extractTextFromPDF(file);
                setPdfContent(extractedText);
                
                if (extractedText.startsWith("Error:")) {
                    setError(`Failed to process PDF: ${extractedText.substring(7)}`);
                }
            } catch (err) {
                console.error("File upload error:", err);
                setError(`Error processing file: ${err.message || "Unknown error"}`);
                setPdfContent("");
                setPdfProcessingStatus("PDF processing failed!");
            } finally {
                setIsLoading(false);
            }
        } else {
            setError("Please upload a valid PDF file (.pdf extension).");
            setUploadedFile(null);
            setPdfContent("");
            setPdfProcessingStatus("");
        }
    };

    // Update the parseRiskPercentages function to improve parsing accuracy
    const parseRiskPercentages = (result) => {
        if (!result) return null;

        const percentages = [];
        const conditions = [];
        const regex = /\[(.*?)\]\s*-\s*(\d+)%/g;
        let match;

        while ((match = regex.exec(result)) !== null) {
            conditions.push(match[1].trim());
            percentages.push(parseInt(match[2]));
        }

        if (conditions.length === 0) return null;

        return {
            labels: conditions,
            datasets: [{
                label: 'Risk Probability (%)',
                data: percentages,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            }]
        };
    };

    // Modify handleSubmit to include chart data parsing
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setResult(null);

        // Add age validation
        if (age) {
            const ageNum = parseInt(age);
            if (ageNum < 0 || ageNum > 130 || !Number.isInteger(parseFloat(age))) {
                setError("Please enter a valid age (0-130 years)");
                setIsLoading(false);
                return;
            }
        }

        // Check if PDF is uploaded, if not, require fields
        if (!uploadedFile && (!age || !symptoms)) {
            setError("Please fill in all fields or upload a PDF.");
            setIsLoading(false);
            return;
        }

        // If we have a PDF but no other info, that's okay
        let prompt = "";
        
        // Include patient details if provided
        //comment
        if (age || symptoms) {
            const symptomList = symptoms ? symptoms.split(",").map(s => s.trim()).join(", ") : "No symptoms specified";
            prompt = `The patient is ${age || "age not provided"} years old, gender is ${sex}. `;
            
            if (symptoms) {
                prompt += `They have the following symptoms: ${symptomList}. `;
            }
        }

        // Include PDF content in the prompt if available
        if (pdfContent) {
            prompt += `Here is the patient's medical record from the uploaded PDF:\n${pdfContent}\n`;
        }

        prompt += "\nWhat possible health conditions or risks might they face in the future? and tell me the possible treatment for them.also tell what probability of having these conditions? probability should be in percentage.";

        try {
            const response = await axios.post("http://localhost:5555/ino/analyze", {
                prompt
            });

            const answer = response.data.answer;
            setResult(answer);
            
            // Calculate and set health score
            const score = calculateHealthScore(answer);
            setHealthScore(score);
            
            // Generate recommendations
            const recs = getRecommendations(score);
            setRecommendations(recs);
            
            // Parse and set chart data
            const parsedChartData = parseRiskPercentages(answer);
            if (parsedChartData) {
                setChartData(parsedChartData);
            }
        } catch (error) {
            console.error("Error analyzing health:", error);
            setError("An error occurred while processing your request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Update the chart options for better visualization
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                }
            },
            title: {
                display: true,
                text: 'Health Risk Probabilities',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: 20
            },
            tooltip: {
                callbacks: {
                    label: (context) => `Risk: ${context.parsed}%`
                }
            }
        },
        ...(chartType === 'bar' && {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Probability (%)'
                    }
                }
            }
        })
    };

    // Updated downloadReportAsPDF function
    const downloadReportAsPDF = () => {
        const doc = new jsPDF();
        let yOffset = 10;

        // Title and Patient Details
        doc.setFontSize(18);
        doc.text("Health Analysis Report", 10, yOffset);
        yOffset += 15;

        // Patient Details Section
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Patient Details", 10, yOffset);
        yOffset += 7;
        doc.setFont("helvetica", "normal");
        doc.text(`Age: ${age || "Not provided"}`, 10, yOffset);
        yOffset += 7;
        doc.text(`Gender: ${sex}`, 10, yOffset);
        yOffset += 7;
        if (symptoms) {
            const symptomsLines = doc.splitTextToSize(`Symptoms: ${symptoms}`, 180);
            symptomsLines.forEach(line => {
                doc.text(line, 10, yOffset);
                yOffset += 7;
            });
        }

        // Analysis Results
        yOffset += 10;
        doc.setFont("helvetica", "bold");
        doc.text("Analysis Results", 10, yOffset);
        yOffset += 7;
        doc.setFont("helvetica", "normal");

        if (result) {
            const lines = doc.splitTextToSize(result, 180);
            lines.forEach(line => {
                if (yOffset > 270) {
                    doc.addPage();
                    yOffset = 20;
                }
                doc.text(line, 10, yOffset);
                yOffset += 7;
            });
        }

        // Risk Visualization Section
        if (chartData) {
            doc.addPage();
            yOffset = 20;
            doc.setFont("helvetica", "bold");
            doc.text("Risk Analysis Visualization", 10, yOffset);
            yOffset += 10;

            // Get the chart canvas and convert to image
            const chartCanvas = document.querySelector('canvas');
            if (chartCanvas) {
                // Capture the chart as an image
                const chartImage = chartCanvas.toDataURL('image/png');
                
                // Calculate dimensions to fit the page while maintaining aspect ratio
                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const aspectRatio = chartCanvas.width / chartCanvas.height;
                const imgWidth = pageWidth - 20; // Leave 10px margin on each side
                const imgHeight = imgWidth / aspectRatio;

                // Add the chart image
                doc.addImage(chartImage, 'PNG', 10, yOffset, imgWidth, imgHeight);
                yOffset += imgHeight + 20;

                // Add risk percentages as text
                doc.setFontSize(10);
                chartData.labels.forEach((label, index) => {
                    if (yOffset > 270) {
                        doc.addPage();
                        yOffset = 20;
                    }
                    const percentage = chartData.datasets[0].data[index];
                    doc.text(`${label}: ${percentage}%`, 10, yOffset);
                    yOffset += 7;
                });
            }
        }

        // Health Score Section
        if (healthScore !== null) {
            doc.addPage();
            yOffset = 20;
            doc.setFont("helvetica", "bold");
            doc.text("Health Score Analysis", 10, yOffset);
            yOffset += 15;

            // Get the health score gauge element
            const gaugeElement = document.querySelector('.health-score-gauge svg');
            if (gaugeElement) {
                // Convert SVG to canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = gaugeElement.width.baseVal.value;
                canvas.height = gaugeElement.height.baseVal.value;
                
                // Convert SVG to string
                const svgData = new XMLSerializer().serializeToString(gaugeElement);
                const img = new Image();
                
                // Create a blob URL from the SVG
                const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
                const url = URL.createObjectURL(svgBlob);
                
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    const gaugeImage = canvas.toDataURL('image/png');
                    doc.addImage(gaugeImage, 'PNG', 70, yOffset, 60, 60);
                    URL.revokeObjectURL(url);
                };
                img.src = url;
            }

            yOffset += 80;

            // Add recommendations
            doc.setFont("helvetica", "bold");
            doc.text("Personalized Recommendations", 10, yOffset);
            yOffset += 10;

            recommendations.forEach(category => {
                if (yOffset > 250) {
                    doc.addPage();
                    yOffset = 20;
                }

                doc.setFont("helvetica", "bold");
                doc.text(category.category, 10, yOffset);
                yOffset += 10;

                doc.setFont("helvetica", "normal");
                category.items.forEach(item => {
                    const itemLines = doc.splitTextToSize(`• ${item}`, 180);
                    itemLines.forEach(line => {
                        if (yOffset > 270) {
                            doc.addPage();
                            yOffset = 20;
                        }
                        doc.text(line, 15, yOffset);
                        yOffset += 7;
                    });
                });
                yOffset += 5;
            });
        }

        // Save the PDF
        doc.save("Health_Analysis_Report.pdf");
    };

    // Add this helper function to format the analysis results
const formatAnalysisResults = (result) => {
    if (!result) return null;
    
    const sections = result.split(/\d+\./).filter(Boolean);
    return sections.map(section => section.trim());
};

    // Update the age validation handler
    const handleAgeChange = (e) => {
        const value = e.target.value;
        if (value < 0) {
            setAgeError("Age cannot be negative");
            setAge("");
        } else if (value > 130) {
            setAgeError("Age cannot exceed 130 years");
            setAge("");
        } else {
            setAgeError("");
            setAge(value);
        }
    };

    // Add this helper function near the other helper functions
    const parsePrimaryDisease = (result) => {
        if (!result) return null;
        
        const primaryDiseaseMatch = result.match(/Primary Disease:(.*?)(?=Current Conditions:|$)/s);
        if (!primaryDiseaseMatch) return null;

        const primaryDiseaseParts = primaryDiseaseMatch[1].split('Associated Symptoms:');
        const disease = primaryDiseaseParts[0].trim();
        const symptoms = primaryDiseaseParts[1]
            ?.split('-')
            .filter(Boolean)
            .map(symptom => symptom.trim());

        return {
            disease,
            symptoms
        };
    };

    // Add this useEffect to check for patient analysis file
    useEffect(() => {
        const storedFile = sessionStorage.getItem('patientAnalysisFile');
        const filename = sessionStorage.getItem('patientAnalysisFilename');
        
        if (storedFile && filename) {
            // Convert base64 to File object
            fetch(storedFile)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], filename, { type: 'application/pdf' });
                    
                    // Simulate file upload
                    const event = {
                        target: {
                            files: [file]
                        }
                    };
                    
                    handleFileUpload(event);
                    
                    // Clear sessionStorage
                    sessionStorage.removeItem('patientAnalysisFile');
                    sessionStorage.removeItem('patientAnalysisFilename');
                });
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Navigation Bar */}
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

            {/* Main Content */}
            <div className="min-h-screen bg-white flex items-center justify-center p-4 mt-16">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Input Section */}
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
                                {/* File Upload Section - Moved to top */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Upload Medical Report
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <label className="cursor-pointer inline-flex items-center px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-blue-700">
                                            <File className="mr-2" size={16} />
                                            <span>{uploadedFile ? "Change File" : "Upload PDF File"}</span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="application/pdf"
                                                onChange={handleFileUpload}
                                            />
                                        </label>
                                        {uploadedFile && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setUploadedFile(null);
                                                    setPdfContent("");
                                                    setPdfProcessingStatus("");
                                                }}
                                                className="text-red-500 text-sm hover:underline"
                                            >
                                                Remove ×
                                            </button>
                                        )}
                                    </div>
                                    {uploadedFile && (
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500">
                                                Selected: {uploadedFile.name}
                                            </p>
                                            {pdfProcessingStatus && (
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Status: {pdfProcessingStatus}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Optional note that appears when PDF is uploaded */}
                                {uploadedFile && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                        <p className="text-sm text-blue-700">
                                            <span className="font-medium">PDF uploaded!</span> Fields below are now optional. You can leave them blank and analyze based on the PDF content only.
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Age {!uploadedFile && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={handleAgeChange}
                                        min="0"
                                        placeholder="Enter age"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {ageError && (
                                        <p className="text-red-500 text-xs mt-1">{ageError}</p>
                                    )}
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
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Symptoms {!uploadedFile && <span className="text-red-500">*</span>}
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

                    {/* Results Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="h-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                        >
                            <div className="p-6 bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                    <Activity className="text-blue-600 mr-2" size={20} />
                                    Health Analysis Report
                                </h2>
                                {result && (
                                    <button
                                        onClick={downloadReportAsPDF}
                                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Download className="mr-2" size={16} />
                                        Download PDF
                                    </button>
                                )}
                            </div>

                            <div className="p-6 h-[calc(100%-72px)] overflow-y-auto">
                                {result ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="bg-blue-50 p-4 rounded-lg">
                                                <h3 className="text-sm font-medium text-blue-800 mb-1">Patient Details</h3>
                                                <p className="text-gray-700">
                                                    Age: <span className="font-medium">{age || "Not provided"}</span><br />
                                                    Gender: <span className="font-medium">{sex}</span>
                                                    {symptoms && <><br />Symptoms: <span className="font-medium">{symptoms}</span></>}
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
                                                    {uploadedFile && <><br />PDF: <span className="font-medium">{uploadedFile.name}</span></>}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Add this right after the patient details grid */}
                                        {result && parsePrimaryDisease(result) && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mb-4">
                                                <div className="flex items-start space-x-2">
                                                    <AlertTriangle className="text-yellow-600 mt-1" size={20} />
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                                            Primary Disease Detected
                                                        </h3>
                                                        <div className="text-yellow-900 font-medium mb-3">
                                                            {parsePrimaryDisease(result).disease}
                                                        </div>
                                                        
                                                        {parsePrimaryDisease(result).symptoms && (
                                                            <div>
                                                                <h4 className="text-sm font-medium text-yellow-800 mb-2">
                                                                    Associated Symptoms
                                                                </h4>
                                                                <ul className="list-disc list-inside text-yellow-900 text-sm space-y-1">
                                                                    {parsePrimaryDisease(result).symptoms.map((symptom, index) => (
                                                                        <li key={index}>{symptom}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                            <h3 className="text-lg font-medium text-gray-800 mb-3">Analysis Results</h3>
                                            {result && (
                                                <div className="space-y-6">
                                                    {formatAnalysisResults(result).map((section, index) => (
                                                        <div key={index} className="prose max-w-none">
                                                            {section.includes("Current Conditions:") ? (
                                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                                    <h4 className="text-blue-800 font-medium mb-2">Current Conditions</h4>
                                                                    <div className="text-gray-700">
                                                                        {section.replace("Current Conditions:", "").trim()}
                                                                    </div>
                                                                </div>
                                                            ) : section.includes("Future Risk Assessment:") ? (
                                                                <div className="bg-purple-50 p-4 rounded-lg">
                                                                    <h4 className="text-purple-800 font-medium mb-4">Future Risk Assessment</h4>
                                                                    <div className="space-y-4">
                                                                        {section.replace("Future Risk Assessment:", "")
                                                                            .match(/\[(.*?)\]\s*-\s*(\d+)%([\s\S]*?)(?=\[|$)/g)
                                                                            ?.map((risk, i) => {
                                                                                const [_, condition, percentage, details] = risk.match(/\[(.*?)\]\s*-\s*(\d+)%([\s\S]*)/);
                                                                                const [description, treatment] = details.split(/Description:|Treatment\/Prevention:/).filter(Boolean);
                                                                                
                                                                                return (
                                                                                    <div key={i} className="bg-white rounded-lg p-4 border border-purple-100">
                                                                                        <div className="flex justify-between items-center border-b border-purple-100 pb-2 mb-3">
                                                                                            <span className="text-lg font-medium text-purple-900">
                                                                                                {condition.trim()}
                                                                                            </span>
                                                                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                                                                                {percentage}% Risk
                                                                                            </span>
                                                                                        </div>
                                                                                        {description && (
                                                                                            <div className="mb-2">
                                                                                                <h5 className="text-sm font-medium text-purple-800 mb-1">Description:</h5>
                                                                                                <p className="text-sm text-gray-600">{description.trim()}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {treatment && (
                                                                                            <div>
                                                                                                <h5 className="text-sm font-medium text-purple-800 mb-1">Treatment/Prevention:</h5>
                                                                                                <p className="text-sm text-gray-600">{treatment.trim()}</p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Add this after the Analysis Results section */}
                                        {chartData && (
                                            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-medium text-gray-800">Risk Visualization</h3>
                                                    <div className="space-x-2">
                                                        <button
                                                            onClick={() => setChartType('pie')}
                                                            className={`px-3 py-1 rounded ${
                                                                chartType === 'pie' 
                                                                    ? 'bg-blue-600 text-white' 
                                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            Pie Chart
                                                        </button>
                                                        <button
                                                            onClick={() => setChartType('bar')}
                                                            className={`px-3 py-1 rounded ${
                                                                chartType === 'bar' 
                                                                    ? 'bg-blue-600 text-white' 
                                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            Bar Chart
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="w-full h-[400px] flex items-center justify-center">
                                                    {chartType === 'pie' ? (
                                                        <Pie data={chartData} options={chartOptions} />
                                                    ) : (
                                                        <Bar data={chartData} options={chartOptions} />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Health Score and Recommendations Section */}
                                        {healthScore !== null && (
                                            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="flex flex-col items-center">
                                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Overall Health Score</h3>
                                                        <HealthScoreGauge score={healthScore} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Recommendations</h3>
                                                        <div className="space-y-4">
                                                            {recommendations.map((category, index) => (
                                                                <div key={index} className="bg-gray-50 rounded-lg p-4">
                                                                    <h4 className="font-medium text-gray-700 mb-2">{category.category}</h4>
                                                                    <ul className="space-y-2">
                                                                        {category.items.map((item, i) => (
                                                                            <li key={i} className="flex items-start">
                                                                                <span className="text-green-500 mr-2">•</span>
                                                                                {item}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-8">
                                        {uploadedFile ? (
                                            <div>
                                                <FileText size={48} className="text-blue-300 mb-4 mx-auto" />
                                                <h3 className="text-lg font-medium text-blue-500 mb-2">PDF Uploaded</h3>
                                                <p className="text-sm max-w-md">
                                                    Your PDF has been processed. Click "Analyze Health Risks" to generate a report based on the PDF content.
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <Activity size={48} className="text-gray-300 mb-4" />
                                                <h3 className="text-lg font-medium text-gray-500 mb-2">No Analysis Yet</h3>
                                                <p className="text-sm max-w-md">
                                                    Submit your health information or upload a medical report PDF to receive a comprehensive risk analysis.
                                                </p>
                                            </div>
                                        )}
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