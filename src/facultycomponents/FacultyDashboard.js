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
import "./FacultyDashboard.css"; 
import { useNavigate } from "react-router-dom"; 
import profileIcon from "./profile-icon.jpg";
import { HomeOutlined, UnorderedListOutlined, AppstoreAddOutlined, CheckCircleOutlined, UserOutlined, BulbOutlined, BulbFilled } from "@ant-design/icons";
import { Skeleton, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    // Simulate loading for better UX
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
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

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {username || "Faculty"}!</h2>
          <div className="profile">
            <Button 
              type="text" 
              icon={theme === "light" ? <BulbOutlined /> : <BulbFilled />} 
              onClick={toggleTheme}
              style={{ fontSize: "20px", marginRight: "10px", color: "var(--primary-color)" }}
            />
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <span>{username || "Faculty"}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Skeleton active paragraph={{ rows: 6 }} title={{ width: '40%' }} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3>Faculty Dashboard Overview</h3>
              <p>Here you can manage your workshops timetable</p>
              
              <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                <div style={{ background: "var(--card-bg)", padding: "20px", borderRadius: "12px", boxShadow: "var(--shadow)", border: "1px solid var(--border-color)" }}>
                  <HomeOutlined style={{ fontSize: "32px", color: "var(--primary-color)" }} />
                  <h4 style={{ margin: "15px 0 5px" }}>Active Workshops</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>Manage Now</p>
                </div>
                <div style={{ background: "var(--card-bg)", padding: "20px", borderRadius: "12px", boxShadow: "var(--shadow)", border: "1px solid var(--border-color)" }}>
                  <UserOutlined style={{ fontSize: "32px", color: "var(--accent-color)" }} />
                  <h4 style={{ margin: "15px 0 5px" }}>Students</h4>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>View List</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FacultyDashboard;
