import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Settings.css";
import { EditOutlined, CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Input, Card, Spin } from "antd";

const Settings = () => {
  const navigate = useNavigate();
  const storedUsername = localStorage.getItem("username") || "admin"; 
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editField, setEditField] = useState(null);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://onlineworkshop-server-production.up.railway.app/api/users/${storedUsername}` 
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user profile.");
        }
        const data = await response.json();
        const { id, ...profileData } = data; 
        setUserProfile(profileData); 
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [storedUsername]);

  const handleLogout = () => {
    if (window.confirm("Do you really want to log out?")) {
      localStorage.removeItem("username");
      toast.success("You have logged out successfully!");
      navigate("/login");
    }
  };

  const handleEditField = (field, value) => {
    setEditField(field);
    setNewValue(value);
  };

  const handleUpdateField = async (field) => {
    try {
      const updatedProfile = {
        ...userProfile,
        [field]: newValue,
      };

      const response = await fetch(
        `http://localhost:8080/api/users/${storedUsername}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        }
      );
      
      if (response.ok) {
        setUserProfile(updatedProfile); 
        toast.success(
          `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`
        );
        setEditField(null);
        setNewValue("");
      } else {
        throw new Error("Error updating profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile: " + error.message);
    }
  };

  return (
    <div className="dashboard1">
      <ToastContainer />
      <div className="sidebar">
        <h2 className="admin-title">Admin Dashboard</h2>
        <button onClick={() => navigate("/admin-dashboard")}>Home</button>
        <button onClick={() => navigate("/add-workshop")}>Add Workshop</button>
        <button onClick={() => navigate("/view-workshops")}>View Workshops</button>
        <button onClick={() => navigate("/manage-users")}>Manage Users</button>
        <button onClick={() => navigate("/faculty-management")}>Faculty Management</button>
        <button onClick={() => navigate("/admin-attendance")}>Admin Attendance</button>
        <button onClick={() => navigate("/settings")}>Profile</button>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {storedUsername}!</h2>
          <div className="profile">
            <img
              src={require("./profile-icon.jpg")}
              alt="Profile"
              className="profile-icon"
            />
            <Button className="logout-btn" onClick={handleLogout} type="primary">
              Logout
            </Button>
          </div>
        </div>

        <h3>Edit Profile</h3>

        {loading ? (
          <div className="loading-spinner">
            <Spin size="large" />
            <p>Loading...</p>
          </div>
        ) : (
          <div className="profile-container">
            {Object.entries(userProfile).map(([key, value]) => (
              key !== "password" && (
                <Card key={key} className="profile-card">
                  <div className="profile-field">
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                    {editField === key ? (
                      <div className="edit-field">
                        <Input
                          type="text"
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          className="input-field"
                        />
                        <Button
                          icon={<SaveOutlined />}
                          onClick={() => handleUpdateField(key)}
                          type="primary"
                        />
                        <Button
                          icon={<CloseOutlined />}
                          onClick={() => setEditField(null)}
                          type="default"
                        />
                      </div>
                    ) : (
                      <div className="view-field">
                        <span>{value}</span>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => handleEditField(key, value)}
                          type="link"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
