import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalInward: 0,
    pendingApprovals: 0,
    activeSpp: 0,
  });
  const [statusData, setStatusData] = useState([]);
  const [recentData, setRecentData] = useState([]);
  const navigate = useNavigate();

  // Colors for the charts
  const COLORS = ["#198754", "#ffc107", "#dc3545"]; // Success, Warning, Danger

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [inwardRes, sppRes] = await Promise.all([
          axiosInstance.get("/inward"),
          axiosInstance.get("/spp"),
        ]);

        const inward = inwardRes.data;
        const spp = sppRes.data;

        // Calculate Top-Level Metrics
        const pendingCount = inward.filter(
          (item) => item.isHod && item.status !== "Approved",
        ).length;
        const approvedCount = inward.filter(
          (item) => !item.isHod || item.status === "Approved",
        ).length;

        setMetrics({
          totalInward: inward.length,
          pendingApprovals: pendingCount,
          activeSpp: spp.filter((item) => item.isActive).length,
        });

        // Prepare Data for Pie Chart (Status Breakdown)
        setStatusData([
          { name: "Approved", value: approvedCount },
          { name: "Pending", value: pendingCount },
        ]);

        // Prepare Data for Bar Chart (Mocking recent daily volume by taking the last 5 items)
        // In a production app, this would be grouped by date from the backend
        const chartData = inward.slice(-5).map((item) => ({
          name: item.itemName.substring(0, 10) + "...",
          quantity: item.quantityReceived || item.quantity,
        }));
        setRecentData(chartData);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      }
    };

    fetchAnalytics();
  }, [navigate]);

  return (
    <div className="container py-4">
      <div className="mb-4 pb-3 border-bottom border-secondary-subtle">
        <h2 className="text-dark fw-semibold mb-0">System Overview</h2>
        <p className="text-muted small mb-0 mt-1">
          Real-time analytics and inventory health
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-primary border-4 h-100">
            <div className="card-body">
              <p className="text-muted fw-medium small mb-1">
                Total Inward Entries
              </p>
              <h3 className="fw-bold text-dark mb-0">{metrics.totalInward}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-warning border-4 h-100">
            <div className="card-body">
              <p className="text-muted fw-medium small mb-1">
                Pending HOD Approvals
              </p>
              <h3 className="fw-bold text-dark mb-0">
                {metrics.pendingApprovals}
              </h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 border-start border-success border-4 h-100">
            <div className="card-body">
              <p className="text-muted fw-medium small mb-1">
                Active Master Items
              </p>
              <h3 className="fw-bold text-dark mb-0">{metrics.activeSpp}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white pt-3 pb-2 border-0">
              <h6 className="fw-semibold text-secondary mb-0">
                Recent Inward Volumes
              </h6>
            </div>
            <div className="card-body" style={{ height: "350px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={recentData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e0e0e0"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#6c757d" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6c757d" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(13, 110, 253, 0.05)" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="#0d6efd"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white pt-3 pb-2 border-0">
              <h6 className="fw-semibold text-secondary mb-0">
                Approval Status Breakdown
              </h6>
            </div>
            <div
              className="card-body d-flex justify-content-center align-items-center"
              style={{ height: "350px" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
