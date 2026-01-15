import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Skeleton } from "antd";
import "../layout/AdminDashboard.css";
import AdminLayout from "../layout/AdminLayout";
import api from "../../api";

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
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

  // Fetch users with React Query
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/api/users");
      return response.data;
    },
    onError: () => {
      toast.error("Failed to load users.");
    },
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User deleted successfully.");
    },
    onError: () => {
      toast.error("Error deleting user.");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (user) => api.put(`/api/users/${user.id}`, user),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      handleModalClose();
      toast.success("User updated successfully.");
    },
    onError: () => {
      toast.error("Error updating user.");
    }
  });

  const addMutation = useMutation({
    mutationFn: (user) => api.post("/api/users", user),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      handleAddUserModalClose();
      toast.success("User added successfully.");
    },
    onError: () => {
      toast.error("Error adding user.");
    }
  });

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
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

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    updateMutation.mutate(selectedUser);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    addMutation.mutate(newUser);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <AdminLayout>
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

      <div className="export-buttons">
        <button onClick={downloadPDF} className="export-btn pdf-btn">Export to PDF</button>
        <button onClick={downloadExcel} className="export-btn excel-btn">Export to Excel</button>
      </div>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
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
              {/* Form fields remain the same */}
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
    </AdminLayout>
  );
};

export default ManageUsers;