// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Signup from "./components/Auth/Signup";
// import Login from "./components/Auth/Login";
// import ForgotPassword from "./components/Auth/ForgotPassword";
// import Dashboard from "./components/Dashboard/Dashboard";
// import UploadReport from "./components/Dashboard/UploadReport";
// import CompareReports from "./components/Dashboard/CompareReports";
// import TrackHealth from "./components/Dashboard/TrackHealth";
// import Profile from "./components/Dashboard/Profile";
// import Navbar from "./components/Layout/Navbar";
// import Footer from "./components/Layout/Footer";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Public Pages */}
//         <Route path="/" element={<Home />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />

//         {/* Authenticated Pages (With Navbar & Footer) */}
//         <Route path="/*" element={<AuthenticatedRoutes />} />
//       </Routes>
//     </Router>
//   );
// };

// // ✅ Separate Layout for Authenticated Routes
// const AuthenticatedRoutes = () => {
//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen flex flex-col">
//         <Routes>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/upload-report" element={<UploadReport />} />
//           <Route path="/compare-reports" element={<CompareReports />} />
//           <Route path="/track-health" element={<TrackHealth />} />
//           <Route path="/profile" element={<Profile />} />
//         </Routes>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default App;


// import React, { useEffect, useState, createContext, useContext } from "react";
// import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
// import Home from "./pages/Home";
// import Signup from "./components/Auth/Signup";
// import Login from "./components/Auth/Login";
// import ForgotPassword from "./components/Auth/ForgotPassword";
// import Dashboard from "./components/Dashboard/Dashboard";
// import UploadReport from "./components/Dashboard/UploadReport";
// import CompareReports from "./components/Dashboard/CompareReports";
// import TrackHealth from "./components/Dashboard/TrackHealth";
// import Profile from "./components/Dashboard/Profile";
// import Navbar from "./components/Layout/Navbar";
// import Footer from "./components/Layout/Footer";

// // Create Authentication Context
// const AuthContext = createContext(null);

// // Auth Provider component
// const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
  
//   const login = () => setIsAuthenticated(true);
//   const logout = () => setIsAuthenticated(false);
  
//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use the auth context
// const useAuth = () => {
//   return useContext(AuthContext);
// };

// // Login component wrapper to handle redirect
// const LoginWrapper = () => {
//   const { isAuthenticated, login } = useAuth();
//   const navigate = useNavigate();
  
//   // This function will be passed to your Login component
//   const handleLoginSuccess = () => {
//     login();
//     navigate("/dashboard");
//   };
  
//   // Redirect to dashboard if already authenticated
//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }
  
//   return <Login onLoginSuccess={handleLoginSuccess} />;
// };

// // Signup component wrapper to handle redirect
// const SignupWrapper = () => {
//   const { isAuthenticated, login } = useAuth();
//   const navigate = useNavigate();
  
//   // This function will be passed to your Signup component
//   const handleSignupSuccess = () => {
//     login();
//     navigate("/dashboard");
//   };
  
//   // Redirect to dashboard if already authenticated
//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }
  
//   return <Signup onSignupSuccess={handleSignupSuccess} />;
// };

// // Protected Route component
// const ProtectedRoute = () => {
//   const { isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   useEffect(() => {
//     if (!isAuthenticated) {
//       // Save the attempted URL for redirection after login
//       navigate("/login", { 
//         replace: true,
//         state: { from: location.pathname }
//       });
//     }
//   }, [isAuthenticated, navigate, location]);
  
//   // If authenticated, render the child routes
//   return isAuthenticated ? <Outlet /> : null;
// };

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public Pages */}
//           <Route element={<PublicLayout />}>
//             <Route path="/" element={<Home />} />
//             <Route path="/signup" element={<SignupWrapper />} />
//             <Route path="/login" element={<LoginWrapper />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//           </Route>

