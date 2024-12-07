import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HomeOutlined,
  UnorderedListOutlined,
  AppstoreAddOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const FacultyViewUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get the username from localStorage
  const username = localStorage.getItem("username") || "Faculty User"; // Fallback to "Faculty User" if no username is found

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/api/users");
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
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
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
    const updatedUser = {
      id: selectedUser.id,
      username: selectedUser.username,
      email: selectedUser.email,
      role: selectedUser.role,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!response.ok) throw new Error("Failed to update user.");
      const data = await response.json();
      setUsers(users.map((user) => (user.id === data.id ? data : user)));
      handleModalClose();
      toast.success("User updated successfully.");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user.");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard1">
      <div className="sidebar">
        <h2 className="admin-title">Faculty Dashboard</h2>
        <button onClick={() => navigate("/faculty-dashboard")}>
          <HomeOutlined style={{ marginRight: "8px" }} /> Home
        </button>
        <button onClick={() => navigate("/faculty-view-users")}>
          <UserOutlined style={{ marginRight: "8px" }} /> View Users
        </button>
        <button onClick={() => navigate("/faculty-view-workshops")}>
          <AppstoreAddOutlined style={{ marginRight: "8px" }} /> View Workshops
        </button>
        <button onClick={() => navigate("/faculty-attendance")}>
          <UnorderedListOutlined style={{ marginRight: "8px" }} /> Attendance
        </button>
        <button onClick={() => navigate("/faculty-settings")}>
          <CheckCircleOutlined style={{ marginRight: "8px" }} /> Profile
        </button>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {username}!</h2> {/* Display dynamic username */}
          <div className="profile">
            <img
              src={require("./profile-icon.jpg")}
              alt="Profile"
              className="profile-icon"
            />
            <button className="logout-btn" onClick={() => navigate("/login")}>
              Logout
            </button>
          </div>
        </div>

        <h3>View Users</h3>

        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {loading ? (
          <p>Loading users...</p>
        ) : filteredUsers.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
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
          <p>No users available.</p>
        )}

        {modalOpen && (
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-content">
              <span
                className="close"
                onClick={handleModalClose}
                aria-label="Close modal"
              >
                &times;
              </span>
              <h2>Update User</h2>
              <form onSubmit={handleUpdate}>
                <div>
                  <label>Username:</label>
                  <input
                    type="text"
                    value={selectedUser?.username || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    value={selectedUser?.email || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Role:</label>
                  <select
                    value={selectedUser?.role || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        role: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                <button type="submit">Update User</button>
              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FacultyViewUsers;
