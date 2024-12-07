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

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    try {
      await axios.post("/api/auth/reset-password", { token, newPassword });
      toast.success("Password reset successfully.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password.");
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
