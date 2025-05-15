
// import React, { useState, useEffect, useMemo } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
//   Legend, Area, AreaChart
// } from 'recharts';
// import { 
//   FileDown, TrendingUp, AlertOctagon, CheckCircle2, RefreshCw, 
//   Download, Heart, Activity, PieChart as PieChartIcon, 
//   BarChart as BarChartIcon, FileText, Clock, Calendar,
//   AlertTriangle, ArrowUpCircle, ArrowDownCircle, Zap,
//   Clipboard, Award, Bookmark, User, Share2, Printer
// } from 'lucide-react';
// import ReactMarkdown from 'react-markdown';

// const HealthDashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   // At the top of your component where you process the location state:

  
//   // Safely access and parse the report data
//   const receivedData = location.state?.reportData || {};
//   const reportText = receivedData.health_report?.report || "";
  

//   const [isLoading, setIsLoading] = useState(true);
//   const [activeSection, setActiveSection] = useState('summary');
//   const [factorsData, setFactorsData] = useState([]);
//   const [showInsight, setShowInsight] = useState(false);
//   const [animateChart, setAnimateChart] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (receivedData?.factors) {
//         const transformedData = Object.entries(receivedData.factors)
//           .filter(([key, value]) => 
//             value !== "Not Found" && 
//             typeof value === 'object' && 
//             value.value && 
//             !['Name', 'Reg_ID', 'Age', 'Gender', 'Sample_No', 'Referred By', 'Order_Date_Time'].includes(key)
//           )
//           .map(([key, data]) => ({
//             name: key.replace(/_/g, ' '),
//             value: parseFloat(data.value) || 0,
//             classification: data.classification || 'Unknown'
//           }));
        
//         setFactorsData(transformedData);
//         setIsLoading(false);
        
//         setTimeout(() => setAnimateChart(true), 500);
//         setTimeout(() => setShowInsight(true), 2000);
//       } else {
//         setFactorsData([]);
//         setIsLoading(false);
//       }
//     }, 1200);

//     return () => clearTimeout(timer);
//   }, [receivedData]);

//   // Enhanced color palette
//   const COLOR_PALETTE = {
//     primary: '#3B82F6',
//     secondary: '#10B981',
//     accent: '#8B5CF6',
//     warning: '#F43F5E',
//     neutral: '#6B7280',
//     highlight: '#22D3EE',
//     lightPrimary: '#EFF6FF',
//     lightWarning: '#FEF2F2',
//     lightSuccess: '#ECFDF5',
//     gold: '#F59E0B',
//     teal: '#14B8A6'
//   };

//   // Classification details with more medical accuracy
//   const getClassificationDetails = (classification = '', value) => {
//     if (classification?.includes('Normal')) return {
//       color: COLOR_PALETTE.secondary,
//       bgColor: COLOR_PALETTE.lightSuccess,
//       icon: <CheckCircle2 className="inline-block mr-1" size={16} />,
//       description: 'Within normal range',
//       suggestion: 'Maintain current health practices'
//     };
//     if (classification?.includes('Critical')) return {
//       color: COLOR_PALETTE.warning,
//       bgColor: COLOR_PALETTE.lightWarning,
//       icon: <AlertOctagon className="inline-block mr-1" size={16} />,
//       description: 'Requires immediate attention',
//       suggestion: 'Consult healthcare provider urgently'
//     };
//     if (classification?.includes('High')) return {
//       color: COLOR_PALETTE.accent,
//       bgColor: '#F5F3FF',
//       icon: <ArrowUpCircle className="inline-block mr-1" size={16} />,
//       description: 'Above recommended levels',
//       suggestion: 'Consider lifestyle modifications'
//     };
//     if (classification?.includes('Low')) return {
//       color: COLOR_PALETTE.gold,
//       bgColor: '#FEF3C7',
//       icon: <ArrowDownCircle className="inline-block mr-1" size={16} />,
//       description: 'Below recommended levels',
//       suggestion: 'Consider dietary adjustments'
//     };
//     return {
//       color: COLOR_PALETTE.neutral,
//       bgColor: '#F3F4F6',
//       icon: <AlertTriangle className="inline-block mr-1" size={16} />,
//       description: 'Needs clinical evaluation',
//       suggestion: 'Schedule follow-up testing'
//     };
//   };

//   // Enhanced report download with medical formatting
//   const downloadReport = (format = 'txt') => {
//     let reportContent = '';
//     let mimeType = 'text/plain';
//     let fileExtension = 'txt';
    
//     if (format === 'txt') {
//       reportContent = `MEDICAL REPORT SUMMARY\n\n` +
//         `PATIENT INFORMATION:\n` +
//         `Name: ${receivedData.factors?.Name?.value || 'Not provided'}\n` +
//         `Age: ${receivedData.factors?.Age?.value || 'Not provided'}\n` +
//         `Gender: ${receivedData.factors?.Gender?.value || 'Not provided'}\n` +
//         `Report Date: ${new Date().toLocaleDateString()}\n\n` +
//         `CLINICAL FINDINGS:\n` +
//         `${factorsData.map(f => 
//           `${f.name}: ${f.value} (${f.classification})`
//         ).join('\n')}\n\n` +
//         `MEDICAL SUMMARY:\n${reportText}\n\n` +
//         `RECOMMENDATIONS:\n` +
//         `- Follow up with primary care physician\n` +
//         `- Review dietary habits\n` +
//         `- Monitor concerning values regularly`;
//     } else if (format === 'json') {
//       reportContent = JSON.stringify({
//         patientInfo: {
//           name: receivedData.factors?.Name?.value,
//           age: receivedData.factors?.Age?.value,
//           gender: receivedData.factors?.Gender?.value
//         },
//         clinicalData: factorsData,
//         medicalSummary: reportText,
//         generatedAt: new Date().toISOString()
//       }, null, 2);
//       mimeType = 'application/json';
//       fileExtension = 'json';
//     }
    
//     const blob = new Blob([reportContent], { type: mimeType });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `medical_report_${new Date().getTime()}.${fileExtension}`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   // Enhanced health statistics calculation
//   const dashboardStats = useMemo(() => {
//     const totalFactors = factorsData.length || 1;
//     const normalFactors = factorsData.filter(f => f.classification?.includes('Normal')).length;
//     const criticalFactors = factorsData.filter(f => f.classification?.includes('Critical')).length;
    
//     const healthScore = Math.round((normalFactors / totalFactors) * 100);
//     let healthStatus = 'Excellent';
//     if (healthScore < 60) healthStatus = 'Needs Attention';
//     else if (healthScore < 80) healthStatus = 'Good';
    
//     return {
//       totalFactors,
//       normalPercentage: (normalFactors / totalFactors * 100).toFixed(1),
//       criticalPercentage: (criticalFactors / totalFactors * 100).toFixed(1),
//       healthScore,
//       healthStatus
//     };
//   }, [factorsData]);

//   // Enhanced radar data preparation
//   const radarData = useMemo(() => {
//     return factorsData.map(factor => {
//       // Medical normalization would be more sophisticated in production
//       const normalizedValue = Math.min(Math.max(factor.value, 0), 100);
//       return {
//         subject: factor.name,
//         value: normalizedValue,
//         fullMark: 100
//       };
//     });
//   }, [factorsData]);

//   // Enhanced distribution data
//   const distributionData = useMemo(() => {
//     return [
//       { name: 'Normal', value: parseFloat(dashboardStats.normalPercentage), color: COLOR_PALETTE.secondary },
//       { name: 'Critical', value: parseFloat(dashboardStats.criticalPercentage), color: COLOR_PALETTE.warning },
//       { name: 'Borderline', value: 100 - parseFloat(dashboardStats.normalPercentage) - parseFloat(dashboardStats.criticalPercentage), color: COLOR_PALETTE.gold }
//     ].filter(item => item.value > 0);
//   }, [dashboardStats, COLOR_PALETTE]);

//   // Enhanced report section parsing
//   const parseSections = () => {
//     // If report is already structured (from backend)
//     if (receivedData.health_report?.report) {
//       const reportText = receivedData.health_report.report;
      
//       // Simple markdown section parser
//       const sections = {
//         summary: { title: "Health Summary", content: "" },
//         analysis: { title: "Detailed Analysis", content: "" },
//         diet: { title: "Dietary Recommendations", content: "" },
//         exercise: { title: "Exercise & Lifestyle", content: "" },
//         monitoring: { title: "Monitoring & Next Steps", content: "" }
//       };
  
//       // Split by double newlines to handle markdown sections
//       const parts = reportText.split(/\n## /);
      
//       parts.forEach(part => {
//         if (part.includes("1️⃣ Health Summary")) {
//           sections.summary.content = part.replace("1️⃣ Health Summary", "").trim();
//         } else if (part.includes("2️⃣ Detailed Analysis")) {
//           sections.analysis.content = part.replace("2️⃣ Detailed Analysis", "").trim();
//         } else if (part.includes("3️⃣ Dietary Recommendations")) {
//           sections.diet.content = part.replace("3️⃣ Dietary Recommendations", "").trim();
//         } else if (part.includes("4️⃣ Exercise & Lifestyle Changes")) {
//           sections.exercise.content = part.replace("4️⃣ Exercise & Lifestyle Changes", "").trim();
//         } else if (part.includes("5️⃣ Monitoring & Next Steps")) {
//           sections.monitoring.content = part.replace("5️⃣ Monitoring & Next Steps", "").trim();
//         }
//       });
  
//       return sections;
//     }
  
//     // Fallback if no structured report
//     return {
//       summary: { title: "Health Summary", content: "" },
//       analysis: { title: "Detailed Analysis", content: "" },
//       diet: { title: "Dietary Recommendations", content: "" },
//       exercise: { title: "Exercise & Lifestyle", content: "" },
//       monitoring: { title: "Monitoring & Next Steps", content: "No clinical follow-up available" }
//     };
//   };
  
//   const sections = parseSections();

//   if (isLoading) {
//     return (
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
//       >
//         <motion.div 
//           animate={{ scale: [1, 1.1, 1], rotate: 360 }}
//           transition={{ repeat: Infinity, duration: 1.5 }}
//           className="relative"
//         >
//           <Heart size={64} className="text-red-500" />
//           <Activity size={32} className="absolute inset-0 m-auto text-blue-500" />
//         </motion.div>
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="mt-4 text-xl font-medium text-blue-800"
//         >
//           Analyzing your medical data...
//         </motion.p>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6"
//     >
//       <div className="max-w-7xl mx-auto">
//         {/* Enhanced Medical Header */}
//         <motion.div 
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500"
//         >
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
//                 <Heart className="mr-3 text-red-500" size={28} />
//                 Medical Analysis Dashboard
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 For patient: <span className="font-semibold text-blue-600">
//                   {receivedData.factors?.Name?.value || 'Unknown'}
//                 </span>
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-4 mt-4 md:mt-0">
//               <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
//                 {dashboardStats.healthStatus}
//               </div>
//               <button 
//                 onClick={() => downloadReport()}
//                 className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Download size={18} className="mr-2" />
//                 Export Report
//               </button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Medical Dashboard Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Patient Metrics */}
//           <div className="space-y-6">
//             {/* Patient Health Overview */}
//             <motion.div 
//               initial={{ x: -20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//               className="bg-white rounded-xl shadow-lg p-6"
//             >
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <Clipboard className="mr-2 text-blue-500" size={24} />
//                 Patient Overview
//               </h2>
              
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div className="bg-blue-50 p-3 rounded-lg">
//                   <p className="text-sm text-gray-600">Age</p>
//                   <p className="font-bold text-lg">
//                     {receivedData.factors?.Age?.value || 'N/A'}
//                   </p>
//                 </div>
//                 <div className="bg-blue-50 p-3 rounded-lg">
//                   <p className="text-sm text-gray-600">Gender</p>
//                   <p className="font-bold text-lg">
//                     {receivedData.factors?.Gender?.value || 'N/A'}
//                   </p>
//                 </div>
//               </div>
              
//               <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg">
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="text-sm text-gray-600">Health Score</p>
//                     <p className="text-3xl font-bold text-blue-600">
//                       {dashboardStats.healthScore}
//                       <span className="text-lg text-gray-500">/100</span>
//                     </p>
//                   </div>
//                   <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner">
//                     <div className="text-xs font-medium text-center">
//                       {dashboardStats.healthStatus}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
            
//             {/* Key Medical Indicators */}
//             <motion.div 
//               initial={{ x: -20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="bg-white rounded-xl shadow-lg p-6"
//             >
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <Activity className="mr-2 text-blue-500" size={24} />
//                 Clinical Indicators
//               </h2>
              
//               <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
//                 {factorsData.length > 0 ? (
//                   factorsData.map((factor, index) => {
//                     const details = getClassificationDetails(factor.classification, factor.value);
//                     return (
//                       <motion.div 
//                         key={index}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: index * 0.1 }}
//                         className="p-3 rounded-lg border border-gray-100"
//                         style={{ backgroundColor: details.bgColor }}
//                       >
//                         <div className="flex justify-between">
//                           <p className="font-medium">{factor.name}</p>
//                           <p className="font-bold">{factor.value}</p>
//                         </div>
//                         <div className="flex items-center mt-1 text-sm" style={{ color: details.color }}>
//                           {details.icon}
//                           {factor.classification}
//                         </div>
//                       </motion.div>
//                     );
//                   })
//                 ) : (
//                   <p className="text-gray-500 text-center py-4">No clinical data available</p>
//                 )}
//               </div>
//             </motion.div>
//           </div>
          
//           {/* Right Column - Medical Visualizations */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Medical Data Visualization */}
//             <motion.div 
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.3 }}
//               className="bg-white rounded-xl shadow-lg p-6"
//             >
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <BarChartIcon className="mr-2 text-blue-500" size={24} />
//                 Clinical Metrics
//               </h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Distribution Pie Chart */}
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={distributionData}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="value"
//                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                       >
//                         {distributionData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
                
//                 {/* Top Metrics Bar Chart */}
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                       data={factorsData.slice(0, 5)}
//                       layout="vertical"
//                       margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
//                       <XAxis type="number" />
//                       <YAxis 
//                         dataKey="name" 
//                         type="category" 
//                         width={100}
//                         tick={{ fontSize: 12 }} 
//                       />
//                       <Tooltip />
//                       <Bar 
//                         dataKey="value" 
//                         fill={COLOR_PALETTE.primary}
//                         radius={[0, 4, 4, 0]}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </motion.div>
            
//             {/* Medical Report Sections */}
//             <motion.div 
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               className="bg-white rounded-xl shadow-lg p-6"
//             >
//               <h2 className="text-xl font-semibold mb-4 flex items-center">
//                 <FileText className="mr-2 text-blue-500" size={24} />
//                 Clinical Report
//               </h2>
              
//               {/* Report Navigation */}
//               <div className="flex space-x-2 overflow-x-auto pb-2 mb-4">
//                 {Object.entries(sections).map(([key, section]) => (
//                   <button
//                     key={key}
//                     onClick={() => setActiveSection(key)}
//                     className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
//                       activeSection === key
//                         ? 'bg-blue-500 text-white'
//                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                     }`}
//                   >
//                     {section.title}
//                   </button>
//                 ))}
//               </div>
              
//               {/* Report Content */}
//               <div className="bg-gray-50 rounded-lg p-4 min-h-48 max-h-64 overflow-y-auto">
//                 <AnimatePresence mode="wait">
//                   <motion.div
//                     key={activeSection}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                   >
//                     {sections[activeSection].content ? (
//                       <div className="space-y-2">
//                         {sections[activeSection].content.split('\n').map((line, i) => (
//                           line.trim() && <p key={i}>{line}</p>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-500">No {sections[activeSection].title.toLowerCase()} available</p>
//                     )}
//                   </motion.div>
//                 </AnimatePresence>
//               </div>
              
//               {/* Clinical Actions */}
//               <div className="flex justify-between mt-4">
//                 <button className="text-sm px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
//                   <Bookmark size={16} className="inline mr-1" />
//                   Save to Records
//                 </button>
//                 <button 
//                   onClick={() => downloadReport('json')}
//                   className="text-sm px-3.5 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   <FileDown size={16} className="inline mr-1" />
//                   Export Full Data
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         </div>
        
//         {/* Medical Footer */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="mt-6 text-center text-gray-500 text-sm"
//         >
//           <p>
//             This clinical report is generated based on laboratory findings and should be reviewed by a qualified healthcare professional.
//             Report generated on {new Date().toLocaleDateString()}
//           </p>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default HealthDashboard;

// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import ReactMarkdown from 'react-markdown';

// const HealthDashboard = () => {
//   const location = useLocation();
  
//   // Extract data from location state with proper fallbacks
//   const reportData = location.state?.reportData || {};
//   const factors = reportData.factors || {};
//   const healthReport = reportData.report || {};
  
//   // Get the actual report text (handling both object and string cases)
//   const reportText = typeof healthReport === 'string' 
//     ? healthReport 
//     : healthReport.report || "No report content available";

//   // Prepare health factors for display
//   const displayFactors = Object.entries(factors)
//     .filter(([key, value]) => {
//       // Skip "Not Found" values and empty objects
//       if (value === "Not Found") return false;
//       if (typeof value === 'object' && (!value.value || value.value === "Not Found")) return false;
//       return true;
//     })
//     .map(([key, value]) => ({
//       name: key.replace(/_/g, ' '), // Convert snake_case to spaces
//       value: typeof value === 'object' ? value.value : value,
//       status: typeof value === 'object' ? value.classification : 'N/A'
//     }));

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">
//             Health Report Dashboard
//           </h1>
//           {factors.Name?.value && (
//             <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600">Patient Name</p>
//                 <p className="font-semibold">{factors.Name.value}</p>
//               </div>
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600">Age</p>
//                 <p className="font-semibold">{factors.Age?.value || 'N/A'}</p>
//               </div>
//               <div className="bg-blue-50 p-3 rounded-lg">
//                 <p className="text-sm text-gray-600">Report ID</p>
//                 <p className="font-semibold">{factors.Reg_ID?.value || 'N/A'}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Health Metrics */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-md p-6 h-full">
//               <h2 className="text-xl font-semibold mb-4 border-b pb-2">
//                 Health Metrics
//               </h2>
              
//               {displayFactors.length > 0 ? (
//                 <div className="space-y-3 max-h-[600px] overflow-y-auto">
//                   {displayFactors.map((factor, index) => (
//                     <div key={index} className="p-3 border border-gray-200 rounded-lg">
//                       <div className="flex justify-between items-center">
//                         <span className="font-medium">{factor.name}</span>
//                         <span className="font-bold">{factor.value}</span>
//                       </div>
//                       <div className={`mt-1 text-sm ${
//                         factor.status.includes('Critical') ? 'text-red-500' :
//                         factor.status.includes('Normal') ? 'text-green-500' :
//                         'text-yellow-500'
//                       }`}>
//                         {factor.status}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-4">
//                   No health metrics available
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Health Report */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-xl shadow-md p-6 h-full">
//               <h2 className="text-xl font-semibold mb-4 border-b pb-2">
//                 Health Analysis Report
//               </h2>
              
//               <div className="prose max-w-none">
//                 <ReactMarkdown>{reportText}</ReactMarkdown>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HealthDashboard;

// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { 
//   ChevronDown, 
//   ChevronUp, 
//   AlertCircle, 
//   Info, 
//   Heart, 
//   Activity, 
//   Calendar, 
//   FileText, 
//   User, 
//   Coffee, 
//   ArrowUp, 
//   ArrowDown, 
//   Minus,
//   Apple,
//   Activity,
//   Clipboard
// } from 'lucide-react';


// const HealthDashboard = () => {
//   const location = useLocation();
//   const [reportData, setReportData] = useState(null);
//   const [activeTab, setActiveTab] = useState('summary');
//   const [expandedSections, setExpandedSections] = useState({
//     summary: true,
//     analysis: true,
//     diet: true,
//     exercise: true,
//     monitoring: true
//   });

//   useEffect(() => {
//     if (location.state && location.state.reportData) {
//       setReportData(location.state.reportData);
//     }
//   }, [location]);

//   if (!reportData) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center p-8">
//           <AlertCircle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800">No report data found</h2>
//           <p className="mt-2 text-gray-600">Please upload a health report to view your dashboard</p>
//         </div>
//       </div>
//     );
//   }

//   const { factors, report } = reportData;

//   // Function to get indicators
//   const getStatusIndicator = (classification) => {
//     if (!classification) return null;
    
//     if (classification.includes('Normal')) {
//       return <ArrowUp className="text-green-500 h-5 w-5" />;
//     } else if (classification.includes('Borderline')) {
//       return <Minus className="text-yellow-500 h-5 w-5" />;
//     } else if (classification.includes('Low') || classification.includes('High')) {
//       return <ArrowDown className="text-red-500 h-5 w-5" />;
//     }
//     return null;
//   };

//   // Filter out "Not Found" values
//   const validFactors = Object.entries(factors).filter(
//     ([_, value]) => value !== "Not Found" && typeof value === 'object'
//   );
  
//   // Group factors by categories for better visualization
//   const categorizedFactors = {
//     bloodCount: ['RBC Count', 'Hemoglobin', 'PCV', 'MCV', 'MCH', 'MCHC'],
//     lipidProfile: ['Total Cholesterol', 'LDL Cholesterol', 'HDL Cholesterol', 'Triglycerides'],
//     bloodSugar: ['Fasting Blood Sugar', 'HbA1c', 'Estimated Avg Glucose (3 Mths)'],
//     other: ['Serum B12 Levels', 'Insulin Levels']
//   };

//   const patientDetails = {
//     name: factors.Name?.value || 'N/A',
//     age: factors.Age?.value || 'N/A',
//     gender: factors.Gender?.value || 'N/A',
//     regId: factors.Reg_ID?.value || 'N/A',
//     sampleNo: factors.Sample_No?.value || 'N/A',
//     orderDate: factors.Order_Date_Time?.value || 'N/A'
//   };

//   // Count critical values
//   const criticalCount = validFactors.filter(([_, value]) => 
//     value.classification && value.classification.includes('Critical')
//   ).length;
  
//   const normalCount = validFactors.filter(([_, value]) => 
//     value.classification && value.classification.includes('Normal')
//   ).length;

//   const borderlineCount = validFactors.filter(([_, value]) => 
//     value.classification && value.classification.includes('Borderline')
//   ).length;

//   // Process the report content for better display
//   const parseReportContent = () => {
//     const reportText = typeof report === 'object' && report.report 
//       ? report.report
//       : '';
    
//     // Split the report into sections by looking for "## " headers
//     const sections = reportText.split(/(?=## )/).filter(Boolean);
    
//     const processedSections = {};
    
//     sections.forEach(section => {
//       // Extract the title (everything after ## until the first newline)
//       const titleMatch = section.match(/## (.*?)(?:\n|$)/);
//       if (titleMatch) {
//         const title = titleMatch[1].trim();
//         // Get section identifier from emoji if present
//         let sectionId = '';
        
//         if (title.includes('1️⃣')) sectionId = 'summary';
//         else if (title.includes('2️⃣')) sectionId = 'analysis';
//         else if (title.includes('3️⃣')) sectionId = 'diet';
//         else if (title.includes('4️⃣')) sectionId = 'exercise';
//         else if (title.includes('5️⃣')) sectionId = 'monitoring';
        
//         // Get content (everything after the title)
//         const content = section.replace(/## .*?\n/, '').trim();
        
//         if (sectionId) {
//           processedSections[sectionId] = {
//             title,
//             content,
//             // Parse bullet points for better display
//             bulletPoints: content.split(/\n\s*[\*\-]\s*/).filter(item => item.trim())
//           };
//         }
//       }
//     });
    
//     return processedSections;
//   };

//   const reportSections = parseReportContent();

//   const toggleSection = (section) => {
//     setExpandedSections({
//       ...expandedSections,
//       [section]: !expandedSections[section]
//     });
//   };

//   // Create metric card for dashboard
//   const MetricCard = ({ title, value, classification, unit }) => (
//     <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
//       <div className="flex justify-between items-start mb-2">
//         <h3 className="text-sm font-medium text-gray-700">{title}</h3>
//         <div className="flex items-center">
//           {getStatusIndicator(classification)}
//         </div>
//       </div>
//       <div className="mt-auto">
//         <div className="flex items-baseline">
//           <p className="text-2xl font-bold text-gray-900">{value}</p>
//           {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
//         </div>
//         <p className={`text-xs mt-1 ${
//           classification && classification.includes('Normal') ? 'text-green-600' :
//           classification && classification.includes('Borderline') ? 'text-yellow-600' :
//           'text-red-600'
//         }`}>
//           {classification || 'N/A'}
//         </p>
//       </div>
//     </div>
//   );

//   // Extract units from values where possible
//   const extractUnit = (title, value) => {
//     const commonUnits = {
//       'Hemoglobin': 'g/dl',
//       'RBC Count': 'mill/cmm',
//       'Total Cholesterol': 'mg/dl',
//       'LDL Cholesterol': 'mg/dl',
//       'HDL Cholesterol': 'mg/dl',
//       'Triglycerides': 'mg/dl',
//       'Fasting Blood Sugar': 'mg/dl',
//       'HbA1c': '%',
//       'PCV': '%',
//       'MCV': 'fl',
//       'MCH': 'pg',
//       'MCHC': 'g/dl',
//       'Serum B12 Levels': 'pg/ml'
//     };
    
//     return commonUnits[title] || '';
//   };

//   // Function to render a section with proper formatting
//   const renderSection = (sectionId, icon) => {
//     const section = reportSections[sectionId];
//     if (!section) return null;
    
//     return (
//       <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
//         <div 
//           className="flex justify-between items-center p-4 bg-blue-50 cursor-pointer"
//           onClick={() => toggleSection(sectionId)}
//         >
//           <div className="flex items-center">
//             {icon}
//             <h3 className="text-lg font-semibold text-blue-800 ml-2">{section.title}</h3>
//           </div>
//           {expandedSections[sectionId] ? 
//             <ChevronUp className="h-5 w-5 text-blue-600" /> : 
//             <ChevronDown className="h-5 w-5 text-blue-600" />
//           }
//         </div>
        
//         {expandedSections[sectionId] && (
//           <div className="p-5 border-t border-blue-100">
//             {section.bulletPoints.map((point, idx) => (
//               <div key={idx} className="mb-3">
//                 <p className="text-gray-700">{point}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-3xl font-bold">Health Dashboard</h1>
//           <p className="mt-2 opacity-90">Comprehensive analysis of your health report</p>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {/* Patient Info Card */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//           <div className="flex items-center">
//             <div className="bg-blue-100 p-3 rounded-full mr-4">
//               <User className="h-8 w-8 text-blue-700" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">{patientDetails.name}</h2>
//               <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
//                 <div className="flex items-center">
//                   <Info className="h-4 w-4 mr-1" />
//                   <span>Age: {patientDetails.age}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Info className="h-4 w-4 mr-1" />
//                   <span>Reg ID: {patientDetails.regId}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <Calendar className="h-4 w-4 mr-1" />
//                   <span>Order Date: {patientDetails.orderDate}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Status Summary */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
//             <div className="bg-red-100 p-3 rounded-full mr-4">
//               <AlertCircle className="h-6 w-6 text-red-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Critical Values</p>
//               <p className="text-2xl font-bold text-gray-900">{criticalCount}</p>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
//             <div className="bg-yellow-100 p-3 rounded-full mr-4">
//               <Activity className="h-6 w-6 text-yellow-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Borderline Values</p>
//               <p className="text-2xl font-bold text-gray-900">{borderlineCount}</p>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
//             <div className="bg-green-100 p-3 rounded-full mr-4">
//               <Heart className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Normal Values</p>
//               <p className="text-2xl font-bold text-gray-900">{normalCount}</p>
//             </div>
//           </div>
//         </div>

//         {/* Main Dashboard Tabs */}
//         <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
//           <button
//             className={`py-3 px-6 font-medium whitespace-nowrap ${activeTab === 'summary' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('summary')}
//           >
//             Overview
//           </button>
//           <button
//             className={`py-3 px-6 font-medium whitespace-nowrap ${activeTab === 'metrics' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('metrics')}
//           >
//             Health Metrics
//           </button>
//           <button
//             className={`py-3 px-6 font-medium whitespace-nowrap ${activeTab === 'analysis' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('analysis')}
//           >
//             Analysis
//           </button>
//           <button
//             className={`py-3 px-6 font-medium whitespace-nowrap ${activeTab === 'recommendations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('recommendations')}
//           >
//             Recommendations
//           </button>
//           <button
//             className={`py-3 px-6 font-medium whitespace-nowrap ${activeTab === 'report' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
//             onClick={() => setActiveTab('report')}
//           >
//             Full Report
//           </button>
//         </div>

//         {/* Tab Content */}
//         {activeTab === 'summary' && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Health Overview</h2>
            
//             {/* Critical Metrics Overview */}
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-red-600 mb-3">Critical Health Factors</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {validFactors
//                   .filter(([key, value]) => 
//                     value.classification && value.classification.includes('Critical')
//                   )
//                   .map(([key, value]) => (
//                     <MetricCard 
//                       key={key}
//                       title={key}
//                       value={value.value}
//                       classification={value.classification}
//                       unit={extractUnit(key, value.value)}
//                     />
//                   ))
//                 }
//               </div>
//             </div>
            
//             {/* Health Summary Section */}
//             {renderSection('summary', <FileText className="h-5 w-5 text-blue-600" />)}
            
//             {/* Monitoring & Next Steps Section */}
//             {renderSection('monitoring', <Clipboard className="h-5 w-5 text-blue-600" />)}
//           </div>
//         )}
        
//         {activeTab === 'metrics' && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Health Metrics</h2>
            
