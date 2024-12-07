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

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (password !== retypePassword) {
      toast.error("Passwords do not match");
      return;
    }

    const user = {
      username,
      email,
      phoneNumber,
      dob,
      gender,
      password,
    };

    try {
      await axios.post("http://localhost:8080/api/auth/signup", user);
      toast.success("Registration successful!");
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
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
          src={signup_image}
          alt="signup"
        /> 
        <div className="login-section" style={{ marginRight: "30px", marginTop: "70px"}}>
          <form className="login-form" onSubmit={handleRegister}>
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

            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="input-field"
            />

            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="input-field"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

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

            <button type="submit" className="next-button">
              Register
            </button>
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
}

export default Signup;
