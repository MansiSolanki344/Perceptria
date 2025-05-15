
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const UploadReport = () => {
//   const [file, setFile] = useState(null);
//   const [csrfToken, setCsrfToken] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [message, setMessage] = useState("");

//   // Fetch CSRF token from Django when component mounts
//   useEffect(() => {
//     const fetchCsrfToken = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/csrf/", {
//           withCredentials: true, // Allows cookies to be sent
//         });
//         setCsrfToken(response.data.csrfToken);
//         console.log("CSRF Token:", response.data.csrfToken);
//       } catch (error) {
//         console.error("Failed to fetch CSRF token:", error);
//       }
//     };

//     fetchCsrfToken();
//   }, []);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setMessage(""); // Clear previous messages
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("Please select a file before uploading.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("pdf_file", file);

//     try {
//       setUploading(true);
//       setUploadProgress(0);

//       const response = await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
//         headers: {
//           "X-CSRFToken": csrfToken, // Attach CSRF Token
//           "Content-Type": "multipart/form-data",
//         },
//         withCredentials: true, // Send cookies
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(percentCompleted);
//         },
//       });

//       setMessage("Upload successful! File URL: " + response.data.file_url);
//       console.log("Upload successful:", response.data);
//     } catch (error) {
//       setMessage("Upload failed. Please try again.");
//       console.error("Error uploading file:", error.response || error);
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "20px auto", textAlign: "center" }}>
//       <h2>Upload Report</h2>
//       <input type="file" accept="application/pdf" onChange={handleFileChange} />
//       <button
//         onClick={handleUpload}
//         disabled={uploading}
//         style={{
//           marginTop: "10px",
//           padding: "10px",
//           backgroundColor: uploading ? "#ccc" : "#007bff",
//           color: "white",
//           border: "none",
//           cursor: uploading ? "not-allowed" : "pointer",
//         }}
//       >
//         {uploading ? `Uploading... ${uploadProgress}%` : "Upload"}
//       </button>
//       {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
//       {message && <p style={{ marginTop: "10px", color: "red" }}>{message}</p>}
//     </div>
//   );
// };

// export default UploadReport;


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const UploadReport = () => {
//   const [file, setFile] = useState(null);
//   const [csrfToken, setCsrfToken] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [message, setMessage] = useState("");

//   // Fetch CSRF token from Django on component mount
//   useEffect(() => {
//     const fetchCsrfToken = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/csrf/", {
//           withCredentials: true, // Send cookies
//         });
//         setCsrfToken(response.data.csrfToken);
//         console.log("CSRF Token:", response.data.csrfToken);
//       } catch (error) {
//         console.error("Failed to fetch CSRF token:", error);
//       }
//     };

//     fetchCsrfToken();
//   }, []);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setMessage(""); // Clear previous messages
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("⚠️ Please select a file before uploading.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("pdf_file", file);

//     try {
//       setUploading(true);
//       setUploadProgress(0);

//       const response = await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
//         headers: {
//           "X-CSRFToken": csrfToken,
//           "Content-Type": "multipart/form-data",
//         },
//         withCredentials: true, // Send cookies
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(percentCompleted);
//         },
//       });

//       setMessage(`✅ Upload successful! File URL: ${response.data.file_url}`);
//       console.log("Upload successful:", response.data);
//     } catch (error) {
//       setMessage("❌ Upload failed. Please try again.");
//       console.error("Error uploading file:", error.response || error);
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "20px auto", textAlign: "center" }}>
//       <h2>Upload Report</h2>
//       <input type="file" accept="application/pdf" onChange={handleFileChange} />
//       <button
//         onClick={handleUpload}
//         disabled={uploading}
//         style={{
//           marginTop: "10px",
//           padding: "10px",
//           backgroundColor: uploading ? "#ccc" : "#007bff",
//           color: "white",
//           border: "none",
//           cursor: uploading ? "not-allowed" : "pointer",
//         }}
//       >
//         {uploading ? `Uploading... ${uploadProgress}%` : "Upload"}
//       </button>
//       {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
//       {message && <p style={{ marginTop: "10px", color: message.includes("❌") ? "red" : "green" }}>{message}</p>}
//     </div>
//   );
// };

// export default UploadReport;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const UploadReport = () => {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//   const fetchCSRFToken = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/csrf/", { withCredentials: true });
//       const csrfToken = response.data.csrfToken;
//       document.cookie = `csrftoken=${csrfToken}; path=/`; // Store CSRF token in cookies
//     } catch (error) {
//       console.error("Error fetching CSRF token:", error);
//     }
//   };

//   fetchCSRFToken();
// }, []);


//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setMessage(""); // Clear previous messages
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("⚠️ Please select a file before uploading.");
//       return;
//     }

//     const csrfToken = getCookie("csrftoken");  // Retrieve CSRF token from cookies

