import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "./AdminDashboard.css";
import "./buttons.css";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    phoneNumber: "",
    dob: "",
    gender: "",
  });

  const [username, setUsername] = useState("");  // State for dynamic username

  useEffect(() => {
    // Retrieve the username from localStorage on component mount
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername("Admin User");  // Fallback username
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8081/api/users");
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
        const response = await fetch(`http://localhost:8081/api/users/${id}`, {
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

  const handleAddUserModalClose = () => {
    setAddUserModalOpen(false);
    setNewUser({
      username: "",
      email: "",
      password: "",
      role: "user",
      phoneNumber: "",
      dob: "",
      gender: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    const updatedUser = {
      ...selectedUser,
    };

    try {
      const response = await fetch(
        `http://localhost:8081/api/users/${selectedUser.id}`,
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error("Failed to add user.");
      const data = await response.json();
      setUsers([...users, data]);
      handleAddUserModalClose();
      toast.success("User added successfully.");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Error adding user.");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    console.log("Logging out...");
    navigate("/login");
  };

  // Function to export users data to PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("User List", 14, 10);
    const tableColumns = ["S.No.", "Username", "Email", "Role", "DOB", "Gender"];
    const tableRows = filteredUsers.map((user, index) => [
      index + 1,
      user.username,
      user.email,
      user.role,
      user.dob,
      user.gender,
    ]);

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
    });
    doc.save("users_list.pdf");
  };

  // Function to export users data to Excel
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredUsers.map((user, index) => ({
        "S.No.": index + 1,
        Username: user.username,
        Email: user.email,
        Role: user.role,
        DOB: user.dob,
        Gender: user.gender,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users_list.xlsx");
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
          <h2>Welcome, {username}!</h2> {/* Display dynamic username */}
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

        <h3>Manage Users</h3>

        <button className="add-btn" onClick={() => setAddUserModalOpen(true)}>
          Add User
        </button>

        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {/* Add Export Buttons */}
        <div className="export-buttons">
          <button onClick={downloadPDF}>Export to PDF</button>
          <button onClick={downloadExcel}>Export to Excel</button>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : filteredUsers.length > 0 ? (
          <table className="users-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Username</th>
                <th>Email</th>
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
          <p>No users available.</p>
        )}

        {/* Modal for Adding User */}
        {addUserModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span
                className="close"
                onClick={handleAddUserModalClose}
              >
                &times;
              </span>
              <h2>Add User</h2>
              <form onSubmit={handleAddUser}>
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                />
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newUser.phoneNumber}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phoneNumber: e.target.value })
                  }
                  required
                />
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={newUser.dob}
                  onChange={(e) =>
                    setNewUser({ ...newUser, dob: e.target.value })
                  }
                  required
                />
                <select
                  value={newUser.gender}
                  onChange={(e) =>
                    setNewUser({ ...newUser, gender: e.target.value })
                  }
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <button type="submit">Add User</button>
              </form>
            </div>
          </div>
        )}

        {/* Modal for Updating User */}
        {modalOpen && selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleModalClose}>
                &times;
              </span>
              <h2>Update User</h2>
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      email: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="password"
                  value={selectedUser.password}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      password: e.target.value,
                    })
                  }
                  required
                />
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      role: e.target.value,
                    })
                  }
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  type="text"
                  value={selectedUser.phoneNumber}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      phoneNumber: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="date"
                  value={selectedUser.dob}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      dob: e.target.value,
                    })
                  }
                  required
                />
                <select
                  value={selectedUser.gender}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      gender: e.target.value,
                    })
                  }
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <button type="submit">Update User</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