//             {/* Blood Count Section */}
//             <div className="mb-8">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                 <Activity className="h-5 w-5 mr-2 text-red-600" />
//                 Blood Count Parameters
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {categorizedFactors.bloodCount.map(key => {
//                   const factor = factors[key];
//                   if (factor && factor !== "Not Found" && typeof factor === 'object') {
//                     return (
//                       <MetricCard 
//                         key={key}
//                         title={key}
//                         value={factor.value}
//                         classification={factor.classification}
//                         unit={extractUnit(key, factor.value)}
//                       />
//                     );
//                   }
//                   return null;
//                 })}
//               </div>
//             </div>
            
//             {/* Lipid Profile Section */}
//             <div className="mb-8">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                 <Heart className="h-5 w-5 mr-2 text-blue-600" />
//                 Lipid Profile
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {categorizedFactors.lipidProfile.map(key => {
//                   const factor = factors[key];
//                   if (factor && factor !== "Not Found" && typeof factor === 'object') {
//                     return (
//                       <MetricCard 
//                         key={key}
//                         title={key}
//                         value={factor.value}
//                         classification={factor.classification}
//                         unit={extractUnit(key, factor.value)}
//                       />
//                     );
//                   }
//                   return null;
//                 })}
//               </div>
//             </div>
            
//             {/* Blood Sugar Section */}
//             <div className="mb-8">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                 <Coffee className="h-5 w-5 mr-2 text-yellow-600" />
//                 Blood Sugar Parameters
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {categorizedFactors.bloodSugar.map(key => {
//                   const factor = factors[key];
//                   if (factor && factor !== "Not Found" && typeof factor === 'object') {
//                     return (
//                       <MetricCard 
//                         key={key}
//                         title={key}
//                         value={factor.value}
//                         classification={factor.classification}
//                         unit={extractUnit(key, factor.value)}
//                       />
//                     );
//                   }
//                   return null;
//                 })}
//               </div>
//             </div>
            
//             {/* Other Parameters */}
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
//                 <FileText className="h-5 w-5 mr-2 text-purple-600" />
//                 Other Parameters
//               </h3>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {categorizedFactors.other.map(key => {
//                   const factor = factors[key];
//                   if (factor && factor !== "Not Found" && typeof factor === 'object') {
//                     return (
//                       <MetricCard 
//                         key={key}
//                         title={key}
//                         value={factor.value}
//                         classification={factor.classification}
//                         unit={extractUnit(key, factor.value)}
//                       />
//                     );
//                   }
//                   return null;
//                 })}
//               </div>
//             </div>
//           </div>
//         )}
        
//         {activeTab === 'analysis' && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Detailed Health Analysis</h2>
//             {renderSection('analysis', <Activity className="h-5 w-5 text-blue-600" />)}
//           </div>
//         )}
        
//         {activeTab === 'recommendations' && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <h2 className="text-xl font-bold text-gray-800 mb-6">Health Recommendations</h2>
            
//             {/* Dietary Recommendations */}
//             {renderSection('diet', <Apple className="h-5 w-5 text-green-600" />)}
            
//             {/* Exercise Recommendations */}
//             {renderSection('exercise', <Activity className="h-5 w-5 text-blue-600" />)}
            
//             {/* Monitoring & Next Steps */}
//             {renderSection('monitoring', <Clipboard className="h-5 w-5 text-purple-600" />)}
//           </div>
//         )}
        
//         {activeTab === 'report' && (
//           <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Complete Health Report</h2>
            
//             {/* All sections from the AI report */}
//             <div className="space-y-6">
//               {renderSection('summary', <FileText className="h-5 w-5 text-blue-600" />)}
//               {renderSection('analysis', <Activity className="h-5 w-5 text-blue-600" />)}
//               {renderSection('diet', <Apple className="h-5 w-5 text-green-600" />)}
//               {renderSection('exercise', <Activity className="h-5 w-5 text-blue-600" />)}
//               {renderSection('monitoring', <Clipboard className="h-5 w-5 text-purple-600" />)}
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-100 p-6 border-t border-gray-200">
//         <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
//           <p>This report is generated based on your lab results and should not replace professional medical advice.</p>
//           <p className="mt-2">Always consult with your healthcare provider regarding health concerns.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HealthDashboard;


// import React, { useState, useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import { 
//   ChevronDown, 
//   ChevronUp, 
//   AlertCircle, 
//   Info, 
//   Heart, 
//   Activity, 
//   Calendar, 
//   FileText, 
//   User, 
//   Coffee, 
//   ArrowUp, 
//   ArrowDown, 
//   Minus,
//   Apple,
//   Clipboard,
//   Shield,
//   TrendingUp,
//   Bell,
//   Zap,
//   Download,
//   RefreshCw,
//   Share2,
//   Award,
//   Droplet,
//   Thermometer,
//   Printer,
//   Moon,
//   Sun,
//   Flag,
//   BarChart2,
//   PieChart,
//   LineChart,
//   Target,
//   Clock
// } from 'lucide-react';

// const HealthDashboard = () => {
//   const location = useLocation();
//   const [reportData, setReportData] = useState(null);
//   const [activeTab, setActiveTab] = useState('summary');
//   const [expandedSections, setExpandedSections] = useState({
//     summary: true,
//     analysis: true,
//     diet: true,
//     exercise: true,
//     monitoring: true
//   });
//   const [loading, setLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [showAnimations, setShowAnimations] = useState({});
//   const animationTimeouts = useRef({});

//   useEffect(() => {
//     // Simulate loading data
//     setLoading(true);
//     const timer = setTimeout(() => {
//       if (location.state && location.state.reportData) {
//         setReportData(location.state.reportData);
//       } else {
//         // Fetch mock data if none is provided
//         fetchMockData();
//       }
//       setLoading(false);
//     }, 1000);
    
//     return () => clearTimeout(timer);
//   }, [location]);

//   // Trigger animations when sections are expanded
//   useEffect(() => {
//     Object.keys(expandedSections).forEach(section => {
//       if (expandedSections[section]) {
//         // Clear any existing timeout
//         if (animationTimeouts.current[section]) {
//           clearTimeout(animationTimeouts.current[section]);
//         }
        
//         // Set animation state to true
//         setShowAnimations(prev => ({ ...prev, [section]: false }));
        
//         // Set animation after a short delay to ensure DOM is ready
//         animationTimeouts.current[section] = setTimeout(() => {
//           setShowAnimations(prev => ({ ...prev, [section]: true }));
//         }, 100);
//       }
//     });
    
//     return () => {
//       // Clean up timeouts
//       Object.values(animationTimeouts.current).forEach(timeout => clearTimeout(timeout));
//     };
//   }, [expandedSections]);

//   const fetchMockData = () => {
//     // Mock data if no data is provided
//     const mockData = {
//       factors: {
//         Name: { value: 'John Doe' },
//         Age: { value: '42' },
//         Gender: { value: 'Male' },
//         Reg_ID: { value: 'REG12345' },
//         Sample_No: { value: 'SAMPLE456' },
//         Order_Date_Time: { value: '2025-03-15' },
//         'RBC Count': { value: '5.1', classification: 'Normal' },
//         'Hemoglobin': { value: '14.5', classification: 'Normal' },
//         'PCV': { value: '45', classification: 'Normal' },
//         'MCV': { value: '88', classification: 'Normal' },
//         'MCH': { value: '29', classification: 'Normal' },
//         'MCHC': { value: '32', classification: 'Normal' },
//         'Total Cholesterol': { value: '240', classification: 'High-Borderline' },
//         'LDL Cholesterol': { value: '155', classification: 'High' },
//         'HDL Cholesterol': { value: '42', classification: 'Low-Borderline' },
//         'Triglycerides': { value: '180', classification: 'High-Borderline' },
//         'Fasting Blood Sugar': { value: '110', classification: 'High-Borderline' },
//         'HbA1c': { value: '6.1', classification: 'Borderline' },
//         'Estimated Avg Glucose (3 Mths)': { value: '125', classification: 'High-Borderline' },
//         'Serum B12 Levels': { value: '280', classification: 'Low-Borderline' },
//         'Insulin Levels': { value: '18', classification: 'High-Borderline' }
//       },
//       report: {
//         report: `## 1️⃣ Health Summary
// * Your lab results show borderline high cholesterol levels with LDL (bad cholesterol) above optimal range
// * Blood sugar parameters indicate prediabetic tendencies with HbA1c at 6.1%
// * Vitamin B12 levels are slightly below the optimal range
// * Overall blood count parameters are within normal limits

// ## 2️⃣ Detailed Analysis
// * Your lipid profile shows elevated total cholesterol (240 mg/dl) and LDL cholesterol (155 mg/dl), indicating increased cardiovascular risk
// * HDL (good cholesterol) is borderline low at 42 mg/dl, reducing your natural protection against heart disease
// * Fasting blood sugar (110 mg/dl) and HbA1c (6.1%) suggest prediabetes, which means you're at risk for developing type 2 diabetes
// * Low B12 levels may contribute to fatigue and neurological symptoms if not addressed

// ## 3️⃣ Dietary Recommendations
// * Reduce saturated fat intake by limiting red meat, full-fat dairy, and processed foods
// * Increase soluble fiber consumption through oats, beans, fruits and vegetables to help lower cholesterol
// * Add plant sterols/stanols through foods like nuts, seeds, and vegetable oils
// * Limit added sugars and refined carbohydrates to help manage blood sugar levels
// * Include B12-rich foods like fish, meat, eggs, and dairy, or consider a supplement

// ## 4️⃣ Exercise Recommendations
// * Aim for at least 150 minutes of moderate-intensity aerobic activity weekly
// * Include resistance training 2-3 times per week to improve insulin sensitivity
// * Consider daily walking after meals to help manage blood sugar levels
// * Start with 10-minute activity sessions if currently sedentary, gradually increasing duration
// * Monitor heart rate during exercise and stay within your target heart rate zone

// ## 5️⃣ Monitoring & Next Steps
// * Schedule a follow-up lipid profile test in 3 months to assess improvement
// * Consider glucose monitoring to track blood sugar patterns
// * Retest HbA1c in 3-6 months to monitor for changes
// * Schedule a consultation with a dietitian for personalized meal planning
// * Consider cardiovascular risk assessment with your physician`
//       }
//     };
//     setReportData(mockData);
//   };

//   const refreshData = () => {
//     setIsRefreshing(true);
//     // Simulate data refresh
//     setTimeout(() => {
//       if (location.state && location.state.reportData) {
//         setReportData(location.state.reportData);
//       } else {
//         fetchMockData();
//       }
//       setIsRefreshing(false);
//     }, 1500);
//   };

//   if (loading) {
//     return (
//       <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center p-8">
//           <RefreshCw className={`mx-auto h-12 w-12 ${darkMode ? 'text-blue-400' : 'text-blue-500'} mb-4 animate-spin`} />
//           <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Loading your health report</h2>
//           <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please wait while we analyze your data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!reportData) {
//     return (
//       <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center p-8">
//           <AlertCircle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
//           <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>No report data found</h2>
//           <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please upload a health report to view your dashboard</p>
//           <button 
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
//             onClick={fetchMockData}
//           >
//             <FileText className="h-5 w-5 mr-2" />
//             Load Sample Report
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { factors, report } = reportData;

//   // Function to get indicators
//   const getStatusIndicator = (classification) => {
//     if (!classification) return null;
    
//     if (classification.includes('Normal')) {
//       return <ArrowUp className="text-green-500 h-5 w-5 animate-bounce" />;
//     } else if (classification.includes('Borderline')) {
//       return <Minus className="text-yellow-500 h-5 w-5 animate-pulse" />;
//     } else if (classification.includes('Low') || classification.includes('High')) {
//       return <ArrowDown className="text-red-500 h-5 w-5 animate-bounce" />;
//     }
//     return null;
//   };

//   // Filter out "Not Found" values
//   const validFactors = Object.entries(factors).filter(
//     ([_, value]) => value !== "Not Found" && typeof value === 'object'
//   );
  
//   // Group factors by categories for better visualization
//   const categorizedFactors = {
//     bloodCount: ['RBC Count', 'Hemoglobin', 'PCV', 'MCV', 'MCH', 'MCHC'],
//     lipidProfile: ['Total Cholesterol', 'LDL Cholesterol', 'HDL Cholesterol', 'Triglycerides'],
//     bloodSugar: ['Fasting Blood Sugar', 'HbA1c', 'Estimated Avg Glucose (3 Mths)'],
//     other: ['Serum B12 Levels', 'Insulin Levels']
//   };

//   const patientDetails = {
//     name: factors.Name?.value || 'N/A',
//     age: factors.Age?.value || 'N/A',
//     gender: factors.Gender?.value || 'N/A',
//     regId: factors.Reg_ID?.value || 'N/A',
//     sampleNo: factors.Sample_No?.value || 'N/A',
//     orderDate: factors.Order_Date_Time?.value || 'N/A'
//   };

//   // Count critical values
//   const criticalCount = validFactors.filter(([_, value]) => 
//     value.classification && (value.classification.includes('Critical') || value.classification.includes('High') || value.classification.includes('Low'))
//   ).length;
  
//   const normalCount = validFactors.filter(([_, value]) => 
//     value.classification && value.classification.includes('Normal')
//   ).length;

//   const borderlineCount = validFactors.filter(([_, value]) => 
//     value.classification && value.classification.includes('Borderline')
//   ).length;

//   // Process the report content for better display
//   const parseReportContent = () => {
//     const reportText = typeof report === 'object' && report.report 
//       ? report.report
//       : '';
    
//     // Split the report into sections by looking for "## " headers
//     const sections = reportText.split(/(?=## )/).filter(Boolean);
    
//     const processedSections = {};
    
//     sections.forEach(section => {
//       // Extract the title (everything after ## until the first newline)
//       const titleMatch = section.match(/## (.*?)(?:\n|$)/);
//       if (titleMatch) {
//         const title = titleMatch[1].trim();
//         // Get section identifier from emoji if present
//         let sectionId = '';
        
//         if (title.includes('1️⃣')) sectionId = 'summary';
//         else if (title.includes('2️⃣')) sectionId = 'analysis';
//         else if (title.includes('3️⃣')) sectionId = 'diet';
//         else if (title.includes('4️⃣')) sectionId = 'exercise';
//         else if (title.includes('5️⃣')) sectionId = 'monitoring';
        
//         // Get content (everything after the title)
//         const content = section.replace(/## .*?\n/, '').trim();
        
//         if (sectionId) {
//           processedSections[sectionId] = {
//             title,
//             content,
//             // Parse bullet points for better display
//             bulletPoints: content.split(/\n\s*[\*\-]\s*/).filter(item => item.trim())
//           };
//         }
//       }
//     });
    
//     return processedSections;
//   };

//   const reportSections = parseReportContent();

//   const toggleSection = (section) => {
//     setExpandedSections({
//       ...expandedSections,
//       [section]: !expandedSections[section]
//     });
//   };

//   // Create metric card for dashboard
//   const MetricCard = ({ title, value, classification, unit }) => {
//     const isNormal = classification && classification.includes('Normal');
//     const isBorderline = classification && classification.includes('Borderline');
//     const isCritical = !isNormal && !isBorderline;
    
//     return (
//       <div className={`rounded-lg shadow-md p-4 flex flex-col transition-all duration-300 transform hover:scale-105 
//                        ${darkMode ? 
//                          (isNormal ? 'bg-green-900/30 border border-green-700' : 
//                           isBorderline ? 'bg-yellow-900/30 border border-yellow-700' : 
//                           'bg-red-900/30 border border-red-700') : 
//                          (isNormal ? 'bg-white border-l-4 border-l-green-500' : 
//                           isBorderline ? 'bg-white border-l-4 border-l-yellow-500' : 
//                           'bg-white border-l-4 border-l-red-500')}`}>
//         <div className="flex justify-between items-start mb-2">
//           <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{title}</h3>
//           <div className="flex items-center">
//             {getStatusIndicator(classification)}
//           </div>
//         </div>
//         <div className="mt-auto">
//           <div className="flex items-baseline">
//             <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
//             {unit && <span className={`ml-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{unit}</span>}
//           </div>
//           <p className={`text-xs mt-1 ${
//             isNormal ? 'text-green-600' :
//             isBorderline ? 'text-yellow-600' :
//             'text-red-600'
//           }`}>
//             {classification || 'N/A'}
//           </p>
//         </div>
//       </div>
//     );
//   };

//   // Extract units from values where possible
//   const extractUnit = (title, value) => {
//     const commonUnits = {
//       'Hemoglobin': 'g/dl',
//       'RBC Count': 'mill/cmm',
//       'Total Cholesterol': 'mg/dl',
//       'LDL Cholesterol': 'mg/dl',
//       'HDL Cholesterol': 'mg/dl',
//       'Triglycerides': 'mg/dl',
//       'Fasting Blood Sugar': 'mg/dl',
//       'HbA1c': '%',
//       'PCV': '%',
//       'MCV': 'fl',
//       'MCH': 'pg',
//       'MCHC': 'g/dl',
//       'Serum B12 Levels': 'pg/ml'
//     };
    
//     return commonUnits[title] || '';
//   };

//   // Function to render a section with proper formatting
//   const renderSection = (sectionId, icon) => {
//     const section = reportSections[sectionId];
//     if (!section) return null;
    
//     const getSectionIcon = () => {
//       switch (sectionId) {
//         case 'summary':
//           return <FileText className="h-5 w-5 text-blue-600" />;
//         case 'analysis':
//           return <BarChart2 className="h-5 w-5 text-purple-600" />;
//         case 'diet':
//           return <Apple className="h-5 w-5 text-green-600" />;
//         case 'exercise':
//           return <Activity className="h-5 w-5 text-orange-600" />;
//         case 'monitoring':
//           return <Clipboard className="h-5 w-5 text-blue-600" />;
//         default:
//           return icon;
//       }
//     };
    
//     return (
//       <div className={`mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-all duration-300`}>
//         <div 
//           className={`flex justify-between items-center p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} cursor-pointer hover:brightness-95 transition-all`}
//           onClick={() => toggleSection(sectionId)}
//         >
//           <div className="flex items-center">
//             {getSectionIcon()}
//             <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-blue-800'} ml-2`}>{section.title}</h3>
//           </div>
//           {expandedSections[sectionId] ? 
//             <ChevronUp className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-transform duration-300`} /> : 
//             <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-transform duration-300`} />
//           }
//         </div>
        
//         {expandedSections[sectionId] && (
//           <div className={`p-5 ${darkMode ? 'border-t border-gray-700' : 'border-t border-blue-100'}`}>
//             {section.bulletPoints.map((point, idx) => (
//               <div 
//                 key={idx} 
//                 className={`mb-3 ${showAnimations[sectionId] ? 'animate-fadeIn' : 'opacity-0'}`}
//                 style={{ 
//                   animationDelay: `${idx * 100}ms`,
//                   animationFillMode: 'forwards'
//                 }}
//               >
//                 <div className="flex">
//                   <div className="mr-3 mt-1">
//                     {sectionId === 'summary' && <Info className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
//                     {sectionId === 'analysis' && <Activity className={`h-4 w-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />}
//                     {sectionId === 'diet' && <Apple className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />}
//                     {sectionId === 'exercise' && <Activity className={`h-4 w-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />}
//                     {sectionId === 'monitoring' && <Bell className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
//                   </div>
//                   <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{point}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Get health score based on values
//   const calculateHealthScore = () => {
//     const totalFactors = validFactors.length;
//     if (totalFactors === 0) return 0;
    
//     const normalWeight = 3;
//     const borderlineWeight = 1;
//     const criticalWeight = 0;
    
//     const weightedSum = normalCount * normalWeight + borderlineCount * borderlineWeight;
//     const maxPossibleScore = totalFactors * normalWeight;
    
//     return Math.round((weightedSum / maxPossibleScore) * 100);
//   };
  
//   const healthScore = calculateHealthScore();

//   return (
//     <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
//       {/* Header */}
//       <header className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-700 to-blue-900'} p-6 text-white sticky top-0 z-10 shadow-lg`}>
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold flex items-center">
//               <Heart className="mr-2 h-8 w-8 animate-pulse" /> 
//               Health Dashboard
//             </h1>
//             <p className="mt-2 opacity-90">Comprehensive analysis of your health report</p>
//           </div>
//           <div className="flex space-x-3">
//             <button 
//               onClick={() => setDarkMode(!darkMode)} 
//               className="p-2 rounded-full hover:bg-white/20 transition-colors"
//               aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
//             >
//               {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
//             </button>
//             <button 
//               onClick={refreshData} 
//               className="p-2 rounded-full hover:bg-white/20 transition-colors"
//               disabled={isRefreshing}
//               aria-label="Refresh data"
//             >
//               <RefreshCw className={`h-6 w-6 ${isRefreshing ? 'animate-spin' : ''}`} />
//             </button>
//             <button 
//               className="p-2 rounded-full hover:bg-white/20 transition-colors"
//               aria-label="Print report"
//             >
//               <Printer className="h-6 w-6" />
//             </button>
//             <button 
//               className="p-2 rounded-full hover:bg-white/20 transition-colors"
//               aria-label="Share report"
//             >
//               <Share2 className="h-6 w-6" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {/* Patient Info Card */}
//         <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8 transition-all transform hover:shadow-lg`}>
//           <div className="flex flex-col md:flex-row items-start md:items-center">
//             <div className={`${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'} p-3 rounded-full mr-4 mb-4 md:mb-0`}>
//               <User className={`h-10 w-10 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`} />
//             </div>
//             <div className="flex-grow">
//               <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{patientDetails.name}</h2>
//               <div className="flex flex-wrap gap-4 text-sm mt-2">
//                 <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   <Info className="h-4 w-4 mr-1" />
//                   <span>Age: {patientDetails.age}</span>
//                 </div>
//                 <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   <Info className="h-4 w-4 mr-1" />
//                   <span>Gender: {patientDetails.gender}</span>
//                 </div>
//                 <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   <Calendar className="h-4 w-4 mr-1" />
//                   <span>Order Date: {patientDetails.orderDate}</span>
//                 </div>
//                 <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   <FileText className="h-4 w-4 mr-1" />
//                   <span>Reg ID: {patientDetails.regId}</span>
//                 </div>
//               </div>
//             </div>
//             <div className={`mt-4 md:mt-0 p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} flex flex-col items-center`}>
//               <div className="relative h-24 w-24">
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className={`h-20 w-20 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} flex items-center justify-center`}>
//                     <span className="text-3xl font-bold text-blue-600">{healthScore}</span>
//                   </div>
//                 </div>
//                 <svg className="h-24 w-24 transform -rotate-90" viewBox="0 0 100 100">
//                   <circle
//                     cx="50"
//                     cy="50"
//                     r="45"
//                     fill="none"
//                     stroke={darkMode ? "#1e3a8a" : "#dbeafe"}
//                     strokeWidth="8"
//                   />
//                   <circle
//                     cx="50"
//                     cy="50"
//                     r="45"
//                     fill="none"
//                     stroke={healthScore > 80 ? "#10b981" : healthScore > 60 ? "#f59e0b" : "#ef4444"}
//                     strokeWidth="8"
//                     strokeDasharray={`${2 * Math.PI * 45 * healthScore / 100} ${2 * Math.PI * 45 * (1 - healthScore / 100)}`}
//                     strokeLinecap="round"
//                     className="animate-progressFill"
//                   />
//                 </svg>
//               </div>
//               <p className={`mt-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Health Score</p>
//             </div>
//           </div>
//         </div>

//         {/* Status Summary */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 flex items-center transition-all transform hover:scale-105 hover:shadow-lg`}>
//             <div className={`${darkMode ? 'bg-red-900/50' : 'bg-red-100'} p-3 rounded-full mr-4`}>
//               <AlertCircle className={`h-6 w-6 ${darkMode ? 'text-red-400' : 'text-red-600'} animate-pulse`} />
//             </div>
//             <div>
//               <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Critical Values</p>
//               <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 <span className="counter">{criticalCount}</span>
//               </p>
//             </div>
//           </div>
          
//           <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 flex items-center transition-all transform hover:scale-105 hover:shadow-lg`}>
//             <div className={`${darkMode ? 'bg-yellow-900/50' : 'bg-yellow-100'} p-3 rounded-full mr-4`}>
//               <Activity className={`h-6 w-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'} animate-pulse`} />
//             </div>
//             <div>
//               <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Borderline Values</p>
//               <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 <span className="counter">{borderlineCount}</span>
//               </p>
//             </div>
//           </div>
          
//           <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 flex items-center transition-all transform hover:scale-105 hover:shadow-lg`}>
//             <div className={`${darkMode ? 'bg-green-900/50' : 'bg-green-100'} p-3 rounded-full mr-4`}>
//               <Heart className={`h-6 w-6 ${darkMode ? 'text-green-400' : 'text-green-600'} animate-pulse`} />
//             </div>
//             <div>
//               <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Normal Values</p>
//               <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 <span className="counter">{normalCount}</span>
//                 </p>
//             </div>
//           </div>
//         </div>

//         {/* Key Health Metrics */}
//         <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Key Health Metrics</h2>
        
//         {/* Lipid Profile */}
//         <div className="mb-8">
//           <div className="flex items-center mb-3">
//             <Heart className={`h-5 w-5 mr-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
//             <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Lipid Profile</h3>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {categorizedFactors.lipidProfile.map(factor => {
//               const factorData = factors[factor];
//               if (!factorData) return null;
//               return (
//                 <MetricCard 
//                   key={factor}
//                   title={factor}
//                   value={factorData.value}
//                   classification={factorData.classification}
//                   unit={extractUnit(factor, factorData.value)}
//                 />
//               );
//             })}
//           </div>
//         </div>
        
//         {/* Blood Sugar */}
//         <div className="mb-8">
//           <div className="flex items-center mb-3">
//             <Droplet className={`h-5 w-5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//             <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Blood Sugar</h3>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {categorizedFactors.bloodSugar.map(factor => {
//               const factorData = factors[factor];
//               if (!factorData) return null;
//               return (
//                 <MetricCard 
//                   key={factor}
//                   title={factor}
//                   value={factorData.value}
//                   classification={factorData.classification}
//                   unit={extractUnit(factor, factorData.value)}
//                 />
//               );
//             })}
//           </div>
//         </div>
        
//         {/* Blood Count */}
//         <div className="mb-8">
//           <div className="flex items-center mb-3">
//             <Activity className={`h-5 w-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
//             <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Blood Count</h3>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
//             {categorizedFactors.bloodCount.map(factor => {
//               const factorData = factors[factor];
//               if (!factorData) return null;
//               return (
//                 <MetricCard 
//                   key={factor}
//                   title={factor}
//                   value={factorData.value}
//                   classification={factorData.classification}
//                   unit={extractUnit(factor, factorData.value)}
//                 />
//               );
//             })}
//           </div>
//         </div>
        
//         {/* Other Metrics */}
//         <div className="mb-8">
//           <div className="flex items-center mb-3">
//             <Thermometer className={`h-5 w-5 mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
//             <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Other Important Markers</h3>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {categorizedFactors.other.map(factor => {
//               const factorData = factors[factor];
//               if (!factorData) return null;
//               return (
//                 <MetricCard 
//                   key={factor}
//                   title={factor}
//                   value={factorData.value}
//                   classification={factorData.classification}
//                   unit={extractUnit(factor, factorData.value)}
//                 />
//               );
//             })}
//           </div>
//         </div>

//         {/* Analysis Sections */}
//         <h2 className={`text-xl font-bold mb-4 mt-12 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Health Analysis & Recommendations</h2>
        
//         {renderSection('summary')}
//         {renderSection('analysis')}
//         {renderSection('diet')}
//         {renderSection('exercise')}
//         {renderSection('monitoring')}
        
//         {/* Action Buttons */}
//         <div className="flex flex-wrap justify-center gap-4 mt-12 mb-6">
//           <button className={`flex items-center px-6 py-3 rounded-lg ${darkMode ? 'bg-blue-800 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-md transition-all transform hover:scale-105`}>
//             <Download className="h-5 w-5 mr-2" />
//             Download Report
//           </button>
//           <button className={`flex items-center px-6 py-3 rounded-lg ${darkMode ? 'bg-purple-800 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white shadow-md transition-all transform hover:scale-105`}>
//             <Calendar className="h-5 w-5 mr-2" />
//             Schedule Follow-up
//           </button>
//           <button className={`flex items-center px-6 py-3 rounded-lg ${darkMode ? 'bg-green-800 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white shadow-md transition-all transform hover:scale-105`}>
//             <Shield className="h-5 w-5 mr-2" />
//             View Health Plan
//           </button>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className={`${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'} py-6 mt-8`}>
//         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
//           <div className="flex items-center mb-4 md:mb-0">
//             <Heart className={`h-6 w-6 mr-2 text-red-500`} />
//             <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Health Dashboard</span>
//           </div>
//           <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//             Report generated on: {new Date().toLocaleDateString()}
//           </div>
//           <div className="flex space-x-4 mt-4 md:mt-0">
//             <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
//               <Award className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//             </button>
//             <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
//               <Info className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//             </button>
//             <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
//               <Flag className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//             </button>
//           </div>
//         </div>
//       </footer>

//       {/* Back to top button */}
//       <button 
//         className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all transform hover:scale-110 ${
//           darkMode ? 'bg-blue-800 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
//         } text-white`}
//         onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
//       >
//         <TrendingUp className="h-5 w-5" />
//       </button>

//       {/* Add global styles */}
//       <style jsx global>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
        
//         @keyframes progressFill {
//           0% { stroke-dasharray: 0 ${2 * Math.PI * 45}; }
//           100% { stroke-dasharray: ${2 * Math.PI * 45 * healthScore / 100} ${2 * Math.PI * 45 * (1 - healthScore / 100)}; }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.6s ease-out forwards;
//         }
        
//         .animate-progressFill {
//           animation: progressFill 1.5s ease-out forwards;
//         }
        
//         .counter {
//           display: inline-block;
//           animation: countUp 1.5s ease-out forwards;
//         }
        
//         @keyframes countUp {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default HealthDashboard;



// import React, { useState, useEffect, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { 
//   ChevronDown, 
//   ChevronUp, 
//   AlertCircle, 
//   Info, 
//   Heart, 
//   Activity, 
//   Calendar, 
//   FileText, 
//   User, 
//   ArrowUp, 
//   ArrowDown, 
//   Minus,
//   Apple,
//   Clipboard,
//   Shield,
//   TrendingUp,
//   Bell,
//   Zap,
//   Download,
//   RefreshCw,
//   Share2,
//   Award,
//   Droplet,
//   Thermometer,
//   Printer,
//   Moon,
//   Sun,
//   Flag,
//   BarChart2,
//   PieChart,
//   ChevronRight,
//   Clock,
//   ArrowRight,
//   Plus,
//   Layout,
//   List
// } from 'lucide-react';

// const HealthDashboard = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [reportData, setReportData] = useState(null);
//   const [activeTab, setActiveTab] = useState('summary');
//   const [expandedSections, setExpandedSections] = useState({
//     summary: true,
//     analysis: true,
//     diet: true,
//     exercise: true,
//     monitoring: true
//   });
//   const [loading, setLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [showAnimations, setShowAnimations] = useState({});
//   const [activePage, setActivePage] = useState('overview');
//   const animationTimeouts = useRef({});

//   useEffect(() => {
//     // Simulate loading data
//     setLoading(true);
//     const timer = setTimeout(() => {
//       if (location.state && location.state.reportData) {
//         setReportData(location.state.reportData);
//       } else {
//         // Fetch mock data if none is provided
//         fetchMockData();
//       }
//       setLoading(false);
//     }, 1000);
    
//     return () => clearTimeout(timer);
//   }, [location]);

//   // Trigger animations when sections are expanded
//   useEffect(() => {
//     Object.keys(expandedSections).forEach(section => {
//       if (expandedSections[section]) {
//         // Clear any existing timeout
//         if (animationTimeouts.current[section]) {
//           clearTimeout(animationTimeouts.current[section]);
//         }
        
//         // Set animation state to true
//         setShowAnimations(prev => ({ ...prev, [section]: false }));
        
//         // Set animation after a short delay to ensure DOM is ready
//         animationTimeouts.current[section] = setTimeout(() => {
//           setShowAnimations(prev => ({ ...prev, [section]: true }));
//         }, 100);
//       }
//     });
    
//     return () => {
//       // Clean up timeouts
//       Object.values(animationTimeouts.current).forEach(timeout => clearTimeout(timeout));
//     };
//   }, [expandedSections]);

//   const fetchMockData = () => {
//     // Mock data if no data is provided
//     const mockData = {
//       factors: {
//         Name: { value: 'John Doe' },
//         Age: { value: '42' },
//         Gender: { value: 'Male' },
//         Reg_ID: { value: 'REG12345' },
//         Sample_No: { value: 'SAMPLE456' },
//         Order_Date_Time: { value: '2025-03-15' },
//         'RBC Count': { value: '5.1', classification: 'Normal' },
//         'Hemoglobin': { value: '14.5', classification: 'Normal' },
//         'PCV': { value: '45', classification: 'Normal' },
//         'MCV': { value: '88', classification: 'Normal' },
//         'MCH': { value: '29', classification: 'Normal' },
//         'MCHC': { value: '32', classification: 'Normal' },
//         'Total Cholesterol': { value: '240', classification: 'High-Borderline' },
//         'LDL Cholesterol': { value: '155', classification: 'High' },
//         'HDL Cholesterol': { value: '42', classification: 'Low-Borderline' },
//         'Triglycerides': { value: '180', classification: 'High-Borderline' },
//         'Fasting Blood Sugar': { value: '110', classification: 'High-Borderline' },
//         'HbA1c': { value: '6.1', classification: 'Borderline' },
//         'Estimated Avg Glucose (3 Mths)': { value: '125', classification: 'High-Borderline' },
//         'Serum B12 Levels': { value: '280', classification: 'Low-Borderline' },
//         'Insulin Levels': { value: '18', classification: 'High-Borderline' }
//       },
//       report: {
//         report: `## 1️⃣ Health Summary
// * Your lab results show borderline high cholesterol levels with LDL (bad cholesterol) above optimal range
// * Blood sugar parameters indicate prediabetic tendencies with HbA1c at 6.1%
// * Vitamin B12 levels are slightly below the optimal range
// * Overall blood count parameters are within normal limits

// ## 2️⃣ Detailed Analysis
// * Your lipid profile shows elevated total cholesterol (240 mg/dl) and LDL cholesterol (155 mg/dl), indicating increased cardiovascular risk
// * HDL (good cholesterol) is borderline low at 42 mg/dl, reducing your natural protection against heart disease
// * Fasting blood sugar (110 mg/dl) and HbA1c (6.1%) suggest prediabetes, which means you're at risk for developing type 2 diabetes
// * Low B12 levels may contribute to fatigue and neurological symptoms if not addressed

// ## 3️⃣ Dietary Recommendations
// * Reduce saturated fat intake by limiting red meat, full-fat dairy, and processed foods
// * Increase soluble fiber consumption through oats, beans, fruits and vegetables to help lower cholesterol
// * Add plant sterols/stanols through foods like nuts, seeds, and vegetable oils
// * Limit added sugars and refined carbohydrates to help manage blood sugar levels
// * Include B12-rich foods like fish, meat, eggs, and dairy, or consider a supplement

// ## 4️⃣ Exercise Recommendations
// * Aim for at least 150 minutes of moderate-intensity aerobic activity weekly
// * Include resistance training 2-3 times per week to improve insulin sensitivity
// * Consider daily walking after meals to help manage blood sugar levels
// * Start with 10-minute activity sessions if currently sedentary, gradually increasing duration
// * Monitor heart rate during exercise and stay within your target heart rate zone

// ## 5️⃣ Monitoring & Next Steps
// * Schedule a follow-up lipid profile test in 3 months to assess improvement
// * Consider glucose monitoring to track blood sugar patterns
// * Retest HbA1c in 3-6 months to monitor for changes
// * Schedule a consultation with a dietitian for personalized meal planning
// * Consider cardiovascular risk assessment with your physician`
//       }
//     };
//     setReportData(mockData);
//   };

//   const refreshData = () => {
//     setIsRefreshing(true);
//     // Simulate data refresh
//     setTimeout(() => {
//       if (location.state && location.state.reportData) {
//         setReportData(location.state.reportData);
//       } else {
//         fetchMockData();
//       }
//       setIsRefreshing(false);
//     }, 1500);
//   };

//   if (loading) {
//     return (
//       <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center p-8">
//           <RefreshCw className={`mx-auto h-12 w-12 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'} mb-4 animate-spin`} />
//           <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Loading your health report</h2>
//           <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please wait while we analyze your data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!reportData) {
//     return (
//       <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center p-8">
//           <AlertCircle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
//           <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>No report data found</h2>
//           <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please upload a health report to view your dashboard</p>
//           <button 
//             className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center mx-auto"
//             onClick={fetchMockData}
//           >
//             <FileText className="h-5 w-5 mr-2" />
//             Load Sample Report
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { factors, report } = reportData;

//   // Function to get indicators
//   const getStatusIndicator = (classification) => {
//     if (!classification) return null;
    
//     if (classification.includes('Normal')) {
//       return <ArrowUp className="text-emerald-500 h-5 w-5" />;
//     } else if (classification.includes('Borderline')) {
//       return <Minus className="text-amber-500 h-5 w-5" />;
//     } else if (classification.includes('Low') || classification.includes('High')) {
//       return <ArrowDown className="text-rose-500 h-5 w-5" />;
//     }
//     return null;
//   };

//   // Filter out "Not Found" values
//   const validFactors = Object.entries(factors).filter(
//     ([_, value]) => value !== "Not Found" && typeof value === 'object'
//   );
  
//   // Group factors by categories for better visualization
//   const categorizedFactors = {
//     bloodCount: ['RBC Count', 'Hemoglobin', 'PCV', 'MCV', 'MCH', 'MCHC'],
//     lipidProfile: ['Total Cholesterol', 'LDL Cholesterol', 'HDL Cholesterol', 'Triglycerides'],
//     bloodSugar: ['Fasting Blood Sugar', 'HbA1c', 'Estimated Avg Glucose (3 Mths)'],
//     other: ['Serum B12 Levels', 'Insulin Levels']
//   };

//   const patientDetails = {
//     name: factors.Name?.value || 'N/A',
//     age: factors.Age?.value || 'N/A',
//     gender: factors.Gender?.value || 'N/A',
//     regId: factors.Reg_ID?.value || 'N/A',
//     sampleNo: factors.Sample_No?.value || 'N/A',
//     orderDate: factors.Order_Date_Time?.value || 'N/A'
//   };

//   // Count critical values
//   const criticalCount = validFactors.filter(([_, value]) => 
//     value.classification && (value.classification.includes('Critical') || value.classification.includes('High') || value.classification.includes('Low'))
//   ).length;
  
//   const normalCount = validFactors.filter(([_, value]) => 
//     value.classification && value.classification.includes('Normal')
//   ).length;

//   const borderlineCount = validFactors.filter(([_, value]) => 
//     value.classification && value.classification.includes('Borderline')
//   ).length;

//   // Process the report content for better display
//   const parseReportContent = () => {
//     const reportText = typeof report === 'object' && report.report 
//       ? report.report
//       : '';
    
//     // Split the report into sections by looking for "## " headers
//     const sections = reportText.split(/(?=## )/).filter(Boolean);
    
//     const processedSections = {};
    
//     sections.forEach(section => {
//       // Extract the title (everything after ## until the first newline)
//       const titleMatch = section.match(/## (.*?)(?:\n|$)/);
//       if (titleMatch) {
//         const title = titleMatch[1].trim();
//         // Get section identifier from emoji if present
//         let sectionId = '';
        
//         if (title.includes('1️⃣')) sectionId = 'summary';
//         else if (title.includes('2️⃣')) sectionId = 'analysis';
//         else if (title.includes('3️⃣')) sectionId = 'diet';
//         else if (title.includes('4️⃣')) sectionId = 'exercise';
//         else if (title.includes('5️⃣')) sectionId = 'monitoring';
        
//         // Get content (everything after the title)
//         const content = section.replace(/## .*?\n/, '').trim();
        
//         if (sectionId) {
//           processedSections[sectionId] = {
//             title,
//             content,
//             // Parse bullet points for better display
//             bulletPoints: content.split(/\n\s*[\*\-]\s*/).filter(item => item.trim())
//           };
//         }
//       }
//     });
    
//     return processedSections;
//   };

//   const reportSections = parseReportContent();

//   const toggleSection = (section) => {
//     setExpandedSections({
//       ...expandedSections,
//       [section]: !expandedSections[section]
//     });
//   };

//   // Create metric card for dashboard
//   const MetricCard = ({ title, value, classification, unit }) => {
//     const isNormal = classification && classification.includes('Normal');
//     const isBorderline = classification && classification.includes('Borderline');
//     const isCritical = !isNormal && !isBorderline;
    
//     return (
//       <div className={`rounded-lg shadow-md p-4 flex flex-col transition-all duration-300 transform hover:translate-y-[-4px] 
//                        ${darkMode ? 
//                          (isNormal ? 'bg-emerald-900/20 border border-emerald-700/40' : 
//                           isBorderline ? 'bg-amber-900/20 border border-amber-700/40' : 
//                           'bg-rose-900/20 border border-rose-700/40') : 
//                          (isNormal ? 'bg-white border-l-4 border-l-emerald-500' : 
//                           isBorderline ? 'bg-white border-l-4 border-l-amber-500' : 
//                           'bg-white border-l-4 border-l-rose-500')}`}>
//         <div className="flex justify-between items-start mb-2">
//           <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{title}</h3>
//           <div className="flex items-center">
//             {getStatusIndicator(classification)}
//           </div>
//         </div>
//         <div className="mt-auto">
//           <div className="flex items-baseline">
//             <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
//             {unit && <span className={`ml-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{unit}</span>}
//           </div>
//           <p className={`text-xs mt-1 ${
//             isNormal ? 'text-emerald-600' :
//             isBorderline ? 'text-amber-600' :
//             'text-rose-600'
//           }`}>
//             {classification || 'N/A'}
//           </p>
//         </div>
//       </div>
//     );
//   };

//   // Extract units from values where possible
//   const extractUnit = (title, value) => {
//     const commonUnits = {
//       'Hemoglobin': 'g/dl',
//       'RBC Count': 'mill/cmm',
//       'Total Cholesterol': 'mg/dl',
//       'LDL Cholesterol': 'mg/dl',
//       'HDL Cholesterol': 'mg/dl',
//       'Triglycerides': 'mg/dl',
//       'Fasting Blood Sugar': 'mg/dl',
//       'HbA1c': '%',
//       'PCV': '%',
//       'MCV': 'fl',
//       'MCH': 'pg',
//       'MCHC': 'g/dl',
//       'Serum B12 Levels': 'pg/ml'
//     };
    
//     return commonUnits[title] || '';
//   };

//   // Function to render a section with proper formatting
//   const renderSection = (sectionId, icon) => {
//     const section = reportSections[sectionId];
//     if (!section) return null;
    
//     const getSectionIcon = () => {
//       switch (sectionId) {
//         case 'summary':
//           return <FileText className="h-5 w-5 text-indigo-600" />;
//         case 'analysis':
//           return <BarChart2 className="h-5 w-5 text-violet-600" />;
//         case 'diet':
//           return <Apple className="h-5 w-5 text-emerald-600" />;
//         case 'exercise':
//           return <Activity className="h-5 w-5 text-amber-600" />;
//         case 'monitoring':
//           return <Clipboard className="h-5 w-5 text-blue-600" />;
//         default:
//           return icon;
//       }
//     };
    
//     return (
//       <div className={`mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-all duration-300`}>
//         <div 
//           className={`flex justify-between items-center p-4 ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'} cursor-pointer hover:brightness-95 transition-all`}
//           onClick={() => toggleSection(sectionId)}
//         >
//           <div className="flex items-center">
//             {getSectionIcon()}
//             <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-indigo-800'} ml-2`}>{section.title}</h3>
//           </div>
//           {expandedSections[sectionId] ? 
//             <ChevronUp className={`h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300`} /> : 
//             <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300`} />
//           }
//         </div>
        
//         {expandedSections[sectionId] && (
//           <div className={`p-5 ${darkMode ? 'border-t border-gray-700' : 'border-t border-indigo-100'}`}>
//             {section.bulletPoints.map((point, idx) => (
//               <div 
//                 key={idx} 
//                 className={`mb-3 ${showAnimations[sectionId] ? 'animate-fadeIn' : 'opacity-0'}`}
//                 style={{ 
//                   animationDelay: `${idx * 100}ms`,
//                   animationFillMode: 'forwards'
//                 }}
//               >
//                 <div className="flex">
//                   <div className="mr-3 mt-1">
//                     {sectionId === 'summary' && <Info className={`h-4 w-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />}
//                     {sectionId === 'analysis' && <Activity className={`h-4 w-4 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />}
//                     {sectionId === 'diet' && <Apple className={`h-4 w-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />}
//                     {sectionId === 'exercise' && <Activity className={`h-4 w-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />}
//                     {sectionId === 'monitoring' && <Bell className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
//                   </div>
//                   <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{point}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Get health score based on values
//   const calculateHealthScore = () => {
//     const totalFactors = validFactors.length;
//     if (totalFactors === 0) return 0;
    
//     const normalWeight = 3;
//     const borderlineWeight = 1;
//     const criticalWeight = 0;
    
//     const weightedSum = normalCount * normalWeight + borderlineCount * borderlineWeight;
//     const maxPossibleScore = totalFactors * normalWeight;
    
//     return Math.round((weightedSum / maxPossibleScore) * 100);
//   };
  
//   const healthScore = calculateHealthScore();

//   const Header = () => (
//     <header className={`${darkMode ? 'bg-gradient-to-r from-indigo-900 to-violet-900' : 'bg-gradient-to-r from-indigo-600 to-violet-600'} p-6 text-white sticky top-0 z-10 shadow-lg`}>
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold flex items-center">
//             <Heart className="mr-2 h-8 w-8" /> 
//             Health Dashboard
//           </h1>
//           <p className="mt-2 opacity-90">Comprehensive analysis of your health report</p>
//         </div>
//         <div className="flex space-x-3">
//           <button 
//             onClick={() => setDarkMode(!darkMode)} 
//             className="p-2 rounded-full hover:bg-white/20 transition-colors"
//             aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
//           >
//             {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
//           </button>
//           <button 
//             onClick={refreshData} 
//             className="p-2 rounded-full hover:bg-white/20 transition-colors"
//             disabled={isRefreshing}
//             aria-label="Refresh data"
//           >
//             <RefreshCw className={`h-6 w-6 ${isRefreshing ? 'animate-spin' : ''}`} />
//           </button>
//           <button 
//             className="p-2 rounded-full hover:bg-white/20 transition-colors"
//             aria-label="Print report"
//           >
//             <Printer className="h-6 w-6" />
//           </button>
//           <button 
//             className="p-2 rounded-full hover:bg-white/20 transition-colors"
//             aria-label="Share report"
//           >
//             <Share2 className="h-6 w-6" />
//           </button>
//         </div>
//       </div>
//     </header>
//   );

//   const Footer = () => (
//     <footer className={`${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'} py-6`}>
//       <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
//         <div className="flex items-center mb-4 md:mb-0">
//           <Heart className={`h-6 w-6 mr-2 text-indigo-500`} />
//           <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Health Dashboard</span>
//         </div>
//         <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//           Report generated on: {new Date().toLocaleDateString()}
//         </div>
//         <div className="flex space-x-4 mt-4 md:mt-0">
//           <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
//             <Award className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//           </button>
//           <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
//             <Info className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//           </button>
//           <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
//             <Flag className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//           </button>
//         </div>
//       </div>
//     </footer>
//   );

//   const OverviewPage = () => {
//     // Create the risk assessment based on factors
//     const getRiskAssessment = () => {
//       const riskFactors = {
//         cardiovascular: {
//           risk: criticalCount > 0 ? 'Moderate' : 'Low',
//           detail: 'Based on cholesterol levels and blood pressure'
//         },
//         diabetes: {
//           risk: borderlineCount > 2 ? 'Moderate' : 'Low',
//           detail: 'Based on blood sugar levels and HbA1c'
//         },
//         deficiency: {
//           risk: validFactors.some(([key, value]) => key === 'Serum B12 Levels' && value.classification.includes('Low')) ? 'Moderate' : 'Low',
//           detail: 'Based on vitamin and mineral levels'
//         }
//       };
      
//       return riskFactors;
//     };
    
//     const riskAssessment = getRiskAssessment();

//     return (
//       <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
//         <Header />
        
//         {/* Navigation Tabs */}
//         <div className={`sticky top-[88px] z-10 shadow-sm ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
//           <div className="max-w-7xl mx-auto px-4">
//             <div className="flex space-x-1">
//               <button 
//                 className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
//                   activePage === 'overview' 
//                     ? `border-indigo-500 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}` 
//                     : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
//                 }`}
//                 onClick={() => setActivePage('overview')}
//               >
//                 <Layout className="h-4 w-4 inline mr-2" />
//                 Overview
//               </button>
//               <button 
//                 className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
//                   activePage === 'details' 
//                     ? `border-indigo-500 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}` 
//                     : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
//                 }`}
//                 onClick={() => setActivePage('details')}
//               >
//                 <List className="h-4 w-4 inline mr-2" />
//                 Detailed Report
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <main className="max-w-7xl mx-auto px-4 py-8">
//           {/* Patient Info Card */}
//           <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8 transition-all transform hover:shadow-lg`}>
//             <div className="flex flex-col md:flex-row items-start md:items-center">
//               <div className={`${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'} p-3 rounded-full mr-4 mb-4 md:mb-0`}>
//                 <User className={`h-10 w-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`} />
//               </div>
//               <div className="flex-grow">
//                 <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{patientDetails.name}</h2>
//                 <div className="flex flex-wrap gap-4 text-sm mt-2">
//                   <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     <Info className="h-4 w-4 mr-1" />
//                     <span>Age: {patientDetails.age}</span>
//                   </div>
//                   <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     <Info className="h-4 w-4 mr-1" />
//                     <span>Gender: {patientDetails.gender}</span>
//                   </div>
//                   <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     <Calendar className="h-4 w-4 mr-1" />
//                     <span>Order Date: {patientDetails.name}</span>
//                   </div>
//                   <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     <Clipboard className="h-4 w-4 mr-1" />
//                     <span>Reg ID: {patientDetails.regId}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-4 md:mt-0">
//                 <button 
//                   className={`px-4 py-2 rounded-lg flex items-center ${darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition-colors`}
//                   onClick={() => navigate('/upload')}
//                 >
//                   <ArrowRight className="h-4 w-4 mr-2" />
//                   New Report
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Health Score Card */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 transition-all transform hover:shadow-lg`}>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Health Score</h3>
//                 <TrendingUp className={`h-6 w-6 ${healthScore > 70 ? 'text-emerald-500' : healthScore > 40 ? 'text-amber-500' : 'text-rose-500'}`} />
//               </div>
//               <div className="flex items-center justify-center mb-4">
//                 <div className="relative w-40 h-40">
//                   <svg className="w-full h-full" viewBox="0 0 100 100">
//                     <circle
//                       className="text-gray-200"
//                       strokeWidth="8"
//                       stroke="currentColor"
//                       fill="transparent"
//                       r="40"
//                       cx="50"
//                       cy="50"
//                     />
//                     <circle
//                       className={`${healthScore > 70 ? 'text-emerald-500' : healthScore > 40 ? 'text-amber-500' : 'text-rose-500'}`}
//                       strokeWidth="8"
//                       strokeDasharray={`${healthScore * 2.51}, 251`}
//                       strokeLinecap="round"
//                       stroke="currentColor"
//                       fill="transparent"
//                       r="40"
//                       cx="50"
//                       cy="50"
//                     />
//                   </svg>
//                   <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${
//                     healthScore > 70 ? 'text-emerald-500' : 
//                     healthScore > 40 ? 'text-amber-500' : 'text-rose-500'
//                   }`}>
//                     {healthScore}
//                   </div>
//                 </div>
//               </div>
//               <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                 {healthScore > 70 ? 'Good overall health' : 
//                  healthScore > 40 ? 'Moderate health concerns' : 
//                  'Significant health concerns'}
//               </p>
//             </div>

//             {/* Critical Values Card */}
//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 transition-all transform hover:shadow-lg`}>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Critical Values</h3>
//                 <AlertCircle className="h-6 w-6 text-rose-500" />
//               </div>
//               <div className="flex items-center justify-center mb-4">
//                 <div className="text-5xl font-bold text-rose-500">{criticalCount}</div>
//               </div>
//               <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                 {criticalCount === 0 ? 'No critical values found' : 
//                  criticalCount === 1 ? '1 critical value needs attention' : 
//                  `${criticalCount} critical values need attention`}
//               </p>
//             </div>

//             {/* Risk Assessment Card */}
//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 transition-all transform hover:shadow-lg`}>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Risk Assessment</h3>
//                 <Shield className="h-6 w-6 text-indigo-500" />
//               </div>
//               <div className="space-y-4">
//                 {Object.entries(riskAssessment).map(([riskType, assessment]) => (
//                   <div key={riskType} className="flex items-center justify-between">
//                     <span className={`capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                       {riskType.replace(/([A-Z])/g, ' $1')}
//                     </span>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       assessment.risk === 'High' ? 'bg-rose-100 text-rose-800' :
//                       assessment.risk === 'Moderate' ? 'bg-amber-100 text-amber-800' :
//                       'bg-emerald-100 text-emerald-800'
//                     }`}>
//                       {assessment.risk}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Key Metrics Grid */}
//           <div className="mb-8">
//             <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Key Health Metrics</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {Object.entries(categorizedFactors).map(([category, factorNames]) => (
//                 <div key={category} className="space-y-4">
//                   <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//                     {category === 'bloodCount' && 'Blood Count'}
//                     {category === 'lipidProfile' && 'Lipid Profile'}
//                     {category === 'bloodSugar' && 'Blood Sugar'}
//                     {category === 'other' && 'Other Metrics'}
//                   </h3>
//                   {factorNames.map(factorName => {
//                     const factor = factors[factorName];
//                     if (!factor) return null;
//                     return (
//                       <MetricCard 
//                         key={factorName}
//                         title={factorName}
//                         value={factor.value}
//                         classification={factor.classification}
//                         unit={extractUnit(factorName, factor.value)}
//                       />
//                     );
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Report Sections */}
//           {/* <div className="space-y-6">
//             <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Health Report Analysis</h2>
//             {renderSection('summary')}
//             {renderSection('analysis')}
//             {renderSection('diet')}
//             {renderSection('exercise')}
//             {renderSection('monitoring')}
//           </div> */}
//         </main>

//         <Footer />
//       </div>
//     );
//   };

//   const DetailsPage = () => {
//     return (
//       <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
//         <Header />
        
//         {/* Navigation Tabs */}
//         <div className={`sticky top-[88px] z-10 shadow-sm ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
//           <div className="max-w-7xl mx-auto px-4">
//             <div className="flex space-x-1">
//               <button 
//                 className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
//                   activePage === 'overview' 
//                     ? `border-indigo-500 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}` 
//                     : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
//                 }`}
//                 onClick={() => setActivePage('overview')}
//               >
//                 <Layout className="h-4 w-4 inline mr-2" />
//                 Overview
//               </button>
//               <button 
//                 className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
//                   activePage === 'details' 
//                     ? `border-indigo-500 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}` 
//                     : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
//                 }`}
//                 onClick={() => setActivePage('details')}
//               >
//                 <List className="h-4 w-4 inline mr-2" />
//                 Detailed Report
//               </button>
//             </div>
//           </div>
//         </div>

//         <main className="max-w-7xl mx-auto px-4 py-8">
//           {/* Full Report Table */}
//           <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden mb-8`}>
//             <div className={`p-6 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
//               <h2 className={`text-xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//                 <FileText className="h-5 w-5 mr-2 text-indigo-600" />
//                 Complete Lab Results
//               </h2>
//               <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                 Detailed breakdown of all measured health parameters
//               </p>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                   <tr>
//                     <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Test</th>
//                     <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Value</th>
//                     <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Reference Range</th>
//                     <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
//                   {validFactors.map(([key, value]) => (
//                     <tr key={key} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
//                       <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>{key}</td>
//                       <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                         {value.value} {extractUnit(key, value.value)}
//                       </td>
//                       <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                         {getReferenceRange(key)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           value.classification.includes('Normal') ? 'bg-emerald-100 text-emerald-800' :
//                           value.classification.includes('Borderline') ? 'bg-amber-100 text-amber-800' :
//                           'bg-rose-100 text-rose-800'
//                         }`}>
//                           {value.classification}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Report Sections */}
//           <div className="space-y-6">
//             <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Comprehensive Analysis</h2>
//             {renderSection('summary')}
//             {renderSection('analysis')}
//             {renderSection('diet')}
//             {renderSection('exercise')}
//             {renderSection('monitoring')}
//           </div>
//         </main>

//         <Footer />
//       </div>
//     );
//   };

//   // Helper function to get reference ranges for tests
//   const getReferenceRange = (testName) => {
//     const ranges = {
//       'RBC Count': '4.5-5.5 mill/cmm',
//       'Hemoglobin': '13.5-17.5 g/dl',
//       'PCV': '40-50%',
//       'MCV': '80-100 fl',
//       'MCH': '27-32 pg',
//       'MCHC': '32-36 g/dl',
//       'Total Cholesterol': '<200 mg/dl (desirable)',
//       'LDL Cholesterol': '<100 mg/dl (optimal)',
//       'HDL Cholesterol': '>60 mg/dl (desirable)',
//       'Triglycerides': '<150 mg/dl (normal)',
//       'Fasting Blood Sugar': '70-99 mg/dl (normal)',
//       'HbA1c': '<5.7% (normal)',
//       'Serum B12 Levels': '200-900 pg/ml',
//       'Insulin Levels': '2.6-24.9 μIU/ml'
//     };
    
//     return ranges[testName] || 'N/A';
//   };

//   return activePage === 'overview' ? <OverviewPage /> : <DetailsPage />;
// };

// export default HealthDashboard;

// import React, { useState, useEffect, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { 
//   ChevronDown, 
//   ChevronUp, 
//   AlertCircle, 
//   Info, 
//   Heart, 
//   Activity, 
//   Calendar, 
//   FileText, 
//   User, 
//   ArrowUp, 
//   ArrowDown, 
//   Minus,
//   Apple,
//   Clipboard,
//   Shield,
//   TrendingUp,
//   Bell,
//   Zap,
//   Download,
//   RefreshCw,
//   Share2,
//   Award,
//   Droplet,
//   Thermometer,
//   Printer,
//   Moon,
//   Sun,
//   Flag,
//   BarChart2,
//   PieChart,
//   ChevronRight,
//   Clock,
//   ArrowRight,
//   Plus,
//   Layout,
//   List,
//   X
// } from 'lucide-react';

// const HealthDashboard = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [reportData, setReportData] = useState(null);
//   const [activeTab, setActiveTab] = useState('summary');
//   const [expandedSections, setExpandedSections] = useState({
//     summary: true,
//     analysis: true,
//     diet: true,
//     exercise: true,
//     monitoring: true
//   });
//   const [loading, setLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [showAnimations, setShowAnimations] = useState({});
//   const [activePage, setActivePage] = useState('overview');
//   const [showReminders, setShowReminders] = useState(false);
//   const [notifications, setNotifications] = useState(3);
//   const animationTimeouts = useRef({});

//   // Today's reminders data
//   const todaysReminders = {
//     morning: "Focus on medication adherence. Check RBC Count levels",
//     afternoon: "Hydrate well for RBC Count management",
//     evening: "Prepare your medications for tomorrow",
//     alert: "Your cholesterol levels need attention - consider dietary changes"
//   };

//   useEffect(() => {
//     // Simulate loading data
//     setLoading(true);
//     const timer = setTimeout(() => {
//       if (location.state && location.state.reportData) {
//         setReportData(location.state.reportData);
//       } else {
//         fetchMockData();
//       }
//       setLoading(false);
//     }, 1000);
    
//     return () => clearTimeout(timer);
//   }, [location]);

//   // Trigger animations when sections are expanded
//   useEffect(() => {
//     Object.keys(expandedSections).forEach(section => {
//       if (expandedSections[section]) {
//         if (animationTimeouts.current[section]) {
//           clearTimeout(animationTimeouts.current[section]);
//         }
        
//         setShowAnimations(prev => ({ ...prev, [section]: false }));
        
//         animationTimeouts.current[section] = setTimeout(() => {
//           setShowAnimations(prev => ({ ...prev, [section]: true }));
//         }, 100);
//       }
//     });
    
//     return () => {
//       Object.values(animationTimeouts.current).forEach(timeout => clearTimeout(timeout));
//     };
//   }, [expandedSections]);

//   const fetchMockData = () => {
//     const mockData = {
//       factors: {
//         Name: { value: 'John Doe' },
//         Age: { value: '42' },
//         Gender: { value: 'Male' },
//         Reg_ID: { value: 'REG12345' },
//         Sample_No: { value: 'SAMPLE456' },
//         Order_Date_Time: { value: '2025-03-15' },
//         'RBC Count': { value: '5.1', classification: 'Normal' },
//         'Hemoglobin': { value: '14.5', classification: 'Normal' },
//         'PCV': { value: '45', classification: 'Normal' },
//         'MCV': { value: '88', classification: 'Normal' },
//         'MCH': { value: '29', classification: 'Normal' },
//         'MCHC': { value: '32', classification: 'Normal' },
//         'Total Cholesterol': { value: '240', classification: 'High-Borderline' },
//         'LDL Cholesterol': { value: '155', classification: 'High' },
//         'HDL Cholesterol': { value: '42', classification: 'Low-Borderline' },
//         'Triglycerides': { value: '180', classification: 'High-Borderline' },
//         'Fasting Blood Sugar': { value: '110', classification: 'High-Borderline' },
//         'HbA1c': { value: '6.1', classification: 'Borderline' },
//         'Estimated Avg Glucose (3 Mths)': { value: '125', classification: 'High-Borderline' },
//         'Serum B12 Levels': { value: '280', classification: 'Low-Borderline' },
//         'Insulin Levels': { value: '18', classification: 'High-Borderline' }
//       },
//       report: {
//         report: `## 1️⃣ Health Summary
// * Your lab results show borderline high cholesterol levels with LDL (bad cholesterol) above optimal range
// * Blood sugar parameters indicate prediabetic tendencies with HbA1c at 6.1%
// * Vitamin B12 levels are slightly below the optimal range
// * Overall blood count parameters are within normal limits

// ## 2️⃣ Detailed Analysis
// * Your lipid profile shows elevated total cholesterol (240 mg/dl) and LDL cholesterol (155 mg/dl), indicating increased cardiovascular risk
// * HDL (good cholesterol) is borderline low at 42 mg/dl, reducing your natural protection against heart disease
// * Fasting blood sugar (110 mg/dl) and HbA1c (6.1%) suggest prediabetes, which means you're at risk for developing type 2 diabetes
// * Low B12 levels may contribute to fatigue and neurological symptoms if not addressed

// ## 3️⃣ Dietary Recommendations
// * Reduce saturated fat intake by limiting red meat, full-fat dairy, and processed foods
// * Increase soluble fiber consumption through oats, beans, fruits and vegetables to help lower cholesterol
// * Add plant sterols/stanols through foods like nuts, seeds, and vegetable oils
// * Limit added sugars and refined carbohydrates to help manage blood sugar levels
// * Include B12-rich foods like fish, meat, eggs, and dairy, or consider a supplement

// ## 4️⃣ Exercise Recommendations
// * Aim for at least 150 minutes of moderate-intensity aerobic activity weekly
// * Include resistance training 2-3 times per week to improve insulin sensitivity
// * Consider daily walking after meals to help manage blood sugar levels
// * Start with 10-minute activity sessions if currently sedentary, gradually increasing duration
// * Monitor heart rate during exercise and stay within your target heart rate zone

// ## 5️⃣ Monitoring & Next Steps
// * Schedule a follow-up lipid profile test in 3 months to assess improvement
// * Consider glucose monitoring to track blood sugar patterns
// * Retest HbA1c in 3-6 months to monitor for changes
// * Schedule a consultation with a dietitian for personalized meal planning
// * Consider cardiovascular risk assessment with your physician`
//       }
//     };
//     setReportData(mockData);
//   };

//   const refreshData = () => {
//     setIsRefreshing(true);
//     setTimeout(() => {
//       if (location.state && location.state.reportData) {
//         setReportData(location.state.reportData);
//       } else {
//         fetchMockData();
//       }
//       setIsRefreshing(false);
//     }, 1500);
//   };

//   const toggleReminders = () => {
//     setShowReminders(!showReminders);
//     if (!showReminders && notifications > 0) {
//       setNotifications(0);
//     }
//   };

//   const downloadReport = () => {
//     const reportContent = `
//       Health Report for ${reportData.factors.Name?.value || 'Patient'}
//       Date: ${new Date().toLocaleDateString()}
      
//       === Patient Details ===
//       Name: ${reportData.factors.Name?.value || 'N/A'}
//       Age: ${reportData.factors.Age?.value || 'N/A'}
//       Gender: ${reportData.factors.Gender?.value || 'N/A'}
//       Registration ID: ${reportData.factors.Reg_ID?.value || 'N/A'}
      
//       === Test Results ===
//       ${Object.entries(reportData.factors)
//         .filter(([key]) => !['Name', 'Age', 'Gender', 'Reg_ID', 'Sample_No', 'Order_Date_Time'].includes(key))
//         .map(([key, value]) => `${key}: ${value.value} (${value.classification})`)
//         .join('\n')}
      
//       === Doctor's Summary ===
//       ${reportData.report.report.replace(/## /g, '\n\n=== ').replace(/\* /g, '• ')}
//     `;
    
//     const blob = new Blob([reportContent], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
    
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `HealthReport_${reportData.factors.Name?.value || 'Patient'}_${new Date().toISOString().split('T')[0]}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   if (loading) {
//     return (
//       <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center p-8">
//           <RefreshCw className={`mx-auto h-12 w-12 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'} mb-4 animate-spin`} />
//           <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Loading your health report</h2>
//           <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please wait while we analyze your data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!reportData) {
//     return (
//       <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className="text-center p-8">
//           <AlertCircle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
//           <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>No report data found</h2>
//           <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please upload a health report to view your dashboard</p>
//           <button 
//             className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center mx-auto"
//             onClick={fetchMockData}
//           >
//             <FileText className="h-5 w-5 mr-2" />
//             Load Sample Report
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { factors, report } = reportData;

//   const getStatusIndicator = (classification) => {
//     if (!classification) return null;
    
//     if (classification.includes('Normal')) {
//       return <ArrowUp className="text-emerald-500 h-5 w-5" />;
//     } else if (classification.includes('Borderline')) {
//       return <Minus className="text-amber-500 h-5 w-5" />;
//     } else if (classification.includes('Low') || classification.includes('High')) {
//       return <ArrowDown className="text-rose-500 h-5 w-5" />;
//     }
//     return null;
//   };

//   const validFactors = Object.entries(factors).filter(
//     ([_, value]) => value !== "Not Found" && typeof value === 'object'
//   );
  
//   const categorizedFactors = {
//     bloodCount: ['RBC Count', 'Hemoglobin', 'PCV', 'MCV', 'MCH', 'MCHC'],
//     lipidProfile: ['Total Cholesterol', 'LDL Cholesterol', 'HDL Cholesterol', 'Triglycerides'],
//     bloodSugar: ['Fasting Blood Sugar', 'HbA1c', 'Estimated Avg Glucose (3 Mths)'],
//     other: ['Serum B12 Levels', 'Insulin Levels']
//   };

//   const patientDetails = {
//     name: factors.Name?.value || 'N/A',
//     age: factors.Age?.value || 'N/A',
//     gender: factors.Gender?.value || 'N/A',
//     regId: factors.Reg_ID?.value || 'N/A',
//     sampleNo: factors.Sample_No?.value || 'N/A',
//     orderDate: factors.Order_Date_Time?.value || 'N/A'
//   };

//   const criticalCount = validFactors.filter(([_, value]) => 
//     value.classification && (value.classification.includes('Critical') || value.classification.includes('High') || value.classification.includes('Low'))
//   ).length;
  
//   const normalCount = validFactors.filter(([_, value]) => 
//     value.classification && value.classification.includes('Normal')
//   ).length;

//   const borderlineCount = validFactors.filter(([_, value]) => 
//     value.classification && value.classification.includes('Borderline')
//   ).length;

//   const parseReportContent = () => {
//     const reportText = typeof report === 'object' && report.report 
//       ? report.report
//       : '';
    
//     const sections = reportText.split(/(?=## )/).filter(Boolean);
    
//     const processedSections = {};
    
//     sections.forEach(section => {
//       const titleMatch = section.match(/## (.*?)(?:\n|$)/);
//       if (titleMatch) {
//         const title = titleMatch[1].trim();
//         let sectionId = '';
        
//         if (title.includes('1️⃣')) sectionId = 'summary';
//         else if (title.includes('2️⃣')) sectionId = 'analysis';
//         else if (title.includes('3️⃣')) sectionId = 'diet';
//         else if (title.includes('4️⃣')) sectionId = 'exercise';
//         else if (title.includes('5️⃣')) sectionId = 'monitoring';
        
//         const content = section.replace(/## .*?\n/, '').trim();
        
//         if (sectionId) {
//           processedSections[sectionId] = {
//             title,
//             content,
//             bulletPoints: content.split(/\n\s*[\*\-]\s*/).filter(item => item.trim())
//           };
//         }
//       }
//     });
    
//     return processedSections;
//   };

//   const reportSections = parseReportContent();

//   const toggleSection = (section) => {
//     setExpandedSections({
//       ...expandedSections,
//       [section]: !expandedSections[section]
//     });
//   };

//   const MetricCard = ({ title, value, classification, unit }) => {
//     const isNormal = classification && classification.includes('Normal');
//     const isBorderline = classification && classification.includes('Borderline');
//     const isCritical = !isNormal && !isBorderline;
    
//     return (
//       <div className={`rounded-lg shadow-md p-4 flex flex-col transition-all duration-300 transform hover:translate-y-[-4px] 
//                        ${darkMode ? 
//                          (isNormal ? 'bg-emerald-900/20 border border-emerald-700/40' : 
//                           isBorderline ? 'bg-amber-900/20 border border-amber-700/40' : 
//                           'bg-rose-900/20 border border-rose-700/40') : 
//                          (isNormal ? 'bg-white border-l-4 border-l-emerald-500' : 
//                           isBorderline ? 'bg-white border-l-4 border-l-amber-500' : 
//                           'bg-white border-l-4 border-l-rose-500')}`}>
//         <div className="flex justify-between items-start mb-2">
//           <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{title}</h3>
//           <div className="flex items-center">
//             {getStatusIndicator(classification)}
//           </div>
//         </div>
//         <div className="mt-auto">
//           <div className="flex items-baseline">
//             <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
//             {unit && <span className={`ml-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{unit}</span>}
//           </div>
//           <p className={`text-xs mt-1 ${
//             isNormal ? 'text-emerald-600' :
//             isBorderline ? 'text-amber-600' :
//             'text-rose-600'
//           }`}>
//             {classification || 'N/A'}
//           </p>
//         </div>
//       </div>
//     );
//   };

//   const extractUnit = (title, value) => {
//     const commonUnits = {
//       'Hemoglobin': 'g/dl',
//       'RBC Count': 'mill/cmm',
//       'Total Cholesterol': 'mg/dl',
//       'LDL Cholesterol': 'mg/dl',
//       'HDL Cholesterol': 'mg/dl',
//       'Triglycerides': 'mg/dl',
//       'Fasting Blood Sugar': 'mg/dl',
//       'HbA1c': '%',
//       'PCV': '%',
//       'MCV': 'fl',
//       'MCH': 'pg',
//       'MCHC': 'g/dl',
//       'Serum B12 Levels': 'pg/ml'
//     };
    
//     return commonUnits[title] || '';
//   };

//   const renderSection = (sectionId, icon) => {
//     const section = reportSections[sectionId];
//     if (!section) return null;
    
//     const getSectionIcon = () => {
//       switch (sectionId) {
//         case 'summary':
//           return <FileText className="h-5 w-5 text-indigo-600" />;
//         case 'analysis':
//           return <BarChart2 className="h-5 w-5 text-violet-600" />;
//         case 'diet':
//           return <Apple className="h-5 w-5 text-emerald-600" />;
//         case 'exercise':
//           return <Activity className="h-5 w-5 text-amber-600" />;
//         case 'monitoring':
//           return <Clipboard className="h-5 w-5 text-blue-600" />;
//         default:
//           return icon;
//       }
//     };
    
//     return (
//       <div className={`mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden transition-all duration-300`}>
//         <div 
//           className={`flex justify-between items-center p-4 ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'} cursor-pointer hover:brightness-95 transition-all`}
//           onClick={() => toggleSection(sectionId)}
//         >
//           <div className="flex items-center">
//             {getSectionIcon()}
//             <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-indigo-800'} ml-2`}>{section.title}</h3>
//           </div>
//           {expandedSections[sectionId] ? 
//             <ChevronUp className={`h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300`} /> : 
//             <ChevronDown className={`h-5 w-5 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} transition-transform duration-300`} />
//           }
//         </div>
        
//         {expandedSections[sectionId] && (
//           <div className={`p-5 ${darkMode ? 'border-t border-gray-700' : 'border-t border-indigo-100'}`}>
//             {section.bulletPoints.map((point, idx) => (
//               <div 
//                 key={idx} 
//                 className={`mb-3 ${showAnimations[sectionId] ? 'animate-fadeIn' : 'opacity-0'}`}
//                 style={{ 
//                   animationDelay: `${idx * 100}ms`,
//                   animationFillMode: 'forwards'
//                 }}
//               >
//                 <div className="flex">
//                   <div className="mr-3 mt-1">
//                     {sectionId === 'summary' && <Info className={`h-4 w-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />}
//                     {sectionId === 'analysis' && <Activity className={`h-4 w-4 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />}
//                     {sectionId === 'diet' && <Apple className={`h-4 w-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />}
//                     {sectionId === 'exercise' && <Activity className={`h-4 w-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />}
//                     {sectionId === 'monitoring' && <Bell className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
//                   </div>
//                   <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{point}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const calculateHealthScore = () => {
//     const totalFactors = validFactors.length;
//     if (totalFactors === 0) return 0;
    
//     const normalWeight = 3;
//     const borderlineWeight = 1;
//     const criticalWeight = 0;
    
//     const weightedSum = normalCount * normalWeight + borderlineCount * borderlineWeight;
//     const maxPossibleScore = totalFactors * normalWeight;
    
//     return Math.round((weightedSum / maxPossibleScore) * 100);
//   };
  
//   const healthScore = calculateHealthScore();

//   const Header = () => (
//     <header className={`${darkMode ? 'bg-gradient-to-r from-indigo-900 to-violet-900' : 'bg-gradient-to-r from-indigo-600 to-violet-600'} p-6 text-white sticky top-0 z-10 shadow-lg`}>
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold flex items-center">
//             <Heart className="mr-2 h-8 w-8" /> 
//             Health Dashboard
//           </h1>
//           <p className="mt-2 opacity-90">Comprehensive analysis of your health report</p>
//         </div>
//         <div className="flex space-x-3">
//           <div className="relative">
//             <button 
//               onClick={toggleReminders} 
//               className="p-2 rounded-full hover:bg-white/20 transition-colors relative"
//               aria-label="View reminders"
//             >
//               <Bell className="h-6 w-6" />
//               {notifications > 0 && (
//                 <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
//                   {notifications}
//                 </span>
//               )}
//             </button>
            
//             {showReminders && (
//               <div className={`absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}>
//                 <div className={`p-4 ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-50'}`}>
//                   <div className="flex justify-between items-center">
//                     <h3 className={`font-bold ${darkMode ? 'text-indigo-200' : 'text-indigo-800'}`}>Today's Reminders</h3>
//                     <button 
//                       onClick={toggleReminders}
//                       className={`p-1 rounded-full ${darkMode ? 'hover:bg-indigo-800' : 'hover:bg-indigo-100'}`}
//                     >
//                       <X className={`h-4 w-4 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
//                     </button>
//                   </div>
//                   <p className={`text-sm mt-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
//                     {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
//                   </p>
//                 </div>
                
//                 <div className="divide-y divide-gray-200">
//                   {Object.entries(todaysReminders).map(([time, reminder]) => (
//                     <div 
//                       key={time} 
//                       className={`p-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
//                     >
//                       <div className="flex items-start">
//                         <div className={`flex-shrink-0 h-5 w-5 mr-3 ${
//                           time === 'alert' ? 'text-rose-500' : 
//                           time === 'morning' ? 'text-amber-500' : 
//                           time === 'afternoon' ? 'text-blue-500' : 
//                           'text-indigo-500'
//                         }`}>
//                           {time === 'alert' ? <AlertCircle className="h-5 w-5" /> : 
//                            time === 'morning' ? <Sun className="h-5 w-5" /> : 
//                            time === 'afternoon' ? <Activity className="h-5 w-5" /> : 
//                            <Moon className="h-5 w-5" />}
//                         </div>
//                         <div>
//                           <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//                             {time === 'alert' ? 'Important Alert' : 
//                              time === 'morning' ? 'Morning Reminder' : 
//                              time === 'afternoon' ? 'Afternoon Reminder' : 
//                              'Evening Reminder'}
//                           </p>
//                           <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{reminder}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className={`p-3 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//                   <button 
//                     className={`text-xs font-medium ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'}`}
//                   >
//                     View all reminders
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <button 
//             onClick={() => setDarkMode(!darkMode)} 
//             className="p-2 rounded-full hover:bg-white/20 transition-colors"
//             aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
//           >
//             {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
//           </button>
//           <button 
//             onClick={refreshData} 
//             className="p-2 rounded-full hover:bg-white/20 transition-colors"
//             disabled={isRefreshing}
//             aria-label="Refresh data"
//           >
//             <RefreshCw className={`h-6 w-6 ${isRefreshing ? 'animate-spin' : ''}`} />
//           </button>
//           <button 
//             onClick={downloadReport}
//             className="p-2 rounded-full hover:bg-white/20 transition-colors"
//             aria-label="Download report"
//           >
//             <Download className="h-6 w-6" />
//           </button>
//           <button 
//             className="p-2 rounded-full hover:bg-white/20 transition-colors"
//             aria-label="Print report"
//           >
//             <Printer className="h-6 w-6" />
//           </button>
//         </div>
//       </div>
//     </header>
//   );

//   const Footer = () => (
//     <footer className={`${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'} py-6`}>
//       <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
//         <div className="flex items-center mb-4 md:mb-0">
//           <Heart className={`h-6 w-6 mr-2 text-indigo-500`} />
//           <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Health Dashboard</span>
//         </div>
//         <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//           Report generated on: {new Date().toLocaleDateString()}
//         </div>
//         <div className="flex space-x-4 mt-4 md:mt-0">
//           <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
//             <Award className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//           </button>
//           <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
//             <Info className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//           </button>
//           <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
//             <Flag className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
//           </button>
//         </div>
//       </div>
//     </footer>
//   );

//   const OverviewPage = () => {
//     const getRiskAssessment = () => {
//       const riskFactors = {
//         cardiovascular: {
//           risk: criticalCount > 0 ? 'Moderate' : 'Low',
//           detail: 'Based on cholesterol levels and blood pressure'
//         },
//         diabetes: {
//           risk: borderlineCount > 2 ? 'Moderate' : 'Low',
//           detail: 'Based on blood sugar levels and HbA1c'
//         },
//         deficiency: {
//           risk: validFactors.some(([key, value]) => key === 'Serum B12 Levels' && value.classification.includes('Low')) ? 'Moderate' : 'Low',
//           detail: 'Based on vitamin and mineral levels'
//         }
//       };
      
//       return riskFactors;
//     };
    
//     const riskAssessment = getRiskAssessment();

//     return (
//       <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
//         <Header />
        
//         <div className={`sticky top-[88px] z-10 shadow-sm ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
//           <div className="max-w-7xl mx-auto px-4">
//             <div className="flex space-x-1">
//               <button 
//                 className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
//                   activePage === 'overview' 
//                     ? `border-indigo-500 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}` 
//                     : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
//                 }`}
//                 onClick={() => setActivePage('overview')}
//               >
//                 <Layout className="h-4 w-4 inline mr-2" />
//                 Overview
//               </button>
//               <button 
//                 className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
//                   activePage === 'details' 
//                     ? `border-indigo-500 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}` 
//                     : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
//                 }`}
//                 onClick={() => setActivePage('details')}
//               >
//                 <List className="h-4 w-4 inline mr-2" />
//                 Detailed Report
//               </button>
//             </div>
//           </div>
//         </div>

//         <main className="max-w-7xl mx-auto px-4 py-8">
//           <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8 transition-all transform hover:shadow-lg`}>
//             <div className="flex flex-col md:flex-row items-start md:items-center">
//               <div className={`${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'} p-3 rounded-full mr-4 mb-4 md:mb-0`}>
//                 <User className={`h-10 w-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`} />
//               </div>
//               <div className="flex-grow">
//                 <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{patientDetails.name}</h2>
//                 <div className="flex flex-wrap gap-4 text-sm mt-2">
//                   <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     <Info className="h-4 w-4 mr-1" />
//                     <span>Age: {patientDetails.age}</span>
//                   </div>
//                   <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     <Info className="h-4 w-4 mr-1" />
//                     <span>Gender: {patientDetails.gender}</span>
//                   </div>
//                   <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     <Calendar className="h-4 w-4 mr-1" />
//                     <span>Order Date: {patientDetails.name}</span>
//                   </div>
//                   <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     <Clipboard className="h-4 w-4 mr-1" />
//                     <span>Reg ID: {patientDetails.regId}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-4 md:mt-0">
//                 <button 
//                   className={`px-4 py-2 rounded-lg flex items-center ${darkMode ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white transition-colors`}
//                   onClick={() => navigate('/upload')}
//                 >
//                   <ArrowRight className="h-4 w-4 mr-2" />
//                   New Report
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 transition-all transform hover:shadow-lg`}>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Health Score</h3>
//                 <TrendingUp className={`h-6 w-6 ${healthScore > 70 ? 'text-emerald-500' : healthScore > 40 ? 'text-amber-500' : 'text-rose-500'}`} />
//               </div>
//               <div className="flex items-center justify-center mb-4">
//                 <div className="relative w-40 h-40">
//                   <svg className="w-full h-full" viewBox="0 0 100 100">
//                     <circle
//                       className="text-gray-200"
//                       strokeWidth="8"
//                       stroke="currentColor"
//                       fill="transparent"
//                       r="40"
//                       cx="50"
//                       cy="50"
//                     />
//                     <circle
//                       className={`${healthScore > 70 ? 'text-emerald-500' : healthScore > 40 ? 'text-amber-500' : 'text-rose-500'}`}
//                       strokeWidth="8"
//                       strokeDasharray={`${healthScore * 2.51}, 251`}
//                       strokeLinecap="round"
//                       stroke="currentColor"
//                       fill="transparent"
//                       r="40"
//                       cx="50"
//                       cy="50"
//                     />
//                   </svg>
//                   <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${
//                     healthScore > 70 ? 'text-emerald-500' : 
//                     healthScore > 40 ? 'text-amber-500' : 'text-rose-500'
//                   }`}>
//                     {healthScore}
//                   </div>
//                 </div>
//               </div>
//               <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                 {healthScore > 70 ? 'Good overall health' : 
//                  healthScore > 40 ? 'Moderate health concerns' : 
//                  'Significant health concerns'}
//               </p>
//             </div>

//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 transition-all transform hover:shadow-lg`}>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Critical Values</h3>
//                 <AlertCircle className="h-6 w-6 text-rose-500" />
//               </div>
//               <div className="flex items-center justify-center mb-4">
//                 <div className="text-5xl font-bold text-rose-500">{criticalCount}</div>
//               </div>
//               <p className={`text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                 {criticalCount === 0 ? 'No critical values found' : 
//                  criticalCount === 1 ? '1 critical value needs attention' : 
//                  `${criticalCount} critical values need attention`}
//               </p>
//             </div>

//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 transition-all transform hover:shadow-lg`}>
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Risk Assessment</h3>
//                 <Shield className="h-6 w-6 text-indigo-500" />
//               </div>
//               <div className="space-y-4">
//                 {Object.entries(riskAssessment).map(([riskType, assessment]) => (
//                   <div key={riskType} className="flex items-center justify-between">
//                     <span className={`capitalize ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                       {riskType.replace(/([A-Z])/g, ' $1')}
//                     </span>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       assessment.risk === 'High' ? 'bg-rose-100 text-rose-800' :
//                       assessment.risk === 'Moderate' ? 'bg-amber-100 text-amber-800' :
//                       'bg-emerald-100 text-emerald-800'
//                     }`}>
//                       {assessment.risk}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="mb-8">
//             <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Key Health Metrics</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {Object.entries(categorizedFactors).map(([category, factorNames]) => (
//                 <div key={category} className="space-y-4">
//                   <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//                     {category === 'bloodCount' && 'Blood Count'}
//                     {category === 'lipidProfile' && 'Lipid Profile'}
//                     {category === 'bloodSugar' && 'Blood Sugar'}
//                     {category === 'other' && 'Other Metrics'}
//                   </h3>
//                   {factorNames.map(factorName => {
//                     const factor = factors[factorName];
//                     if (!factor) return null;
//                     return (
//                       <MetricCard 
//                         key={factorName}
//                         title={factorName}
//                         value={factor.value}
//                         classification={factor.classification}
//                         unit={extractUnit(factorName, factor.value)}
//                       />
//                     );
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </main>

//         <Footer />
//       </div>
//     );
//   };

//   const DetailsPage = () => {
//     const getReferenceRange = (testName) => {
//       const ranges = {
//         'RBC Count': '4.5-5.5 mill/cmm',
//         'Hemoglobin': '13.5-17.5 g/dl',
//         'PCV': '40-50%',
//         'MCV': '80-100 fl',
//         'MCH': '27-32 pg',
//         'MCHC': '32-36 g/dl',
//         'Total Cholesterol': '<200 mg/dl (desirable)',
//         'LDL Cholesterol': '<100 mg/dl (optimal)',
//         'HDL Cholesterol': '>60 mg/dl (desirable)',
//         'Triglycerides': '<150 mg/dl (normal)',
//         'Fasting Blood Sugar': '70-99 mg/dl (normal)',
//         'HbA1c': '<5.7% (normal)',
//         'Serum B12 Levels': '200-900 pg/ml',
//         'Insulin Levels': '2.6-24.9 μIU/ml'
//       };
      
//       return ranges[testName] || 'N/A';
//     };

//     return (
//       <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
//         <Header />
        
//         <div className={`sticky top-[88px] z-10 shadow-sm ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
//           <div className="max-w-7xl mx-auto px-4">
//             <div className="flex space-x-1">
//               <button 
//                 className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
//                   activePage === 'overview' 
//                     ? `border-indigo-500 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}` 
//                     : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
//                 }`}
//                 onClick={() => setActivePage('overview')}
//               >
//                 <Layout className="h-4 w-4 inline mr-2" />
//                 Overview
//               </button>
//               <button 
//                 className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
//                   activePage === 'details' 
//                     ? `border-indigo-500 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}` 
//                     : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
//                 }`}
//                 onClick={() => setActivePage('details')}
//               >
//                 <List className="h-4 w-4 inline mr-2" />
//                 Detailed Report
//               </button>
//             </div>
//           </div>
//         </div>

//         <main className="max-w-7xl mx-auto px-4 py-8">
//           <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden mb-8`}>
//             <div className={`p-6 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
//               <h2 className={`text-xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
//                 <FileText className="h-5 w-5 mr-2 text-indigo-600" />
//                 Complete Lab Results
//               </h2>
//               <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                 Detailed breakdown of all measured health parameters
//               </p>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//                   <tr>
//                     <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Test</th>
//                     <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Value</th>
//                     <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Reference Range</th>
//                     <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
//                   {validFactors.map(([key, value]) => (
//                     <tr key={key} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
//                       <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>{key}</td>
//                       <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                         {value.value} {extractUnit(key, value.value)}
//                       </td>
//                       <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//                         {getReferenceRange(key)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           value.classification.includes('Normal') ? 'bg-emerald-100 text-emerald-800' :
//                           value.classification.includes('Borderline') ? 'bg-amber-100 text-amber-800' :
//                           'bg-rose-100 text-rose-800'
//                         }`}>
//                           {value.classification}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="space-y-6">
//             <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Comprehensive Analysis</h2>
//             {renderSection('summary')}
//             {renderSection('analysis')}
//             {renderSection('diet')}
//             {renderSection('exercise')}
//             {renderSection('monitoring')}
//           </div>
//         </main>

//         <Footer />
//       </div>
//     );
//   };

//   return activePage === 'overview' ? <OverviewPage /> : <DetailsPage />;
// };

// export default HealthDashboard;


// import React, { useState, useEffect, useMemo } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
//   Legend, LineChart, Line, Area, AreaChart
// } from 'recharts';
// import { 
//   FileDown, TrendingUp, AlertOctagon, CheckCircle2, RefreshCw, 
//   Download, Heart, Activity, PieChart as PieChartIcon, 
//   BarChart as BarChartIcon, FileText, Star, Clock, Calendar,
//   AlertTriangle, ArrowUpCircle, ArrowDownCircle, Zap,
//   Clipboard, Award, Bookmark, User, Share2, Printer,
//   Menu, X, Home, Settings, HelpCircle, Upload, ChevronRight,
//   List, Coffee, Dumbbell, Apple, Pill, MessageCircle, Gift
// } from 'lucide-react';

// const SECTIONS = {
//   summary: { title: "Health Summary", icon: <FileText size={18} /> },
//   vitals: { title: "Key Vitals", icon: <Heart size={18} /> },
//   analysis: { title: "Analysis", icon: <Activity size={18} /> },
//   diet: { title: "Diet Plan", icon: <Apple size={18} /> },
//   exercise: { title: "Exercise Plan", icon: <Dumbbell size={18} /> },
//   monitoring: { title: "Monitoring", icon: <Clipboard size={18} /> },
//   message: { title: "Personal Message", icon: <MessageCircle size={18} /> }
// };

// const HealthDashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const receivedData = location.state?.reportData || {};
 
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeSection, setActiveSection] = useState('summary');
//   const [factorsData, setFactorsData] = useState([]);
//   const [showInsight, setShowInsight] = useState(false);
//   const [animateChart, setAnimateChart] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [showGift, setShowGift] = useState(false);
  
//   // Parse the health report from content
//   const healthReport = useMemo(() => {
//     const report = {};
    
//     // Check if we have report data in receivedData.report
//     if (receivedData.rawText || receivedData.summary) {
//       report.summary = receivedData.summary || receivedData.rawText || "";
//       return report;
//     }
    
//     // If we have document content from a file upload
//     else if (location.state?.documentContent) {
//       const content = location.state.documentContent;
      
//       // Extract sections based on headings
//       report.summary = extractSection(content, "Health Summary", "Red Flags & Concerns");
//       report.redFlags = extractSection(content, "Red Flags & Concerns", "Simulated Doctor Advice");
//       report.doctorAdvice = extractSection(content, "Simulated Doctor Advice", "7-Day Diet Plan");
//       report.dietPlan = extractSection(content, "7-Day Diet Plan", "7-Day Exercise Plan");
//       report.exercisePlan = extractSection(content, "7-Day Exercise Plan", "Lifestyle Tips");
//       report.lifestyleTips = extractSection(content, "Lifestyle Tips", "Supplements & Food Suggestions");
//       report.supplements = extractSection(content, "Supplements & Food Suggestions", "Health Product Suggestions");
//       report.products = extractSection(content, "Health Product Suggestions", "Reminders & Follow-ups");
//       report.reminders = extractSection(content, "Reminders & Follow-ups", "Motivational Note");
//       report.message = extractSection(content, "Motivational Note", "");
      
//       // Extract tables as separate data
//       report.concernsTable = extractTable(content, "Areas of Concern");
      
//       // Extract good news items
//       report.goodNews = extractBulletPoints(content, "Good News!");
//     }
    
//     return report;
//   }, [receivedData, location.state]);
  
//   function extractSection(content, startHeading, endHeading) {
//     if (!content) return "";
    
//     const startRegex = new RegExp(`#\\s*\\*\\*${startHeading}.*?\\*\\*`, 'i');
//     const startMatch = content.match(startRegex);
    
//     if (!startMatch) return "";
    
//     const startIndex = startMatch.index + startMatch[0].length;
    
//     let endIndex;
//     if (endHeading) {
//       const endRegex = new RegExp(`#\\s*\\*\\*${endHeading}.*?\\*\\*`, 'i');
//       const endMatch = content.match(endRegex);
//       endIndex = endMatch ? endMatch.index : content.length;
//     } else {
//       endIndex = content.length;
//     }
    
//     return content.substring(startIndex, endIndex).trim();
//   }
  
//   function extractTable(content, tableName) {
//     if (!content) return [];
    
//     const tableStartRegex = new RegExp(`#\\s*\\*\\*${tableName}.*?\\|`, 'i');
//     const tableStartMatch = content.match(tableStartRegex);
    
//     if (!tableStartMatch) return [];
    
//     // Find the table header starting from the match
//     const startIndex = tableStartMatch.index;
//     const tableSection = content.substring(startIndex);
    
//     // Extract header and rows
//     const tableLines = tableSection.split('\n').filter(line => line.includes('|'));
    
//     if (tableLines.length < 3) return []; // Need at least header, separator, and one row
    
//     const headerRow = tableLines[0];
//     const headers = headerRow.split('|')
//       .map(h => h.trim())
//       .filter(h => h !== '');
    
//     const rows = tableLines.slice(2) // Skip header and separator rows
//       .filter(line => line.includes('|') && !line.includes('---'))
//       .map(line => {
//         const cells = line.split('|')
//           .map(cell => cell.trim())
//           .filter((cell, i) => i > 0 && i <= headers.length);
        
//         return headers.reduce((obj, header, i) => {
//           obj[header] = cells[i] || '';
//           return obj;
//         }, {});
//       });
    
//     return rows;
//   }
  
//   function extractBulletPoints(content, sectionName) {
//     if (!content) return [];
    
//     const sectionRegex = new RegExp(`#\\s*\\*\\*${sectionName}.*?\\*\\*`, 'i');
//     const sectionMatch = content.match(sectionRegex);
    
//     if (!sectionMatch) return [];
    
//     const startIndex = sectionMatch.index + sectionMatch[0].length;
    
//     // Find the next section heading or end of text
//     const nextSectionRegex = /#\s*\*\*/;
//     const restOfContent = content.substring(startIndex);
//     const nextSectionMatch = restOfContent.match(nextSectionRegex);
    
//     const endIndex = nextSectionMatch 
//       ? startIndex + nextSectionMatch.index 
//       : content.length;
    
//     const sectionContent = content.substring(startIndex, endIndex);
    
//     // Extract bullet points
//     return sectionContent
//       .split('\n')
//       .filter(line => line.trim().startsWith('#'))
//       .map(line => line.replace(/^#\s*\*(.+?)\*/, '$1').trim());
//   }

//   useEffect(() => {
//     // Parse factors data
//     const parseFactors = () => {
//       if (receivedData.rawText && !receivedData.factors) {
//         const transformedData = Object.entries(receivedData.factors)
//           .filter(([key, value]) => 
//             value !== "Not Found" && 
//             typeof value === 'object' && 
//             !['Name', 'Reg_ID', 'Age', 'Gender', 'Sample_No', 'Referred_By', 'Order_Date_Time'].includes(key)
//           )
//           .map(([key, data]) => ({
//             name: key,
//             value: parseFloat(data.value) || 0,
//             classification: data.classification || 'Unknown'
//           }));
        
//         setFactorsData(transformedData);
//       } else if (healthReport.concernsTable && healthReport.concernsTable.length > 0) {
//         // Extract factors from concerns table
//         const transformedData = healthReport.concernsTable.map(row => ({
//           name: row.Test || "",
//           value: row.Value || "0",
//           classification: row.Status || "Unknown",
//           normalRange: row["Normal Range"] || "",
//           meaning: row.Meaning || ""
//         }));
        
//         setFactorsData(transformedData);
//       }
//     };
    
//     // Simulate loading effect
//     const timer = setTimeout(() => {
//       parseFactors();
//       setIsLoading(false);
        
//       // Trigger chart animation after a delay
//       setTimeout(() => {
//         setAnimateChart(true);
//       }, 500);
        
//       // Show insight popover with delay
//       setTimeout(() => {
//         setShowInsight(true);
//       }, 2000);
      
//       // Show gift message
//       setTimeout(() => {
//         setShowGift(true);
//       }, 3000);
//     }, 1200);

//     return () => clearTimeout(timer);
//   }, [receivedData, healthReport]);

//   // Enhanced color palette with health-focused colors
//   const COLOR_PALETTE = {
//     primary: '#3B82F6',      // Vibrant Blue
//     secondary: '#10B981',    // Emerald Green
//     accent: '#8B5CF6',       // Purple (more medical feel)
//     warning: '#F43F5E',      // Rose Red
//     neutral: '#6B7280',      // Cool Gray
//     highlight: '#22D3EE',    // Cyan
//     lightPrimary: '#EFF6FF', // Light Blue
//     lightWarning: '#FEF2F2', // Light Red
//     lightSuccess: '#ECFDF5', // Light Green
//     gold: '#F59E0B',         // Amber (for awards/achievements)
//     teal: '#14B8A6'          // Teal (for secondary highlights)
//   };

//   // Enhanced classification system with more detailed feedback
//   const getClassificationDetails = (classification = '', value) => {
//     if (classification?.includes('Normal')) return {
//       color: COLOR_PALETTE.secondary,
//       bgColor: COLOR_PALETTE.lightSuccess,
//       icon: <CheckCircle2 className="inline-block mr-1" size={16} />,
//       description: 'Optimal Health Range',
//       suggestion: 'Maintain current health habits'
//     };
//     if (classification?.includes('Critical')) return {
//       color: COLOR_PALETTE.warning,
//       bgColor: COLOR_PALETTE.lightWarning,
//       icon: <AlertOctagon className="inline-block mr-1" size={16} />,
//       description: 'Immediate Attention Required',
//       suggestion: 'Consult with healthcare provider'
//     };
//     if (classification?.includes('High')) return {
//       color: COLOR_PALETTE.accent,
//       bgColor: '#F5F3FF',
//       icon: <ArrowUpCircle className="inline-block mr-1" size={16} />,
//       description: 'Above Recommended Range',
//       suggestion: 'Consider lifestyle adjustments'
//     };
//     if (classification?.includes('Low')) return {
//       color: COLOR_PALETTE.gold,
//       bgColor: '#FEF3C7',
//       icon: <ArrowDownCircle className="inline-block mr-1" size={16} />,
//       description: 'Below Recommended Range',
//       suggestion: 'Consider dietary supplements'
//     };
//     return {
//       color: COLOR_PALETTE.neutral,
//       bgColor: '#F3F4F6',
//       icon: <AlertTriangle className="inline-block mr-1" size={16} />,
//       description: 'Needs Evaluation',
//       suggestion: 'Follow up with physician'
//     };
//   };

//   // Enhanced download function with animation and options
//   const downloadReport = (format = 'txt') => {
//     let reportContent = '';
//     let mimeType = 'text/plain';
//     let fileExtension = 'txt';
    
//     const patientName = receivedData.factors?.Name?.value || 'Patient';
    
//     if (format === 'txt') {
//       reportContent = `
//       HEALTH REPORT
      
//       PATIENT: ${patientName}
//       AGE: ${receivedData.factors?.Age?.value || 'N/A'}
//       GENDER: ${receivedData.factors?.Gender?.value || 'N/A'}
//       REG ID: ${receivedData.factors?.Reg_ID?.value || 'N/A'}
//       DATE: ${new Date().toLocaleDateString()}
      
//       MEDICAL FACTORS:
//       ${factorsData.map(factor => 
//         `${factor.name}: ${factor.value} - ${factor.classification}`
//       ).join('\n')}
      
//       HEALTH ASSESSMENT:
//       ${healthReport.summary || 'No assessment available.'}
      
//       RED FLAGS:
//       ${healthReport.redFlags || 'None identified.'}
      
//       DOCTOR ADVICE:
//       ${healthReport.doctorAdvice || 'No specific advice provided.'}
      
//       DIET PLAN:
//       ${healthReport.dietPlan || 'No diet plan provided.'}
      
//       EXERCISE PLAN:
//       ${healthReport.exercisePlan || 'No exercise plan provided.'}
      
//       LIFESTYLE TIPS:
//       ${healthReport.lifestyleTips || 'No lifestyle tips provided.'}
      
//       SUPPLEMENTS:
//       ${healthReport.supplements || 'No supplement recommendations provided.'}
      
//       REMINDERS:
//       ${healthReport.reminders || 'No reminders provided.'}
      
//       PERSONAL MESSAGE:
//       ${healthReport.message || 'No personal message provided.'}
//       `;
//     } else if (format === 'json') {
//       reportContent = JSON.stringify({
//         patient: {
//           name: patientName,
//           age: receivedData.factors?.Age?.value || 'N/A',
//           gender: receivedData.factors?.Gender?.value || 'N/A',
//           regId: receivedData.factors?.Reg_ID?.value || 'N/A'
//         },
//         date: new Date().toISOString(),
//         factors: factorsData,
//         report: {
//           summary: healthReport.summary || 'No summary available.',
//           redFlags: healthReport.redFlags || 'None identified.',
//           doctorAdvice: healthReport.doctorAdvice || 'No specific advice provided.',
//           dietPlan: healthReport.dietPlan || 'No diet plan provided.',
//           exercisePlan: healthReport.exercisePlan || 'No exercise plan provided.',
//           lifestyleTips: healthReport.lifestyleTips || 'No lifestyle tips provided.',
//           supplements: healthReport.supplements || 'No supplement recommendations provided.',
//           reminders: healthReport.reminders || 'No reminders provided.',
//           message: healthReport.message || 'No personal message provided.'
//         }
//       }, null, 2);
//       mimeType = 'application/json';
//       fileExtension = 'json';
//     } else if (format === 'pdf') {
//       // In a real app, you would generate PDF here
//       alert("PDF generation would require a PDF library like jsPDF or a backend service.");
//       return;
//     }
    
//     const blob = new Blob([reportContent], { type: mimeType });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `health_report_${patientName.replace(/\s+/g, '_')}.${fileExtension}`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
//   };

//   // Compute enhanced dashboard statistics
//   const dashboardStats = useMemo(() => {
//     const totalFactors = factorsData.length || 1; // Prevent division by zero
//     const normalFactors = factorsData.filter(f => f.classification?.includes('Normal')).length;
//     const criticalFactors = factorsData.filter(f => f.classification?.includes('Critical')).length;
//     const highFactors = factorsData.filter(f => f.classification?.includes('High')).length;
//     const lowFactors = factorsData.filter(f => f.classification?.includes('Low')).length;

//     // Calculate an overall health score (0-100)
//     const healthScore = Math.round((normalFactors / totalFactors) * 100);
    
//     // Determine health status based on score
//     let healthStatus = 'Excellent';
//     if (healthScore < 60) healthStatus = 'Needs Attention';
//     else if (healthScore < 80) healthStatus = 'Good';
    
//     return {
//       totalFactors,
//       normalPercentage: (normalFactors / totalFactors * 100).toFixed(1),
//       criticalPercentage: (criticalFactors / totalFactors * 100).toFixed(1),
//       highPercentage: (highFactors / totalFactors * 100).toFixed(1),
//       lowPercentage: (lowFactors / totalFactors * 100).toFixed(1),
//       healthScore,
//       healthStatus
//     };
//   }, [factorsData]);

//   // Prepare enhanced data for charts
//   const radarData = useMemo(() => {
//     return factorsData.slice(0, 8).map(factor => {
//       // Normalize values for radar chart (0-100 scale)
//       let normalizedValue = factor.value;
//       // This is a simplified normalization - you would adjust based on your actual data ranges
//       if (factor.value > 100) normalizedValue = 100;
//       if (factor.value < 0) normalizedValue = 0;
      
//       return {
//         subject: factor.name,
//         value: normalizedValue,
//         fullMark: 100
//       };
//     });
//   }, [factorsData]);
  
//   // Prepare data for distribution chart
//   const distributionData = useMemo(() => {
//     return [
//       { name: 'Normal', value: parseFloat(dashboardStats.normalPercentage), color: COLOR_PALETTE.secondary },
//       { name: 'Critical', value: parseFloat(dashboardStats.criticalPercentage), color: COLOR_PALETTE.warning },
//       { name: 'High', value: parseFloat(dashboardStats.highPercentage), color: COLOR_PALETTE.accent },
//       { name: 'Low', value: parseFloat(dashboardStats.lowPercentage), color: COLOR_PALETTE.gold }
//     ].filter(item => item.value > 0);
//   }, [dashboardStats, COLOR_PALETTE]);

//   // Mock trend data
//   const trendData = useMemo(() => {
//     // Create sample trend data for demonstration
//     return [
//       { month: 'Jan', value: 65 },
//       { month: 'Feb', value: 70 },
//       { month: 'Mar', value: 68 },
//       { month: 'Apr', value: 75 },
//       { month: 'May', value: 72 },
//       { month: 'Jun', value: dashboardStats.healthScore }
//     ];
//   }, [dashboardStats.healthScore]);
  
//   // Handle file upload
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     setUploading(true);
    
//     // Simulate file processing
//     setTimeout(() => {
//       // In a real app, you would send the file to your backend
//       alert(`File "${file.name}" would be uploaded and processed in a real application.`);
//       setUploading(false);
//     }, 1500);
//   };

//   // Loading State with enhanced animation
//   if (isLoading) {
//     return (
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
//       >
//         <motion.div 
//           animate={{ 
//             scale: [1, 1.2, 1],
//             rotate: 360
//           }}
//           transition={{ 
//             repeat: Infinity, 
//             duration: 1.5, 
//             ease: "easeInOut"
//           }}
//           className="relative"
//         >
//           <Heart size={64} className="text-red-500" />
//           <motion.div
//             animate={{ 
//               opacity: [0.7, 1, 0.7],
//               scale: [1, 1.1, 1]
//             }}
//             transition={{ 
//               repeat: Infinity, 
//               duration: 1, 
//               ease: "easeInOut" 
//             }}
//             className="absolute inset-0 flex items-center justify-center"
//           >
//             <Activity size={32} className="text-blue-500" />
//           </motion.div>
//         </motion.div>
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//           className="mt-4 text-xl font-medium text-blue-800"
//         >
//           Analyzing your health data...
//         </motion.p>
//         <motion.div
//           initial={{ width: 0 }}
//           animate={{ width: "300px" }}
//           transition={{ duration: 2, ease: "easeInOut" }}
//           className="h-2 bg-blue-500 rounded-full mt-4 max-w-xs"
//         />
//       </motion.div>
//     );
//   }

//   const patientName = receivedData.factors?.Name?.value || 
//                       (healthReport.summary && healthReport.summary.match(/Hello\s+([A-Za-z]+),/)?.[1]) || 
//                       'Patient';

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <motion.div 
//         initial={{ x: sidebarOpen ? 0 : -280 }}
//         animate={{ x: sidebarOpen ? 0 : -280 }}
//         transition={{ duration: 0.3 }}
//         className="bg-white w-64 shadow-lg fixed h-full z-20"
//       >
//         <div className="p-5 border-b">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <Heart className="text-red-500 mr-2" size={24} />
//               <span className="font-bold text-xl">MediDash</span>
//             </div>
//             <button 
//               onClick={() => setSidebarOpen(false)}
//               className="lg:hidden text-gray-500 hover:text-gray-700"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>
        
//         <div className="p-4">
//           <div className="flex items-center mb-6">
//             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
//               <User className="text-blue-600" size={20} />
//             </div>
//             <div>
//               <div className="font-medium">{patientName}</div>
//               <div className="text-xs text-gray-500">
//                 ID: {receivedData.factors?.Reg_ID?.value || 'N/A'}
//               </div>
//             </div>
//           </div>
          
//           <nav className="space-y-1">
//             {Object.entries(SECTIONS).map(([key, section]) => (
//               <button
//                 key={key}
//                 onClick={() => setActiveSection(key)}
//                 className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
//                   activeSection === key
//                     ? 'bg-blue-50 text-blue-700 font-medium'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <span className={`mr-3 ${activeSection === key ? 'text-blue-500' : 'text-gray-500'}`}>
//                   {section.icon}
//                 </span>
//                 {section.title}
//                 {activeSection === key && (
//                   <ChevronRight size={16} className="ml-auto text-blue-500" />
//                 )}
//               </button>
//             ))}
//           </nav>
          
//           <div className="mt-6 pt-6 border-t">
//             <label className="flex items-center px-3 py-2 rounded-lg bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors">
//               <Upload size={18} className="mr-3 text-blue-500" />
//               <span className="text-sm font-medium">Upload Report</span>
//               <input 
//                 type="file" 
//                 className="hidden" 
//                 onChange={handleFileUpload}
//                 accept=".pdf,.txt,.json"
//               />
//             </label>
            
//             <button
//               onClick={() => downloadReport('pdf')}
//               className="flex items-center w-full px-3 py-2 mt-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//             >
//               <Download size={18} className="mr-3 text-gray-500" />
//               Download Full Report
//             </button>
//           </div>
//         </div>
        
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
//           <div className="flex space-x-2">
//             <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
//               <Settings size={18} />
//             </button>
//             <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
//               <HelpCircle size={18} />
//             </button>
//             <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
//               <Share2 size={18} />
//             </button>
//           </div>
//         </div>
//       </motion.div>
      
//       {/* Main Content */}
//       <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
//         {/* Top Navigation */}
//         <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               {!sidebarOpen && (
//                 <button 
//                   onClick={() => setSidebarOpen(true)}
//                   className="mr-4 text-gray-500 hover:text-gray-700"
//                 >
//                   <Menu size={24} />
//                 </button>
//               )}
//               <h1 className="text-xl font-semibold text-gray-800">
//                 {SECTIONS[activeSection]?.title || 'Dashboard'}
//               </h1>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-gray-500">
//                 {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
//               </span>
//               <div className="flex space-x-2">
//                 <button 
//                   onClick={() => navigate(-1)}
//                   className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
//                 >
//                   <RefreshCw size={18} />
//                 </button>
//                 <button 
//                   onClick={() => window.print()}
//                   className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
//                 >
//                   <Printer size={18} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </header>
        
//         {/* Page Content */}
//         <main className="p-6">
//           <AnimatePresence mode="wait">
//             {/* Summary Section */}
//             {activeSection === 'summary' && (
//               <DashboardSummary 
//                 healthReport={healthReport}
//                 factorsData={factorsData}
//                 dashboardStats={dashboardStats}
//                 distributionData={distributionData}
//                 trendData={trendData}
//                 patientName={patientName}
//                 COLOR_PALETTE={COLOR_PALETTE}
//                 animateChart={animateChart}
//                 getClassificationDetails={getClassificationDetails}
//                 setShowGift={setShowGift}
//               />
//             )}
            
//             {/* Vitals Section */}
//             {activeSection === 'vitals' && (
//               <VitalsSection 
//                 factorsData={factorsData}
//                 radarData={radarData}
//                 COLOR_PALETTE={COLOR_PALETTE}
//                 animateChart={animateChart}
//                 getClassificationDetails={getClassificationDetails}
//                 healthReport={healthReport}
//               />
//             )}
            
//             {/* Analysis Section */}
//             {activeSection === 'analysis' && (
//               <AnalysisSection 
//                 healthReport={healthReport}
//                 factorsData={factorsData}
//                 getClassificationDetails={getClassificationDetails}
//               />
//             )}
            
//             {/* Diet Plan Section */}
//             {activeSection === 'diet' && (
//               <DietSection 
//                 healthReport={healthReport}
//               />
//             )}
            
//             {/* Exercise Plan Section */}
//             {activeSection === 'exercise' && (
//               <ExerciseSection 
//                 healthReport={healthReport}
//               />
//             )}
            
//             {/* Monitoring Section */}
//             {activeSection === 'monitoring' && (
//               <MonitoringSection 
//                 healthReport={healthReport}
//               />
//             )}
            
//             {/* Personal Message Section */}
//             {activeSection === 'message' && (
//               <MessageSection 
//                 healthReport={healthReport}
//                 patientName={patientName}
//               />
//             )}
//           </AnimatePresence>
//         </main>
        
//         {/* Footer */}
//         <footer className="bg-white p-4 border-t text-center text-sm text-gray-500">
//           <p>Health analytics dashboard • Data last updated: {new Date().toLocaleString()}</p>
//           <p className="mt-1">
//             This report is for informational purposes only and should not replace professional medical advice.
//           </p>
//         </footer>
//       </div>
      
//       {/* Gift Modal */}
//       <AnimatePresence>
//         {showGift && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800 flex items-center">
//                   <Gift className="text-blue-500 mr-2" size={20} />
//                   Special Offer!
//                 </h3>
//                 <button 
//                   onClick={() => setShowGift(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>
              
//               <div className="text-center py-4">
//                 <div className="mb-4 flex justify-center">
//                   <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center">
//                     <Award className="text-blue-500" size={40} />
//                   </div>
//                 </div>
//                 <h4 className="text-xl font-medium mb-2">Premium Health Insights</h4>
//                 <p className="text-gray-600 mb-4">
//                   Unlock advanced analytics and personalized recommendations with our premium plan!
//                 </p>
//                 <div className="bg-blue-50 rounded-lg p-3 mb-4">
//                   <p className="text-blue-700 font-medium">Use code: <span className="font-bold">HEALTH25</span> for 25% off</p>
//                 </div>
//               </div>
              
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => setShowGift(false)}
//                   className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Later
//                 </button>
//                 <button
//                   onClick={() => {
//                     alert("This would navigate to the premium plan in a real application.");
//                     setShowGift(false);
//                   }}
//                   className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
//                 >
//                   View Plans
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
      
//       {/* Insight Popover */}
//       <AnimatePresence>
//         {showInsight && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 max-w-xs z-30"
//           >
//             <div className="flex justify-between items-center mb-2">
//               <h4 className="font-medium text-blue-700 flex items-center">
//                 <Zap className="mr-2" size={16} />
//                 Health Insight
//               </h4>
//               <button 
//                 onClick={() => setShowInsight(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//             <p className="text-sm text-gray-600">
//               {factorsData.find(f => f.classification?.includes('Critical') || f.classification?.includes('High'))
//                 ? `Your ${factorsData.find(f => f.classification?.includes('Critical') || f.classification?.includes('High')).name} levels need attention. Consider consulting with your doctor.`
//                 : `Great job! Your health markers are looking good. Keep up the healthy habits!`
//               }
//             </p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // Dashboard Summary Component
// const DashboardSummary = ({ 
//   healthReport, 
//   factorsData, 
//   dashboardStats, 
//   distributionData, 
//   trendData, 
//   patientName, 
//   COLOR_PALETTE, 
//   animateChart,
//   getClassificationDetails,
//   setShowGift
// }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       key="summary"
//       className="space-y-6"
//     >
//       {/* Welcome & Health Score Card */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Welcome Card */}
//         <div className="bg-white rounded-xl shadow-md p-6 col-span-2">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">
//             Welcome, {patientName}!
//           </h2>
//           <div className="prose prose-sm max-w-none text-gray-600">
//             {healthReport.summary ? (
//               <div dangerouslySetInnerHTML={{ __html: healthReport.summary.replace(/\n/g, '<br/>') }} />
//             ) : (
//               <p>Your personalized health report has been generated based on your latest test results.</p>
//             )}
//           </div>
          
//           {healthReport.goodNews && healthReport.goodNews.length > 0 && (
//             <div className="mt-4 p-4 bg-green-50 rounded-lg">
//               <h3 className="font-medium text-green-700 flex items-center mb-2">
//                 <CheckCircle2 className="mr-2" size={18} />
//                 Good News!
//               </h3>
//               <ul className="list-disc pl-5 text-green-800 text-sm space-y-1">
//                 {healthReport.goodNews.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
        
//         {/* Health Score Card */}
//         <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white">
//           <h3 className="font-medium text-blue-100 mb-2 flex items-center">
//             <Activity className="mr-2" size={18} />
//             Health Score
//           </h3>
          
//           <div className="flex items-center justify-center mt-4">
//             <div className="relative">
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.5 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
//                 className="text-center"
//               >
//                 <div className="text-5xl font-bold mb-1">
//                   {dashboardStats.healthScore}<span className="text-lg">%</span>
//                 </div>
//                 <div className="font-medium text-blue-100">
//                   {dashboardStats.healthStatus}
//                 </div>
//               </motion.div>
//             </div>
//           </div>
          
//           <div className="mt-6">
//             <div className="w-full bg-blue-400 bg-opacity-40 rounded-full h-2.5">
//               <motion.div 
//                 initial={{ width: "0%" }}
//                 animate={{ width: `${dashboardStats.healthScore}%` }}
//                 transition={{ delay: 0.5, duration: 1 }}
//                 className="h-2.5 rounded-full"
//                 style={{ backgroundColor: dashboardStats.healthScore > 70 ? '#10B981' : dashboardStats.healthScore > 40 ? '#F59E0B' : '#F43F5E' }}
//               />
//             </div>
            
//             <div className="flex justify-between text-xs mt-2 text-blue-100">
//               <span>Critical</span>
//               <span>Good</span>
//               <span>Excellent</span>
//             </div>
//           </div>
          
//           <button
//             onClick={() => setShowGift(true)}
//             className="mt-6 w-full py-2 px-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
//           >
//             <Star className="mr-2" size={16} />
//             Get Premium Analysis
//           </button>
//         </div>
//       </div>
      
//       {/* Key Metrics & Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//         {/* Distribution Chart */}
//         <div className="lg:col-span-5 bg-white rounded-xl shadow-md p-4">
//           <h3 className="font-medium text-gray-700 mb-4 flex items-center">
//             <PieChartIcon className="mr-2 text-blue-500" size={18} />
//             Health Factors Distribution
//           </h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={distributionData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={80}
//                   innerRadius={50}
//                   fill="#8884d8"
//                   dataKey="value"
//                   animationBegin={animateChart ? 0 : 9999}
//                   animationDuration={1200}
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {distributionData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip 
//                   formatter={(value) => [`${value}%`, 'Percentage']}
//                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
        
//         {/* Health Score Trend */}
//         <div className="lg:col-span-7 bg-white rounded-xl shadow-md p-4">
//           <h3 className="font-medium text-gray-700 mb-4 flex items-center">
//             <TrendingUp className="mr-2 text-blue-500" size={18} />
//             Health Score Trend
//           </h3>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart
//                 data={trendData}
//                 margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={COLOR_PALETTE.primary} stopOpacity={0.8}/>
//                     <stop offset="95%" stopColor={COLOR_PALETTE.primary} stopOpacity={0.1}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="month" tick={{ fontSize: 12 }} />
//                 <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
//                 <Tooltip 
//                   formatter={(value) => [`${value}%`, 'Health Score']}
//                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
//                 />
//                 <Area 
//                   type="monotone" 
//                   dataKey="value" 
//                   stroke={COLOR_PALETTE.primary} 
//                   fillOpacity={1} 
//                   fill="url(#colorHealth)" 
//                   animationBegin={animateChart ? 0 : 9999}
//                   animationDuration={1500}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
      
//       {/* Critical Factors Alert */}
//       <div className="grid grid-cols-1 gap-6">
//         {factorsData.filter(f => f.classification?.includes('Critical')).length > 0 && (
//           <motion.div 
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.5 }}
//             className="bg-red-50 rounded-xl shadow-md p-6 border-l-4 border-red-500"
//           >
//             <h3 className="text-red-700 font-medium mb-3 flex items-center">
//               <AlertOctagon className="mr-2" size={20} />
//               Critical Factors Requiring Attention
//             </h3>
//             <div className="space-y-3">
//               {factorsData
//                 .filter(f => f.classification?.includes('Critical'))
//                 .map((factor, idx) => (
//                   <div key={idx} className="flex items-center justify-between">
//                     <div>
//                       <span className="font-medium text-red-800">{factor.name}</span>
//                       <span className="text-red-600 ml-2">({factor.value})</span>
//                     </div>
//                     <span className="text-sm bg-red-100 text-red-800 py-1 px-3 rounded-full">
//                       Critical
//                     </span>
//                   </div>
//                 ))
//               }
//             </div>
//             <div className="mt-4 text-sm text-red-700">
//               Please consult with your healthcare provider as soon as possible regarding these health markers.
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// // Vitals Section Component
// const VitalsSection = ({ 
//   factorsData, 
//   radarData, 
//   COLOR_PALETTE, 
//   animateChart, 
//   getClassificationDetails,
//   healthReport 
// }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       key="vitals"
//       className="space-y-6"
//     >
//       {/* Radar Chart & Stats */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Radar Chart */}
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <h3 className="font-medium text-gray-700 mb-4">Health Factors Overview</h3>
//           <div className="h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
//                 <PolarGrid stroke="#e2e8f0" />
//                 <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
//                 <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
//                 <Radar
//                   name="Health Factors"
//                   dataKey="value"
//                   stroke={COLOR_PALETTE.primary}
//                   fill={COLOR_PALETTE.primary}
//                   fillOpacity={0.6}
//                   animationBegin={animateChart ? 0 : 9999}
//                   animationDuration={1000}
//                 />
//                 <Tooltip
//                   contentStyle={{ 
//                     borderRadius: '8px', 
//                     border: 'none', 
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
//                   }}
//                 />
//               </RadarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
        
//         {/* Key Stats */}
//         <div className="grid grid-cols-1 gap-4">
//           <div className="bg-white rounded-xl shadow-md p-6">
//             <h3 className="font-medium text-gray-700 mb-4">Key Health Metrics</h3>
//             <div className="space-y-4">
//               {factorsData.slice(0, 3).map((factor, idx) => {
//                 const details = getClassificationDetails(factor.classification, factor.value);
//                 return (
//                   <div key={idx} className="border-b pb-3 last:border-b-0 last:pb-0">
//                     <div className="flex justify-between items-center">
//                       <span className="font-medium">{factor.name}</span>
//                       <span 
//                         className="text-sm py-1 px-3 rounded-full"
//                         style={{ backgroundColor: details.bgColor, color: details.color }}
//                       >
//                         {details.icon}
//                         {factor.classification}
//                       </span>
//                     </div>
//                     <div className="mt-2 flex justify-between items-center">
//                       <span className="text-xl font-semibold">{factor.value}</span>
//                       <span className="text-xs text-gray-500">
//                         {factor.normalRange ? `Normal: ${factor.normalRange}` : '-'}
//                       </span>
//                     </div>
//                     <div className="mt-1 text-sm" style={{ color: details.color }}>
//                       {details.description}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
          
//           <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-md p-6 text-white">
//             <h3 className="font-medium text-blue-100 mb-4">Recent Achievements</h3>
//             <div className="space-y-3">
//               {factorsData.filter(f => f.classification?.includes('Normal')).length > 0 ? (
//                 <>
//                   <div className="flex items-center">
//                     <CheckCircle2 className="mr-3" size={18} />
//                     <span>
//                       {factorsData.filter(f => f.classification?.includes('Normal')).length} factors in healthy range
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <Award className="mr-3" size={18} />
//                     <span>Regular monitoring consistency</span>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex items-center">
//                   <Clock className="mr-3" size={18} />
//                   <span>Tracking started - first milestone pending</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Detailed Factors Table */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="p-6 pb-0">
//           <h3 className="font-medium text-gray-700 mb-2">All Health Factors</h3>
//           <p className="text-sm text-gray-500 mb-4">
//             Complete analysis of all measured health parameters
//           </p>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-50">
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Factor
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Value
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Normal Range
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {factorsData.map((factor, idx) => {
//                 const details = getClassificationDetails(factor.classification, factor.value);
//                 return (
//                   <tr key={idx}>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="font-medium text-gray-900">{factor.name}</div>
//                       {factor.meaning && (
//                         <div className="text-xs text-gray-500">{factor.meaning}</div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-semibold text-gray-900">{factor.value}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span 
//                         className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full"
//                         style={{ backgroundColor: details.bgColor, color: details.color }}
//                       >
//                         {details.icon}
//                         {factor.classification}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {factor.normalRange || "Not specified"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <div style={{ color: details.color }}>{details.suggestion}</div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Analysis Section Component
// const AnalysisSection = ({ healthReport, factorsData, getClassificationDetails }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       key="analysis"
//       className="space-y-6"
//     >
//       {/* Doctor's Analysis */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h3 className="font-medium text-gray-700 mb-4 flex items-center">
//           <FileText className="mr-2 text-blue-500" size={18} />
//           Professional Analysis
//         </h3>
//         <div className="prose prose-sm max-w-none text-gray-600">
//           {healthReport.doctorAdvice ? (
//             <div dangerouslySetInnerHTML={{ __html: healthReport.doctorAdvice.replace(/\n/g, '<br/>') }} />
//           ) : (
//             <p>No specific doctor analysis is available for this report.</p>
//           )}
//         </div>
//       </div>
      
//       {/* Red Flags & Concerns */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h3 className="font-medium text-gray-700 mb-4 flex items-center">
//           <AlertTriangle className="mr-2 text-amber-500" size={18} />
//           Key Concerns & Red Flags
//         </h3>
//         {healthReport.redFlags ? (
//           <div className="prose prose-sm max-w-none text-gray-600">
//             <div dangerouslySetInnerHTML={{ __html: healthReport.redFlags.replace(/\n/g, '<br/>') }} />
//           </div>
//         ) : (
//           <div>
//             {factorsData.filter(f => f.classification?.includes('Critical') || f.classification?.includes('High')).length > 0 ? (
//               <div className="space-y-4">
//                 {factorsData
//                   .filter(f => f.classification?.includes('Critical') || f.classification?.includes('High'))
//                   .map((factor, idx) => {
//                     const details = getClassificationDetails(factor.classification, factor.value);
//                     return (
//                       <div 
//                         key={idx} 
//                         className="p-4 rounded-lg"
//                         style={{ backgroundColor: details.bgColor }}
//                       >
//                         <div className="font-medium mb-1" style={{ color: details.color }}>
//                           {details.icon} {factor.name}: {factor.value}
//                         </div>
//                         <p className="text-sm text-gray-700">
//                           {factor.meaning || `This ${factor.name} level requires attention. ${details.suggestion}.`}
//                         </p>
//                       </div>
//                     );
//                   })
//               }
//               </div>
//             ) : (
//               <div className="p-4 bg-green-50 rounded-lg">
//                 <div className="font-medium text-green-700 flex items-center mb-1">
//                   <CheckCircle2 className="mr-2" size={18} />
//                   No Critical Concerns
//                 </div>
//                 <p className="text-sm text-green-800">
//                   Your test results don't show any critical health issues that need immediate attention.
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
      
//       {/* Lifestyle Tips */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h3 className="font-medium text-gray-700 mb-4 flex items-center">
//           <Heart className="mr-2 text-red-500" size={18} />
//           Lifestyle Recommendations
//         </h3>
//         <div className="prose prose-sm max-w-none text-gray-600">
//           {healthReport.lifestyleTips ? (
//             <div dangerouslySetInnerHTML={{ __html: healthReport.lifestyleTips.replace(/\n/g, '<br/>') }} />
//           ) : (
//             <>
//               <p>Based on your health markers, here are some general lifestyle recommendations:</p>
//               <ul className="mt-2 space-y-2">
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2 mt-1">
//                     <CheckCircle2 size={16} />
//                   </span>
//                   Maintain a balanced diet rich in vegetables, fruits, and whole grains
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2 mt-1">
//                     <CheckCircle2 size={16} />
//                   </span>
//                   Aim for at least 150 minutes of moderate exercise per week
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2 mt-1">
//                     <CheckCircle2 size={16} />
//                   </span>
//                   Ensure 7-8 hours of quality sleep each night
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2 mt-1">
//                     <CheckCircle2 size={16} />
//                   </span>
//                   Stay hydrated with 8-10 glasses of water daily
//                 </li>
//                 <li className="flex items-start">
//                   <span className="text-green-500 mr-2 mt-1">
//                     <CheckCircle2 size={16} />
//                   </span>
//                   Practice stress management techniques like meditation
//                 </li>
//               </ul>
//             </>
//           )}
//         </div>
//       </div>
      
//       {/* Supplements */}
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h3 className="font-medium text-gray-700 mb-4 flex items-center">
//           <Pill className="mr-2 text-purple-500" size={18} />
//           Supplement Suggestions
//         </h3>
//         <div className="prose prose-sm max-w-none text-gray-600">
//           {healthReport.supplements ? (
//             <div dangerouslySetInnerHTML={{ __html: healthReport.supplements.replace(/\n/g, '<br/>') }} />
//           ) : (
//             <p>No specific supplement recommendations are available for this report.</p>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Diet Section Component
// const DietSection = ({ healthReport }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       key="diet"
//       className="space-y-6"
//     >
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h3 className="font-medium text-gray-700 mb-4 flex items-center">
//           <Apple className="mr-2 text-green-500" size={18} />
//           Personalized Diet Plan
//         </h3>
//         <div className="prose prose-sm max-w-none text-gray-600">
//           {healthReport.dietPlan ? (
//             <div dangerouslySetInnerHTML={{ __html: healthReport.dietPlan.replace(/\n/g, '<br/>') }} />
//           ) : (
//             <p>No specific diet plan is available for this report.</p>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Exercise Section Component
// const ExerciseSection = ({ healthReport }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       key="exercise"
//       className="space-y-6"
//     >
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h3 className="font-medium text-gray-700 mb-4 flex items-center">
//           <Dumbbell className="mr-2 text-blue-500" size={18} />
//           Personalized Exercise Plan
//         </h3>
//         <div className="prose prose-sm max-w-none text-gray-600">
//           {healthReport.exercisePlan ? (
//             <div dangerouslySetInnerHTML={{ __html: healthReport.exercisePlan.replace(/\n/g, '<br/>') }} />
//           ) : (
//             <p>No specific exercise plan is available for this report.</p>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Monitoring Section Component
// // Continuing the MonitoringSection Component from where it was cut off
// const MonitoringSection = ({ healthReport }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       key="monitoring"
//       className="space-y-6"
//     >
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h3 className="font-medium text-gray-700 mb-4 flex items-center">
//           <Clipboard className="mr-2 text-indigo-500" size={18} />
//           Health Monitoring Plan
//         </h3>
//         <div className="prose prose-sm max-w-none text-gray-600">
//           {healthReport.reminders ? (
//             <div dangerouslySetInnerHTML={{ __html: healthReport.reminders.replace(/\n/g, '<br/>') }} />
//           ) : (
//             <div>
//               <p className="mb-4">Your health monitoring recommendations:</p>
//               <div className="space-y-4">
//                 <div className="p-4 bg-blue-50 rounded-lg">
//                   <h4 className="font-medium text-blue-700 flex items-center">
//                     <Calendar className="mr-2" size={16} />
//                     Regular Check-ups
//                   </h4>
//                   <p className="mt-1 text-sm text-blue-800">
//                     Schedule your next comprehensive health check-up in 3-6 months.
//                   </p>
//                 </div>
                
//                 <div className="p-4 bg-purple-50 rounded-lg">
//                   <h4 className="font-medium text-purple-700 flex items-center">
//                     <Activity className="mr-2" size={16} />
//                     Self-Monitoring
//                   </h4>
//                   <p className="mt-1 text-sm text-purple-800">
//                     Track your daily physical activity, nutrition, and sleep patterns.
//                   </p>
//                 </div>
                
//                 <div className="p-4 bg-green-50 rounded-lg">
//                   <h4 className="font-medium text-green-700 flex items-center">
//                     <List className="mr-2" size={16} />
//                     Health Diary
//                   </h4>
//                   <p className="mt-1 text-sm text-green-800">
//                     Keep a journal of any symptoms, energy levels, or health changes to discuss at your next appointment.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h3 className="font-medium text-gray-700 mb-4 flex items-center">
//           <Calendar className="mr-2 text-blue-500" size={18} />
//           Follow-up Schedule
//         </h3>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
//             <div className="flex items-center">
//               <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
//                 <Activity size={20} className="text-blue-600" />
//               </div>
//               <div>
//                 <div className="font-medium">Comprehensive Check-up</div>
//                 <div className="text-sm text-gray-500">Complete health assessment</div>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-sm font-medium text-blue-600">In 6 months</div>
//               <div className="text-xs text-gray-500">Recommended</div>
//             </div>
//           </div>
          
//           <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
//             <div className="flex items-center">
//               <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
//                 <Coffee size={20} className="text-green-600" />
//               </div>
//               <div>
//                 <div className="font-medium">Lifestyle Review</div>
//                 <div className="text-sm text-gray-500">Diet & exercise consultation</div>
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-sm font-medium text-green-600">In 3 months</div>
//               <div className="text-xs text-gray-500">Optional</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Personal Message Section Component
// const MessageSection = ({ healthReport, patientName }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       key="message"
//       className="space-y-6"
//     >
//       <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
//         <h3 className="font-medium text-blue-100 mb-4 flex items-center">
//           <MessageCircle className="mr-2" size={18} />
//           Personal Message
//         </h3>
//         <div className="prose prose-sm max-w-none text-white">
//           {healthReport.message ? (
//             <div dangerouslySetInnerHTML={{ __html: healthReport.message.replace(/\n/g, '<br/>') }} />
//           ) : (
//             <div>
//               <p className="text-lg mb-4">Dear {patientName},</p>
//               <p className="mb-3">
//                 Thank you for trusting us with your health journey. Remember that the path to wellness is a marathon, not a sprint.
//               </p>
//               <p className="mb-3">
//                 Every small positive change you make today contributes to a healthier tomorrow. Stay consistent with your health habits and celebrate each improvement, no matter how small.
//               </p>
//               <p className="mb-3">
//                 We're here to support you every step of the way. Don't hesitate to reach out if you have any questions or need additional guidance.
//               </p>
//               <p className="mb-3">
//                 Here's to your continued health and well-being!
//               </p>
//               <p className="font-medium">
//                 Your Healthcare Team
//               </p>
//             </div>
//           )}
//         </div>
        
//         <div className="mt-6 flex justify-end">
//           <button className="flex items-center px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors">
//             <Bookmark className="mr-2" size={16} />
//             <span className="text-sm font-medium">Save Note</span>
//           </button>
//         </div>
//       </div>
      
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h3 className="font-medium text-gray-700 mb-4">Stay Connected</h3>
//         <div className="p-4 bg-blue-50 rounded-lg">
//           <div className="flex items-start">
//             <div className="mt-1">
//               <MessageCircle size={20} className="text-blue-500" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-700">
//                 Have questions about your report? Our health advisors are available to help you understand your results and provide guidance on your next steps.
//               </p>
//               <div className="mt-4">
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
//                   Contact Support
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Helper functions for extracting content from health reports
// function extractSection(content, startHeading, endHeading) {
//   if (!content) return "";
  
//   const startRegex = new RegExp(`#\\s*\\*\\*${startHeading}.*?\\*\\*`, 'i');
//   const startMatch = content.match(startRegex);
  
//   if (!startMatch) return "";
  
//   const startIndex = startMatch.index + startMatch[0].length;
  
//   let endIndex;
//   if (endHeading) {
//     const endRegex = new RegExp(`#\\s*\\*\\*${endHeading}.*?\\*\\*`, 'i');
//     const endMatch = content.match(endRegex);
//     endIndex = endMatch ? endMatch.index : content.length;
//   } else {
//     endIndex = content.length;
//   }
  
//   return content.substring(startIndex, endIndex).trim();
// }

// function extractTable(content, tableName) {
//   if (!content) return [];
  
//   const tableStartRegex = new RegExp(`#\\s*\\*\\*${tableName}.*?\\|`, 'i');
//   const tableStartMatch = content.match(tableStartRegex);
  
//   if (!tableStartMatch) return [];
  
//   // Find the table header starting from the match
//   const startIndex = tableStartMatch.index;
//   const tableSection = content.substring(startIndex);
  
//   // Extract header and rows
//   const tableLines = tableSection.split('\n').filter(line => line.includes('|'));
  
//   if (tableLines.length < 3) return []; // Need at least header, separator, and one row
  
//   const headerRow = tableLines[0];
//   const headers = headerRow.split('|')
//     .map(h => h.trim())
//     .filter(h => h !== '');
  
//   const rows = tableLines.slice(2) // Skip header and separator rows
//     .filter(line => line.includes('|') && !line.includes('---'))
//     .map(line => {
//       const cells = line.split('|')
//         .map(cell => cell.trim())
//         .filter((cell, i) => i > 0 && i <= headers.length);
      
//       return headers.reduce((obj, header, i) => {
//         obj[header] = cells[i] || '';
//         return obj;
//       }, {});
//     });
  
//   return rows;
// }

// function extractBulletPoints(content, sectionName) {
//   if (!content) return [];
  
//   const sectionRegex = new RegExp(`#\\s*\\*\\*${sectionName}.*?\\*\\*`, 'i');
//   const sectionMatch = content.match(sectionRegex);
  
//   if (!sectionMatch) return [];
  
//   const startIndex = sectionMatch.index + sectionMatch[0].length;
  
//   // Find the next section heading or end of text
//   const nextSectionRegex = /#\s*\*\*/;
//   const restOfContent = content.substring(startIndex);
//   const nextSectionMatch = restOfContent.match(nextSectionRegex);
  
//   const endIndex = nextSectionMatch 
//     ? startIndex + nextSectionMatch.index 
//     : content.length;
  
//   const sectionContent = content.substring(startIndex, endIndex);
  
//   // Extract bullet points
//   return sectionContent
//     .split('\n')
//     .filter(line => line.trim().startsWith('#'))
//     .map(line => line.replace(/^#\s*\*(.+?)\*/, '$1').trim());
// }

// export default HealthDashboard;

// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// // Icons
// import { 
//   FaSun, FaMoon, FaDownload, FaHome, FaClipboardList, 
//   FaUtensils, FaDumbbell, FaLeaf, FaPills, FaHeartbeat, 
//   FaCalendarCheck, FaGift, FaArrowLeft, FaArrowRight 
// } from "react-icons/fa";

// const HDashboard = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const reportData = location.state?.reportData || { summary: "", rawText: "" };
//   const [darkMode, setDarkMode] = useState(false);
//   const [currentSection, setCurrentSection] = useState("summary");
//   const [dietType, setDietType] = useState("vegetarian");
//   const dashboardRef = useRef(null);
  
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
//     motivationalNote: ""
//   });
  
//   useEffect(() => {
//     if (reportData.summary) {
//       parseHealthReport(reportData.summary);
//     } else {
//       // Redirect if no data
//       navigate("/upload");
//     }
//   }, [reportData, navigate]);
  
//   const parseHealthReport = (text) => {
//     // Split by sections using the structure from views.py
//     const parsed = {
//       healthSummary: extractSection(text, "A. Health Summary 🩺", "✅ Good News"),
//       goodNews: extractSection(text, "✅ Good News", "⚠️ Areas of Concern"),
//       areasOfConcern: extractSection(text, "⚠️ Areas of Concern", "B. Red Flags & Concerns ⚠️"),
//       redFlags: extractSection(text, "B. Red Flags & Concerns ⚠️", "C. Simulated Doctor Advice 👨‍⚕️"),
//       doctorAdvice: extractSection(text, "C. Simulated Doctor Advice 👨‍⚕️", "D. 7-Day Diet Plan 🍽️"),
//       dietPlan: {
//         vegetarian: extractSection(text, "🥬 Vegetarian", "🍗 Non-Vegetarian"),
//         nonVegetarian: extractSection(text, "🍗 Non-Vegetarian", "E. 7-Day Exercise Plan 🏃")
//       },
//       exercisePlan: extractSection(text, "E. 7-Day Exercise Plan 🏃", "F. Lifestyle Tips 🌿"),
//       lifestyleTips: extractSection(text, "F. Lifestyle Tips 🌿", "G. Supplements & Food Suggestions 💊"),
//       supplements: extractSection(text, "G. Supplements & Food Suggestions 💊", "H. Health Product Suggestions (Optional) 🏥"),
//       healthProducts: extractSection(text, "H. Health Product Suggestions (Optional) 🏥", "I. Reminders & Follow-ups 🔁"),
//       reminders: extractSection(text, "I. Reminders & Follow-ups 🔁", "❣️ L. Motivational Note"),
//       motivationalNote: extractSection(text, "❣️ L. Motivational Note", "")
//     };
    
//     setParsedData(parsed);
//   };
  
//   const extractSection = (text, startMarker, endMarker) => {
//     try {
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
  
//   const downloadReport = async () => {
//     if (!dashboardRef.current) return;
    
//     try {
//       // Show loading notification
//       const loadingToast = document.createElement("div");
//       loadingToast.className = "fixed top-5 right-5 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50";
//       loadingToast.innerText = "Generating PDF...";
//       document.body.appendChild(loadingToast);
      
//       // Create PDF
//       const pdf = new jsPDF("p", "mm", "a4");
//       const content = dashboardRef.current;
      
//       // Capture current section first
//       const canvas = await html2canvas(content, {
//         scale: 2,
//         useCORS: true,
//         logging: false
//       });
      
//       const imgData = canvas.toDataURL("image/png");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
//       // Save PDF
//       pdf.save("Geetaben_Health_Report.pdf");
      
//       // Remove loading notification
//       document.body.removeChild(loadingToast);
      
//       // Show success notification
//       const successToast = document.createElement("div");
//       successToast.className = "fixed top-5 right-5 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50";
//       successToast.innerText = "Report downloaded successfully!";
//       document.body.appendChild(successToast);
      
//       // Remove success notification after 3 seconds
//       setTimeout(() => document.body.removeChild(successToast), 3000);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
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
  
//   // Function to render table from markdown-like content
//   const renderTable = (content) => {
//     if (!content) return null;
    
//     const rows = content
//       .split("\n")
//       .filter(row => row.includes("|"))
//       .map(row => row.trim());
      
//     if (rows.length < 2) return null;
    
//     const headers = rows[0].split("|").filter(cell => cell.trim()).map(cell => cell.trim());
    
//     return (
//       <div className="overflow-x-auto mt-4">
//         <table className={`min-w-full divide-y divide-${darkMode ? 'gray-700' : 'gray-200'}`}>
//           <thead className={`bg-${darkMode ? 'gray-800' : 'gray-50'}`}>
//             <tr>
//               {headers.map((header, idx) => (
//                 <th key={idx} scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className={`divide-y divide-${darkMode ? 'gray-700' : 'gray-200'}`}>
//             {rows.slice(2).map((row, rowIdx) => {
//               const cells = row.split("|").filter(cell => cell.trim()).map(cell => cell.trim());
              
//               return (
//                 <tr key={rowIdx} className={rowIdx % 2 === 0 ? `bg-${darkMode ? 'gray-900' : 'white'}` : `bg-${darkMode ? 'gray-800' : 'gray-50'}`}>
//                   {cells.map((cell, cellIdx) => (
//                     <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm">
//                       {cell}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     );
//   };
  
//   const renderList = (content) => {
//     if (!content) return null;
    
//     const listItems = content
//       .split("\n")
//       .filter(line => line.trim().startsWith("* ") || line.trim().startsWith("- "))
//       .map(line => line.replace(/^\*\s|-\s/, "").trim());
      
//     return (
//       <ul className="list-disc pl-5 space-y-2 mt-4">
//         {listItems.map((item, idx) => (
//           <li key={idx} className="text-sm md:text-base">{item}</li>
//         ))}
//       </ul>
//     );
//   };
  
//   const renderContent = () => {
//     switch (currentSection) {
//       case "summary":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 shadow-md">
//               <h3 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-200">Health Summary 🩺</h3>
//               <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
//                 {parsedData.healthSummary}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 shadow-md">
//               <h3 className="text-xl font-bold mb-4 text-green-800 dark:text-green-200">Good News! 🎉</h3>
//               <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
//                 {parsedData.goodNews}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 shadow-md">
//               <h3 className="text-xl font-bold mb-4 text-yellow-800 dark:text-yellow-200">Areas of Concern ⚠️</h3>
//               {renderTable(parsedData.areasOfConcern)}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 shadow-md">
//               <h3 className="text-xl font-bold mb-4 text-red-800 dark:text-red-200">Red Flags & Concerns ⚠️</h3>
//               <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
//                 {parsedData.redFlags}
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "doctor":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 shadow-md"
//           >
//             <motion.h3 variants={itemVariants} className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-200">Simulated Doctor Advice 👨‍⚕️</motion.h3>
//             <motion.div variants={itemVariants} className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
//               {parsedData.doctorAdvice}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="mt-8">
//               <h4 className="text-lg font-bold mb-4 text-purple-700 dark:text-purple-300">Request Appointment</h4>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300">
//                   <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
//                     <span className="text-purple-600 dark:text-purple-300">📱</span>
//                   </div>
//                   <h5 className="font-medium">Call Doctor</h5>
//                 </div>
//                 <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300">
//                   <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
//                     <span className="text-blue-600 dark:text-blue-300">📅</span>
//                   </div>
//                   <h5 className="font-medium">Book Online</h5>
//                 </div>
//                 <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300">
//                   <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
//                     <span className="text-green-600 dark:text-green-300">💬</span>
//                   </div>
//                   <h5 className="font-medium">Message</h5>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "diet":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-green-800 dark:text-green-200">7-Day Diet Plan 🍽️</h3>
//               <div className="flex items-center space-x-2 p-1 rounded-full bg-gray-100 dark:bg-gray-800">
//                 <button 
//                   onClick={() => setDietType("vegetarian")}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                     dietType === "vegetarian" 
//                     ? "bg-green-500 text-white" 
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                   }`}
//                 >
//                   🥬 Vegetarian
//                 </button>
//                 <button 
//                   onClick={() => setDietType("nonVegetarian")}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                     dietType === "nonVegetarian" 
//                     ? "bg-green-500 text-white" 
//                     : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
//                   }`}
//                 >
//                   🍗 Non-Vegetarian
//                 </button>
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
//               {dietType === "vegetarian" ? (
//                 renderTable(parsedData.dietPlan.vegetarian)
//               ) : (
//                 renderTable(parsedData.dietPlan.nonVegetarian)
//               )}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="p-4 bg-green-50 dark:bg-green-900 rounded-lg text-sm italic text-gray-600 dark:text-gray-300">
//               Remember to consult a dietitian or nutritionist for a personalized plan. Adjust portion sizes as per your needs.
//             </motion.div>
//           </motion.div>
//         );
        
//       case "exercise":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 shadow-md">
//               <h3 className="text-xl font-bold mb-4 text-orange-800 dark:text-orange-200">7-Day Exercise Plan 🏃</h3>
//               <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
//                 {parsedData.exercisePlan}
//               </div>
//               {renderTable(parsedData.exercisePlan)}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center">
//                 <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-3">
//                   <span className="text-orange-600 dark:text-orange-300 text-2xl">🧘‍♀️</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Yoga Resources</h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Access beginner-friendly yoga routines</p>
//               </div>
              
//               <div className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center">
//                 <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-3">
//                   <span className="text-orange-600 dark:text-orange-300 text-2xl">👟</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Walking Tracker</h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Track your daily walking progress</p>
//               </div>
              
//               <div className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center">
//                 <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-3">
//                   <span className="text-orange-600 dark:text-orange-300 text-2xl">🏊‍♀️</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Swimming Guide</h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Low-impact exercise for energy conservation</p>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "lifestyle":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-8"
//           >
//             <motion.div variants={itemVariants} className="p-6 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900 dark:to-teal-800 shadow-md">
//               <h3 className="text-xl font-bold mb-4 text-teal-800 dark:text-teal-200">Lifestyle Tips 🌿</h3>
//               <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
//                 {parsedData.lifestyleTips}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="p-5 rounded-lg bg-white dark:bg-gray-800 shadow-md border-l-4 border-blue-500">
//                 <h4 className="flex items-center font-semibold text-blue-700 dark:text-blue-300 mb-2">
//                   <span className="mr-2">💧</span> Hydration
//                 </h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Track your daily water intake with this handy chart</p>
//                 <div className="mt-3 flex justify-center">
//                   <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                     <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
//                   </div>
//                 </div>
//                 <div className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400">4/8 glasses today</div>
//               </div>
              
//               <div className="p-5 rounded-lg bg-white dark:bg-gray-800 shadow-md border-l-4 border-indigo-500">
//                 <h4 className="flex items-center font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
//                   <span className="mr-2">💤</span> Sleep Quality
//                 </h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your sleep patterns for better recovery</p>
//                 <div className="mt-3 flex justify-center">
//                   <div className="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                     <div className="h-full bg-indigo-500 rounded-full" style={{ width: "65%" }}></div>
//                   </div>
//                 </div>
//                 <div className="mt-1 text-xs text-center text-gray-500 dark:text-gray-400">6.5/8 hours last night</div>
//               </div>
              
//               <div className="p-5 rounded-lg bg-white dark:bg-gray-800 shadow-md border-l-4 border-purple-500">
//                 <h4 className="flex items-center font-semibold text-purple-700 dark:text-purple-300 mb-2">
//                   <span className="mr-2">🧠</span> Stress Management
//                 </h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Access meditation and relaxation techniques</p>
//                 <div className="mt-3 flex justify-center space-x-2">
//                   <button className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">Meditation</button>
//                   <button className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">Breathing</button>
//                 </div>
//               </div>
              
//               <div className="p-5 rounded-lg bg-white dark:bg-gray-800 shadow-md border-l-4 border-pink-500">
//                 <h4 className="flex items-center font-semibold text-pink-700 dark:text-pink-300 mb-2">
//                   <span className="mr-2">🎨</span> Mental Wellbeing
//                 </h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">Engage in activities that bring you joy</p>
//                 <div className="mt-3 flex justify-center space-x-2">
//                   <button className="text-xs px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full">Art</button>
//                   <button className="text-xs px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full">Music</button>
//                   <button className="text-xs px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full">Nature</button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "supplements":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800 shadow-md">
//               <h3 className="text-xl font-bold mb-4 text-amber-800 dark:text-amber-200">Supplements & Food Suggestions 💊</h3>
//               <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
//                 {parsedData.supplements}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
//                 <h4 className="font-bold text-lg mb-4 text-amber-700 dark:text-amber-300 flex items-center">
//                   <span className="mr-2">💊</span> Key Supplements
//                 </h4>
//                 <div className="space-y-4">
//                   <div className="flex items-center">
//                     <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-4">
//                       <span className="text-red-600 dark:text-red-300 text-xl">Fe</span>
//                     </div>
//                     <div>
//                       <h5 className="font-semibold">Iron</h5>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Essential for red blood cell production</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
//                       <span className="text-blue-600 dark:text-blue-300 text-xl">B12</span>
//                     </div>
//                     <div>
//                       <h5 className="font-semibold">Vitamin B12</h5>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Supports nerve function and blood cell formation</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-4">
//                       <span className="text-yellow-600 dark:text-yellow-300 text-xl">C</span>
//                     </div>
//                     <div>
//                       <h5 className="font-semibold">Vitamin C</h5>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Enhances iron absorption</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
//                       <span className="text-green-600 dark:text-green-300 text-xl">🍃</span>
//                     </div>
//                     <div>
//                       <h5 className="font-semibold">Folate</h5>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">Important for red blood cell production</p>
//                       </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md">
//                 <h4 className="font-bold text-lg mb-4 text-amber-700 dark:text-amber-300 flex items-center">
//                   <span className="mr-2">🍎</span> Iron-Rich Foods
//                 </h4>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900">
//                     <span className="block text-center text-xl mb-1">🥬</span>
//                     <p className="text-sm text-center">Spinach</p>
//                   </div>
//                   <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900">
//                     <span className="block text-center text-xl mb-1">🥜</span>
//                     <p className="text-sm text-center">Lentils</p>
//                   </div>
//                   <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900">
//                     <span className="block text-center text-xl mb-1">🌰</span>
//                     <p className="text-sm text-center">Pumpkin Seeds</p>
//                   </div>
//                   <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900">
//                     <span className="block text-center text-xl mb-1">🥫</span>
//                     <p className="text-sm text-center">Beans</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "products":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className="p-6 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900 dark:to-pink-800 shadow-md">
//               <h3 className="text-xl font-bold mb-4 text-pink-800 dark:text-pink-200">Health Product Suggestions 🎁</h3>
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//                 Based on your health report, these products might be beneficial:
//               </p>
//               <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
//                 {parsedData.healthProducts}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
//                 <div className="aspect-w-1 aspect-h-1 w-full mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
//                   <span className="text-4xl">🧪</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Iron Supplement</h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">USP verified iron supplement with vitamin C</p>
//                 <div className="flex justify-between items-center">
//                   <span className="font-bold text-pink-600 dark:text-pink-300">₹450</span>
//                   <button className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors">View</button>
//                 </div>
//               </div>
              
//               <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
//                 <div className="aspect-w-1 aspect-h-1 w-full mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
//                   <span className="text-4xl">📱</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Health Monitoring App</h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Track symptoms, medications and appointments</p>
//                 <div className="flex justify-between items-center">
//                   <span className="font-bold text-pink-600 dark:text-pink-300">Free</span>
//                   <button className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors">Download</button>
//                 </div>
//               </div>
              
//               <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
//                 <div className="aspect-w-1 aspect-h-1 w-full mb-4 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
//                   <span className="text-4xl">🧘‍♀️</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Gentle Yoga Kit</h4>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Includes mat, blocks and video guide</p>
//                 <div className="flex justify-between items-center">
//                   <span className="font-bold text-pink-600 dark:text-pink-300">₹1,200</span>
//                   <button className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors">View</button>
//                 </div>
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg text-sm text-gray-600 dark:text-gray-300 flex items-center">
//               <span className="text-yellow-600 dark:text-yellow-300 text-xl mr-2">ℹ️</span>
//               <p>These are suggestions only. Always consult with your healthcare provider before starting any new supplements.</p>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "reminders":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className="p-6 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900 dark:to-cyan-800 shadow-md">
//               <h3 className="text-xl font-bold mb-4 text-cyan-800 dark:text-cyan-200">Reminders & Follow-ups 📅</h3>
//               <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
//                 {parsedData.reminders}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow-md">
//                 <h4 className="font-bold text-lg mb-4 text-cyan-700 dark:text-cyan-300 flex items-center">
//                   <FaCalendarCheck className="mr-2" /> Upcoming Appointments
//                 </h4>
//                 <ul className="space-y-3">
//                   <li className="flex items-center p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900">
//                     <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-800 flex items-center justify-center mr-4">
//                       <span className="font-bold text-cyan-600 dark:text-cyan-300">28</span>
//                     </div>
//                     <div>
//                       <h5 className="font-medium">Hematologist Follow-up</h5>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">April 28, 2025 • 10:30 AM</p>
//                     </div>
//                   </li>
//                   <li className="flex items-center p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900">
//                     <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-800 flex items-center justify-center mr-4">
//                       <span className="font-bold text-cyan-600 dark:text-cyan-300">15</span>
//                     </div>
//                     <div>
//                     <h5 className="font-medium">Blood Test</h5>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">May 15, 2025 • 8:00 AM</p>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
              
//               <div className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow-md">
//                 <h4 className="font-bold text-lg mb-4 text-cyan-700 dark:text-cyan-300 flex items-center">
//                   <FaClipboardList className="mr-2" /> Medication Reminders
//                 </h4>
//                 <ul className="space-y-3">
//                   <li className="flex items-center justify-between p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900">
//                     <div>
//                       <h5 className="font-medium">Iron Supplement</h5>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Twice daily with meals</p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className="text-xs px-2 py-1 bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 rounded-full">8:00 AM</span>
//                       <span className="text-xs px-2 py-1 bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 rounded-full">8:00 PM</span>
//                     </div>
//                   </li>
//                   <li className="flex items-center justify-between p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900">
//                     <div>
//                       <h5 className="font-medium">Vitamin B12</h5>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Once daily in the morning</p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className="text-xs px-2 py-1 bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 rounded-full">8:00 AM</span>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="p-5 rounded-xl bg-white dark:bg-gray-800 shadow-md">
//               <h4 className="font-bold text-lg mb-4 text-cyan-700 dark:text-cyan-300 flex items-center">
//                 <FaHeartbeat className="mr-2" /> Symptom Tracker
//               </h4>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900 text-center">
//                   <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-800 mx-auto mb-2 flex items-center justify-center">
//                     <span className="text-cyan-600 dark:text-cyan-300">😊</span>
//                   </div>
//                   <p className="text-sm">Energy Level</p>
//                 </div>
//                 <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900 text-center">
//                   <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-800 mx-auto mb-2 flex items-center justify-center">
//                     <span className="text-cyan-600 dark:text-cyan-300">💓</span>
//                   </div>
//                   <p className="text-sm">Heart Rate</p>
//                 </div>
//                 <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900 text-center">
//                   <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-800 mx-auto mb-2 flex items-center justify-center">
//                     <span className="text-cyan-600 dark:text-cyan-300">😴</span>
//                   </div>
//                   <p className="text-sm">Sleep Quality</p>
//                 </div>
//                 <div className="p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900 text-center">
//                   <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-800 mx-auto mb-2 flex items-center justify-center">
//                     <span className="text-cyan-600 dark:text-cyan-300">➕</span>
//                   </div>
//                   <p className="text-sm">Add Custom</p>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "motivation":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="flex flex-col items-center justify-center min-h-[60vh]"
//           >
//             <motion.div 
//               variants={itemVariants}
//               className="p-8 rounded-xl bg-gradient-to-br from-pink-50 to-purple-100 dark:from-pink-900 dark:to-purple-900 shadow-lg text-center max-w-2xl"
//             >
//               <div className="w-20 h-20 rounded-full bg-pink-100 dark:bg-pink-800 mx-auto mb-6 flex items-center justify-center">
//                 <FaHeartbeat className="text-3xl text-pink-600 dark:text-pink-300" />
//               </div>
//               <h3 className="text-2xl font-bold mb-6 text-pink-800 dark:text-pink-200">Motivational Note ❣️</h3>
//               <div className="text-lg italic text-gray-700 dark:text-gray-300 mb-8 whitespace-pre-wrap">
//                 {parsedData.motivationalNote}
//               </div>
//               <div className="w-full h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mb-6"></div>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 Remember, every small step you take towards better health is a victory. Keep going!
//               </p>
//             </motion.div>
            
//             <motion.div 
//               variants={itemVariants}
//               className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
//             >
//               <button className="px-6 py-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all flex flex-col items-center">
//                 <FaGift className="text-xl mb-2 text-pink-600 dark:text-pink-300" />
//                 <span>Rewards</span>
//               </button>
//               <button className="px-6 py-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all flex flex-col items-center">
//                 <FaLeaf className="text-xl mb-2 text-green-600 dark:text-green-300" />
//                 <span>Wellness</span>
//               </button>
//               <button className="px-6 py-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all flex flex-col items-center">
//                 <FaPills className="text-xl mb-2 text-blue-600 dark:text-blue-300" />
//                 <span>Medication</span>
//               </button>
//               <button className="px-6 py-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all flex flex-col items-center">
//                 <FaUtensils className="text-xl mb-2 text-amber-600 dark:text-amber-300" />
//                 <span>Nutrition</span>
//               </button>
//             </motion.div>
//           </motion.div>
//         );
        
//       default:
//         return null;
//     }
//   };
  
//   const sections = [
//     { id: "summary", label: "Summary", icon: <FaClipboardList /> },
//     { id: "doctor", label: "Doctor Advice", icon: <FaHeartbeat /> },
//     { id: "diet", label: "Diet Plan", icon: <FaUtensils /> },
//     { id: "exercise", label: "Exercise", icon: <FaDumbbell /> },
//     { id: "lifestyle", label: "Lifestyle", icon: <FaLeaf /> },
//     { id: "supplements", label: "Supplements", icon: <FaPills /> },
//     { id: "products", label: "Products", icon: <FaGift /> },
//     { id: "reminders", label: "Reminders", icon: <FaCalendarCheck /> },
//     { id: "motivation", label: "Motivation", icon: <FaHeartbeat /> }
//   ];
  
//   const currentIndex = sections.findIndex(section => section.id === currentSection);
//   const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1].id : null;
//   const prevSection = currentIndex > 0 ? sections[currentIndex - 1].id : null;
  
//   return (
//     <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
//       {/* Header */}
//       <header className={`sticky top-0 z-10 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={() => navigate("/")}
//               className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
//             >
//               <FaHome className="text-lg" />
//             </button>
//             <h1 className="text-xl font-bold">Health Dashboard</h1>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={() => setDarkMode(!darkMode)}
//               className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
//             >
//               {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
//             </button>
            
//             <button 
//               onClick={downloadReport}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
//             >
//               <FaDownload />
//               <span>Download Report</span>
//             </button>
//           </div>
//         </div>
//       </header>
      
//       {/* Navigation */}
//       <nav className={`sticky top-16 z-10 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
//         <div className="container mx-auto px-4 overflow-x-auto">
//           <div className="flex space-x-1 py-2">
//             {sections.map(section => (
//               <button
//                 key={section.id}
//                 onClick={() => setCurrentSection(section.id)}
//                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
//                   currentSection === section.id 
//                   ? darkMode 
//                     ? "bg-blue-600 text-white" 
//                     : "bg-blue-500 text-white"
//                   : darkMode 
//                     ? "hover:bg-gray-700" 
//                     : "hover:bg-gray-100"
//                 }`}
//               >
//                 {section.icon}
//                 <span>{section.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </nav>
      
//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8" ref={dashboardRef}>
//         {/* Navigation Arrows for Mobile */}
//         <div className="flex justify-between mb-6 md:hidden">
//           <button
//             onClick={() => prevSection && setCurrentSection(prevSection)}
//             disabled={!prevSection}
//             className={`p-3 rounded-full ${prevSection ? darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300" : "opacity-50 cursor-not-allowed"}`}
//           >
//             <FaArrowLeft />
//           </button>
          
//           <h2 className="text-xl font-semibold self-center">
//             {sections.find(s => s.id === currentSection)?.label}
//           </h2>
          
//           <button
//             onClick={() => nextSection && setCurrentSection(nextSection)}
//             disabled={!nextSection}
//             className={`p-3 rounded-full ${nextSection ? darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300" : "opacity-50 cursor-not-allowed"}`}
//           >
//             <FaArrowRight />
//           </button>
//         </div>
        
//         {/* Dashboard Content */}
//         {renderContent()}
//       </main>
      
//       {/* Footer */}
//       <footer className={`py-6 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
//         <div className="container mx-auto px-4 text-center">
//           <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//             © 2025 Health Dashboard. This report is for informational purposes only and not a substitute for professional medical advice.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HDashboard;

// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// // Icons
// import { 
//   FaSun, FaMoon, FaDownload, FaHome, FaClipboardList, 
//   FaUtensils, FaDumbbell, FaLeaf, FaPills, FaHeartbeat, 
//   FaCalendarCheck, FaGift, FaArrowLeft, FaArrowRight 
// } from "react-icons/fa";

// const HDashboard = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const reportData = location.state?.reportData || { summary: "", rawText: "" };
//   const [darkMode, setDarkMode] = useState(false);
//   const [currentSection, setCurrentSection] = useState("summary");
//   const [dietType, setDietType] = useState("vegetarian");
//   const dashboardRef = useRef(null);
  
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
//     motivationalNote: ""
//   });
  
//   useEffect(() => {
//     if (reportData.summary) {
//       parseHealthReport(reportData.summary);
//     } else {
//       // Redirect if no data
//       navigate("/upload");
//     }
//   }, [reportData, navigate]);
  
//   const parseHealthReport = (text) => {
//     if (!text) return;
    
//     // Split by sections using the structure from views.py
//     const parsed = {
//       healthSummary: extractSection(text, "A. Health Summary 🩺", "✅ Good News") || text,
//       goodNews: extractSection(text, "✅ Good News", "⚠️ Areas of Concern"),
//       areasOfConcern: extractSection(text, "⚠️ Areas of Concern", "B. Red Flags & Concerns ⚠️"),
//       redFlags: extractSection(text, "B. Red Flags & Concerns ⚠️", "C. Simulated Doctor Advice 👨‍⚕️"),
//       doctorAdvice: extractSection(text, "C. Simulated Doctor Advice 👨‍⚕️", "D. 7-Day Diet Plan 🍽️"),
//       dietPlan: {
//         vegetarian: extractSection(text, "🥬 Vegetarian", "🍗 Non-Vegetarian"),
//         nonVegetarian: extractSection(text, "🍗 Non-Vegetarian", "E. 7-Day Exercise Plan 🏃")
//       },
//       exercisePlan: extractSection(text, "E. 7-Day Exercise Plan 🏃", "F. Lifestyle Tips 🌿"),
//       lifestyleTips: extractSection(text, "F. Lifestyle Tips 🌿", "G. Supplements & Food Suggestions 💊"),
//       supplements: extractSection(text, "G. Supplements & Food Suggestions 💊", "H. Health Product Suggestions (Optional) 🏥"),
//       healthProducts: extractSection(text, "H. Health Product Suggestions (Optional) 🏥", "I. Reminders & Follow-ups 🔁"),
//       reminders: extractSection(text, "I. Reminders & Follow-ups 🔁", "❣️ L. Motivational Note"),
//       motivationalNote: extractSection(text, "❣️ L. Motivational Note", "")
//     };
    
//     setParsedData(parsed);
//   };
  
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
  
//   const downloadReport = async () => {
//     if (!dashboardRef.current) return;
    
//     try {
//       // Show loading notification
//       const loadingToast = document.createElement("div");
//       loadingToast.className = "fixed top-5 right-5 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50";
//       loadingToast.innerText = "Generating PDF...";
//       document.body.appendChild(loadingToast);
      
//       // Create PDF with RGB colors
//       const pdf = new jsPDF("p", "mm", "a4");
//       const content = dashboardRef.current;
      
//       // Temporarily disable dark mode for PDF generation
//       const originalDarkMode = darkMode;
//       setDarkMode(false);
      
//       // Wait for the UI to update
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       const canvas = await html2canvas(content, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: "#ffffff" // White background for PDF
//       });
      
//       const imgData = canvas.toDataURL("image/png");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
//       // Restore dark mode
//       setDarkMode(originalDarkMode);
      
//       // Save PDF
//       pdf.save("Health_Report.pdf");
      
//       // Remove loading notification
//       document.body.removeChild(loadingToast);
      
//       // Show success notification
//       const successToast = document.createElement("div");
//       successToast.className = "fixed top-5 right-5 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50";
//       successToast.innerText = "Report downloaded successfully!";
//       document.body.appendChild(successToast);
      
//       // Remove success notification after 3 seconds
//       setTimeout(() => document.body.removeChild(successToast), 3000);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
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
  
//   // Function to render table from markdown-like content
//   const renderTable = (content) => {
//     if (!content) return null;
    
//     const rows = content
//       .split("\n")
//       .filter(row => row.includes("|"))
//       .map(row => row.trim());
      
//     if (rows.length < 2) return null;
    
//     const headers = rows[0].split("|").filter(cell => cell.trim()).map(cell => cell.trim());
    
//     return (
//       <div className="overflow-x-auto mt-4">
//         <table className={`min-w-full divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
//           <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
//             <tr>
//               {headers.map((header, idx) => (
//                 <th key={idx} scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
//             {rows.slice(2).map((row, rowIdx) => {
//               const cells = row.split("|").filter(cell => cell.trim()).map(cell => cell.trim());
              
//               return (
//                 <tr key={rowIdx} className={rowIdx % 2 === 0 ? (darkMode ? "bg-gray-900" : "bg-white") : (darkMode ? "bg-gray-800" : "bg-gray-50")}>
//                   {cells.map((cell, cellIdx) => (
//                     <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm">
//                       {cell}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     );
//   };
  
//   const renderList = (content) => {
//     if (!content) return null;
    
//     const listItems = content
//       .split("\n")
//       .filter(line => line.trim().startsWith("* ") || line.trim().startsWith("- "))
//       .map(line => line.replace(/^\*\s|-\s/, "").trim());
      
//     return (
//       <ul className="list-disc pl-5 space-y-2 mt-4">
//         {listItems.map((item, idx) => (
//           <li key={idx} className="text-sm md:text-base">{item}</li>
//         ))}
//       </ul>
//     );
//   };
  
//   const renderContent = () => {
//     switch (currentSection) {
//       case "summary":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-200">Health Summary 🩺</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.healthSummary || "No health summary available."}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-green-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-green-800 dark:text-green-200">Good News! 🎉</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.goodNews || "No good news to report."}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-yellow-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-yellow-800 dark:text-yellow-200">Areas of Concern ⚠️</h3>
//               {parsedData.areasOfConcern ? (
//                 renderTable(parsedData.areasOfConcern) || 
//                 <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                   {parsedData.areasOfConcern}
//                 </div>
//               ) : (
//                 <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No areas of concern identified.</p>
//               )}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-red-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-red-800 dark:text-red-200">Red Flags & Concerns ⚠️</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.redFlags || "No red flags identified."}
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "doctor":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-purple-50"} shadow-md`}
//           >
//             <motion.h3 variants={itemVariants} className="text-xl font-bold mb-4 text-purple-800 dark:text-purple-200">Simulated Doctor Advice 👨‍⚕️</motion.h3>
//             <motion.div variants={itemVariants} className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//               {parsedData.doctorAdvice || "No specific doctor advice available."}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="mt-8">
//               <h4 className="text-lg font-bold mb-4 text-purple-700 dark:text-purple-300">Request Appointment</h4>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300`}>
//                   <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-purple-900" : "bg-purple-100"} flex items-center justify-center mb-2`}>
//                     <span className={darkMode ? "text-purple-300" : "text-purple-600"}>📱</span>
//                   </div>
//                   <h5 className="font-medium">Call Doctor</h5>
//                 </div>
//                 <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300`}>
//                   <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-blue-900" : "bg-blue-100"} flex items-center justify-center mb-2`}>
//                     <span className={darkMode ? "text-blue-300" : "text-blue-600"}>📅</span>
//                   </div>
//                   <h5 className="font-medium">Book Online</h5>
//                 </div>
//                 <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300`}>
//                   <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-green-900" : "bg-green-100"} flex items-center justify-center mb-2`}>
//                     <span className={darkMode ? "text-green-300" : "text-green-600"}>💬</span>
//                   </div>
//                   <h5 className="font-medium">Message</h5>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "diet":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-green-800 dark:text-green-200">7-Day Diet Plan 🍽️</h3>
//               <div className={`flex items-center space-x-2 p-1 rounded-full ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
//                 <button 
//                   onClick={() => setDietType("vegetarian")}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                     dietType === "vegetarian" 
//                     ? "bg-green-500 text-white" 
//                     : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   🥬 Vegetarian
//                 </button>
//                 <button 
//                   onClick={() => setDietType("nonVegetarian")}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                     dietType === "nonVegetarian" 
//                     ? "bg-green-500 text-white" 
//                     : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   🍗 Non-Vegetarian
//                 </button>
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//               {dietType === "vegetarian" ? (
//                 renderTable(parsedData.dietPlan.vegetarian) || 
//                 <div className="p-6 text-center text-gray-500 dark:text-gray-400">
//                   No vegetarian diet plan available.
//                 </div>
//               ) : (
//                 renderTable(parsedData.dietPlan.nonVegetarian) || 
//                 <div className="p-6 text-center text-gray-500 dark:text-gray-400">
//                   No non-vegetarian diet plan available.
//                 </div>
//               )}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-green-50"} text-sm italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//               Remember to consult a dietitian or nutritionist for a personalized plan. Adjust portion sizes as per your needs.
//             </motion.div>
//           </motion.div>
//         );
        
//       case "exercise":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-orange-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-orange-800 dark:text-orange-200">7-Day Exercise Plan 🏃</h3>
//               {parsedData.exercisePlan ? (
//                 renderTable(parsedData.exercisePlan) || 
//                 <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                   {parsedData.exercisePlan}
//                 </div>
//               ) : (
//                 <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No exercise plan available.</p>
//               )}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center`}>
//                 <div className={`w-16 h-16 rounded-full ${darkMode ? "bg-orange-900" : "bg-orange-100"} flex items-center justify-center mb-3`}>
//                   <span className={darkMode ? "text-orange-300" : "text-orange-600"} style={{ fontSize: "2rem" }}>🧘‍♀️</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Yoga Resources</h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Access beginner-friendly yoga routines</p>
//               </div>
              
//               <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center`}>
//                 <div className={`w-16 h-16 rounded-full ${darkMode ? "bg-orange-900" : "bg-orange-100"} flex items-center justify-center mb-3`}>
//                   <span className={darkMode ? "text-orange-300" : "text-orange-600"} style={{ fontSize: "2rem" }}>👟</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Walking Tracker</h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Track your daily walking progress</p>
//               </div>
              
//               <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center`}>
//                 <div className={`w-16 h-16 rounded-full ${darkMode ? "bg-orange-900" : "bg-orange-100"} flex items-center justify-center mb-3`}>
//                   <span className={darkMode ? "text-orange-300" : "text-orange-600"} style={{ fontSize: "2rem" }}>🏊‍♀️</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Swimming Guide</h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Low-impact exercise for energy conservation</p>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "lifestyle":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-8"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-teal-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-teal-800 dark:text-teal-200">Lifestyle Tips 🌿</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.lifestyleTips || "No lifestyle tips available."}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className={`p-5 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md border-l-4 border-blue-500`}>
//                 <h4 className="flex items-center font-semibold text-blue-700 dark:text-blue-300 mb-2">
//                   <span className="mr-2">💧</span> Hydration
//                 </h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Track your daily water intake with this handy chart</p>
//                 <div className="mt-3 flex justify-center">
//                   <div className={`w-full h-6 ${darkMode ? "bg-gray-600" : "bg-gray-200"} rounded-full overflow-hidden`}>
//                     <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
//                   </div>
//                 </div>
//                 <div className={`mt-1 text-xs text-center ${darkMode ? "text-gray-500" : "text-gray-500"}`}>4/8 glasses today</div>
//               </div>
              
//               <div className={`p-5 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md border-l-4 border-indigo-500`}>
//                 <h4 className="flex items-center font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
//                   <span className="mr-2">💤</span> Sleep Quality
//                 </h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Monitor your sleep patterns for better recovery</p>
//                 <div className="mt-3 flex justify-center">
//                   <div className={`w-full h-6 ${darkMode ? "bg-gray-600" : "bg-gray-200"} rounded-full overflow-hidden`}>
//                     <div className="h-full bg-indigo-500 rounded-full" style={{ width: "65%" }}></div>
//                   </div>
//                 </div>
//                 <div className={`mt-1 text-xs text-center ${darkMode ? "text-gray-500" : "text-gray-500"}`}>6.5/8 hours last night</div>
//               </div>
              
//               <div className={`p-5 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md border-l-4 border-purple-500`}>
//                 <h4 className="flex items-center font-semibold text-purple-700 dark:text-purple-300 mb-2">
//                   <span className="mr-2">🧠</span> Stress Management
//                 </h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Access meditation and relaxation techniques</p>
//                 <div className="mt-3 flex justify-center space-x-2">
//                   <button className={`text-xs px-3 py-1 ${darkMode ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-700"} rounded-full`}>Meditation</button>
//                   <button className={`text-xs px-3 py-1 ${darkMode ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-700"} rounded-full`}>Breathing</button>
//                 </div>
//               </div>
              
//               <div className={`p-5 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md border-l-4 border-pink-500`}>
//                 <h4 className="flex items-center font-semibold text-pink-700 dark:text-pink-300 mb-2">
//                   <span className="mr-2">🎨</span> Mental Wellbeing
//                 </h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Engage in activities that bring you joy</p>
//                 <div className="mt-3 flex justify-center space-x-2">
//                   <button className={`text-xs px-3 py-1 ${darkMode ? "bg-pink-900 text-pink-300" : "bg-pink-100 text-pink-700"} rounded-full`}>Art</button>
//                   <button className={`text-xs px-3 py-1 ${darkMode ? "bg-pink-900 text-pink-300" : "bg-pink-100 text-pink-700"} rounded-full`}>Music</button>
//                   <button className={`text-xs px-3 py-1 ${darkMode ? "bg-pink-900 text-pink-300" : "bg-pink-100 text-pink-700"} rounded-full`}>Nature</button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "supplements":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-amber-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-amber-800 dark:text-amber-200">Supplements & Food Suggestions 💊</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.supplements || "No supplement suggestions available."}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md`}>
//                 <h4 className="font-bold text-lg mb-4 text-amber-700 dark:text-amber-300 flex items-center">
//                   <span className="mr-2">💊</span> Key Supplements
//                 </h4>
//                 <div className="space-y-4">
//                   <div className="flex items-center">
//                     <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-red-900" : "bg-red-100"} flex items-center justify-center mr-4`}>
//                       <span className={darkMode ? "text-red-300" : "text-red-600"} style={{ fontSize: "1.5rem" }}>Fe</span>
//                     </div>
//                     <div>
//                       <h5 className="font-semibold">Iron</h5>
//                       <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Essential for red blood cell production</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-blue-900" : "bg-blue-100"} flex items-center justify-center mr-4`}>
//                       <span className={darkMode ? "text-blue-300" : "text-blue-600"} style={{ fontSize: "1.5rem" }}>B12</span>
//                     </div>
//                     <div>
//                       <h5 className="font-semibold">Vitamin B12</h5>
//                       <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Supports nerve function and blood cell formation</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-yellow-900" : "bg-yellow-100"} flex items-center justify-center mr-4`}>
//                       <span className={darkMode ? "text-yellow-300" : "text-yellow-600"} style={{ fontSize: "1.5rem" }}>C</span>
//                     </div>
//                     <div>
//                       <h5 className="font-semibold">Vitamin C</h5>
//                       <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Enhances iron absorption</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center">
//                     <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-green-900" : "bg-green-100"} flex items-center justify-center mr-4`}>
//                       <span className={darkMode ? "text-green-300" : "text-green-600"} style={{ fontSize: "1.5rem" }}>🍃</span>
//                     </div>
//                     <div>
//                       <h5 className="font-semibold">Folate</h5>
//                       <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Important for red blood cell production</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md`}>
//                 <h4 className="font-bold text-lg mb-4 text-amber-700 dark:text-amber-300 flex items-center">
//                   <span className="mr-2">🍎</span> Iron-Rich Foods
//                 </h4>
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className={`p-3 rounded-lg ${darkMode ? "bg-amber-900" : "bg-amber-50"}`}>
//                     <span className="block text-center" style={{ fontSize: "2rem" }}>🥬</span>
//                     <p className="text-sm text-center">Spinach</p>
//                   </div>
//                   <div className={`p-3 rounded-lg ${darkMode ? "bg-amber-900" : "bg-amber-50"}`}>
//                     <span className="block text-center" style={{ fontSize: "2rem" }}>🥜</span>
//                     <p className="text-sm text-center">Lentils</p>
//                   </div>
//                   <div className={`p-3 rounded-lg ${darkMode ? "bg-amber-900" : "bg-amber-50"}`}>
//                     <span className="block text-center" style={{ fontSize: "2rem" }}>🌰</span>
//                     <p className="text-sm text-center">Pumpkin Seeds</p>
//                   </div>
//                   <div className={`p-3 rounded-lg ${darkMode ? "bg-amber-900" : "bg-amber-50"}`}>
//                     <span className="block text-center" style={{ fontSize: "2rem" }}>🥫</span>
//                     <p className="text-sm text-center">Beans</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "products":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-pink-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-pink-800 dark:text-pink-200">Health Product Suggestions 🎁</h3>
//               <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
//                 Based on your health report, these products might be beneficial:
//               </p>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.healthProducts || "No product suggestions available."}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all duration-300`}>
//                 <div className={`aspect-w-1 aspect-h-1 w-full mb-4 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-100"} flex items-center justify-center`}>
//                   <span style={{ fontSize: "3rem" }}>🧪</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Iron Supplement</h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-3`}>USP verified iron supplement with vitamin C</p>
//                 <div className="flex justify-between items-center">
//                   <span className="font-bold text-pink-600 dark:text-pink-300">₹450</span>
//                   <button className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors">View</button>
//                 </div>
//               </div>
              
//               <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all duration-300`}>
//                 <div className={`aspect-w-1 aspect-h-1 w-full mb-4 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-100"} flex items-center justify-center`}>
//                   <span style={{ fontSize: "3rem" }}>📱</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Health Monitoring App</h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-3`}>Track symptoms, medications and appointments</p>
//                 <div className="flex justify-between items-center">
//                   <span className="font-bold text-pink-600 dark:text-pink-300">Free</span>
//                   <button className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors">Download</button>
//                 </div>
//               </div>
              
//               <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all duration-300`}>
//                 <div className={`aspect-w-1 aspect-h-1 w-full mb-4 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-100"} flex items-center justify-center`}>
//                   <span style={{ fontSize: "3rem" }}>🧘‍♀️</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Gentle Yoga Kit</h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-3`}>Includes mat, blocks and video guide</p>
//                 <div className="flex justify-between items-center">
//                   <span className="font-bold text-pink-600 dark:text-pink-300">₹1,200</span>
//                   <button className="px-3 py-1 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors">View</button>
//                 </div>
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`p-4 ${darkMode ? "bg-yellow-900" : "bg-yellow-50"} rounded-lg text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} flex items-center`}>
//               <span className={`${darkMode ? "text-yellow-300" : "text-yellow-600"}`} style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>ℹ️</span>
//               <p>These are suggestions only. Always consult with your healthcare provider before starting any new supplements.</p>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "reminders":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-cyan-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-cyan-800 dark:text-cyan-200">Reminders & Follow-ups 📅</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.reminders || "No reminders set."}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md`}>
//                 <h4 className="font-bold text-lg mb-4 text-cyan-700 dark:text-cyan-300 flex items-center">
//                   <FaCalendarCheck className="mr-2" /> Upcoming Appointments
//                 </h4>
//                 <ul className="space-y-3">
//                   <li className={`flex items-center p-3 rounded-lg ${darkMode ? "bg-cyan-900" : "bg-cyan-50"}`}>
//                     <div className={`flex-shrink-0 w-12 h-12 rounded-full ${darkMode ? "bg-cyan-800" : "bg-cyan-100"} flex items-center justify-center mr-4`}>
//                       <span className={`font-bold ${darkMode ? "text-cyan-300" : "text-cyan-600"}`}>28</span>
//                     </div>
//                     <div>
//                       <h5 className="font-medium">Hematologist Follow-up</h5>
//                       <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>April 28, 2025 • 10:30 AM</p>
//                     </div>
//                   </li>
//                   <li className={`flex items-center p-3 rounded-lg ${darkMode ? "bg-cyan-900" : "bg-cyan-50"}`}>
//                     <div className={`flex-shrink-0 w-12 h-12 rounded-full ${darkMode ? "bg-cyan-800" : "bg-cyan-100"} flex items-center justify-center mr-4`}>
//                       <span className={`font-bold ${darkMode ? "text-cyan-300" : "text-cyan-600"}`}>15</span>
//                     </div>
//                     <div>
//                       <h5 className="font-medium">Blood Test</h5>
//                       <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>May 15, 2025 • 8:00 AM</p>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
              
//               <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md`}>
//                 <h4 className="font-bold text-lg mb-4 text-cyan-700 dark:text-cyan-300 flex items-center">
//                   <FaClipboardList className="mr-2" /> Medication Reminders
//                 </h4>
//                 <ul className="space-y-3">
//                   <li className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? "bg-cyan-900" : "bg-cyan-50"}`}>
//                     <div>
//                       <h5 className="font-medium">Iron Supplement</h5>
//                       <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Twice daily with meals</p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className={`text-xs px-2 py-1 ${darkMode ? "bg-cyan-800 text-cyan-200" : "bg-cyan-100 text-cyan-800"} rounded-full`}>8:00 AM</span>
//                       <span className={`text-xs px-2 py-1 ${darkMode ? "bg-cyan-800 text-cyan-200" : "bg-cyan-100 text-cyan-800"} rounded-full`}>8:00 PM</span>
//                     </div>
//                   </li>
//                   <li className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? "bg-cyan-900" : "bg-cyan-50"}`}>
//                     <div>
//                       <h5 className="font-medium">Vitamin B12</h5>
//                       <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Once daily in the morning</p>
//                     </div>
//                     <div className="flex items-center">
//                       <span className={`text-xs px-2 py-1 ${darkMode ? "bg-cyan-800 text-cyan-200" : "bg-cyan-100 text-cyan-800"} rounded-full`}>8:00 AM</span>
//                     </div>
//                   </li>
//                 </ul>
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`p-5 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md`}>
//               <h4 className="font-bold text-lg mb-4 text-cyan-700 dark:text-cyan-300 flex items-center">
//                 <FaHeartbeat className="mr-2" /> Symptom Tracker
//               </h4>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className={`p-3 rounded-lg ${darkMode ? "bg-cyan-900" : "bg-cyan-50"} text-center`}>
//                   <div className={`w-10 h-10 rounded-full ${darkMode ? "bg-cyan-800" : "bg-cyan-100"} mx-auto mb-2 flex items-center justify-center`}>
//                     <span className={darkMode ? "text-cyan-300" : "text-cyan-600"} style={{ fontSize: "1.5rem" }}>😊</span>
//                   </div>
//                   <p className="text-sm">Energy Level</p>
//                 </div>
//                 <div className={`p-3 rounded-lg ${darkMode ? "bg-cyan-900" : "bg-cyan-50"} text-center`}>
//                   <div className={`w-10 h-10 rounded-full ${darkMode ? "bg-cyan-800" : "bg-cyan-100"} mx-auto mb-2 flex items-center justify-center`}>
//                     <span className={darkMode ? "text-cyan-300" : "text-cyan-600"} style={{ fontSize: "1.5rem" }}>💓</span>
//                   </div>
//                   <p className="text-sm">Heart Rate</p>
//                 </div>
//                 <div className={`p-3 rounded-lg ${darkMode ? "bg-cyan-900" : "bg-cyan-50"} text-center`}>
//                   <div className={`w-10 h-10 rounded-full ${darkMode ? "bg-cyan-800" : "bg-cyan-100"} mx-auto mb-2 flex items-center justify-center`}>
//                     <span className={darkMode ? "text-cyan-300" : "text-cyan-600"} style={{ fontSize: "1.5rem" }}>😴</span>
//                   </div>
//                   <p className="text-sm">Sleep Quality</p>
//                 </div>
//                 <div className={`p-3 rounded-lg ${darkMode ? "bg-cyan-900" : "bg-cyan-50"} text-center`}>
//                   <div className={`w-10 h-10 rounded-full ${darkMode ? "bg-cyan-800" : "bg-cyan-100"} mx-auto mb-2 flex items-center justify-center`}>
//                     <span className={darkMode ? "text-cyan-300" : "text-cyan-600"} style={{ fontSize: "1.5rem" }}>➕</span>
//                   </div>
//                   <p className="text-sm">Add Custom</p>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "motivation":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="flex flex-col items-center justify-center min-h-[60vh]"
//           >
//             <motion.div 
//               variants={itemVariants}
//               className={`p-8 rounded-xl ${darkMode ? "bg-gradient-to-br from-pink-900 to-purple-900" : "bg-gradient-to-br from-pink-50 to-purple-100"} shadow-lg text-center max-w-2xl`}
//             >
//               <div className={`w-20 h-20 rounded-full ${darkMode ? "bg-pink-800" : "bg-pink-100"} mx-auto mb-6 flex items-center justify-center`}>
//                 <FaHeartbeat className={`text-3xl ${darkMode ? "text-pink-300" : "text-pink-600"}`} />
//               </div>
//               <h3 className="text-2xl font-bold mb-6 text-pink-800 dark:text-pink-200">Motivational Note ❣️</h3>
//               <div className={`text-lg italic ${darkMode ? "text-gray-300" : "text-gray-700"} mb-8 whitespace-pre-wrap`}>
//                 {parsedData.motivationalNote || "You're doing great! Keep up the good work on your health journey."}
//               </div>
//               <div className={`w-full h-1 ${darkMode ? "bg-gradient-to-r from-pink-500 to-purple-600" : "bg-gradient-to-r from-pink-400 to-purple-500"} rounded-full mb-6`}></div>
//               <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//                 Remember, every small step you take towards better health is a victory. Keep going!
//               </p>
//             </motion.div>
            
//             <motion.div 
//               variants={itemVariants}
//               className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
//             >
//               <button className={`px-6 py-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all flex flex-col items-center`}>
//                 <FaGift className={`text-xl mb-2 ${darkMode ? "text-pink-300" : "text-pink-600"}`} />
//                 <span>Rewards</span>
//               </button>
//               <button className={`px-6 py-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all flex flex-col items-center`}>
//                 <FaLeaf className={`text-xl mb-2 ${darkMode ? "text-green-300" : "text-green-600"}`} />
//                 <span>Wellness</span>
//               </button>
//               <button className={`px-6 py-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all flex flex-col items-center`}>
//                 <FaPills className={`text-xl mb-2 ${darkMode ? "text-blue-300" : "text-blue-600"}`} />
//                 <span>Medication</span>
//               </button>
//               <button className={`px-6 py-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all flex flex-col items-center`}>
//                 <FaUtensils className={`text-xl mb-2 ${darkMode ? "text-amber-300" : "text-amber-600"}`} />
//                 <span>Nutrition</span>
//               </button>
//             </motion.div>
//           </motion.div>
//         );
        
//       default:
//         return null;
//     }
//   };
  
//   const sections = [
//     { id: "summary", label: "Summary", icon: <FaClipboardList /> },
//     { id: "doctor", label: "Doctor Advice", icon: <FaHeartbeat /> },
//     { id: "diet", label: "Diet Plan", icon: <FaUtensils /> },
//     { id: "exercise", label: "Exercise", icon: <FaDumbbell /> },
//     { id: "lifestyle", label: "Lifestyle", icon: <FaLeaf /> },
//     { id: "supplements", label: "Supplements", icon: <FaPills /> },
//     { id: "products", label: "Products", icon: <FaGift /> },
//     { id: "reminders", label: "Reminders", icon: <FaCalendarCheck /> },
//     { id: "motivation", label: "Motivation", icon: <FaHeartbeat /> }
//   ];
  
//   const currentIndex = sections.findIndex(section => section.id === currentSection);
//   const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1].id : null;
//   const prevSection = currentIndex > 0 ? sections[currentIndex - 1].id : null;
  
//   return (
//     <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
//       {/* Header */}
//       <header className={`sticky top-0 z-10 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={() => navigate("/")}
//               className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
//             >
//               <FaHome className="text-lg" />
//             </button>
//             <h1 className="text-xl font-bold">Health Dashboard</h1>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={() => setDarkMode(!darkMode)}
//               className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
//             >
//               {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
//             </button>
            
//             <button 
//               onClick={downloadReport}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
//             >
//               <FaDownload />
//               <span>Download Report</span>
//             </button>
//           </div>
//         </div>
//       </header>
      
//       {/* Navigation */}
//       <nav className={`sticky top-16 z-10 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
//         <div className="container mx-auto px-4 overflow-x-auto">
//           <div className="flex space-x-1 py-2">
//             {sections.map(section => (
//               <button
//                 key={section.id}
//                 onClick={() => setCurrentSection(section.id)}
//                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
//                   currentSection === section.id 
//                   ? darkMode 
//                     ? "bg-blue-600 text-white" 
//                     : "bg-blue-500 text-white"
//                   : darkMode 
//                     ? "hover:bg-gray-700" 
//                     : "hover:bg-gray-100"
//                 }`}
//               >
//                 {section.icon}
//                 <span>{section.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </nav>
//             {/* Main Content */}
//             <main className="container mx-auto px-4 py-8">
//         <div 
//           ref={dashboardRef} 
//           className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
//         >
//           {/* Navigation Arrows for Mobile */}
//           <div className="md:hidden flex justify-between mb-6">
//             <button
//               onClick={() => prevSection && setCurrentSection(prevSection)}
//               disabled={!prevSection}
//               className={`flex items-center px-4 py-2 rounded-lg ${
//                 prevSection 
//                   ? darkMode 
//                     ? "bg-gray-700 hover:bg-gray-600" 
//                     : "bg-gray-200 hover:bg-gray-300"
//                   : darkMode 
//                     ? "bg-gray-800 text-gray-600" 
//                     : "bg-gray-100 text-gray-400"
//               }`}
//             >
//               <FaArrowLeft className="mr-2" />
//               Previous
//             </button>
            
//             <button
//               onClick={() => nextSection && setCurrentSection(nextSection)}
//               disabled={!nextSection}
//               className={`flex items-center px-4 py-2 rounded-lg ${
//                 nextSection 
//                   ? darkMode 
//                     ? "bg-gray-700 hover:bg-gray-600" 
//                     : "bg-gray-200 hover:bg-gray-300"
//                   : darkMode 
//                     ? "bg-gray-800 text-gray-600" 
//                     : "bg-gray-100 text-gray-400"
//               }`}
//             >
//               Next
//               <FaArrowRight className="ml-2" />
//             </button>
//           </div>
          
//           {/* Current Section Content */}
//           {renderContent()}
          
//           {/* Navigation Arrows for Desktop */}
//           <div className="hidden md:flex justify-between mt-8">
//             <button
//               onClick={() => prevSection && setCurrentSection(prevSection)}
//               disabled={!prevSection}
//               className={`flex items-center px-6 py-3 rounded-lg ${
//                 prevSection 
//                   ? darkMode 
//                     ? "bg-gray-700 hover:bg-gray-600" 
//                     : "bg-gray-200 hover:bg-gray-300"
//                   : darkMode 
//                     ? "bg-gray-800 text-gray-600" 
//                     : "bg-gray-100 text-gray-400"
//               }`}
//             >
//               <FaArrowLeft className="mr-2" />
//               Previous: {prevSection ? sections.find(s => s.id === prevSection).label : "None"}
//             </button>
            
//             <button
//               onClick={() => nextSection && setCurrentSection(nextSection)}
//               disabled={!nextSection}
//               className={`flex items-center px-6 py-3 rounded-lg ${
//                 nextSection 
//                   ? darkMode 
//                     ? "bg-gray-700 hover:bg-gray-600" 
//                     : "bg-gray-200 hover:bg-gray-300"
//                   : darkMode 
//                     ? "bg-gray-800 text-gray-600" 
//                     : "bg-gray-100 text-gray-400"
//               }`}
//             >
//               Next: {nextSection ? sections.find(s => s.id === nextSection).label : "None"}
//               <FaArrowRight className="ml-2" />
//             </button>
//           </div>
//         </div>
//       </main>
      
//       {/* Footer */}
//       <footer className={`py-6 ${darkMode ? "bg-gray-800" : "bg-gray-100"} mt-8`}>
//         <div className="container mx-auto px-4 text-center">
//           <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//             © {new Date().getFullYear()} Health Dashboard. This report is generated by AI and should not replace professional medical advice.
//           </p>
//           <div className="mt-2 flex justify-center space-x-4">
//             <button 
//               onClick={() => navigate("/privacy")} 
//               className={`text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
//             >
//               Privacy Policy
//             </button>
//             <button 
//               onClick={() => navigate("/terms")} 
//               className={`text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
//             >
//               Terms of Service
//             </button>
//             <button 
//               onClick={() => navigate("/contact")} 
//               className={`text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
//             >
//               Contact Us
//             </button>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default HDashboard;

// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// // Icons
// import { 
//   FaSun, FaMoon, FaDownload, FaHome, FaClipboardList, 
//   FaUtensils, FaDumbbell, FaLeaf, FaPills, FaHeartbeat, 
//   FaCalendarCheck, FaGift, FaArrowLeft, FaArrowRight,
//   FaChartBar, FaChartLine, FaChartPie
// } from "react-icons/fa";

// const HDashboard = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const reportData = location.state?.reportData || { summary: "", rawText: "" };
//   const [darkMode, setDarkMode] = useState(false);
//   const [currentSection, setCurrentSection] = useState("summary");
//   const [dietType, setDietType] = useState("vegetarian");
//   const dashboardRef = useRef(null);
  
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
    
//     // Extract all numerical values from the report for visualization
//     const extractNumericalValues = (text) => {
//       const bloodParams = [];
//       const regex = /(\w[\w\s]*)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)-([\d.]+)\s*([^\s|]+)/g;
//       let match;
      
//       while ((match = regex.exec(text)) !== null) {
//         bloodParams.push({
//           name: match[1].trim(),
//           value: parseFloat(match[2]),
//           min: parseFloat(match[3]),
//           max: parseFloat(match[4]),
//           unit: match[5].trim()
//         });
//       }
      
//       return bloodParams;
//     };
    
//     const extractNutritionData = (text) => {
//       const nutrition = [];
//       const nutrients = ["Iron", "Vitamin B12", "Folate", "Vitamin C", "Calcium"];
      
//       nutrients.forEach(nutrient => {
//         if (text.includes(nutrient)) {
//           nutrition.push({
//             category: nutrient,
//             percentage: Math.floor(Math.random() * 30) + 40 // Random for demo
//           });
//         }
//       });
      
//       return nutrition;
//     };
    
//     const parsed = {
//       healthSummary: extractSection(text, "A. Health Summary 🩺", "✅ Good News") || text,
//       goodNews: extractSection(text, "✅ Good News", "⚠️ Areas of Concern"),
//       areasOfConcern: extractSection(text, "⚠️ Areas of Concern", "B. Red Flags & Concerns ⚠️"),
//       redFlags: extractSection(text, "B. Red Flags & Concerns ⚠️", "C. Simulated Doctor Advice 👨‍⚕️"),
//       doctorAdvice: extractSection(text, "C. Simulated Doctor Advice 👨‍⚕️", "D. 7-Day Diet Plan 🍽️"),
//       dietPlan: {
//         vegetarian: extractSection(text, "🥬 Vegetarian", "🍗 Non-Vegetarian"),
//         nonVegetarian: extractSection(text, "🍗 Non-Vegetarian", "E. 7-Day Exercise Plan 🏃")
//       },
//       exercisePlan: extractSection(text, "E. 7-Day Exercise Plan 🏃", "F. Lifestyle Tips 🌿"),
//       lifestyleTips: extractSection(text, "F. Lifestyle Tips 🌿", "G. Supplements & Food Suggestions 💊"),
//       supplements: extractSection(text, "G. Supplements & Food Suggestions 💊", "H. Health Product Suggestions (Optional) 🏥"),
//       healthProducts: extractSection(text, "H. Health Product Suggestions (Optional) 🏥", "I. Reminders & Follow-ups 🔁"),
//       reminders: extractSection(text, "I. Reminders & Follow-ups 🔁", "❣️ L. Motivational Note"),
//       motivationalNote: extractSection(text, "❣️ L. Motivational Note", ""),
//       visualData: {
//         bloodParameters: extractNumericalValues(text),
//         nutritionData: extractNutritionData(text),
//         vitalSigns: [
//           { date: "Apr 1", bp: "120/80", pulse: 72, spo2: 98 },
//           { date: "Apr 3", bp: "118/78", pulse: 70, spo2: 99 },
//           { date: "Apr 5", bp: "122/82", pulse: 74, spo2: 97 },
//           { date: "Apr 7", bp: "124/84", pulse: 76, spo2: 98 },
//           { date: "Apr 9", bp: "120/80", pulse: 72, spo2: 98 }
//         ]
//       }
//     };
    
//     setParsedData(parsed);
//   };
  
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
  
//   const downloadReport = async () => {
//     if (!dashboardRef.current) return;
    
//     try {
//       const loadingToast = document.createElement("div");
//       loadingToast.className = "fixed top-5 right-5 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50";
//       loadingToast.innerText = "Generating PDF...";
//       document.body.appendChild(loadingToast);
      
//       const pdf = new jsPDF("p", "mm", "a4");
//       const content = dashboardRef.current;
      
//       const originalDarkMode = darkMode;
//       setDarkMode(false);
      
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       const canvas = await html2canvas(content, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: "#ffffff"
//       });
      
//       const imgData = canvas.toDataURL("image/png");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
//       setDarkMode(originalDarkMode);
//       pdf.save("Health_Report.pdf");
//       document.body.removeChild(loadingToast);
      
//       const successToast = document.createElement("div");
//       successToast.className = "fixed top-5 right-5 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50";
//       successToast.innerText = "Report downloaded successfully!";
//       document.body.appendChild(successToast);
      
//       setTimeout(() => document.body.removeChild(successToast), 3000);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
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
    
//     const rows = content
//       .split("\n")
//       .filter(row => row.includes("|"))
//       .map(row => row.trim());
      
//     if (rows.length < 2) return null;
    
//     const headers = rows[0].split("|").filter(cell => cell.trim()).map(cell => cell.trim());
    
//     return (
//       <div className="overflow-x-auto mt-4">
//         <table className={`min-w-full divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
//           <thead className={darkMode ? "bg-gray-800" : "bg-gray-50"}>
//             <tr>
//               {headers.map((header, idx) => (
//                 <th key={idx} scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
//             {rows.slice(2).map((row, rowIdx) => {
//               const cells = row.split("|").filter(cell => cell.trim()).map(cell => cell.trim());
              
//               return (
//                 <tr key={rowIdx} className={rowIdx % 2 === 0 ? (darkMode ? "bg-gray-900" : "bg-white") : (darkMode ? "bg-gray-800" : "bg-gray-50")}>
//                   {cells.map((cell, cellIdx) => (
//                     <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm">
//                       {cell}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     );
//   };
  
//   const renderList = (content) => {
//     if (!content) return null;
    
//     const listItems = content
//       .split("\n")
//       .filter(line => line.trim().startsWith("* ") || line.trim().startsWith("- "))
//       .map(line => line.replace(/^\*\s|-\s/, "").trim());
      
//     return (
//       <ul className="list-disc pl-5 space-y-2 mt-4">
//         {listItems.map((item, idx) => (
//           <li key={idx} className="text-sm md:text-base">{item}</li>
//         ))}
//       </ul>
//     );
//   };
  
//   const ProgressBar = ({ value, min, max, label, unit }) => {
//     const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    
//     let statusColor = darkMode ? "bg-blue-400" : "bg-blue-500";
//     if (percentage < 25) statusColor = darkMode ? "bg-red-400" : "bg-red-500";
//     if (percentage > 75) statusColor = darkMode ? "bg-green-400" : "bg-green-500";
    
//     return (
//       <div className="mb-4">
//         <div className="flex justify-between mb-1">
//           <span className="text-sm font-medium">{label}</span>
//           <span className="text-sm font-medium">{value} {unit}</span>
//         </div>
//         <div className={`w-full h-2.5 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-full`}>
//           <div 
//             className={`h-2.5 rounded-full ${statusColor}`} 
//             style={{ width: `${percentage}%` }}
//           ></div>
//         </div>
//         <div className="flex justify-between text-xs mt-1">
//           <span>{min}</span>
//           <span>{max}</span>
//         </div>
//       </div>
//     );
//   };
  
//   const renderContent = () => {
//     switch (currentSection) {
//       case "summary":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-blue-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">Health Summary</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.healthSummary || "No health summary available."}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-green-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-300">Good News</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.goodNews || "No good news to report."}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300">Areas of Concern</h3>
//               {parsedData.areasOfConcern ? (
//                 renderTable(parsedData.areasOfConcern) || 
//                 <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                   {parsedData.areasOfConcern}
//                 </div>
//               ) : (
//                 <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No areas of concern identified.</p>
//               )}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-purple-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-300">Red Flags & Concerns</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.redFlags || "No red flags identified."}
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "doctor":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-indigo-50"} shadow-md`}
//           >
//             <motion.h3 variants={itemVariants} className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">Doctor Advice</motion.h3>
//             <motion.div variants={itemVariants} className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//               {parsedData.doctorAdvice || "No specific doctor advice available."}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="mt-8">
//               <h4 className="text-lg font-semibold mb-4 text-indigo-700 dark:text-indigo-300">Request Appointment</h4>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300`}>
//                   <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-indigo-900" : "bg-indigo-100"} flex items-center justify-center mb-2`}>
//                     <span className={darkMode ? "text-indigo-300" : "text-indigo-600"}>📱</span>
//                   </div>
//                   <h5 className="font-medium">Call Doctor</h5>
//                 </div>
//                 <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300`}>
//                   <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-blue-900" : "bg-blue-100"} flex items-center justify-center mb-2`}>
//                     <span className={darkMode ? "text-blue-300" : "text-blue-600"}>📅</span>
//                   </div>
//                   <h5 className="font-medium">Book Online</h5>
//                 </div>
//                 <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300`}>
//                   <div className={`w-12 h-12 rounded-full ${darkMode ? "bg-green-900" : "bg-green-100"} flex items-center justify-center mb-2`}>
//                     <span className={darkMode ? "text-green-300" : "text-green-600"}>💬</span>
//                   </div>
//                   <h5 className="font-medium">Message</h5>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "diet":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-teal-700 dark:text-teal-300">7-Day Diet Plan</h3>
//               <div className={`flex items-center space-x-2 p-1 rounded-full ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
//                 <button 
//                   onClick={() => setDietType("vegetarian")}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                     dietType === "vegetarian" 
//                     ? "bg-teal-600 text-white" 
//                     : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Vegetarian
//                 </button>
//                 <button 
//                   onClick={() => setDietType("nonVegetarian")}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                     dietType === "nonVegetarian" 
//                     ? "bg-teal-600 text-white" 
//                     : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Non-Vegetarian
//                 </button>
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//               {dietType === "vegetarian" ? (
//                 renderTable(parsedData.dietPlan.vegetarian) || 
//                 <div className="p-6 text-center text-gray-500 dark:text-gray-400">
//                   No vegetarian diet plan available.
//                 </div>
//               ) : (
//                 renderTable(parsedData.dietPlan.nonVegetarian) || 
//                 <div className="p-6 text-center text-gray-500 dark:text-gray-400">
//                   No non-vegetarian diet plan available.
//                 </div>
//               )}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-teal-50"} text-sm italic ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//               Remember to consult a dietitian or nutritionist for a personalized plan. Adjust portion sizes as per your needs.
//             </motion.div>
//           </motion.div>
//         );
        
//       case "exercise":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-orange-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-orange-700 dark:text-orange-300">7-Day Exercise Plan</h3>
//               {parsedData.exercisePlan ? (
//                 renderTable(parsedData.exercisePlan) || 
//                 <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                   {parsedData.exercisePlan}
//                 </div>
//               ) : (
//                 <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No exercise plan available.</p>
//               )}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center`}>
//                 <div className={`w-16 h-16 rounded-full ${darkMode ? "bg-orange-900" : "bg-orange-100"} flex items-center justify-center mb-3`}>
//                   <span className={darkMode ? "text-orange-300" : "text-orange-600"} style={{ fontSize: "2rem" }}>🧘‍♀️</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Yoga Resources</h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Access beginner-friendly yoga routines</p>
//               </div>
              
//               <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center`}>
//                 <div className={`w-16 h-16 rounded-full ${darkMode ? "bg-orange-900" : "bg-orange-100"} flex items-center justify-center mb-3`}>
//                   <span className={darkMode ? "text-orange-300" : "text-orange-600"} style={{ fontSize: "2rem" }}>👟</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Walking Tracker</h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Track your daily walking progress</p>
//               </div>
              
//               <div className={`p-5 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center`}>
//                 <div className={`w-16 h-16 rounded-full ${darkMode ? "bg-orange-900" : "bg-orange-100"} flex items-center justify-center mb-3`}>
//                   <span className={darkMode ? "text-orange-300" : "text-orange-600"} style={{ fontSize: "2rem" }}>🏊‍♀️</span>
//                 </div>
//                 <h4 className="font-semibold mb-2">Swimming Guide</h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Low-impact exercise for energy conservation</p>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "lifestyle":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-8"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-teal-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-teal-700 dark:text-teal-300">Lifestyle Tips</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.lifestyleTips || "No lifestyle tips available."}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className={`p-5 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md border-l-4 border-blue-500`}>
//                 <h4 className="flex items-center font-semibold text-blue-700 dark:text-blue-300 mb-2">
//                   <span className="mr-2">💧</span> Hydration
//                 </h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Track your daily water intake with this handy chart</p>
//                 <div className="mt-3 flex justify-center">
//                   <div className={`w-full h-6 ${darkMode ? "bg-gray-600" : "bg-gray-200"} rounded-full overflow-hidden`}>
//                     <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
//                   </div>
//                 </div>
//                 <div className={`mt-1 text-xs text-center ${darkMode ? "text-gray-500" : "text-gray-500"}`}>4/8 glasses today</div>
//               </div>
              
//               <div className={`p-5 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md border-l-4 border-indigo-500`}>
//                 <h4 className="flex items-center font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
//                   <span className="mr-2">💤</span> Sleep Quality
//                 </h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Monitor your sleep patterns for better recovery</p>
//                 <div className="mt-3 flex justify-center">
//                   <div className={`w-full h-6 ${darkMode ? "bg-gray-600" : "bg-gray-200"} rounded-full overflow-hidden`}>
//                     <div className="h-full bg-indigo-500 rounded-full" style={{ width: "65%" }}></div>
//                   </div>
//                 </div>
//                 <div className={`mt-1 text-xs text-center ${darkMode ? "text-gray-500" : "text-gray-500"}`}>6.5/8 hours last night</div>
//               </div>
              
//               <div className={`p-5 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md border-l-4 border-purple-500`}>
//                 <h4 className="flex items-center font-semibold text-purple-700 dark:text-purple-300 mb-2">
//                   <span className="mr-2">🧠</span> Stress Management
//                 </h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Access meditation and relaxation techniques</p>
//                 <div className="mt-3 flex justify-center space-x-2">
//                   <button className={`text-xs px-3 py-1 ${darkMode ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-700"} rounded-full`}>Meditation</button>
//                   <button className={`text-xs px-3 py-1 ${darkMode ? "bg-purple-900 text-purple-300" : "bg-purple-100 text-purple-700"} rounded-full`}>Breathing</button>
//                 </div>
//               </div>
              
//               <div className={`p-5 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md border-l-4 border-teal-500`}>
//                 <h4 className="flex items-center font-semibold text-teal-700 dark:text-teal-300 mb-2">
//                   <span className="mr-2">🍎</span> Nutrition Balance
//                 </h4>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Check your daily nutrient intake balance</p>
//                 <div className="mt-3 flex justify-center">
//                   <div className="w-full grid grid-cols-5 gap-1">
//                     {['Protein', 'Carbs', 'Fats', 'Fiber', 'Vitamins'].map((item, idx) => (
//                       <div key={idx} className="flex flex-col items-center">
//                         <div className={`w-6 h-16 ${darkMode ? "bg-gray-600" : "bg-gray-200"} rounded-full overflow-hidden`}>
//                           <div 
//                             className="w-full bg-teal-500 rounded-full" 
//                             style={{ height: `${[70, 50, 60, 40, 80][idx]}%`, marginTop: `${100 - [70, 50, 60, 40, 80][idx]}%` }}
//                           ></div>
//                         </div>
//                         <span className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{item.substring(0, 3)}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "supplements":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-pink-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-pink-700 dark:text-pink-300">Supplements & Food Suggestions</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.supplements || "No supplement recommendations available."}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"} shadow-md`}>
//                 <h4 className="text-lg font-semibold mb-4 flex items-center">
//                   <FaPills className={`mr-2 ${darkMode ? "text-pink-400" : "text-pink-600"}`} /> 
//                   Recommended Supplements
//                 </h4>
//                 {renderList(parsedData.supplements) || (
//                   <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//                     No specific supplement recommendations available.
//                   </p>
//                 )}
//               </div>
              
//               <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-50"} shadow-md`}>
//                 <h4 className="text-lg font-semibold mb-4 flex items-center">
//                   <FaUtensils className={`mr-2 ${darkMode ? "text-green-400" : "text-green-600"}`} /> 
//                   Recommended Foods
//                 </h4>
//                 <div className="grid grid-cols-2 gap-3">
//                   {["Spinach", "Almonds", "Lentils", "Oranges", "Salmon", "Berries"].map((food, idx) => (
//                     <div key={idx} className={`flex items-center p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-sm`}>
//                       <span className="text-lg mr-2">{["🍃", "🥜", "🥣", "🍊", "🐟", "🍓"][idx]}</span>
//                       <span>{food}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "products":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-cyan-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-cyan-700 dark:text-cyan-300">Health Product Suggestions</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.healthProducts || "No health product suggestions available."}
//               </div>
//               <p className={`mt-4 text-sm italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
//                 Note: These are general suggestions. Always consult with your healthcare provider before purchasing any health products.
//               </p>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[
//                 { name: "Iron Plus Supplement", price: "$19.99", rating: 4.5, desc: "Includes Vitamin C for better absorption" },
//                 { name: "B12 Sublingual Drops", price: "$24.99", rating: 4.8, desc: "Helps with energy and RBC formation" },
//                 { name: "Folic Acid Complex", price: "$14.99", rating: 4.3, desc: "Essential for cell division and growth" }
//               ].map((product, idx) => (
//                 <div key={idx} className={`relative p-5 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} shadow-md hover:shadow-lg transition-all duration-300`}>
//                   <div className={`absolute top-3 right-3 ${darkMode ? "text-cyan-300" : "text-cyan-600"} text-xs font-bold px-2 py-1 bg-opacity-20 rounded-full ${darkMode ? "bg-cyan-900" : "bg-cyan-100"}`}>
//                     {"★".repeat(Math.floor(product.rating))} {product.rating % 1 === 0.5 ? "½" : ""}
//                   </div>
//                   <div className={`w-full h-32 mb-4 flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-gray-100"} rounded-lg`}>
//                     <span className="text-4xl">💊</span>
//                   </div>
//                   <h4 className="font-semibold text-lg mb-1">{product.name}</h4>
//                   <p className={`text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{product.desc}</p>
//                   <div className="flex justify-between items-center">
//                     <span className={`font-medium ${darkMode ? "text-cyan-300" : "text-cyan-700"}`}>{product.price}</span>
//                     <button className={`px-3 py-1 text-sm rounded-full ${darkMode ? "bg-cyan-900 text-cyan-300" : "bg-cyan-100 text-cyan-700"} hover:shadow-md transition-all duration-300`}>
//                       View
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </motion.div>
//           </motion.div>
//         );
        
//       case "reminders":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-yellow-50"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-4 text-yellow-700 dark:text-yellow-300">Reminders & Follow-ups</h3>
//               <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                 {parsedData.reminders || "No reminders set."}
//               </div>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
//                 <h4 className="text-lg font-semibold mb-4 flex items-center">
//                   <FaCalendarCheck className={`mr-2 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`} /> 
//                   Upcoming Appointments
//                 </h4>
//                 <div className="space-y-4">
//                   {[
//                     { date: "Tomorrow, 10:00 AM", doctor: "Dr. Smith - Cardiology", location: "City Medical Center" },
//                     { date: "April 15, 2:30 PM", doctor: "Dr. Johnson - Nutrition", location: "Wellness Clinic" }
//                   ].map((appt, idx) => (
//                     <div key={idx} className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-yellow-50"} border-l-4 border-yellow-500`}>
//                       <div className="font-medium">{appt.date}</div>
//                       <div className="text-sm">{appt.doctor}</div>
//                       <div className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{appt.location}</div>
//                     </div>
//                   ))}
//                 </div>
//                 <button className={`mt-4 w-full py-2 rounded-lg ${darkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-700"} hover:shadow-md transition-all duration-300`}>
//                   + Add New Appointment
//                 </button>
//               </div>
              
//               <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
//                 <h4 className="text-lg font-semibold mb-4 flex items-center">
//                   <FaClipboardList className={`mr-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`} /> 
//                   Medication Schedule
//                 </h4>
//                 <div className="space-y-3">
//                   {[
//                     { med: "Iron Supplement", time: "8:00 AM", dose: "1 tablet" },
//                     { med: "Vitamin B12", time: "12:00 PM", dose: "1 sublingual" },
//                     { med: "Multivitamin", time: "6:00 PM", dose: "1 capsule" }
//                   ].map((med, idx) => (
//                     <div key={idx} className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"} flex justify-between items-center`}>
//                       <div>
//                         <div className="font-medium">{med.med}</div>
//                         <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{med.dose}</div>
//                       </div>
//                       <div className={`px-3 py-1 rounded-full ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"} text-sm`}>
//                         {med.time}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <button className={`mt-4 w-full py-2 rounded-lg ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"} hover:shadow-md transition-all duration-300`}>
//                   + Add Medication
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "motivation":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-6"
//           >
//             <motion.div variants={itemVariants} className={`p-8 rounded-xl ${darkMode ? "bg-gradient-to-br from-purple-900 to-pink-900" : "bg-gradient-to-br from-purple-100 to-pink-100"} shadow-lg text-center`}>
//               <h3 className="text-2xl font-bold mb-4 text-white dark:text-white">Motivational Note</h3>
//               <div className={`text-lg ${darkMode ? "text-purple-200" : "text-purple-800"} italic mb-6`}>
//                 {parsedData.motivationalNote || "You're doing great! Every small step counts towards your health journey."}
//               </div>
//               <div className="text-5xl mb-6">💪</div>
//               <button className={`px-6 py-3 rounded-full ${darkMode ? "bg-white text-purple-900" : "bg-purple-600 text-white"} font-semibold hover:shadow-xl transition-all duration-300`}>
//                 Share Your Progress
//               </button>
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md text-center`}>
//                 <div className={`w-16 h-16 rounded-full ${darkMode ? "bg-green-900" : "bg-green-100"} flex items-center justify-center mx-auto mb-4`}>
//                   <FaHeartbeat className={`text-2xl ${darkMode ? "text-green-300" : "text-green-600"}`} />
//                 </div>
//                 <h4 className="text-lg font-semibold mb-2">Health Streak</h4>
//                 <p className={`text-3xl font-bold mb-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>7 days</p>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Keep going!</p>
//               </div>
              
//               <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md text-center`}>
//                 <div className={`w-16 h-16 rounded-full ${darkMode ? "bg-blue-900" : "bg-blue-100"} flex items-center justify-center mx-auto mb-4`}>
//                   <FaChartLine className={`text-2xl ${darkMode ? "text-blue-300" : "text-blue-600"}`} />
//                 </div>
//                 <h4 className="text-lg font-semibold mb-2">Progress</h4>
//                 <p className={`text-3xl font-bold mb-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>68%</p>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>towards your goals</p>
//               </div>
              
//               <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md text-center`}>
//                 <div className={`w-16 h-16 rounded-full ${darkMode ? "bg-yellow-900" : "bg-yellow-100"} flex items-center justify-center mx-auto mb-4`}>
//                   <FaGift className={`text-2xl ${darkMode ? "text-yellow-300" : "text-yellow-600"}`} />
//                 </div>
//                 <h4 className="text-lg font-semibold mb-2">Reward</h4>
//                 <p className={`text-3xl font-bold mb-2 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>1</p>
//                 <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>achievement unlocked</p>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       case "visuals":
//         return (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="space-y-8"
//           >
//             <motion.div variants={itemVariants} className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
//               <h3 className="text-xl font-bold mb-6 flex items-center">
//                 <FaChartBar className={`mr-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
//                 Blood Parameters Analysis
//               </h3>
              
//               {parsedData.visualData.bloodParameters.length > 0 ? (
//                 <div className="space-y-6">
//                   {parsedData.visualData.bloodParameters.slice(0, 5).map((param, idx) => (
//                     <ProgressBar 
//                       key={idx}
//                       value={param.value}
//                       min={param.min}
//                       max={param.max}
//                       label={param.name}
//                       unit={param.unit}
//                     />
//                   ))}
//                 </div>
//               ) : (
//                 <div className={`p-8 text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg`}>
//                   <p className={darkMode ? "text-gray-400" : "text-gray-600"}>No blood parameter data available for visualization.</p>
//                 </div>
//               )}
//             </motion.div>
            
//             <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
//                 <h4 className="text-lg font-semibold mb-6 flex items-center">
//                   <FaChartPie className={`mr-2 ${darkMode ? "text-green-400" : "text-green-600"}`} />
//                   Nutrition Status
//                 </h4>
                
//                 {parsedData.visualData.nutritionData.length > 0 ? (
//                   <div className="flex flex-wrap justify-center gap-4">
//                     {parsedData.visualData.nutritionData.map((nutrient, idx) => (
//                       <div key={idx} className="w-24 h-24 relative">
//                         <svg className="w-full h-full" viewBox="0 0 36 36">
//                           <path
//                             d="M18 2.0845
//                               a 15.9155 15.9155 0 0 1 0 31.831
//                               a 15.9155 15.9155 0 0 1 0 -31.831"
//                             fill="none"
//                             stroke={darkMode ? "#374151" : "#e5e7eb"}
//                             strokeWidth="3"
//                           />
//                           <path
//                             d="M18 2.0845
//                               a 15.9155 15.9155 0 0 1 0 31.831
//                               a 15.9155 15.9155 0 0 1 0 -31.831"
//                             fill="none"
//                             stroke={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][idx % 5]}
//                             strokeWidth="3"
//                             strokeDasharray={`${nutrient.percentage}, 100`}
//                           />
//                         </svg>
//                         <div className="absolute inset-0 flex flex-col items-center justify-center">
//                           <span className="text-xs">{nutrient.category}</span>
//                           <span className="font-bold">{nutrient.percentage}%</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className={`p-4 text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg`}>
//                     <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>No nutrition data available for visualization.</p>
//                   </div>
//                 )}
//               </div>
              
//               <div className={`p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
//                 <h4 className="text-lg font-semibold mb-6 flex items-center">
//                   <FaChartLine className={`mr-2 ${darkMode ? "text-red-400" : "text-red-600"}`} />
//                   Vital Signs Trend
//                 </h4>
                
//                 <div className="h-64">
//                   <div className="flex justify-between text-xs mb-2">
//                     <span>Date</span>
//                     <span>BP</span>
//                     <span>Pulse</span>
//                     <span>SpO2</span>
//                   </div>
                  
//                   <div className="space-y-3">
//                     {parsedData.visualData.vitalSigns.map((vital, idx) => (
//                       <div key={idx} className="grid grid-cols-4 gap-2 items-center">
//                         <span className="text-sm">{vital.date}</span>
//                         <span className={`text-sm font-medium ${vital.bp === "120/80" ? (darkMode ? "text-green-400" : "text-green-600") : (darkMode ? "text-yellow-400" : "text-yellow-600")}`}>
//                           {vital.bp}
//                         </span>
//                         <span className="text-sm">{vital.pulse}</span>
//                         <span className={`text-sm font-medium ${vital.spo2 >= 98 ? (darkMode ? "text-green-400" : "text-green-600") : (darkMode ? "text-blue-400" : "text-blue-600")}`}>
//                           {vital.spo2}%
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         );
        
//       default:
//         return null;
//     }
//   };
  
//   const navItems = [
//     { id: "summary", label: "Summary", icon: <FaClipboardList /> },
//     { id: "doctor", label: "Doctor Advice", icon: <FaHeartbeat /> },
//     { id: "diet", label: "Diet Plan", icon: <FaUtensils /> },
//     { id: "exercise", label: "Exercise", icon: <FaDumbbell /> },
//     { id: "lifestyle", label: "Lifestyle", icon: <FaLeaf /> },
//     { id: "supplements", label: "Supplements", icon: <FaPills /> },
//     { id: "products", label: "Products", icon: <FaGift /> },
//     { id: "reminders", label: "Reminders", icon: <FaCalendarCheck /> },
//     { id: "motivation", label: "Motivation", icon: <FaHeartbeat /> },
//     { id: "visuals", label: "Visual Data", icon: <FaChartBar /> }
//   ];
  
//   return (
//     <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold">Health Dashboard</h1>
//             <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//               Your personalized health report and recommendations
//             </p>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"} hover:shadow-md transition-all duration-300`}
//               aria-label="Toggle dark mode"
//             >
//               {darkMode ? <FaSun /> : <FaMoon />}
//             </button>
            
//             <button
//               onClick={downloadReport}
//               className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? "bg-blue-800 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-500"} text-white transition-all duration-300`}
//             >
//               <FaDownload className="mr-2" />
//               Download Report
//             </button>
            
//             <button
//               onClick={() => navigate("/")}
//               className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition-all duration-300`}
//             >
//               <FaHome className="mr-2" />
//               Home
//             </button>
//           </div>
//         </header>
        
//         {/* Main Content */}
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Sidebar Navigation */}
//           <aside className="lg:w-64 flex-shrink-0">
//             <nav className={`rounded-xl overflow-hidden shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//               <ul>                {navItems.map((item) => (
//                   <li key={item.id}>
//                     <button
//                       onClick={() => setCurrentSection(item.id)}
//                       className={`w-full flex items-center px-4 py-3 text-left transition-colors duration-200 ${
//                         currentSection === item.id
//                           ? darkMode
//                             ? "bg-blue-900 text-blue-100"
//                             : "bg-blue-100 text-blue-800"
//                           : darkMode
//                           ? "hover:bg-gray-700 text-gray-300"
//                           : "hover:bg-gray-100 text-gray-700"
//                       }`}
//                     >
//                       <span className="mr-3">{item.icon}</span>
//                       <span>{item.label}</span>
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </nav>

//             {/* Quick Stats */}
//             <div className={`mt-6 p-4 rounded-xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//               <h3 className="font-semibold mb-3 flex items-center">
//                 <FaChartBar className="mr-2" />
//                 Quick Stats
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm">Health Score</span>
//                   <span className="font-medium">82/100</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm">Improvement</span>
//                   <span className="font-medium text-green-500">+12%</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm">Recommendations</span>
//                   <span className="font-medium">8</span>
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* Main Dashboard Content */}
//           <main className="flex-1" ref={dashboardRef}>
//             {/* Navigation Arrows for Mobile */}
//             <div className="flex justify-between mb-6 lg:hidden">
//               <button
//                 onClick={() => {
//                   const currentIndex = navItems.findIndex(item => item.id === currentSection);
//                   const prevIndex = (currentIndex - 1 + navItems.length) % navItems.length;
//                   setCurrentSection(navItems[prevIndex].id);
//                 }}
//                 className={`p-3 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition-colors duration-300`}
//               >
//                 <FaArrowLeft />
//               </button>
              
//               <h2 className="text-xl font-semibold self-center">
//                 {navItems.find(item => item.id === currentSection)?.label}
//               </h2>
              
//               <button
//                 onClick={() => {
//                   const currentIndex = navItems.findIndex(item => item.id === currentSection);
//                   const nextIndex = (currentIndex + 1) % navItems.length;
//                   setCurrentSection(navItems[nextIndex].id);
//                 }}
//                 className={`p-3 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition-colors duration-300`}
//               >
//                 <FaArrowRight />
//               </button>
//             </div>

//             {/* Dashboard Content */}
//             {renderContent()}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HDashboard;


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
    
//     // Extract all numerical values from the report for visualization
//     const extractNumericalValues = (text) => {
//       const bloodParams = [];
//       const regex = /(\w[\w\s]*)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)-([\d.]+)\s*([^\s|]+)/g;
//       let match;
      
//       while ((match = regex.exec(text)) !== null) {
//         bloodParams.push({
//           name: match[1].trim(),
//           value: parseFloat(match[2]),
//           min: parseFloat(match[3]),
//           max: parseFloat(match[4]),
//           unit: match[5].trim()
//         });
//       }
      
//       return bloodParams;
//     };
    
//     const extractNutritionData = (text) => {
//       const nutrition = [];
//       const nutrients = ["Iron", "Vitamin B12", "Folate", "Vitamin C", "Calcium"];
      
//       nutrients.forEach(nutrient => {
//         if (text.includes(nutrient)) {
//           nutrition.push({
//             category: nutrient,
//             percentage: Math.floor(Math.random() * 30) + 40 // Random for demo
//           });
//         }
//       });
      
//       return nutrition;
//     };
    
//     const parsed = {
//       healthSummary: extractSection(text, "A. Health Summary 🩺", "✅ Good News") || text,
//       goodNews: extractSection(text, "✅ Good News", "⚠️ Areas of Concern"),
//       areasOfConcern: extractSection(text, "⚠️ Areas of Concern", "B. Red Flags & Concerns ⚠️"),
//       redFlags: extractSection(text, "B. Red Flags & Concerns ⚠️", "C. Simulated Doctor Advice 👨‍⚕️"),
//       doctorAdvice: extractSection(text, "C. Simulated Doctor Advice 👨‍⚕️", "D. 7-Day Diet Plan 🍽️"),
//       dietPlan: {
//         vegetarian: extractSection(text, "🥬 Vegetarian", "🍗 Non-Vegetarian"),
//         nonVegetarian: extractSection(text, "🍗 Non-Vegetarian", "E. 7-Day Exercise Plan 🏃")
//       },
//       exercisePlan: extractSection(text, "E. 7-Day Exercise Plan 🏃", "F. Lifestyle Tips 🌿"),
//       lifestyleTips: extractSection(text, "F. Lifestyle Tips 🌿", "G. Supplements & Food Suggestions 💊"),
//       supplements: extractSection(text, "G. Supplements & Food Suggestions 💊", "H. Health Product Suggestions (Optional) 🏥"),
//       healthProducts: extractSection(text, "H. Health Product Suggestions (Optional) 🏥", "I. Reminders & Follow-ups 🔁"),
//       reminders: extractSection(text, "I. Reminders & Follow-ups 🔁", "❣️ L. Motivational Note"),
//       motivationalNote: extractSection(text, "❣️ L. Motivational Note", ""),
//       visualData: {
//         bloodParameters: extractNumericalValues(text),
//         nutritionData: extractNutritionData(text),
//         vitalSigns: [
//           { date: "Apr 1", bp: "120/80", pulse: 72, spo2: 98 },
//           { date: "Apr 3", bp: "118/78", pulse: 70, spo2: 99 },
//           { date: "Apr 5", bp: "122/82", pulse: 74, spo2: 97 },
//           { date: "Apr 7", bp: "124/84", pulse: 76, spo2: 98 },
//           { date: "Apr 9", bp: "120/80", pulse: 72, spo2: 98 }
//         ]
//       }
//     };
    
//     setParsedData(parsed);
//   };
  
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
  
//   const downloadReport = async () => {
//     if (!dashboardRef.current) return;
    
//     try {
//       const loadingToast = document.createElement("div");
//       loadingToast.className = "fixed top-5 right-5 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50";
//       loadingToast.innerText = "Generating PDF...";
//       document.body.appendChild(loadingToast);
      
//       const originalDarkMode = darkMode;
//       setDarkMode(false); // Set to light mode for PDF generation
      
//       // Expand all sections for PDF generation
//       const originalExpandedSections = {...expandedSections};
//       setExpandedSections({
//         summary: true,
//         recommendations: true,
//         visualizations: true
//       });
      
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       const pdf = new jsPDF("p", "mm", "a4");
//       const content = dashboardRef.current;
      
//       const canvas = await html2canvas(content, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: "#ffffff"
//       });
      
//       const imgData = canvas.toDataURL("image/png");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
//       // Restore original settings
//       setDarkMode(originalDarkMode);
//       setExpandedSections(originalExpandedSections);
      
//       pdf.save("Health_Report.pdf");
//       document.body.removeChild(loadingToast);
      
//       const successToast = document.createElement("div");
//       successToast.className = "fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50";
//       successToast.innerText = "Report downloaded successfully!";
//       document.body.appendChild(successToast);
      
//       setTimeout(() => document.body.removeChild(successToast), 3000);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
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
    
//     const rows = content
//       .split("\n")
//       .filter(row => row.includes("|"))
//       .map(row => row.trim());
      
//     if (rows.length < 2) return null;
    
//     const headers = rows[0].split("|").filter(cell => cell.trim()).map(cell => cell.trim());
    
//     return (
//       <div className="overflow-x-auto mt-4">
//         <table className={`min-w-full divide-y ${darkMode ? "divide-gray-200" : "divide-gray-200"}`}>
//           <thead className={darkMode ? "bg-gray-100" : "bg-gray-50"}>
//             <tr>
//               {headers.map((header, idx) => (
//                 <th key={idx} scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-700" : "text-gray-500"} uppercase tracking-wider`}>
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className={`divide-y ${darkMode ? "divide-gray-200" : "divide-gray-200"}`}>
//             {rows.slice(2).map((row, rowIdx) => {
//               const cells = row.split("|").filter(cell => cell.trim()).map(cell => cell.trim());
              
//               return (
//                 <tr key={rowIdx} className={rowIdx % 2 === 0 ? (darkMode ? "bg-white" : "bg-white") : (darkMode ? "bg-gray-50" : "bg-gray-50")}>
//                   {cells.map((cell, cellIdx) => (
//                     <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm">
//                       {cell}
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     );
//   };
  