//           {/* Authenticated Pages */}
//           <Route element={<ProtectedRoute />}>
//             <Route element={<AuthenticatedLayout />}>
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/upload-report" element={<UploadReport />} />
//               <Route path="/compare-reports" element={<CompareReports />} />
//               <Route path="/track-health" element={<TrackHealth />} />
//               <Route path="/profile" element={<Profile />} />
//             </Route>
//           </Route>
          
//           {/* Catch-all route - redirect to dashboard or home based on auth status */}
//           <Route path="*" element={
//             <AuthRedirect />
//           } />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// // Component to handle auth-based redirects
// const AuthRedirect = () => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? 
//     <Navigate to="/dashboard" replace /> : 
//     <Navigate to="/" replace />;
// };

// // Layout for Public Routes
// const PublicLayout = () => {
//   return (
//     <>
//       <Navbar isPublic={true} />
//       <div className="min-h-screen flex flex-col">
//         <Outlet />
//       </div>
//       <Footer />
//     </>
//   );
// };

// // Layout for Authenticated Routes
// const AuthenticatedLayout = () => {
//   return (
//     <>
//       <Navbar isPublic={false} />
//       <div className="min-h-screen flex flex-col">
//         <Outlet />
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default App;

// import React, { useEffect, useState, createContext, useContext } from "react";
// import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
// import { auth } from "./firebase/firebaseConfig"; // Ensure Firebase is correctly imported
// import { onAuthStateChanged } from "firebase/auth";
// import Home from "./pages/Home";
// import Signup from "./components/Auth/Signup";
// import Login from "./components/Auth/Login";
// import ForgotPassword from "./components/Auth/ForgotPassword";
// import Dashboard from "./components/Dashboard/Dashboard";
// import UploadReport from "./components/Dashboard/UploadReport";
// import CompareReports from "./components/Dashboard/CompareReports";
// import TrackHealth from "./components/Dashboard/TrackHealth";
// import Profile from "./components/Dashboard/Profile";
// import Navbar from "./components/Layout/Navbar";
// import Footer from "./components/Layout/Footer";

// // Create Authentication Context
// const AuthContext = createContext(null);

// // Auth Provider component
// const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null); // ✅ Start with `null` to avoid flickering
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setIsAuthenticated(!!user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const login = () => setIsAuthenticated(true);
//   const logout = () => {
//     auth.signOut();
//     setIsAuthenticated(false);
//   };

//   if (loading) return <div>Loading...</div>; // ✅ Prevent flicker before auth state is determined

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use the auth context
// const useAuth = () => useContext(AuthContext);

// // Login component wrapper
// const LoginWrapper = () => {
//   const { isAuthenticated, login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLoginSuccess = () => {
//     login();
//     navigate(location.state?.from || "/dashboard"); // ✅ Redirect to original page or dashboard
//   };

//   if (isAuthenticated) return <Navigate to="/dashboard" replace />;

//   return <Login onLoginSuccess={handleLoginSuccess} />;
// };

// // Signup component wrapper
// const SignupWrapper = () => {
//   const { isAuthenticated, login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleSignupSuccess = () => {
//     login();
//     navigate(location.state?.from || "/dashboard"); // ✅ Redirect to original page or dashboard
//   };

//   if (isAuthenticated) return <Navigate to="/dashboard" replace />;

//   return <Signup onSignupSuccess={handleSignupSuccess} />;
// };

// // Protected Route component
// const ProtectedRoute = () => {
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();

//   if (isAuthenticated === null) return null; // ✅ Prevent unnecessary redirects during auth check
//   if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

//   return <Outlet />;
// };

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Public Pages */}
//           <Route element={<PublicLayout />}>
//             <Route path="/" element={<Home />} />
//             <Route path="/signup" element={<SignupWrapper />} />
//             <Route path="/login" element={<LoginWrapper />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//           </Route>

