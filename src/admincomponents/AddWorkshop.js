import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Input, Button, DatePicker, TimePicker, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import "./AdminDashboard.css";
import "./alerts.css";
import profileIcon from "./profile-icon.jpg";
import dayjs from "dayjs";

const AddWorkshop = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [workshopData, setWorkshopData] = useState({
    name: "",
    date: null,
    time: null,
    meetingLink: "",
    description: "",
    instructor: "",
    material: null,
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkshopData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (file) => {
    setWorkshopData((prevData) => ({
      ...prevData,
      material: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", workshopData.name);
    formData.append("date", workshopData.date);
    formData.append("time", workshopData.time);
    formData.append("meetingLink", workshopData.meetingLink);
    formData.append("description", workshopData.description);
    formData.append("instructor", workshopData.instructor);
    formData.append("material", workshopData.material);

    fetch("http://localhost:8080/api/workshops", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Workshop added successfully!");
          setWorkshopData({
            name: "",
            date: null,
            time: null,
            meetingLink: "",
            description: "",
            instructor: "",
            material: null,
          });
        } else {
          toast.error("Failed to add workshop.");
        }
      })
      .catch((error) => {
        console.error("Error adding workshop:", error);
        toast.error("Error adding workshop.");
      });
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
          <h2>Welcome, {username || "Admin User"}!</h2>
          <div className="profile">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="workshop-form-container">
          <h3>Add New Workshop</h3>
          <form onSubmit={handleSubmit} className="workshop-form">
            <div className="card">
              <label>Workshop Name</label>
              <Input
                type="text"
                name="name"
                value={workshopData.name}
                onChange={handleChange}
                placeholder="Enter workshop name"
                required
              />
            </div>

            <div className="card">
              <label>Date</label>
              <DatePicker
                value={workshopData.date ? dayjs(workshopData.date) : null}
                onChange={(date) => setWorkshopData({ ...workshopData, date })}
                style={{ width: "100%" }}
                required
              />
            </div>

            <div className="card">
              <label>Time</label>
              <TimePicker
                value={workshopData.time ? dayjs(workshopData.time) : null}
                onChange={(time) => setWorkshopData({ ...workshopData, time })}
                format="HH:mm"
                style={{ width: "100%" }}
                required
              />
            </div>

            <div className="card">
              <label>Meeting Link</label>
              <Input
                type="url"
                name="meetingLink"
                value={workshopData.meetingLink}
                onChange={handleChange}
                placeholder="Enter meeting link"
                required
              />
            </div>

            <div className="card">
              <label>Description</label>
              <Input.TextArea
                name="description"
                value={workshopData.description}
                onChange={handleChange}
                placeholder="Enter workshop description"
                rows={4}
                required
              />
            </div>

            <div className="card">
              <label>Instructor</label>
              <Input
                type="text"
                name="instructor"
                value={workshopData.instructor}
                onChange={handleChange}
                placeholder="Enter instructor name"
                required
              />
            </div>

            <div className="card">
              <label>Workshop Material</label>
              <Upload
                onChange={(info) => handleFileChange(info.file)}
                beforeUpload={() => false}
                accept=".pdf,.doc,.docx"
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Select Material</Button>
              </Upload>
              {workshopData.material && <p>{workshopData.material.name}</p>}
            </div>

            <Button type="primary" htmlType="submit" block className="submit-btn">
              Add Workshop
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWorkshop;