//     if (!csrfToken) {
//       setMessage("❌ CSRF token not found.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("pdf_file", file);  // Append the selected file to the form data

//     try {
//       setUploading(true);
//       setUploadProgress(0);

//       const response = await axios.post("http://127.0.0.1:8000/api/upload/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "X-CSRFToken": csrfToken,  // Send CSRF token in headers
//         },
//         withCredentials: true,  // This ensures cookies are sent with the request
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//           setUploadProgress(percentCompleted);  // Update upload progress
//         },
//       });

//       setMessage(`✅ Upload successful! File URL: ${response.data.file_url}`);
//       console.log("Upload successful:", response.data);
//     } catch (error) {
//       setMessage("❌ Upload failed. Please try again.");
//       console.error("Error uploading file:", error.response || error);
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const getCookie = (name) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(";").shift();
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "20px auto", textAlign: "center" }}>
//       <h2>Upload Report</h2>
//       <input type="file" accept="application/pdf" onChange={handleFileChange} />
//       <button
//         onClick={handleUpload}
//         disabled={uploading}
//         style={{
//           marginTop: "10px",
//           padding: "10px",
//           backgroundColor: uploading ? "#ccc" : "#007bff",
//           color: "white",
//           border: "none",
//           cursor: uploading ? "not-allowed" : "pointer",
//         }}
//       >
//         {uploading ? `Uploading... ${uploadProgress}%` : "Upload"}
//       </button>
//       {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
//       {message && <p style={{ marginTop: "10px", color: message.includes("❌") ? "red" : "green" }}>{message}</p>}
//     </div>
//   );
// };

// import React, { useState, useEffect } from "react";
// import api from "../../api"; // Ensure axios instance is configured correctly

// const UploadReport = () => {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Fetch CSRF token on mount
//   useEffect(() => {
//     api.get("/csrf/")
//       .then(response => {
//         document.cookie = `csrftoken=${response.data.csrfToken}; path=/`;
//       })
//       .catch(error => console.error("CSRF fetch error:", error));
//   }, []);

//   const handleUpload = async () => {
//     if (!file) {
//       setMessage("⚠️ Select a file first.");
//       return;
//     }

//     // Extract CSRF token from cookies
//     const csrfToken = document.cookie.split("; ").find(row => row.startsWith("csrftoken="))?.split("=")[1];
//     if (!csrfToken) {
//       setMessage("❌ CSRF token missing.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("pdf_file", file);

//     try {
//       setUploading(true);
//       setMessage("⏳ Uploading...");

//       const response = await api.post("/upload/", formData, {
//         headers: {
//           "X-CSRFToken": csrfToken,
//           "Content-Type": "multipart/form-data"
//         }
//       });

//       setMessage(`✅ Uploaded! Report: ${response.data.file_url}`);
//     } catch (error) {
//       setMessage("❌ Upload failed. Check console.");
//       console.error("Upload error:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Upload Report</h2>
//       <input type="file" onChange={e => setFile(e.target.files[0])} />
//       <button onClick={handleUpload} disabled={uploading}>
//         {uploading ? "Uploading..." : "Upload"}
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default UploadReport;


// import React, { useState, useEffect } from "react";
// import api from "../../api"; // Import Axios instance

// const UploadReport = () => {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Fetch CSRF token when component loads
//   useEffect(() => {
//     api.get("/csrf/", { withCredentials: true })  // Important: `withCredentials: true`
//       .then(response => document.cookie = `csrftoken=${response.data.csrfToken}; path=/`)
//       .catch(error => console.error("CSRF fetch error:", error));
//   }, []);

//   const handleUpload = async () => {
//     if (!file) return setMessage("⚠️ Select a file first.");

//     const csrfToken = document.cookie.split("; ").find(row => row.startsWith("csrftoken="))?.split("=")[1];
//     if (!csrfToken) return setMessage("❌ CSRF token missing.");

//     const formData = new FormData();
//     formData.append("pdf_file", file);

//     try {
//       setUploading(true);
//       const response = await api.post("/upload/", formData, {
//         headers: { "X-CSRFToken": csrfToken, "Content-Type": "multipart/form-data" },
//         withCredentials: true,  // Important for CSRF handling
//       });

//       setMessage(`✅ Uploaded! Report: ${response.data.file_url}`);
//     } catch (error) {
//       setMessage("❌ Upload failed.");
//       console.error("Upload error:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Upload Report</h2>
//       <input type="file" onChange={e => setFile(e.target.files[0])} />
//       <button onClick={handleUpload} disabled={uploading}>
//         {uploading ? "Uploading..." : "Upload"}
//       </button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default UploadReport;

// working testing
// import React, { useState } from "react";

// const UploadTest = () => {
//   const [file, setFile] = useState(null);

//   // Define the handleUpload function
//   const handleUpload = async (event) => {
//     event.preventDefault();
    