//   const renderList = (content) => {
//     if (!content) return null;
    
//     const listItems = content
//       .split("\n")
//       .filter(line => line.trim().startsWith("* ") || line.trim().startsWith("- "))
//       .map(line => line.replace(/^\*\s|-\s/, "").trim());
      
//     return (
//       <ul className="list-disc pl-5 space-y-2 mt-4">
//         {listItems.map((item, idx) => (
//           <li key={idx} className="text-sm md:text-base">{item}</li>
//         ))}
//       </ul>
//     );
//   };
  
//   const ProgressBar = ({ value, min, max, label, unit }) => {
//     const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    
//     let statusColor = "bg-blue-400";
//     if (percentage < 25) statusColor = "bg-indigo-400";
//     if (percentage > 75) statusColor = "bg-teal-400";
    
//     return (
//       <div className="mb-4">
//         <div className="flex justify-between mb-1">
//           <span className="text-sm font-medium">{label}</span>
//           <span className="text-sm font-medium">{value} {unit}</span>
//         </div>
//         <div className="w-full h-2.5 bg-gray-200 rounded-full">
//           <div 
//             className={`h-2.5 rounded-full ${statusColor}`} 
//             style={{ width: `${percentage}%` }}
//           ></div>
//         </div>
//         <div className="flex justify-between text-xs mt-1">
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
//           <h2 className="text-2xl font-bold ml-3">{title}</h2>
//         </div>
//         <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600">
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
//     <div className={`min-h-screen ${darkMode ? "bg-gray-100 text-gray-800" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold">Health Report</h1>
//             <p className={`mt-1 ${darkMode ? "text-gray-600" : "text-gray-600"}`}>
//               Your comprehensive health analysis and personalized recommendations
//             </p>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className={`p-2 rounded-full ${darkMode ? "bg-gray-200 text-gray-700" : "bg-gray-200 text-gray-700"} hover:shadow-md transition-all duration-300`}
//               aria-label="Toggle dark mode"
//             >
//               {darkMode ? <FaSun /> : <FaMoon />}
//             </button>
            
