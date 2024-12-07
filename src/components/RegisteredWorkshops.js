import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisteredWorkshops.css";
import "./StudentDashboard.css";
import backgroundImg from "./background.jpg";
import { HomeOutlined, UnorderedListOutlined, AppstoreAddOutlined, CheckCircleOutlined,  UserOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisteredWorkshops = () => {
  const navigate = useNavigate();
  const [registeredWorkshops, setRegisteredWorkshops] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRegisteredWorkshops = async () => {
      const username = localStorage.getItem("username");
      if (username) {
        try {
          const response = await fetch(
            `https://onlineworkshop-server-production.up.railway.app/api/registration/workshops/${username}`
          );
          const data = await response.json();
          setRegisteredWorkshops(data);
        } catch (error) {
          console.error("Error fetching registered workshops:", error);
          setNotification({
            message: "Error fetching registered workshops.",
            type: "error",
          });
        }
      } else {
        setNotification({
          message: "User not logged in.",
          type: "error",
        });
      }
    };

    fetchRegisteredWorkshops();
  }, []);

  const handleUnregister = async (workshopId, workshopDate, workshopTime) => {
    const username = localStorage.getItem("username");

    const isDisabled = isUnregisterDisabled(workshopDate, workshopTime);
    if (isDisabled) {
      toast.error("You cannot unregister within 2 hours of the event.");
      return; 
    }

    try {
      const response = await fetch(
        `https://onlineworkshop-server-production.up.railway.app/api/registration/${workshopId}?username=${username}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRegisteredWorkshops((prev) =>
          prev.filter((workshop) => workshop.id !== workshopId)
        );
        setNotification({
          message: "Unregistered successfully.",
          type: "success",
        });
      } else {
        setNotification({ message: "Failed to unregister.", type: "error" });
      }
    } catch (error) {
      console.error("Error unregistering from workshop:", error);
      setNotification({
        message: "Error unregistering from workshop.",
        type: "error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const isUnregisterDisabled = (workshopDate, workshopTime) => {
    try {
      const workshopDateTime = new Date(`${workshopDate}T${workshopTime}:00`);
      const currentTime = new Date();

      const timeDifference = (workshopDateTime - currentTime) / (1000 * 60 * 60);

      return timeDifference <= 2; 
    } catch (error) {
      console.error("Error in isUnregisterDisabled:", error);
      return true; 
    }
  };

  const filteredWorkshops = registeredWorkshops.filter((workshop) =>
    workshop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredWorkshops.length / itemsPerPage);
  const paginatedWorkshops = filteredWorkshops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="dashboard1">
      <div className="sidebar">
        <h2 className="admin-title">Student Dashboard</h2>
        <button
          onClick={() => navigate("/student-dashboard")}
          className="sidebar-link"
        >
          <HomeOutlined style={{ marginRight: "8px" }} />Home
        </button>
        <button
          onClick={() => navigate("/student-dashboard/registration")}
          className="sidebar-link"
        >
          <AppstoreAddOutlined style={{ marginRight: "8px" }} /> Workshop Registration
        </button>
        <button
          onClick={() => navigate("/student-dashboard/registered-workshops")}
          className="sidebar-link active"
        >
          <UnorderedListOutlined style={{ marginRight: "8px" }} /> Registered Workshops
        </button>
        <button
          onClick={() => navigate("/student-dashboard/student-attendance")}
          className="sidebar-link"
        >
          <CheckCircleOutlined style={{ marginRight: "8px" }} /> Attendance
        </button>
        <button
          onClick={() => navigate("/student-dashboard/student-settings")}
          className="sidebar-link"
        >
          <UserOutlined style={{ marginRight: "8px" }} /> Profile
        </button>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {localStorage.getItem("username") || "Student"}!</h2>
          <div className="profile">
            <img src={require("./profile-icon.jpg")} alt="Profile" className="profile-icon" />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <h3>Registered Workshops</h3>
        {notification.message && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        <input
          type="text"
          placeholder="Search workshops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        {registeredWorkshops.length === 0 ? (
          <p>No registered workshops found.</p>
        ) : (
          <ul className="registered-workshop-list">
            {paginatedWorkshops.map((workshop) => (
              <li key={workshop.id} className="registered-workshop-item">
                <img
                  src={backgroundImg}
                  alt="Workshop"
                  className="workshop-image"
                />
                <h4>{workshop.name}</h4>
                <p>
                  {workshop.date} at {workshop.time}
                </p>
                <a
                  href={workshop.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meeting-link"
                >
                  Join Meeting
                </a>
                {workshop.material && (
                  <div className="workshop-material">
                    <a
                      href={`http://localhost:8080/api/workshops/materials/${workshop.material}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="material-link"
                    >
                      View Material
                    </a>
                  </div>
                )}
                <button
                  onClick={() =>
                    handleUnregister(workshop.id, workshop.date, workshop.time)
                  }
                  className="unregister-btn"
                  disabled={isUnregisterDisabled(workshop.date, workshop.time)}
                  title={
                    isUnregisterDisabled(workshop.date, workshop.time)
                      ? "Unregistering is disabled within 2 hours of the event."
                      : ""
                  }
                >
                  Unregister
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="pagination">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisteredWorkshops;
