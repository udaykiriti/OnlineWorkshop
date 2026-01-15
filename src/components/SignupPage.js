import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signup_image from "./register_image.jpeg";
import "./LoginPage.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState(""); // Added DOB state
  const [gender, setGender] = useState(""); // Added Gender state
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Password matching check
    if (password !== retypePassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Construct user object to send in POST request
    const user = {
      username,
      email,
      phoneNumber,
      dob,
      gender,
      password,
    };

    try {
      // Make the POST request to register the user
      await axios.post(
        "http://localhost:8081/api/auth/signup",
        user
      );

      // Handle successful registration
      toast.success("Registration successful!");
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      // Handle error response
      console.error("There was an error during registration!", error);

      if (error.response && error.response.data) {
        const errorMessage = error.response.data;

        if (errorMessage === "Username already taken") {
          toast.error("Username already exists");
        } else if (errorMessage === "Email already exists") {
          toast.error("Email already exists");
        } else {
          toast.error("Registration failed");
        }
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image-container">
          <img src={signup_image} alt="signup" className="login-image" />
        </div>
        <div className="login-form-container">
            <div className="login-header">
                <h2>Create Account</h2>
            </div>
          <form className="login-form" onSubmit={handleRegister}>
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
                <label htmlFor="email">Email</label>
                <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                />
            </div>

            <div className="input-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                type="text"
                id="phoneNumber"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="input-field"
                />
            </div>

            <div className="input-row">
                <div className="input-group half-width">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                    type="date"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                    className="input-field"
                    />
                </div>

                <div className="input-group half-width">
                    <label htmlFor="gender">Gender</label>
                    <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="input-field"
                    >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    </select>
                </div>
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

            <div className="input-group">
                <label htmlFor="retypePassword">Retype Password</label>
                <input
                type="password"
                id="retypePassword"
                placeholder="Retype your password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                required
                className="input-field"
                />
            </div>

            <button type="submit" className="login-button">
              Register
            </button>
          </form>
          <div className="registration-link">
            <span>Already have an account? </span>
            <a href="/">Login</a>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default Signup;
