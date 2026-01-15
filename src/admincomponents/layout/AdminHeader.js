import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popover, Box, Typography, Button } from "@mui/material";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import profileIcon from "../assets/profile-icon.jpg"; // Ensure this path is correct relative to this file
import "./AdminDashboard.css";

const AdminHeader = ({ username, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const isPopoverOpen = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="dashboard-header">
      <h2>Welcome, {username || "Admin User"}!</h2>
      <div className="profile">
        <Button 
          onClick={toggleTheme}
          style={{ fontSize: "20px", marginRight: "10px", color: "var(--primary-color)", border: "none", background: "none", minWidth: "auto" }}
        >
          {theme === "light" ? <BulbOutlined /> : <BulbFilled />}
        </Button>
        <img
          src={profileIcon}
          alt="Profile"
          className="profile-icon"
          onClick={handleOpen}
          style={{ cursor: "pointer" }}
        />
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 3, width: 250, bgcolor: "var(--card-bg)", color: "var(--text-color)" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Profile Information</Typography>
          <Typography sx={{ mb: 2 }}>
            <strong>Username:</strong> {username || "Admin User"}
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
             <button className="logout-btn" onClick={handleLogout} style={{ width: '100%' }}>
              Logout
            </button>
            <Button
              onClick={handleClose}
              variant="outlined"
              size="small"
              sx={{ color: "var(--primary-color)", borderColor: "var(--primary-color)" }}
            >
              Close
            </Button>
          </div>
        </Box>
      </Popover>
    </div>
  );
};

export default AdminHeader;
