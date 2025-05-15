


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
//   FaTimes,
//   FaEdit
// } from "react-icons/fa";
// import { motion } from "framer-motion";

// const WelcomePage = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showNotificationModal, setShowNotificationModal] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isEditingNumber, setIsEditingNumber] = useState(false);
//   const [notifications, setNotifications] = useState(true);
//   const [saveStatus, setSaveStatus] = useState("");
//   const [sentTimes, setSentTimes] = useState([]);
//   const [lastSentDate, setLastSentDate] = useState("");
//   const navigate = useNavigate();

//   // Reminders data
//   const reminders = {
//     Monday: {
//       "07:00": "Good morning! 🌞 Start your day with 20 mins of gentle yoga – deep breathing, stretches, and slow movements.",
//       "09:00": "Fuel up! 🍽️ Try a bowl of oats with chia seeds, almond milk, and 2 boiled eggs.",
//       "14:00": "Hydration check! 💧 Have a glass of water, and if today's your med/supplement time – take them now!",
//       "16:31": "Let's move! 🚶‍♂️Go for a brisk 25-minute walk.",
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
          
//           // Retrieve phone number and notification preferences if stored
//           if (docSnap.data().phoneNumber) {
//             setPhoneNumber(docSnap.data().phoneNumber);
//           }
          
//           if (docSnap.data().notificationsEnabled !== undefined) {
//             setNotifications(docSnap.data().notificationsEnabled);
//           }
          
//           if (docSnap.data().lastSentDate) {
//             setLastSentDate(docSnap.data().lastSentDate);
//           }
          
//           if (docSnap.data().sentTimes) {
//             setSentTimes(docSnap.data().sentTimes);
//           }
//         } else {
//           console.log("No user document found!");
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   // Function to save user preferences to Firestore
//   const saveUserPreferences = async () => {
//     if (!user) return;
    
//     try {
//       const userRef = doc(db, "users", user.uid);
//       const docSnap = await getDoc(userRef);
      
//       if (docSnap.exists()) {
//         await updateDoc(userRef, {
//           phoneNumber: phoneNumber,
//           notificationsEnabled: notifications,
//           lastSentDate: lastSentDate,
//           sentTimes: sentTimes
//         });
//       } else {
//         await setDoc(userRef, {
//           phoneNumber: phoneNumber,
//           notificationsEnabled: notifications,
//           lastSentDate: lastSentDate,
//           sentTimes: sentTimes,
//           name: userName || user.displayName || "User"
//         });
//       }
//     } catch (error) {
//       console.error("Error saving user preferences:", error);
//     }
//   };

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
    
//     // Check if we have an exact match for current time
//     if (todayReminders && todayReminders[currentTime]) {
//       return { message: todayReminders[currentTime], time: currentTime };
//     }
    
//     // Otherwise, find the next upcoming reminder
//     if (todayReminders) {
//       const times = Object.keys(todayReminders).sort();
//       for (const time of times) {
//         if (time > currentTime) {
//           return { message: todayReminders[time], time: time, isUpcoming: true };
//         }
//       }
//     }
    
//     // If no upcoming reminders today, return the first reminder for today
//     if (todayReminders && Object.keys(todayReminders).length > 0) {
//       const firstReminderTime = Object.keys(todayReminders).sort()[0];
//       return { message: todayReminders[firstReminderTime], time: firstReminderTime };
//     }
    
//     return null;
//   };

//   // Function to send SMS
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

//   // Function to check if today's reminders have been sent
//   const isTodayRemindersAlreadySent = () => {
//     const today = new Date().toLocaleDateString();
//     return today === lastSentDate;
//   };

//   // Function to check and send reminder when needed
//   const checkAndSendReminder = async () => {
//     if (!notifications || !phoneNumber) return;
    
//     const now = new Date();
//     const today = now.toLocaleDateString();
//     const todayDay = now.toLocaleDateString('en-US', { weekday: 'long' });
//     const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
//     // Reset sent times if it's a new day
//     if (today !== lastSentDate) {
//       setSentTimes([]);
//       setLastSentDate(today);
//     }
    
//     // Get all reminders for today
//     const todayReminders = reminders[todayDay];
//     if (!todayReminders) return;
    
//     // Check if there are any reminders that should be sent now
//     for (const time in todayReminders) {
//       if (
//         time <= currentTime && // The scheduled time has passed
//         !sentTimes.includes(time) // We haven't sent this reminder yet
//       ) {
//         const message = todayReminders[time];
//         const success = await sendSMS(message);
        
//         if (success) {
//           // Update sent times and save to Firestore
//           const newSentTimes = [...sentTimes, time];
//           setSentTimes(newSentTimes);
//           saveUserPreferences();
//         }
//       }
//     }
//   };

//   // Function to handle manual send notification
//   const handleSendNotification = async () => {
//     if (!phoneNumber) {
//       setSaveStatus("error");
//       return;
//     }
    
//     // Get a reminder message (either current time or first available)
//     const reminder = getCurrentReminderMessage();
    
//     if (!reminder) {
//       setSaveStatus("no-reminder");
//       setTimeout(() => setSaveStatus(""), 3000);
//       return;
//     }

//     const success = await sendSMS(reminder.message);
//     if (success) {
//       const newSentTimes = [...sentTimes, reminder.time];
//       setSentTimes(newSentTimes);
//       saveUserPreferences();
//     }
//   };

//   // Function to save phone number
//   const handleSavePhoneNumber = async () => {
//     if (!validatePhoneNumber(phoneNumber.replace(/\s+/g, ''))) {
//       setSaveStatus("invalid-number");
//       setTimeout(() => setSaveStatus(""), 3000);
//       return;
//     }
    
