

// WORKING
// import React, { useState, useEffect } from "react";
// import { 
//   FaFilePdf, 
//   FaChartLine, 
//   FaCalendarAlt, 
//   FaDownload, 
//   FaExchangeAlt, 
//   FaHistory, 
//   FaArrowLeft, 
//   FaArrowRight,
//   FaInfoCircle
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const UserDashboard = () => {
//   const [userName, setUserName] = useState("Jane Doe");
//   const [loadingDashboard, setLoadingDashboard] = useState(true);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [comparisonMode, setComparisonMode] = useState(false);
//   const [reportToCompare, setReportToCompare] = useState(null);
//   const [selectedMetric, setSelectedMetric] = useState("glucose");
//   const [comparisonData, setComparisonData] = useState(null);
//   const [activeTab, setActiveTab] = useState("uploaded");
//   const [showTrends, setShowTrends] = useState(false);
//   const [healthSummary, setHealthSummary] = useState(null);
//   const [highlightedReport, setHighlightedReport] = useState(null);

//   // Mock health metrics for comparison visualization
//   const metrics = {
//     glucose: { label: "Blood Glucose", unit: "mg/dL", normalRange: "70-100" },
//     cholesterol: { label: "Cholesterol", unit: "mg/dL", normalRange: "125-200" },
//     bloodPressure: { label: "Blood Pressure", unit: "mmHg", normalRange: "120/80" },
//     hemoglobin: { label: "Hemoglobin", unit: "g/dL", normalRange: "12-16" },
//     wbc: { label: "White Blood Cells", unit: "K/μL", normalRange: "4.5-11.0" }
//   };

//   // Mock uploaded reports
//   const mockUploadedReports = [
//     {
//       id: "rep1",
//       name: "Annual Health Checkup",
//       uploadDate: "2024-09-15T14:30:00Z",
//       provider: "City Hospital",
//       thumbnailUrl: "/api/placeholder/150/200",
//       fileType: "pdf",
//       fileSize: "3.2 MB",
//       summary: {
//         glucose: 94,
//         cholesterol: 175,
//         bloodPressure: "118/78",
//         hemoglobin: 13.8,
//         wbc: 5.9
//       }
//     },
//     {
//       id: "rep2",
//       name: "Cardiac Evaluation",
//       uploadDate: "2024-07-22T09:15:00Z",
//       provider: "Heart Center",
//       thumbnailUrl: "/api/placeholder/150/200",
//       fileType: "pdf",
//       fileSize: "2.8 MB",
//       summary: {
//         glucose: 86,
//         cholesterol: 190,
//         bloodPressure: "122/82",
//         hemoglobin: 14.1,
//         wbc: 6.5
//       }
//     },
//     {
//       id: "rep3",
//       name: "Blood Work Analysis",
//       uploadDate: "2024-04-05T11:00:00Z",
//       provider: "Lab Services Plus",
//       thumbnailUrl: "/api/placeholder/150/200",
//       fileType: "pdf",
//       fileSize: "1.9 MB",
//       summary: {
//         glucose: 102,
//         cholesterol: 215,
//         bloodPressure: "125/85",
//         hemoglobin: 12.9,
//         wbc: 7.2
//       }
//     }
//   ];

//   // Mock generated reports
//   const mockGeneratedReports = [
//     {
//       id: "gen1",
//       name: "Health Analysis Report",
//       generationDate: "2024-09-16T16:45:00Z",
//       fileType: "pdf",
//       fileSize: "1.4 MB",
//       summaryText: "Overall health indicators within normal range. Slight improvement in cholesterol levels."
//     },
//     {
//       id: "gen2",
//       name: "Quarterly Health Trends",
//       generationDate: "2024-07-25T14:20:00Z",
//       fileType: "pdf",
//       fileSize: "2.1 MB",
//       summaryText: "Consistent blood glucose levels. Recommendation to maintain current diet and exercise regimen."
//     },
//     {
//       id: "gen3",
//       name: "Annual Health Summary",
//       generationDate: "2024-04-08T13:10:00Z",
//       fileType: "pdf",
//       fileSize: "3.5 MB",
//       summaryText: "Year-over-year improvement in multiple health metrics. Cholesterol has decreased by 15%."
//     }
//   ];

//   // Mock trend data
//   const trendData = [
//     { date: "Jan", glucose: 95, cholesterol: 210, bloodPressure: 120, hemoglobin: 13.2, wbc: 5.5 },
//     { date: "Feb", glucose: 97, cholesterol: 205, bloodPressure: 118, hemoglobin: 13.5, wbc: 5.8 },
//     { date: "Mar", glucose: 94, cholesterol: 200, bloodPressure: 115, hemoglobin: 13.7, wbc: 6.0 },
//     { date: "Apr", glucose: 102, cholesterol: 215, bloodPressure: 125, hemoglobin: 12.9, wbc: 7.2 },
//     { date: "May", glucose: 99, cholesterol: 208, bloodPressure: 122, hemoglobin: 13.1, wbc: 6.8 },
//     { date: "Jun", glucose: 92, cholesterol: 198, bloodPressure: 120, hemoglobin: 13.5, wbc: 6.2 },
//     { date: "Jul", glucose: 86, cholesterol: 190, bloodPressure: 122, hemoglobin: 14.1, wbc: 6.5 },
//     { date: "Aug", glucose: 89, cholesterol: 185, bloodPressure: 120, hemoglobin: 14.0, wbc: 6.3 },
//     { date: "Sep", glucose: 94, cholesterol: 175, bloodPressure: 118, hemoglobin: 13.8, wbc: 5.9 }
//   ];

//   // Health insights summary
//   const mockHealthSummary = {
//     overallStatus: "Good",
//     riskLevel: "Low",
//     improvements: ["Cholesterol reduced by 17%", "Blood pressure normalized"],
//     concerns: ["Slight elevation in blood glucose in April"],
//     recommendations: [
//       "Maintain current exercise regimen",
//       "Continue balanced diet",
//       "Follow up blood work in 3 months"
//     ]
//   };

//   useEffect(() => {
//     // Simulate loading the dashboard
//     const timer = setTimeout(() => {
//       setLoadingDashboard(false);
//       setHealthSummary(mockHealthSummary);
//     }, 1500);
    
//     return () => clearTimeout(timer);
//   }, []);

//   const formatDate = (date) => {
//     if (!date) return "Unknown date";
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const handleReportSelect = (report) => {
//     setSelectedReport(report);
//     setHighlightedReport(null);
//     setComparisonMode(false);
//     setComparisonData(null);
//     setReportToCompare(null);
//   };

//   const handleReportToCompareSelect = (report) => {
//     setReportToCompare(report);
//     setHighlightedReport(null);
//   };

//   const toggleComparisonMode = () => {
//     setComparisonMode(!comparisonMode);
//     if (!comparisonMode) {
//       setReportToCompare(null);
//       setComparisonData(null);
//     }
//   };

//   const handleCompare = () => {
//     if (!selectedReport || !reportToCompare) return;

//     // Generate comparison data between the two reports
//     const generatedData = {
//       reports: [selectedReport, reportToCompare],
//       dates: [
//         formatDate(selectedReport.uploadDate || selectedReport.generationDate), 
//         formatDate(reportToCompare.uploadDate || reportToCompare.generationDate)
//       ],
//       values: {},
//       differences: {},
//       percentChanges: {}
//     };

//     Object.keys(metrics).forEach(key => {
//       if (selectedReport.summary && reportToCompare.summary) {
//         if (key === 'bloodPressure') {
//           const [sys1, dia1] = selectedReport.summary[key].split('/').map(Number);
//           const [sys2, dia2] = reportToCompare.summary[key].split('/').map(Number);
          
//           generatedData.values[key] = [
//             selectedReport.summary[key],
//             reportToCompare.summary[key]
//           ];
          
//           generatedData.differences[key] = {
//             systolic: sys1 - sys2,
//             diastolic: dia1 - dia2
//           };
          
//           generatedData.percentChanges[key] = {
//             systolic: ((sys1 - sys2) / sys2 * 100).toFixed(1),
//             diastolic: ((dia1 - dia2) / dia2 * 100).toFixed(1)
//           };
//         } else {
//           const val1 = selectedReport.summary[key];
//           const val2 = reportToCompare.summary[key];
          
//           generatedData.values[key] = [val1, val2];
//           generatedData.differences[key] = (val1 - val2).toFixed(1);
//           generatedData.percentChanges[key] = ((val1 - val2) / val2 * 100).toFixed(1);
//         }
//       }
//     });
    
//     setComparisonData(generatedData);
//   };

//   // Convert blood pressure for charting
//   const processTrendDataForChart = (data) => {
//     return data.map(item => {
//       const newItem = {...item};
//       if (typeof item.bloodPressure === 'string' && item.bloodPressure.includes('/')) {
//         const [systolic, diastolic] = item.bloodPressure.split('/').map(Number);
//         newItem.systolic = systolic;
//         newItem.diastolic = diastolic;
//         delete newItem.bloodPressure;
//       }
//       return newItem;
//     });
//   };

//   const chartTrendData = processTrendDataForChart(trendData);

//   // Get color based on metric value comparison to normal range
//   const getMetricValueColor = (metricKey, value) => {
//     if (metricKey === "bloodPressure") return "text-blue-600";
    
//     const normalRange = metrics[metricKey].normalRange;
//     const [min, max] = normalRange.split('-').map(Number);
    
//     if (value < min) return "text-yellow-500";
//     if (value > max) return "text-red-500";
//     return "text-green-500";
//   };

//   if (loadingDashboard) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
//         <div className="flex flex-col items-center">
//           <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//           <motion.p 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5 }}
//             className="mt-6 text-blue-600 font-medium text-lg"
//           >
//             Loading your health records...
//           </motion.p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
//       <div className="container mx-auto px-4 py-8">
//         {/* Dashboard Header */}
//         <motion.div
//           className="mb-8"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-800">Health Dashboard</h1>
//               <p className="text-gray-600 mt-2 text-lg">
//                 Welcome back, <span className="font-semibold">Mansi</span>
//               </p>
//             </div>
//             <motion.div 
//               whileHover={{ scale: 1.05 }}
//               className="bg-white rounded-xl shadow-md p-4 flex items-center"
//             >
//               <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
//                 <FaInfoCircle className="text-green-600 text-2xl" />
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Health Status</p>
//                 <p className="text-lg font-bold text-green-600">Good</p>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Main Dashboard Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Reports and Uploads */}
//           <div className="lg:col-span-1">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="bg-white rounded-xl shadow-md p-5 mb-6"
//             >
//               {/* Tabs for uploaded vs generated reports */}
//               <div className="flex border-b border-gray-200 mb-4">
//                 <button
//                   className={`px-4 py-2 font-medium text-sm ${activeTab === "uploaded" 
//                     ? "text-blue-600 border-b-2 border-blue-500" 
//                     : "text-gray-500 hover:text-gray-700"}`}
//                   onClick={() => setActiveTab("uploaded")}
//                 >
//                   Uploaded Reports
//                 </button>
//                 <button
//                   className={`px-4 py-2 font-medium text-sm ${activeTab === "generated" 
//                     ? "text-blue-600 border-b-2 border-blue-500" 
//                     : "text-gray-500 hover:text-gray-700"}`}
//                   onClick={() => setActiveTab("generated")}
//                 >
//                   Generated Insights
//                 </button>
//               </div>

//               {/* Reports List */}
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeTab}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {activeTab === "uploaded" ? (
//                     <>
//                       <h3 className="text-lg font-semibold text-gray-700 mb-3">Your Medical Reports</h3>
//                       {mockUploadedReports.map((report) => (
//                         <motion.div
//                           key={report.id}
//                           whileHover={{ scale: 1.02 }}
//                           onClick={() => handleReportSelect(report)}
//                           onMouseEnter={() => setHighlightedReport(report.id)}
//                           onMouseLeave={() => setHighlightedReport(null)}
//                           className={`mb-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
//                             selectedReport && selectedReport.id === report.id 
//                               ? "border-blue-500 bg-blue-50" 
//                               : highlightedReport === report.id
//                                 ? "border-gray-300 bg-gray-50"
//                                 : "border-gray-200 hover:border-gray-300"
//                           }`}
//                         >
//                           <div className="flex items-center">
//                             <div className="bg-blue-100 p-2 rounded-lg mr-3">
//                               <FaFilePdf className="text-blue-600" />
//                             </div>
//                             <div className="flex-grow">
//                               <h4 className="font-medium text-gray-800">{report.name}</h4>
//                               <div className="flex items-center text-xs text-gray-500 mt-1">
//                                 <FaCalendarAlt className="mr-1" /> 
//                                 {formatDate(report.uploadDate)}
//                                 <span className="mx-2">•</span>
//                                 {report.provider}
//                               </div>
//                             </div>
//                           </div>
//                         </motion.div>
//                       ))}
//                     </>
//                   ) : (
//                     <>
//                       <h3 className="text-lg font-semibold text-gray-700 mb-3">Generated Health Insights</h3>
//                       {mockGeneratedReports.map((report) => (
//                         <motion.div
//                           key={report.id}
//                           whileHover={{ scale: 1.02 }}
//                           onClick={() => handleReportSelect(report)}
//                           onMouseEnter={() => setHighlightedReport(report.id)}
//                           onMouseLeave={() => setHighlightedReport(null)}
//                           className={`mb-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
//                             selectedReport && selectedReport.id === report.id 
//                               ? "border-green-500 bg-green-50" 
//                               : highlightedReport === report.id
//                                 ? "border-gray-300 bg-gray-50"
//                                 : "border-gray-200 hover:border-gray-300"
//                           }`}
//                         >
//                           <div className="flex items-center">
//                             <div className="bg-green-100 p-2 rounded-lg mr-3">
//                               <FaChartLine className="text-green-600" />
//                             </div>
//                             <div className="flex-grow">
//                               <h4 className="font-medium text-gray-800">{report.name}</h4>
//                               <div className="flex items-center text-xs text-gray-500 mt-1">
//                                 <FaCalendarAlt className="mr-1" /> 
//                                 {formatDate(report.generationDate)}
//                               </div>
//                             </div>
//                           </div>
//                           <p className="text-sm text-gray-600 mt-2 line-clamp-2">{report.summaryText}</p>
//                         </motion.div>
//                       ))}
//                     </>
//                   )}
//                 </motion.div>
//               </AnimatePresence>
//             </motion.div>

//             {/* Health Summary Card */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               className="bg-white rounded-xl shadow-md p-5"
//             >
//               <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
//                 <FaInfoCircle className="mr-2 text-blue-500" />
//                 Health Summary
//               </h3>
              
//               {healthSummary && (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Overall Status:</span>
//                     <span className="font-medium text-green-600">{healthSummary.overallStatus}</span>
//                   </div>
                  
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Risk Level:</span>
//                     <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
//                       {healthSummary.riskLevel}
//                     </span>
//                   </div>
                  
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-700 mb-1">Improvements</h4>
//                     <ul className="text-xs text-gray-600 space-y-1">
//                       {healthSummary.improvements.map((item, idx) => (
//                         <li key={idx} className="flex items-start">
//                           <span className="text-green-500 mr-1">✓</span> {item}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
                  
//                   {healthSummary.concerns.length > 0 && (
//                     <div>
//                       <h4 className="text-sm font-medium text-gray-700 mb-1">Areas of Attention</h4>
//                       <ul className="text-xs text-gray-600 space-y-1">
//                         {healthSummary.concerns.map((item, idx) => (
//                           <li key={idx} className="flex items-start">
//                             <span className="text-yellow-500 mr-1">⚠</span> {item}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
                  
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-700 mb-1">Recommendations</h4>
//                     <ul className="text-xs text-gray-600 space-y-1">
//                       {healthSummary.recommendations.map((item, idx) => (
//                         <li key={idx} className="flex items-start">
//                           <span className="text-blue-500 mr-1">•</span> {item}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           </div>

//           {/* Middle & Right Columns - Report Viewer & Comparison */}
//           <div className="lg:col-span-2">
//             {selectedReport ? (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="bg-white rounded-xl shadow-md p-6"
//               >
//                 <div className="flex justify-between items-center mb-5">
//                   <h2 className="text-xl font-bold text-gray-800">{selectedReport.name}</h2>
//                   <div className="flex items-center space-x-2">
//                     {selectedReport.summary && (
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={toggleComparisonMode}
//                         className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
//                           comparisonMode 
//                             ? "bg-yellow-100 text-yellow-700" 
//                             : "bg-blue-100 text-blue-700"
//                         }`}
//                       >
//                         <FaExchangeAlt className="mr-1.5" />
//                         {comparisonMode ? "Cancel Comparison" : "Compare Reports"}
//                       </motion.button>
//                     )}
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center"
//                     >
//                       <FaDownload className="mr-1.5" />
//                       Download
//                     </motion.button>
//                   </div>
//                 </div>

//                 {/* Report Content */}
//                 {comparisonMode ? (
//                   // Comparison Mode UI
//                   <div>
//                     {!reportToCompare ? (
//                       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
//                         <h3 className="text-lg font-medium text-yellow-800 mb-2">Select a report to compare</h3>
//                         <p className="text-sm text-yellow-700 mb-3">
//                           Choose another report to compare with "{selectedReport.name}"
//                         </p>
                        
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                           {mockUploadedReports
//                             .filter(r => r.id !== selectedReport.id && r.summary)
//                             .map(report => (
//                               <motion.div
//                                 key={report.id}
//                                 whileHover={{ scale: 1.02 }}
//                                 onClick={() => handleReportToCompareSelect(report)}
//                                 className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors duration-200"
//                               >
//                                 <h4 className="font-medium text-gray-800">{report.name}</h4>
//                                 <p className="text-xs text-gray-500">{formatDate(report.uploadDate)}</p>
//                               </motion.div>
//                             ))}
//                         </div>
                        
//                         {mockUploadedReports.filter(r => r.id !== selectedReport.id && r.summary).length === 0 && (
//                           <p className="text-sm text-gray-600 italic">No other reports available for comparison</p>
//                         )}
//                       </div>
//                     ) : (
//                       // When a report is selected for comparison
//                       <>
//                         <div className="flex justify-between items-center mb-4">
//                           <div>
//                             <h3 className="text-lg font-medium text-gray-800">
//                               Comparing Reports
//                             </h3>
//                             <p className="text-sm text-gray-600">
//                               {selectedReport.name} vs {reportToCompare.name}
//                             </p>
//                           </div>
                          
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={handleCompare}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
//                             disabled={comparisonData !== null}
//                           >
//                             {comparisonData ? "Comparison Generated" : "Generate Comparison"}
//                           </motion.button>
//                         </div>
                      
//                         {comparisonData && (
//                           <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.5 }}
//                           >
//                             {/* Metrics Comparison */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                               {Object.keys(metrics).map(key => (
//                                 <motion.div 
//                                   key={key}
//                                   whileHover={{ scale: 1.02 }}
//                                   className={`p-4 rounded-lg border ${
//                                     selectedMetric === key 
//                                       ? "border-blue-500 bg-blue-50" 
//                                       : "border-gray-200"
//                                   }`}
//                                   onClick={() => setSelectedMetric(key)}
//                                 >
//                                   <div className="flex justify-between items-center mb-1">
//                                     <h4 className="font-medium text-gray-700">{metrics[key].label}</h4>
//                                     <span className="text-xs text-gray-500">Normal: {metrics[key].normalRange} {metrics[key].unit}</span>
//                                   </div>
                                  
//                                   {key === 'bloodPressure' ? (
//                                     <div className="grid grid-cols-2 gap-2">
//                                       <div>
//                                         <p className="text-sm text-gray-600">Systolic:</p>
//                                         <div className="flex justify-between items-center">
//                                           <div className="flex items-baseline">
//                                             <span className="text-lg font-bold">
//                                               {comparisonData.values[key][0].split('/')[0]}
//                                             </span>
//                                             <span className="text-xs text-gray-500 ml-1">mmHg</span>
//                                           </div>
//                                           <div className={`text-sm font-medium ${
//                                             comparisonData.differences[key].systolic > 0 
//                                               ? "text-red-500" 
//                                               : comparisonData.differences[key].systolic < 0 
//                                                 ? "text-green-500" 
//                                                 : "text-gray-500"
//                                           }`}>
//                                             {comparisonData.differences[key].systolic > 0 && "+"}
//                                             {comparisonData.differences[key].systolic} ({comparisonData.percentChanges[key].systolic}%)
//                                           </div>
//                                         </div>
//                                       </div>
//                                       <div>
//                                         <p className="text-sm text-gray-600">Diastolic:</p>
//                                         <div className="flex justify-between items-center">
//                                           <div className="flex items-baseline">
//                                             <span className="text-lg font-bold">
//                                               {comparisonData.values[key][0].split('/')[1]}
//                                             </span>
//                                             <span className="text-xs text-gray-500 ml-1">mmHg</span>
//                                           </div>
//                                           <div className={`text-sm font-medium ${
//                                             comparisonData.differences[key].diastolic > 0 
//                                               ? "text-red-500" 
//                                               : comparisonData.differences[key].diastolic < 0 
//                                                 ? "text-green-500" 
//                                                 : "text-gray-500"
//                                           }`}>
//                                             {comparisonData.differences[key].diastolic > 0 && "+"}
//                                             {comparisonData.differences[key].diastolic} ({comparisonData.percentChanges[key].diastolic}%)
//                                           </div>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   ) : (
//                                     <div className="flex justify-between items-center">
//                                       <div className="flex items-baseline">
//                                       <span className="text-lg font-bold">
//                                           {comparisonData.values[key][0]}
//                                         </span>
//                                         <span className="text-xs text-gray-500 ml-1">{metrics[key].unit}</span>
//                                       </div>
//                                       <div className={`text-sm font-medium ${
//                                         comparisonData.differences[key] > 0 
//                                           ? "text-red-500" 
//                                           : comparisonData.differences[key] < 0 
//                                             ? "text-green-500" 
//                                             : "text-gray-500"
//                                       }`}>
//                                         {comparisonData.differences[key] > 0 && "+"}
//                                         {comparisonData.differences[key]} ({comparisonData.percentChanges[key]}%)
//                                       </div>
//                                     </div>
//                                   )}
//                                 </motion.div>
//                               ))}
//                             </div>
                            
//                             {/* Visual Comparison Chart */}
//                             <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                               <h4 className="text-md font-medium text-gray-700 mb-3">
//                                 {metrics[selectedMetric].label} Comparison
//                               </h4>
//                               <div className="h-64">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                   {selectedMetric === 'bloodPressure' ? (
//                                     <BarChart
//                                       data={[
//                                         {
//                                           name: comparisonData.dates[0],
//                                           systolic: parseInt(comparisonData.values[selectedMetric][0].split('/')[0]),
//                                           diastolic: parseInt(comparisonData.values[selectedMetric][0].split('/')[1])
//                                         },
//                                         {
//                                           name: comparisonData.dates[1],
//                                           systolic: parseInt(comparisonData.values[selectedMetric][1].split('/')[0]),
//                                           diastolic: parseInt(comparisonData.values[selectedMetric][1].split('/')[1])
//                                         }
//                                       ]}
//                                       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                                     >
//                                       <CartesianGrid strokeDasharray="3 3" />
//                                       <XAxis dataKey="name" />
//                                       <YAxis />
//                                       <Tooltip />
//                                       <Legend />
//                                       <Bar dataKey="systolic" name="Systolic" fill="#8884d8" />
//                                       <Bar dataKey="diastolic" name="Diastolic" fill="#82ca9d" />
//                                     </BarChart>
//                                   ) : (
//                                     <BarChart
//                                       data={[
//                                         { name: comparisonData.dates[0], value: comparisonData.values[selectedMetric][0] },
//                                         { name: comparisonData.dates[1], value: comparisonData.values[selectedMetric][1] }
//                                       ]}
//                                       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                                     >
//                                       <CartesianGrid strokeDasharray="3 3" />
//                                       <XAxis dataKey="name" />
//                                       <YAxis />
//                                       <Tooltip />
//                                       <Legend />
//                                       <Bar dataKey="value" name={metrics[selectedMetric].label} fill="#8884d8" />
//                                     </BarChart>
//                                   )}
//                                 </ResponsiveContainer>
//                               </div>
//                             </div>
                            
//                             {/* Insights */}
//                             <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg">
//                               <h4 className="font-medium text-blue-700 mb-2">Analysis Insights</h4>
//                               <ul className="space-y-2 text-sm text-blue-800">
//                                 {selectedMetric === 'bloodPressure' ? (
//                                   <>
//                                     <li className="flex items-start">
//                                       <span className="text-blue-500 mr-2">•</span>
//                                       Your systolic pressure has {Math.abs(comparisonData.differences[selectedMetric].systolic)} mmHg 
//                                       {comparisonData.differences[selectedMetric].systolic > 0 ? ' increase' : ' decrease'} 
//                                       ({Math.abs(comparisonData.percentChanges[selectedMetric].systolic)}%)
//                                     </li>
//                                     <li className="flex items-start">
//                                       <span className="text-blue-500 mr-2">•</span>
//                                       Your diastolic pressure has {Math.abs(comparisonData.differences[selectedMetric].diastolic)} mmHg 
//                                       {comparisonData.differences[selectedMetric].diastolic > 0 ? ' increase' : ' decrease'} 
//                                       ({Math.abs(comparisonData.percentChanges[selectedMetric].diastolic)}%)
//                                     </li>
//                                   </>
//                                 ) : (
//                                   <li className="flex items-start">
//                                     <span className="text-blue-500 mr-2">•</span>
//                                     Your {metrics[selectedMetric].label.toLowerCase()} has 
//                                     {comparisonData.differences[selectedMetric] > 0 ? ' increased' : ' decreased'} by 
//                                     {Math.abs(comparisonData.differences[selectedMetric])} {metrics[selectedMetric].unit} 
//                                     ({Math.abs(comparisonData.percentChanges[selectedMetric])}%)
//                                   </li>
//                                 )}
//                                 <li className="flex items-start">
//                                   <span className="text-blue-500 mr-2">•</span>
//                                   Values are {
//                                     selectedMetric === 'bloodPressure' ? 
//                                       parseInt(comparisonData.values[selectedMetric][0].split('/')[0]) <= 120 && 
//                                       parseInt(comparisonData.values[selectedMetric][0].split('/')[1]) <= 80 ? 
//                                         'within normal range' : 'higher than normal range' 
//                                       : 
//                                       Number(comparisonData.values[selectedMetric][0]) >= Number(metrics[selectedMetric].normalRange.split('-')[0]) && 
//                                       Number(comparisonData.values[selectedMetric][0]) <= Number(metrics[selectedMetric].normalRange.split('-')[1]) ? 
//                                         'within normal range' : 'outside normal range'
//                                   }
//                                 </li>
//                               </ul>
//                             </div>
//                           </motion.div>
//                         )}
//                       </>
//                     )}
//                   </div>
//                 ) : (
//                   // Regular Report View
//                   <div>
//                     <div className="flex justify-between items-center mb-4">
//                       <div className="text-sm text-gray-500">
//                         {selectedReport.uploadDate ? 
//                           <>
//                             <span className="font-medium">Uploaded:</span> {formatDate(selectedReport.uploadDate)}
//                             {selectedReport.provider && <> • {selectedReport.provider}</>}
//                           </> : 
//                           <>
//                             <span className="font-medium">Generated:</span> {formatDate(selectedReport.generationDate)}
//                           </>
//                         }
//                       </div>
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setShowTrends(!showTrends)}
//                         className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
//                           showTrends ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         <FaHistory className="mr-1.5" />
//                         {showTrends ? "Hide Trends" : "Show Trends"}
//                       </motion.button>
//                     </div>
                    
//                     {/* Toggle between report view and trends */}
//                     <AnimatePresence mode="wait">
//                       <motion.div
//                         key={showTrends ? "trends" : "report"}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         {showTrends ? (
//                           // Trends View
//                           <div className="space-y-6">
//                             <h3 className="text-lg font-medium text-gray-800 mb-2">Trends Over Time</h3>
                            
//                             {/* Trend Filters */}
//                             <div className="flex flex-wrap gap-2 mb-4">
//                               {Object.keys(metrics).map(key => (
//                                 <button
//                                   key={key}
//                                   onClick={() => setSelectedMetric(key)}
//                                   className={`px-3 py-1 text-sm rounded-full ${
//                                     selectedMetric === key
//                                       ? "bg-blue-600 text-white"
//                                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                                   }`}
//                                 >
//                                   {metrics[key].label}
//                                 </button>
//                               ))}
//                             </div>
                            
//                             {/* Trend Chart */}
//                             <div className="bg-white border border-gray-200 rounded-lg p-4">
//                               <div className="h-72">
//                                 <ResponsiveContainer width="100%" height="100%">
//                                   {selectedMetric === 'bloodPressure' ? (
//                                     <LineChart
//                                       data={chartTrendData}
//                                       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                                     >
//                                       <CartesianGrid strokeDasharray="3 3" />
//                                       <XAxis dataKey="date" />
//                                       <YAxis />
//                                       <Tooltip />
//                                       <Legend />
//                                       <Line 
//                                         type="monotone" 
//                                         dataKey="systolic" 
//                                         name="Systolic" 
//                                         stroke="#8884d8" 
//                                         activeDot={{ r: 8 }} 
//                                       />
//                                       <Line 
//                                         type="monotone" 
//                                         dataKey="diastolic" 
//                                         name="Diastolic" 
//                                         stroke="#82ca9d" 
//                                       />
//                                     </LineChart>
//                                   ) : (
//                                     <LineChart
//                                       data={trendData}
//                                       margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//                                     >
//                                       <CartesianGrid strokeDasharray="3 3" />
//                                       <XAxis dataKey="date" />
//                                       <YAxis />
//                                       <Tooltip />
//                                       <Legend />
//                                       <Line 
//                                         type="monotone" 
//                                         dataKey={selectedMetric} 
//                                         name={metrics[selectedMetric].label} 
//                                         stroke="#8884d8" 
//                                         activeDot={{ r: 8 }} 
//                                       />
//                                     </LineChart>
//                                   )}
//                                 </ResponsiveContainer>
//                               </div>
//                             </div>
                            
//                             {/* Trend Insights */}
//                             <div className="bg-gray-50 p-4 rounded-lg">
//                               <h4 className="font-medium text-gray-700 mb-2">Trend Insights</h4>
//                               <ul className="space-y-2 text-sm text-gray-600">
//                                 <li className="flex items-start">
//                                   <span className="text-blue-500 mr-2">•</span>
//                                   {selectedMetric === 'bloodPressure' ? 
//                                     "Your blood pressure has remained relatively stable over the past few months." :
//                                     `Your ${metrics[selectedMetric].label.toLowerCase()} values show a ${
//                                       trendData[trendData.length-1][selectedMetric] < trendData[0][selectedMetric] ? 
//                                         'decreasing' : 'increasing'
//                                     } trend.`
//                                   }
//                                 </li>
//                                 <li className="flex items-start">
//                                   <span className="text-blue-500 mr-2">•</span>
//                                   The {selectedMetric === 'bloodPressure' ? 'readings' : 'levels'} have been 
//                                   {selectedMetric === 'bloodPressure' ? 
//                                     (chartTrendData[chartTrendData.length-1].systolic <= 120 && 
//                                      chartTrendData[chartTrendData.length-1].diastolic <= 80) ? 
//                                       ' within' : ' slightly above' : 
//                                     (trendData[trendData.length-1][selectedMetric] >= Number(metrics[selectedMetric].normalRange.split('-')[0]) && 
//                                      trendData[trendData.length-1][selectedMetric] <= Number(metrics[selectedMetric].normalRange.split('-')[1])) ? 
//                                       ' within' : ' outside'
//                                   } the normal range in recent measurements.
//                                 </li>
//                               </ul>
//                             </div>
//                           </div>
//                         ) : (
//                           // Report Details View
//                           <div>
//                             {selectedReport.summary ? (
//                               <div className="space-y-6">
//                                 {/* Report Summary Header */}
//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                   <h3 className="text-lg font-medium text-gray-800 mb-3">Health Metrics Summary</h3>
                                  
//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {Object.keys(metrics).map(key => (
//                                       <div key={key} className="bg-white p-3 rounded-lg border border-gray-200">
//                                         <div className="flex justify-between items-center mb-1">
//                                           <h4 className="font-medium text-gray-700">{metrics[key].label}</h4>
//                                           <span className="text-xs text-gray-500">
//                                             Normal: {metrics[key].normalRange} {metrics[key].unit}
//                                           </span>
//                                         </div>
                                        
//                                         <div className="flex items-baseline">
//                                           <span className={`text-2xl font-bold ${getMetricValueColor(key, 
//                                             key === 'bloodPressure' ? 
//                                               parseInt(selectedReport.summary[key].split('/')[0]) : 
//                                               selectedReport.summary[key]
//                                           )}`}>
//                                             {selectedReport.summary[key]}
//                                           </span>
//                                           <span className="text-sm text-gray-500 ml-2">{metrics[key].unit}</span>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
                                
//                                 {/* Document Preview Placeholder */}
//                                 <div className="border border-gray-200 rounded-lg overflow-hidden">
//                                   <div className="bg-gray-100 p-3 flex justify-between items-center">
//                                     <div className="flex items-center">
//                                       <FaFilePdf className="text-red-500 mr-2" />
//                                       <span className="font-medium text-gray-700">Document Preview</span>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                       <button className="p-1 text-gray-600 hover:text-gray-800">
//                                         <FaArrowLeft />
//                                       </button>
//                                       <span className="text-sm">{pageNumber} / 5</span>
//                                       <button className="p-1 text-gray-600 hover:text-gray-800">
//                                         <FaArrowRight />
//                                       </button>
//                                     </div>
//                                   </div>
//                                   <div className="flex justify-center p-8 bg-gray-50">
//                                     <img 
//                                       src="/api/placeholder/500/650" 
//                                       alt="Document Preview" 
//                                       className="border border-gray-300 shadow-sm" 
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             ) : (
//                               // Generated Report View
//                               <div className="space-y-6">
//                                 <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                                   <h3 className="text-lg font-medium text-green-800 mb-2">Generated Report Summary</h3>
//                                   <p className="text-green-700">{selectedReport.summaryText}</p>
//                                 </div>
                                
//                                 {/* Document Preview Placeholder */}
//                                 <div className="border border-gray-200 rounded-lg overflow-hidden">
//                                   <div className="bg-gray-100 p-3 flex justify-between items-center">
//                                     <div className="flex items-center">
//                                       <FaFilePdf className="text-red-500 mr-2" />
//                                       <span className="font-medium text-gray-700">Document Preview</span>
//                                     </div>
//                                     <div className="flex items-center space-x-2">
//                                       <button className="p-1 text-gray-600 hover:text-gray-800">
//                                         <FaArrowLeft />
//                                       </button>
//                                       <span className="text-sm">{pageNumber} / 3</span>
//                                       <button className="p-1 text-gray-600 hover:text-gray-800">
//                                         <FaArrowRight />
//                                       </button>
//                                     </div>
//                                   </div>
//                                   <div className="flex justify-center p-8 bg-gray-50">
//                                     <img 
//                                       src="/api/placeholder/500/650" 
//                                       alt="Generated Report Preview" 
//                                       className="border border-gray-300 shadow-sm" 
//                                     />
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </motion.div>
//                     </AnimatePresence>
//                   </div>
//                 )}
//               </motion.div>
//             ) : (
//               // No Report Selected
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center min-h-[400px]"
//               >
//                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                   <FaFilePdf className="text-blue-500 text-2xl" />
//                 </div>
//                 <h3 className="text-xl font-medium text-gray-800 mb-2">Select a Report</h3>
//                 <p className="text-gray-600 text-center max-w-md mb-4">
//                   Choose a report from the list to view details, analyze trends, and compare with other health records.
//                 </p>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setActiveTab("uploaded")}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
//                 >
//                   View Uploaded Reports
//                 </motion.button>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;