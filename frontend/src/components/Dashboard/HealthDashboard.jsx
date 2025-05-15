

// // last working
// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// // Icons
// import { 
//   FaSun, FaMoon, FaDownload, FaHome, 
//   FaUtensils, FaDumbbell, FaLeaf, FaPills, 
//   FaHeartbeat, FaCalendarCheck, FaChartBar
// } from "react-icons/fa";

// const HDashboard = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const reportData = location.state?.reportData || { summary: "", rawText: "" };
//   const [darkMode, setDarkMode] = useState(false);
//   const dashboardRef = useRef(null);
//   const [expandedSections, setExpandedSections] = useState({
//     summary: true,
//     recommendations: true,
//     visualizations: true
//   });
  
//   // Add state for diet plan toggle
//   const [activeDietPlan, setActiveDietPlan] = useState("vegetarian");
  
//   // Parse the summary text to extract different sections
//   const [parsedData, setParsedData] = useState({
//     healthSummary: "",
//     goodNews: "",
//     areasOfConcern: "",
//     redFlags: "",
//     doctorAdvice: "",
//     dietPlan: {
//       vegetarian: "",
//       nonVegetarian: ""
//     },
//     exercisePlan: "",
//     lifestyleTips: "",
//     supplements: "",
//     healthProducts: "",
//     reminders: "",
//     motivationalNote: "",
//     visualData: {
//       bloodParameters: [],
//       vitalSigns: [],
//       nutritionData: []
//     }
//   });
  
//   useEffect(() => {
//     if (reportData.summary) {
//       parseHealthReport(reportData.summary);
//     } else {
//       navigate("/upload");
//     }
//   }, [reportData, navigate]);
  
//   const parseHealthReport = (text) => {
//     if (!text) return;
    
//     // Extract health summary
//     const healthSummary = extractSection(text, "**A. Health Summary 🩺**", "✅ **Good News 🎉**");
    
//     // Extract good news
//     const goodNews = extractSection(text, "✅ **Good News 🎉**", "⚠️ **Areas of Concern**");
    
//     // Extract areas of concern
//     const areasOfConcern = extractSection(text, "⚠️ **Areas of Concern**", "**B. Red Flags & Concerns ⚠️**");
    
//     // Extract red flags
//     const redFlags = extractSection(text, "**B. Red Flags & Concerns ⚠️**", "**C. Simulated Doctor Advice 👨‍⚕️**");
    
//     // Extract doctor advice
//     const doctorAdvice = extractSection(text, "**C. Simulated Doctor Advice 👨‍⚕️**", "**D. 7-Day Diet Plan 🍽️**");
    
//     // Extract vegetarian diet plan
//     const vegetarianDietPlan = extractSection(text, "🥬 **Vegetarian**", "🍗 **Non-Vegetarian**");
    
//     // Extract non-vegetarian diet plan
//     const nonVegetarianDietPlan = extractSection(text, "🍗 **Non-Vegetarian**", "**E. 7-Day Exercise Plan 🏃**");
    
//     // Extract exercise plan
//     const exercisePlan = extractSection(text, "**E. 7-Day Exercise Plan 🏃**", "**F. Lifestyle Tips 🌿**");
    
//     // Extract lifestyle tips
//     const lifestyleTips = extractSection(text, "**F. Lifestyle Tips 🌿**", "**G. Supplements & Food Suggestions 💊**");
    
//     // Extract supplements
//     const supplements = extractSection(text, "**G. Supplements & Food Suggestions 💊**", "**H. Health Product Suggestions (Optional) 🏥**");
    
//     // Extract health products
//     const healthProducts = extractSection(text, "**H. Health Product Suggestions (Optional) 🏥**", "**I. Reminders & Follow-ups 🔁**");
    
//     // Extract reminders
//     const reminders = extractSection(text, "**I. Reminders & Follow-ups 🔁**", "❣️ **L. Motivational Note – Uplifting Closing Message**");
    
//     // Extract motivational note
//     const motivationalNote = extractSection(text, "❣️ **L. Motivational Note – Uplifting Closing Message**", "THIS IS FRONTEND TO FETCH IT");
    
//     // Extract numerical values for visualization
//     const bloodParameters = extractNumericalValues(areasOfConcern);
    
//     const parsed = {
//       healthSummary,
//       goodNews,
//       areasOfConcern,
//       redFlags,
//       doctorAdvice,
//       dietPlan: {
//         vegetarian: vegetarianDietPlan,
//         nonVegetarian: nonVegetarianDietPlan
//       },
//       exercisePlan,
//       lifestyleTips,
//       supplements,
//       healthProducts,
//       reminders,
//       motivationalNote,
//       visualData: {
//         bloodParameters,
        
//       }
//     };
    
//     setParsedData(parsed);
//   };
  
//   // Helper function to extract section between markers
//   const extractSection = (text, startMarker, endMarker) => {
//     try {
//       if (!text) return "";
      
//       const startIndex = text.indexOf(startMarker);
//       if (startIndex === -1) return "";
      
//       let endIndex;
//       if (endMarker) {
//         endIndex = text.indexOf(endMarker, startIndex);
//         if (endIndex === -1) endIndex = text.length;
//       } else {
//         endIndex = text.length;
//       }
      
//       return text.substring(startIndex + startMarker.length, endIndex).trim();
//     } catch (error) {
//       console.error("Error extracting section:", error);
//       return "";
//     }
//   };
  
//   // Extract numerical values for visualization
//   const extractNumericalValues = (text) => {
//     const bloodParams = [];
    