//             <button
//               onClick={downloadReport}
//               className="flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
//             >
//               <FaDownload className="mr-2" />
//               Download Report
//             </button>
            
//             <button
//               onClick={() => navigate("/")}
//               className="flex items-center px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all duration-300"
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
//                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
//                   <div className="p-6">
//                     <h3 className="text-xl font-semibold mb-4 text-blue-600">Health Overview</h3>
//                     <div className="prose max-w-none">
//                       {parsedData.healthSummary ? (
//                         <div className="whitespace-pre-wrap text-gray-700">
//                           {parsedData.healthSummary}
//                         </div>
//                       ) : (
//                         <p className="text-gray-500">No health summary available.</p>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Good News & Areas of Concern */}
//                 <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-green-50 rounded-xl shadow-sm p-6">
//                     <h3 className="text-xl font-semibold mb-4 text-green-700">Positive Findings</h3>
//                     <div className="prose max-w-none">
//                       {parsedData.goodNews ? (
//                         <div className="whitespace-pre-wrap text-gray-700">
//                           {parsedData.goodNews}
//                         </div>
//                       ) : (
//                         <p className="text-gray-500">No specific positive findings to report.</p>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="bg-blue-50 rounded-xl shadow-sm p-6">
//                     <h3 className="text-xl font-semibold mb-4 text-blue-700">Areas for Attention</h3>
//                     {parsedData.areasOfConcern ? (
//                       renderTable(parsedData.areasOfConcern) || 
//                       <div className="whitespace-pre-wrap text-gray-700">
//                         {parsedData.areasOfConcern}
//                       </div>
//                     ) : (
//                       <p className="text-gray-500">No specific areas of concern identified.</p>
//                     )}
//                   </div>
//                 </motion.div>

