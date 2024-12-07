import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) throw new Error("Failed to send reset link.");

      toast.success("Reset link sent to your email.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      setEmail("");
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error("Error sending reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? (
            <>
              <span className="spinner"></span> Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>
      <p className="login-redirect">
        Remembered your password? <a href="/login">Log in</a>
      </p>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default ForgotPassword;
