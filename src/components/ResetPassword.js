import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    // Validate that passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Get the token from the URL query params
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    // Try to send the reset password request
    try {
      const response = await axios.post(
        "https://onlineworkshop-server-production.up.railway.app/api/auth/reset-password", 
        { token, newPassword }
      );
      toast.success("Password reset successfully.");
      setTimeout(() => navigate("/login"), 3000);  // Redirect to login after successful reset
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        toast.error(err.response?.data?.message || "Error resetting password.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handlePasswordReset}>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default ResetPassword;
