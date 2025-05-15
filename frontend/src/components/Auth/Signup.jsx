
// import React, { useState } from "react";
// import { auth, googleProvider, signInWithPopup, db } from "../../firebase/firebaseConfig";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { setDoc, doc } from "firebase/firestore";
// import { useNavigate, Link } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState(""); // Added state for phone number
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Save user data to Firestore
//   const saveUserToFirestore = async (user) => {
//     const userRef = doc(db, "users", user.uid); // Creating a document for the user in the 'users' collection
//     await setDoc(userRef, {
//       name: user.displayName || name, // Display name or provided name
//       email: user.email,
//       phone: phone, // Saving the phone number
//     });
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Create a user with email and password
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Save user information (name, email, phone) to Firestore
//       await saveUserToFirestore(user);
      
//       // Redirect to dashboard or wherever
//       navigate("/dashboard");
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignup = async () => {
//     if (!phone) {
//       alert("Please enter your phone number to sign up with Google.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Sign in with Google
//       const result = await signInWithPopup(auth, googleProvider);
//       const user = result.user;

//       // Save user information (name, email, phone) to Firestore
//       await saveUserToFirestore(user);

//       // Redirect to dashboard or wherever
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
//           <h2 className="text-4xl font-bold text-gray-800 text-center">Sign Up</h2>
//           <form onSubmit={handleSignup} className="space-y-6 mt-6">
//             <div className="relative">
//               <FaUser className="absolute left-3 top-3 text-gray-400 text-lg" />
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 className="pl-12 input-style w-full h-12 border rounded-lg px-4"
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
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
//             <div className="relative">
//               <FaPhone className="absolute left-3 top-3 text-gray-400 text-lg" />
//               <input
//                 type="text"
//                 placeholder="Phone Number"
//                 className="pl-12 input-style w-full h-12 border rounded-lg px-4"
//                 onChange={(e) => setPhone(e.target.value)}
//                 required
//               />
//             </div>
//             <button type="submit" className="btn-primary w-full h-12 text-lg font-semibold" disabled={loading}>
//               {loading ? "Signing up..." : "Sign Up"}
//             </button>
//           </form>
//           <div className="mt-6 text-center">
//             <p className="text-gray-600">Or sign up with</p>
//             <button onClick={handleGoogleSignup} className="btn-secondary flex items-center justify-center w-full mt-4 h-12 text-lg font-semibold">
//               <FcGoogle className="mr-2 text-2xl" /> Sign up with Google
//             </button>
//           </div>
//           <p className="text-center text-gray-600 mt-8 text-lg">
//             Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import React, { useState } from "react";
import { auth, googleProvider, signInWithPopup, db } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaHeartbeat } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      name: user.displayName || name,
      email: user.email,
      phone: phone,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await saveUserToFirestore(user);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!phone) {
      alert("Please enter your phone number to sign up with Google.");
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await saveUserToFirestore(user);
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-12">
      <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-5xl">
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-b from-blue-500 to-blue-600 p-8 text-white">
          <FaHeartbeat className="text-6xl mb-6 text-blue-100" />
          <h2 className="text-3xl font-bold mb-4 text-center">Precision Health Monitoring</h2>
          <p className="text-center mb-6 text-blue-100">Join our community of health-conscious individuals dedicated to better living and wellness.</p>
          <img 
            src="/api/placeholder/400/320" 
            alt="Healthcare illustration" 
            className="w-64 rounded-lg shadow-lg border-2 border-blue-400" 
          />
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex items-center">
              <FaHeartbeat className="text-xl mr-3 text-blue-200" />
              <span className="text-blue-100">Personalized health insights</span>
            </div>
            <div className="flex items-center">
              <FaHeartbeat className="text-xl mr-3 text-blue-200" />
              <span className="text-blue-100">Connect with healthcare professionals</span>
            </div>
            <div className="flex items-center">
              <FaHeartbeat className="text-xl mr-3 text-blue-200" />
              <span className="text-blue-100">Track your wellness journey</span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-12">
          <div className="flex justify-center mb-2">
            <FaHeartbeat className="text-blue-600 text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-2">Create Your Perceptria Account</h2>
          <p className="text-center text-gray-600 mb-6">Sign up to start your wellness journey with us</p>
          
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-blue-600 text-lg" />
              <input
                type="text"
                placeholder="Full Name"
                className="pl-12 w-full h-12 border border-blue-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-blue-600 text-lg" />
              <input
                type="text"
                placeholder="Phone Number"
                className="pl-12 w-full h-12 border border-blue-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-lg font-semibold transition duration-300 shadow-md" 
              disabled={loading}
            >
              {loading ? "Creating Your Account..." : "Sign Up"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">Or join with</p>
            <button 
              onClick={handleGoogleSignup} 
              className="flex items-center justify-center w-full mt-4 h-12 border-2 border-blue-500 text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition duration-300"
            >
              <FcGoogle className="mr-2 text-2xl" /> Sign up with Google
            </button>
          </div>
          
          <p className="text-center text-gray-600 mt-8 text-lg">
            Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;