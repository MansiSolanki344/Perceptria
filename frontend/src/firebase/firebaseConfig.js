// import { initializeApp } from "firebase/app";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//     apiKey: "AIzaSyA0QtFwMTHgpxMBvcSTL96N9P4S8VORGnM",
//     authDomain: "perceptria.firebaseapp.com",
//     projectId: "perceptria",
//     storageBucket: "perceptria.appspot.com", // ✅ Corrected Storage Bucket
//     messagingSenderId: "977849367649",
//     appId: "1:977849367649:web:56c3ac4a5625ddb5b7fe20"
  
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const googleProvider = new GoogleAuthProvider();

// // Set up Recaptcha
// const setUpRecaptcha = () => {
//   if (!window.recaptchaVerifier) {
//     window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//       size: "invisible",
//       callback: () => console.log("ReCaptcha Verified!"),
//     });
//   }
// };

// export { auth, db, googleProvider, setUpRecaptcha, signInWithPhoneNumber };


// import { initializeApp } from "firebase/app";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // ✅ Replace with Your Firebase Config
// const firebaseConfig = {
//     apiKey: "AIzaSyA0QtFwMTHgpxMBvcSTL96N9P4S8VORGnM",
//     authDomain: "perceptria.firebaseapp.com",
//     projectId: "perceptria",
//     storageBucket: "perceptria.appspot.com", // ✅ Corrected Storage Bucket
//     messagingSenderId: "977849367649",
//     appId: "1:977849367649:web:56c3ac4a5625ddb5b7fe20"
// };

// // ✅ Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const googleProvider = new GoogleAuthProvider();

// // ✅ Correct ReCaptcha Setup (Fixes OTP Issue)
// const setUpRecaptcha = () => {
//   if (!window.recaptchaVerifier) {
//     window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//       size: "invisible",
//       callback: () => console.log("ReCaptcha Verified!"),
//       "expired-callback": () => console.warn("ReCaptcha Expired. Refresh and try again."),
//     });
//   }
// };

// export { auth, db, googleProvider, setUpRecaptcha, signInWithPhoneNumber, signInWithPopup };

// import { initializeApp } from "firebase/app";
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup,createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
// import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import { getStorage } from "firebase/storage";  // ✅ Import Firebase Storage

// // ✅ Replace with Your Firebase Config
// const firebaseConfig = {
//     apiKey: "AIzaSyA0QtFwMTHgpxMBvcSTL96N9P4S8VORGnM",
//     authDomain: "perceptria.firebaseapp.com",
//     projectId: "perceptria",
//     storageBucket: "perceptria.appspot.com", // ✅ Ensure this is correctly set
//     messagingSenderId: "977849367649",
//     appId: "1:977849367649:web:56c3ac4a5625ddb5b7fe20"
// };

// // ✅ Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);  // ✅ Initialize Firebase Storage
// const googleProvider = new GoogleAuthProvider();

// // ✅ Correct ReCaptcha Setup (Fixes OTP Issue)
// const setUpRecaptcha = () => {
//   if (!window.recaptchaVerifier) {
//     window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//       size: "invisible",
//       callback: () => console.log("ReCaptcha Verified!"),
//       "expired-callback": () => console.warn("ReCaptcha Expired. Refresh and try again."),
//     });
//   }
// };

// export { auth, db, storage, googleProvider, setUpRecaptcha, signInWithPhoneNumber, signInWithPopup };


// firebaseConfig.js

    import { initializeApp } from "firebase/app";
    import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
    import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
    

    // Your Firebase config (omit measurementId if you don't need Google Analytics)
    const firebaseConfig = {
      apiKey: "AIzaSyAhBHQUA_yPBzMMv2ofPTexkndtXaxjIB4",
  authDomain: "perceptria-9e17b.firebaseapp.com",
  projectId: "perceptria-9e17b",
  storageBucket: "perceptria-9e17b.firebasestorage.app",
  messagingSenderId: "358196743493",
  appId: "1:358196743493:web:68e090a5c8e4e058b6422c",
  measurementId: "G-PJ4HYH09VH"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Get Auth and Firestore services
    const auth = getAuth(app);
    const googleProvider = new GoogleAuthProvider();
    const db = getFirestore(app);

    export { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, db };
