import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

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

    fetch(`http://localhost:8081/api/workshops/${workshop.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedWorkshop),
    })
      .then((response) => {
        if (response.ok) {
          navigate("/view-workshops");
        } else {
          console.error("Failed to update workshop");
        }
      })
      .catch((error) => {
        console.error("Error updating workshop:", error);
      });
  };

  return (
    <div className="dashboard">
      <h2>Update Workshop</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Instructor:</label>
          <input
            type="text"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Workshop</button>
      </form>
    </div>
  );
};

export default UpdateWorkshop;