//     setSaveStatus("saving");
//     await saveUserPreferences();
//     setSaveStatus("success");
//     setIsEditingNumber(false);
//     setTimeout(() => setSaveStatus(""), 3000);
    
//     // Check if we should send reminders now
//     checkAndSendReminder();
//   };

//   // Set up the background reminder checker
//   useEffect(() => {
//     if (!notifications || !phoneNumber) return;
    
//     // Run immediately when component mounts
//     checkAndSendReminder();
    
//     // Then check every minute
//     const intervalId = setInterval(() => {
//       checkAndSendReminder();
//     }, 60000);
    
//     return () => clearInterval(intervalId);
//   }, [phoneNumber, sentTimes, notifications, lastSentDate]);

//   // Save user preferences whenever they change
//   useEffect(() => {
//     if (user && !loading) {
//       saveUserPreferences();
//     }
//   }, [phoneNumber, notifications]);

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
//               {phoneNumber && notifications && (
//                 <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-3 h-3"></span>
//               )}
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
//               onClick={() => navigate("/userdashboard")}
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
//                 {phoneNumber && !isEditingNumber ? (
//                   <div>
//                     <label className="block text-gray-700 text-sm font-medium mb-2">
//                       Your phone number:
//                     </label>
//                     <div className="flex items-center">
//                       <p className="text-gray-800 font-medium">{phoneNumber}</p>
//                       <button 
//                         onClick={() => setIsEditingNumber(true)}
//                         className="ml-2 text-indigo-600 hover:text-indigo-800"
//                       >
//                         <FaEdit />
//                       </button>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                       We're sending daily health reminders to this number.
//                     </p>
//                   </div>
//                 ) : (
//                   <div>
//                     <label className="block text-gray-700 text-sm font-medium mb-2">
//                       {phoneNumber ? "Update your phone number:" : "Enter your phone number:"}
//                     </label>
//                     <div className="flex">
//                       <input
//                         type="tel"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                         placeholder="e.g., +91 8780600732"
//                         className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       />
//                       <button
//                         onClick={handleSavePhoneNumber}
//                         className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 transition-colors"
//                       >
//                         Save
//                       </button>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                       We'll send you daily health reminders based on the day of the week.
//                     </p>
//                   </div>
//                 )}
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

//             {/* Upcoming Reminders Section */}
//             {phoneNumber && notifications && (
//               <div className="mb-6 border-t pt-4">
//                 <h4 className="text-md font-medium text-gray-800 mb-2">Today's Reminders</h4>
//                 <div className="bg-gray-50 p-3 rounded-md">
//                   {Object.entries(reminders[new Date().toLocaleDateString('en-US', { weekday: 'long' })] || {})
//                     .sort((a, b) => a[0].localeCompare(b[0]))
//                     .map(([time, message]) => (
//                       <div key={time} className="mb-2 last:mb-0">
//                         <p className="text-sm">
//                           <span className="font-medium">{time}</span> - 
//                           <span className={sentTimes.includes(time) ? "text-green-600 line-through" : "text-gray-700"}>
//                             {message.length > 50 ? message.substring(0, 50) + "..." : message}
//                           </span>
//                           {sentTimes.includes(time) && <span className="text-xs text-green-600 ml-2">(Sent)</span>}
//                         </p>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}
            
//             <div className="flex justify-between">
//               <button
//                 onClick={() => setShowNotificationModal(false)}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
//               >
//                 Close
//               </button>
              
//               {phoneNumber && (
//                 <button
//                   onClick={handleSendNotification}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
//                   disabled={saveStatus === "saving"}
//                 >
//                   {saveStatus === "saving" ? (
//                     <>
//                       <span className="mr-2">Sending...</span>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     </>
//                   ) : (
//                     <>Send test reminder</>
//                   )}
//                 </button>
//               )}
//             </div>
            
//             {/* Status Messages */}
//             {saveStatus && (
//               <div className={`mt-4 p-3 rounded-md ${
//                 saveStatus === "success" ? "bg-green-50 text-green-800" :
//                 saveStatus === "error" ? "bg-red-50 text-red-800" :
//                 saveStatus === "invalid-number" ? "bg-yellow-50 text-yellow-800" :
//                 saveStatus === "no-reminder" ? "bg-yellow-50 text-yellow-800" :
//                 "bg-blue-50 text-blue-800"
//               }`}>
//                 {saveStatus === "success" && "Success! Your settings have been saved."}
//                 {saveStatus === "error" && "Error! Please enter a valid phone number first."}
//                 {saveStatus === "invalid-number" && "Please enter a valid phone number in international format (e.g., +91 8780600732)."}
//                 {saveStatus === "no-reminder" && "No reminders available for today."}
//                 {saveStatus === "saving" && "Processing your request..."}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Footer Section */}
      
//     </div>
//   );
// };

// export default WelcomePage;

// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
//   FaTimes,
//   FaEdit
// } from "react-icons/fa";
// import { motion } from "framer-motion";

// const WelcomePage = () => {
//   const [user, setUser] = useState(null);
//   const [userName, setUserName] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showNotificationModal, setShowNotificationModal] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isEditingNumber, setIsEditingNumber] = useState(false);
//   const [notifications, setNotifications] = useState(true);
//   const [saveStatus, setSaveStatus] = useState("");
//   const [sentTimes, setSentTimes] = useState([]);
//   const [lastSentDate, setLastSentDate] = useState("");
//   const navigate = useNavigate();

