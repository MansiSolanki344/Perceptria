

import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({
    displayName: auth.currentUser?.displayName || "",
    email: auth.currentUser?.email || "",
    age: "",
    gender: "",
    photoURL: auth.currentUser?.photoURL || "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [uploadedReports, setUploadedReports] = useState([]);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(prevUser => ({
              ...prevUser,
              displayName: auth.currentUser.displayName || userData.displayName || "",
              age: userData.age || "",
              gender: userData.gender || "",
              photoURL: auth.currentUser.photoURL || userData.photoURL || "",
            }));

            // Fetch user reports
            setUploadedReports(userData.uploadedReports || []);
            setGeneratedReports(userData.generatedReports || []);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
      setPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update photo if changed
      let photoURL = user.photoURL;
      if (photoFile) {
        const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }
      
      // Update user profile in Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        displayName: user.displayName,
        age: user.age,
        gender: user.gender,
        photoURL: photoURL,
      });
      
      setUser(prevUser => ({
        ...prevUser,
        photoURL: photoURL
      }));
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    
    setLoading(false);
  };

  const navigateToUploadReport = () => {
    navigate("/upload-report");
  };

  const viewReport = (reportId) => {
    navigate(`/report/${reportId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white">
            <h2 className="text-3xl font-bold">Health Profile</h2>
            <p className="opacity-80">Manage your health information and reports</p>
          </div>
          
          {/* Main content */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left column - User info */}
              <div className="md:w-1/3">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img 
                      src={photoPreview || user.photoURL || "https://via.placeholder.com/150"} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-teal-100 mb-2"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                      </label>
                    )}
                  </div>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out"
                    >
                      Update Profile
                    </button>
                  )}
                </div>
              </div>
              
              {/* Right column - Form */}
              <div className="md:w-2/3">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="displayName"
                          value={user.displayName}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-md">{user.displayName || "Not set"}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email</label>
                      <p className="p-3 bg-gray-50 rounded-md">{user.email}</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Age</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="age"
                          value={user.age}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-md">{user.age || "Not set"}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Gender</label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={user.gender}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-md">{user.gender || "Not set"}</p>
                      )}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-6 flex gap-4">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setPhotoPreview(null);
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md transition duration-300 ease-in-out"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
            
            {/* Reports Section */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Health Reports</h3>
                <button
                  onClick={navigateToUploadReport}
                  className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Upload New Report
                </button>
              </div>
              
              {/* Tabs for Report Types */}
              <div className="mb-8">
                <ul className="flex border-b">
                  <li className="mr-1">
                    <a href="#uploaded" className="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-medium border-l border-t border-r rounded-t">
                      Uploaded Reports ({uploadedReports.length})
                    </a>
                  </li>
                  <li className="mr-1">
                    <a href="#generated" className="bg-gray-100 inline-block py-2 px-4 text-gray-500 hover:text-gray-800 font-medium border-l border-t border-r rounded-t">
                      Generated Reports ({generatedReports.length})
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Uploaded Reports */}
              <div id="uploaded" className="bg-white rounded-lg border p-4">
                {uploadedReports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedReports.map((report) => (
                      <div key={report.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4">
                          <div className="flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h4 className="font-medium text-gray-800 truncate">{report.name}</h4>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">Uploaded: {report.uploadDate}</p>
                          <p className="text-sm text-gray-500 mb-4">Type: {report.type}</p>
                          <button
                            onClick={() => viewReport(report.id)}
                            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                          >
                            View Report →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No reports uploaded yet</p>
                    <button
                      onClick={navigateToUploadReport}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md inline-flex items-center transition duration-300 ease-in-out"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                      </svg>
                      Upload Your First Report
                    </button>
                  </div>
                )}
              </div>
              
              {/* Generated Reports (hidden initially) */}
              <div id="generated" className="hidden bg-white rounded-lg border p-4 mt-4">
                {generatedReports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedReports.map((report) => (
                      <div key={report.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4">
                          <div className="flex items-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h4 className="font-medium text-gray-800 truncate">{report.name}</h4>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">Generated: {report.generatedDate}</p>
                          <p className="text-sm text-gray-500 mb-4">Type: {report.type}</p>
                          <button
                            onClick={() => viewReport(report.id)}
                            className="text-teal-500 hover:text-teal-700 text-sm font-medium"
                          >
                            View Report →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No generated reports yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// 
// import React, { useEffect, useState } from "react";

// const Profile = () => {
//   const [user, setUser] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     profile_picture: "",
//   });
//   const [newImage, setNewImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const uid = "user123"; // Replace with actual user ID

//   // Fetch user data from Django backend
//   const fetchUserData = async () => {
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/profile/${uid}/`, {
//         credentials: "include",
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setUser({
//           first_name: data.first_name,
//           last_name: data.last_name,
//           email: data.email,
//           profile_picture: data.profile_picture,
//         });
//       } else {
//         console.error("Error fetching user data.");
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   // Handle image change
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setNewImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   // Handle profile update
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData();
//     formData.append("first_name", user.first_name);
//     formData.append("last_name", user.last_name);
//     if (newImage) {
//       formData.append("profile_picture", newImage);
//     }

//     try {
//       const response = await fetch("http://127.0.0.1:8000/api/profile/update/", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       if (response.ok) {
//         const updatedData = await response.json();
//         setUser({
//           first_name: updatedData.first_name,
//           last_name: updatedData.last_name,
//           email: updatedData.email,
//           profile_picture: updatedData.profile_picture,
//         });
//         setNewImage(null);
//         setImagePreview(null);
//       } else {
//         console.error("Failed to update profile.");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//     }

//     setLoading(false);
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
//       <h2>Profile</h2>
//       <div style={{ marginBottom: "15px" }}>
//         <img
//           src={imagePreview || `http://127.0.0.1:8000${user.profile_picture}`}
//           alt="Profile"
//           style={{
//             width: "100px",
//             height: "100px",
//             borderRadius: "50%",
//             objectFit: "cover",
//             border: "2px solid #ddd",
//           }}
//         />
//       </div>
//       <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
//         <label style={{ fontWeight: "bold", textAlign: "left" }}>First Name:</label>
//         <input
//           type="text"
//           value={user.first_name}
//           onChange={(e) => setUser({ ...user, first_name: e.target.value })}
//           required
//           style={{ padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
//         />

//         <label style={{ fontWeight: "bold", textAlign: "left" }}>Last Name:</label>
//         <input
//           type="text"
//           value={user.last_name}
//           onChange={(e) => setUser({ ...user, last_name: e.target.value })}
//           required
//           style={{ padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
//         />

//         <label style={{ fontWeight: "bold", textAlign: "left" }}>Email:</label>
//         <input
//           type="email"
//           value={user.email}
//           disabled
//           style={{ padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc", background: "#f5f5f5" }}
//         />

//         <label style={{ fontWeight: "bold", textAlign: "left" }}>Profile Picture:</label>
//         <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: "10px" }} />

//         {imagePreview && (
//           <img src={imagePreview} alt="Preview" style={{ width: "100px", height: "100px", borderRadius: "50%", marginBottom: "10px" }} />
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             padding: "10px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           {loading ? "Updating..." : "Update Profile"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Profile;
