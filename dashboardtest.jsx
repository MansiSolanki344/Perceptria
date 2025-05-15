
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebaseConfig";
// import { 
//   FaFileMedical, 
//   FaHeartbeat, 
//   FaCalendarCheck, 
//   FaUserMd, 
//   FaChartLine,
//   FaBell,
//   FaUserCircle,
//   FaClipboardList,
//   FaHome
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";
// import Footer from "../Layout/Footer";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [healthStatus, setHealthStatus] = useState("good"); // good, moderate, attention
//   const [showNotification, setShowNotification] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) {
//         localStorage.removeItem("user");
//         navigate("/login");
//       } else {
//         setUser(currentUser);
//         const userRef = doc(db, "users", currentUser.uid);
//         const docSnap = await getDoc(userRef);
//         if (docSnap.exists()) {
//           setUserName(docSnap.data().name);
//         } else {
//           console.log("No user document found!");
//         }
//         setLoading(false);
        
//         // Show welcome notification after loading
//         setTimeout(() => {
//           setShowNotification(true);
//           setTimeout(() => setShowNotification(false), 5000);
//         }, 1000);
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   // Status color based on health condition
//   const getStatusColor = () => {
//     switch(healthStatus) {
//       case "good": return "from-green-400 to-blue-500";
//       case "moderate": return "from-yellow-400 to-orange-500";
//       case "attention": return "from-red-400 to-pink-500";
//       default: return "from-green-400 to-blue-500";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <motion.div 
//           className="flex flex-col items-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//           <motion.p 
//             className="mt-6 text-indigo-800 font-medium text-xl"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//           >
//             Loading your health dashboard...
//           </motion.p>
//           <motion.div 
//             className="mt-4 bg-blue-50 p-3 rounded-lg shadow-sm max-w-xs"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 0.6 }}
//           >
//             <p className="text-blue-700 text-center text-sm">Analyzing your recent health data</p>
//           </motion.div>
//         </motion.div>
//       </div>
//     );
//   }

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         staggerChildren: 0.1
//       } 
//     }
//   };
  
//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Notification Popup */}
//       <AnimatePresence>
//         {showNotification && (
//           <motion.div 
//             className="fixed top-5 right-5 bg-white rounded-lg shadow-lg p-4 z-50 border-l-4 border-indigo-500 max-w-sm"
//             initial={{ x: 100, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: 100, opacity: 0 }}
//           >
//             <div className="flex items-start">
//               <div className="bg-indigo-100 p-2 rounded-full">
//                 <FaBell className="text-indigo-600" />
//               </div>
//               <div className="ml-3">
//                 <h3 className="font-medium text-gray-800">Welcome back!</h3>
//                 <p className="text-sm text-gray-600 mt-1">Your health metrics have been updated. All looking good!</p>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
      
//       {/* Top Navigation Bar */}
//       <motion.div 
//         className="bg-white shadow-md sticky top-0 z-10"
//         initial={{ y: -50 }}
//         animate={{ y: 0 }}
//         transition={{ type: "spring", stiffness: 100 }}
//       >
//         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center">
//             <motion.div 
//               className="hidden md:flex items-center mr-2"
//               whileHover={{ scale: 1.05 }}
//             >
//               <span className="text-indigo-600 font-bold text-xl">Health</span>
//               <span className="text-teal-500 font-bold text-xl">Track</span>
//             </motion.div>
            
//             <div className="flex space-x-1 md:space-x-4">
//               <motion.button 
//                 className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors flex items-center"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <FaHome className="text-lg" />
//                 <span className="ml-1 hidden md:inline">Dashboard</span>
//               </motion.button>
              
//               <motion.button 
//                 className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors flex items-center"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <FaCalendarCheck className="text-lg" />
//                 <span className="ml-1 hidden md:inline">Appointments</span>
//               </motion.button>
              
//               <motion.button 
//                 className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors flex items-center"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <FaClipboardList className="text-lg" />
//                 <span className="ml-1 hidden md:inline">Reports</span>
//               </motion.button>
//             </div>
//           </div>
          
//           <motion.div 
//             className="flex items-center space-x-3"
//             whileHover={{ scale: 1.02 }}
//           >
//             <motion.div 
//               className="relative cursor-pointer"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               {/* <FaBell className="text-gray-500 hover:text-indigo-600 text-xl" /> */}
//               {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span> */}
//             </motion.div>
            
//             <motion.button 
//               className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full flex items-center shadow-md hover:shadow-lg transition-shadow"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <FaUserCircle className="mr-2" />
//               <span>{userName || user?.displayName || "User"}</span>
//             </motion.button>
//           </motion.div>
//         </div>
//       </motion.div>

//       <div className="container mx-auto px-4 md:px-6 py-6 md:py-10">
//         {/* Welcome Section */}
//         <motion.div 
//           className="text-center mb-10"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <motion.h1 
//             className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-800 text-transparent bg-clip-text"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.7 }}
//           >
//             Welcome back, {userName || user?.displayName || "User"}
//           </motion.h1>
//           <motion.p 
//             className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//           >
//             Your personalized health insights are ready for you
//           </motion.p>
//         </motion.div>

//         {/* Health Status Section with improved styling */}
//         <motion.div 
//           className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className={`h-2 bg-gradient-to-r ${getStatusColor()}`}></div>
//           <div className="p-6 md:p-8">
//             <div className="flex flex-col md:flex-row md:items-center justify-between">
//               <div className="flex-1">
//                 <div className="flex items-center">
//                   <h2 className="text-2xl font-semibold text-gray-800">Health Overview</h2>
//                   <motion.div 
//                     className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
//                     whileHover={{ scale: 1.05 }}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.4 }}
//                   >
//                     Excellent
//                   </motion.div>
//                 </div>
//                 <p className="mt-3 text-gray-600 text-lg leading-relaxed">
//                   Your health metrics look promising! All vital signs are within optimal ranges, showing improvement from last month.
//                 </p>
//               </div>
//               <motion.div 
//                 className="mt-4 md:mt-0 flex-shrink-0"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.3, duration: 0.5 }}
//               >
//                 <div className="p-3 bg-indigo-50 rounded-full">
//                   <FaChartLine className="text-5xl md:text-6xl text-indigo-500" />
//                 </div>
//               </motion.div>
//             </div>
            
//             <motion.div 
//               className="mt-6 bg-blue-50 p-5 rounded-xl border-l-4 border-blue-500"
//               whileHover={{ scale: 1.02 }}
//               transition={{ type: "spring", stiffness: 300 }}
//             >
//               <div className="flex items-start">
//                 <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
//                   <FaHeartbeat className="text-blue-600" />
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="font-medium text-blue-800">Medical Analysis</h3>
//                   <p className="text-blue-700 mt-1">
//                     Your blood pressure (118/76) and cholesterol levels (175 mg/dL) are excellent. Continue with your current health routine and scheduled medication.
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
            