//   // Reminders data
//   const reminders = {
//     Monday: {
//       "07:00": "Good morning! 🌞 Start your day with 20 mins of gentle yoga – deep breathing, stretches, and slow movements.",
//       "09:00": "Fuel up! 🍽️ Try a bowl of oats with chia seeds, almond milk, and 2 boiled eggs.",
//       "14:00": "Hydration check! 💧 Have a glass of water, and if today's your med/supplement time – take them now!",
//       "16:31": "Let's move! 🚶‍♂️Go for a brisk 25-minute walk.",
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

//   // Load user data and notification preferences
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
          
//           // Retrieve phone number and notification preferences if stored
//           if (docSnap.data().phoneNumber) {
//             setPhoneNumber(docSnap.data().phoneNumber);
//           }
          
//           if (docSnap.data().notificationsEnabled !== undefined) {
//             setNotifications(docSnap.data().notificationsEnabled);
//           }
          
//           if (docSnap.data().lastSentDate) {
//             setLastSentDate(docSnap.data().lastSentDate);
//           }
          
//           if (docSnap.data().sentTimes) {
//             setSentTimes(docSnap.data().sentTimes);
//           }
//         } else {
//           console.log("No user document found!");
//         }
//         setLoading(false);
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   // Function to save user preferences to Firestore
//   const saveUserPreferences = async () => {
//     if (!user) return;
    
//     try {
//       const userRef = doc(db, "users", user.uid);
//       const docSnap = await getDoc(userRef);
      
//       if (docSnap.exists()) {
//         await updateDoc(userRef, {
//           phoneNumber: phoneNumber,
//           notificationsEnabled: notifications,
//           lastSentDate: lastSentDate,
//           sentTimes: sentTimes
//         });
//       } else {
//         await setDoc(userRef, {
//           phoneNumber: phoneNumber,
//           notificationsEnabled: notifications,
//           lastSentDate: lastSentDate,
//           sentTimes: sentTimes,
//           name: userName || user.displayName || "User"
//         });
//       }
//       return true;
//     } catch (error) {
//       console.error("Error saving user preferences:", error);
//       return false;
//     }
//   };

//   // Function to validate phone number
//   const validatePhoneNumber = (number) => {
//     // Basic validation - ensure it starts with + and has at least 8 digits
//     const phoneRegex = /^\+\d{8,15}$/;
//     return phoneRegex.test(number.replace(/\s+/g, ''));
//   };

//   // Memoized function to get current and upcoming reminders
//   const getReminderSchedule = useCallback(() => {
//     const now = new Date();
//     const day = now.toLocaleDateString('en-US', { weekday: 'long' });
//     const currentHour = now.getHours();
//     const currentMinute = now.getMinutes();
    
//     // Get all reminders for today
//     const todayReminders = reminders[day] || {};
//     const result = { 
//       currentReminders: [], 
//       upcomingReminders: []
//     };
    
//     // Sort times
//     const timesSorted = Object.keys(todayReminders).sort();
    
//     for (const timeStr of timesSorted) {
//       const [hourStr, minuteStr] = timeStr.split(':');
//       const hour = parseInt(hourStr, 10);
//       const minute = parseInt(minuteStr, 10);
      
//       const reminderObj = {
//         time: timeStr,
//         message: todayReminders[timeStr],
//         hour,
//         minute
//       };
      
//       // Check if this reminder should be active now
//       if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
//         result.currentReminders.push(reminderObj);
//       } else {
//         result.upcomingReminders.push(reminderObj);
//       }
//     }
    
//     return result;
//   }, [reminders]);

//   // Function to send SMS
//   const sendSMS = useCallback(async (message) => {
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
    
//     try {
//       const response = await axios.post('http://localhost:8000/api/send-sms/', {
//         phone_number: formattedPhone,
//         message: message,
//       }, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (response.status === 200) {
//         return true;
//       } else {
//         throw new Error(`Unexpected status code: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error sending SMS:", error);
//       return false;
//     }
//   }, [phoneNumber]);

//   // Enhanced function to check and send reminders
//   const checkAndSendReminder = useCallback(async () => {
//     if (!notifications || !phoneNumber || !validatePhoneNumber(phoneNumber.replace(/\s+/g, ''))) {
//       return;
//     }
    
//     const now = new Date();
//     const today = now.toLocaleDateString();
//     const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
//     // Reset sent times if it's a new day
//     if (today !== lastSentDate) {
//       setSentTimes([]);
//       setLastSentDate(today);
//       await saveUserPreferences();
//     }
    
//     // Get the current reminders schedule
//     const { currentReminders } = getReminderSchedule();
    
//     // Check if there are any reminders that should be sent
//     for (const reminder of currentReminders) {
//       // Skip if we've already sent this reminder today
//       if (sentTimes.includes(reminder.time)) {
//         continue;
//       }
      
//       console.log(`Attempting to send reminder scheduled for ${reminder.time}`);
//       const success = await sendSMS(reminder.message);
      
//       if (success) {
//         console.log(`Successfully sent reminder for ${reminder.time}`);
//         // Update sent times 
//         const newSentTimes = [...sentTimes, reminder.time];
//         setSentTimes(newSentTimes);
        
//         // Save to Firestore after sending successfully
//         await saveUserPreferences();
//       }
//     }
//   }, [
//     notifications, 
//     phoneNumber, 
//     lastSentDate, 
//     sentTimes,
//     validatePhoneNumber,
//     getReminderSchedule,
//     sendSMS,
//     saveUserPreferences
//   ]);

//   // Function to handle manual send notification
//   const handleSendNotification = async () => {
//     if (!phoneNumber) {
//       setSaveStatus("error");
//       setTimeout(() => setSaveStatus(""), 2000);
//       return;
//     }
    
//     setSaveStatus("saving");
    
//     // Get current reminder schedule
//     const { currentReminders, upcomingReminders } = getReminderSchedule();
    