//     if (!text) return bloodParams;
    
//     // This regex looks for table-like structures in the text
//     const regex = /\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;
//     let match;
    
//     while ((match = regex.exec(text)) !== null) {
//       const name = match[1].trim();
//       const value = parseFloat(match[2]);
      
//       // Parse range (assuming format like "12.0-16.0 g/dl")
//       const rangeMatch = match[3].match(/(\d+\.?\d*)-(\d+\.?\d*)\s*([^\s]*)/);
      
//       if (rangeMatch && !isNaN(value)) {
//         const min = parseFloat(rangeMatch[1]);
//         const max = parseFloat(rangeMatch[2]);
//         const unit = rangeMatch[3] || "";
        
//         bloodParams.push({
//           name,
//           value,
//           min,
//           max,
//           unit
//         });
//       }
//     }
    
//     return bloodParams;
//   };
  
  

//   const downloadReport = async () => {
//     try {
//       // Check if reportData.summary is available
//       if (!reportData.summary) {
//         alert("No summary data found to download.");
//         return;
//       }
  
//       // Create a blob with the summary data
//       const blob = new Blob([reportData.summary], { type: 'text/plain' });
      
//       // Create a download link
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = 'health_report_summary.txt'; // Adjust filename if needed (e.g., .txt)
  
//       // Trigger the download
//       document.body.appendChild(link);
//       link.click();
      
//       // Clean up
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error downloading report:", error);
//       alert("Failed to download report. Please try again.");
//     }
//   };
  
  
//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         duration: 0.5,
//         when: "beforeChildren",
//         staggerChildren: 0.1
//       }
//     }
//   };
  
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//       y: 0, 
//       opacity: 1,
//       transition: { duration: 0.5 }
//     }
//   };

//   const renderTable = (content) => {
//     if (!content) return null;
    
//     // Split into lines and filter out empty lines and separator lines
//     const lines = content.split('\n')
//       .filter(line => line.trim() && !line.trim().match(/^[-:| ]+$/));
    
//     if (lines.length < 2) return null;
    
//     // Check if this looks like a table by counting pipes
//     const isProbablyTable = lines.some(line => (line.match(/\|/g) || []).length >= 3);
    
//     if (!isProbablyTable) {
//       // Render as normal text if it doesn't look like a table
//       return (
//         <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//           {content}
//         </div>
//       );
//     }
    
//     // Extract headers from first line with pipe formatting
//     const headerLine = lines[0];
//     const headers = headerLine.split('|')
//       .map(header => header.trim())
//       .filter(header => header);
    
//     // Process rows - skip the first line (headers)
//     const rows = lines.slice(1).map(line => {
//       return line.split('|')
//         .map(cell => cell.trim())
//         .filter(cell => cell !== '');
//     }).filter(row => row.length > 1); // Ensure we have actual rows with data
    
//     return (
//       <div className="overflow-x-auto mt-4">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
//             <tr>
//               {headers.map((header, idx) => (
//                 <th key={idx} scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {rows.map((row, rowIdx) => (
//               <tr key={rowIdx} className={rowIdx % 2 === 0 ? (darkMode ? "bg-gray-800" : "bg-white") : (darkMode ? "bg-gray-700" : "bg-gray-50")}>
//                 {row.map((cell, cellIdx) => (
//                   <td key={cellIdx} className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-200" : "text-gray-500"}`}>
//                     {cell}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };
  
//   const renderList = (content) => {
//     if (!content) return null;
    
//     // Check if the content contains bullet points
//     const hasBulletPoints = content.includes("* ") || content.includes("- ");
    
//     if (!hasBulletPoints) {
//       // If no bullet points, render as normal text
//       return (
//         <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//           {content}
//         </div>
//       );
//     }
    
//     const listItems = content
//       .split("\n")
//       .filter(line => line.trim().startsWith("* ") || line.trim().startsWith("- "))
//       .map(line => line.replace(/^\*\s|-\s/, "").trim());
      
//     return (
//       <ul className="list-disc pl-5 space-y-2 mt-4">
//         {listItems.map((item, idx) => (
//           <li key={idx} className={`text-sm md:text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{item}</li>
//         ))}
//       </ul>
//     );
//   };
  
//   const renderContent = (content) => {
//     if (!content) return null;
    
//     // Check if content contains table markers
//     if (content.includes("|") && content.includes("-|-")) {
//       return renderTable(content);
//     }
    
//     // Check if content contains list markers
//     if (content.includes("* ") || content.includes("- ")) {
//       return renderList(content);
//     }
    
//     // Default to plain text rendering
//     return (
//       <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//         {content}
//       </div>
//     );
//   };
  
//   const ProgressBar = ({ value, min, max, label, unit }) => {
//     // Calculate percentage of value within range
//     const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    
//     // Determine color based on where the value falls in the range
//     let statusColor = darkMode ? "bg-blue-600" : "bg-blue-400";
//     if (percentage < 25) statusColor = darkMode ? "bg-indigo-600" : "bg-indigo-400";
//     if (percentage > 75) statusColor = darkMode ? "bg-teal-600" : "bg-teal-400";
    
//     return (
//       <div className="mb-4">
//         <div className="flex justify-between mb-1">
//           <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{label}</span>
//           <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{value} {unit}</span>
//         </div>
//         <div className={`w-full h-2.5 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full`}>
//           <div 
//             className={`h-2.5 rounded-full ${statusColor}`} 
//             style={{ width: `${percentage}%` }}
//           ></div>
//         </div>
//         <div className={`flex justify-between text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
//           <span>{min}</span>
//           <span>{max}</span>
//         </div>
//       </div>
//     );
//   };
  