//     if (!file) {
//       alert("Please select a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://localhost:8000/api/upload/", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();
//       alert(result.message || "File uploaded successfully!");
//     } catch (error) {
//       console.error("Upload failed:", error);
//       alert("Upload failed, please try again.");
//     }
//   };

//   return (
//     <div>
//       <h2>CSRF & Upload Test</h2>
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={handleUpload}>Test Upload</button>
//     </div>
//   );
// };

// export default UploadTest;

// extract data proper code
// import React, { useState } from "react";

// const UploadReport = () => {
//   const [file, setFile] = useState(null);
//   const [extractedData, setExtractedData] = useState(null);

//   const handleUpload = async (event) => {
//     event.preventDefault();
    
//     if (!file) {
//       alert("Please select a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://localhost:8000/api/upload/", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();
//       if (result.data) {
//         setExtractedData(result.data);
//       } else {
//         alert("Failed to extract data.");
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);
//       alert("Upload failed, please try again.");
//     }
//   };

//   return (
//     <div>
//       <h2>Upload & Extract Report</h2>
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={handleUpload}>Upload</button>

//       {extractedData && (
//         <div>
//           <h3>Extracted Data:</h3>
//           <ul>
//             {Object.entries(extractedData).map(([key, value]) => (
//               <li key={key}>
//                 <strong>{key}:</strong> {value}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadReport;



// new
// import React, { useState } from "react";
// import HealthDashboard from "./HealthDashboard";

// const UploadReport = () => {
//   const [file, setFile] = useState(null);
//   const [extractedData, setExtractedData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async (event) => {
//     event.preventDefault();
    
//     if (!file) {
//       alert("Please select a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("pdf_file", file); // Ensure the key matches Django's views.py

//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:8000/api/upload/", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();
//       setLoading(false);

//       if (result.message && result.file_url) {
//         alert("Report processed successfully!");
//         setExtractedData(result.file_url); // Store file URL for display
//       } else {
//         alert("Failed to process the report.");
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error("Upload failed:", error);
//       alert("Upload failed, please try again.");
//     }
//   };

//   return (
//     <div className="p-6 flex flex-col items-center">
//       <h2 className="text-xl font-semibold mb-4">Upload & Extract Report</h2>
      
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-3" />
//       <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//         {loading ? "Uploading..." : "Upload"}
//       </button>

//       {extractedData && (
//         <div className="mt-4">
//           <h3 className="text-lg font-bold">Extracted Report:</h3>
//           <a href={`http://localhost:8000/media/reports/health_report.pdf`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//             Download Report
//           </a>
//         </div>
//       )}

//       {extractedData && <HealthDashboard results={extractedData} />}
//     </div>
//   );
// };

// export default UploadReport;

// proper code
// import React, { useState, useEffect } from "react";
// import HealthDashboard from "./HealthDashboard";

// const UploadReport = () => {
//   const [file, setFile] = useState(null);
//   const [extractedData, setExtractedData] = useState(null);
//   const [healthReport, setHealthReport] = useState(""); 
//   const [loading, setLoading] = useState(false);
//   const [csrfToken, setCsrfToken] = useState("");

//   useEffect(() => {
//     const fetchCsrfToken = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/csrf/", {
//           credentials: "include",
//         });
//         const data = await response.json();
//         setCsrfToken(data.csrfToken);
//       } catch (error) {
//         console.error("Failed to fetch CSRF token:", error);
//       }
//     };

//     fetchCsrfToken();
//   }, []);

//   const handleUpload = async (event) => {
//     event.preventDefault();

//     if (!file) {
//       alert("Please select a file first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("pdf_file", file);

//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:8000/api/upload/", {
//         method: "POST",
//         headers: { "X-CSRFToken": csrfToken },
//         body: formData,
//         credentials: "include",
//       });

//       const result = await response.json();
//       setLoading(false);
//       console.log("Backend response:", result); 

//       if (result.file_url) {
//         alert("Report processed successfully!");
//         window.open(result.file_url, "_blank");
//       } else {
//         alert("Failed to process the report.");
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error("Upload failed:", error);
//       alert("Upload failed, please try again.");
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={handleUpload}>{loading ? "Uploading..." : "Upload"}</button>
//     </div>
//   );
// };