//     // Determine which reminder to send (priority: current unsent → next upcoming)
//     let reminderToSend = null;
    
//     // First try to find an unsent current reminder
//     for (const reminder of currentReminders) {
//       if (!sentTimes.includes(reminder.time)) {
//         reminderToSend = reminder;
//         break;
//       }
//     }
    
//     // If no current unsent reminders, use the next upcoming one
//     if (!reminderToSend && upcomingReminders.length > 0) {
//       reminderToSend = upcomingReminders[0];
//     }
    
//     // If still no reminder found, use the first of today's reminders
//     if (!reminderToSend && currentReminders.length > 0) {
//       reminderToSend = currentReminders[0];
//     }
    
//     if (!reminderToSend) {
//       setSaveStatus("no-reminder");
//       setTimeout(() => setSaveStatus(""), 3000);
//       return;
//     }

//     const success = await sendSMS(reminderToSend.message);
    
//     if (success) {
//       // Only mark as sent if it was actually scheduled for now or before
//       if (currentReminders.some(r => r.time === reminderToSend.time)) {
//         const newSentTimes = [...sentTimes, reminderToSend.time];
//         setSentTimes(newSentTimes);
//         await saveUserPreferences();
//       }
//       setSaveStatus("success");
//     } else {
//       setSaveStatus("error");
//     }
    
//     setTimeout(() => setSaveStatus(""), 3000);
//   };

//   // Function to save phone number
//   const handleSavePhoneNumber = async () => {
//     if (!validatePhoneNumber(phoneNumber.replace(/\s+/g, ''))) {
//       setSaveStatus("invalid-number");
//       setTimeout(() => setSaveStatus(""), 3000);
//       return;
//     }
    
//     setSaveStatus("saving");
//     const success = await saveUserPreferences();
    
//     if (success) {
//       setSaveStatus("success");
//       setIsEditingNumber(false);
      
//       // Check if we should send reminders now
//       await checkAndSendReminder();
//     } else {
//       setSaveStatus("error");
//     }
    
//     setTimeout(() => setSaveStatus(""), 3000);
//   };

//   // Set up the enhanced background reminder checker with useEffect
//   useEffect(() => {
//     if (!notifications || !phoneNumber || !validatePhoneNumber(phoneNumber.replace(/\s+/g, ''))) {
//       return;
//     }
    
//     console.log("Setting up reminder checking interval");
    
//     // Run immediately when component mounts or dependencies change
//     checkAndSendReminder();
    
//     // Then check every minute
//     const intervalId = setInterval(() => {
//       checkAndSendReminder();
//     }, 60000); // Check every minute
    
//     return () => {
//       console.log("Clearing reminder interval");
//       clearInterval(intervalId);
//     };
//   }, [
//     phoneNumber, 
//     notifications, 
//     sentTimes, 
//     lastSentDate, 
//     validatePhoneNumber,
//     checkAndSendReminder
//   ]);

//   // Register the user for server-side scheduled reminders
//   useEffect(() => {
//     const registerForReminders = async () => {
//       if (!user || !phoneNumber || !notifications || !validatePhoneNumber(phoneNumber.replace(/\s+/g, ''))) {
//         return;
//       }
      
//       try {
//         // Register the user's phone for server-side scheduled reminders
//         await axios.post('http://localhost:8000/api/register-reminders/', {
//           user_id: user.uid,
//           phone_number: phoneNumber.replace(/\s+/g, ''),
//           enabled: notifications,
//           // Send the reminders schedule to the server
//           reminders: reminders
//         });
        
//         console.log("Successfully registered for server-side reminders");
//       } catch (error) {
//         console.error("Failed to register for server-side reminders:", error);
//       }
//     };
    
//     registerForReminders();
//   }, [user, phoneNumber, notifications, validatePhoneNumber, reminders]);

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
//               {phoneNumber && notifications && (
//                 <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-3 h-3"></span>
//               )}
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
//               onClick={() => navigate("/userdashboard")}
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
//                 {phoneNumber && !isEditingNumber ? (
//                   <div>
//                     <label className="block text-gray-700 text-sm font-medium mb-2">
//                       Your phone number:
//                     </label>
//                     <div className="flex items-center">
//                       <p className="text-gray-800 font-medium">{phoneNumber}</p>
//                       <button 
//                         onClick={() => setIsEditingNumber(true)}
//                         className="ml-2 text-indigo-600 hover:text-indigo-800"
//                       >
//                         <FaEdit />
//                       </button>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                       {notifications 
//                         ? "We're sending daily health reminders to this number." 
//                         : "Reminders are currently disabled. Enable them below to receive updates."
//                       }
//                     </p>
//                   </div>
//                 ) : (
//                   <div>
//                     <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-medium mb-2">
//                       Enter your phone number:
//                     </label>
//                     <input
//                       type="tel"
//                       id="phoneNumber"
//                       className="w-full p-2 border border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
//                       placeholder="+1 123 456 7890"
//                       value={phoneNumber}
//                       onChange={(e) => setPhoneNumber(e.target.value)}
//                     />
//                     <p className="text-xs text-gray-500 mt-1">
//                       Format: +[country code] [number] (e.g., +1 123 456 7890)
//                     </p>
//                   </div>
//                 )}

//                 {saveStatus === "invalid-number" && (
//                   <p className="text-red-500 text-sm mt-2">
//                     Please enter a valid phone number with country code (e.g., +1 123 456 7890)
//                   </p>
//                 )}
//               </div>
              
