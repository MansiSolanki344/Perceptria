

// import React, { useState, useEffect } from "react";
// import { auth, googleProvider, signInWithPopup, db } from "../../firebase/firebaseConfig";
// import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { Link, useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const navigate = useNavigate();

//   // Automatically redirect if user is already logged in
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         navigate("/dashboard");
//       }
//     });

//     return () => unsubscribe(); // Cleanup on unmount
//   }, [navigate]);

//   // Handle Manual Login with Email & Password
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/dashboard"); // Redirect after successful login
//     } catch (error) {
//       console.error("Login error:", error);
//       setError("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Google Login with Firestore User Creation
//   const handleGoogleLogin = async () => {
//     try {
//       setLoading(true);
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
  
//       console.log("User Info from Google:", user); // Debugging
  
//       if (!user.email) {
//         alert("Google did not provide an email. Please use another account.");
//         return;
//       }
  
//       const userRef = doc(db, "users", user.uid);
//       await setDoc(userRef, {
//         user_id: user.uid,
//         name: user.displayName || "",
//         email: user.email || "", // 🔴 Make sure to store email
//         phone: user.phoneNumber || "",
//         photo_url: user.photoURL || "",
//         gender: "",
//       }, { merge: true });
  
//       navigate("/dashboard");
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   // Handle Forgot Password Request
//   const handleForgotPassword = async () => {
//     if (!email) {
//       setError("Please enter your email to reset password.");
//       return;
//     }
    
//     try {
//       await sendPasswordResetEmail(auth, email);
//       alert("Password reset link sent to your email.");
//       setShowForgotPassword(false);
//     } catch (error) {
//       console.error("Reset password error:", error);
//       setError("Failed to send password reset email.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        
//         {/* Branding & Illustration */}
//         <div className="hidden md:block relative bg-gradient-to-br from-teal-500 to-blue-600 p-12 text-white">
//           <div className="absolute inset-0 opacity-10 bg-[url('/medical-pattern.svg')] bg-cover"></div>
//           <div className="relative z-10">
//             <h1 className="text-3xl font-bold mb-2">HealthTrack MD</h1>
//             <p className="text-lg mb-6">Welcome back to your health dashboard</p>
//           </div>
//         </div>

//         {/* Login Form */}
//         <div className="p-8 md:p-12">
//           <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome Back</h2>
//           {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

//           {/* Forgot Password Section */}
//           {showForgotPassword ? (
//             <div>
//               <h3 className="text-lg font-medium text-gray-700 text-center mb-2">Reset Password</h3>
//               <p className="text-sm text-gray-600 text-center mb-4">
//                 Enter your email to receive a password reset link.
//               </p>
//               <input
//                 type="email"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//               <button
//                 onClick={handleForgotPassword}
//                 className="w-full mt-4 bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600"
//               >
//                 Send Reset Link
//               </button>
//               <button
//                 onClick={() => setShowForgotPassword(false)}
//                 className="w-full mt-2 text-gray-600 hover:text-gray-800"
//               >
//                 Back to Login
//               </button>
//             </div>
//           ) : (
//             <form onSubmit={handleLogin} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                 <input
//                   type="password"
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500"
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setShowForgotPassword(true)}
//                   className="text-sm text-teal-600 hover:text-teal-800"
//                 >
//                   Forgot password?
//                 </button>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-blue-700"
//                 disabled={loading}
//               >
//                 {loading ? "Signing In..." : "Sign In"}
//               </button>
//             </form>
//           )}

//           <div className="mt-6 text-center">
//             <button
//               onClick={handleGoogleLogin}
//               className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
//             >
//               Sign in with Google
//             </button>
//           </div>

