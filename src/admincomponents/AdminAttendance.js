import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import profileIcon from "./profile-icon.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminAttendance = () => {
  const navigate = useNavigate();
  const [username] = useState(localStorage.getItem("username") || "");
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [postedAttendance, setPostedAttendance] = useState([]);
  const [loading, setLoading] = useState({
    workshops: true,
    attendance: false,
  });

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    setLoading((prev) => ({ ...prev, workshops: true }));
    try {
      const response = await fetch("http://localhost:8080/api/workshops");
      if (!response.ok) throw new Error("Failed to fetch workshops");

      const data = await response.json();
      setWorkshops(data);
    } catch (error) {
      toast.error("Failed to load workshops.");
    } finally {
      setLoading((prev) => ({ ...prev, workshops: false }));
    }
  };

  const handleWorkshopChange = async (e) => {
    const workshopId = e.target.value;
    setSelectedWorkshop(workshopId);

    if (workshopId) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/attendance/workshop/${workshopId}`
        );
        if (!response.ok)
          throw new Error("Failed to fetch registered students");

        const studentsData = await response.json();
        setRegisteredStudents(studentsData);
        setAttendanceData(
          studentsData.map((student) => ({
            username: student.username,
            email: student.email,
            date: student.date, 
            time: student.time, 
            isAbsent: false,
          }))
        );
      } catch (error) {
        toast.error("Error fetching registered students.");
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
        entry.username === username ? { ...entry, isAbsent } : entry
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, attendance: true }));

    try {
      const responses = await Promise.all(
        attendanceData.map((attendance) =>
          fetch("http://localhost:8080/api/attendance/mark", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              workshopId: selectedWorkshop,
              username: attendance.username,
              isPresent: !attendance.isAbsent,
            }),
          })
        )
      );

      if (responses.some((response) => !response.ok)) {
        throw new Error(
          "Failed to mark attendance for one or more participants."
        );
      }

      toast.success("Attendance marked successfully!");
      fetchPostedAttendance();
    } catch (error) {
      toast.error("Error marking attendance.");
    } finally {
      setLoading((prev) => ({ ...prev, attendance: false }));
    }
  };

  const fetchPostedAttendance = async () => {
    if (selectedWorkshop) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/attendance/workshop/${selectedWorkshop}`
        );
        if (!response.ok)
          throw new Error("Failed to fetch posted attendance data");

        const data = await response.json();
        setPostedAttendance(data);
      } catch (error) {
        toast.error("Error fetching posted attendance data.");
      }
    }
  };

  return (
    <div className="dashboard1">
      <div className="sidebar">
        <h2 className="admin-title">Admin Dashboard</h2>
        <button onClick={() => navigate("/admin-dashboard")}>Home</button>
        <button onClick={() => navigate("/add-workshop")}>Add Workshop</button>
        <button onClick={() => navigate("/view-workshops")}>
          View Workshops
        </button>
        <button onClick={() => navigate("/manage-users")}>Manage Users</button>
        <button onClick={() => navigate("/faculty-management")}>
          Faculty Management
        </button>
        <button onClick={() => navigate("/admin-attendance")}>
          Admin Attendance
        </button>
        <button onClick={() => navigate("/settings")}>Profile</button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Welcome, {username || "Admin"}!</h2>
          <div className="profile">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <span>{username || "Admin"}</span>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("username");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {loading.workshops ? (
          <p>Loading workshops...</p>
        ) : (
          <>
            <h3>Mark Attendance</h3>
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
                <h4>Registered Students</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Workshop Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Date</th> 
                      <th>Time</th> 
                      <th>Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>{student.workshopName || "N/A"}</td>
                        <td>{student.username}</td>
                        <td>{student.email}</td>
                        <td>{student.date || "N/A"}</td> 
                        <td>{student.time || "N/A"}</td> 
                        <td>
                          <input
                            type="checkbox"
                            checked={
                              attendanceData.find(
                                (a) => a.username === student.username
                              )?.isAbsent || false
                            }
                            onChange={(e) =>
                              handleAttendanceChange(e, student.username)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="submit" disabled={loading.attendance}>
                  Submit Attendance
                </button>
              </form>
            )}

            {postedAttendance.length > 0 && (
              <div>
                <h4>Recently Posted Attendance</h4>
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
                        <td>{attendance.isPresent ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminAttendance;
