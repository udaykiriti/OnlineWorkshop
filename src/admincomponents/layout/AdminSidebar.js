import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  HomeOutlined, 
  PlusCircleOutlined, 
  UnorderedListOutlined, 
  TeamOutlined, 
  SolutionOutlined, 
  ScheduleOutlined, 
  UserOutlined 
} from "@ant-design/icons";
import "./AdminDashboard.css"; // We can reuse the existing CSS or refactor later

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Home", path: "/admin-dashboard", icon: <HomeOutlined /> },
    { label: "Add Workshop", path: "/add-workshop", icon: <PlusCircleOutlined /> },
    { label: "View Workshops", path: "/view-workshops", icon: <UnorderedListOutlined /> },
    { label: "Manage Users", path: "/manage-users", icon: <TeamOutlined /> },
    { label: "Faculty Management", path: "/faculty-management", icon: <SolutionOutlined /> },
    { label: "Admin Attendance", path: "/admin-attendance", icon: <ScheduleOutlined /> },
    { label: "Profile", path: "/settings", icon: <UserOutlined /> },
  ];

  return (
    <div className="sidebar">
      <h2 className="admin-title">Admin Dashboard</h2>
      {menuItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={location.pathname === item.path ? "active" : ""}
        >
          <span style={{ marginRight: "10px" }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default AdminSidebar;
