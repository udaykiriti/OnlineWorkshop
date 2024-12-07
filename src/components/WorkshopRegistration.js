import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./WorkshopRegistration.css";
import "./StudentDashboard.css";
import backgroundImage from "./background.jpg"; 
import { HomeOutlined, UnorderedListOutlined, AppstoreAddOutlined, CheckCircleOutlined,  UserOutlined } from "@ant-design/icons";

const WorkshopRegistration = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [registeredWorkshops, setRegisteredWorkshops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [workshopsPerPage] = useState(4);

  useEffect(() => {
    fetchWorkshops();
    fetchRegisteredWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/workshops");
      if (!response.ok) {
        throw new Error("Failed to fetch workshops");
      }
      const data = await response.json();
      setWorkshops(data);
    } catch (error) {
      console.error("Error fetching workshops:", error);
      toast.error("Failed to fetch workshops. Please try again.");
    }
  };

  const fetchRegisteredWorkshops = async () => {
    const username = localStorage.getItem("username");
    if (username) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/registration/workshops/${username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch registered workshops");
        }
        const data = await response.json();
        setRegisteredWorkshops(data.map((workshop) => workshop.id));
      } catch (error) {
        console.error("Error fetching registered workshops:", error);
        toast.error("Failed to fetch registered workshops.");
      }
    }
  };

  const handleRegister = async (workshopId) => {
    const username = localStorage.getItem("username");
    try {
      const response = await fetch("http://localhost:8080/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, workshopId }),
      });

      if (response.ok) {
        setRegisteredWorkshops((prev) => [...prev, workshopId]);
        toast.success("Registered successfully.");
      } else {
        toast.error("Failed to register.");
      }
    } catch (error) {
      console.error("Error registering for workshop:", error);
      toast.error("Error registering for workshop.");
    }
  };

  const handleUnregister = async (workshopId) => {
    const username = localStorage.getItem("username");
  
    const workshop = workshops.find((workshop) => workshop.id === workshopId);
  
    if (workshop) {
      const workshopDateTime = new Date(`${workshop.date}T${workshop.time}:00`);
      const currentTime = new Date();
  
      const timeDifference = (workshopDateTime - currentTime) / (1000 * 60 * 60);
  
      if (timeDifference <= 2) {
        toast.error("You cannot unregister ");
        return;
      }
    }
  
    try {
      const response = await fetch(
        `http://localhost:8080/api/registration/${workshopId}?username=${username}`,
        {
          method: "DELETE",
        }
      );
  
      if (response.ok) {
        setRegisteredWorkshops((prev) =>
          prev.filter((id) => id !== workshopId)
        );
        toast.success("Unregistered successfully.");
      } else {
        toast.error("Failed to unregister.");
      }
    } catch (error) {
      console.error("Error unregistering from workshop:", error);
      toast.error("Error unregistering from workshop.");
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const filteredWorkshops = workshops.filter((workshop) =>
    workshop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastWorkshop = currentPage * workshopsPerPage;
  const indexOfFirstWorkshop = indexOfLastWorkshop - workshopsPerPage;
  const currentWorkshops = filteredWorkshops.slice(
    indexOfFirstWorkshop,
    indexOfLastWorkshop
  );

  const totalPages = Math.ceil(filteredWorkshops.length / workshopsPerPage);

  return (
    <div className="dashboard1">
      <div className="sidebar">
        <h2 className="admin-title">Student Dashboard</h2>
        <button
          onClick={() => navigate("/student-dashboard")}
          className="sidebar-link"
        >
          <HomeOutlined style={{ marginRight: "8px" }} /> Home
        </button>
        <button
          onClick={() => navigate("/student-dashboard/registration")}
          className="sidebar-link active"
        >
          <AppstoreAddOutlined style={{ marginRight: "8px" }} /> Workshop Registration
        </button>
        <button
          onClick={() => navigate("/student-dashboard/registered-workshops")}
          className="sidebar-link"
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

        <ToastContainer />

        <h3>Workshop Registration</h3>

        <input
          type="text"
          placeholder="Search workshops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {searchTerm && (
          <ul className="search-suggestions">
            {filteredWorkshops.slice(0, 5).map((workshop) => (
              <li
                key={workshop.id}
                onClick={() => setSearchTerm(workshop.name)}
              >
                {workshop.name}
              </li>
            ))}
          </ul>
        )}

        <div className="workshop-grid">
          {currentWorkshops.length > 0 ? (
            currentWorkshops.map((workshop) => (
              <div className="workshop-card" key={workshop.id}>
                <img
                  src={backgroundImage}
                  alt="Workshop"
                  className="workshop-image"
                />
                <h4 className="workshop-name">{workshop.name}</h4>
                <p className="workshop-details">
                  {workshop.date} at {workshop.time}
                </p>
                {registeredWorkshops.includes(workshop.id) ? (
                  <div>
                    <button
                      onClick={() => handleUnregister(workshop.id)}
                      className="unregister-btn"
                    >
                      Unregister
                    </button>
                    <span> (You are registered)</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(workshop.id)}
                    className="register-btn"
                  >
                    Register
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No workshops available for the selected search term.</p>
          )}
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopRegistration;