//   const SectionHeader = ({ title, icon, isExpanded, toggleExpanded, id }) => {
//     return (
//       <div 
//         className="flex items-center justify-between cursor-pointer py-4"
//         onClick={() => toggleExpanded(id)}
//       >
//         <div className="flex items-center">
//           {icon}
//           <h2 className={`text-2xl font-bold ml-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{title}</h2>
//         </div>
//         <button className={`w-8 h-8 flex items-center justify-center rounded-full ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
//           {isExpanded ? 
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
//             </svg>
//             :
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//             </svg>
//           }
//         </button>
//       </div>
//     );
//   };

//   const toggleSection = (sectionId) => {
//     setExpandedSections({
//       ...expandedSections,
//       [sectionId]: !expandedSections[sectionId]
//     });
//   };

//   return (
//     <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold">Health Report</h1>
//             <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//               Your comprehensive health analysis and personalized recommendations
//             </p>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"} hover:shadow-md transition-all duration-300`}
//               aria-label="Toggle dark mode"
//             >
//               {darkMode ? <FaSun /> : <FaMoon />}
//             </button>
            
//             <button
//               onClick={downloadReport}
//               className="flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
//             >
//               <FaDownload className="mr-2" />
//               Download Raw Report
//             </button>
            
//             <button
//               onClick={() => navigate("/dashboard")}
//               className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"} hover:bg-gray-300 transition-all duration-300`}
//             >
//               <FaHome className="mr-2" />
//               Home
//             </button>
//           </div>
//         </header>
        
//         {/* Main Content */}
//         <div className="mb-16" ref={dashboardRef}>
//           {/* Health Summary Section */}
//           <div className="mb-12">
//             <SectionHeader 
//               title="Your Health Summary" 
//               icon={<FaHeartbeat className="text-blue-500" />}
//               isExpanded={expandedSections.summary}
//               toggleExpanded={toggleSection}
//               id="summary"
//             />
            
//             {expandedSections.summary && (
//               <motion.div
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="mt-6 space-y-8"
//               >
//                 {/* Health Overview Card */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
//                   <div className="p-6">
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>Health Overview</h3>
//                     <div className="prose max-w-none">
//                       {parsedData.healthSummary ? (
//                         <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                           {parsedData.healthSummary}
//                         </div>
//                       ) : (
//                         <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No health summary available.</p>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Good News & Areas of Concern */}
//                 <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className={`${darkMode ? "bg-green-900" : "bg-green-50"} rounded-xl shadow-sm p-6`}>
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-green-300" : "text-green-700"}`}>Positive Findings</h3>
//                     <div className="prose max-w-none">
//                       {parsedData.goodNews ? (
//                         renderList(parsedData.goodNews) || (
//                           <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                             {parsedData.goodNews}
//                           </div>
//                         )
//                       ) : (
//                         <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No specific positive findings to report.</p>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className={`${darkMode ? "bg-blue-900" : "bg-blue-50"} rounded-xl shadow-sm p-6`}>
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>Areas for Attention</h3>
//                     {parsedData.areasOfConcern ? (
//                       renderTable(parsedData.areasOfConcern) || (
//                         <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                           {parsedData.areasOfConcern}
//                         </div>
//                       )
//                     ) : (
//                       <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No specific areas of concern identified.</p>
//                     )}
//                   </div>
//                 </motion.div>

//                 {/* Red Flags Section */}
//                 {parsedData.redFlags && (
//                   <motion.div variants={itemVariants} className={`${darkMode ? "bg-red-900/30" : "bg-red-50"} rounded-xl shadow-md p-6`}>
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-red-300" : "text-red-700"}`}>Key Health Concerns</h3>
//                     <div className="prose max-w-none">
//                       <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                         {parsedData.redFlags}
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Doctor's Advice */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-indigo-900" : "bg-indigo-50"} rounded-xl shadow-md p-6`}>
//                   <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>Doctor's Professional Advice</h3>
//                   <div className="prose max-w-none">
//                     {parsedData.doctorAdvice ? (
//                       <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                         {parsedData.doctorAdvice}
//                       </div>
//                     ) : (
//                       <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No specific doctor advice available.</p>
//                     )}
//                   </div>
                  
//                   <div className="mt-6 flex flex-wrap gap-4">
//                     <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
//                       Schedule Appointment
//                     </button>
//                     <button className={`px-4 py-2 ${darkMode ? "bg-gray-800 border border-indigo-400 text-indigo-300" : "bg-white border border-indigo-600 text-indigo-600"} rounded-lg hover:bg-indigo-50 transition-colors`}>
//                       Ask a Question
//                     </button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </div>

//           {/* Recommendations Section */}
//           <div className="mb-12">
//             <SectionHeader 
//               title="Personalized Recommendations" 
//               icon={<FaLeaf className="text-teal-500" />}
//               isExpanded={expandedSections.recommendations}
//               toggleExpanded={toggleSection}
//               id="recommendations"
//             />
            
//             {expandedSections.recommendations && (
//               <motion.div
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="mt-6 space-y-8"
//               >
//                 {/* Diet Plan */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
//                   <div className="p-6">
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-green-400" : "text-green-600"}`}>7-Day Diet Plan</h3>
                    
