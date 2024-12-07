import axios from "axios";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Circles } from "react-loader-spinner";
import { FaSyncAlt } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";
import login_image from "./6101073.jpg";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const generateCaptcha = useCallback(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const captchaText = Array.from({ length: 6 })
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
    setCaptcha(captchaText);
    drawCaptcha(captchaText);
  }, []);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "lightgrey";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillStyle = "black";
    context.fillText(text, canvas.width / 2, canvas.height / 1.5);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (captchaInput !== captcha) {
      setIsLoading(false);
      toast.error("Invalid CAPTCHA. Please try again.", { position: "top-center" });
      generateCaptcha();
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username, password }
      );

      if (response.status === 200) {
        const { role } = response.data;
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        toast.success("Login successful!", { position: "top-center" });

        setTimeout(() => {
          setIsLoading(false);
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "faculty") {
            navigate("/faculty-dashboard");
          } else {
            navigate("/student-dashboard");
          }
        }, 1500);
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      setIsLoading(false);
      toast.error("Login failed: Invalid credentials", { position: "top-center" });
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-box">
        <img
          style={{
            height: "60vh",
            marginLeft: "70px",
            marginTop: "100px",
            paddingTop: "40px",
            display: "flex",
            alignItems: "center",
          }}
          src={login_image}
          alt="Login"
        />
        <div className="image-section" />
        <div className="login-section1" style={{ marginRight: "190px" }}>
          <div className="login-header"></div>
          <p className="subtitle">The key to happiness is to sign in.</p>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="input-group captcha-group">
              <label>Captcha</label>
              <div className="captcha-wrapper">
                <canvas
                  ref={canvasRef}
                  width={150}
                  height={50}
                  style={{
                    border: "1px solid black",
                    marginBottom: "10px",
                    marginRight: "10px",
                  }}
                />
                <FaSyncAlt
                  size={24}
                  color="#000"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={generateCaptcha}
                  title="Refresh CAPTCHA"
                />
              </div>
              <input
                type="text"
                placeholder="Enter CAPTCHA"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>

            <button type="submit" className="next-button" disabled={isLoading}>
              Login
            </button>
          </form>

          {isLoading && (
            <div className="loader">
              <Circles height="50" width="50" color="#4fa94d" ariaLabel="loading" />
            </div>
          )}

          <div className="registration-link">
            <a href="/signup">Registration</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