//                 {/* Doctor's Advice */}
//                 <motion.div variants={itemVariants} className="bg-indigo-50 rounded-xl shadow-md p-6">
//                   <h3 className="text-xl font-semibold mb-4 text-indigo-700">Doctor's Professional Advice</h3>
//                   <div className="prose max-w-none">
//                     {parsedData.doctorAdvice ? (
//                       <div className="whitespace-pre-wrap text-gray-700">
//                         {parsedData.doctorAdvice}
//                       </div>
//                     ) : (
//                       <p className="text-gray-500">No specific doctor advice available.</p>
//                     )}
//                   </div>
                  
//                   <div className="mt-6 flex flex-wrap gap-4">
//                     <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
//                       Schedule Appointment
//                     </button>
//                     <button className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
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
//                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
//                   <div className="flex items-center mb-4">
//                     <FaUtensils className="text-teal-500 mr-3" />
//                     <h3 className="text-xl font-semibold text-teal-700">7-Day Diet Plan</h3>
//                   </div>
                  
//                   <div className="mb-4">
//                     <div className="flex flex-wrap gap-3 mb-4">
//                       <button className="px-4 py-2 bg-teal-500 text-white rounded-full">
//                         Vegetarian Plan
//                       </button>
//                       <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full">
//                         Non-Vegetarian Plan
//                       </button>
//                     </div>
                    
