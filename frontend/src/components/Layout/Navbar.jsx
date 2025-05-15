// // // import React from "react";
// // // import { Link } from "react-router-dom";
// // // import { auth } from "../../firebase/firebaseConfig";

// // // const Navbar = () => {
// // //   return (
// // //     <nav className="bg-blue-500 p-4 text-white flex justify-between items-center shadow-lg">
// // //       <div>
// // //         <Link to="/dashboard" className="text-xl font-bold">Perceptria</Link>
// // //       </div>
// // //       <div className="space-x-6">
// // //         <Link to="/upload-report" className="hover:text-gray-200">Upload Report</Link>
// // //         <Link to="/compare-reports" className="hover:text-gray-200">Compare Reports</Link>
// // //         <Link to="/track-health" className="hover:text-gray-200">Track Health</Link>
// // //         <Link to="/about" className="hover:text-gray-200">About</Link>
// // //         <Link to="/contact" className="hover:text-gray-200">Contact</Link>
// // //       </div>
// // //       <div>
// // //         {auth.currentUser ? (
// // //           <Link to="/profile" className="bg-white text-blue-500 px-4 py-2 rounded-full">
// // //             Profile
// // //           </Link>
// // //         ) : (
// // //           <Link to="/login" className="bg-white text-blue-500 px-4 py-2 rounded-full">
// // //             Login
// // //           </Link>
// // //         )}
// // //       </div>
// // //     </nav>
// // //   );
// // // };

// // // export default Navbar;

// // import React, { useState } from "react";
// // import { Link } from "react-router-dom";

// // const Navbar = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [notifications, setNotifications] = useState(3);

// //   const toggleMenu = () => {
// //     setIsOpen(!isOpen);
// //   };

// //   return (
// //     <nav className="bg-white shadow-md">
// //       <div className="container mx-auto px-4">
// //         <div className="flex justify-between items-center h-16">
// //           {/* Logo and brand */}
// //           <div className="flex items-center">
// //             <Link to="/" className="flex items-center">
// //               <div className="w-8 h-8 rounded-md bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg mr-2">P</div>
// //               <span className="text-xl font-bold text-gray-800">Perceptria</span>
// //             </Link>
// //           </div>

// //           {/* Desktop navigation */}
// //           <div className="hidden md:flex items-center space-x-8">
// //             <Link to="/" className="text-gray-700 hover:text-indigo-600 transition font-medium">Home</Link>
// //             <Link to="/dashboard" className="text-indigo-600 transition font-medium border-b-2 border-indigo-600">Dashboard</Link>
// //             <Link to="/uploadreport" className="text-gray-700 hover:text-indigo-600 transition font-medium">Reports</Link>
// //             <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium">About</Link>
// //             <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition font-medium">Contact</Link>
// //           </div>

// //           {/* User menu & notifications */}
// //           <div className="hidden md:flex items-center">
// //             <div className="mr-4 relative">
// //               <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
// //                 <span className="text-gray-600">🔔</span>
// //                 {notifications > 0 && (
// //                   <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
// //                     {notifications}
// //                   </span>
// //                 )}
// //               </button>
// //             </div>
// //             <Link to="/profile" className="flex items-center">
// //               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden mr-2">
// //                 <img 
// //                   src="https://via.placeholder.com/50" 
// //                   alt="User" 
// //                   className="w-full h-full object-cover"
// //                 />
// //               </div>
// //               <span className="text-sm font-medium text-gray-700">Sarah T.</span>
// //             </Link>
// //           </div>

// //           {/* Mobile menu button */}
// //           <div className="md:hidden">
// //             <button 
// //               onClick={toggleMenu}
// //               className="text-gray-600 hover:text-gray-900 focus:outline-none"
// //             >
// //               {isOpen ? (
// //                 <span className="text-xl">✕</span>
// //               ) : (
// //                 <span className="text-xl">☰</span>
// //               )}
// //             </button>
// //           </div>
// //         </div>