//                     {/* Diet plan type selector */}
//                     <div className="flex mb-6 border rounded-lg overflow-hidden">
//                       <button 
//                         className={`flex-1 py-2 px-4 flex items-center justify-center ${activeDietPlan === "vegetarian" 
//                           ? `${darkMode ? "bg-green-700 text-white" : "bg-green-500 text-white"}` 
//                           : `${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`
//                         }`}
//                         onClick={() => setActiveDietPlan("vegetarian")}
//                       >
//                         <FaLeaf className="mr-2" /> Vegetarian
//                       </button>
//                       <button 
//                         className={`flex-1 py-2 px-4 flex items-center justify-center ${activeDietPlan === "nonVegetarian" 
//                           ? `${darkMode ? "bg-green-700 text-white" : "bg-green-500 text-white"}` 
//                           : `${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`
//                         }`}
//                         onClick={() => setActiveDietPlan("nonVegetarian")}
//                       >
//                         <FaUtensils className="mr-2" /> Non-Vegetarian
//                       </button>
//                     </div>
                    
//                     <div className="prose max-w-none">
//                       {parsedData.dietPlan && parsedData.dietPlan[activeDietPlan === "vegetarian" ? "vegetarian" : "nonVegetarian"] ? (
//                         <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                           {parsedData.dietPlan[activeDietPlan === "vegetarian" ? "vegetarian" : "nonVegetarian"]}
//                         </div>
//                       ) : (
//                         <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No diet plan available.</p>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 {/* Exercise Plan */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
//                   <div className="p-6">
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-orange-400" : "text-orange-600"}`}>Exercise Regimen</h3>
//                     <div className="prose max-w-none">
//                       {parsedData.exercisePlan ? (
//                         renderList(parsedData.exercisePlan) || (
//                           <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                             {parsedData.exercisePlan}
//                           </div>
//                         )
//                       ) : (
//                         <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No exercise plan available.</p>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 {/* Lifestyle Tips */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
//                   <div className="p-6">
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>Lifestyle Modifications</h3>
//                     <div className="prose max-w-none">
//                       {parsedData.lifestyleTips ? (
//                         renderList(parsedData.lifestyleTips) || (
//                           <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                             {parsedData.lifestyleTips}
//                           </div>
//                         )
//                       ) : (
//                         <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No lifestyle tips available.</p>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 {/* Supplements */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
//                   <div className="p-6">
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-purple-400" : "text-purple-600"}`}>Supplements & Nutrition</h3>
//                     <div className="prose max-w-none">
//                       {parsedData.supplements ? (
//                         renderList(parsedData.supplements) || (
//                           <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                             {parsedData.supplements}
//                           </div>
//                         )
//                       ) : (
//                         <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No supplement recommendations available.</p>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 {/* Health Products */}
//                 {parsedData.healthProducts && (
//                   <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
//                     <div className="p-6">
//                       <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-teal-400" : "text-teal-600"}`}>Recommended Products</h3>
//                       <div className="prose max-w-none">
//                         {renderList(parsedData.healthProducts) || (
//                           <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                             {parsedData.healthProducts}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </motion.div>
//             )}
//           </div>
          
//           {/* Visualizations Section */}
//           <div className="mb-12">
//             <SectionHeader 
//               title="Health Analytics" 
//               icon={<FaChartBar className="text-purple-500" />}
//               isExpanded={expandedSections.visualizations}
//               toggleExpanded={toggleSection}
//               id="visualizations"
//             />
            
//             {expandedSections.visualizations && (
//               <motion.div
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//                 className="mt-6 space-y-8"
//               >
//                 {/* Blood Parameters Visualization */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
//                   <div className="p-6">
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-red-400" : "text-red-600"}`}>Blood Parameters</h3>
                    