//                     {renderTable(parsedData.dietPlan.vegetarian) || (
//                       <div className="whitespace-pre-wrap text-gray-700">
//                         {parsedData.dietPlan.vegetarian || "No vegetarian diet plan available."}
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="bg-teal-50 p-4 rounded-lg text-sm text-gray-600 italic">
//                     This plan is tailored to support your specific nutritional needs based on your health data. Adjust portion sizes as needed.
//                   </div>
//                 </motion.div>

//                 {/* Exercise Plan */}
//                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
//                   <div className="flex items-center mb-4">
//                     <FaDumbbell className="text-blue-500 mr-3" />
//                     <h3 className="text-xl font-semibold text-blue-700">Exercise Recommendations</h3>
//                   </div>
                  
//                   {renderTable(parsedData.exercisePlan) || (
//                     <div className="whitespace-pre-wrap text-gray-700">
//                       {parsedData.exercisePlan || "No exercise plan available."}
//                     </div>
//                   )}
                  
//                   <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center text-center">
//                       <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">
//                         <span style={{ fontSize: "1.5rem" }}>🧘‍♀️</span>
//                       </div>
//                       <h4 className="font-medium mb-1">Flexibility</h4>
//                       <p className="text-sm text-gray-600">Gentle stretching exercises to improve mobility</p>
//                     </div>
                    
