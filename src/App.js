import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./admincomponents/AdminDashboard";
import FacultyDashboard from "./facultycomponents/FacultyDashboard";
import AddWorkshop from "./admincomponents/AddWorkshop";
import ViewWorkshops from "./admincomponents/ViewWorkshops";
import UpdateWorkshop from "./admincomponents/UpdateWorkshop";
import ViewMaterial from "./admincomponents/ViewMaterial";
import ManageUsers from "./admincomponents/ManageUsers";
import FacultyManagement from "./admincomponents/FacultyManagement";
import NotFound from "./admincomponents/NotFound";
import WorkshopRegistration from "./components/WorkshopRegistration";
import RegisteredWorkshops from "./components/RegisteredWorkshops";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Settings from "./admincomponents/Settings";
import FacultySettings from "./facultycomponents/FacultySettings";
import StudentSettings from "./components/StudentSettings";
import FacultyViewWorkshops from "./facultycomponents/FacultyViewWorkshops";
import FacultyViewUsers from "./facultycomponents/FacultyViewUsers";
import FacultyAttendance from "./facultycomponents/FacultyAttendance";
import StudentAttendance from "./components/StudentAttendance";
import AdminAttendance from "./admincomponents/AdminAttendance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute
              element={<StudentDashboard />}
              requiredRole="student"
            />
          }
        />
        <Route
          path="/student-dashboard/registration"
          element={
            <ProtectedRoute
              element={<WorkshopRegistration />}
              requiredRole="student"
            />
          }
        />
        <Route
          path="/student-dashboard/registered-workshops"
          element={
            <ProtectedRoute
              element={<RegisteredWorkshops />}
              requiredRole="student"
            />
          }
        />
        <Route
          path="/student-dashboard/student-attendance"
          element={
            <ProtectedRoute
              element={<StudentAttendance />}
              requiredRole="student"
            />
          }
        />
        <Route
          path="/student-dashboard/student-settings"
          element={
            <ProtectedRoute
              element={<StudentSettings />}
              requiredRole="student"
            />
          }
        />

        <Route
          path="/faculty-dashboard"
          element={
            <ProtectedRoute
              element={<FacultyDashboard />}
              requiredRole="faculty"
            />
          }
        />
        <Route
          path="/faculty-attendance"
          element={
            <ProtectedRoute
              element={<FacultyAttendance />}
              requiredRole="faculty"
            />
          }
        />
        <Route
          path="/faculty-view-workshops"
          element={
            <ProtectedRoute
              element={<FacultyViewWorkshops />}
              requiredRole="faculty"
            />
          }
        />
        <Route
          path="/faculty-view-users"
          element={
            <ProtectedRoute
              element={<FacultyViewUsers />}
              requiredRole="faculty"
            />
          }
        />
        <Route
          path="/faculty-settings"
          element={
            <ProtectedRoute
              element={<FacultySettings />}
              requiredRole="faculty"
            />
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />
          }
        />
        <Route
          path="/add-workshop"
          element={
            <ProtectedRoute element={<AddWorkshop />} requiredRole="admin" />
          }
        />
        <Route
          path="/view-workshops"
          element={
            <ProtectedRoute element={<ViewWorkshops />} requiredRole="admin" />
          }
        />
        <Route
          path="/update-workshop"
          element={
            <ProtectedRoute element={<UpdateWorkshop />} requiredRole="admin" />
          }
        />
        <Route
          path="/view-material/:id"
          element={
            <ProtectedRoute element={<ViewMaterial />} requiredRole="admin" />
          }
        />
        <Route
          path="/faculty-management"
          element={
            <ProtectedRoute
              element={<FacultyManagement />}
              requiredRole="admin"
            />
          }
        />
        <Route
          path="/admin-attendance"
          element={
            <ProtectedRoute
              element={<AdminAttendance />}
              requiredRole="admin"
            />
          }
        />
        <Route
          path="/manage-users"
          element={
            <ProtectedRoute element={<ManageUsers />} requiredRole="admin" />
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute element={<Settings />} requiredRole="admin" />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
