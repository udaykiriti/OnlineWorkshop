import React, { useState } from "react";
import "../layout/AdminDashboard.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "antd";
import AdminLayout from "../layout/AdminLayout";
import api from "../../api";

const AdminAttendance = () => {
  const queryClient = useQueryClient();
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [postedAttendance, setPostedAttendance] = useState([]);

  // Fetch Workshops
  const { data: workshops = [], isLoading: isLoadingWorkshops } = useQuery({
    queryKey: ["workshops"],
    queryFn: async () => {
      const response = await api.get("/api/workshops");
      return response.data;
    },
    onError: () => toast.error("Failed to load workshops.")
  });

  // Mutation for fetching participants (triggered manually or when selectedWorkshop changes, but better to keep it manual/controlled for now or use enabled)
  // Actually, fetching participants is a query that depends on selectedWorkshop.
  const { isFetching: isFetchingStudents } = useQuery({
    queryKey: ["workshopParticipants", selectedWorkshop],
    queryFn: async () => {
      if (!selectedWorkshop) return [];
      const response = await api.get(`/api/attendance/workshop/${selectedWorkshop}`);
      return response.data;
    },
    enabled: !!selectedWorkshop,
    onSuccess: (data) => {
      setRegisteredStudents(data);
      setAttendanceData(
        data.map((student) => ({
          username: student.username,
          email: student.email,
          date: student.date, 
          time: student.time, 
          isAbsent: false,
        }))
      );
    },
    onError: () => toast.error("Error fetching registered students.")
  });

  const { isFetching: isFetchingPosted } = useQuery({
    queryKey: ["postedAttendance", selectedWorkshop],
    queryFn: async () => {
      if (!selectedWorkshop) return [];
      const response = await api.get(`/api/attendance/workshop/${selectedWorkshop}`);
      return response.data;
    },
    enabled: !!selectedWorkshop,
    onSuccess: (data) => setPostedAttendance(data),
    onError: () => toast.error("Error fetching posted attendance data.")
  });

  const attendanceMutation = useMutation({
    mutationFn: (data) => api.post("/api/attendance/mark", data),
    onSuccess: () => {
      toast.success("Attendance marked successfully!");
      queryClient.invalidateQueries(["postedAttendance", selectedWorkshop]);
    },
    onError: () => toast.error("Error marking attendance.")
  });

  const handleWorkshopChange = (e) => {
    const workshopId = e.target.value;
    setSelectedWorkshop(workshopId);
    if (!workshopId) {
      setRegisteredStudents([]);
      setAttendanceData([]);
      setPostedAttendance([]);
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
    const promises = attendanceData.map((attendance) => 
      attendanceMutation.mutateAsync({
        workshopId: selectedWorkshop,
        username: attendance.username,
        isPresent: !attendance.isAbsent,
      })
    );
    
    await Promise.all(promises);
  };

  return (
    <AdminLayout>
      {isLoadingWorkshops ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <>
          <h3>Mark Attendance</h3>
          <select value={selectedWorkshop} onChange={handleWorkshopChange} style={{ marginBottom: 20 }}>
            <option value="">-- Select Workshop --</option>
            {workshops.map((workshop) => (
              <option key={workshop.id} value={workshop.id}>
                {workshop.name}
              </option>
            ))}
          </select>

          {isFetchingStudents ? <Skeleton active /> : registeredStudents.length > 0 && (
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
              <button type="submit" disabled={attendanceMutation.isLoading}>
                Submit Attendance
              </button>
            </form>
          )}

          {isFetchingPosted ? <Skeleton active /> : postedAttendance.length > 0 && (
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