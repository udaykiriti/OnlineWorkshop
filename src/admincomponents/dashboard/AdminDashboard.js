import React, { useEffect, useState } from "react";
import api from "../../api";
import "../layout/AdminDashboard.css";
import { Skeleton } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../layout/AdminLayout";
import DashboardStats from "./DashboardStats";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0); 
  const [totalWorkshops, setTotalWorkshops] = useState(0); 
  const [genderData, setGenderData] = useState({});
  const [roleData, setRoleData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUserData(), fetchGenderData(), fetchWorkshopsCount()]);
      setTimeout(() => setLoading(false), 800);
    };
    
    fetchData();
  }, []);

  const fetchGenderData = async () => {
    try {
      const response = await api.get("/api/users"); 
      const data = response.data;

      const genderCounts = data.reduce((acc, user) => {
        acc[user.gender] = (acc[user.gender] || 0) + 1;
        return acc;
      }, {});

      setGenderData({
        labels: Object.keys(genderCounts),
        datasets: [
          {
            data: Object.values(genderCounts),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch gender data:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get("/api/users"); 
      const data = response.data;

      const roleCounts = data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      setTotalUsers(data.length);

      setRoleData({
        labels: Object.keys(roleCounts),
        datasets: [
          {
            data: Object.values(roleCounts),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchWorkshopsCount = async () => {
    try {
      const response = await api.get("/api/workshops"); 
      const data = response.data;
      setTotalWorkshops(data.length); 
    } catch (error) {
      console.error("Failed to fetch workshops count:", error);
    }
  };

  return (
    <AdminLayout>
      <h3>Admin Dashboard Overview</h3>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="charts-container">
              <Skeleton active avatar shape="round" style={{ width: 200 }} />
              <Skeleton active avatar shape="round" style={{ width: 200 }} />
              <Skeleton active style={{ width: 300 }} />
            </div>
          </motion.div>
        ) : (
          <DashboardStats 
            totalUsers={totalUsers}
            totalWorkshops={totalWorkshops}
            genderData={genderData}
            roleData={roleData}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminDashboard;