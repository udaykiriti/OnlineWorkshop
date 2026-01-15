import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../layout/AdminDashboard.css";
import AdminLayout from "../layout/AdminLayout";
import api from "../../api";

const UpdateWorkshop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workshop } = location.state || {};

  const [name, setName] = useState(workshop?.name || "");
  const [date, setDate] = useState(workshop?.date || "");
  const [description, setDescription] = useState(workshop?.description || "");
  const [instructor, setInstructor] = useState(workshop?.instructor || "");

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedWorkshop = {
      id: workshop.id,
      name,
      date,
      description,
      instructor,
    };

    api.put(`/api/workshops/${workshop.id}`, updatedWorkshop)
      .then(() => {
        navigate("/view-workshops");
      })
      .catch((error) => {
        console.error("Error updating workshop:", error);
      });
  };

  return (
    <AdminLayout>
      <h2>Update Workshop</h2>
      <form onSubmit={handleUpdate} className="workshop-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="ant-input" // Reusing ant design classes if available or adding simple styling
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="ant-input"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="ant-input"
            style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '100px' }}
          />
        </div>
        <div className="form-group">
          <label>Instructor:</label>
          <input
            type="text"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
            className="ant-input"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <button type="submit" className="submit-btn" style={{ width: 'auto', padding: '10px 20px' }}>Update Workshop</button>
      </form>
    </AdminLayout>
  );
};

export default UpdateWorkshop;