//                     {parsedData.visualData?.bloodParameters && parsedData.visualData.bloodParameters.length > 0 ? (
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {parsedData.visualData.bloodParameters.map((param, idx) => (
//                           <ProgressBar 
//                             key={idx}
//                             label={param.name}
//                             value={param.value}
//                             min={param.min}
//                             max={param.max}
//                             unit={param.unit}
//                           />
//                         ))}
//                       </div>
//                     ) : (
//                       <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No blood parameter data available for visualization.</p>
//                     )}
//                   </div>
//                 </motion.div>
                
//                 {/* Nutrition Data Visualization */}
                
                
//                 {/* Vital Signs */}
                
//               </motion.div>
//             )}
//           </div>
          
//           {/* Reminders and Follow-ups */}
//           <div className="mb-12">
//             <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
//               <div className="p-6">
//                 <div className="flex items-center mb-4">
//                   <FaCalendarCheck className={`${darkMode ? "text-blue-400" : "text-blue-600"} mr-3`} />
//                   <h3 className={`text-xl font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Reminders & Follow-ups</h3>
//                 </div>
                
//                 <div className="prose max-w-none">
//                   {parsedData.reminders ? (
//                     renderList(parsedData.reminders) || (
//                       <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                         {parsedData.reminders}
//                       </div>
//                     )
//                   ) : (
//                     <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No specific reminders or follow-ups.</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Motivational Note */}
//           {parsedData.motivationalNote && (
//             <div className="mb-12">
//               <div className={`${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"} rounded-xl shadow-md overflow-hidden`}>
//                 <div className="p-6">
//                   <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>A Note for You</h3>
//                   <div className="prose max-w-none">
//                     <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"} italic`}>
//                       "{parsedData.motivationalNote}"
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* Footer */}
//         <footer className={`text-center py-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//           <p><b>||This health report is for informational purposes only and should not replace professional medical advice.||</b></p>
          
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default HDashboard;


import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Icons
import { 
  FaSun, FaMoon, FaDownload, FaHome, 
  FaUtensils, FaDumbbell, FaLeaf, FaPills, 
  FaHeartbeat, FaCalendarCheck, FaChartBar
} from "react-icons/fa";

const HDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportData = location.state?.reportData || { summary: "", rawText: "" };
  const [darkMode, setDarkMode] = useState(false);
  const dashboardRef = useRef(null);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    recommendations: true,
    visualizations: true
  });
  
  // Add state for diet plan toggle
  const [activeDietPlan, setActiveDietPlan] = useState("vegetarian");
  
  // Parse the summary text to extract different sections
  const [parsedData, setParsedData] = useState({
    healthSummary: "",
    goodNews: "",
    areasOfConcern: "",
    redFlags: "",
    doctorAdvice: "",
    dietPlan: {
      vegetarian: "",
      nonVegetarian: ""
    },
    parsedDietPlan: {
      vegetarian: [],
      nonVegetarian: []
    },
    exercisePlan: "",
    parsedExercisePlan: [],
    lifestyleTips: "",
    supplements: "",
    healthProducts: "",
    reminders: "",
    motivationalNote: "",
    visualData: {
      bloodParameters: [],
      vitalSigns: [],
      nutritionData: []
    }
  });
  
  useEffect(() => {
    if (reportData.summary) {
      parseHealthReport(reportData.summary);
    } else {
      navigate("/upload");
    }
  }, [reportData, navigate]);
  
  const parseHealthReport = (text) => {
    if (!text) return;
    
    // Extract health summary
    const healthSummary = extractSection(text, "**A. Health Summary 🩺**", "✅ **Good News 🎉**");
    
    // Extract good news
    const goodNews = extractSection(text, "✅ **Good News 🎉**", "⚠️ **Areas of Concern**");
    
    // Extract areas of concern
    const areasOfConcern = extractSection(text, "⚠️ **Areas of Concern**", "**B. Red Flags & Concerns ⚠️**");
    
    // Extract red flags
    const redFlags = extractSection(text, "**B. Red Flags & Concerns ⚠️**", "**C. Simulated Doctor Advice 👨‍⚕️**");
    
    // Extract doctor advice
    const doctorAdvice = extractSection(text, "**C. Simulated Doctor Advice 👨‍⚕️**", "**D. 7-Day Diet Plan 🍽️**");
    
    // Extract vegetarian diet plan
    const vegetarianDietPlan = extractSection(text, "🥬 **Vegetarian**", "🍗 **Non-Vegetarian**");
    
    // Extract non-vegetarian diet plan
    const nonVegetarianDietPlan = extractSection(text, "🍗 **Non-Vegetarian**", "**E. 7-Day Exercise Plan 🏃**");
    
    // Extract exercise plan
    const exercisePlan = extractSection(text, "**E. 7-Day Exercise Plan 🏃**", "**F. Lifestyle Tips 🌿**");
    
    // Extract lifestyle tips
    const lifestyleTips = extractSection(text, "**F. Lifestyle Tips 🌿**", "**G. Supplements & Food Suggestions 💊**");
    
    // Extract supplements
    const supplements = extractSection(text, "**G. Supplements & Food Suggestions 💊**", "**H. Health Product Suggestions (Optional) 🏥**");
    
    // Extract health products
    const healthProducts = extractSection(text, "**H. Health Product Suggestions (Optional) 🏥**", "**I. Reminders & Follow-ups 🔁**");
    
    // Extract reminders
    const reminders = extractSection(text, "**I. Reminders & Follow-ups 🔁**", "❣️ **L. Motivational Note – Uplifting Closing Message**");
    
    // Extract motivational note
    const motivationalNote = extractSection(text, "❣️ **L. Motivational Note – Uplifting Closing Message**", "THIS IS FRONTEND TO FETCH IT");
    
    // Extract numerical values for visualization
    const bloodParameters = extractNumericalValues(areasOfConcern);
    
    // Parse Diet Plans to structured format
    const parsedVegetarianDiet = parseDietPlan(vegetarianDietPlan);
    const parsedNonVegetarianDiet = parseDietPlan(nonVegetarianDietPlan);
    
    // Parse Exercise Plan to structured format
    const parsedExercise = parseExercisePlan(exercisePlan);
    
    const parsed = {
      healthSummary,
      goodNews,
      areasOfConcern,
      redFlags,
      doctorAdvice,
      dietPlan: {
        vegetarian: vegetarianDietPlan,
        nonVegetarian: nonVegetarianDietPlan
      },
      parsedDietPlan: {
        vegetarian: parsedVegetarianDiet,
        nonVegetarian: parsedNonVegetarianDiet
      },
      exercisePlan,
      parsedExercisePlan: parsedExercise,
      lifestyleTips,
      supplements,
      healthProducts,
      reminders,
      motivationalNote,
      visualData: {
        bloodParameters
      }
    };
    
    setParsedData(parsed);
  };
  
  // Helper function to extract section between markers
  const extractSection = (text, startMarker, endMarker) => {
    try {
      if (!text) return "";
      
      const startIndex = text.indexOf(startMarker);
      if (startIndex === -1) return "";
      
      let endIndex;
      if (endMarker) {
        endIndex = text.indexOf(endMarker, startIndex);
        if (endIndex === -1) endIndex = text.length;
      } else {
        endIndex = text.length;
      }
      
      return text.substring(startIndex + startMarker.length, endIndex).trim();
    } catch (error) {
      console.error("Error extracting section:", error);
      return "";
    }
  };
  
  // Function to parse diet plans into structured format
  const parseDietPlan = (dietText) => {
    if (!dietText) return [];
    
    const dayRegex = /\*\*Day (\d+):\*\* Breakfast: (.*?); Lunch: (.*?); Dinner: (.*?)\.?$/gm;
    const days = [];
    let match;
    
    // If the format is different (with bullet points)
    if (!dayRegex.test(dietText)) {
      const lines = dietText.split("\n").filter(line => line.trim());
      
      for (const line of lines) {
        // Match pattern like "* **Day 1:** Breakfast: X; Lunch: Y; Dinner: Z."
        const altMatch = line.match(/\*\s*\*\*Day (\d+):\*\* Breakfast: (.*?); Lunch: (.*?); Dinner: (.*?)\.?$/);
        
        if (altMatch) {
          days.push({
            day: parseInt(altMatch[1]),
            breakfast: altMatch[2].trim(),
            lunch: altMatch[3].trim(),
            dinner: altMatch[4].trim()
          });
        }
      }
    } else {
      // Reset regex lastIndex
      dayRegex.lastIndex = 0;
      
      while ((match = dayRegex.exec(dietText)) !== null) {
        days.push({
          day: parseInt(match[1]),
          breakfast: match[2].trim(),
          lunch: match[3].trim(),
          dinner: match[4].trim()
        });
      }
    }
    
    return days;
  };
  
  // Function to parse exercise plan into structured format
  const parseExercisePlan = (exerciseText) => {
    if (!exerciseText) return [];
    
    // Look for exercise details by day
    const days = [];
    const dayPattern = /\*\*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\*\* (.*?)(?=\n\*\*|\n$|$)/gs;
    
    let match;
    while ((match = dayPattern.exec(exerciseText)) !== null) {
      days.push({
        day: match[1],
        activity: match[2].trim()
      });
    }
    
    return days;
  };
  
  // Extract numerical values for visualization
  const extractNumericalValues = (text) => {
    const bloodParams = [];
    
    if (!text) return bloodParams;
    
    // This regex looks for table-like structures in the text
    const regex = /\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      const name = match[1].trim();
      const value = parseFloat(match[2]);
      
      // Parse range (assuming format like "12.0-16.0 g/dl")
      const rangeMatch = match[3].match(/(\d+\.?\d*)-(\d+\.?\d*)\s*([^\s]*)/);
      
      if (rangeMatch && !isNaN(value)) {
        const min = parseFloat(rangeMatch[1]);
        const max = parseFloat(rangeMatch[2]);
        const unit = rangeMatch[3] || "";
        
        bloodParams.push({
          name,
          value,
          min,
          max,
          unit
        });
      }
    }
    
    return bloodParams;
  };
  
  const downloadReport = async () => {
    try {
      // Check if reportData.summary is available
      if (!reportData.summary) {
        alert("No summary data found to download.");
        return;
      }
  
      // Create a blob with the summary data
      const blob = new Blob([reportData.summary], { type: 'text/plain' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'health_report_summary.txt';
  
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const renderTable = (content) => {
    if (!content) return null;
    
    // Split into lines and filter out empty lines and separator lines
    const lines = content.split('\n')
      .filter(line => line.trim() && !line.trim().match(/^[-:| ]+$/));
    
    if (lines.length < 2) return null;
    
    // Check if this looks like a table by counting pipes
    const isProbablyTable = lines.some(line => (line.match(/\|/g) || []).length >= 3);
    
    if (!isProbablyTable) {
      // Render as normal text if it doesn't look like a table
      return (
        <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          {content}
        </div>
      );
    }
    
    // Extract headers from first line with pipe formatting
    const headerLine = lines[0];
    const headers = headerLine.split('|')
      .map(header => header.trim())
      .filter(header => header);
    
    // Process rows - skip the first line (headers)
    const rows = lines.slice(1).map(line => {
      return line.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '');
    }).filter(row => row.length > 1); // Ensure we have actual rows with data
    
    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? (darkMode ? "bg-gray-800" : "bg-white") : (darkMode ? "bg-gray-700" : "bg-gray-50")}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-200" : "text-gray-500"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderList = (content) => {
    if (!content) return null;
    
    // Check if the content contains bullet points
    const hasBulletPoints = content.includes("* ") || content.includes("- ");
    
    if (!hasBulletPoints) {
      // If no bullet points, render as normal text
      return (
        <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          {content}
        </div>
      );
    }
    
    const listItems = content
      .split("\n")
      .filter(line => line.trim().startsWith("* ") || line.trim().startsWith("- "))
      .map(line => line.replace(/^\*\s|-\s/, "").trim());
      
    return (
      <ul className="list-disc pl-5 space-y-2 mt-4">
        {listItems.map((item, idx) => (
          <li key={idx} className={`text-sm md:text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{item}</li>
        ))}
      </ul>
    );
  };
  
  const renderContent = (content) => {
    if (!content) return null;
    
    // Check if content contains table markers
    if (content.includes("|") && content.includes("-|-")) {
      return renderTable(content);
    }
    
    // Check if content contains list markers
    if (content.includes("* ") || content.includes("- ")) {
      return renderList(content);
    }
    
    // Default to plain text rendering
    return (
      <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
        {content}
      </div>
    );
  };
  
  // Render diet plan as table
  const renderDietPlanTable = (dietPlan) => {
    if (!dietPlan || dietPlan.length === 0) return (
      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No diet plan available.</p>
    );

    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Day</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Breakfast</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Lunch</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Dinner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dietPlan.map((day, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? (darkMode ? "bg-gray-800" : "bg-white") : (darkMode ? "bg-gray-700" : "bg-gray-50")}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>Day {day.day}</td>
                <td className={`px-6 py-4 text-sm ${darkMode ? "text-gray-200" : "text-gray-500"}`}>{day.breakfast}</td>
                <td className={`px-6 py-4 text-sm ${darkMode ? "text-gray-200" : "text-gray-500"}`}>{day.lunch}</td>
                <td className={`px-6 py-4 text-sm ${darkMode ? "text-gray-200" : "text-gray-500"}`}>{day.dinner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render exercise plan as table
  const renderExercisePlanTable = ({ darkMode = false, exercisePlan = [
    { day: "Monday", activity: "Gentle Yoga (20 minutes), Rest" },
    { day: "Tuesday", activity: "30-minute brisk walk" },
    { day: "Wednesday", activity: "Rest or light stretching (15 minutes)" },
    { day: "Thursday", activity: "30-minute walk" },
    { day: "Friday", activity: "Gentle Yoga (20 minutes)" },
    { day: "Saturday", activity: "Rest or light stretching (15 minutes)" },
    { day: "Sunday", activity: "30-minute walk" }
  ] }) => {
    if (!exercisePlan || exercisePlan.length === 0) return (
      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No exercise plan available.</p>
    );
  
    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Day</th>
              <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {exercisePlan.map((day, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? (darkMode ? "bg-gray-800" : "bg-white") : (darkMode ? "bg-gray-700" : "bg-gray-50")}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{day.day}</td>
                <td className={`px-6 py-4 text-sm ${darkMode ? "text-gray-200" : "text-gray-500"}`}>{day.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Example usage:
  // <ExercisePlanTable darkMode={true} />
  // or with custom exercise plan:
  // <ExercisePlanTable exercisePlan={customPlan} />
   
  const ProgressBar = ({ value, min, max, label, unit }) => {
    // Calculate percentage of value within range
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    
    // Determine color based on where the value falls in the range
    let statusColor = darkMode ? "bg-blue-600" : "bg-blue-400";
    if (percentage < 25) statusColor = darkMode ? "bg-indigo-600" : "bg-indigo-400";
    if (percentage > 75) statusColor = darkMode ? "bg-teal-600" : "bg-teal-400";
    
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{label}</span>
          <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{value} {unit}</span>
        </div>
        <div className={`w-full h-2.5 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full`}>
          <div 
            className={`h-2.5 rounded-full ${statusColor}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className={`flex justify-between text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  };
  
  const SectionHeader = ({ title, icon, isExpanded, toggleExpanded, id }) => {
    return (
      <div 
        className="flex items-center justify-between cursor-pointer py-4"
        onClick={() => toggleExpanded(id)}
      >
        <div className="flex items-center">
          {icon}
          <h2 className={`text-2xl font-bold ml-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>{title}</h2>
        </div>
        <button className={`w-8 h-8 flex items-center justify-center rounded-full ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
          {isExpanded ? 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            :
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          }
        </button>
      </div>
    );
  };

  const toggleSection = (sectionId) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId]
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Health Report</h1>
            <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Your comprehensive health analysis and personalized recommendations
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"} hover:shadow-md transition-all duration-300`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            <button
              onClick={downloadReport}
              className="flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
            >
              <FaDownload className="mr-2" />
              Download Raw Report
            </button>
            
            <button
              onClick={() => navigate("/dashboard")}
              className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"} hover:bg-gray-300 transition-all duration-300`}
            >
              <FaHome className="mr-2" />
              Home
            </button>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="mb-16" ref={dashboardRef}>
          {/* Health Summary Section */}
          <div className="mb-12">
            <SectionHeader 
              title="Your Health Summary" 
              icon={<FaHeartbeat className="text-blue-500" />}
              isExpanded={expandedSections.summary}
              toggleExpanded={toggleSection}
              id="summary"
            />
            
            {expandedSections.summary && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 space-y-8"
              >
                {/* Health Overview Card */}
                <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>Health Overview</h3>
                    <div className="prose max-w-none">
                      {parsedData.healthSummary ? (
                        <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {parsedData.healthSummary}
                        </div>
                      ) : (
                        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No health summary available.</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Good News & Areas of Concern */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`${darkMode ? "bg-green-900" : "bg-green-50"} rounded-xl shadow-sm p-6`}>
                    <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-green-300" : "text-green-700"}`}>Positive Findings</h3>
                    <div className="prose max-w-none">
                      {parsedData.goodNews ? (
                        renderList(parsedData.goodNews) || (
                          <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {parsedData.goodNews}
                          </div>
                        )
                      ) : (
                        <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No specific positive findings to report.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className={`${darkMode ? "bg-blue-900" : "bg-blue-50"} rounded-xl shadow-sm p-6`}>
                    <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>Areas for Attention</h3>
                    {parsedData.areasOfConcern ? (
                      renderTable(parsedData.areasOfConcern) || (
                        <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {parsedData.areasOfConcern}
                        </div>
                      )
                    ) : (
                      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No specific areas of concern identified.</p>
                    )}
                  </div>
                </motion.div>
                {/* Red Flags Card */}
                <motion.div variants={itemVariants} className={`${darkMode ? "bg-red-900" : "bg-red-50"} rounded-xl shadow-sm p-6 mt-6`}>
                  <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-red-300" : "text-red-700"}`}>Health Alerts</h3>
                  <div className="prose max-w-none">
                    {parsedData.redFlags ? (
                      renderList(parsedData.redFlags) || (
                        <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {parsedData.redFlags}
                        </div>
                      )
                    ) : (
                      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No critical health alerts to report.</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
          
          {/* Recommendations Section */}
          <div className="mb-12">
            <SectionHeader 
              title="Your Personalized Plan" 
              icon={<FaCalendarCheck className="text-green-500" />}
              isExpanded={expandedSections.recommendations}
              toggleExpanded={toggleSection}
              id="recommendations"
            />
            
            {expandedSections.recommendations && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-6 space-y-8"
              >
                {/* Doctor's Advice */}
                <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
                  <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
                    Doctor's Recommendations
                  </h3>
                  <div className="prose max-w-none">
                    {parsedData.doctorAdvice ? (
                      <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {parsedData.doctorAdvice}
                      </div>
                    ) : (
                      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No doctor recommendations available.</p>
                    )}
                  </div>
                </motion.div>
                
                {/* Diet Plan */}
                <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-xl font-semibold ${darkMode ? "text-orange-400" : "text-orange-600"}`}>
                        <span className="flex items-center"><FaUtensils className="mr-2" /> 7-Day Diet Plan</span>
                      </h3>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setActiveDietPlan("vegetarian")}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                            activeDietPlan === "vegetarian" 
                              ? (darkMode ? "bg-green-600 text-white" : "bg-green-500 text-white") 
                              : (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600")
                          }`}
                        >
                          <span className="flex items-center"><FaLeaf className="mr-1" /> Vegetarian</span>
                        </button>
                        
                        <button 
                          onClick={() => setActiveDietPlan("nonVegetarian")}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                            activeDietPlan === "nonVegetarian" 
                              ? (darkMode ? "bg-red-600 text-white" : "bg-red-500 text-white") 
                              : (darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600")
                          }`}
                        >
                          <span>Non-Vegetarian</span>
                        </button>
                      </div>
                    </div>
                    
                    {activeDietPlan === "vegetarian" ? (
                      renderDietPlanTable(parsedData.parsedDietPlan.vegetarian)
                    ) : (
                      renderDietPlanTable(parsedData.parsedDietPlan.nonVegetarian)
                    )}
                  </div>
                </motion.div>
                
                {/* Exercise Plan */}
                <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-4 flex items-center ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                      <FaDumbbell className="mr-2" /> 7-Day Exercise Plan
                    </h3>
                    
                    {renderExercisePlanTable(parsedData.parsedExercisePlan)}
                  </div>
                </motion.div>
                
                {/* Lifestyle Tips */}
                <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-4 flex items-center ${darkMode ? "text-green-400" : "text-green-600"}`}>
                      <FaLeaf className="mr-2" /> Lifestyle Recommendations
                    </h3>
                    
                    {parsedData.lifestyleTips ? (
                      renderList(parsedData.lifestyleTips) || (
                        <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {parsedData.lifestyleTips}
                        </div>
                      )
                    ) : (
                      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No lifestyle recommendations available.</p>
                    )}
                  </div>
                </motion.div>
                
                {/* Supplements */}
                <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-4 flex items-center ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                      <FaPills className="mr-2" /> Supplements & Nutrition
                    </h3>
                    
                    {parsedData.supplements ? (
                      renderList(parsedData.supplements) || (
                        <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {parsedData.supplements}
                        </div>
                      )
                    ) : (
                      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No supplement recommendations available.</p>
                    )}
                  </div>
                </motion.div>
                
                {/* Health Products */}
                <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
                      Suggested Health Products
                    </h3>
                    
                    {parsedData.healthProducts ? (
                      renderList(parsedData.healthProducts) || (
                        <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {parsedData.healthProducts}
                        </div>
                      )
                    ) : (
                      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No product recommendations available.</p>
                    )}
                  </div>
                </motion.div>
                
                {/* Reminders */}
                <motion.div variants={itemVariants} className={`${darkMode ? "bg-indigo-900" : "bg-indigo-50"} rounded-xl shadow-md overflow-hidden`}>
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                      Follow-up Reminders
                    </h3>
                    
                    {parsedData.reminders ? (
                      renderList(parsedData.reminders) || (
                        <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {parsedData.reminders}
                        </div>
                      )
                    ) : (
                      <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No follow-up reminders available.</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>
          
          {/* Visualizations Section */}
          
          
          {/* Motivational Note */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6 mb-8`}
          >
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
              Your Health Journey
            </h3>
            
            {parsedData.motivationalNote ? (
              <div className={`whitespace-pre-wrap italic ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                "{parsedData.motivationalNote}"
              </div>
            ) : (
              <p className={`italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                "Your health is an investment, not an expense. The small steps you take today will lead to a healthier tomorrow."
              </p>
            )}
          </motion.div>
        </div>
        
        {/* Footer */}
        <footer className={`py-6 text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <p className="text-sm">&copy; {new Date().getFullYear()} Health Report Dashboard. All rights reserved.</p>
          <p className="text-xs mt-2">Disclaimer: This report is generated based on your provided data and should not replace professional medical advice.</p>
        </footer>
      </div>
    </div>
  );
};

export default HDashboard;