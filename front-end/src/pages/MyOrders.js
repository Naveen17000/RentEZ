import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Dashboardlayout';
import '../styles/MyOrders.css';
import { fetchRentalRequestsorders, fetchProduct, updateRentalRequestStatus } from '../api';
import AnimatedPaymentSuccess from '../components/AnimatedPaymentSuccess'; // Import the new component
import 'animate.css'; // Import Animate.css

const Orders = () => {
    const [filter, setFilter] = useState({ date: '', orderType: '', status: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    // State for modal
    const [showDetails, setShowDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false); // State to control the payment success animation

    // State for orders
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        // Fetch orders from backend using customer ID
        const fetchOrders = async () => {
            try {
                const response = await fetchRentalRequestsorders(); // Adjust the endpoint as needed
                const orderData = response?.data || [];
                console.log('Fetched orders:', orderData); // Debugging log
                const ordersWithImages = await Promise.all(orderData.map(async (order) => {
                    if (order.productId) {
                        const product = await fetchProduct(order.productId._id);
                        order.productImage = product.images?.[0] ? `http://localhost:5000/${product.images[0].replace(/\\/g, '/')}` : 'https://via.placeholder.com/150';
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
                console.error('Error fetching orders:', error);
                setOrders([]); // Set empty array on error
                setFilteredOrders([]); // Set empty array on error
            }
        };

        fetchOrders();
    }, []);

    // Filter handler
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
                (!filter.category || order.category === filter.category) &&
                (!filter.status || order.status === filter.status);
        });

        setFilteredOrders(filtered);
    };

    const resetFilters = () => {
        setFilter({ date: '', status: '', category: '' });
        setFilteredOrders(orders);
    };


    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Open and close modal
    const openDetails = (order) => {
        setSelectedOrder(order);
        setShowDetails(true);
    };

    const closeDetails = () => {
        setShowDetails(false);
        setSelectedOrder(null);
    };

    const openInvoice = () => setShowInvoice(true);
    const closeInvoice = () => setShowInvoice(false);

    const getStatusIndex = (status) => {
        const statuses = ['Ordered', 'Payment', 'Shipped', 'Delivered', 'Returned'];
        return statuses.indexOf(status);
    };

    const getStatusDisplay = (status) => {
        if (status === 'Pending') {
            return 'Requested';
        }
        return status;
    };

    const downloadInvoice = (order) => {
        const invoiceContent = `
            Invoice
            ---------
            Order ID: ${order.orderId}
            Product: ${order.productName}
            Category: ${order.category}
            Rent Per Day: ₹${order.productPrice}
            From: ${order.fromDate}
            To: ${order.endDate}
            Total: ₹${order.total + order.total * 0.1}
        `;

        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice_${order.orderId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const cancelOrder = async (orderId) => {
        try {
            const updatedOrders = orders.map(order =>
                order.orderId === orderId ? { ...order, status: 'Canceled' } : order
            );
            setFilteredOrders(updatedOrders);
            setShowDetails(false);
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    const handlePayment = async (order) => {
        try {
            await updateRentalRequestStatus(order._id, 'Payment');
            const updatedOrders = orders.map(o =>
                o._id === order._id ? { ...o, status: 'Payment' } : o
            );
            setFilteredOrders(updatedOrders);
            setSelectedOrder({ ...order, status: 'Payment' }); // Update selectedOrder status
            setShowDetails(false);
            setShowPaymentSuccess(true); // Show the payment success animation
        } catch (error) {
            console.error('Error updating order status:', error);
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
        <DashboardLayout>
            <div className="orders-page">
                <h1>My Orders</h1>
                <div className="filter-bar">
                    <input
                        type="date"
                        name="date"
                        value={filter.date}
                        onChange={handleFilterChange}
                    />
                    <select name="category" value={filter.category} onChange={handleFilterChange}>
                        <option value="">Category</option>
                        <option value="Construction">Construction</option>
                        <option value="Excavation">Excavation</option>
                        <option value="Welding">Welding</option>
                        <option value="Electric">Electric</option>
                    </select>
                    <select name="status" value={filter.status} onChange={handleFilterChange}>
                        <option value="">Order Status</option>
                        <option value="Ordered">Ordered</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Payment">Payment</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Pending">Requested</option>
                        <option value="Canceled">Canceled</option>
                        <option value="Returned">Returned</option>
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
                            <th>Placed On</th>
                            <th>Arrive On</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.length > 0 ? (
                            currentOrders.map((order) => (
                                <tr key={order.id}>
                                    <td><img src={order.productImage} alt={order.productName} className="order-image" /></td>
                                    <td>{order.productName}</td>
                                    <td>{order.category}</td>
                                    <td>{order.orderId}</td>
                                    <td>{order.days}</td>
                                    <td>₹{order.total}</td>
                                    <td>{formatDate(order.fromDate)}</td>
                                    <td>{formatDate(order.endDate)}</td>
                                    <td>
                                        <span className={`status status-${order.status.toLowerCase()}`}>
                                            {getStatusDisplay(order.status)}
                                        </span>
                                    </td>
                                    <td><button onClick={() => openDetails(order)} className="details-button">View Details</button></td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="no-orders">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="pagination">
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage}</span>
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastOrder >= filteredOrders.length}>
                        Next
                    </button>
                </div>

                {/* Modal for Order Details */}
                {showDetails && selectedOrder && (
                    <div className="modal-overlay">
                        <div className="modal-content-myorders">
                            {/* Close Button */}
                            <button className="close-button-myorders" onClick={closeDetails}>
                                X
                            </button>

                            {/* Order Details Header */}
                            <div className="modal-header">
                                <h1 id="order-id">Order ID: {selectedOrder.orderId}</h1>
                                <p className="order-date" id="order-date">Order Placed On: {formatDate(selectedOrder.orderDate)}</p>
                                {selectedOrder.status !== 'Canceled' && selectedOrder.status !== 'Rejected' && selectedOrder.status !== 'Pending' && (
                                    <p className="estimated-delivery" id="estimated-delivery">
                                        <i className="fas fa-truck"></i> {selectedOrder.status === 'Delivered' || selectedOrder.status === 'Returned' ? 'Delivery Date' : 'Estimated Delivery'}: {formatDate(selectedOrder.fromDate)}
                                    </p>
                                )}
                                {selectedOrder.status === 'Returned' && (
                                    <p className="returned-date" id="returned-date">
                                        <i className="fas fa-undo"></i> Returned Date: {formatDate(selectedOrder.endDate)}
                                    </p>
                                )}
                                <div className="buttons-myorders">
                                    {selectedOrder.status === 'Ordered' && (
                                        <button className="payment" onClick={() => handlePayment(selectedOrder)}>Payment</button>
                                    )}
                                    {selectedOrder.status !== 'Canceled' && selectedOrder.status !== 'Rejected' && selectedOrder.status !== 'Pending' && selectedOrder.status !== 'Ordered' && (
                                        <button className="invoice" onClick={openInvoice}>Invoice</button>
                                    )}
                                    {selectedOrder.status !== 'Canceled' && selectedOrder.status !== 'Rejected' && selectedOrder.status !== 'Returned'  && (
                                        <button className="cancel" onClick={() => cancelOrder(selectedOrder.orderId)}>Cancel</button>
                                    )}
                                    {selectedOrder.status === 'Canceled' && (
                                        <p className="status-message">You canceled this order.</p>
                                    )}
                                    {selectedOrder.status === 'Rejected' && (
                                        <p className="status-message">Seller rejected this order.</p>
                                    )}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="progress-bar">
                                {['Ordered', 'Payment', 'Shipped', 'Delivered', 'Returned'].map((status, index) => (
                                    <React.Fragment key={status}>
                                        <div className={`step ${getStatusIndex(selectedOrder.status) >= index ? 'active' : 'inactive'}`}>
                                            <div className="circle">{index + 1}</div>
                                            <div className="step-text">{status}</div>
                                            {index < 4 && (
                                                <div
                                                    className={`line ${getStatusIndex(selectedOrder.status) > index ? 'active' : 'inactive'}`}
                                                ></div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Product Details */}
                            <div className="selectedOrder-content">
                                <div className="product-details">
                                    <img
                                        src={selectedOrder.productImage || 'placeholder-image.png'}
                                        alt={selectedOrder.productName}
                                        className="product-image"
                                    />
                                    <div className="row-arrange1">
                                        <h2>{selectedOrder.productName}</h2>
                                        <p className="subtitle">{selectedOrder.category}</p>
                                    </div>
                                    <p><strong>Pickup:</strong> {formatDate(selectedOrder.fromDate)}</p>
                                    <p><strong>Dropoff:</strong> {formatDate(selectedOrder.endDate)}</p>
                                    <p><strong>Rent per Day:</strong> ₹{selectedOrder.productPrice}</p>
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="summary">
                                <div className="delivery">
                                    <h3>Delivery Address</h3>
                                    <p>{selectedOrder.address}</p>
                                </div>
                                <div className="order-summary">
                                    <h3>Order Summary</h3>
                                    <p>
                                        <span>Rent per Day:</span>
                                        <span id="rent-per-day">₹{selectedOrder.productPrice}</span>
                                    </p>
                                    <p>
                                        <span>No. of Days:</span>
                                        <span id="no-of-days">{selectedOrder.days}</span>
                                    </p>
                                    <p>
                                        <span>Delivery:</span>
                                        <span id="delivery-cost">₹0.00</span>
                                    </p>
                                    <p>
                                        <span>Tax:</span>
                                        <span id="tax">₹{selectedOrder.productPrice * 0.1}</span>
                                    </p>
                                    <p className="total">
                                        <span>Total:</span>
                                        <span id="total">₹{selectedOrder.total + selectedOrder.productPrice * 0.1}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal for Invoice */}
                {showInvoice && (
                    <div className="modal-overlay">
                        <div className="modal-content-invoice">
                            <button className="close-button-invoice" onClick={closeInvoice}>
                                X
                            </button>
                            <div className="invoice-header">
                                <h2>Invoice</h2>
                                <p>Order ID: {selectedOrder?.orderId}</p>
                            </div>
                            <div className="invoice-details">
                                <div><strong>Ordered By:</strong> {selectedOrder.customerName}</div>
                                <div><strong>Deliver To:</strong> {selectedOrder.address}</div>
                                <div><strong>From:</strong> {formatDate(selectedOrder?.fromDate)}</div>
                                <div><strong>To:</strong> {formatDate(selectedOrder?.endDate)}</div>
                            </div>
                            <table className="invoice-items">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>RentalDays</th>
                                        <th>Price Per Day</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{selectedOrder?.productName}</td>
                                        <td>{selectedOrder?.days}</td>
                                        <td>₹{selectedOrder?.productPrice}</td>
                                        <td>₹{selectedOrder?.total}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="invoice-footer">
                                Total: ₹{selectedOrder?.total + selectedOrder.total * 0.1}
                            </div>
                            <button
                                className="download-button"
                                onClick={() => downloadInvoice(selectedOrder)}
                            >
                                Download
                            </button>
                        </div>
                    </div>
                )}
                {showPaymentSuccess && (
                    <AnimatedPaymentSuccess onClose={() => setShowPaymentSuccess(false)} />
                )}
            </div>
        </DashboardLayout>
    );
};

export default Orders;