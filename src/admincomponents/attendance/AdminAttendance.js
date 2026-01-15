import React, { useEffect, useState } from "react";
import "../layout/AdminDashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../layout/AdminLayout";
import api from "../../api";

const AdminAttendance = () => {
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
      const response = await api.get("/api/workshops");
      setWorkshops(response.data);
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
        const response = await api.get(`/api/attendance/workshop/${workshopId}`);
        const studentsData = response.data;
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
      await Promise.all(
        attendanceData.map((attendance) =>
          api.post("/api/attendance/mark", {
            workshopId: selectedWorkshop,
            username: attendance.username,
            isPresent: !attendance.isAbsent,
          })
        )
      );

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
        const response = await api.get(`/api/attendance/workshop/${selectedWorkshop}`);
        setPostedAttendance(response.data);
      } catch (error) {
        toast.error("Error fetching posted attendance data.");
      }
    }
  };

  return (
    <AdminLayout>
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
      <ToastContainer />
    </AdminLayout>
  );
};

export default AdminAttendance;