import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";
import login_image from "./6101073.jpg";

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
      await axios.post(
        "http://localhost:8081/api/auth/reset-password", 
        { token, newPassword }
      );
      toast.success("Password reset successfully.");
      setTimeout(() => navigate("/"), 3000);  // Redirect to login after successful reset
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-image-container">
          <img src={login_image} alt="Reset Password" className="login-image" />
          <div className="image-overlay"></div>
        </div>
        <div className="login-form-container">
          <div className="login-header">
            <h2>Reset Password</h2>
          </div>
          <p className="subtitle">Enter your new password below.</p>
          <form className="login-form" onSubmit={handlePasswordReset}>
            <div className="input-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="input-field"
                placeholder="Enter new password"
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-field"
                placeholder="Confirm new password"
              />
            </div>
            <button type="submit" className="login-button">Reset Password</button>
          </form>
          <div className="registration-link">
            <a href="/">Back to Login</a>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default ResetPassword;