//                     <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center text-center">
//                       <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">
//                         <span style={{ fontSize: "1.5rem" }}>🚶</span>
//                       </div>
//                       <h4 className="font-medium mb-1">Cardio</h4>
//                       <p className="text-sm text-gray-600">Moderate walking and light aerobic activity</p>
//                     </div>
                    
//                     <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center text-center">
//                       <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600">
//                         <span style={{ fontSize: "1.5rem" }}>🏋️</span>
//                       </div>
//                       <h4 className="font-medium mb-1">Strength</h4>
//                       <p className="text-sm text-gray-600">Light resistance training for muscle maintenance</p>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Lifestyle & Supplements */}
//                 <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-white rounded-xl shadow-md p-6">
//                     <div className="flex items-center mb-4">
//                       <FaLeaf className="text-green-500 mr-3" />
//                       <h3 className="text-xl font-semibold text-green-700">Lifestyle Modifications</h3>
//                     </div>
                    
//                     <div className="whitespace-pre-wrap text-gray-700">
//                       {parsedData.lifestyleTips || "No lifestyle recommendations available."}
//                     </div>
                    
//                     <div className="mt-4 grid grid-cols-2 gap-3">
//                       <div className="bg-green-50 p-3 rounded-lg border-l-3 border-green-400 flex items-center">
//                         <span className="mr-2">💧</span>
//                         <span className="text-sm">Stay well hydrated</span>
//                       </div>
//                       <div className="bg-green-50 p-3 rounded-lg border-l-3 border-green-400 flex items-center">
//                         <span className="mr-2">💤</span>
//                         <span className="text-sm">Improve sleep quality</span>
//                       </div>
//                       <div className="bg-green-50 p-3 rounded-lg border-l-3 border-green-400 flex items-center">
//                         <span className="mr-2">🧠</span>
//                         <span className="text-sm">Stress management</span>
//                       </div>
//                       <div className="bg-green-50 p-3 rounded-lg border-l-3 border-green-400 flex items-center">
//                         <span className="mr-2">🚭</span>
//                         <span className="text-sm">Avoid smoking</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="bg-white rounded-xl shadow-md p-6">
//                     <div className="flex items-center mb-4">
//                       <FaPills className="text-purple-500 mr-3" />
//                       <h3 className="text-xl font-semibold text-purple-700">Supplements</h3>
//                     </div>
                    