// export default UploadReport;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const UploadReport = () => {
//     const [file, setFile] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [csrfToken, setCsrfToken] = useState("");
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchCsrfToken = async () => {
//             try {
//                 const response = await fetch("http://localhost:8000/api/csrf/", {
//                     credentials: "include",
//                 });
//                 const data = await response.json();
//                 setCsrfToken(data.csrfToken);
//             } catch (error) {
//                 console.error("CSRF token fetch error:", error);
//             }
//         };
//         fetchCsrfToken();
//     }, []);

//     const handleUpload = async (event) => {
//         event.preventDefault();
//         if (!file) return alert("Please select a file first.");

//         setLoading(true);
//         const formData = new FormData();
//         formData.append("pdf_file", file);

//         try {
//             const response = await fetch("http://localhost:8000/api/upload/", {
//                 method: "POST",
//                 headers: { "X-CSRFToken": csrfToken },
//                 body: formData,
//                 credentials: "include",
//             });

//             const result = await response.json();
//             setLoading(false);

//             if (result.status === "success") {
//                 alert("Report processed successfully!");
//                 navigate("/hdashboard", {
//                     state: {
//                       reportData: {
//                         factors: result.extracted_factors || {},
//                         report: result.health_report || {}, // AI-generated report
//                       }
//                     }
//                   });
                  
//             } else {
//                 alert("Processing failed: " + (result.message || "Unknown error"));
//             }
//         } catch (error) {
//             setLoading(false);
//             console.error("Upload failed:", error);
//             alert("Upload failed: " + error.message);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-blue-50">
//         <div className="w-96 h-96 p-8 bg-white rounded-xl shadow-lg border border-gray-300 flex flex-col justify-center relative top-[-50px]">
//             <h1 className="text-2xl font-semibold mb-6 text-blue-700 text-center">Upload Health Report</h1>
//             <div className="space-y-5">
//                 <input 
//                     type="file"
//                     onChange={(e) => setFile(e.target.files[0])}
//                     className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
//                     accept=".pdf"
//                 />
//                 <button
//                     onClick={handleUpload}
//                     disabled={loading}
//                     className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-all"
//                 >
//                     {loading ? "Analyzing..." : "Analyze Report"}
//                 </button>
//             </div>
//         </div>
//     </div>
// );
// };

// export default UploadReport;
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { CloudUploadIcon, DocumentTextIcon, ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/outline";

// const UploadReport = () => {
//     const [file, setFile] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [csrfToken, setCsrfToken] = useState("");
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [uploadStage, setUploadStage] = useState("idle"); // idle, uploading, analyzing, complete, error
//     const [dragActive, setDragActive] = useState(false);
//     const [error, setError] = useState(null);
//     const uploadRef = useRef(null);
//     const navigate = useNavigate();

//     // Stages of processing with custom messages
//     const processingStages = [
//         { stage: "Extracting text from document...", delay: 1500 },
//         { stage: "Identifying medical terminology...", delay: 2000 },
//         { stage: "Analyzing health metrics...", delay: 2500 },
//         { stage: "Generating personalized insights...", delay: 2000 },
//         { stage: "Preparing your health dashboard...", delay: 1500 }
//     ];
    
//     const [currentStageIndex, setCurrentStageIndex] = useState(0);
//     const [currentStageMessage, setCurrentStageMessage] = useState("");

//     useEffect(() => {
//         const fetchCsrfToken = async () => {
//             try {
//                 const response = await fetch("http://localhost:8000/api/csrf/", {
//                     credentials: "include",
//                 });
//                 const data = await response.json();
//                 setCsrfToken(data.csrfToken);
//             } catch (error) {
//                 console.error("CSRF token fetch error:", error);
//                 setError("Failed to connect to server. Please try again later.");
//             }
//         };
//         fetchCsrfToken();
//     }, []);

//     // Effect for cycling through processing stage messages
//     useEffect(() => {
//         if (uploadStage === "analyzing" && processingStages.length > 0) {
//             setCurrentStageMessage(processingStages[currentStageIndex].stage);
            
//             const timer = setTimeout(() => {
//                 if (currentStageIndex < processingStages.length - 1) {
//                     setCurrentStageIndex(prev => prev + 1);
//                 }
//             }, processingStages[currentStageIndex].delay);
            
//             return () => clearTimeout(timer);
//         }
//     }, [uploadStage, currentStageIndex]);

//     const handleDrag = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
        
//         if (e.type === "dragenter" || e.type === "dragover") {
//             setDragActive(true);
//         } else if (e.type === "dragleave") {
//             setDragActive(false);
//         }
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setDragActive(false);
        
//         if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//             const droppedFile = e.dataTransfer.files[0];
//             if (droppedFile.type === "application/pdf") {
//                 setFile(droppedFile);
//                 setError(null);
//             } else {
//                 setError("Please upload a PDF file only");
//             }
//         }
//     };

//     const handleFileChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             const selectedFile = e.target.files[0];
//             if (selectedFile.type === "application/pdf") {
//                 setFile(selectedFile);
//                 setError(null);
//             } else {
//                 setError("Please upload a PDF file only");
//                 setFile(null);
//                 // Reset file input
//                 if (uploadRef.current) {
//                     uploadRef.current.value = "";
//                 }
//             }
//         }
//     };

//     const handleUpload = async (event) => {
//         event.preventDefault();
//         if (!file) {
//             setError("Please select a file first.");
//             return;
//         }

//         setLoading(true);
//         setUploadProgress(0);
//         setUploadStage("uploading");
//         setCurrentStageIndex(0);
//         setError(null);
        
//         const formData = new FormData();
//         formData.append("pdf_file", file);

//         // Simulate progress with variable speed to seem more realistic
//         const progressInterval = setInterval(() => {
//             setUploadProgress(prev => {
//                 if (prev < 40) {
//                     // Fast initial progress
//                     return prev + (Math.random() * 5);
//                 } else if (prev < 70) {
//                     // Slower middle progress
//                     return prev + (Math.random() * 2);
//                 } else if (prev < 90) {
//                     // Very slow final progress
//                     return prev + (Math.random() * 0.5);
//                 }
//                 return prev;
//             });
//         }, 200);

//         try {
//             // Simulate some network delay
//             await new Promise(resolve => setTimeout(resolve, 1500));
            
//             const response = await fetch("http://localhost:8000/api/upload/", {
//                 method: "POST",
//                 headers: { "X-CSRFToken": csrfToken },
//                 body: formData,
//                 credentials: "include",
//             });

//             clearInterval(progressInterval);
//             setUploadProgress(100);
//             setUploadStage("analyzing");

//             const result = await response.json();

//             if (result.status === "success") {
//                 // Simulate analysis time
//                 setTimeout(() => {
//                     setUploadStage("complete");
                    
//                     setTimeout(() => {
//                         navigate("/hdashboard", {
//                             state: {
//                                 reportData: {
//                                     rawText: result.raw_text || "",
//                                     summary: result.summary || "",
//                                     reportName: file.name,
//                                     uploadDate: new Date().toISOString()
//                                 }
//                             }
//                         });
//                     }, 1500); // Give time for completion animation
//                 }, 7000); // Total analysis time
//             } else {
//                 setUploadStage("error");
//                 setError("Processing failed: " + (result.message || "Unknown error"));
//                 setLoading(false);
//             }
//         } catch (error) {
//             clearInterval(progressInterval);
//             setUploadStage("error");
//             setLoading(false);
//             console.error("Upload failed:", error);
//             setError("Upload failed: " + (error.message || "Connection error"));
//         }
//     };

//     const handleNewUpload = () => {
//         setFile(null);
//         setLoading(false);
//         setUploadProgress(0);
//         setUploadStage("idle");
//         setError(null);
//         if (uploadRef.current) {
//             uploadRef.current.value = "";
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//             <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl border border-blue-200 flex flex-col relative transition-all duration-500">
//                 <h1 className="text-2xl font-semibold mb-6 text-blue-700 text-center">
//                     {uploadStage === "analyzing" ? "Analyzing Your Report" : 
//                      uploadStage === "complete" ? "Analysis Complete!" : 
//                      "Upload Health Report"}
//                 </h1>
                
//                 {uploadStage === "uploading" || uploadStage === "analyzing" ? (
//                     <div className="flex flex-col items-center justify-center space-y-6">
//                         {/* Progress bar */}
//                         <div className="relative w-full mb-4">
//                             <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
//                                 <div 
//                                     className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
//                                     style={{ width: `${uploadProgress}%` }}
//                                 ></div>
//                             </div>
//                             <span className="absolute right-0 top-[-25px] text-sm font-medium text-blue-600">
//                                 {Math.round(uploadProgress)}%
//                             </span>
//                             <span className="text-xs text-blue-600 mt-1 block">
//                                 {uploadStage === "uploading" ? 
//                                     "Uploading file..." : 
//                                     "Processing complete, analyzing content..."}
//                             </span>
//                         </div>
                        
//                         {/* Animation */}
//                         <div className="flex flex-col items-center">
//                             <div className="relative w-32 h-32 mb-4">
//                                 {uploadStage === "uploading" ? (
//                                     <>
//                                         <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
//                                         <div className="absolute inset-4 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin animation-delay-200"></div>
//                                         <div className="absolute inset-8 rounded-full border-4 border-blue-50 border-t-blue-400 animate-spin animation-delay-400"></div>
//                                         <div className="absolute inset-0 flex items-center justify-center">
//                                             <DocumentTextIcon className="h-12 w-12 text-blue-500 animate-pulse" />
//                                         </div>
//                                     </>
//                                 ) : (
//                                     <div className="w-full h-full">
//                                         <div className="absolute inset-0 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden">
//                                             <div className="absolute w-full h-full flex">
//                                                 <div className="w-1/5 h-full bg-blue-400 opacity-80 animate-pulse"></div>
//                                                 <div className="w-1/5 h-full bg-blue-500 opacity-80 animate-pulse animation-delay-100"></div>
//                                                 <div className="w-1/5 h-full bg-blue-600 opacity-80 animate-pulse animation-delay-200"></div>
//                                                 <div className="w-1/5 h-full bg-blue-700 opacity-80 animate-pulse animation-delay-300"></div>
//                                                 <div className="w-1/5 h-full bg-indigo-600 opacity-80 animate-pulse animation-delay-400"></div>
//                                             </div>
//                                             <div className="absolute inset-0 flex items-center justify-center">
//                                                 <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24">
//                                                     <path
//                                                         stroke="currentColor"
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                         strokeWidth="2"
//                                                         d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
//                                                     />
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                             <h2 className="text-xl font-medium text-blue-700">{
//                                 uploadStage === "uploading" ? "Uploading File" : "Analyzing Report"
//                             }</h2>
//                             <p className="text-blue-500 text-center mt-2 min-h-12 animate-fade-in">
//                                 {currentStageMessage}
//                             </p>
//                         </div>
//                     </div>
//                 ) : uploadStage === "complete" ? (
//                     <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
//                         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
//                             <CheckCircleIcon className="h-14 w-14 text-green-600" />
//                         </div>
//                         <div className="text-center">
//                             <h2 className="text-xl font-medium text-blue-700 mb-2">Report Processed Successfully!</h2>
//                             <p className="text-blue-600">Redirecting to your dashboard...</p>
//                         </div>
//                         <div className="w-16 h-1 bg-blue-200 rounded-full animate-pulse mt-4"></div>
//                     </div>
//                 ) : uploadStage === "error" ? (
//                     <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
//                         <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
//                             <ExclamationCircleIcon className="h-14 w-14 text-red-600" />
//                         </div>
//                         <div className="text-center">
//                             <h2 className="text-xl font-medium text-red-700 mb-2">Upload Failed</h2>
//                             <p className="text-red-600">{error}</p>
//                         </div>
//                         <button
//                             onClick={handleNewUpload}
//                             className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
//                         >
//                             Try Again
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="space-y-5">
//                         <div 
//                             onDragEnter={handleDrag}
//                             onDragOver={handleDrag}
//                             onDragLeave={handleDrag}
//                             onDrop={handleDrop}
//                             className={`flex flex-col items-center justify-center border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-200'} rounded-lg p-8 transition-all duration-300`}
//                         >
//                             <CloudUploadIcon className="w-16 h-16 text-blue-500 mb-3" />
                            
//                             <p className="text-gray-600 mb-4 text-center">
//                                 {file ? `Selected: ${file.name}` : 'Drag & drop your medical report or click to browse'}
//                             </p>
                            
//                             <input 
//                                 type="file"
//                                 ref={uploadRef}
//                                 onChange={handleFileChange}
//                                 className="hidden"
//                                 accept=".pdf"
//                                 id="file-upload"
//                             />
                            
//                             <button
//                                 onClick={() => document.getElementById('file-upload').click()}
//                                 className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors duration-300"
//                             >
//                                 {file ? 'Choose Different File' : 'Browse Files'}
//                             </button>
//                         </div>
                        
//                         {error && (
//                             <div className="text-sm text-red-600 flex items-center">
//                                 <ExclamationCircleIcon className="h-4 w-4 mr-1" />
//                                 {error}
//                             </div>
//                         )}
                        
//                         <div className="flex items-center text-xs text-gray-500 mb-4 px-2">
//                             <DocumentTextIcon className="h-4 w-4 mr-1" />
//                             <span>Only PDF files are supported</span>
//                         </div>
                        
//                         <button
//                             onClick={handleUpload}
//                             disabled={!file || loading}
//                             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-300 shadow-md flex items-center justify-center"
//                         >
//                             {file ? 'Analyze Report' : 'Select a File to Continue'}
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default UploadReport;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../../firebase/firebaseConfig"; // already initialized
// // If you need firebase storage, import it separately
// // import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const UploadReport = () => {
//   const [file, setFile] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [uploadStage, setUploadStage] = useState("");
//   const navigate = useNavigate();

//   const handleUpload = async (event) => {
//     event.preventDefault();

//     if (!file) {
//       setError("Please select a file first.");
//       return;
//     }

//     setLoading(true);
//     setUploadProgress(0);
//     setUploadStage("uploading");

//     try {
//       const user = auth.currentUser;

//       if (!user) {
//         setError("You must be logged in to upload a report.");
//         setLoading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("pdf_file", file);
//       formData.append("user_id", user.uid); // Firebase user ID

//       // Simulate fake progress
//       const progressInterval = setInterval(() => {
//         setUploadProgress(prev => {
//           if (prev < 90) return prev + Math.random() * 10;
//           clearInterval(progressInterval);
//           return prev;
//         });
//       }, 200);

//       // 🔥 Send to your backend (make sure csrfToken is properly handled if needed)
//       const response = await fetch("http://localhost:8000/api/upload/", {
//         method: "POST",
//         body: formData,
//         credentials: "include", // include cookies
//       });

//       clearInterval(progressInterval);
//       setUploadProgress(100);
//       setUploadStage("analyzing");

//       const result = await response.json();

//       if (result.status === "success") {
//         setUploadStage("complete");
//         setTimeout(() => {
//           navigate("/dashboard", {
//             state: {
//               reportData: {
//                 rawText: result.raw_text || "",
//                 summary: result.summary || "",
//                 reportName: file.name,
//                 uploadDate: new Date().toISOString(),
//               },
//             },
//           });
//         }, 1500);
//       } else {
//         throw new Error(result.message || "Processing failed");
//       }

//     } catch (err) {
//       console.error("Upload failed:", err);
//       setError("Upload failed: " + err.message);
//       setUploadStage("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="upload-container">
//       <form onSubmit={handleUpload}>
//         <input 
//           type="file" 
//           accept="application/pdf"
//           onChange={(e) => setFile(e.target.files[0])}
//         />
//         {uploadStage === "uploading" && (
//           <progress value={uploadProgress} max={100} />
//         )}
//         <button type="submit" disabled={loading}>
//           {loading ? "Uploading..." : "Upload Report"}
//         </button>
//       </form>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//     </div>
//   );
// };

// export default UploadReport;


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { 
  CloudUploadIcon, 
  DocumentTextIcon, 
  ExclamationCircleIcon, 
  CheckCircleIcon 
} from "@heroicons/react/outline";

const UploadReport = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStage, setUploadStage] = useState("idle"); // idle, uploading, analyzing, complete, error
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState(null);
    const uploadRef = useRef(null);
    const navigate = useNavigate();

    // Stages of processing with custom messages
    const processingStages = [
        { stage: "Extracting text from document...", delay: 1500 },
        { stage: "Identifying medical terminology...", delay: 2000 },
        { stage: "Analyzing health metrics...", delay: 2500 },
        { stage: "Generating personalized insights...", delay: 2000 },
        { stage: "Preparing your health dashboard...", delay: 1500 }
    ];
    
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [currentStageMessage, setCurrentStageMessage] = useState("");

    // Effect for cycling through processing stage messages
    useEffect(() => {
        if (uploadStage === "analyzing" && processingStages.length > 0) {
            setCurrentStageMessage(processingStages[currentStageIndex].stage);
            
            const timer = setTimeout(() => {
                if (currentStageIndex < processingStages.length - 1) {
                    setCurrentStageIndex(prev => prev + 1);
                }
            }, processingStages[currentStageIndex].delay);
            
            return () => clearTimeout(timer);
        }
    }, [uploadStage, currentStageIndex]);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
                setError(null);
            } else {
                setError("Please upload a PDF file only");
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === "application/pdf") {
                setFile(selectedFile);
                setError(null);
            } else {
                setError("Please upload a PDF file only");
                setFile(null);
                // Reset file input
                if (uploadRef.current) {
                    uploadRef.current.value = "";
                }
            }
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setUploadProgress(0);
        setUploadStage("uploading");
        setCurrentStageIndex(0);
        setError(null);
        
        try {
            const user = auth.currentUser;

            if (!user) {
                setError("You must be logged in to upload a report.");
                setLoading(false);
                setUploadStage("error");
                return;
            }

            const formData = new FormData();
            formData.append("pdf_file", file);
            formData.append("user_id", user.uid); // Firebase user ID

            // Simulate progress with variable speed to seem more realistic
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev < 40) {
                        // Fast initial progress
                        return prev + (Math.random() * 5);
                    } else if (prev < 70) {
                        // Slower middle progress
                        return prev + (Math.random() * 2);
                    } else if (prev < 90) {
                        // Very slow final progress
                        return prev + (Math.random() * 0.5);
                    }
                    return prev;
                });
            }, 200);

            // 🔥 Send to your backend
            const response = await fetch("http://localhost:8000/api/upload/", {
                method: "POST",
                body: formData,
                credentials: "include", // include cookies
            });

            clearInterval(progressInterval);
            setUploadProgress(100);
            setUploadStage("analyzing");

            const result = await response.json();

            if (result.status === "success") {
                // Simulate analysis time
                setTimeout(() => {
                    setUploadStage("complete");
                    
                    setTimeout(() => {
                        navigate("/hdashboard", {
                            state: {
                                reportData: {
                                    rawText: result.raw_text || "",
                                    summary: result.summary || result.health_summary || "",
                                    reportName: file.name,
                                    uploadDate: new Date().toISOString(),
                                    pdfUrl: result.pdf_url || "",
                                    summaryUrl: result.summary_url || ""
                                }
                            }
                        });
                    }, 1500); // Give time for completion animation
                }, 7000); // Total analysis time
            } else {
                setUploadStage("error");
                setError("Processing failed: " + (result.message || "Unknown error"));
                setLoading(false);
            }
        } catch (error) {
            setUploadStage("error");
            setLoading(false);
            console.error("Upload failed:", error);
            setError("Upload failed: " + (error.message || "Connection error"));
        }
    };

    const handleNewUpload = () => {
        setFile(null);
        setLoading(false);
        setUploadProgress(0);
        setUploadStage("idle");
        setError(null);
        if (uploadRef.current) {
            uploadRef.current.value = "";
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl border border-blue-200 flex flex-col relative transition-all duration-500">
                <h1 className="text-2xl font-semibold mb-6 text-blue-700 text-center">
                    {uploadStage === "analyzing" ? "Analyzing Your Report" : 
                     uploadStage === "complete" ? "Analysis Complete!" : 
                     "Upload Health Report"}
                </h1>
                
                {uploadStage === "uploading" || uploadStage === "analyzing" ? (
                    <div className="flex flex-col items-center justify-center space-y-6">
                        {/* Progress bar */}
                        <div className="relative w-full mb-4">
                            <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <span className="absolute right-0 top-[-25px] text-sm font-medium text-blue-600">
                                {Math.round(uploadProgress)}%
                            </span>
                            <span className="text-xs text-blue-600 mt-1 block">
                                {uploadStage === "uploading" ? 
                                    "Uploading file..." : 
                                    "Processing complete, analyzing content..."}
                            </span>
                        </div>
                        
                        {/* Animation */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 mb-4">
                                {uploadStage === "uploading" ? (
                                    <>
                                        <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                                        <div className="absolute inset-4 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin animation-delay-200"></div>
                                        <div className="absolute inset-8 rounded-full border-4 border-blue-50 border-t-blue-400 animate-spin animation-delay-400"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <DocumentTextIcon className="h-12 w-12 text-blue-500 animate-pulse" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full">
                                        <div className="absolute inset-0 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden">
                                            <div className="absolute w-full h-full flex">
                                                <div className="w-1/5 h-full bg-blue-400 opacity-80 animate-pulse"></div>
                                                <div className="w-1/5 h-full bg-blue-500 opacity-80 animate-pulse animation-delay-100"></div>
                                                <div className="w-1/5 h-full bg-blue-600 opacity-80 animate-pulse animation-delay-200"></div>
                                                <div className="w-1/5 h-full bg-blue-700 opacity-80 animate-pulse animation-delay-300"></div>
                                                <div className="w-1/5 h-full bg-indigo-600 opacity-80 animate-pulse animation-delay-400"></div>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24">
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <h2 className="text-xl font-medium text-blue-700">{
                                uploadStage === "uploading" ? "Uploading File" : "Analyzing Report"
                            }</h2>
                            <p className="text-blue-500 text-center mt-2 min-h-12 animate-fade-in">
                                {currentStageMessage}
                            </p>
                        </div>
                    </div>
                ) : uploadStage === "complete" ? (
                    <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircleIcon className="h-14 w-14 text-green-600" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-medium text-blue-700 mb-2">Report Processed Successfully!</h2>
                            <p className="text-blue-600">Redirecting to your dashboard...</p>
                        </div>
                        <div className="w-16 h-1 bg-blue-200 rounded-full animate-pulse mt-4"></div>
                    </div>
                ) : uploadStage === "error" ? (
                    <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <ExclamationCircleIcon className="h-14 w-14 text-red-600" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-medium text-red-700 mb-2">Upload Failed</h2>
                            <p className="text-red-600">{error}</p>
                        </div>
                        <button
                            onClick={handleNewUpload}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div 
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center border-2 border-dashed ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-200'} rounded-lg p-8 transition-all duration-300`}
                        >
                            <CloudUploadIcon className="w-16 h-16 text-blue-500 mb-3" />
                            
                            <p className="text-gray-600 mb-4 text-center">
                                {file ? `Selected: ${file.name}` : 'Drag & drop your medical report or click to browse'}
                            </p>
                            
                            <input 
                                type="file"
                                ref={uploadRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf"
                                id="file-upload"
                            />
                            
                            <button
                                onClick={() => document.getElementById('file-upload').click()}
                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md border border-blue-200 hover:bg-blue-100 transition-colors duration-300"
                            >
                                {file ? 'Choose Different File' : 'Browse Files'}
                            </button>
                        </div>
                        
                        {error && (
                            <div className="text-sm text-red-600 flex items-center">
                                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                                {error}
                            </div>
                        )}
                        
                        <div className="flex items-center text-xs text-gray-500 mb-4 px-2">
                            <DocumentTextIcon className="h-4 w-4 mr-1" />
                            <span>Only PDF files are supported</span>
                        </div>
                        
                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all duration-300 shadow-md flex items-center justify-center"
                        >
                            {file ? 'Analyze Report' : 'Select a File to Continue'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadReport;