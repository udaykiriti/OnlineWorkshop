import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { UserOutlined, CalendarOutlined, TeamOutlined, RiseOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardStats = ({ totalUsers, totalWorkshops, genderData, roleData }) => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  const modernColors = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];
  
  const prepareChartData = (data) => {
    if (!data.datasets) return data;
    return {
      ...data,
      datasets: data.datasets.map(ds => ({
        ...ds,
        backgroundColor: modernColors,
        hoverBackgroundColor: modernColors.map(c => c + 'CC'),
        borderWidth: 2,
        borderColor: "var(--card-bg)",
        hoverOffset: 15,
      }))
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "var(--text-color)",
          padding: 20,
          usePointStyle: true,
          font: { size: 12, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      }
    },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="stats-grid">
        <motion.div className="stat-card modern" variants={itemVariants}>
          <div className="stat-icon-wrapper blue">
            <UserOutlined />
          </div>
          <div className="stat-info">
            <h4>Total Users</h4>
            <p className="stat-value">{totalUsers}</p>
          </div>
        </motion.div>

        <motion.div className="stat-card modern" variants={itemVariants}>
          <div className="stat-icon-wrapper orange">
            <CalendarOutlined />
          </div>
          <div className="stat-info">
            <h4>Total Workshops</h4>
            <p className="stat-value">{totalWorkshops}</p>
          </div>
        </motion.div>

        <motion.div className="stat-card modern" variants={itemVariants}>
          <div className="stat-icon-wrapper green">
            <TeamOutlined />
          </div>
          <div className="stat-info">
            <h4>Engagement</h4>
            <p className="stat-value">85%</p>
          </div>
        </motion.div>

        <motion.div className="stat-card modern" variants={itemVariants}>
          <div className="stat-icon-wrapper purple">
            <RiseOutlined />
          </div>
          <div className="stat-info">
            <h4>Growth</h4>
            <p className="stat-value">+12.5%</p>
          </div>
        </motion.div>
      </div>

      <div className="charts-grid">
        <motion.div className="chart-card" variants={itemVariants}>
          <div className="chart-header">
            <h4>Gender Distribution</h4>
          </div>
          <div className="chart-wrapper">
            {genderData.datasets ? (
              <Doughnut data={prepareChartData(genderData)} options={chartOptions} />
            ) : (
              <div className="chart-loading">Loading data...</div>
            )}
          </div>
        </motion.div>

        <motion.div className="chart-card" variants={itemVariants}>
          <div className="chart-header">
            <h4>User Roles Distribution</h4>
          </div>
          <div className="chart-wrapper">
            {roleData.datasets ? (
              <Doughnut data={prepareChartData(roleData)} options={chartOptions} />
            ) : (
              <div className="chart-loading">Loading data...</div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardStats;