//             {/* Health Metrics */}
//             <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
//               <motion.div 
//                 className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl shadow-sm"
//                 whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm text-gray-500">Blood Pressure</p>
//                     <p className="text-xl font-semibold text-indigo-800">118/76</p>
//                   </div>
//                   <div className="p-2 bg-white rounded-full">
//                     <FaHeartbeat className="text-indigo-500" />
//                   </div>
//                 </div>
//                 <p className="text-xs text-green-600 mt-2 flex items-center">
//                   <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
//                   Optimal range
//                 </p>
//               </motion.div>
              
//               <motion.div 
//                 className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl shadow-sm"
//                 whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm text-gray-500">Heart Rate</p>
//                     <p className="text-xl font-semibold text-purple-800">72 bpm</p>
//                   </div>
//                   <div className="p-2 bg-white rounded-full">
//                     <FaHeartbeat className="text-purple-500" />
//                   </div>
//                 </div>
//                 <p className="text-xs text-green-600 mt-2 flex items-center">
//                   <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
//                   Normal
//                 </p>
//               </motion.div>
              
//               <motion.div 
//                 className="bg-gradient-to-br from-teal-50 to-green-50 p-4 rounded-xl shadow-sm"
//                 whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm text-gray-500">Cholesterol</p>
//                     <p className="text-xl font-semibold text-teal-800">175 mg/dL</p>
//                   </div>
//                   <div className="p-2 bg-white rounded-full">
//                     <FaClipboardList className="text-teal-500" />
//                   </div>
//                 </div>
//                 <p className="text-xs text-green-600 mt-2 flex items-center">
//                   <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
//                   Healthy
//                 </p>
//               </motion.div>
              
//               <motion.div 
//                 className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl shadow-sm"
//                 whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-sm text-gray-500">Blood Sugar</p>
//                     <p className="text-xl font-semibold text-amber-800">95 mg/dL</p>
//                   </div>
//                   <div className="p-2 bg-white rounded-full">
//                     <FaClipboardList className="text-amber-500" />
//                   </div>
//                 </div>
//                 <p className="text-xs text-green-600 mt-2 flex items-center">
//                   <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
//                   Normal fasting
//                 </p>
//               </motion.div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Quick Actions Section with improved styling */}
//         <motion.div 
//           className="mb-8"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <motion.h2 
//             className="text-2xl font-semibold text-gray-800 mb-6"
//             variants={itemVariants}
//           >
//             Quick Actions
//           </motion.h2>
          
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <motion.button 
//               className="bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-5 rounded-xl shadow-md transition-all flex flex-col items-center"
//               variants={itemVariants}
//               whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.4)" }}
//               whileTap={{ scale: 0.98 }}
//               onClick={() => navigate("/upload-report")}
//             >
//               <div className="bg-indigo-400 bg-opacity-30 p-3 rounded-full">
//                 <FaFileMedical className="text-2xl" />
//               </div>
//               <span className="mt-3 font-medium">Upload Report</span>
//             </motion.button>
            
//             <motion.button 
//               className="bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white p-5 rounded-xl shadow-md transition-all flex flex-col items-center"
//               variants={itemVariants}
//               whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.4)" }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full">
//                 <FaUserMd className="text-2xl" />
//               </div>
//               <span className="mt-3 font-medium">Consult Doctor</span>
//             </motion.button>
            
//             <motion.button 
//               className="bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white p-5 rounded-xl shadow-md transition-all flex flex-col items-center"
//               variants={itemVariants}
//               whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.4)" }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <div className="bg-emerald-400 bg-opacity-30 p-3 rounded-full">
//                 <FaHeartbeat className="text-2xl" />
//               </div>
//               <span className="mt-3 font-medium">Track Vitals</span>
//             </motion.button>
            
//             <motion.button 
//               className="bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white p-5 rounded-xl shadow-md transition-all flex flex-col items-center"
//               variants={itemVariants}
//               whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(245, 158, 11, 0.4)" }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <div className="bg-amber-400 bg-opacity-30 p-3 rounded-full">
//                 <FaCalendarCheck className="text-2xl" />
//               </div>
//               <span className="mt-3 font-medium">Book Appointment</span>
//             </motion.button>
//           </div>
//         </motion.div>

//         {/* Recent Activity Timeline with improved styling */}
//         <motion.div 
//           className="bg-white rounded-2xl shadow-lg overflow-hidden"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         >
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6">
//             <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
//           </div>
          
//           <div className="p-6">
//             <div className="space-y-6">
//               <motion.div 
//                 className="flex"
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.5 }}
//                 whileHover={{ x: 5 }}
//               >
//                 <div className="flex flex-col items-center">
//                   <div className="bg-green-500 rounded-full w-4 h-4 border-4 border-green-100"></div>
//                   <div className="bg-gray-200 w-0.5 h-full"></div>
//                 </div>
//                 <div className="ml-4 pb-6">
//                   <div className="flex items-center">
//                     <p className="text-sm text-gray-500">Today, 9:30 AM</p>
//                     <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">New</span>
//                   </div>
//                   <p className="font-medium text-gray-800 mt-1">Blood test results uploaded</p>
//                   <p className="text-gray-600 mt-1">All parameters are within normal range</p>
//                   <div className="mt-2 flex">
//                     <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">View Details</button>
//                   </div>
//                 </div>
//               </motion.div>
              
//               <motion.div 
//                 className="flex"
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.6 }}
//                 whileHover={{ x: 5 }}
//               >
//                 <div className="flex flex-col items-center">
//                   <div className="bg-blue-500 rounded-full w-4 h-4 border-4 border-blue-100"></div>
//                   <div className="bg-gray-200 w-0.5 h-full"></div>
//                 </div>
//                 <div className="ml-4 pb-6">
//                   <p className="text-sm text-gray-500">Yesterday, 4:15 PM</p>
//                   <p className="font-medium text-gray-800 mt-1">Medication reminder set</p>
//                   <p className="text-gray-600 mt-1">Daily reminder for Vitamin D supplement</p>
//                   <div className="mt-2 flex space-x-3">
//                     <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Modify</button>
//                     <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">Dismiss</button>
//                   </div>
//                 </div>
//               </motion.div>
              
//               <motion.div 
//                 className="flex"
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.7 }}
//                 whileHover={{ x: 5 }}
//               >
//                 <div className="flex flex-col items-center">
//                   <div className="bg-amber-500 rounded-full w-4 h-4 border-4 border-amber-100"></div>
//                   <div className="bg-transparent w-0.5 h-full"></div>
//                 </div>
//                 <div className="ml-4">
//                   <p className="text-sm text-gray-500">Mar 20, 2:00 PM</p>
//                   <p className="font-medium text-gray-800 mt-1">Appointment scheduled</p>
//                   <p className="text-gray-600 mt-1">Annual checkup with Dr. Johnson</p>
//                   <div className="mt-2 bg-amber-50 border border-amber-200 p-2 rounded-lg flex items-center">
//                     <FaCalendarCheck className="text-amber-500" />
//                     <span className="ml-2 text-sm text-amber-700">Coming up in 5 days</span>
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
            
//             <motion.div 
//               className="mt-6 text-center"
//               whileHover={{ scale: 1.02 }}
//             >
//               <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-center mx-auto">
//                 View All Activity
//                 <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </button>
//             </motion.div>
//           </div>
//         </motion.div>
        
