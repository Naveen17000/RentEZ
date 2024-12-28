import React from 'react';

const Benefits = () => {
  return (
    <section className="benefits-section">
      <h2>Benefits for your expediency</h2>
      <div className="benefits-grid">
        <div className="benefit">
          <img src="/assets/benefit1.jpg" alt="benefit2" />
          <h3>Payment Method</h3>
          <p>We offer flexible payment options<br/> to make easier.</p>
        </div>
        <div className="benefit">
          <img src="/assets/benefit2.jpg" alt="benefit2" />
          <h3>Return policy</h3>
          <p>Hassle-free returns within <br/> the rental period.x</p>
        </div>
        <div className="benefit">
          <img src="/assets/benefit3.jpg" alt="benefit2" />
          <h3>Customer Support</h3>
          <p>Our support team is available 24/7<br/> Support you need assistance.</p>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