//               <div className="mb-6">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     className="rounded text-indigo-600 focus:ring-indigo-500 h-5 w-5"
//                     checked={notifications}
//                     onChange={(e) => setNotifications(e.target.checked)}
//                   />
//                   <span className="ml-2 text-gray-700">Enable health reminders</span>
//                 </label>
//                 <p className="text-xs text-gray-500 mt-1">
//                   You'll receive personalized wellness reminders throughout the day.
//                 </p>
//               </div>
              
//               <div className="flex flex-col space-y-3 mt-6">
//                 {isEditingNumber || !phoneNumber ? (
//                   <button
//                     onClick={handleSavePhoneNumber}
//                     className={`bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors ${
//                       saveStatus === "saving" ? "opacity-70 cursor-not-allowed" : ""
//                     }`}
//                     disabled={saveStatus === "saving"}
//                   >
//                     {saveStatus === "saving" ? "Saving..." : "Save Settings"}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleSendNotification}
//                     className={`bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors ${
//                       saveStatus === "saving" ? "opacity-70 cursor-not-allowed" : ""
//                     }`}
//                     disabled={saveStatus === "saving" || !notifications}
//                   >
//                     {saveStatus === "saving" ? "Sending..." : "Send Test Reminder"}
//                   </button>
//                 )}
                
//                 {saveStatus === "success" && (
//                   <p className="text-green-500 text-sm text-center">
//                     {isEditingNumber ? "Settings saved successfully!" : "Reminder sent successfully!"}
//                   </p>
//                 )}
                
//                 {saveStatus === "error" && (
//                   <p className="text-red-500 text-sm text-center">
//                     {isEditingNumber 
//                       ? "Error saving settings. Please try again." 
//                       : "Error sending reminder. Please check your phone number."}
//                   </p>
//                 )}
                
//                 {saveStatus === "no-reminder" && (
//                   <p className="text-amber-500 text-sm text-center">
//                     No active reminders found for the current time.
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             {/* Show current reminders */}
//             <div className="border-t pt-4">
//               <h4 className="font-medium text-gray-800 mb-2">Today's Reminders</h4>
//               <div className="max-h-60 overflow-y-auto">
//                 {Object.entries(getReminderSchedule().currentReminders).length > 0 ? (
//                   getReminderSchedule().currentReminders.map((reminder, index) => (
//                     <div 
//                       key={`current-${index}`}
//                       className={`p-3 mb-2 rounded ${
//                         sentTimes.includes(reminder.time) 
//                           ? "bg-green-50 border border-green-100" 
//                           : "bg-gray-50 border border-gray-100"
//                       }`}
//                     >
//                       <div className="flex justify-between">
//                         <span className="font-medium text-gray-800">{reminder.time}</span>
//                         {sentTimes.includes(reminder.time) && (
//                           <span className="text-green-600 text-xs">Sent</span>
//                         )}
//                       </div>
//                       <p className="text-gray-600 text-sm mt-1">{reminder.message}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-sm">No reminders so far today.</p>
//                 )}
                
//                 {Object.entries(getReminderSchedule().upcomingReminders).length > 0 && (
//                   <>
//                     <h4 className="font-medium text-gray-800 mt-4 mb-2">Upcoming Today</h4>
//                     {getReminderSchedule().upcomingReminders.map((reminder, index) => (
//                       <div 
//                         key={`upcoming-${index}`}
//                         className="p-3 mb-2 rounded bg-indigo-50 border border-indigo-100"
//                       >
//                         <span className="font-medium text-gray-800">{reminder.time}</span>
//                         <p className="text-gray-600 text-sm mt-1">{reminder.message}</p>
//                       </div>
//                     ))}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

      
//     </div>
//   );
// };

// export default WelcomePage;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import axios from 'axios';
import { 
  FaFileMedical, 
  FaHeartbeat, 
  FaCalendarCheck, 
  FaUserMd, 
  FaUpload,
  FaUser,
  FaBell,
  FaTimes,
  FaEdit,
  FaClock
} from "react-icons/fa";
import { motion } from "framer-motion";