//         {/* Upcoming Appointments Card */}
//         <motion.div 
//           className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//         >
//           <div className="bg-gradient-to-r from-teal-600 to-emerald-600 py-4 px-6">
//             <h2 className="text-xl font-semibold text-white">Upcoming Appointments</h2>
//           </div>
          
//           <div className="p-6">
//             <motion.div 
//               className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4 border border-emerald-100"
//               whileHover={{ scale: 1.02 }}
//             >
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center">
//                   <div className="bg-teal-500 p-3 rounded-full">
//                     <FaUserMd className="text-white" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-gray-500 text-sm">Mar 25, 11:00 AM</p>
//                     <p className="font-medium text-gray-800">Annual Checkup</p>
//                     <p className="text-teal-700 text-sm">Dr. Emily Johnson</p>
//                   </div>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button className="bg-teal-100 hover:bg-teal-200 text-teal-700 px-3 py-1 rounded-full text-sm">
//                     Reschedule
//                   </button>
//                   <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm">
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
            
//             <div className="mt-4 text-center">
//               <button className="text-teal-600 hover:text-teal-800 font-medium text-sm">
//                 Schedule New Appointment
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       </div>
      
//       {/* Footer */}
      
//     </div>
//   );
// };

// export default Dashboard;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebaseConfig";
// import { 
//   FaFileMedical, 
//   FaHeartbeat, 
//   FaCalendarCheck, 
//   FaUserMd, 
//   FaChartLine 
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import Footer from "../Layout/Footer";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) {
//         localStorage.removeItem("user");
//         navigate("/login");
//       } else {
//         setUser(currentUser);
//         const userRef = doc(db, "users", currentUser.uid);
//         const docSnap = await getDoc(userRef);
//         if (docSnap.exists()) {
//           setUserName(docSnap.data().name);
//         } else {
//           console.log("No user document found!");
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//           <p className="mt-4 text-indigo-800 font-medium">Loading your health data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Top Navigation Bar */}
//       <div className="bg-gradient-to-br from-blue-50 to-indigo-100 shadow-md">
//   <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//     {/* Logo/App Name can go here if needed */}
//     <div></div> {/* Empty div for spacing */}
    
//     <div className="flex items-center space-x-4">
//       <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
//         <FaCalendarCheck className="inline mr-1" /> Appointments
//       </button>
//       <button className="bg-indigo-100 px-3 py-1 rounded-full text-indigo-800 font-medium hover:bg-indigo-200 transition-colors">
//         {userName || user?.displayName || "User"} ▾
//       </button>
//     </div>
//   </div>
// </div>

//       <div className="container mx-auto px-6 py-8">
//         {/* Welcome Section */}
//         <motion.div 
//           className="text-center mb-10"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-3xl font-bold text-indigo-900">
//             Welcome back, {userName || user?.displayName || "User"}
//           </h1>
//           <p className="text-lg text-gray-700 mt-2">
//             Your health dashboard at a glance
//           </p>
//         </motion.div>

//         {/* Health Analysis Section */}
//         <motion.div 
//           className="bg-white rounded-xl shadow-lg p-8 mx-auto max-w-4xl relative overflow-hidden"
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600"></div>
//           <div className="flex items-center justify-between">
//             <div className="flex-1">
//               <h2 className="text-2xl font-semibold text-indigo-900">Health Analysis</h2>
//               <p className="mt-3 text-gray-600 text-lg">
//                 Based on your reports, your health is stable. Keep up the good work!
//               </p>
//             </div>
//             <div className="hidden md:block">
//               <FaChartLine className="text-6xl text-indigo-400 opacity-50" />
//             </div>
//           </div>
          
//           <div className="mt-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
//             <p className="text-blue-800 font-medium">
//               Your blood pressure and cholesterol levels are within normal range. Continue with your current medication routine.
//             </p>
//           </div>
//         </motion.div>

//         {/* Dashboard Overview Cards */}
        

//         {/* Quick Actions Section */}
//         <motion.div 
//           className="mt-12 bg-white rounded-xl shadow-lg p-8"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.6 }}
//         >
//           <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Quick Actions</h2>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <motion.button 
//               className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg shadow-md transition-colors flex flex-col items-center"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate("/upload-report")}
//             >
//               <FaFileMedical className="text-xl mb-2" />
//               <span>Upload Report</span>
//             </motion.button>
            
//             <motion.button 
//               className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-3 rounded-lg shadow-md transition-colors flex flex-col items-center"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <FaUserMd className="text-xl mb-2" />
//               <span>Consult Doctor</span>
//             </motion.button>
            
//             <motion.button 
//               className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-3 rounded-lg shadow-md transition-colors flex flex-col items-center"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <FaHeartbeat className="text-xl mb-2" />
//               <span>Track Vitals</span>
//             </motion.button>
            
//             <motion.button 
//               className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 py-3 rounded-lg shadow-md transition-colors flex flex-col items-center"
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <FaCalendarCheck className="text-xl mb-2" />
//               <span>Book Appointment</span>
//             </motion.button>
//           </div>
//         </motion.div>

//         {/* Recent Activity Timeline */}
//         <motion.div 
//           className="mt-12 bg-white rounded-xl shadow-lg p-8"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.7 }}
//         >
//           <h2 className="text-2xl font-semibold text-indigo-900 mb-6">Recent Activity</h2>
//           <div className="space-y-4">
//             <div className="flex">
//               <div className="flex flex-col items-center">
//                 <div className="bg-green-500 rounded-full w-4 h-4"></div>
//                 <div className="bg-gray-200 w-0.5 h-full"></div>
//               </div>
//               <div className="ml-4 pb-6">
//                 <p className="text-sm text-gray-500">Today, 9:30 AM</p>
//                 <p className="font-medium">Blood test results uploaded</p>
//                 <p className="text-gray-600">All parameters are within normal range</p>
//               </div>
//             </div>
            
//             <div className="flex">
//               <div className="flex flex-col items-center">
//                 <div className="bg-blue-500 rounded-full w-4 h-4"></div>
//                 <div className="bg-gray-200 w-0.5 h-full"></div>
//               </div>
//               <div className="ml-4 pb-6">
//                 <p className="text-sm text-gray-500">Yesterday, 4:15 PM</p>
//                 <p className="font-medium">Medication reminder set</p>
//                 <p className="text-gray-600">Daily reminder for Vitamin D supplement</p>
//               </div>
//             </div>
            
//             <div className="flex">
//               <div className="flex flex-col items-center">
//                 <div className="bg-yellow-500 rounded-full w-4 h-4"></div>
//                 <div className="bg-transparent w-0.5 h-full"></div>
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm text-gray-500">Mar 20, 2:00 PM</p>
//                 <p className="font-medium">Appointment scheduled</p>
//                 <p className="text-gray-600">Annual checkup with Dr. Johnson</p>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebaseConfig";
// import { 
//   FaFileMedical, 
//   FaHeartbeat, 
//   FaCalendarCheck, 
//   FaUserMd, 
//   FaUpload
// } from "react-icons/fa";
// import { motion } from "framer-motion";

// const WelcomePage = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) {
//         localStorage.removeItem("user");
//         navigate("/login");
//       } else {
//         setUser(currentUser);
//         const userRef = doc(db, "users", currentUser.uid);
//         const docSnap = await getDoc(userRef);
//         if (docSnap.exists()) {
//           setUserName(docSnap.data().name);
//         } else {
//           console.log("No user document found!");
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="mt-4 text-indigo-600 font-medium">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-6 py-12">
//         {/* Welcome Section */}
//         <motion.div 
//           className="text-center mb-12"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
          
//           <h1 className="text-4xl font-bold text-indigo-900">
//             Welcome to Perceptria, {userName || user?.displayName || "User"}
//           </h1>
//           <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
//             Your intelligent health management platform. Access your information, 
//             schedule appointments, and track your wellness journey in one secure place.
//           </p>
//         </motion.div>

//         {/* Quick Actions Cards */}
//         <motion.div 
//           className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-indigo-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-indigo-50 p-3 rounded-full">
//                 <FaUserMd className="text-indigo-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Your Care Team</h3>
//             </div>
//             <p className="text-gray-600 mb-5">Access your healthcare providers and specialists all in one place.</p>
//             <button 
//               className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center"
//               onClick={() => navigate("/care-team")}
//             >
//               View your providers
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-violet-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-violet-50 p-3 rounded-full">
//                 <FaCalendarCheck className="text-violet-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Appointments</h3>
//             </div>
//             <p className="text-gray-600 mb-5">Schedule, view, or reschedule your upcoming healthcare appointments.</p>
//             <button 
//               className="text-violet-600 font-medium hover:text-violet-700 transition-colors flex items-center"
//               onClick={() => navigate("/appointments")}
//             >
//               Manage appointments
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-purple-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-purple-50 p-3 rounded-full">
//                 <FaFileMedical className="text-purple-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Health Records</h3>
//             </div>
//             <p className="text-gray-600 mb-5">View and manage your medical history, test results, and reports.</p>
//             <button 
//               className="text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center"
//               onClick={() => navigate("/records")}
//             >
//               Access records
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </motion.div>

//         {/* Upload Section */}
//         <motion.div 
//           className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 relative overflow-hidden"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         >
//           <div className="max-w-3xl">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-3">Have medical documents to share?</h2>
//             <p className="text-gray-700 mb-6">
//               Upload your medical reports, test results, or any health-related documents securely to your profile.
//               Perceptria will organize them for easy access and reference.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <button 
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center"
//                 onClick={() => navigate("/upload-report")}
//               >
//                 <FaUpload className="mr-2" />
//                 Upload Documents
//               </button>
//             </div>
//           </div>
//           <div className="hidden lg:block absolute right-8 bottom-0 opacity-10">
//             <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M14 8H14.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M3 16H4V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V16H21M3 16V8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8V16M3 16L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//         </motion.div>

        
//       </div>

//       {/* Footer with branding */}
      
//     </div>
//   );
// };

// export default WelcomePage;




// 1


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebaseConfig";
// import { 
//   FaFileMedical, 
//   FaHeartbeat, 
//   FaCalendarCheck, 
//   FaUserMd, 
//   FaUpload,
//   FaUser,
//   FaBell
// } from "react-icons/fa";
// import { motion } from "framer-motion";

// const WelcomePage = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) {
//         localStorage.removeItem("user");
//         navigate("/login");
//       } else {
//         setUser(currentUser);
//         const userRef = doc(db, "users", currentUser.uid);
//         const docSnap = await getDoc(userRef);
//         if (docSnap.exists()) {
//           setUserName(docSnap.data().name);
//         } else {
//           console.log("No user document found!");
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="mt-4 text-indigo-600 font-medium">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar with Profile and Notification buttons */}
//       <div className="bg-white shadow-sm">
//         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="text-2xl font-bold text-indigo-600"></div>
//           <div className="flex items-center space-x-4">
//             <button 
//               className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors relative"
//               aria-label="Notifications"
//             >
//               <FaBell className="text-gray-700" />
//               <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
//             </button>
//             <button 
//               className="p-2 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors flex items-center justify-center"
//               aria-label="User Profile"
//               onClick={() => navigate("/userdashboard")}
//             >
//               <FaUser className="text-indigo-700" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-6 py-12">
//         {/* Welcome Section */}
//         <motion.div 
//           className="text-center mb-12"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
          
