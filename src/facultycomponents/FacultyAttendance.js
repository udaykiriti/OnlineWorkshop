import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import "./FacultyDashboard.css";
import profileIcon from "./profile-icon.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HomeOutlined,
  UnorderedListOutlined,
  AppstoreAddOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const FacultyAttendance = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [postedAttendance, setPostedAttendance] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchWorkshops = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/workshops");
        if (!response.ok) {
          throw new Error("Failed to fetch workshops");
        }
        const data = await response.json();
        setWorkshops(data);
      } catch (error) {
        console.error("Failed to fetch workshops:", error);
        toast.error("Failed to load workshops.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleWorkshopChange = async (e) => {
    const workshopId = e.target.value;
    setSelectedWorkshop(workshopId);
    setAttendanceSubmitted(false);

    if (workshopId) {
      try {
        const studentsResponse = await fetch(
          `http://localhost:8081/api/attendance/workshop/${workshopId}/participants`
        );
        if (!studentsResponse.ok) {
          throw new Error("Failed to fetch registered students");
        }
        const studentsData = await studentsResponse.json();
        setRegisteredStudents(studentsData);

        setAttendanceData(
          studentsData.map((student) => ({
            username: student.username,
            email: student.email,
            isPresent: true,
          }))
        );
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Error fetching data.");
      }
    } else {
      setRegisteredStudents([]);
      setAttendanceData([]);
    }
  };

  const handleAttendanceChange = (e, username) => {
    const isAbsent = e.target.checked;
    setAttendanceData((prev) =>
      prev.map((entry) =>
        entry.username === username ? { ...entry, isPresent: !isAbsent } : entry
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responses = await Promise.all(
        attendanceData.map((attendance) => {
          return fetch("http://localhost:8081/api/attendance/mark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              workshopId: selectedWorkshop,
              username: attendance.username,
              email: attendance.email,
              isPresent: attendance.isPresent ? 1 : 0,
            }),
          });
        })
      );

      responses.forEach((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to mark attendance for one or more participants."
          );
        }
      });

      setSuccessMessage("Attendance marked successfully!");
      toast.success("Attendance marked successfully!");
      setAttendanceSubmitted(true);
      fetchPostedAttendance();
    } catch (error) {
      console.error("Error marking attendance", error);
      toast.error("Error marking attendance.");
    }
  };

  const fetchPostedAttendance = async () => {
    if (selectedWorkshop) {
      try {
        const response = await fetch(
          `http://localhost:8081/api/attendance/workshop/${selectedWorkshop}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posted attendance data");
        }
        const data = await response.json();
        setPostedAttendance(data);
        setModalOpen(true); 
      } catch (error) {
        console.error("Error fetching posted attendance data", error);
        toast.error("Error fetching posted attendance data.");
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setPostedAttendance([]); 
  };

  return (
    <div className="dashboard1">
      <div className="sidebar">
        <h2 className="admin-title">Faculty Dashboard</h2>
        <button onClick={() => navigate("/faculty-dashboard")}>
          <HomeOutlined style={{ marginRight: "8px" }} />
          Home
        </button>
        <button onClick={() => navigate("/faculty-view-users")}>
          <UserOutlined style={{ marginRight: "8px" }} />
          View Users
        </button>
        <button onClick={() => navigate("/faculty-view-workshops")}>
          <AppstoreAddOutlined style={{ marginRight: "8px" }} />
          View Workshops
        </button>
        <button onClick={() => navigate("/faculty-attendance")}>
          <UnorderedListOutlined style={{ marginRight: "8px" }} />
          Attendance
        </button>
        <button onClick={() => navigate("/faculty-settings")}>
          <CheckCircleOutlined style={{ marginRight: "8px" }} />
          Profile
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {username || "Faculty"}!</h2>
          <div className="profile">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <span>{username || "Faculty"}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading workshops...</p>
        ) : (
          <>
            <h3>Mark Attendance</h3>
            <p>Select a workshop and mark attendance for participants.</p>

            <select value={selectedWorkshop} onChange={handleWorkshopChange}>
              <option value="">-- Select Workshop --</option>
              {workshops.map((workshop) => (
                <option key={workshop.id} value={workshop.id}>
                  {workshop.name}
                </option>
              ))}
            </select>

            {registeredStudents.length > 0 && (
              <form onSubmit={handleSubmit}>
                <h4>Registered Students for this Workshop</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Workshop Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>{student.workshopName}</td>
                        <td>{student.username}</td>
                        <td>{student.email}</td>
                        <td>
                          <label>
                            <input
                              type="checkbox"
                              checked={
                                attendanceData.find(
                                  (a) => a.username === student.username
                                )?.isPresent === false
                              }
                              onChange={(e) =>
                                handleAttendanceChange(e, student.username)
                              }
                              disabled={attendanceSubmitted}
                            />
                            Absent
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="submit" disabled={attendanceSubmitted}>
                  Submit Attendance
                </button>
                {successMessage && <p>{successMessage}</p>}
              </form>
            )}

            <button
              onClick={fetchPostedAttendance}
              disabled={!selectedWorkshop}
            >
              View Posted Attendance
            </button>
          </>
        )}

        <Dialog
          open={modalOpen}
          onClose={handleModalClose}
          TransitionProps={{ onExited: () => setPostedAttendance([]) }}
          maxWidth="lg" 
          fullWidth 
          sx={{
            "& .MuiDialog-paper": {
              width: "80%", 
              maxWidth: "none", 
            },
          }}
        >
          <DialogTitle>Posted Attendance</DialogTitle>
          <DialogContent>
            {postedAttendance.length === 0 ? (
              <p>No attendance posted for this workshop.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Workshop Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Present</th>
                  </tr>
                </thead>
                <tbody>
                  {postedAttendance.map((attendance) => (
                    <tr key={attendance.id}>
                      <td>{attendance.workshopName}</td>
                      <td>{attendance.username}</td>
                      <td>{attendance.email}</td>
                      <td>{attendance.date}</td>
                      <td>{attendance.time}</td>
                      <td>{attendance.isPresent ? "Present" : "Absent"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </div>
    </div>
  );
};
export default FacultyAttendance;