//           {/* Authenticated Pages */}
//           <Route element={<ProtectedRoute />}>
//             <Route element={<AuthenticatedLayout />}>
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/upload-report" element={<UploadReport />} />
//               <Route path="/compare-reports" element={<CompareReports />} />
//               <Route path="/track-health" element={<TrackHealth />} />
//               <Route path="/profile" element={<Profile />} />
//             </Route>
//           </Route>

//           {/* Catch-all route */}
//           <Route path="*" element={<AuthRedirect />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// // Component to handle auth-based redirects
// const AuthRedirect = () => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
// };

// // Layout for Public Routes
// const PublicLayout = () => (
//   <>
//     <Navbar isPublic={true} />
//     <div className="min-h-screen flex flex-col">
//       <Outlet />
//     </div>
//     <Footer />
//   </>
// );

// // Layout for Authenticated Routes
// const AuthenticatedLayout = () => (
//   <>
//     <Navbar isPublic={false} />
//     <div className="min-h-screen flex flex-col">
//       <Outlet />
//     </div>
//     <Footer />
//   </>
// );

// export default App;

// 

// import React, { useEffect, useState, createContext, useContext } from "react";
// import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
// import { auth, db } from "./firebase/firebaseConfig";
// import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
// import { doc, deleteDoc } from "firebase/firestore";
// import Home from "./pages/Home";
// import Signup from "./components/Auth/Signup";
// import Login from "./components/Auth/Login";
// import ForgotPassword from "./components/Auth/ForgotPassword";
// import Dashboard from "./components/Dashboard/Dashboard";
// import UploadReport from "./components/Dashboard/UploadReport";
// import CompareReports from "./components/Dashboard/CompareReports";
// import TrackHealth from "./components/Dashboard/TrackHealth";
// import Profile from "./components/Dashboard/Profile";
// import Navbar from "./components/Layout/Navbar";
// import Footer from "./components/Layout/Footer";

// // Create Authentication Context
// const AuthContext = createContext(null);

// // Auth Provider component
// const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setIsAuthenticated(!!user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const login = () => setIsAuthenticated(true);

//   const logout = async () => {
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         // Remove user data from Firestore
//         await deleteDoc(doc(db, "users", user.uid));
//         await deleteDoc(doc(db, "profiles", user.uid));

//         // Delete user from Firebase Auth
//         await deleteUser(user);
//       }

//       // Sign out from Firebase
//       await signOut(auth);

//       // Clear local storage
//       localStorage.removeItem("user");

//       setIsAuthenticated(false);
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use the auth context
// const useAuth = () => useContext(AuthContext);

// // Login component wrapper
// const LoginWrapper = () => {
//   const { isAuthenticated, login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLoginSuccess = () => {
//     login();
//     navigate(location.state?.from || "/dashboard");
//   };

//   if (isAuthenticated) return <Navigate to="/dashboard" replace />;

//   return <Login onLoginSuccess={handleLoginSuccess} />;
// };

// // Signup component wrapper
// const SignupWrapper = () => {
//   const { isAuthenticated, login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleSignupSuccess = () => {
//     login();
//     navigate(location.state?.from || "/dashboard");
//   };

//   if (isAuthenticated) return <Navigate to="/dashboard" replace />;

//   return <Signup onSignupSuccess={handleSignupSuccess} />;
// };

// // Protected Route component
// const ProtectedRoute = () => {
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();

//   if (isAuthenticated === null) return null;
//   if (!isAuthenticated) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

//   return <Outlet />;
// };

// // Logout Component
// const Logout = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const performLogout = async () => {
//       await logout();
//       navigate("/");
//     };

//     performLogout();
//   }, [logout, navigate]);

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="p-6 bg-white rounded-lg shadow-md text-center">
//         <h2 className="text-lg font-semibold text-gray-800">Logging you out...</h2>
//         <p className="text-gray-500">Please wait while we sign you out securely.</p>
//       </div>
//     </div>
//   );
// };