//           <h1 className="text-4xl font-bold text-indigo-900">
//             Welcome to Perceptria, {userName || user?.displayName || "User"}
//           </h1>
//           <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
//             Your intelligent health management platform. Access your information, 
//             schedule appointments, and track your wellness journey in one secure place.
//           </p>
//         </motion.div>

//         {/* Quick Actions Cards */}
//         <motion.div 
//           className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-indigo-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-indigo-50 p-3 rounded-full">
//                 <FaUserMd className="text-indigo-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Your Care Team</h3>
//             </div>
//             <p className="text-gray-600 mb-5">Access your healthcare providers and specialists all in one place.</p>
//             <button 
//               className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center"
//               onClick={() => navigate("/care-team")}
//             >
//               View your providers
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-violet-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-violet-50 p-3 rounded-full">
//                 <FaCalendarCheck className="text-violet-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Appointments</h3>
//             </div>
//             <p className="text-gray-600 mb-5">Schedule, view, or reschedule your upcoming healthcare appointments.</p>
//             <button 
//               className="text-violet-600 font-medium hover:text-violet-700 transition-colors flex items-center"
//               onClick={() => navigate("/appointments")}
//             >
//               Manage appointments
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-purple-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-purple-50 p-3 rounded-full">
//                 <FaFileMedical className="text-purple-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Health Records</h3>
//             </div>
//             <p className="text-gray-600 mb-5">View and manage your medical history, test results, and reports.</p>
//             <button 
//               className="text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center"
//               onClick={() => navigate("/records")}
//             >
//               Access records
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </motion.div>

//         {/* Upload Section */}
//         <motion.div 
//           className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 relative overflow-hidden"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         >
//           <div className="max-w-3xl">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-3">Have medical documents to share?</h2>
//             <p className="text-gray-700 mb-6">
//               Upload your medical reports, test results, or any health-related documents securely to your profile.
//               Perceptria will organize them for easy access and reference.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <button 
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center"
//                 onClick={() => navigate("/upload-report")}
//               >
//                 <FaUpload className="mr-2" />
//                 Upload Documents
//               </button>
//             </div>
//           </div>
//           <div className="hidden lg:block absolute right-8 bottom-0 opacity-10">
//             <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M14 8H14.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M3 16H4V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V16H21M3 16V8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8V16M3 16L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//         </motion.div>

        
//       </div>

//       {/* Footer with branding */}
      
//     </div>
//   );
// };

// export default WelcomePage;


// 2 with phone no and alert

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebaseConfig";
// import { 
//   FaFileMedical, 
//   FaHeartbeat, 
//   FaCalendarCheck, 
//   FaUserMd, 
//   FaUpload,
//   FaUser,
//   FaBell,
//   FaTimes
// } from "react-icons/fa";
// import { motion } from "framer-motion";

