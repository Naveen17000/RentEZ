import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Dashboardlayout';
import '../styles/Orderstatus.css';
import { fetchRentalRequests, updateRentalRequestStatus } from '../api';

const OrderDetails = ({ order, onClose, onUpdate }) => {
  const handleAction = async (newStatus) => {
    try {
      await updateRentalRequestStatus(order._id, newStatus);
      onUpdate(order._id, newStatus);
    } catch (error) {
      console.error("Failed to update order status:", error.message);
    }
  };

  const renderButtonsByStatus = () => {
    switch (order.status) {
      case 'pending':
        return (
          <>
            <button className="accept" onClick={() => handleAction('payment')}>
              Accept
            </button>
            <button className="reject" onClick={() => handleAction('rejected')}>
              Reject
            </button>
          </>
        );
      case 'payment':
        return (
          <button className="accept" onClick={() => handleAction('shipped')}>
            Paid
          </button>
        );
      case 'shipped':
        return (
          <button className="accept" onClick={() => handleAction('delivered')}>
            Deliver
          </button>
        );
      case 'delivered':
        return (
          <button className="accept" onClick={() => handleAction('returned')}>
            Return
          </button>
        );
      case 'rejected':
        return <p className="info">Order has been rejected.</p>;
      default:
        return <p className="info">Order completed.</p>;
    }
  };

  return (
    <div className="order-modal-overlay">
      <div className="order-container">
        <div className="order-header">
          <h1>
            Order ID: <span>#{order._id}</span>
          </h1>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>

        <div className="order-content">
          <div className="product-details">
            <img
              src={order.productId?.images?.[0] || 'placeholder-image.png'}
              alt={order.productId?.name}
              className="product-image"
            />
            <h2>{order.productId?.name}</h2>
            <p>Pickup: {new Date(order.fromDate).toLocaleDateString()}</p>
            <p>Dropoff: {new Date(order.endDate).toLocaleDateString()}</p>
            <p>₹{order.productId?.price}</p>
          </div>
        </div>

        <div className="buttons">
          {renderButtonsByStatus()}
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState({ date: '', status: '', category: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchRentalRequests(filter);
        // Check if response has data property and it's an array
        const orderData = response?.data || [];
        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (error) {
        console.error("Failed to fetch orders:", error.message);
        setOrders([]); // Set empty array on error
      }
    };
    fetchOrders();
  }, [filter]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrder = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="orders-page">
        <h1>Order Status</h1>
        <div className="orders-list">
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <p>Order ID: {order._id}</p>
                <p>Product: {order.productId?.name || 'N/A'}</p>
                <p>Status: {order.status}</p>
                <button onClick={() => handleViewDetails(order)}>View Details</button>
              </div>
            ))
          ) : (
            <p>No orders found</p>
          )}
        </div>

        {isModalOpen && selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onClose={handleCloseModal}
            onUpdate={handleUpdateOrder}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;