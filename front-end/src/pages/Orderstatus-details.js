import React, { useState } from 'react';

const OrderDetails = ({ orderData }) => {
  const [order, setOrder] = useState(orderData || {
    orderId: '#0101',
    productName: 'Concrete Hammer',
    productSubtitle: 'Driller',
    pickupDate: '2024-12-10',
    dropoffDate: '2024-12-23',
    pricePerDay: 300,
    days: 10,
    deliveryCharge: 0,
    tax: 221.88,
    status: 'Requested',
    customerName: 'Naveen',
    deliveryAddress: '847 Jewess Bridge Apt. 174, London, UK',
    contact: '474–769–3919',
    orderDate: '2022-02-16',
    deliveryDate: '2024-12-12',
    returnDate: '2024-12-23',
  });

  const handleAction = (newStatus) => {
    setOrder({ ...order, status: newStatus });
  };

  const renderButtonsByStatus = () => {
    switch (order.status) {
      case 'Requested':
        return (
          <>
            <button className="accept" onClick={() => handleAction('Payment Pending')}>
              Accept
            </button>
            <button className="reject" onClick={() => handleAction('Rejected')}>
              Reject
            </button>
          </>
        );

      case 'Payment Pending':
        return (
          <button className="accept" onClick={() => handleAction('Waiting to Ship')}>
            Paid
          </button>
        );

      case 'Waiting to Ship':
        return (
          <button className="accept" onClick={() => handleAction('Shipped')}>
            Ship
          </button>
        );

      case 'Shipped':
        return (
          <button className="accept" onClick={() => handleAction('Delivered')}>
            Deliver
          </button>
        );

      case 'Delivered':
        return (
          <button className="accept" onClick={() => handleAction('Returned')}>
            Return
          </button>
        );

      case 'Rejected':
        return <p className="info">Order has been rejected.</p>;

      default:
        return <p className="info">Order completed.</p>;
    }
  };

  return (
    <div className="container">
      <div className="order-header">
        <h1>
          Order ID: <span>{order.orderId}</span>
        </h1>
      </div>

      <div className="content">
        <div className="product-details">
          <h2>{order.productName}</h2>
          <p className="subtitle">{order.productSubtitle}</p>
          <p><strong>Pickup:</strong> {order.pickupDate}</p>
          <p><strong>Dropoff:</strong> {order.dropoffDate}</p>
          <p className="price">₹{order.pricePerDay} <span className="qty">Qty: 1</span></p>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-item"><span>Rent per day</span> <span>₹{order.pricePerDay}</span></div>
          <div className="summary-item"><span>No of days</span> <span>{order.days}</span></div>
          <div className="summary-item"><span>Delivery</span> <span>₹{order.deliveryCharge.toFixed(2)}</span></div>
          <div className="summary-item"><span>Tax</span> <span>+₹{order.tax.toFixed(2)}</span></div>
          <div className="summary-total"><span>Total</span> <span>₹{(order.pricePerDay * order.days + order.deliveryCharge + order.tax).toFixed(2)}</span></div>
        </div>
      </div>

      <div className="delivery-info">
        <p><strong>Delivery To:</strong> {order.customerName},<br />{order.deliveryAddress},<br />{order.contact}</p>
        <p><strong>Order date:</strong> {order.orderDate}</p>
        <p><strong>Delivery by:</strong> {order.deliveryDate}</p>
        <p><strong>Return by:</strong> {order.returnDate}</p>
      </div>

      <div className="buttons">{renderButtonsByStatus()}</div>
    </div>
  );
};

export default OrderDetails;
