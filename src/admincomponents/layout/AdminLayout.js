import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "./AdminDashboard.css"; // Ensure global styles are applied

const AdminLayout = ({ children }) => {
  const [username, setUsername] = useState("");
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
  }, []);

  return (
    <div className="maindashboard">
      <AdminSidebar />
      <div className="dashboard-content">
        <AdminHeader 
          username={username} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