const WelcomePage = () => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [sentTimes, setSentTimes] = useState([]);
  const [lastSentDate, setLastSentDate] = useState("");
  const [showComingSoonToast, setShowComingSoonToast] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState("");
  const navigate = useNavigate();

  // Reminders data
  const reminders = {
    Monday: {
      "07:00": "Good morning! 🌞 Start your day with 20 mins of gentle yoga – deep breathing, stretches, and slow movements.",
      "09:00": "Fuel up! 🍽️ Try a bowl of oats with chia seeds, almond milk, and 2 boiled eggs.",
      "14:00": "Hydration check! 💧 Have a glass of water, and if today's your med/supplement time – take them now!",
      "16:31": "Let's move! 🚶‍♂️Go for a brisk 25-minute walk.",
      "21:00": "Wind down time 🌙 Sip some warm turmeric milk, cozy up, and turn off screens by 9:30 PM."
    },
    Tuesday: {
      "07:00": "Rise & shine 🌅 — let's get 20–30 mins of light cardio (like a walk, cycling, or dancing to your playlist).",
      "09:00": "Time for a powerhouse breakfast! 🥬 Scrambled eggs + sautéed spinach + whole grain toast.",
      "14:00": "Snack break! 🥜 A handful of almonds + a small piece of dark chocolate or dates.",
      "17:00": "Move & groove! 💃 Resistance band exercises or bodyweight squats for 20 mins.",
      "21:00": "Unwind time 🛁 Try 5 mins of slow breathing or legs-up-the-wall yoga pose."
    },
    Wednesday: {
      "07:00": "Wake up and stretch! 🧘 Try 15 mins of mindful movement.",
      "09:00": "Breakfast time! 🍳 Avocado toast + Greek yogurt + berries.",
      "14:00": "Mindful check-in 🧠 Pause and take 5 deep breaths. Hydrate too!",
      "17:00": "Workout time 💪 Do a 20-min bodyweight circuit.",
      "21:00": "Quiet your mind 🧘‍♀️ Journal or listen to calming music before bed."
    },
    Thursday: {
      "07:00": "Energy boost 🌞 Try a 15-min walk outdoors or stair climbs.",
      "09:00": "Eat smart 🍴 Whole grain cereal + banana + boiled egg.",
      "14:00": "Quick mobility break! 🧍‍♂️ Shoulder rolls, neck stretches & deep breathing.",
      "17:00": "Strength time 🏋️‍♂️ Resistance bands or light weights – 3 sets.",
      "21:00": "Digital detox 📵 Dim lights and avoid screens before bed."
    },
    Friday: {
      "07:00": "Happy Friday! 🎉 Gentle wake-up yoga or dance it out!",
      "09:00": "Colorful breakfast 🌈 Fruit smoothie + multigrain toast + nut butter.",
      "14:00": "Refuel break! 🍵 Herbal tea + a handful of roasted seeds.",
      "17:00": "Stretch & walk 🚶Take a stroll or light stretches.",
      "21:20": "Reflect & rest 📔 Write 3 good things from your week."
    },
    Saturday: {
      "08:00": "Slow start ☕ Enjoy a mindful tea or coffee moment.",
      "10:00": "Brunch time! 🍳 Veggie omelette + toast + fruit salad.",
      "15:00": "Nature time 🌿 Step outside, breathe, or sit in the sun.",
      "18:00": "Fun activity 🕺 Try dancing, biking, or a hobby.",
      "21:30": "Chill zone 😌 Light stretching or aromatherapy to unwind."
    },
    Sunday: {
      "08:00": "Sleep in & stretch 🛌🧘‍♂️ Gentle movement to wake up the body.",
      "10:00": "Nourish up! 🥣 Quinoa bowl with avocado & veggies.",
      "14:00": "Midday breather 🌤️ 5 mins of silence or nature sounds.",
      "18:33": "Prep for the week 📅 Light meal prep or planning.",
      "21:00": "Self-care ritual 🛁 Face mask, gratitude journaling, early rest."
    }
  };

  // Load user data and notification preferences
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setUser(currentUser);
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().name);
          
          // Retrieve phone number and notification preferences if stored
          if (docSnap.data().phoneNumber) {
            setPhoneNumber(docSnap.data().phoneNumber);
          }
          
          if (docSnap.data().notificationsEnabled !== undefined) {
            setNotifications(docSnap.data().notificationsEnabled);
          }
          
          if (docSnap.data().lastSentDate) {
            setLastSentDate(docSnap.data().lastSentDate);
          }
          
          if (docSnap.data().sentTimes) {
            setSentTimes(docSnap.data().sentTimes);
          }
        } else {
          console.log("No user document found!");
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Function to handle coming soon features
  const handleComingSoonFeature = (featureName) => {
    setComingSoonMessage(`${featureName} feature will be available soon!`);
    setShowComingSoonToast(true);
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setShowComingSoonToast(false);
    }, 3000);
  };

  // Function to save user preferences to Firestore
  const saveUserPreferences = async () => {
    if (!user) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        await updateDoc(userRef, {
          phoneNumber: phoneNumber,
          notificationsEnabled: notifications,
          lastSentDate: lastSentDate,
          sentTimes: sentTimes
        });
      } else {
        await setDoc(userRef, {
          phoneNumber: phoneNumber,
          notificationsEnabled: notifications,
          lastSentDate: lastSentDate,
          sentTimes: sentTimes,
          name: userName || user.displayName || "User"
        });
      }
      return true;
    } catch (error) {
      console.error("Error saving user preferences:", error);
      return false;
    }
  };

  // Function to validate phone number
  const validatePhoneNumber = (number) => {
    // Basic validation - ensure it starts with + and has at least 8 digits
    const phoneRegex = /^\+\d{8,15}$/;
    return phoneRegex.test(number.replace(/\s+/g, ''));
  };

  // Memoized function to get current and upcoming reminders
  const getReminderSchedule = useCallback(() => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Get all reminders for today
    const todayReminders = reminders[day] || {};
    const result = { 
      currentReminders: [], 
      upcomingReminders: []
    };
    
    // Sort times
    const timesSorted = Object.keys(todayReminders).sort();
    
    for (const timeStr of timesSorted) {
      const [hourStr, minuteStr] = timeStr.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      
      const reminderObj = {
        time: timeStr,
        message: todayReminders[timeStr],
        hour,
        minute
      };
      
      // Check if this reminder should be active now
      if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
        result.currentReminders.push(reminderObj);
      } else {
        result.upcomingReminders.push(reminderObj);
      }
    }
    
    return result;
  }, [reminders]);

  // Function to send SMS
  const sendSMS = useCallback(async (message) => {
    if (!phoneNumber) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
      return false;
    }
    
    const formattedPhone = phoneNumber.replace(/\s+/g, '');
    
    if (!validatePhoneNumber(formattedPhone)) {
      setSaveStatus("invalid-number");
      setTimeout(() => setSaveStatus(""), 3000);
      return false;
    }
    
    try {
      const response = await axios.post('http://localhost:8000/api/send-sms/', {
        phone_number: formattedPhone,
        message: message,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        return true;
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      return false;
    }
  }, [phoneNumber]);

  // Enhanced function to check and send reminders
  const checkAndSendReminder = useCallback(async () => {
    if (!notifications || !phoneNumber || !validatePhoneNumber(phoneNumber.replace(/\s+/g, ''))) {
      return;
    }
    
    const now = new Date();
    const today = now.toLocaleDateString();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Reset sent times if it's a new day
    if (today !== lastSentDate) {
      setSentTimes([]);
      setLastSentDate(today);
      await saveUserPreferences();
    }
    
    // Get the current reminders schedule
    const { currentReminders } = getReminderSchedule();
    
    // Check if there are any reminders that should be sent
    for (const reminder of currentReminders) {
      // Skip if we've already sent this reminder today
      if (sentTimes.includes(reminder.time)) {
        continue;
      }
      
      console.log(`Attempting to send reminder scheduled for ${reminder.time}`);
      const success = await sendSMS(reminder.message);
      
      if (success) {
        console.log(`Successfully sent reminder for ${reminder.time}`);
        // Update sent times 
        const newSentTimes = [...sentTimes, reminder.time];
        setSentTimes(newSentTimes);
        
        // Save to Firestore after sending successfully
        await saveUserPreferences();
      }
    }
  }, [
    notifications, 
    phoneNumber, 
    lastSentDate, 
    sentTimes,
    validatePhoneNumber,
    getReminderSchedule,
    sendSMS,
    saveUserPreferences
  ]);

  // Function to handle manual send notification
  const handleSendNotification = async () => {
    if (!phoneNumber) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
      return;
    }
    
    setSaveStatus("saving");
    
    // Get current reminder schedule
    const { currentReminders, upcomingReminders } = getReminderSchedule();
    
    // Determine which reminder to send (priority: current unsent → next upcoming)
    let reminderToSend = null;
    
    // First try to find an unsent current reminder
    for (const reminder of currentReminders) {
      if (!sentTimes.includes(reminder.time)) {
        reminderToSend = reminder;
        break;
      }
    }
    
    // If no current unsent reminders, use the next upcoming one
    if (!reminderToSend && upcomingReminders.length > 0) {
      reminderToSend = upcomingReminders[0];
    }
    
    // If still no reminder found, use the first of today's reminders
    if (!reminderToSend && currentReminders.length > 0) {
      reminderToSend = currentReminders[0];
    }
    
    if (!reminderToSend) {
      setSaveStatus("no-reminder");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }

    const success = await sendSMS(reminderToSend.message);
    
    if (success) {
      // Only mark as sent if it was actually scheduled for now or before
      if (currentReminders.some(r => r.time === reminderToSend.time)) {
        const newSentTimes = [...sentTimes, reminderToSend.time];
        setSentTimes(newSentTimes);
        await saveUserPreferences();
      }
      setSaveStatus("success");
    } else {
      setSaveStatus("error");
    }
    
    setTimeout(() => setSaveStatus(""), 3000);
  };

  // Function to save phone number
  const handleSavePhoneNumber = async () => {
    if (!validatePhoneNumber(phoneNumber.replace(/\s+/g, ''))) {
      setSaveStatus("invalid-number");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }
    
    setSaveStatus("saving");
    const success = await saveUserPreferences();
    
    if (success) {
      setSaveStatus("success");
      setIsEditingNumber(false);
      
      // Check if we should send reminders now
      await checkAndSendReminder();
    } else {
      setSaveStatus("error");
    }
    
    setTimeout(() => setSaveStatus(""), 3000);
  };

  // Set up the enhanced background reminder checker with useEffect
  useEffect(() => {
    if (!notifications || !phoneNumber || !validatePhoneNumber(phoneNumber.replace(/\s+/g, ''))) {
      return;
    }
    
    console.log("Setting up reminder checking interval");
    
    // Run immediately when component mounts or dependencies change
    checkAndSendReminder();
    
    // Then check every minute
    const intervalId = setInterval(() => {
      checkAndSendReminder();
    }, 60000); // Check every minute
    
    return () => {
      console.log("Clearing reminder interval");
      clearInterval(intervalId);
    };
  }, [
    phoneNumber, 
    notifications, 
    sentTimes, 
    lastSentDate, 
    validatePhoneNumber,
    checkAndSendReminder
  ]);

  // Register the user for server-side scheduled reminders
  useEffect(() => {
    const registerForReminders = async () => {
      if (!user || !phoneNumber || !notifications || !validatePhoneNumber(phoneNumber.replace(/\s+/g, ''))) {
        return;
      }
      
      try {
        // Register the user's phone for server-side scheduled reminders
        await axios.post('http://localhost:8000/api/register-reminders/', {
          user_id: user.uid,
          phone_number: phoneNumber.replace(/\s+/g, ''),
          enabled: notifications,
          // Send the reminders schedule to the server
          reminders: reminders
        });
        
        console.log("Successfully registered for server-side reminders");
      } catch (error) {
        console.error("Failed to register for server-side reminders:", error);
      }
    };
    
    registerForReminders();
  }, [user, phoneNumber, notifications, validatePhoneNumber, reminders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-indigo-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Profile and Notification buttons */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600"></div>
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors relative"
              aria-label="Notifications"
              onClick={() => setShowNotificationModal(true)}
            >
              <FaBell className="text-gray-700" />
              {phoneNumber && notifications && (
                <span className="absolute -top-1 -right-1 bg-green-500 rounded-full w-3 h-3"></span>
              )}
            </button>
            <button 
              className="p-2 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors flex items-center justify-center"
              aria-label="User Profile"
              onClick={() => navigate("/userdashboard")}
            >
              <FaUser className="text-indigo-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          
          <h1 className="text-4xl font-bold text-indigo-900">
            Welcome to Perceptria, {userName || user?.displayName || "User"}
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
            Your intelligent health management platform. Access your information, 
            schedule appointments, and track your wellness journey in one secure place.
          </p>
        </motion.div>

        {/* Quick Actions Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Care Team Card - Coming Soon */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-indigo-400 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">Coming Soon</span>
            </div>
            <div className="flex items-center mb-4">
              <div className="bg-indigo-50 p-3 rounded-full">
                <FaUserMd className="text-indigo-500 text-xl" />
              </div>
              <h3 className="ml-4 text-xl font-semibold text-gray-800">Your Care Team</h3>
            </div>
            <p className="text-gray-600 mb-5">Access your healthcare providers and specialists all in one place.</p>
            <button 
              className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors flex items-center"
              onClick={() => handleComingSoonFeature("Care Team")}
            >
              <FaClock className="mr-1 text-sm" />
              Available in June 2025
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Appointments Card - Coming Soon */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-violet-400 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <span className="bg-violet-100 text-violet-800 text-xs font-medium px-2.5 py-0.5 rounded">Coming Soon</span>
            </div>
            <div className="flex items-center mb-4">
              <div className="bg-violet-50 p-3 rounded-full">
                <FaCalendarCheck className="text-violet-500 text-xl" />
              </div>
              <h3 className="ml-4 text-xl font-semibold text-gray-800">Appointments</h3>
            </div>
            <p className="text-gray-600 mb-5">Schedule, view, or reschedule your upcoming healthcare appointments.</p>
            <button 
              className="text-violet-600 font-medium hover:text-violet-700 transition-colors flex items-center"
              onClick={() => handleComingSoonFeature("Appointments")}
            >
              <FaClock className="mr-1 text-sm" />
              Available in July 2025
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-purple-400 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="bg-purple-50 p-3 rounded-full">
                <FaFileMedical className="text-purple-500 text-xl" />
              </div>
              <h3 className="ml-4 text-xl font-semibold text-gray-800">Health Records</h3>
            </div>
            <p className="text-gray-600 mb-5">View and manage your medical history, test results, and reports.</p>
            <button 
              className="text-purple-600 font-medium hover:text-purple-700 transition-colors flex items-center"
              onClick={() => navigate("/userdashboard")}
            >
              Access records
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Have medical documents to share?</h2>
            <p className="text-gray-700 mb-6">
              Upload your medical reports, test results, or any health-related documents securely to your profile.
              Perceptria will organize them for easy access and reference.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors flex items-center"
                onClick={() => navigate("/upload-report")}
              >
                <FaUpload className="mr-2" />
                Upload Documents
              </button>
            </div>
          </div>
          <div className="hidden lg:block absolute right-8 bottom-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8H14.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 16H4V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V16H21M3 16V8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8V16M3 16L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </div>

      {/* "Coming Soon" Toast Notification */}
      {showComingSoonToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center transition-all">
          <FaClock className="mr-2" />
          <span>{comingSoonMessage}</span>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Health Reminders</h3>
              <button 
                onClick={() => setShowNotificationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Receive personalized health reminders tailored to your health conditions directly on your phone. 
                Our doctor-approved reminders for diabetes, B12 deficiency, anemia, heart health, and obesity will help you stay on track.
                </p>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span className="ml-2 text-gray-700">Enable SMS reminders</span>
                </label>
              </div>
              
              <div className="mb-4">
                {isEditingNumber ? (
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (with country code, e.g., +1234567890)
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1234567890"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={handleSavePhoneNumber}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                    {saveStatus === "invalid-number" && (
                      <p className="text-red-500 text-sm mt-1">
                        Please enter a valid phone number with country code (e.g., +1234567890)
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone Number:</p>
                      <p className="text-gray-900 font-medium">
                        {phoneNumber || "Not set"}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditingNumber(true)}
                      className="text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Status messages */}
            {saveStatus === "saving" && (
              <p className="text-indigo-600 text-sm mb-4">Saving preferences...</p>
            )}
            {saveStatus === "success" && (
              <p className="text-green-600 text-sm mb-4">Successfully saved!</p>
            )}
            {saveStatus === "error" && (
              <p className="text-red-600 text-sm mb-4">
                Error saving preferences. Please try again.
              </p>
            )}
            {saveStatus === "no-reminder" && (
              <p className="text-yellow-600 text-sm mb-4">
                No reminder available at this time.
              </p>
            )}
            
            {/* Reminders Preview */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-2">Today's Reminders:</h4>
              <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
                {Object.keys(getReminderSchedule().currentReminders).length > 0 || 
                 Object.keys(getReminderSchedule().upcomingReminders).length > 0 ? (
                  <>
                    {getReminderSchedule().currentReminders.map((reminder, index) => (
                      <div key={`current-${index}`} className="mb-2 pb-2 border-b border-gray-200 last:border-0">
                        <div className="flex items-center">
                          <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mr-2">
                            {reminder.time}
                          </div>
                          <p className="text-gray-700 text-sm flex-1">{reminder.message}</p>
                        </div>
                      </div>
                    ))}
                    {getReminderSchedule().upcomingReminders.map((reminder, index) => (
                      <div key={`upcoming-${index}`} className="mb-2 pb-2 border-b border-gray-200 last:border-0">
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mr-2">
                            {reminder.time}
                          </div>
                          <p className="text-gray-700 text-sm flex-1">{reminder.message}</p>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">No reminders scheduled for today.</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleSendNotification}
                disabled={!phoneNumber || !notifications || saveStatus === "saving"}
                className={`${
                  !phoneNumber || !notifications || saveStatus === "saving"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white px-4 py-2 rounded-md transition-colors flex items-center`}
              >
                <FaBell className="mr-2" />
                Send Test Reminder
              </button>
            </div>
          </div>
        </div>
      )}
      
      
    </div>
  );
};

export default WelcomePage;