//           <p className="text-center text-gray-600 mt-8">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-teal-600 font-medium hover:text-teal-700">
//               Create Account
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import React, { useState } from "react";
// import { auth, googleProvider, signInWithPopup } from "../../firebase/firebaseConfig";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/dashboard");
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     try {
//       await signInWithPopup(auth, googleProvider);
//       navigate("/dashboard");
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//         <h2 className="text-3xl font-bold text-gray-800 text-center">Welcome Back</h2>
//         <form onSubmit={handleLogin} className="space-y-4 mt-6">
//           <input type="email" placeholder="Email Address" className="input-style" onChange={(e) => setEmail(e.target.value)} required />
//           <input type="password" placeholder="Password" className="input-style" onChange={(e) => setPassword(e.target.value)} required />
//           <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
//         </form>
//         <div className="mt-4 text-center">
//           <p className="text-gray-600">Or log in with</p>
//           <button onClick={handleGoogleLogin} className="btn-secondary flex items-center justify-center w-full mt-2">
//             <FcGoogle className="mr-2 text-xl" /> Log in with Google
//           </button>
//         </div>
//         <p className="text-center text-gray-600 mt-6">
//           Don't have an account? <Link to="/signup" className="text-teal-600 font-medium hover:text-teal-700">Sign up</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from "react";
// import { auth, googleProvider, signInWithPopup } from "../../firebase/firebaseConfig";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { FaEnvelope, FaLock } from "react-icons/fa";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/dashboard");
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     try {
//       await signInWithPopup(auth, googleProvider);
//       navigate("/dashboard");
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-12">
//       <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden w-[900px]">
//         <div className="hidden md:flex items-center justify-center w-1/2 bg-blue-50 p-8">
//           <img src="https://swisscognitive.ch/wp-content/uploads/2021/06/artificial-intelligence-in-healthcare.png" alt="Illustration" className="w-80" />
//         </div>
//         <div className="w-full md:w-1/2 p-12">
//           <h2 className="text-4xl font-bold text-gray-800 text-center">Sign In</h2>
//           <form onSubmit={handleLogin} className="space-y-6 mt-6">
//             <div className="relative">
//               <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-lg" />
//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 className="pl-12 input-style w-full h-12 border rounded-lg px-4"
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="relative">
//               <FaLock className="absolute left-3 top-3 text-gray-400 text-lg" />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="pl-12 input-style w-full h-12 border rounded-lg px-4"
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <button type="submit" className="btn-primary w-full h-12 text-lg font-semibold" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>
//           <div className="mt-6 text-center">
//             <p className="text-gray-600">Or log in with</p>
//             <button onClick={handleGoogleLogin} className="btn-secondary flex items-center justify-center w-full mt-4 h-12 text-lg font-semibold">
//               <FcGoogle className="mr-2 text-2xl" /> Log in with Google
//             </button>
//           </div>
//           <p className="text-center text-gray-600 mt-8 text-lg">
//             Don't have an account? <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-700">Sign up</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
// 

// import React, { useState } from "react";
// import { auth, googleProvider, signInWithPopup, db } from "../../firebase/firebaseConfig";
// // Correct import of auth and googleProvider
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { FaEnvelope, FaLock } from "react-icons/fa";
// import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore import
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"; // Phone number and reCAPTCHA verification

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isPhoneModalOpen, setPhoneModalOpen] = useState(false); // State for modal visibility
//   const [verificationCode, setVerificationCode] = useState("");
//   const [verificationId, setVerificationId] = useState(null); // For storing the verification ID
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/dashboard");
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
//       const userRef = doc(db, "users", user.uid);

//       // Check if user already has phone number stored
//       const userDoc = await getDoc(userRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         if (!userData.phoneNumber) {
//           // Open phone number modal if missing
//           setPhoneModalOpen(true);
//         } else {
//           navigate("/dashboard");
//         }
//       } else {
//         // If user does not exist in Firestore, create a user and request phone number
//         await setDoc(userRef, {
//           email: user.email,
//           createdAt: new Date(),
//         });
//         setPhoneModalOpen(true); // Ask for phone number if not found
//       }
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhoneNumberSubmit = async () => {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//         size: "invisible",
//         callback: (response) => {
//           console.log("reCAPTCHA verified!");
//         },
//         "expired-callback": () => {
//           console.log("reCAPTCHA expired!");
//         },
//       });
//     }
  
//     const appVerifier = window.recaptchaVerifier;
//     const phoneInfo = `+${phoneNumber}`.replace(/\s/g, ""); // Ensure correct format
  
//     try {
//       const confirmationResult = await signInWithPhoneNumber(auth, phoneInfo, appVerifier);
//       setVerificationId(confirmationResult.verificationId);
//       alert("OTP sent to your phone. Please enter the code.");
//     } catch (error) {
//       alert(error.message);
//     }
//   };
  

//   const handleRecaptcha = () => {
//     window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
//       size: "invisible",
//       callback: (response) => {
//         console.log("reCAPTCHA passed!");
//       },
//       "expired-callback": () => {
//         console.log("reCAPTCHA expired!");
//       },
//     }, auth);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-12">
//       <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden w-[900px]">
//         <div className="hidden md:flex items-center justify-center w-1/2 bg-blue-50 p-8">
//           <img src="https://swisscognitive.ch/wp-content/uploads/2021/06/artificial-intelligence-in-healthcare.png" alt="Illustration" className="w-80" />
//         </div>
//         <div className="w-full md:w-1/2 p-12">
//           <h2 className="text-4xl font-bold text-gray-800 text-center">Sign In</h2>
//           <form onSubmit={handleLogin} className="space-y-6 mt-6">
//             <div className="relative">
//               <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-lg" />
//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 className="pl-12 input-style w-full h-12 border rounded-lg px-4"
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="relative">
//               <FaLock className="absolute left-3 top-3 text-gray-400 text-lg" />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="pl-12 input-style w-full h-12 border rounded-lg px-4"
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <button type="submit" className="btn-primary w-full h-12 text-lg font-semibold" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>
//           <div className="mt-6 text-center">
//             <p className="text-gray-600">Or log in with</p>
//             <button onClick={handleGoogleLogin} className="btn-secondary flex items-center justify-center w-full mt-4 h-12 text-lg font-semibold">
//               <FcGoogle className="mr-2 text-2xl" /> Log in with Google
//             </button>
//           </div>
//           <p className="text-center text-gray-600 mt-8 text-lg">
//             Don't have an account? <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-700">Sign up</Link>
//           </p>
//         </div>
//       </div>

//       {/* Phone number modal */}
//       {isPhoneModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h3 className="text-2xl">Please enter your phone number</h3>
//             <input
//               type="tel"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               placeholder="Phone number"
//               className="w-full p-2 border rounded-md mt-4"
//             />
//             <div id="recaptcha-container"></div>
//             <button
//               onClick={handlePhoneNumberSubmit}
//               className="btn-primary w-full mt-4"
//             >
//               Send OTP
//             </button>
//           </div>
//         </div>
//       )}

//       {/* OTP Verification modal */}
//       {verificationId && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h3 className="text-2xl">Enter OTP sent to your phone</h3>
//             <input
//               type="text"
//               value={verificationCode}
//               onChange={(e) => setVerificationCode(e.target.value)}
//               placeholder="Verification Code"
//               className="w-full p-2 border rounded-md mt-4"
//             />
//             <button
//               onClick={verifyPhoneNumber}
//               className="btn-primary w-full mt-4"
//             >
//               Verify Phone Number
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;


// import React, { useState } from "react";
// import { auth, googleProvider, signInWithPopup, db } from "../../firebase/firebaseConfig";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isPhoneModalOpen, setPhoneModalOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/dashboard");
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;
//       const userRef = doc(db, "users", user.uid);
//       const userDoc = await getDoc(userRef);
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         if (!userData.phoneNumber) {
//           setPhoneModalOpen(true);
//         } else {
//           navigate("/dashboard");
//         }
//       } else {
//         await setDoc(userRef, {
//           email: user.email,
//           createdAt: new Date(),
//         });
//         setPhoneModalOpen(true);
//       }
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePhoneNumberSubmit = async () => {
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         const userRef = doc(db, "users", user.uid);
//         await setDoc(userRef, { phoneNumber }, { merge: true });
//         alert("Phone number saved successfully.");
//         setPhoneModalOpen(false);
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       alert("Failed to save phone number: " + error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-12">
//       <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden w-[900px]">
//         <div className="hidden md:flex items-center justify-center w-1/2 bg-blue-50 p-8">
//           <img src="https://swisscognitive.ch/wp-content/uploads/2021/06/artificial-intelligence-in-healthcare.png" alt="Illustration" className="w-80" />
//         </div>
//         <div className="w-full md:w-1/2 p-12">
//           <h2 className="text-4xl font-bold text-gray-800 text-center">Sign In</h2>
//           <form onSubmit={handleLogin} className="space-y-6 mt-6">
//             <div className="relative">
//               <FaEnvelope className="absolute left-3 top-3 text-gray-400 text-lg" />
//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 className="pl-12 input-style w-full h-12 border rounded-lg px-4"
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="relative">
//               <FaLock className="absolute left-3 top-3 text-gray-400 text-lg" />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="pl-12 input-style w-full h-12 border rounded-lg px-4"
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <button type="submit" className="btn-primary w-full h-12 text-lg font-semibold" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>
//           <div className="mt-6 text-center">
//             <p className="text-gray-600">Or log in with</p>
//             <button onClick={handleGoogleLogin} className="btn-secondary flex items-center justify-center w-full mt-4 h-12 text-lg font-semibold">
//               <FcGoogle className="mr-2 text-2xl" /> Log in with Google
//             </button>
//           </div>
//           <p className="text-center text-gray-600 mt-8 text-lg">
//             Don't have an account? <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-700">Sign up</Link>
//           </p>
//         </div>
//       </div>
//       {isPhoneModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h3 className="text-2xl">Enter Your Phone Number</h3>
//             <div className="relative mt-4">
//               <FaPhone className="absolute left-3 top-3 text-gray-400 text-lg" />
//               <input
//                 type="tel"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 placeholder="Phone number"
//                 className="w-full pl-10 p-2 border rounded-md"
//               />
//             </div>
//             <button onClick={handlePhoneNumberSubmit} className="btn-primary w-full mt-4">
//               Save Phone Number
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup, db } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEnvelope, FaLock, FaPhone, FaHeartbeat } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneModalOpen, setPhoneModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (!userData.phoneNumber) {
          setPhoneModalOpen(true);
        } else {
          navigate("/dashboard");
        }
      } else {
        await setDoc(userRef, {
          email: user.email,
          createdAt: new Date(),
        });
        setPhoneModalOpen(true);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { phoneNumber }, { merge: true });
        alert("Phone number saved successfully.");
        setPhoneModalOpen(false);
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Failed to save phone number: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-12">
      <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-5xl">
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-b from-blue-500 to-blue-600 p-8 text-white">
          <FaHeartbeat className="text-6xl mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-center">Welcome Back to Your Health Journey</h2>
          <p className="text-center mb-6">Access your personalized wellness dashboard and continue your path to better health.</p>
          <img 
            src="/api/placeholder/400/320" 
            alt="Healthcare illustration" 
            className="w-64 rounded-lg shadow-lg" 
          />
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center">
              <FaHeartbeat className="text-xl mr-3" />
              <span>View your health progress</span>
            </div>
            <div className="flex items-center">
              <FaHeartbeat className="text-xl mr-3" />
              <span>Access your wellness reports</span>
            </div>
            <div className="flex items-center">
              <FaHeartbeat className="text-xl mr-3" />
              <span>Connect with your healthcare team</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-12">
          <div className="flex justify-center mb-2">
            <FaHeartbeat className="text-blue-600 text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-2">Access Your Health Account</h2>
          <p className="text-center text-gray-600 mb-6">Sign in to continue your wellness journey</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-blue-600 text-lg" />
              <input
                type="email"
                placeholder="Email Address"
                className="pl-12 w-full h-12 border border-blue-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-blue-600 text-lg" />
              <input
                type="password"
                placeholder="Password"
                className="pl-12 w-full h-12 border border-blue-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 text-sm">
                Forgot password?
              </Link>
            </div>
            <button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition duration-300" 
              disabled={loading}
            >
              {loading ? "Accessing Account..." : "Access My Health Dashboard"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">Or sign in with</p>
            <button 
              onClick={handleGoogleLogin} 
              className="flex items-center justify-center w-full mt-4 h-12 border-2 border-blue-500 text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition duration-300"
            >
              <FcGoogle className="mr-2 text-2xl" /> Continue with Google
            </button>
          </div>
          
          <p className="text-center text-gray-600 mt-8 text-lg">
            New to our health platform? <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-700">Create account</Link>
          </p>
        </div>
      </div>

      {isPhoneModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl w-96 shadow-2xl">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Complete Your Health Profile</h3>
            <p className="text-gray-600 mb-6">Please provide your phone number to receive important health updates and appointment reminders.</p>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-blue-600 text-lg" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
                className="w-full pl-12 p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              onClick={handlePhoneNumberSubmit} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold mt-6 transition duration-300"
            >
              Complete Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;