// //         {/* Mobile menu */}
// //         {isOpen && (
// //           <div className="md:hidden py-4 space-y-2 border-t border-gray-100">
// //             <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
// //               Home
// //             </Link>
// //             <Link to="/dashboard" className="block py-2 px-4 bg-indigo-50 text-indigo-600 rounded-md transition">
// //               Dashboard
// //             </Link>
// //             <Link to="/reports" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
// //               Reports
// //             </Link>
// //             <Link to="/about" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
// //               About
// //             </Link>
// //             <Link to="/contact" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
// //               Contact
// //             </Link>
// //             <div className="border-t border-gray-100 pt-2 mt-2">
// //               <Link to="/profile" className="flex items-center py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
// //                 <span className="mr-2">👤</span>
// //                 Profile
// //               </Link>
// //               <div className="flex items-center py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
// //                 <span className="mr-2">🔔</span>
// //                 Notifications
// //                 {notifications > 0 && (
// //                   <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
// //                     {notifications}
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;

// // import React from "react";
// // import { Link } from "react-router-dom";
// // import { auth } from "../../firebase/firebaseConfig";

// // const Navbar = () => {
// //   return (
// //     <nav className="bg-blue-500 p-4 text-white flex justify-between items-center shadow-lg">
// //       <div>
// //         <Link to="/dashboard" className="text-xl font-bold">Perceptria</Link>
// //       </div>
// //       <div className="space-x-6">
// //         <Link to="/upload-report" className="hover:text-gray-200">Upload Report</Link>
// //         <Link to="/compare-reports" className="hover:text-gray-200">Compare Reports</Link>
// //         <Link to="/track-health" className="hover:text-gray-200">Track Health</Link>
// //         <Link to="/about" className="hover:text-gray-200">About</Link>
// //         <Link to="/contact" className="hover:text-gray-200">Contact</Link>
// //       </div>
// //       <div>
// //         {auth.currentUser ? (
// //           <Link to="/profile" className="bg-white text-blue-500 px-4 py-2 rounded-full">
// //             Profile
// //           </Link>
// //         ) : (
// //           <Link to="/login" className="bg-white text-blue-500 px-4 py-2 rounded-full">
// //             Login
// //           </Link>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // };

// // export default Navbar;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState(3);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo and brand */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <div className="w-8 h-8 rounded-md bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg mr-2">P</div>
//               <span className="text-xl font-bold text-gray-800">Perceptria</span>
//             </Link>
//           </div>

//           {/* Desktop navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/" className="text-gray-700 hover:text-indigo-600 transition font-medium">Home</Link>
//             <Link to="/dashboard" className="text-indigo-600 transition font-medium border-b-2 border-indigo-600">Dashboard</Link>
//             <Link to="/uploadreport" className="text-gray-700 hover:text-indigo-600 transition font-medium">Reports</Link>
//             <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium">About</Link>
//             <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition font-medium">Contact</Link>
//           </div>

//           {/* User menu & notifications */}
//           <div className="hidden md:flex items-center">
//             <div className="mr-4 relative">
//               <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
//                 <span className="text-gray-600">🔔</span>
//                 {notifications > 0 && (
//                   <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
//                     {notifications}
//                   </span>
//                 )}
//               </button>
//             </div>
//             <Link to="/profile" className="flex items-center">
//               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden mr-2">
//                 <img 
//                   src="https://via.placeholder.com/50" 
//                   alt="User" 
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <span className="text-sm font-medium text-gray-700">Sarah T.</span>
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button 
//               onClick={toggleMenu}
//               className="text-gray-600 hover:text-gray-900 focus:outline-none"
//             >
//               {isOpen ? (
//                 <span className="text-xl">✕</span>
//               ) : (
//                 <span className="text-xl">☰</span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {isOpen && (
//           <div className="md:hidden py-4 space-y-2 border-t border-gray-100">
//             <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
//               Home
//             </Link>
//             <Link to="/dashboard" className="block py-2 px-4 bg-indigo-50 text-indigo-600 rounded-md transition">
//               Dashboard
//             </Link>
//             <Link to="/reports" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
//               Reports
//             </Link>
//             <Link to="/about" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
//               About
//             </Link>
//             <Link to="/contact" className="block py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
//               Contact
//             </Link>
//             <div className="border-t border-gray-100 pt-2 mt-2">
//               <Link to="/profile" className="flex items-center py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
//                 <span className="mr-2">👤</span>
//                 Profile
//               </Link>
//               <div className="flex items-center py-2 px-4 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition">
//                 <span className="mr-2">🔔</span>
//                 Notifications
//                 {notifications > 0 && (
//                   <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                     {notifications}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { auth } from "../../firebase/firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";

