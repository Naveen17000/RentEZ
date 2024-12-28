import React, { useState } from 'react';
import DashboardLayout from '../components/Dashboardlayout';
import '../styles/MyOrders.css';

const Orders = () => {
    const [filter, setFilter] = useState({ date: '', orderType: '', status: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    // Dummy order data
    const orders = [
        { id: 1, imageUrl: '/assets/category3.png', productName: 'Concrete Hammer', orderId: '#0101', quantity: 1, price: 300, placedOn: '12/10/24', arriveOn: '13/10/24', status: 'Shipped' },
        { id: 2, imageUrl: '/assets/category3.png', productName: 'Concrete Hammer', orderId: '#0102', quantity: 1, price: 300, placedOn: '12/10/24', arriveOn: '13/10/24', status: 'Payment' },
        { id: 3, imageUrl: '/assets/category3.png', productName: 'Concrete Hammer', orderId: '#0103', quantity: 1, price: 300, placedOn: '12/10/24', arriveOn: '13/10/24', status: 'Rejected' },
        { id: 4, imageUrl: '/assets/category3.png', productName: 'Concrete Hammer', orderId: '#0104', quantity: 1, price: 300, placedOn: '12/10/24', arriveOn: '13/10/24', status: 'Delivered' },
        { id: 5, imageUrl: '/assets/category3.png', productName: 'Concrete Hammer', orderId: '#0105', quantity: 1, price: 300, placedOn: '12/10/24', arriveOn: '13/10/24', status: 'Requested' },
        { id: 6, imageUrl: '/assets/category3.png', productName: 'Concrete Hammer', orderId: '#0106', quantity: 1, price: 300, placedOn: '12/10/24', arriveOn: '13/10/24', status: 'Canceled' },
        { id: 7, imageUrl: '/assets/category3.png', productName: 'Concrete Hammer', orderId: '#0107', quantity: 1, price: 300, placedOn: '12/10/24', arriveOn: '13/10/24', status: 'Returned' },
    ];

    const [filteredOrders, setFilteredOrders] = useState(orders);

    // Filter handler
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

    const applyFilters = () => {
        const filtered = orders.filter(order => {
            return (!filter.date || order.placedOn === filter.date) &&
                   (!filter.orderType || order.orderType === filter.orderType) &&
                   (!filter.status || order.status === filter.status);
        });
        setFilteredOrders(filtered);
    };

    const resetFilters = () => {
        setFilter({ date: '', orderType: '', status: '' });
        setFilteredOrders(orders);
    };

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

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
                <select name="orderType" value={filter.orderType} onChange={handleFilterChange}>
                    <option value="">Order Type</option>
                    <option value="Rent">Rent</option>
                    <option value="Buy">Buy</option>
                </select>
                <select name="status" value={filter.status} onChange={handleFilterChange}>
                    <option value="">Order Status</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Payment">Payment</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Requested">Requested</option>
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
                        <th>Order ID</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Placed On</th>
                        <th>Arrive On</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((order) => (
                        <tr key={order.id}>
                            <td><img src={order.imageUrl} alt={order.productName} className="order-image" /></td>
                            <td>{order.productName}</td>
                            <td>{order.orderId}</td>
                            <td>{order.quantity}</td>
                            <td>${order.price}</td>
                            <td>{order.placedOn}</td>
                            <td>{order.arriveOn}</td>
                            <td>
                                <span className={`status status-${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td><button className="details-button">View Details</button></td>
                        </tr>
                    ))}
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
        </div>
        </DashboardLayout>
    );
};

export default Orders;