// // New Home Layout without Navbar for unauthenticated users
// const HomeLayout = () => (
//   <div className="min-h-screen flex flex-col">
//     <Outlet />
//     <Footer />
//   </div>
// );

// // Layout for Authenticated Routes
// const AuthenticatedLayout = () => (
//   <>
//     <Navbar isPublic={false} />
//     <div className="min-h-screen flex flex-col">
//       <Outlet />
//     </div>
//     <Footer />
//   </>
// );

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Home Page without Navbar */}
//           <Route element={<HomeLayout />}>
//             <Route path="/" element={<Home />} />
//           </Route>

//           {/* Public Pages with Navbar */}
//           <Route element={<PublicLayout />}>
//             <Route path="/signup" element={<SignupWrapper />} />
//             <Route path="/login" element={<LoginWrapper />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//           </Route>

//           {/* Authenticated Pages */}
//           <Route element={<ProtectedRoute />}>
//             <Route element={<AuthenticatedLayout />}>
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/upload-report" element={<UploadReport />} />
//               <Route path="/compare-reports" element={<CompareReports />} />
//               <Route path="/track-health" element={<TrackHealth />} />
//               <Route path="/profile" element={<Profile />} />
//             </Route>
//           </Route>

//           {/* Logout Route */}
//           <Route path="/logout" element={<Logout />} />

//           {/* Catch-all route */}
//           <Route path="*" element={<AuthRedirect />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// // Public Layout for other public pages
// const PublicLayout = () => (
//   <>
//     <Navbar isPublic={true} />
//     <div className="min-h-screen flex flex-col">
//       <Outlet />
//     </div>
//     <Footer />
//   </>
// );

// // Component to handle auth-based redirects
// const AuthRedirect = () => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
// };

// // export default App;
// import React, { useEffect, useState, createContext, useContext } from "react";
// import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
// import { auth, db } from "./firebase/firebaseConfig";
// import { onAuthStateChanged, signOut, deleteUser } from "firebase/auth";
// import { doc, deleteDoc } from "firebase/firestore";
// import Home from "./pages/Home";
// import Signup from "./components/Auth/Signup";
// import Login from "./components/Auth/Login";
// import ForgotPassword from "./components/Auth/ForgotPassword";
// import Dashboard from "./components/Dashboard/Dashboard";
// import UploadReport from "./components/Dashboard/UploadReport";
// import CompareReports from "./components/Dashboard/CompareReports";
// import TrackHealth from "./components/Dashboard/TrackHealth";
// import Profile from "./components/Dashboard/Profile";
// import Navbar from "./components/Layout/Navbar";
// import Footer from "./components/Layout/Footer";
// import HealthDashboard from "./components/Dashboard/HealthDashboard";

// // Create Authentication Context
// const AuthContext = createContext(null);

// // Auth Provider component
// const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setIsAuthenticated(!!user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const login = () => setIsAuthenticated(true);

//   const logout = async () => {
//     try {
//       const user = auth.currentUser;
//       const navigate = useNavigate();

//       if (user) {
//         await deleteDoc(doc(db, "users", user.uid));
//         await deleteDoc(doc(db, "profiles", user.uid));
//         await deleteUser(user);
//       }

//       await signOut(auth);
//       localStorage.removeItem("user");
//       setIsAuthenticated(false);
//       navigate("/")
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use the auth context
// const useAuth = () => useContext(AuthContext);

// // Login component wrapper (No Navbar/Footer)
// const LoginWrapper = () => {
//   const { isAuthenticated, login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLoginSuccess = () => {
//     login();
//     navigate(location.state?.from || "/dashboard");
//   };

//   if (isAuthenticated) return <Navigate to="/dashboard" replace />;

//   return (
//     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//       <Login onLoginSuccess={handleLoginSuccess} />
//     </div>
//   );
// };

// // Signup component wrapper (No Navbar/Footer)
// const SignupWrapper = () => {
//   const { isAuthenticated, login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleSignupSuccess = () => {
//     login();
//     navigate(location.state?.from || "/dashboard");
//   };