// const Navbar = () => {
//   const [user, setUser] = useState(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState(3);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser || null); // Ensure user state updates dynamically
//     });

//     return () => unsubscribe();
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <div className="w-8 h-8 rounded-md bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg mr-2">P</div>
//               <span className="text-xl font-bold text-gray-800">Perceptria</span>
//             </Link>
//           </div>

//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition font-medium">Dashboard</Link>
//             <Link to="/uploadreport" className="text-gray-700 hover:text-indigo-600 transition font-medium">Upload Reports</Link>
//             <Link to="/comparereports" className="text-gray-700 hover:text-indigo-600 transition font-medium">Compare Reports</Link>
//             <Link to="/trackhealth" className="text-gray-700 hover:text-indigo-600 transition font-medium">Track Health</Link>
//             {/* <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium">About</Link>
//             <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition font-medium">Contact</Link> */}
//           </div>

//           <div className="hidden md:flex items-center">
//             <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
//               <span className="text-gray-600">🔔</span>
//               {notifications > 0 && (
//                 <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">{notifications}</span>
//               )}
//             </button>
//             {user ? (
//               <Link to="/profile" className="flex items-center ml-4">
//                 <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
//                   <img src={user.photoURL || "https://via.placeholder.com/50"} alt="User" className="w-full h-full object-cover" />
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">{user.displayName || "User"}</span>
//               </Link>
//             ) : (
//               <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-full">Login</Link>
//             )}
//           </div>

//           <div className="md:hidden">
//             <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none">
//               {isOpen ? "✕" : "☰"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { auth } from "../../firebase/firebaseConfig";
// import { onAuthStateChanged, signOut } from "firebase/auth";

// const Navbar = () => {
//   const [user, setUser] = useState(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState(3);
//   const navigate = useNavigate(); // Use the hook inside the component

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser || null); // Ensure user state updates dynamically
//     });

//     return () => unsubscribe();
//   }, []);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/");
//     } catch (error) {
//       console.error("Error logging out:", error);
//     }
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <div className="w-8 h-8 rounded-md bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg mr-2">P</div>
//               <span className="text-xl font-bold text-gray-800">Perceptria</span>
//             </Link>
//           </div>

//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition font-medium">Dashboard</Link>
//             <Link to="/upload-report" className="text-gray-700 hover:text-indigo-600 transition font-medium">Upload Reports</Link>
//             <Link to="/comparereports" className="text-gray-700 hover:text-indigo-600 transition font-medium">Compare Reports</Link>
//             <Link to="/trackhealth" className="text-gray-700 hover:text-indigo-600 transition font-medium">Track Health</Link>
//             {/* <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium">About</Link>
//             <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition font-medium">Contact</Link> */}
//           </div>

//           <div className="hidden md:flex items-center">
//             <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
//               <span className="text-gray-600">🔔</span>
//               {notifications > 0 && (
//                 <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">{notifications}</span>
//               )}
//             </button>
//             {user ? (
//               <button
//                 onClick={handleLogout}
//                 className="ml-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
//               >
//                 Logout
//               </button>
//             ) : (
//               <Link to="" className="bg-indigo-600 text-white px-4 py-2 rounded-full">Login</Link>
//             )}
//           </div>

