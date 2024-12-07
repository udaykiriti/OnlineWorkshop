import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Input, Table } from "antd";
import { LogoutOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons"; 
import { HomeOutlined, UnorderedListOutlined, AppstoreAddOutlined, CheckCircleOutlined, UserOutlined } from "@ant-design/icons";

import profileIcon from "./profile-icon.jpg";

const FacultySettings = () => {
  const navigate = useNavigate();
  const facultyUsername = localStorage.getItem("username") || "Faculty"; 
  const [facultyProfile, setFacultyProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editField, setEditField] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); 

  useEffect(() => {
    const fetchFacultyProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/users/${facultyUsername}` 
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFacultyProfile(data); 
      } catch (error) {
        console.error("Error fetching faculty profile:", error);
        toast.error("Failed to load faculty profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyProfile();
  }, [facultyUsername]); 

  const handleLogout = () => {
    if (window.confirm("Do you really want to log out?")) {
      localStorage.removeItem("username"); 
      toast.success("You have logged out successfully!");
      navigate("/login");
    }
  };

  const handleEditField = (field) => {
    if (field === "role" || field === "password") {
      return; 
    }
    setEditField(field);
    setNewValue(facultyProfile[field]); 
  };

  const handleUpdateField = async (field) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${facultyUsername}`, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...facultyProfile,
            [field]: newValue, 
          }),
        }
      );
      if (response.ok) {
        setFacultyProfile((prevProfile) => ({
          ...prevProfile,
          [field]: newValue,
        }));
        toast.success(
          `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`
        );
        setEditField(null); 
      } else {
        toast.error("Error updating profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); 
  };

  return (
    <div className="dashboard1">
      <ToastContainer />
      <div className="sidebar">
        <h2 className="admin-title">Faculty Dashboard</h2>
        <button onClick={() => navigate("/faculty-dashboard")}>
          <HomeOutlined style={{ marginRight: "8px" }} />Home
        </button>
        <button onClick={() => navigate("/faculty-view-users")}>
          <AppstoreAddOutlined style={{ marginRight: "8px" }} />View Users
        </button>
        <button onClick={() => navigate("/faculty-view-workshops")}>
          <UnorderedListOutlined style={{ marginRight: "8px" }} />View Workshops
        </button>
        <button onClick={() => navigate("/faculty-attendance")}>
          <CheckCircleOutlined style={{ marginRight: "8px" }} />Attendance
        </button>
        <button onClick={() => navigate("/faculty-settings")}>
          <UserOutlined style={{ marginRight: "8px" }} />Profile
        </button>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {facultyUsername}!</h2>
          <div className="profile">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </Button>
          </div>
        </div>

        <h3>Edit Profile</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table
            dataSource={Object.entries(facultyProfile).map(([key, value]) => ({
              key,
              field: key.charAt(0).toUpperCase() + key.slice(1), 
              value,
            }))}
            columns={[
              {
                title: "Field",
                dataIndex: "field",
                key: "field",
              },
              {
                title: "Value",
                dataIndex: "value",
                key: "value",
                render: (text, record) => (
                  <div>
                    {editField === record.key ? (
                      <div className="edit-field">
                        <Input
                          type={record.key === "password" && !passwordVisible ? "password" : "text"}
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)} 
                          className="input-field"
                        />
                        {record.key === "password" && (
                          <Button onClick={togglePasswordVisibility} style={{ marginLeft: "10px" }}>
                            {passwordVisible ? "Hide" : "Show"} Password
                          </Button>
                        )}
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={() => handleUpdateField(record.key)} 
                        >
                          Save
                        </Button>
                        <Button
                          type="default"
                          icon={<CloseOutlined />}
                          onClick={() => setEditField(null)} 
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="view-field">
                        <span>{text}</span>
                        {(record.key !== "role" && record.key !== "password") && (
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEditField(record.key)} 
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
            pagination={false}
            bordered
          />
        )}
      </div>
    </div>
  );
};

export default FacultySettings;
