import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return alert("Enter your email address!");
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <input type="email" placeholder="Enter email" className="input" onChange={(e) => setEmail(e.target.value)} />
        <button onClick={handleReset} className="button">{loading ? "Sending..." : "Send Reset Link"}</button>
      </div>
    </div>
  );
};

export default ForgotPassword;