//           <div className="md:hidden">
//             <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none">
//               {isOpen ? "✕" : "☰"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  // Static reminder data
  const reminderData = {
    "patient_name": "GEETABEN VINODBHAI SOLANKI",
    "date_generated": "2025-04-05",
    "health_factors": [
      "RBC Count",
      "Hemoglobin",
      "PCV",
      "MCV",
      "MCH",
      "MCHC",
      "Total Cholesterol",
      "LDL Cholesterol",
      "Serum B12 Levels"
    ],
    "schedule": {
      "Day 1": {
        "morning": "Morning: Focus on medication adherence. Check RBC Count levels.",
        "afternoon": "Afternoon: Have a healthy snack for RBC Count management.",
        "evening": "Evening: Prepare for tomorrow by planning meals."
      },
      "Day 2": {
        "morning": "Morning: Focus on dietary monitoring. Check RBC Count levels.",
        "afternoon": "Afternoon: Hydrate well for RBC Count management.",
        "evening": "Evening: Prepare for tomorrow by setting reminders."
      },
      "Day 3": {
        "morning": "Morning: Focus on physical activity. Check RBC Count levels.",
        "afternoon": "Afternoon: Take a walk for RBC Count management.",
        "evening": "Evening: Prepare for tomorrow by reviewing symptoms."
      },
      "Day 4": {
        "morning": "Morning: Focus on symptom tracking. Check RBC Count levels.",
        "afternoon": "Afternoon: Have a healthy snack for RBC Count management.",
        "evening": "Evening: Prepare for tomorrow by planning meals."
      },
      "Day 5": {
        "morning": "Morning: Focus on stress management. Check RBC Count levels.",
        "afternoon": "Afternoon: Hydrate well for RBC Count management.",
        "evening": "Evening: Prepare for tomorrow by setting reminders."
      },
      "Day 6": {
        "morning": "Morning: Focus on hydration. Check RBC Count levels.",
        "afternoon": "Afternoon: Take a walk for RBC Count management.",
        "evening": "Evening: Prepare for tomorrow by reviewing symptoms."
      },
      "Day 7": {
        "morning": "Morning: Focus on sleep quality. Check RBC Count levels.",
        "afternoon": "Afternoon: Have a healthy snack for RBC Count management.",
        "evening": "Evening: Prepare for tomorrow by planning meals."
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    // Mark notifications as read when opening
    if (!showNotifications && notifications > 0) {
      setNotifications(0);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Get today's date to determine which day's reminders to show
  const today = new Date();
  const dayNumber = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const dayKey = `Day ${dayNumber === 0 ? 7 : dayNumber}`; // Convert to "Day 1" to "Day 7"
  const todaysReminders = reminderData.schedule[dayKey] || {};

  return (
    <nav className="bg-white shadow-md relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg mr-2">P</div>
              <span className="text-xl font-bold text-gray-800">Perceptria</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition font-medium">Dashboard</Link>
            <Link to="/upload-report" className="text-gray-700 hover:text-indigo-600 transition font-medium">Upload Reports</Link>
            <Link to="/userdashboard" className="text-gray-700 hover:text-indigo-600 transition font-medium">Compare Reports</Link>
            {/* <Link to="/trackhealth" className="text-gray-700 hover:text-indigo-600 transition font-medium">Track Health</Link> */}
          </div>

          <div className="hidden md:flex items-center">
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 transition relative"
              >
                {/* <span className="text-gray-600">🔔</span>
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {notifications}
                  </span> */}
                {/* )} */}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <h3 className="font-bold text-indigo-800">Hello, {reminderData.patient_name.split(" ")[0]}!</h3>
                    <p className="text-sm text-gray-600">Here are your reminders for today</p>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {Object.entries(todaysReminders).map(([time, reminder]) => (
                      <div key={time} className="p-3 hover:bg-gray-50 transition">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            {time === 'morning' ? '☀️' : time === 'afternoon' ? '⛅' : '🌙'}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-800">{reminder}</p>
                            <p className="text-xs text-gray-500 mt-1">{time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-gray-50 text-center">
                    <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                      View all reminders
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {user ? (
              <button
                onClick={handleLogout}
                className="ml-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
              >
                Logout
              </button>
            ) : (
              <Link to="" className="bg-indigo-600 text-white px-4 py-2 rounded-full">Login</Link>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;