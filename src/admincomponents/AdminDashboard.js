import React, { useEffect, useState } from "react";
import { Popover, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import profileIcon from "./profile-icon.jpg";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "./AdminDashboard.css";
import { UserOutlined } from "@ant-design/icons"; 
import { CalendarOutlined } from "@ant-design/icons"; // Icon for workshops

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [totalUsers, setTotalUsers] = useState(0); 
  const [totalWorkshops, setTotalWorkshops] = useState(0); // State for workshops count
  const [genderData, setGenderData] = useState({});
  const [roleData, setRoleData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    fetchUserData();
    fetchGenderData();
    fetchWorkshopsCount(); // Fetch workshops count
  }, []);

  const fetchGenderData = async () => {
    try {
      const response = await axios.get("https://onlineworkshop-server-production.up.railway.app/users"); 
      const data = response.data;

      const genderCounts = data.reduce((acc, user) => {
        acc[user.gender] = (acc[user.gender] || 0) + 1;
        return acc;
      }, {});

      setGenderData({
        labels: Object.keys(genderCounts),
        datasets: [
          {
            data: Object.values(genderCounts),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch gender data:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users"); 
      const data = response.data;

      const roleCounts = data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      setTotalUsers(data.length);

      setRoleData({
        labels: Object.keys(roleCounts),
        datasets: [
          {
            data: Object.values(roleCounts),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchWorkshopsCount = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/workshops"); 
      const data = response.data;
      setTotalWorkshops(data.length); // Set workshops count
    } catch (error) {
      console.error("Failed to fetch workshops count:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isPopoverOpen = Boolean(anchorEl);

  return (
    <div className="maindashboard">
      <div className="sidebar">
        <h2 className="admin-title">Admin Dashboard</h2>
        <button onClick={() => navigateTo("/admin-dashboard")}>Home</button>
        <button onClick={() => navigateTo("/add-workshop")}>Add Workshop</button>
        <button onClick={() => navigateTo("/view-workshops")}>View Workshops</button>
        <button onClick={() => navigateTo("/manage-users")}>Manage Users</button>
        <button onClick={() => navigateTo("/faculty-management")}>
          Faculty Management
        </button>
        <button onClick={() => navigateTo("/admin-attendance")}>
          Admin Attendance
        </button>
        <button onClick={() => navigateTo("/settings")}>Profile</button>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {username || "Admin User"}!</h2>
          <div className="profile">
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
        </div>
        <h3>Admin Dashboard Overview</h3>

        <div className="charts-container">
          {/* Total Users */}
          <div className="stat-card">
            <UserOutlined style={{ fontSize: "48px", color: "#1890FF" }} />
            <h4>Total Users</h4>
            <p className="stat-value">{totalUsers}</p>
          </div>

          {/* Total Workshops */}
          <div className="stat-card">
            <CalendarOutlined style={{ fontSize: "48px", color: "#FF8C00" }} />
            <h4>Total Workshops</h4>
            <p className="stat-value">{totalWorkshops}</p>
          </div>

          {/* Gender Distribution Chart */}
          <div className="chart-container">
            <h4>Gender Distribution</h4>
            {genderData.datasets ? (
              <Pie
                data={genderData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                }}
                height={200}
                width={200}
              />
            ) : (
              <p>Loading gender data...</p>
            )}
          </div>

          {/* User Roles Distribution Chart */}
          <div className="chart-container">
            <h4>User Roles Distribution</h4>
            {roleData.datasets ? (
              <Pie
                data={roleData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                }}
                height={200}
                width={200}
              />
            ) : (
              <p>Loading role data...</p>
            )}
          </div>
        </div>
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
        <Box sx={{ p: 5, width: 270 }}>
          <Typography variant="h6">Profile Information</Typography>
          <Typography sx={{ mt: 1 }}>
            Username: {username || "Admin User"}
          </Typography>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
          >
            Close
          </Button>
        </Box>
      </Popover>
    </div>
  );
};

export default AdminDashboard;
