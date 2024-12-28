import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../styles/Dashboard.css";
import { getTopProducts } from "../api";

const WebsiteTraffic = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topProductsData = await getTopProducts();
        const formattedData = topProductsData.map((product, index) => ({
          name: product.name,
          value: product.rentals,
          color: ["#007bff", "#28a745", "#ffc107", "#ff5733", "#17a2b8"][index % 5],
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching top products data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="traffic-chart">
      <h3>Website Traffic | <span className="sub-header">This Month</span></h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend layout="horizontal" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WebsiteTraffic;