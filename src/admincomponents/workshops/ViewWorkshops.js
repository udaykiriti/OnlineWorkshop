import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import "../layout/AdminDashboard.css";
import { DeleteOutlined } from '@ant-design/icons';
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from "xlsx"; 
import { Skeleton } from "antd";
import AdminLayout from "../layout/AdminLayout";
import api from "../../api";

const ViewWorkshops = () => {
  const queryClient = useQueryClient();
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [file, setFile] = useState(null);

  // Fetch workshops with React Query
  const { data: workshops = [], isLoading } = useQuery({
    queryKey: ["workshops"],
    queryFn: async () => {
      const response = await api.get("/api/workshops");
      return response.data;
    },
    onError: () => {
      toast.error("Failed to load workshops.");
    },
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/workshops/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["workshops"]);
      toast.success("Workshop deleted successfully.");
    },
    onError: () => {
      toast.error("Error deleting workshop.");
    }
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => api.put(`/api/workshops/${selectedWorkshop.id}`, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["workshops"]);
      handleModalClose();
      toast.success("Workshop updated successfully.");
    },
    onError: () => {
      toast.error("Error updating workshop.");
    }
  });

  const handleUpdateWorkshop = (workshop) => {
    setSelectedWorkshop(workshop);
    setModalOpen(true);
  };

  const handleDeleteWorkshop = (id) => {
    if (window.confirm("Are you sure you want to delete this workshop?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedWorkshop(null);
    setFile(null); 
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", selectedWorkshop.name);
    formData.append("date", selectedWorkshop.date);
    formData.append("time", selectedWorkshop.time);
    formData.append("meetingLink", selectedWorkshop.meetingLink);
    formData.append("description", selectedWorkshop.description);
    formData.append("instructor", selectedWorkshop.instructor);
    if (file) {
      formData.append("material", file);
    }

    updateMutation.mutate(formData);
  };

  const filteredWorkshops = workshops.filter((workshop) =>
    workshop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Workshop Details", 14, 20);

    const tableData = workshops.map((workshop) => [
      workshop.name,
      workshop.date,
      workshop.time,
      workshop.meetingLink,
      workshop.description,
      workshop.instructor,
    ]);

    doc.autoTable({
      head: [["Name", "Date", "Time", "Meeting Link", "Description", "Instructor"]],
      body: tableData,
      startY: 30,
    });

    doc.save("workshops_details.pdf");
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(workshops);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Workshops");
    XLSX.writeFile(wb, "workshops_details.xlsx");
  };

  return (
    <AdminLayout>
      <ToastContainer /> 
      
      <h3>View Workshops</h3>
      
      <input
        type="text"
        placeholder="Search workshops..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <div className="download-buttons">
        <button onClick={downloadPDF} className="download-btn">Download as PDF</button>
        <button onClick={downloadExcel} className="download-btn">Download as Excel</button>
      </div>

      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : filteredWorkshops.length > 0 ? (
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
            {filteredWorkshops.map((workshop,index) => (
              <tr key={workshop.id}>
                <td>{index+1}</td>
                <td>{workshop.name}</td>
                <td>{workshop.date}</td>
                <td>{workshop.time}</td>
                <td>{workshop.meetingLink}</td>
                <td>{workshop.description}</td>
                <td>{workshop.instructor}</td>
                <td>
                  <a
                    href={`${api.defaults.baseURL}/api/workshops/materials/${workshop.material}`} 
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
                        <DeleteOutlined style={{ fontSize: '20px', color: 'white' }} title="Delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No workshops available.</p>
      )}

      {modalOpen && (
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
                  value={selectedWorkshop?.name || ""}
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
                  value={selectedWorkshop?.date || ""}
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
                  value={selectedWorkshop?.time || ""}
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
                  type="text"
                  value={selectedWorkshop?.meetingLink || ""}
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
                  value={selectedWorkshop?.description || ""}
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
                  value={selectedWorkshop?.instructor || ""}
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
                <label>Material (optional):</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button type="submit" className="update-confirm-btn">
                Update Workshop
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ViewWorkshops;