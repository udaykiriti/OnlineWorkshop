import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminDashboard.css";
import "./buttons.css";
import "./FacultyManagement.css";

const FacultyManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "faculty",
    dob: "",
    gender: "male",
  });
  const [username, setUsername] = useState("Admin User"); 

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://onlineworkshop-server-production.up.railway.app/api/users");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`https://onlineworkshop-server-production.up.railway.app/api/users/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete user.");
        setUsers(users.filter((user) => user.id !== id));
        toast.success("User deleted successfully.");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user.");
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null); 
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `https://onlineworkshop-server-production.up.railway.app/api/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedUser),
        }
      );

      if (!response.ok) throw new Error("Failed to update user.");

      const updatedUser = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      handleModalClose();
      toast.success("User updated successfully.");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user.");
    }
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
    setNewUser({
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "faculty",
      dob: "",
      gender: "male",
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://onlineworkshop-server-production.up.railway.app/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error("Failed to add user.");
      const addedUser = await response.json();
      setUsers([...users, addedUser]);
      handleAddModalClose();
      toast.success("User added successfully.");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Error adding user.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      user.role === "faculty"
  );

  const handleLogout = () => {
    toast.info("You have logged out successfully.");
    navigate("/login"); 
  };

  return (
    <div className="dashboard1">
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
            <img
              src={require("./profile-icon.jpg")}
              alt="Profile"
              className="profile-icon"
            />
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <h3>Faculty Management</h3>

        <div className="user-controls">
          <input
            type="text"
            placeholder="Search faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button
            className="add-user-btn"
            onClick={() => setAddModalOpen(true)}
          >
            Add Faculty
          </button>
        </div>

        {loading ? (
          <p>Loading faculty...</p>
        ) : filteredUsers.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>Sno</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>DOB</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.role}</td>
                  <td>{user.dob}</td>
                  <td>{user.gender}</td>
                  <td>
                    <button
                      className="update-btn"
                      onClick={() => handleUpdateUser(user)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No faculty available.</p>
        )}

        {modalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleModalClose}>
                &times;
              </span>
              <h2>Update Faculty</h2>
              <form onSubmit={handleUpdate}>
                
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
              <h2>Add Faculty</h2>
              <form onSubmit={handleAddUser}>
                
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FacultyManagement;
