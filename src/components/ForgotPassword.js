import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Circles } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";
import login_image from "./6101073.jpg";

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
        "http://localhost:8081/api/auth/forgot-password",
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
        navigate("/");
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-image-container">
          <img src={login_image} alt="Forgot Password" className="login-image" />
          <div className="image-overlay"></div>
        </div>
        <div className="login-form-container">
          <div className="login-header">
            <h2>Forgot Password</h2>
          </div>
          <p className="subtitle">Enter your email to receive a reset link.</p>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          
          {loading && (
             <div className="loader-container">
               <Circles height="50" width="50" color="#4fa94d" ariaLabel="loading" />
             </div>
          )}

          <div className="registration-link">
            <span>Remembered your password? </span>
            <a href="/">Login</a>
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

export default ForgotPassword;
