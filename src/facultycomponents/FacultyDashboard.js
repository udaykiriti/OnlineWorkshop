import React, { useEffect, useState } from "react";
import "./FacultyDashboard.css";
import { useNavigate } from "react-router-dom";
import profileIcon from "./profile-icon.jpg";
import { HomeOutlined, UnorderedListOutlined, AppstoreAddOutlined, CheckCircleOutlined, UserOutlined } from "@ant-design/icons";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); 
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div className="dashboard1">
      <div className="sidebar">
        <h2 className="admin-title">Faculty Dashboard</h2>
        <button onClick={() => handleNavigation("/faculty-dashboard")}>
        <HomeOutlined style={{ marginRight: "8px" }} /> Home
        </button>
        <button onClick={() => handleNavigation("/faculty-view-users")}>
        <UserOutlined style={{ marginRight: "8px" }} /> View Users
        </button>
        <button onClick={() => handleNavigation("/faculty-view-workshops")}>
        <AppstoreAddOutlined style={{ marginRight: "8px" }} /> View Workshops
        </button>
        <button onClick={() => handleNavigation("/faculty-attendance")}>
          {" "}
          <CheckCircleOutlined style={{ marginRight: "8px" }} /> Attendance
        </button>
        <button onClick={() => handleNavigation("/faculty-settings")}>
        <UnorderedListOutlined style={{ marginRight: "8px" }} />      Profile
        </button>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {username || "Faculty"}!</h2>{" "}
          <div className="profile">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <span>{username || "Faculty"}</span>{" "}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <h3>Faculty Dashboard Overview</h3>
        <p>Here you can manage your workshops timetable</p>
      </div>
    </div>
  );
};
export default FacultyDashboard;