// const WelcomePage = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showNotificationModal, setShowNotificationModal] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [notifications, setNotifications] = useState(true);
//   const [saveStatus, setSaveStatus] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) {
//         localStorage.removeItem("user");
//         navigate("/login");
//       } else {
//         setUser(currentUser);
//         const userRef = doc(db, "users", currentUser.uid);
//         const docSnap = await getDoc(userRef);
//         if (docSnap.exists()) {
//           setUserName(docSnap.data().name);
//           // Load existing notification settings if available
//           if (docSnap.data().phoneNumber) {
//             setPhoneNumber(docSnap.data().phoneNumber);
//           }
//           if (docSnap.data().notifications !== undefined) {
//             setNotifications(docSnap.data().notifications);
//           }
//         } else {
//           console.log("No user document found!");
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   const handleSaveNotificationSettings = async () => {
//     if (!user) return;
    
//     setSaveStatus("saving");
    
//     try {
//       const userRef = doc(db, "users", user.uid);
//       await updateDoc(userRef, {
//         phoneNumber: phoneNumber,
//         notifications: notifications
//       });
      
//       setSaveStatus("success");
      
//       // Reset after showing success message
//       setTimeout(() => {
//         setSaveStatus("");
//         setShowNotificationModal(false);
//       }, 2000);
      
//     } catch (error) {
//       console.error("Error saving notification settings:", error);
//       setSaveStatus("error");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="mt-4 text-indigo-600 font-medium">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar with Profile and Notification buttons */}
//       <div className="bg-white shadow-sm">
//         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="text-2xl font-bold text-indigo-600"></div>
//           <div className="flex items-center space-x-4">
//             <button 
//               className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors relative"
//               aria-label="Notifications"
//               onClick={() => setShowNotificationModal(true)}
//             >
//               <FaBell className="text-gray-700" />
//               {!phoneNumber && <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>}
//             </button>
//             <button 
//               className="p-2 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors flex items-center justify-center"
//               aria-label="User Profile"
//               onClick={() => navigate("/userdashboard")}
//             >
//               <FaUser className="text-indigo-700" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-6 py-12">
//         {/* Welcome Section */}
//         <motion.div 
//           className="text-center mb-12"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
          
//           <h1 className="text-4xl font-bold text-indigo-900">
//             Welcome to Perceptria, {userName || user?.displayName || "User"}
//           </h1>
//           <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
//             Your intelligent health management platform. Access your information, 
//             schedule appointments, and track your wellness journey in one secure place.
//           </p>
//         </motion.div>

//         {/* Quick Actions Cards */}
//         <motion.div 
//           className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-indigo-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-indigo-50 p-3 rounded-full">
//                 <FaUserMd className="text-indigo-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Your Care Team</h3>
//             </div>
//             <p className="text-gray-600 mb-5">Access your healthcare providers and specialists all in one place.</p>
//             <button 
//               className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center"
//               onClick={() => navigate("/care-team")}
//             >
//               View your providers
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-violet-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-violet-50 p-3 rounded-full">
//                 <FaCalendarCheck className="text-violet-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Appointments</h3>
//             </div>
//             <p className="text-gray-600 mb-5">Schedule, view, or reschedule your upcoming healthcare appointments.</p>
//             <button 
//               className="text-violet-600 font-medium hover:text-violet-700 transition-colors flex items-center"
//               onClick={() => navigate("/appointments")}
//             >
//               Manage appointments
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-purple-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-purple-50 p-3 rounded-full">
//                 <FaFileMedical className="text-purple-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Health Records</h3>
//             </div>
//             <p className="text-gray-600 mb-5">View and manage your medical history, test results, and reports.</p>
//             <button 
//               className="text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center"
//               onClick={() => navigate("/records")}
//             >
//               Access records
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </motion.div>

//         {/* Upload Section */}
//         <motion.div 
//           className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 relative overflow-hidden"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         >
//           <div className="max-w-3xl">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-3">Have medical documents to share?</h2>
//             <p className="text-gray-700 mb-6">
//               Upload your medical reports, test results, or any health-related documents securely to your profile.
//               Perceptria will organize them for easy access and reference.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <button 
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center"
//                 onClick={() => navigate("/upload-report")}
//               >
//                 <FaUpload className="mr-2" />
//                 Upload Documents
//               </button>
//             </div>
//           </div>
//           <div className="hidden lg:block absolute right-8 bottom-0 opacity-10">
//             <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M14 8H14.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M3 16H4V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V16H21M3 16V8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8V16M3 16L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//         </motion.div>
//       </div>

//       {/* Notification Modal */}
//       {showNotificationModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-gray-800">Health Reminders</h3>
//               <button 
//                 onClick={() => setShowNotificationModal(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FaTimes />
//               </button>
//             </div>
            
//             <div className="mb-6">
//               <p className="text-gray-600 mb-4">
//                 Receive personalized health reminders tailored to your health conditions directly on your phone. 
//                 Our doctor-approved reminders for diabetes, B12 deficiency, anemia, heart health, and obesity will help you stay on track.
//               </p>
              
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-medium mb-2">
//                   Enter your phone number:
//                 </label>
//                 <input
//                   type="tel"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                   placeholder="e.g., +1 234 567 8900"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   We'll send you daily health reminders based on the day of the week.
//                 </p>
//               </div>
              
//               <div className="flex items-center mt-4">
//                 <input
//                   id="notifications-toggle"
//                   type="checkbox"
//                   checked={notifications}
//                   onChange={() => setNotifications(!notifications)}
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="notifications-toggle" className="ml-2 block text-sm text-gray-700">
//                   Enable health reminders
//                 </label>
//               </div>
//             </div>
            
//             <div className="flex justify-between">
//               <button
//                 onClick={() => setShowNotificationModal(false)}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveNotificationSettings}
//                 disabled={saveStatus === "saving"}
//                 className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${
//                   saveStatus === "saving" ? "opacity-75 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {saveStatus === "saving" ? "Saving..." : "Save Settings"}
//               </button>
//             </div>
            
//             {saveStatus === "success" && (
//               <p className="text-green-600 text-sm mt-4 text-center">
//                 Settings saved successfully! You'll now receive daily health reminders.
//               </p>
//             )}
            
//             {saveStatus === "error" && (
//               <p className="text-red-600 text-sm mt-4 text-center">
//                 Error saving settings. Please try again.
//               </p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WelcomePage;

// only alerts
// WelcomePage.jsx
// WelcomePage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';

// const reminders = {
//   // ... your existing reminders data ...
//   Monday: {
//     "07:00": "Good morning! 🌞 Start your day with 20 mins of gentle yoga – deep breathing, stretches, and slow movements.",
//     "09:00": "Fuel up! 🍽️ Try a bowl of oats with chia seeds, almond milk, and 2 boiled eggs.",
//     "14:00": "Hydration check! 💧 Have a glass of water, and if today’s your med/supplement time – take them now!",
//     "17:00": "Let’s move! 🚶‍♂️Go for a brisk 25-minute walk.",
//     "21:00": "Wind down time 🌙 Sip some warm turmeric milk, cozy up, and turn off screens by 9:30 PM."
//   },
//   Tuesday: {
//     "07:00": "Rise & shine 🌅 — let’s get 20–30 mins of light cardio (like a walk, cycling, or dancing to your playlist).",
//     "09:00": "Time for a powerhouse breakfast! 🥬 Scrambled eggs + sautéed spinach + whole grain toast.",
//     "14:00": "Snack break! 🥜 A handful of almonds + a small piece of dark chocolate or dates.",
//     "17:00": "Move & groove! 💃 Resistance band exercises or bodyweight squats for 20 mins.",
//     "21:00": "Unwind time 🛁 Try 5 mins of slow breathing or legs-up-the-wall yoga pose."
//   },
//   Wednesday: {
//     "07:00": "Wake up and stretch! 🧘 Try 15 mins of mindful movement.",
//     "09:00": "Breakfast time! 🍳 Avocado toast + Greek yogurt + berries.",
//     "14:00": "Mindful check-in 🧠 Pause and take 5 deep breaths. Hydrate too!",
//     "17:00": "Workout time 💪 Do a 20-min bodyweight circuit.",
//     "21:00": "Quiet your mind 🧘‍♀️ Journal or listen to calming music before bed."
//   },
//   Thursday: {
//     "07:00": "Energy boost 🌞 Try a 15-min walk outdoors or stair climbs.",
//     "09:00": "Eat smart 🍴 Whole grain cereal + banana + boiled egg.",
//     "14:00": "Quick mobility break! 🧍‍♂️ Shoulder rolls, neck stretches & deep breathing.",
//     "17:00": "Strength time 🏋️‍♂️ Resistance bands or light weights – 3 sets.",
//     "21:00": "Digital detox 📵 Dim lights and avoid screens before bed."
//   },
//   Friday: {
//     "07:00": "Happy Friday! 🎉 Gentle wake-up yoga or dance it out!",
//     "09:00": "Colorful breakfast 🌈 Fruit smoothie + multigrain toast + nut butter.",
//     "14:00": "Refuel break! 🍵 Herbal tea + a handful of roasted seeds.",
//     "17:00": "Stretch & walk 🚶Take a stroll or light stretches.",
//     "21:20": "Reflect & rest 📔 Write 3 good things from your week."
//   },
//   Saturday: {
//     "08:00": "Slow start ☕ Enjoy a mindful tea or coffee moment.",
//     "10:00": "Brunch time! 🍳 Veggie omelette + toast + fruit salad.",
//     "15:00": "Nature time 🌿 Step outside, breathe, or sit in the sun.",
//     "18:00": "Fun activity 🕺 Try dancing, biking, or a hobby.",
//     "21:30": "Chill zone 😌 Light stretching or aromatherapy to unwind."
//   },
//   Sunday: {
//     "08:00": "Sleep in & stretch 🛌🧘‍♂️ Gentle movement to wake up the body.",
//     "10:00": "Nourish up! 🥣 Quinoa bowl with avocado & veggies.",
//     "14:00": "Midday breather 🌤️ 5 mins of silence or nature sounds.",
//     "18:33": "Prep for the week 📅 Light meal prep or planning.",
//     "20:52": "Self-care ritual 🛁 Face mask, gratitude journaling, early rest."
//   }
// };

// const WelcomePage = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [saveStatus, setSaveStatus] = useState('');
//   const [sentTimes, setSentTimes] = useState([]);

//   const getCurrentReminderMessage = () => {
//     const now = new Date();
//     const day = now.toLocaleDateString('en-US', { weekday: 'long' });
//     const hours = now.getHours().toString().padStart(2, '0');
//     const minutes = now.getMinutes().toString().padStart(2, '0');
//     const currentTime = `${hours}:${minutes}`;

//     const todayReminders = reminders[day];
//     if (todayReminders && todayReminders[currentTime]) {
//       return { message: todayReminders[currentTime], time: currentTime };
//     }
//     return null;
//   };

//   const sendSMS = async (message) => {
//     try {
//       const response = await axios.post('http://localhost:8000/api/send-sms/', {
//         phone_number: phoneNumber,
//         message: message,
//       }, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (response.status === 200) {
//         toast.success('📩 Reminder sent!');
//       }
//     } catch (error) {
//       console.error("Error sending SMS:", error);
//       toast.error('❌ Failed to send reminder.');
//     }
//   };

//   const checkAndSendReminder = async () => {
//     const reminder = getCurrentReminderMessage();
//     if (reminder && phoneNumber && !sentTimes.includes(reminder.time)) {
//       await sendSMS(reminder.message);
//       setSentTimes(prev => [...prev, reminder.time]);
//     }
//   };

//   const handleSendNotification = async () => {
//     if (!phoneNumber) {
//       toast.error('Please enter phone number!');
//       return;
//     }

//     setSaveStatus("saving");

//     const reminder = getCurrentReminderMessage();
//     if (!reminder) {
//       setSaveStatus("no-reminder");
//       setTimeout(() => setSaveStatus(""), 2000);
//       return;
//     }

//     await sendSMS(reminder.message);

//     setSaveStatus("success");
//     setSentTimes(prev => [...prev, reminder.time]);

//     setTimeout(() => {
//       setSaveStatus("");
//     }, 2000);
//   };

//   useEffect(() => {
//     if (!phoneNumber) return; // Do not run if phone number is not entered

//     // Run immediately on page load
//     checkAndSendReminder();

//     // Then keep checking every 1 minute
//     const intervalId = setInterval(() => {
//       checkAndSendReminder();
//     }, 60000);

//     return () => clearInterval(intervalId);
//   }, [phoneNumber, sentTimes]);

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial' }}>
//       <Toaster />
//       <h2>Weekly Health Reminders 📲</h2>
//       <input
//         type="tel"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//         placeholder="Enter phone number"
//         style={{ padding: '8px', marginRight: '10px' }}
//       />
//       <button onClick={handleSendNotification} style={{ padding: '8px 12px' }}>
//         {saveStatus === "saving" ? "Sending..." : "Send Reminder Now"}
//       </button>

//       {saveStatus === "success" && (
//         <p style={{ color: "green", marginTop: "10px" }}>
//           ✅ Reminder sent successfully!
//         </p>
//       )}

//       {saveStatus === "error" && (
//         <p style={{ color: "red", marginTop: "10px" }}>
//           ❌ Error sending SMS. Please try again.
//         </p>
//       )}

//       {saveStatus === "no-reminder" && (
//         <p style={{ color: "orange", marginTop: "10px" }}>
//           ⚠️ No scheduled reminder at this time.
//         </p>
//       )}
//     </div>
//   );
// };

// export default WelcomePage;



// lates

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebaseConfig";
// import axios from 'axios';
// import { 
//   FaFileMedical, 
//   FaHeartbeat, 
//   FaCalendarCheck, 
//   FaUserMd, 
//   FaUpload,
//   FaUser,
//   FaBell,
//   FaTimes
// } from "react-icons/fa";
// import { motion } from "framer-motion";

// const WelcomePage = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showNotificationModal, setShowNotificationModal] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [notifications, setNotifications] = useState(true);
//   const [saveStatus, setSaveStatus] = useState("");
//   const [sentTimes, setSentTimes] = useState([]);
//   const navigate = useNavigate();

//   // Reminders data
//   const reminders = {
//     Monday: {
//       "07:00": "Good morning! 🌞 Start your day with 20 mins of gentle yoga – deep breathing, stretches, and slow movements.",
//       "09:00": "Fuel up! 🍽️ Try a bowl of oats with chia seeds, almond milk, and 2 boiled eggs.",
//       "14:00": "Hydration check! 💧 Have a glass of water, and if today's your med/supplement time – take them now!",
//       "17:00": "Let's move! 🚶‍♂️Go for a brisk 25-minute walk.",
//       "21:00": "Wind down time 🌙 Sip some warm turmeric milk, cozy up, and turn off screens by 9:30 PM."
//     },
//     Tuesday: {
//       "07:00": "Rise & shine 🌅 — let's get 20–30 mins of light cardio (like a walk, cycling, or dancing to your playlist).",
//       "09:00": "Time for a powerhouse breakfast! 🥬 Scrambled eggs + sautéed spinach + whole grain toast.",
//       "14:00": "Snack break! 🥜 A handful of almonds + a small piece of dark chocolate or dates.",
//       "17:00": "Move & groove! 💃 Resistance band exercises or bodyweight squats for 20 mins.",
//       "21:00": "Unwind time 🛁 Try 5 mins of slow breathing or legs-up-the-wall yoga pose."
//     },
//     Wednesday: {
//       "07:00": "Wake up and stretch! 🧘 Try 15 mins of mindful movement.",
//       "09:00": "Breakfast time! 🍳 Avocado toast + Greek yogurt + berries.",
//       "14:00": "Mindful check-in 🧠 Pause and take 5 deep breaths. Hydrate too!",
//       "17:00": "Workout time 💪 Do a 20-min bodyweight circuit.",
//       "21:00": "Quiet your mind 🧘‍♀️ Journal or listen to calming music before bed."
//     },
//     Thursday: {
//       "07:00": "Energy boost 🌞 Try a 15-min walk outdoors or stair climbs.",
//       "09:00": "Eat smart 🍴 Whole grain cereal + banana + boiled egg.",
//       "14:00": "Quick mobility break! 🧍‍♂️ Shoulder rolls, neck stretches & deep breathing.",
//       "17:00": "Strength time 🏋️‍♂️ Resistance bands or light weights – 3 sets.",
//       "21:00": "Digital detox 📵 Dim lights and avoid screens before bed."
//     },
//     Friday: {
//       "07:00": "Happy Friday! 🎉 Gentle wake-up yoga or dance it out!",
//       "09:00": "Colorful breakfast 🌈 Fruit smoothie + multigrain toast + nut butter.",
//       "14:00": "Refuel break! 🍵 Herbal tea + a handful of roasted seeds.",
//       "17:00": "Stretch & walk 🚶Take a stroll or light stretches.",
//       "21:20": "Reflect & rest 📔 Write 3 good things from your week."
//     },
//     Saturday: {
//       "08:00": "Slow start ☕ Enjoy a mindful tea or coffee moment.",
//       "10:00": "Brunch time! 🍳 Veggie omelette + toast + fruit salad.",
//       "15:00": "Nature time 🌿 Step outside, breathe, or sit in the sun.",
//       "18:00": "Fun activity 🕺 Try dancing, biking, or a hobby.",
//       "21:30": "Chill zone 😌 Light stretching or aromatherapy to unwind."
//     },
//     Sunday: {
//       "08:00": "Sleep in & stretch 🛌🧘‍♂️ Gentle movement to wake up the body.",
//       "10:00": "Nourish up! 🥣 Quinoa bowl with avocado & veggies.",
//       "14:00": "Midday breather 🌤️ 5 mins of silence or nature sounds.",
//       "18:33": "Prep for the week 📅 Light meal prep or planning.",
//       "21:00": "Self-care ritual 🛁 Face mask, gratitude journaling, early rest."
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) {
//         localStorage.removeItem("user");
//         navigate("/login");
//       } else {
//         setUser(currentUser);
//         const userRef = doc(db, "users", currentUser.uid);
//         const docSnap = await getDoc(userRef);
//         if (docSnap.exists()) {
//           setUserName(docSnap.data().name);
//         } else {
//           console.log("No user document found!");
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   // Function to validate phone number
//   const validatePhoneNumber = (number) => {
//     // Basic validation - ensure it starts with + and has at least 8 digits
//     const phoneRegex = /^\+\d{8,15}$/;
//     return phoneRegex.test(number.replace(/\s+/g, ''));
//   };

//   // Function to get current reminder based on day and time
//   const getCurrentReminderMessage = () => {
//     const now = new Date();
//     const day = now.toLocaleDateString('en-US', { weekday: 'long' });
//     const hours = now.getHours().toString().padStart(2, '0');
//     const minutes = now.getMinutes().toString().padStart(2, '0');
//     const currentTime = `${hours}:${minutes}`;

//     // For testing/demo purposes - always return a reminder
//     // This ensures we can send a reminder even if no time matches exactly
//     if (process.env.NODE_ENV === 'development') {
//       const todayReminders = reminders[day];
//       if (todayReminders) {
//         // Get the first reminder for today
//         const firstReminderTime = Object.keys(todayReminders)[0];
//         return { message: todayReminders[firstReminderTime], time: firstReminderTime };
//       }
//     }

//     const todayReminders = reminders[day];
//     if (todayReminders && todayReminders[currentTime]) {
//       return { message: todayReminders[currentTime], time: currentTime };
//     }
    
//     // If we don't have an exact time match, use the first reminder for today
//     if (todayReminders && Object.keys(todayReminders).length > 0) {
//       const firstReminderTime = Object.keys(todayReminders)[0];
//       return { message: todayReminders[firstReminderTime], time: firstReminderTime };
//     }
    
//     return null;
//   };

//   // Function to send SMS
//   // ... (keep all the existing imports and component definition)

//   // Function to send SMS - THIS IS THE MAIN CHANGE NEEDED
//   const sendSMS = async (message) => {
//     if (!phoneNumber) {
//       setSaveStatus("error");
//       setTimeout(() => setSaveStatus(""), 2000);
//       return false;
//     }
    
//     const formattedPhone = phoneNumber.replace(/\s+/g, '');
    
//     if (!validatePhoneNumber(formattedPhone)) {
//       setSaveStatus("invalid-number");
//       setTimeout(() => setSaveStatus(""), 3000);
//       return false;
//     }
    
//     setSaveStatus("saving");
    
//     try {
//       const response = await axios.post('http://localhost:8000/api/send-sms/', {
//         phone_number: formattedPhone,
//         message: message,
//       }, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (response.status === 200) {
//         setSaveStatus("success");
//         return true;
//       } else {
//         throw new Error(`Unexpected status code: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error sending SMS:", error);
//       setSaveStatus("error");
//       return false;
//     } finally {
//       setTimeout(() => setSaveStatus(""), 3000);
//     }
//   };

// // ... (keep all the rest of the existing code exactly as is)
//   // Function to check and send reminder when needed
//   const checkAndSendReminder = async () => {
//     const reminder = getCurrentReminderMessage();
//     if (reminder && phoneNumber && !sentTimes.includes(reminder.time)) {
//       await sendSMS(reminder.message);
//       setSentTimes(prev => [...prev, reminder.time]);
//     }
//   };

//   // Function to handle manual send notification
//   const handleSendNotification = async () => {
//     // Get a reminder message (either current time or first available)
//     const reminder = getCurrentReminderMessage();
    
//     if (!phoneNumber) {
//       setSaveStatus("error");
//       return;
//     }
    
//     if (!reminder) {
//       setSaveStatus("no-reminder");
//       setTimeout(() => setSaveStatus(""), 3000);
//       return;
//     }

//     await sendSMS(reminder.message);
//     if (saveStatus === "success") {
//       setSentTimes(prev => [...prev, reminder.time]);
//     }
//   };

//   useEffect(() => {
//     if (!phoneNumber || !showNotificationModal) return;

//     // Run immediately when modal opens with phone number
//     checkAndSendReminder();

//     // Then keep checking every 1 minute
//     const intervalId = setInterval(() => {
//       checkAndSendReminder();
//     }, 60000);

//     return () => clearInterval(intervalId);
//   }, [phoneNumber, sentTimes, showNotificationModal]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-50">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//           <p className="mt-4 text-indigo-600 font-medium">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar with Profile and Notification buttons */}
//       <div className="bg-white shadow-sm">
//         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//           <div className="text-2xl font-bold text-indigo-600"></div>
//           <div className="flex items-center space-x-4">
//             <button 
//               className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors relative"
//               aria-label="Notifications"
//               onClick={() => setShowNotificationModal(true)}
//             >
//               <FaBell className="text-gray-700" />
//             </button>
//             <button 
//               className="p-2 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors flex items-center justify-center"
//               aria-label="User Profile"
//               onClick={() => navigate("/userdashboard")}
//             >
//               <FaUser className="text-indigo-700" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-6 py-12">
//         {/* Welcome Section */}
//         <motion.div 
//           className="text-center mb-12"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
          
//           <h1 className="text-4xl font-bold text-indigo-900">
//             Welcome to Perceptria, {userName || user?.displayName || "User"}
//           </h1>
//           <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
//             Your intelligent health management platform. Access your information, 
//             schedule appointments, and track your wellness journey in one secure place.
//           </p>
//         </motion.div>

//         {/* Quick Actions Cards */}
//         <motion.div 
//           className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-indigo-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-indigo-50 p-3 rounded-full">
//                 <FaUserMd className="text-indigo-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Your Care Team</h3>
//             </div>
//             <p className="text-gray-600 mb-5">Access your healthcare providers and specialists all in one place.</p>
//             <button 
//               className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center"
//               onClick={() => navigate("/care-team")}
//             >
//               View your providers
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-violet-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-violet-50 p-3 rounded-full">
//                 <FaCalendarCheck className="text-violet-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Appointments</h3>
//             </div>
//             <p className="text-gray-600 mb-5">Schedule, view, or reschedule your upcoming healthcare appointments.</p>
//             <button 
//               className="text-violet-600 font-medium hover:text-violet-700 transition-colors flex items-center"
//               onClick={() => navigate("/appointments")}
//             >
//               Manage appointments
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-purple-400 hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-4">
//               <div className="bg-purple-50 p-3 rounded-full">
//                 <FaFileMedical className="text-purple-500 text-xl" />
//               </div>
//               <h3 className="ml-4 text-xl font-semibold text-gray-800">Health Records</h3>
//             </div>
//             <p className="text-gray-600 mb-5">View and manage your medical history, test results, and reports.</p>
//             <button 
//               className="text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center"
//               onClick={() => navigate("/records")}
//             >
//               Access records
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </motion.div>

//         {/* Upload Section */}
//         <motion.div 
//           className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 relative overflow-hidden"
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         >
//           <div className="max-w-3xl">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-3">Have medical documents to share?</h2>
//             <p className="text-gray-700 mb-6">
//               Upload your medical reports, test results, or any health-related documents securely to your profile.
//               Perceptria will organize them for easy access and reference.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <button 
//                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center"
//                 onClick={() => navigate("/upload-report")}
//               >
//                 <FaUpload className="mr-2" />
//                 Upload Documents
//               </button>
//             </div>
//           </div>
//           <div className="hidden lg:block absolute right-8 bottom-0 opacity-10">
//             <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M14 8H14.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M3 16H4V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V16H21M3 16V8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8V16M3 16L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//         </motion.div>
//       </div>

//       {/* Notification Modal */}
//       {showNotificationModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-gray-800">Health Reminders</h3>
//               <button 
//                 onClick={() => setShowNotificationModal(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FaTimes />
//               </button>
//             </div>
            
//             <div className="mb-6">
//               <p className="text-gray-600 mb-4">
//                 Receive personalized health reminders tailored to your health conditions directly on your phone. 
//                 Our doctor-approved reminders for diabetes, B12 deficiency, anemia, heart health, and obesity will help you stay on track.
//               </p>
              
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-medium mb-2">
//                   Enter your phone number:
//                 </label>
//                 <input
//                   type="tel"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                   placeholder="e.g., +91 8780600732"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   We'll send you daily health reminders based on the day of the week.
//                 </p>
//               </div>
              
//               <div className="flex items-center mt-4">
//                 <input
//                   id="notifications-toggle"
//                   type="checkbox"
//                   checked={notifications}
//                   onChange={() => setNotifications(!notifications)}
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="notifications-toggle" className="ml-2 block text-sm text-gray-700">
//                   Enable health reminders
//                 </label>
//               </div>
//             </div>
            
//             <div className="flex justify-between">
//               <button
//                 onClick={() => setShowNotificationModal(false)}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSendNotification}
//                 disabled={saveStatus === "saving"}
//                 className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${
//                   saveStatus === "saving" ? "opacity-75 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {saveStatus === "saving" ? "Sending..." : "Send Reminder Now"}
//               </button>
//             </div>
            
//             {saveStatus === "success" && (
//               <p className="text-green-600 text-sm mt-4 text-center">
//                 Reminder sent successfully! You'll receive daily health reminders.
//               </p>
//             )}
            
//             {saveStatus === "error" && (
//               <p className="text-red-600 text-sm mt-4 text-center">
//                 Error sending reminder. Please enter a valid phone number and try again.
//               </p>
//             )}
            
//             {saveStatus === "invalid-number" && (
//               <p className="text-red-600 text-sm mt-4 text-center">
//                 Please enter a valid phone number in international format (e.g., +91 8780600732).
//               </p>
//             )}
            
//             {saveStatus === "no-reminder" && (
//               <p className="text-orange-500 text-sm mt-4 text-center">
//                 No scheduled reminder at this time. Try again later.
//               </p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WelcomePage;