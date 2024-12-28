import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Dashboardlayout";
import MyProducts from "../pages/MyProducts";
import SavedAddresses from "./saveaddress";
import WebsiteTraffic from "./TopProducts";
import MyOrders from "../pages/MyOrders";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/Dashboard.css";
import { getDashboardStats, getSalesData, getTopProducts, getTotalSales, fetchRentalRequestsorders } from "../api";

function Dashboard() {
  const [activeContent] = useState("Dashboard");
  const [stats, setStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getDashboardStats();
        setStats(statsData);

        const topProductsData = await getTopProducts();
        setTopProducts(topProductsData);

        const salesData = await getSalesData();
        setChartData(salesData);

        const totalSalesData = await getTotalSales();
        setTotalSales(totalSalesData);

        const ordersData = await fetchRentalRequestsorders();
        setOrderCount(ordersData?.data?.length || 0); // Set the number of orders
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeContent) {
      case "Dashboard":
        return (
          <div className="dashboard-page">
            <div className="dashboard-header">
              <h2>Dashboard</h2>
            </div>

            <div className="dashboard-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <img
                    src={stat.image}
                    alt={`${stat.label} Icon`}
                    className="stat-icon"
                  />
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="dashboard-body">
              <div className="sales-details">
                <h3>Sales Details</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#007bff"
                      dot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="top-products">
                <WebsiteTraffic />
                <h3>Top 5 Rental Products</h3>
                <ul>
                  {topProducts.map((product, index) => (
                    <li key={index}>
                      {product.name}{" "}
                      <span className="rental-count">{product.rentals}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="My-orders">
                <h3>My Orders</h3>
                <img src='/index-2.jpg' alt='My Orders' className="My-orders-icon" />
                <div className="My-orders-count">{orderCount}</div>
              </div>

              <div className="total-sales">
                <h3>Total Sales</h3>
                <div className="total-sales-amount">₹{totalSales}</div>
              </div>
            </div>
          </div>
        );
      case "My Products":
        return (
          <div className="my-products-page">
            <MyProducts />
          </div>
        );
      case "SavedAddress":
        return (
          <div className="saved-address-page">
            <SavedAddresses />
          </div>
        );
      case "My Orders":
        return (
          <div className="my-orders-page">
            <MyOrders />
          </div>
        );
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
}

export default Dashboard;