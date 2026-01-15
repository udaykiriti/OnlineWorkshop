import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import profileIcon from "./profile-icon.jpg";
import { HomeOutlined, UnorderedListOutlined, AppstoreAddOutlined, CheckCircleOutlined, UserOutlined, MessageOutlined, BulbOutlined, BulbFilled } from "@ant-design/icons";
import Chatbot from "./Chatbot";
import { Skeleton, Button } from "antd";
import { motion, AnimatePresence } from "framer-motion";

function StudentDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [currentSection, setCurrentSection] = useState("home");
  const [workshopCount, setWorkshopCount] = useState(0);
  const [workshops, setWorkshops] = useState([]);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
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
      fetchWorkshops(storedUsername);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchWorkshops = async (username) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/registration/workshops/${username}`);
      const workshops = await response.json();
      setWorkshops(workshops);
      setWorkshopCount(workshops.length);
    } catch (error) {
      console.error("Error fetching workshops:", error);
    } finally {
      setTimeout(() => setLoading(false), 800); // Small delay for smooth transition
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleNavigation = (section) => {
    setCurrentSection(section);
    switch (section) {
      case "home":
        navigate("/student-dashboard");
        break;
      case "registration":
        navigate("/student-dashboard/registration");
        break;
      case "registered-workshops":
        navigate("/student-dashboard/registered-workshops");
        break;
      case "attendance":
        navigate("/student-dashboard/student-attendance");
        break;
      case "settings":
        navigate("/student-dashboard/student-settings");
        break;
      default:
        navigate("/student-dashboard");
    }
  };

  const handleMaterialDownload = (material) => {
    window.location.href = `http://localhost:8081/api/workshops/materials/${material}`;
  };

  const toggleChatbot = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="dashboard1">
      <div className="sidebar">
        <h2 className="admin-title">Student Dashboard</h2>
        <button onClick={() => handleNavigation("home")} className={`sidebar-link ${currentSection === "home" ? "active" : ""}`} aria-label="Go to Home">
          <HomeOutlined style={{ marginRight: "8px" }} /> Home
        </button>
        <button onClick={() => handleNavigation("registration")} className={`sidebar-link ${currentSection === "registration" ? "active" : ""}`} aria-label="Workshop Registration">
          <AppstoreAddOutlined style={{ marginRight: "8px" }} /> Workshop Registration
        </button>
        <button onClick={() => handleNavigation("registered-workshops")} className={`sidebar-link ${currentSection === "registered-workshops" ? "active" : ""}`} aria-label="View Registered Workshops">
          <UnorderedListOutlined style={{ marginRight: "8px" }} /> Registered Workshops
        </button>
        <button onClick={() => handleNavigation("attendance")} className={`sidebar-link ${currentSection === "attendance" ? "active" : ""}`} aria-label="View Attendance">
          <CheckCircleOutlined style={{ marginRight: "8px" }} /> Attendance
        </button>
        <button onClick={() => handleNavigation("settings")} className={`sidebar-link ${currentSection === "settings" ? "active" : ""}`} aria-label="Open Settings">
          <UserOutlined style={{ marginRight: "8px" }} /> Profile
        </button>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {username || "Student"}!</h2>
          <div className="profile">
            <Button 
              type="text" 
              icon={theme === "light" ? <BulbOutlined /> : <BulbFilled />} 
              onClick={toggleTheme}
              style={{ fontSize: "20px", marginRight: "10px", color: "var(--primary-color)" }}
            />
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Skeleton active paragraph={{ rows: 4 }} />
              <div style={{ marginTop: "40px" }}>
                <Skeleton.Button active size="large" shape="round" block style={{ height: "100px" }} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentSection}
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              {currentSection === "home" && (
                <div className="home-section">
                  <h3>Home Section</h3>
                  <div className="workshop-count-box">
                    <UnorderedListOutlined style={{ marginRight: "16px", fontSize: "29px", color: "#fff" }} />
                    <h4>Total Registered Workshops: {workshopCount}</h4>
                  </div>
                </div>
              )}

              {currentSection === "registration" && <h3>Workshop Registration Section</h3>}
              
              {currentSection === "registered-workshops" && (
                <div className="registered-workshops-section">
                  <h3>Registered Workshops</h3>
                  {workshops.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                      {workshops.map((workshop, index) => (
                        <motion.div 
                          key={workshop.id} 
                          className="workshop-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <h4>{workshop.name}</h4>
                          <p><strong>Date:</strong> {workshop.date}</p>
                          <p><strong>Time:</strong> {workshop.time}</p>
                          <p><strong>Instructor:</strong> {workshop.instructor}</p>
                          <p><strong>Description:</strong> {workshop.description}</p>
                          <button onClick={() => handleMaterialDownload(workshop.material)} className="material-download-btn">
                            Download Material
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p>No workshops registered yet.</p>
                  )}
                </div>
              )}

              {currentSection === "settings" && <h3>Settings Section</h3>}
              {currentSection === "attendance" && <h3>Attendance Section (Calendar removed for now)</h3>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button className="chatbot-button" onClick={toggleChatbot}>
         <MessageOutlined style={{ marginRight: "8px" }} />
       </button>

      {isChatbotVisible && (
        <div className="chatbot-popup">
          <Chatbot />
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;