//                     <div className="whitespace-pre-wrap text-gray-700">
//                       {parsedData.supplements || "No supplement recommendations available."}
//                     </div>
                    
//                     <div className="mt-6 bg-purple-50 p-4 rounded-lg">
//                       <p className="text-sm text-gray-600 italic">
//                         Always consult with your healthcare provider before starting any new supplements. These recommendations are based on your current health status.
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Follow-ups */}
//                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
//                   <div className="flex items-center mb-4">
//                     <FaCalendarCheck className="text-indigo-500 mr-3" />
//                     <h3 className="text-xl font-semibold text-indigo-700">Follow-up Recommendations</h3>
//                   </div>
                  
//                   <div className="whitespace-pre-wrap text-gray-700 mb-6">
//                     {parsedData.reminders || "No specific follow-up recommendations available."}
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="bg-indigo-50 p-4 rounded-lg">
//                       <h4 className="font-medium mb-2">Suggested Testing Schedule</h4>
//                       <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
//                         <li>Complete blood count - In 3 months</li>
//                         <li>Vitamin B12 levels - In 3 months</li>
//                         <li>Iron profile - In 3 months</li>
//                         <li>Follow-up visit - In 1 month</li>
//                       </ul>
//                     </div>
                    
//                     <div className="bg-indigo-50 p-4 rounded-lg">
//                       <h4 className="font-medium mb-2">Monitor These Parameters</h4>
//                       <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
//                         <li>Blood pressure - Weekly</li>
//                         <li>Blood pressure - Weekly</li>
//                         <li>Weight - Bi-weekly</li>
//                         <li>Energy levels - Daily</li>
//                         <li>Symptoms - As they occur</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Motivational Note */}
//                 <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl shadow-md p-6">
//                   <h3 className="text-xl font-semibold mb-4 text-teal-700">Your Health Journey</h3>
//                   <div className="whitespace-pre-wrap text-gray-700">
//                     {parsedData.motivationalNote || "Keep going! Every small step towards a healthier lifestyle counts. You're doing great work taking care of your health, and these personalized recommendations are designed to support you on this journey."}
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </div>

//           {/* Data Visualizations Section */}
//           <div className="mb-12">
//             <SectionHeader 
//               title="Health Data Visualizations" 
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
//                 {/* Blood Parameters */}
//                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
//                   <h3 className="text-xl font-semibold mb-6 text-purple-700">Key Blood Parameters</h3>
                  
//                   {parsedData.visualData.bloodParameters.length > 0 ? (
//                     <div className="space-y-4">
//                       {parsedData.visualData.bloodParameters.slice(0, 5).map((param, idx) => (
//                         <ProgressBar 
//                           key={idx}
//                           label={param.name}
//                           value={param.value}
//                           min={param.min}
//                           max={param.max}
//                           unit={param.unit}
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500">No blood parameter data available.</p>
//                   )}
//                 </motion.div>

//                 {/* Vital Signs Tracking */}
//                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
//                   <h3 className="text-xl font-semibold mb-6 text-purple-700">Vital Signs Tracking</h3>
                  
//                   {parsedData.visualData.vitalSigns.length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Pressure</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pulse</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SpO2 (%)</th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {parsedData.visualData.vitalSigns.map((vital, idx) => (
//                             <tr key={idx}>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.date}</td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.bp}</td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.pulse}</td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vital.spo2}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <p className="text-gray-500">No vital signs data available.</p>
//                   )}
//                 </motion.div>

//                 {/* Nutrition Analysis */}
//                 <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
//                   <h3 className="text-xl font-semibold mb-6 text-purple-700">Nutrition Analysis</h3>
                  
//                   {parsedData.visualData.nutritionData.length > 0 ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//                       {parsedData.visualData.nutritionData.map((nutrient, idx) => (
//                         <div key={idx} className="bg-purple-50 p-4 rounded-lg">
//                           <div className="mb-3 text-center">
//                             <div className="inline-block w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
//                               <span className="text-purple-700 font-bold text-xl">{nutrient.percentage}%</span>
//                             </div>
//                             <h4 className="font-medium text-purple-900">{nutrient.category}</h4>
//                           </div>
//                           <div className="h-2 bg-gray-200 rounded-full">
//                             <div 
//                               className="h-2 bg-purple-500 rounded-full" 
//                               style={{ width: `${nutrient.percentage}%` }}
//                             ></div>
//                           </div>
//                           <p className="mt-2 text-xs text-center text-gray-500">
//                             {nutrient.percentage < 50 ? "Attention needed" : 
//                              nutrient.percentage < 70 ? "Improving" : "Optimal"}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500">No nutrition data available.</p>
//                   )}
//                 </motion.div>
//               </motion.div>
//             )}
//           </div>
//         </div>
        
//         {/* Footer */}
//         <footer className="mt-12 pt-6 border-t border-gray-200">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-4 md:mb-0">
//               <p className="text-gray-500 text-sm">
//                 This report is generated based on your health data analysis. It is not a medical diagnosis.
//               </p>
//               <p className="text-gray-500 text-sm mt-1">
//                 Always consult with healthcare professionals before making health-related decisions.
//               </p>
//             </div>
//             <div className="flex space-x-4">
//               <button className="text-blue-500 hover:text-blue-600 transition-colors">Help</button>
//               <button className="text-blue-500 hover:text-blue-600 transition-colors">Privacy</button>
//               <button className="text-blue-500 hover:text-blue-600 transition-colors">Terms</button>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default HDashboard;



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
//     const nonVegetarianDietPlan = extractSection(text, "**🍗 Non-Vegetarian**", "**E. 7-Day Exercise Plan 🏃**");
    
//     // Extract exercise plan
//     const exercisePlan = extractSection(text, "**E. 7-Day Exercise Plan 🏃**", "**F. Lifestyle Tips 🌿**");
    
//     // Extract lifestyle tips
//     const lifestyleTips = extractSection(text, "**F. Lifestyle Tips 🌿**", "**G. Supplements & Food Suggestions 💊**");
    
//     // Extract supplements
//     const supplements = extractSection(text, "**G. Supplements & Food Suggestions 💊**", "**H. Health Product Suggestions (Optional) 🏥**");
    
//     // Extract health products
//     const healthProducts = extractSection(text, "**H. Health Product Suggestions (Optional) 🏥**", "**I. Reminders & Follow-ups 🔁**");
    
//     // Extract reminders
//     const reminders = extractSection(text, "**I. Reminders & Follow-ups 🔁**", "**❣️ L. Motivational Note");
    
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
//         nutritionData: extractNutritionData(text),
//         vitalSigns: [
//           { date: "Apr 1", bp: "120/80", pulse: 72, spo2: 98 },
//           { date: "Apr 3", bp: "118/78", pulse: 70, spo2: 99 },
//           { date: "Apr 5", bp: "122/82", pulse: 74, spo2: 97 },
//           { date: "Apr 7", bp: "124/84", pulse: 76, spo2: 98 },
//           { date: "Apr 9", bp: "120/80", pulse: 72, spo2: 98 }
//         ]
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
  
//   const extractNutritionData = (text) => {
//     const nutrition = [];
    
//     // Extract nutrition-related mentions from the text
//     if (text.includes("B12 deficiency") || text.includes("B-12")) {
//       nutrition.push({
//         category: "Vitamin B12",
//         percentage: 40 // Low percentage since deficiency is mentioned
//       });
//     }
    
//     if (text.includes("anemia") || text.toLowerCase().includes("iron")) {
//       nutrition.push({
//         category: "Iron",
//         percentage: 30 // Low percentage for anemia
//       });
//     }
    
//     if (text.includes("calcium")) {
//       nutrition.push({
//         category: "Calcium",
//         percentage: 75 // Moderate percentage
//       });
//     }
    
//     if (text.includes("folate") || text.includes("leafy green")) {
//       nutrition.push({
//         category: "Folate",
//         percentage: 60
//       });
//     }
    
//     if (text.includes("vitamin C") || text.includes("citrus")) {
//       nutrition.push({
//         category: "Vitamin C",
//         percentage: 70
//       });
//     }
    
//     // If no specific nutrients were found, add some defaults
//     if (nutrition.length === 0) {
//       nutrition.push(
//         { category: "Protein", percentage: 65 },
//         { category: "Fiber", percentage: 50 },
//         { category: "Vitamins", percentage: 60 }
//       );
//     }
    
//     return nutrition;
//   };

//   const downloadReport = async () => {
//     try {
//       // Create a blob with the raw report data
//       const blob = new Blob([reportData.rawText || reportData.summary], { type: 'text/plain' });
      
//       // Create a download link
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = 'health_report.txt';
      
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

//   const formatDietPlan = (planText) => {
//     if (!planText) return null;
    
//     // Split into days
//     const days = planText.split(/\*\*Day \d+\*\*/).filter(day => day.trim());
    
//     return days.map((dayContent, dayIndex) => {
//       // Extract day number from original text
//       const dayMatch = planText.match(/\*\*Day (\d+)\*\*/);
//       const dayNumber = dayMatch ? dayMatch[1] : dayIndex + 1;
      
//       // Split into meals
//       const meals = dayContent.split(/(Breakfast|Lunch|Dinner|Snacks?)/).filter(item => item.trim());
      
//       const mealData = [];
//       for (let i = 0; i < meals.length; i += 2) {
//         if (meals[i + 1]) {
//           mealData.push({
//             meal: meals[i].trim(),
//             items: meals[i + 1].trim().split('\n').filter(item => item.trim())
//           });
//         }
//       }
      
//       return (
//         <div key={dayIndex} className="mb-8">
//           <h4 className={`text-lg font-semibold mb-3 ${darkMode ? "text-green-300" : "text-green-700"}`}>Day {dayNumber}</h4>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
//                 <tr>
//                   <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Meal</th>
//                   <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Items</th>
//                 </tr>
//               </thead>
//               <tbody className={`divide-y divide-gray-200 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//                 {mealData.map((meal, mealIdx) => (
//                   <tr key={mealIdx} className={mealIdx % 2 === 0 ? (darkMode ? "bg-gray-800" : "bg-white") : (darkMode ? "bg-gray-700" : "bg-gray-50")}>
//                     <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
//                       {meal.meal}
//                     </td>
//                     <td className={`px-4 py-3 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                       <ul className="list-disc pl-5">
//                         {meal.items.map((item, itemIdx) => (
//                           <li key={itemIdx}>{item.replace(/^- /, '').trim()}</li>
//                         ))}
//                       </ul>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       );
//     });
//   };

//   const formatExercisePlan = (planText) => {
//     if (!planText) return null;
    
//     // Split into days
//     const days = planText.split(/\*\*Day \d+\*\*/).filter(day => day.trim());
    
//     return days.map((dayContent, dayIndex) => {
//       // Extract day number from original text
//       const dayMatch = planText.match(/\*\*Day (\d+)\*\*/);
//       const dayNumber = dayMatch ? dayMatch[1] : dayIndex + 1;
      
//       // Split into exercises
//       const exercises = dayContent.split('\n').filter(line => line.trim());
      
//       return (
//         <div key={dayIndex} className="mb-8">
//           <h4 className={`text-lg font-semibold mb-3 ${darkMode ? "text-orange-300" : "text-orange-700"}`}>Day {dayNumber}</h4>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
//                 <tr>
//                   <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Exercise</th>
//                   <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider`}>Details</th>
//                 </tr>
//               </thead>
//               <tbody className={`divide-y divide-gray-200 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
//                 {exercises.map((exercise, exIdx) => {
//                   // Split exercise name and details
//                   const [name, ...details] = exercise.split(':');
//                   const detailText = details.join(':').trim();
                  
//                   return (
//                     <tr key={exIdx} className={exIdx % 2 === 0 ? (darkMode ? "bg-gray-800" : "bg-white") : (darkMode ? "bg-gray-700" : "bg-gray-50")}>
//                       <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
//                         {name.replace(/^- /, '').trim()}
//                       </td>
//                       <td className={`px-4 py-3 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                         {detailText}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       );
//     });
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
//                         formatDietPlan(parsedData.dietPlan[activeDietPlan === "vegetarian" ? "vegetarian" : "nonVegetarian"]) || (
//                           <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                             {parsedData.dietPlan[activeDietPlan === "vegetarian" ? "vegetarian" : "nonVegetarian"]}
//                           </div>
//                         )
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
//                         formatExercisePlan(parsedData.exercisePlan) || renderList(parsedData.exercisePlan) || (
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
//                                         <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-purple-400" : "text-purple-600"}`}>Lifestyle Recommendations</h3>
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
                
//                 {/* Supplements & Health Products */}
//                 <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
//                       <FaPills className="inline mr-2" /> Supplement Suggestions
//                     </h3>
//                     <div className="prose max-w-none">
//                       {parsedData.supplements ? (
//                         renderList(parsedData.supplements) || (
//                           <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                             {parsedData.supplements}
//                           </div>
//                         )
//                       ) : (
//                         <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No supplement recommendations.</p>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-red-400" : "text-red-600"}`}>
//                       <FaHeartbeat className="inline mr-2" /> Health Products
//                     </h3>
//                     <div className="prose max-w-none">
//                       {parsedData.healthProducts ? (
//                         renderList(parsedData.healthProducts) || (
//                           <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                             {parsedData.healthProducts}
//                           </div>
//                         )
//                       ) : (
//                         <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No health product suggestions.</p>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 {/* Reminders & Follow-ups */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>
//                   <div className="p-6">
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
//                       <FaCalendarCheck className="inline mr-2" /> Health Reminders
//                     </h3>
//                     <div className="prose max-w-none">
//                       {parsedData.reminders ? (
//                         renderList(parsedData.reminders) || (
//                           <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                             {parsedData.reminders}
//                           </div>
//                         )
//                       ) : (
//                         <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No reminders set.</p>
//                       )}
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 {/* Motivational Note */}
//                 {parsedData.motivationalNote && (
//                   <motion.div variants={itemVariants} className={`${darkMode ? "bg-pink-900/30" : "bg-pink-50"} rounded-xl shadow-md p-6`}>
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-pink-300" : "text-pink-700"}`}>Encouragement</h3>
//                     <div className="prose max-w-none italic">
//                       <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                         {parsedData.motivationalNote}
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
//               title="Health Visualizations" 
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
//                 {/* Blood Parameters */}
//                 {parsedData.visualData.bloodParameters.length > 0 && (
//                   <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
//                     <h3 className={`text-xl font-semibold mb-6 ${darkMode ? "text-red-400" : "text-red-600"}`}>Blood Test Results</h3>
//                     <div className="space-y-6">
//                       {parsedData.visualData.bloodParameters.map((param, idx) => (
//                         <ProgressBar 
//                           key={idx}
//                           value={param.value}
//                           min={param.min}
//                           max={param.max}
//                           label={param.name}
//                           unit={param.unit}
//                         />
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
                
                
                
                
                
//               </motion.div>
//             )}
//           </div>
//         </div>
        
//         {/* Footer */}
//         <footer className={`py-6 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
//               © {new Date().getFullYear()} Health Dashboard. All rights reserved.
//             </p>
//             <div className="flex space-x-4 mt-4 md:mt-0">
//               <button className={`text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}>
//                 Privacy Policy
//               </button>
//               <button className={`text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}>
//                 Terms of Service
//               </button>
//               <button className={`text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}>
//                 Contact Us
//               </button>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default HDashboard;


// WORKING

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
    
//     // Helper function to extract section between markers
//     const extractSection = (text, startMarker, endMarker) => {
//       const startIndex = text.indexOf(startMarker);
//       if (startIndex === -1) return "";
      
//       const endIndex = endMarker ? text.indexOf(endMarker, startIndex) : text.length;
//       return text.substring(startIndex + startMarker.length, endIndex !== -1 ? endIndex : text.length).trim();
//     };
  
//     // Extract numerical values for visualization
//     const extractNumericalValues = (text) => {
//       const bloodParams = [];
//       const regex = /(\w[\w\s]*)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)-([\d.]+)\s*([^\s|]+)/g;
//       let match;
      
//       while ((match = regex.exec(text)) !== null) {
//         bloodParams.push({
//           name: match[1].trim(),
//           value: parseFloat(match[2]),
//           min: parseFloat(match[3]),
//           max: parseFloat(match[4]),
//           unit: match[5].trim()
//         });
//       }
      
//       return bloodParams;
//     };
    
//     const extractNutritionData = (text) => {
//       const nutrition = [];
//       const nutrients = ["Iron", "Vitamin B12", "Folate", "Vitamin C", "Calcium"];
      
//       nutrients.forEach(nutrient => {
//         if (text.includes(nutrient)) {
//           nutrition.push({
//             category: nutrient,
//             percentage: Math.floor(Math.random() * 30) + 40 // Random for demo
//           });
//         }
//       });
      
//       return nutrition;
//     };
  
//     // Extract diet plan tables
//     const extractDietPlan = (text, planType) => {
//       const startMarker = planType === "vegetarian" ? "🥬 Vegetarian" : "🍗 Non-Vegetarian";
//       const endMarker = planType === "vegetarian" ? "🍗 Non-Vegetarian" : "E. 7-Day Exercise Plan 🏃";
      
//       const planText = extractSection(text, startMarker, endMarker);
//       if (!planText) return "";
      
//       // Extract the table part
//       const tableStart = planText.indexOf("|");
//       if (tableStart === -1) return planText;
      
//       return planText.substring(tableStart).trim();
//     };
  
//     const parsed = {
//       healthSummary: extractSection(text, "A. Health Summary 🩺", "✅ Good News 🎉"),
//       goodNews: extractSection(text, "✅ Good News 🎉", "⚠️ Areas of Concern"),
//       areasOfConcern: extractSection(text, "⚠️ Areas of Concern", "B. Red Flags & Concerns ⚠️"),
//       redFlags: extractSection(text, "B. Red Flags & Concerns ⚠️", "C. Simulated Doctor Advice 👨‍⚕️"),
//       doctorAdvice: extractSection(text, "C. Simulated Doctor Advice 👨‍⚕️", "D. 7-Day Diet Plan 🍽️"),
//       dietPlan: {
//         vegetarian: extractDietPlan(text, "vegetarian"),
//         nonVegetarian: extractDietPlan(text, "nonVegetarian")
//       },
//       exercisePlan: extractSection(text, "E. 7-Day Exercise Plan 🏃", "F. Lifestyle Tips 🌿"),
//       lifestyleTips: extractSection(text, "F. Lifestyle Tips 🌿", "G. Supplements & Food Suggestions 💊"),
//       supplements: extractSection(text, "G. Supplements & Food Suggestions 💊", "H. Health Product Suggestions (Optional) 🏥"),
//       healthProducts: extractSection(text, "H. Health Product Suggestions (Optional) 🏥", "I. Reminders & Follow-ups 🔁"),
//       reminders: extractSection(text, "I. Reminders & Follow-ups 🔁", "❣️ L. Motivational Note"),
//       motivationalNote: extractSection(text, "❣️ L. Motivational Note", ""),
//       visualData: {
//         bloodParameters: extractNumericalValues(text),
//         nutritionData: extractNutritionData(text),
//         vitalSigns: [
//           { date: "Apr 1", bp: "120/80", pulse: 72, spo2: 98 },
//           { date: "Apr 3", bp: "118/78", pulse: 70, spo2: 99 },
//           { date: "Apr 5", bp: "122/82", pulse: 74, spo2: 97 },
//           { date: "Apr 7", bp: "124/84", pulse: 76, spo2: 98 },
//           { date: "Apr 9", bp: "120/80", pulse: 72, spo2: 98 }
//         ]
//       }
//     };
    
//     setParsedData(parsed);
//   };
  
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
  
//   const downloadReport = async () => {
//     if (!dashboardRef.current) return;
    
//     try {
//       const loadingToast = document.createElement("div");
//       loadingToast.className = "fixed top-5 right-5 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50";
//       loadingToast.innerText = "Generating PDF...";
//       document.body.appendChild(loadingToast);
      
//       // Store original settings to restore later
//       const originalDarkMode = darkMode;
//       setDarkMode(false); // Set to light mode for PDF generation
      
//       // Expand all sections for PDF generation
//       const originalExpandedSections = {...expandedSections};
//       setExpandedSections({
//         summary: true,
//         recommendations: true,
//         visualizations: true
//       });
      
//       // Wait for state updates to apply
//       await new Promise(resolve => setTimeout(resolve, 300));
      
//       const pdf = new jsPDF("p", "mm", "a4");
//       const content = dashboardRef.current;
      
//       const canvas = await html2canvas(content, {
//         scale: 2,
//         useCORS: true,
//         logging: false,
//         backgroundColor: "#ffffff"
//       });
      
//       const imgData = canvas.toDataURL("image/png");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
//       // Restore original settings
//       setDarkMode(originalDarkMode);
//       setExpandedSections(originalExpandedSections);
      
//       pdf.save("Health_Report.pdf");
//       document.body.removeChild(loadingToast);
      
//       const successToast = document.createElement("div");
//       successToast.className = "fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50";
//       successToast.innerText = "Report downloaded successfully!";
//       document.body.appendChild(successToast);
      
//       setTimeout(() => document.body.removeChild(successToast), 3000);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
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
    
//     // Extract headers
//     const headers = lines[0].split('|')
//       .map(header => header.trim())
//       .filter(header => header);
    
//     // Process rows
//     const rows = lines.slice(1).map(line => {
//       return line.split('|')
//         .map(cell => cell.trim())
//         .filter((cell, index) => index > 0 && index < headers.length + 1);
//     });
    
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
  
//   const ProgressBar = ({ value, min, max, label, unit }) => {
//     const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
    
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
//               Download Report
//             </button>
            
//             <button
//               onClick={() => navigate("/")}
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
//                         <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                           {parsedData.goodNews}
//                         </div>
//                       ) : (
//                         <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No specific positive findings to report.</p>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className={`${darkMode ? "bg-blue-900" : "bg-blue-50"} rounded-xl shadow-sm p-6`}>
//                     <h3 className={`text-xl font-semibold mb-4 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>Areas for Attention</h3>
//                     {parsedData.areasOfConcern ? (
//                       renderTable(parsedData.areasOfConcern) || 
//                       <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                         {parsedData.areasOfConcern}
//                       </div>
//                     ) : (
//                       <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No specific areas of concern identified.</p>
//                     )}
//                   </div>
//                 </motion.div>

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
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
//                   <div className="flex items-center mb-4">
//                     <FaUtensils className="text-teal-500 mr-3" />
//                     <h3 className={`text-xl font-semibold ${darkMode ? "text-teal-400" : "text-teal-700"}`}>7-Day Diet Plan</h3>
//                   </div>
                  
//                   <div className="mb-4">
//                     <div className="flex flex-wrap gap-3 mb-4">
//                       <button 
//                         onClick={() => setActiveDietPlan("vegetarian")}
//                         className={`px-4 py-2 rounded-full transition-colors ${
//                           activeDietPlan === "vegetarian" 
//                             ? "bg-teal-500 text-white" 
//                             : `${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`
//                         }`}
//                       >
//                         Vegetarian Plan
//                       </button>
//                       <button 
//                         onClick={() => setActiveDietPlan("nonVegetarian")}
//                         className={`px-4 py-2 rounded-full transition-colors ${
//                           activeDietPlan === "nonVegetarian" 
//                             ? "bg-teal-500 text-white" 
//                             : `${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`
//                         }`}
//                       >
//                         Non-Vegetarian Plan
//                       </button>
//                     </div>
                    
//                     {activeDietPlan === "vegetarian" ? (
//                       renderTable(parsedData.dietPlan.vegetarian) || (
//                         <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                           {parsedData.dietPlan.vegetarian || "No vegetarian diet plan available."}
//                         </div>
//                       )
//                     ) : (
//                       renderTable(parsedData.dietPlan.nonVegetarian) || (
//                         <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                           {parsedData.dietPlan.nonVegetarian || "No non-vegetarian diet plan available."}
//                         </div>
//                       )
//                     )}
//                   </div>
                  
//                   <div className={`${darkMode ? "bg-teal-900" : "bg-teal-50"} p-4 rounded-lg text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} italic`}>
//                     This plan is tailored to support your specific nutritional needs based on your health data. Adjust portion sizes as needed.
//                   </div>
//                 </motion.div>

//                 {/* Exercise Plan */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
//                   <div className="flex items-center mb-4">
//                     <FaDumbbell className="text-blue-500 mr-3" />
//                     <h3 className={`text-xl font-semibold ${darkMode ? "text-blue-400" : "text-blue-700"}`}>Exercise Recommendations</h3>
//                   </div>
                  
//                   {renderTable(parsedData.exercisePlan) || (
//                     <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                       {parsedData.exercisePlan || "No exercise plan available."}
//                     </div>
//                   )}
                  
//                   <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className={`${darkMode ? "bg-blue-900" : "bg-blue-50"} p-4 rounded-lg flex flex-col items-center text-center`}>
//                       <div className={`w-12 h-12 ${darkMode ? "bg-blue-800" : "bg-blue-100"} rounded-full flex items-center justify-center mb-3 ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
//                         <span style={{ fontSize: "1.5rem" }}>🧘‍♀️</span>
//                       </div>
//                       <h4 className={`font-medium mb-1 ${darkMode ? "text-gray-200" : ""}`}>Flexibility</h4>
//                       <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Gentle stretching exercises to improve mobility</p>
//                     </div>
                    
//                     <div className={`${darkMode ? "bg-blue-900" : "bg-blue-50"} p-4 rounded-lg flex flex-col items-center text-center`}>
//                       <div className={`w-12 h-12 ${darkMode ? "bg-blue-800" : "bg-blue-100"} rounded-full flex items-center justify-center mb-3 ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
//                         <span style={{ fontSize: "1.5rem" }}>🚶</span>
//                       </div>
//                       <h4 className={`font-medium mb-1 ${darkMode ? "text-gray-200" : ""}`}>Cardio</h4>
//                       <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Moderate walking and light aerobic activity</p>
//                     </div>
                    
//                     <div className={`${darkMode ? "bg-blue-900" : "bg-blue-50"} p-4 rounded-lg flex flex-col items-center text-center`}>
//                       <div className={`w-12 h-12 ${darkMode ? "bg-blue-800" : "bg-blue-100"} rounded-full flex items-center justify-center mb-3 ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
//                         <span style={{ fontSize: "1.5rem" }}>🏋️</span>
//                       </div>
//                       <h4 className={`font-medium mb-1 ${darkMode ? "text-gray-200" : ""}`}>Strength</h4>
//                       <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Light resistance training for muscle maintenance</p>
//                     </div>
//                   </div>
//                 </motion.div>
//                 {/* Supplements & Lifestyle */}
//                 <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Supplements */}
//                   <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
//                     <div className="flex items-center mb-4">
//                       <FaPills className="text-purple-500 mr-3" />
//                       <h3 className={`text-xl font-semibold ${darkMode ? "text-purple-400" : "text-purple-700"}`}>Supplements</h3>
//                     </div>
                    
//                     {renderList(parsedData.supplements) || (
//                       <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                         {parsedData.supplements || "No supplement recommendations available."}
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Lifestyle Tips */}
//                   <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
//                     <div className="flex items-center mb-4">
//                       <FaLeaf className="text-green-500 mr-3" />
//                       <h3 className={`text-xl font-semibold ${darkMode ? "text-green-400" : "text-green-700"}`}>Lifestyle Tips</h3>
//                     </div>
                    
//                     {renderList(parsedData.lifestyleTips) || (
//                       <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                         {parsedData.lifestyleTips || "No lifestyle tips available."}
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>

//                 {/* Reminders & Follow-ups */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
//                   <div className="flex items-center mb-4">
//                     <FaCalendarCheck className="text-indigo-500 mr-3" />
//                     <h3 className={`text-xl font-semibold ${darkMode ? "text-indigo-400" : "text-indigo-700"}`}>Follow-ups & Reminders</h3>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className={`${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"} p-4 rounded-lg`}>
//                       <h4 className={`font-medium mb-2 ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>Upcoming Appointments</h4>
//                       {parsedData.reminders ? (
//                         <div className={`whitespace-pre-wrap ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                           {parsedData.reminders}
//                         </div>
//                       ) : (
//                         <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No appointments scheduled.</p>
//                       )}
//                     </div>
                    
//                     <div className={`${darkMode ? "bg-indigo-900/30" : "bg-indigo-50"} p-4 rounded-lg`}>
//                       <h4 className={`font-medium mb-2 ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>Next Steps</h4>
//                       <ul className={`list-disc pl-5 space-y-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                         <li>Schedule blood work in 3 months</li>
//                         <li>Daily nutrition tracking for 30 days</li>
//                         <li>Weekly weight monitoring</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Motivational Note */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-purple-900/60" : "bg-purple-50"} rounded-xl shadow-md p-6 border-l-4 ${darkMode ? "border-purple-500" : "border-purple-400"}`}>
//                   <h3 className={`text-xl font-semibold mb-3 ${darkMode ? "text-purple-300" : "text-purple-700"}`}>❣️ A Note For You</h3>
//                   <div className={`whitespace-pre-wrap italic ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
//                     {parsedData.motivationalNote || "Every step you take toward better health is a victory. Keep going!"}
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </div>

//           {/* Visualizations Section */}
//           <div className="mb-12">
//             <SectionHeader 
//               title="Health Visualizations" 
//               icon={<FaChartBar className="text-indigo-500" />}
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
//                 {/* Blood Parameters */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
//                   <h3 className={`text-xl font-semibold mb-6 ${darkMode ? "text-indigo-400" : "text-indigo-700"}`}>Blood Parameters</h3>
                  
//                   {parsedData.visualData.bloodParameters.length > 0 ? (
//                     <div className="space-y-6">
//                       {parsedData.visualData.bloodParameters.map((param, index) => (
//                         <ProgressBar
//                           key={index}
//                           label={param.name}
//                           value={param.value}
//                           min={param.min}
//                           max={param.max}
//                           unit={param.unit}
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No blood parameter data available.</p>
//                   )}
//                 </motion.div>

//                 {/* Nutrition Balance */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
//                   <h3 className={`text-xl font-semibold mb-6 ${darkMode ? "text-green-400" : "text-green-700"}`}>Nutrition Balance</h3>
                  
//                   {parsedData.visualData.nutritionData.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                       {parsedData.visualData.nutritionData.map((nutrient, index) => (
//                         <div key={index} className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
//                           <div className="flex justify-between mb-2">
//                             <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{nutrient.category}</span>
//                             <span className={`${nutrient.percentage < 50 ? "text-red-500" : "text-green-500"} font-medium`}>{nutrient.percentage}%</span>
//                           </div>
//                           <div className={`w-full h-2 ${darkMode ? "bg-gray-600" : "bg-gray-200"} rounded-full`}>
//                             <div 
//                               className={`h-2 rounded-full ${nutrient.percentage < 50 ? (darkMode ? "bg-red-600" : "bg-red-500") : (darkMode ? "bg-green-600" : "bg-green-500")}`}
//                               style={{ width: `${nutrient.percentage}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No nutrition data available.</p>
//                   )}
//                 </motion.div>

//                 {/* Vital Signs */}
//                 <motion.div variants={itemVariants} className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-md p-6`}>
//                   <h3 className={`text-xl font-semibold mb-6 ${darkMode ? "text-blue-400" : "text-blue-700"}`}>Vital Signs Tracking</h3>
                  
//                   {parsedData.visualData.vitalSigns.length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
//                           <tr>
//                             <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Date</th>
//                             <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Blood Pressure</th>
//                             <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>Pulse Rate</th>
//                             <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-500"} uppercase tracking-wider`}>SpO2 (%)</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                           {parsedData.visualData.vitalSigns.map((vital, index) => (
//                             <tr key={index} className={index % 2 === 0 ? (darkMode ? "bg-gray-800" : "bg-white") : (darkMode ? "bg-gray-700" : "bg-gray-50")}>
//                               <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>{vital.date}</td>
//                               <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>{vital.bp}</td>
//                               <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>{vital.pulse}</td>
//                               <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>{vital.spo2}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No vital signs data available.</p>
//                   )}
//                 </motion.div>
//               </motion.div>
//             )}
//           </div>
//         </div>
        
//         {/* Footer */}
//         <footer className={`text-center py-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//           <p className="text-sm">This health report is generated based on your provided health data.</p>
//           <p className="text-sm mt-1">Always consult with healthcare professionals before making any changes to your health regimen.</p>
//           <p className="mt-4 text-xs">© {new Date().getFullYear()} Health Report Generator</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default HDashboard;