import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentAttendance.css";
import profileIcon from "./profile-icon.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HomeOutlined, AppstoreAddOutlined, UnorderedListOutlined, CheckCircleOutlined, UserOutlined } from "@ant-design/icons";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import * as XLSX from "xlsx"; 

const StudentAttendance = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      fetchAttendanceData(storedUsername);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchAttendanceData = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/attendance/user/${username}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch attendance records");
      }
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast.error("Error fetching attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("username");
      toast.success("Logged out successfully.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    } else {
      toast.info("Logout canceled.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Function to download as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Attendance Records", 14, 20);
    
    const tableData = attendanceRecords.map(record => [
      record.workshopName, 
      record.date, 
      record.time, 
      record.isPresent ? "Yes" : "No"
    ]);

    doc.autoTable({
      head: [["Workshop Name", "Date", "Time", "Present"]],
      body: tableData,
      startY: 30,
    });

    doc.save("attendance_records.pdf");
  };

  // Function to download as Excel
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(attendanceRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Records");
    XLSX.writeFile(wb, "attendance_records.xlsx");
  };

  return (
    <div className="dashboard1">
      <div className="sidebar">
        <h2 className="admin-title">Student Dashboard</h2>
        <button onClick={() => navigate("/student-dashboard")} className="sidebar-link">
          <HomeOutlined style={{ marginRight: "8px" }} /> Home
        </button>
        <button onClick={() => navigate("/student-dashboard/registration")} className="sidebar-link">
          <AppstoreAddOutlined style={{ marginRight: "8px" }} /> Workshop Registration
        </button>
        <button onClick={() => navigate("/student-dashboard/registered-workshops")} className="sidebar-link">
          <UnorderedListOutlined style={{ marginRight: "8px" }} /> Registered Workshops
        </button>
        <button onClick={() => navigate("/student-dashboard/student-attendance")} className="sidebar-link active">
          <CheckCircleOutlined style={{ marginRight: "8px" }} /> Attendance
        </button>
        <button onClick={() => navigate("/student-dashboard/student-settings")} className="sidebar-link">
          <UserOutlined style={{ marginRight: "8px" }} /> Profile
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {username}!</h2>
          <div className="profile">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <span>{username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading attendance records...</p>
        ) : (
          <>
            <h3>Your Attendance Records</h3>
            <div className="download-buttons">
              <button onClick={downloadPDF} className="download-btn">Download as PDF</button>
              <button onClick={downloadExcel} className="download-btn">Download as Excel</button>
            </div>

            {attendanceRecords.length > 0 ? (
              <div className="attendance-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Sno</th>
                      <th>Username</th>
                      <th>Workshop Name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Present</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>{username}</td>
                        <td>{record.workshopName}</td>
                        <td>{record.date}</td>
                        <td>{record.time}</td>
                        <td>
                          <span className={record.isPresent ? "status-present" : "status-absent"}>
                            {record.isPresent ? "Yes" : "No"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No attendance records found.</p>
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentAttendance;
