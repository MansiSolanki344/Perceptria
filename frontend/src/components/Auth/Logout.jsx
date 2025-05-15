// const logout = async () => {
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         // Remove user data from Firestore
//         await deleteDoc(doc(db, "users", user.uid));
//         await deleteDoc(doc(db, "profiles", user.uid));
        
//         // If user logged in with Google, revoke session
//         if (user.providerData.some((p) => p.providerId === "google.com")) {
//           const googleLogout = window.gapi?.auth2?.getAuthInstance();
//           if (googleLogout) {
//             googleLogout.signOut();
//           }
//         }
  
//         // Sign out from Firebase
//         await signOut(auth);
//       }
  
//       // Clear local storage
//       localStorage.removeItem("user");
  
//       setIsAuthenticated(false);
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };
  
// import { signOut } from "firebase/auth";
// import { auth, db } from "../../firebase/firebaseConfig";
// import { deleteDoc, doc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const logout = async () => {
//   const navigate = useNavigate();

//   try {
//     const user = auth.currentUser;
//     if (user) {
//       // Remove user data from Firestore
//       await deleteDoc(doc(db, "users", user.uid));
//       await deleteDoc(doc(db, "profiles", user.uid));

//       // Google Logout Handling
//       if (user.providerData.some((p) => p.providerId === "google.com")) {
//         const googleLogout = window?.gapi?.auth2?.getAuthInstance();
//         if (googleLogout) {
//           googleLogout.signOut();
//           googleLogout.disconnect(); // Ensure re-authentication next time
//         }
//       }

//       // Sign out from Firebase
//       await signOut(auth);
//     }

//     // Clear local storage & Redirect
//     localStorage.removeItem("user");
//     navigate("/");
//   } catch (error) {
//     console.error("Error during logout:", error);
//   }
// };


// import { signOut } from "firebase/auth";
// import { auth, db } from "../../firebase/firebaseConfig";
// import { deleteDoc, doc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const logout = async () => {
//   const navigate = useNavigate();

//   try {
//     const user = auth.currentUser;
//     if (user) {
//       // Remove user data from Firestore
//       await deleteDoc(doc(db, "users", user.uid));
//       await deleteDoc(doc(db, "profiles", user.uid));

//       // Google Logout Handling
//       if (user.providerData.some((p) => p.providerId === "google.com")) {
//         const googleLogout = window?.gapi?.auth2?.getAuthInstance();
//         if (googleLogout) {
//           googleLogout.signOut();
//           googleLogout.disconnect(); // Ensure re-authentication next time
//         }
//       }

//       // Sign out from Firebase
//       await signOut(auth);
//     }

//     // Clear local storage & Redirect to home page
//     localStorage.removeItem("user");
//     navigate("/");  // Redirect to the home page instead of login
//   } catch (error) {
//     console.error("Error during logout:", error);
//   }
// };


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

const Logout = () => {
  const navigate = useNavigate(); // ✅ useNavigate inside component

  useEffect(() => {
    const performLogout = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Remove user data from Firestore
          await deleteDoc(doc(db, "users", user.uid));
          await deleteDoc(doc(db, "profiles", user.uid));

          // Google Logout Handling
          if (user.providerData.some((p) => p.providerId === "google.com")) {
            const googleLogout = window?.gapi?.auth2?.getAuthInstance();
            if (googleLogout) {
              googleLogout.signOut();
              googleLogout.disconnect();
            }
          }

          // Sign out from Firebase
          await signOut(auth);
        }

        // Clear local storage & Redirect to home page
        localStorage.removeItem("user");
        navigate("/");  // ✅ Redirect to home page
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    performLogout();
  }, [navigate]); // ✅ Dependency added

  return <div>Logging out...</div>;
};

export default Logout; // ✅ Default export added
