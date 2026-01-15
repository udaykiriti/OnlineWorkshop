/**
 * FacultyDashboard Component
 * ----------------------------------
 * This component serves as the main dashboard for faculty users.
 * It provides navigation options to different faculty-related features such as:
 * - Home
 * - View Users
 * - View Workshops
 * - Attendance
 * - Profile
 * 
 * It retrieves the logged-in faculty's username from localStorage and displays it in the dashboard.
 * The sidebar contains navigation buttons, while the top-right profile section provides a logout option.
 */

import React, { useEffect, useState } from "react";
import "./FacultyDashboard.css"; // Custom CSS for dashboard styling
import { useNavigate } from "react-router-dom"; // React Router for navigation
import profileIcon from "./profile-icon.jpg"; // Profile image/icon

// Ant Design icons for navigation menu
import {
  HomeOutlined,
  UnorderedListOutlined,
  AppstoreAddOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const FacultyDashboard = () => {
  const navigate = useNavigate();

  // State to store faculty username
  const [username, setUsername] = useState("");

  /**
   * useEffect Hook
   * Runs once on component mount.
   * Retrieves stored username from localStorage (if any).
   */
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  /**
   * handleLogout
   * Logs the user out by clearing username from localStorage
   * and redirects to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  /**
   * handleNavigation
   * Navigates the user to a given path when a sidebar button is clicked.
   */
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard1">
      {/* Sidebar Section */}
      <div className="sidebar">
        <h2 className="admin-title">Faculty Dashboard</h2>

        {/* Navigation buttons */}
        <button onClick={() => handleNavigation("/faculty-dashboard")} className="active">
          <HomeOutlined style={{ marginRight: "8px" }} /> Home
        </button>
        <button onClick={() => handleNavigation("/faculty-view-users")}>
          <UserOutlined style={{ marginRight: "8px" }} /> View Users
        </button>
        <button onClick={() => handleNavigation("/faculty-view-workshops")}>
          <AppstoreAddOutlined style={{ marginRight: "8px" }} /> View Workshops
        </button>
        <button onClick={() => handleNavigation("/faculty-attendance")}>
          <CheckCircleOutlined style={{ marginRight: "8px" }} /> Attendance
        </button>
        <button onClick={() => handleNavigation("/faculty-settings")}>
          <UnorderedListOutlined style={{ marginRight: "8px" }} /> Profile
        </button>
      </div>

      {/* Main Content Section */}
      <div className="dashboard-content">
        {/* Dashboard Header with profile & logout */}
        <div className="dashboard-header">
          <h2>Welcome, {username || "Faculty"}!</h2>
          <div className="profile">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <span>{username || "Faculty"}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Overview */}
        <h3>Faculty Dashboard Overview</h3>
        <p>Here you can manage your workshops timetable</p>
      </div>
    </div>
  );
};

export default FacultyDashboard;
