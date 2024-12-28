import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const images = [
    '/home-slide1.jpg',
    '/home-slide2.jpg',
    '/home-slide3.jpg',
    '/home-slide4.jpg',
    '/home-slide5.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // 3 seconds interval

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Welcome to RentEZ</h1>
        <p>Rent the best industrial equipment at affordable prices.</p>
        <Link to="/products" className="hero-rent-button">
          Rent Now
        </Link>
      </div>
      <div className="hero-image">
        {/* Map through the images and apply "active" class to the current one */}
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index}`}
            className={index === currentImageIndex ? 'active' : ''}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