//   if (isAuthenticated) return <Navigate to="/dashboard" replace />;

//   return (
//     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//       <Signup onSignupSuccess={handleSignupSuccess} />
//     </div>
//   );
// };

// // Protected Route component
// // const ProtectedRoute = () => {
// //   const { isAuthenticated } = useAuth();
// //   const location = useLocation();

// //   if (isAuthenticated === null) return null;
// //   if (!isAuthenticated) return <Navigate to="/" state={{ from: location.pathname }} replace />;

// //   return <Outlet />;
// // };

// // Logout Component
// const Logout = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const performLogout = async () => {
//       await logout();
//       navigate("/");
//     };

//     performLogout();
//   }, [logout, navigate]);

//   return (
//     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8f9fa" }}>
//       <div style={{ padding: "20px", background: "white", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", textAlign: "center" }}>
//         <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>Logging you out...</h2>
//         <p style={{ color: "#666" }}>Please wait while we sign you out securely.</p>
//       </div>
//     </div>
//   );
// };

// // Home Layout (Without Navbar)
// const HomeLayout = () => (
//   <div className="min-h-screen flex flex-col">
//     <Outlet />
    
//   </div>
// );

// // Layout for Authenticated Routes (With Navbar & Footer)
// const AuthenticatedLayout = () => (
//   <>
//     <Navbar isPublic={false} />
//     <div className="min-h-screen flex flex-col">
//       <Outlet />
//     </div>
//     <Footer />
//   </>
// );

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           {/* Home Page without Navbar */}
//           <Route element={<HomeLayout />}>
//             <Route path="/" element={<Home />} />
//             <Route path="/hdashboard" element={<HealthDashboard />} />
//           </Route>

//           {/* Login & Signup Pages (No Navbar/Footer) */}
//           <Route path="/signup" element={<SignupWrapper />} />
//           <Route path="/login" element={<LoginWrapper />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />

//           {/* Authenticated Pages */}
//           <Route>
//             <Route element={<AuthenticatedLayout />}>
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/upload-report" element={<UploadReport />} />
//               <Route path="/compare-reports" element={<CompareReports />} />
//               <Route path="/track-health" element={<TrackHealth />} />
//               <Route path="/profile" element={<Profile />} />
             
//             </Route>
//           </Route>

//           {/* Logout Route */}
//           <Route path="/logout" element={<Logout />} />

//           {/* Catch-all route */}
//           <Route path="*" element={<AuthRedirect />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// // Component to handle auth-based redirects
// const AuthRedirect = () => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
// };

// export default App;


import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// Ensure AuthProvider is properly imported
import Home from "./pages/Home";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Dashboard from "./components/Dashboard/Dashboard";
import UploadReport from "./components/Dashboard/UploadReport";
import CompareReports from "./components/Dashboard/CompareReports";
import TrackHealth from "./components/Dashboard/TrackHealth";
import Profile from "./components/Dashboard/Profile";
import Logout from "./components/Auth/Logout";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import HDashboard from "./components/Dashboard/HealthDashboard";
import UserDashboard from "./components/Dashboard/UserDashboard"
import AuthRedirect from "./components/Auth/AuthRedirect"; // Make sure this is correctly imported
import HealthReports from "./components/Dashboard/HealthReports"

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/hdashboard",
      element: <HDashboard />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/dashboard",
      element: (
        <>
          <Navbar isPublic={false} />
          <Dashboard />
          <Footer />
        </>
      ),
    },
    {
      path: "/upload-report",
      element: <UploadReport />,
    },
    {
      path: "/compare-reports",
      element: <CompareReports />,
    },
    {
      path: "/track-health",
      element: <TrackHealth />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/userdashboard",
      element: <UserDashboard />,
    },
    {
      path: "/hr",
      element: <HealthReports />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "*",
      element: <AuthRedirect />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
