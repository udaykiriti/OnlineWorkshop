import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import profileIcon from "./profile-icon.jpg";
import {
  HomeOutlined,
  UnorderedListOutlined,
  AppstoreAddOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const FacultyViewWorkshops = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newWorkshop, setNewWorkshop] = useState({
    name: "",
    date: "",
    time: "",
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

    fetch("http://localhost:8081/api/workshops")
      .then((response) => response.json())
      .then((data) => {
        setWorkshops(data);
      })
      .catch((error) => {
        console.error("Error fetching workshops:", error);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleUpdateWorkshop = (workshop) => {
    setSelectedWorkshop(workshop);
    setModalOpen(true);
  };

  const handleDeleteWorkshop = (id) => {
    if (window.confirm("Are you sure you want to delete this workshop?")) {
      fetch(`http://localhost:8081/api/workshops/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setWorkshops(workshops.filter((workshop) => workshop.id !== id));
            toast.success("Workshop deleted successfully.");
          } else {
            console.error("Failed to delete workshop");
            toast.error("Failed to delete workshop.");
          }
        })
        .catch((error) => {
          console.error("Error deleting workshop:", error);
          toast.error("Error deleting workshop.");
        });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedWorkshop(null);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
    setNewWorkshop({
      name: "",
      date: "",
      time: "",
      meetingLink: "",
      description: "",
      instructor: "",
      material: null,
    });
  };

  const handleAddWorkshop = (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in newWorkshop) {
      formData.append(key, newWorkshop[key]);
    }

    fetch("http://localhost:8081/api/workshops", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to add workshop");
        }
      })
      .then((data) => {
        setWorkshops([...workshops, data]);
        toast.success("Workshop added successfully.");
        handleAddModalClose();
      })
      .catch((error) => {
        console.error("Error adding workshop:", error);
        toast.error("Error adding workshop.");
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in selectedWorkshop) {
      formData.append(key, selectedWorkshop[key]);
    }

    fetch(`http://localhost:8081/api/workshops/${selectedWorkshop.id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          const updatedWorkshops = workshops.map((workshop) =>
            workshop.id === selectedWorkshop.id ? selectedWorkshop : workshop
          );
          setWorkshops(updatedWorkshops);
          toast.success("Workshop updated successfully.");
          handleModalClose();
        } else {
          throw new Error("Failed to update workshop");
        }
      })
      .catch((error) => {
        console.error("Error updating workshop:", error);
        toast.error("Error updating workshop.");
      });
  };

  const filteredWorkshops = workshops.filter((workshop) =>
    workshop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard1">
      <ToastContainer />
      <div className="sidebar">
        <h2 className="admin-title">Faculty Dashboard</h2>
        <button onClick={() => navigate("/faculty-dashboard")}>
          {" "}
          <HomeOutlined style={{ marginRight: "8px" }} />
          Home
        </button>
        <button onClick={() => navigate("/faculty-view-users")}>
        <UserOutlined style={{ marginRight: "8px" }} /> View Users
        </button>
        <button onClick={() => navigate("/faculty-view-workshops")} className="active">
        <AppstoreAddOutlined style={{ marginRight: "8px" }} />View Workshops
        </button>
        <button onClick={() => navigate("/faculty-attendance")}>
        <UnorderedListOutlined style={{ marginRight: "8px" }} />Attendance
        </button>
        <button onClick={() => navigate("/faculty-settings")}><CheckCircleOutlined style={{ marginRight: "8px" }} />Profile</button>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {username || "Faculty User"}!</h2>
          <div className="profile">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <h3>View Workshops</h3>
        <button
          className="add-workshop-btn"
          onClick={() => setAddModalOpen(true)}
        >
          Add Workshop
        </button>

        <input
          type="text"
          placeholder="Search workshops..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {filteredWorkshops.length > 0 ? (
          <table className="workshops-table">
            <thead>
              <tr>
                <th>Sno</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Meeting Link</th>
                <th>Description</th>
                <th>Instructor</th>
                <th>Material</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkshops.map((workshop, index) => (
                <tr key={workshop.id}>
                  <td>{index + 1}</td>
                  <td>{workshop.name}</td>
                  <td>{workshop.date}</td>
                  <td>{workshop.time}</td>
                  <td>{workshop.meetingLink}</td>
                  <td>{workshop.description}</td>
                  <td>{workshop.instructor}</td>
                  <td>
                    <a
                      href={`http://localhost:8081/api/workshops/materials/${workshop.material}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Material
                    </a>
                  </td>
                  <td>
                    <button
                      className="update-btn"
                      onClick={() => handleUpdateWorkshop(workshop)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteWorkshop(workshop.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No workshops available.</p>
        )}
      </div>

      {modalOpen && selectedWorkshop && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>
              &times;
            </span>
            <h2>Update Workshop</h2>
            <form onSubmit={handleUpdate}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={selectedWorkshop.name}
                  onChange={(e) =>
                    setSelectedWorkshop({
                      ...selectedWorkshop,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Date:</label>
                <input
                  type="date"
                  value={selectedWorkshop.date}
                  onChange={(e) =>
                    setSelectedWorkshop({
                      ...selectedWorkshop,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Time:</label>
                <input
                  type="time"
                  value={selectedWorkshop.time}
                  onChange={(e) =>
                    setSelectedWorkshop({
                      ...selectedWorkshop,
                      time: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Meeting Link:</label>
                <input
                  type="url"
                  value={selectedWorkshop.meetingLink}
                  onChange={(e) =>
                    setSelectedWorkshop({
                      ...selectedWorkshop,
                      meetingLink: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  value={selectedWorkshop.description}
                  onChange={(e) =>
                    setSelectedWorkshop({
                      ...selectedWorkshop,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Instructor:</label>
                <input
                  type="text"
                  value={selectedWorkshop.instructor}
                  onChange={(e) =>
                    setSelectedWorkshop({
                      ...selectedWorkshop,
                      instructor: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Material:</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) =>
                    setSelectedWorkshop({
                      ...selectedWorkshop,
                      material: e.target.files[0],
                    })
                  }
                />
              </div>
              <button type="submit">Update Workshop</button>
            </form>
          </div>
        </div>
      )}

      {addModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleAddModalClose}>
              &times;
            </span>
            <h2>Add Workshop</h2>
            <form onSubmit={handleAddWorkshop}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  value={newWorkshop.name}
                  onChange={(e) =>
                    setNewWorkshop({ ...newWorkshop, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Date:</label>
                <input
                  type="date"
                  value={newWorkshop.date}
                  onChange={(e) =>
                    setNewWorkshop({ ...newWorkshop, date: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Time:</label>
                <input
                  type="time"
                  value={newWorkshop.time}
                  onChange={(e) =>
                    setNewWorkshop({ ...newWorkshop, time: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label>Meeting Link:</label>
                <input
                  type="url"
                  value={newWorkshop.meetingLink}
                  onChange={(e) =>
                    setNewWorkshop({
                      ...newWorkshop,
                      meetingLink: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  value={newWorkshop.description}
                  onChange={(e) =>
                    setNewWorkshop({
                      ...newWorkshop,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Instructor:</label>
                <input
                  type="text"
                  value={newWorkshop.instructor}
                  onChange={(e) =>
                    setNewWorkshop({
                      ...newWorkshop,
                      instructor: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label>Material:</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) =>
                    setNewWorkshop({
                      ...newWorkshop,
                      material: e.target.files[0],
                    })
                  }
                />
              </div>
              <button type="submit">Add Workshop</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyViewWorkshops;
