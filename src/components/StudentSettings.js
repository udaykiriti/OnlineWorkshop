import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HomeOutlined, AppstoreAddOutlined, UnorderedListOutlined, CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Button, Input } from "antd"; 

const StudentSettings = () => {
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editField, setEditField] = useState(null);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      fetchStudentProfile(storedUsername);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchStudentProfile = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${username}` 
      );
      if (!response.ok) {
        throw new Error("Failed to fetch student profile.");
      }
      const data = await response.json();
      setStudentProfile(data);
    } catch (error) {
      console.error("Error fetching student profile:", error);
      toast.error("Failed to load student profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Do you really want to log out?")) {
      localStorage.removeItem("username");
      toast.success("Logged out successfully!");
      navigate("/login");
    }
  };

  const handleEditField = (field, value) => {
    setEditField(field);
    setNewValue(value || "");
  };

  const handleUpdateField = async (field) => {
    if (!newValue.trim()) {
      toast.error("Please enter a valid value.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${studentProfile.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...studentProfile,
            [field]: newValue,
          }),
        }
      );
      if (response.ok) {
        setStudentProfile((prevProfile) => ({
          ...prevProfile,
          [field]: newValue,
        }));
        toast.success(
          `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`
        );
        setEditField(null);
        setNewValue("");
      } else {
        throw new Error("Failed to update profile.");
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
        <h2 className="admin-title">Student Dashboard</h2>
        <button onClick={() => navigate("/student-dashboard")} className="sidebar-link">
          <HomeOutlined style={{ marginRight: "8px" }} /> Home
        </button>
        <button onClick={() => navigate("/student-dashboard/registration")} className="sidebar-link">
          <AppstoreAddOutlined style={{ marginRight: "8px" }} /> Workshop Registration
        </button>
        <button onClick={() => navigate("/student-dashboard/registered-workshops")} className="sidebar-link">
          <UnorderedListOutlined style={{ marginRight: "8px" }} /> Registered Workshops
        </button>
        <button onClick={() => navigate("/student-dashboard/student-attendance")} className="sidebar-link">
          <CheckCircleOutlined style={{ marginRight: "8px" }} /> Attendance
        </button>
        <button onClick={() => navigate("/student-dashboard/student-settings")} className="sidebar-link">
          <UserOutlined style={{ marginRight: "8px" }} /> Profile
        </button>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {studentProfile.username || "User"}!</h2>
          <Button className="logout-btn" onClick={handleLogout} type="primary">Logout</Button>
        </div>

        <h3>Edit Profile</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="profile-card-container">
            {Object.keys(studentProfile).length > 0 ? (
              Object.entries(studentProfile).map(([key, value]) => {
                if (key === "role" || key === "password" || key === "id") return null;

                return (
                  <Card key={key} title={key.charAt(0).toUpperCase() + key.slice(1)} className="profile-card">
                    <div className="profile-field">
                      {editField === key ? (
                        <div className="edit-field">
                          <Input
                            type="text" 
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            className="input-field"
                          />
                          <Button onClick={() => handleUpdateField(key)} type="primary">Save</Button>
                          <Button onClick={() => setEditField(null)} type="default">Cancel</Button>
                        </div>
                      ) : (
                        <div className="view-field">
                          <span>{value || "N/A"}</span>
                          <Button onClick={() => handleEditField(key, value)} type="link">Edit</Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
            ) : (
              <p>No profile data found for username: {studentProfile.username}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSettings;
