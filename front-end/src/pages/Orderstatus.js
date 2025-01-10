import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Dashboardlayout';
import '../styles/Orderstatus.css';
import { fetchRentalRequests, updateRentalRequestStatus, fetchProduct } from '../api';

const OrderDetails = ({ order, onClose, onUpdate }) => {
  const handleAction = async (newStatus) => {
    try {
      await updateRentalRequestStatus(order._id, newStatus);
      onUpdate(); // Call the onUpdate function to refresh the orders
      onClose(); // Close the modal after updating the status
    } catch (error) {
      console.error("Failed to update order status:", error?.response?.data || error.message);
    }
  };

  const renderButtonsByStatus = () => {
    switch (order.status) {
      case 'Pending':
        return (
          <>
            <button className="accept" onClick={() => handleAction('Ordered')}>Accept</button>
            <button className="reject" onClick={() => handleAction('Rejected')}>Reject</button>
          </>
        );
      case 'Ordered':
        return (
          <p className="info">Waiting for Payment</p>
        );
      case 'Payment':
        return (
          <>
            <button className="accept" onClick={() => handleAction('Shipped')}>Ship</button>
            <button className="reject" onClick={() => handleAction('Rejected')}>Reject</button>
          </>
        );
      case 'Shipped':
        return (
          <button className="accept" onClick={() => handleAction('Delivered')}>Deliver</button>
        );
      case 'Delivered':
        return (
          <button className="accept" onClick={() => handleAction('Returned')}>Return</button>
        );
      case 'Rejected':
        return <p className="info">Order has been rejected.</p>;
      default:
        return <p className="info">Order completed.</p>;
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="order-modal-overlay">
      <div className="order-container">
        <div className="order-header">
          <h1>Order ID: <span>{order.orderId}</span></h1>
          <button className="close-button" onClick={onClose}>X</button>
        </div>

        <div className="order-content">
          <div className="product-details">
            <img
              src={order.productImage || 'placeholder-image.png'}
              alt={order.productName}
              className="product-image"
            />
            <div className="row-arrange1">
              <h2>{order.productName}</h2>
              <p className="subtitle">{order.category}</p>
            </div>
            <p><strong>Pickup:</strong> {formatDate(order.fromDate)}</p>
            <p><strong>Dropoff:</strong> {formatDate(order.endDate)}</p>
            <p><strong>Rent per Day:</strong> ₹{order.productPrice}</p>
          </div>
        </div>

        <div className="summary-info">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-item"><span>Rent per day</span><span>₹{order.productPrice}</span></div>
            <div className="summary-item"><span>No of days</span><span>{order.days}</span></div>
            <div className="summary-item"><span>Delivery</span><span>₹{order.delivery || '0.00'}</span></div>
            <div className="summary-item"><span>Tax</span><span>₹{order.tax || '0.00'}</span></div>
            <div className="summary-total"><span>Total</span><span>₹{order.total || '0.00'}</span></div>
          </div>
          <div className="delivery-info">
            <p><strong>Delivery To:</strong> {order.customerName}</p>
            <p>{order.address}</p>
            <p><strong>Contact:</strong> {order.phoneNumber}</p>
            <p><strong>Order date:</strong> {formatDate(order.orderDate)}</p>
            <p><strong>Delivery by:</strong> {formatDate(order.fromDate)}</p>
            <p><strong>Return by:</strong> {formatDate(order.endDate)}</p>
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
  const [filter, setFilter] = useState({ date: '', status: '', category: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orders, setOrders] = useState([]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const applyFilters = () => {
    const filtered = orders.filter(order => {
      const filterDate = filter.date ? new Date(filter.date) : null;
      const fromDate = new Date(order.fromDate);
      const endDate = new Date(order.endDate);

      const isWithinDateRange = !filter.date || (filterDate >= fromDate && filterDate <= endDate) || filterDate.toDateString() === endDate.toDateString();


      return isWithinDateRange &&
        (!filter.status || order.status === filter.status) &&
        (!filter.category || order.category === filter.category);
    });

    setFilteredOrders(filtered);
  };

  const resetFilters = () => {
    setFilter({ date: '', status: '', category: '' });
    setFilteredOrders(orders);
  };

  const currentOrders = Array.isArray(filteredOrders) ? filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder) : [];

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const fetchOrders = async () => {
    try {
      const response = await fetchRentalRequests();
      // Check if response has data property and it's an array
      const orderData = response?.data || [];
      const ordersWithImages = await Promise.all(orderData.map(async (order) => {
        if (order.productId) {
          const product = await fetchProduct(order.productId._id);
          order.productImage = product.images?.[0] ? `https://rentez-2quq.onrender.com/${product.images[0].replace(/\\/g, '/')}` : 'https://via.placeholder.com/150';
          order.productName = product.name;
          order.productPrice = product.price;
          order.days = Math.ceil((new Date(order.endDate) - new Date(order.fromDate)) / (1000 * 60 * 60 * 24));
          order.total = order.productPrice * order.days;
        }
        return order;
      }));
      // Reverse the order to show the most recent first
      const sortedOrders = ordersWithImages.reverse();
      setOrders(Array.isArray(sortedOrders) ? sortedOrders : []);
      setFilteredOrders(Array.isArray(sortedOrders) ? sortedOrders : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error?.response?.data || error.message);
      setOrders([]); // Set empty array on error
      setFilteredOrders([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log("Orders:", orders);
    console.log("Filtered Orders:", filteredOrders);
  }, [orders, filteredOrders]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <DashboardLayout>
      <div className="orders-page">
        <h1>Order Status</h1>
        <div className="filter-bar">
          <input type="date" name="date" value={filter.date} onChange={handleFilterChange} />
          <select name="status" value={filter.status} onChange={handleFilterChange}>
            <option value="">Order Status</option>
            <option value="Ordered">Ordered</option>
            <option value="Shipped">Shipped</option>
            <option value="Payment">Payment</option>
            <option value="Rejected">Rejected</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
            <option value="Canceled">Canceled</option>
            <option value="Returned">Returned</option>
          </select>
          <select name="category" value={filter.category} onChange={handleFilterChange}>
            <option value="">Category</option>
            <option value="Construction">Construction</option>
            <option value="Excavation">Excavation</option>
            <option value="Welding">Welding</option>
            <option value="Electric">Electric</option>
            <option value="Stacker">Stacker</option>
          </select>
          <button onClick={applyFilters}>Filter</button>
          <button onClick={resetFilters}>Reset Filter</button>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Order ID</th>
              <th>Rental Days</th>
              <th>Price</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map(order => {
                // Debugging log to verify order structure
                console.log("Order Object:", order);

                const productName = order.productName || 'Unnamed Product';
                const productImage = order.productImage || 'https://via.placeholder.com/150';
                const category = order.category || 'Unknown';
                const rentalDays = Math.ceil((new Date(order.endDate) - new Date(order.fromDate)) / (1000 * 60 * 60 * 24));
                const totalPrice = order.productPrice * rentalDays;

                return (
                  <tr key={order._id}>
                    <td><img src={productImage} alt={productName} className="order-image" /></td>
                    <td>{productName}</td>
                    <td>{category}</td>
                    <td>{order.orderId}</td>
                    <td>{rentalDays}</td>
                    <td>₹{totalPrice}</td>
                    <td>{formatDate(order.fromDate)}</td>
                    <td>{formatDate(order.endDate)}</td>
                    <td><span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                    <td>
                      <button className="details-button" onClick={() => handleViewDetails(order)}>View Details</button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="no-orders">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          <span>Page {currentPage}</span>
          <button disabled={indexOfLastOrder >= filteredOrders.length} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
      </div>
      {isModalOpen && <OrderDetails order={selectedOrder} onClose={handleCloseModal} onUpdate={fetchOrders} />}
    </DashboardLayout>
  );
};

export default Orders;