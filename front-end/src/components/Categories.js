import React, { useState } from 'react';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    'Material Handling Equipment',
    'Processing Equipment',
    'Packaging Equipment',
    'Manufacturing Machinery',
    'Heavy Construction Equipment',
    'Electrical & Power Equipment',
    'Industrial Safety Equipment',
    'Quality Control & Testing Equipment',
    'Automation & Control Systems',
    'HVAC Industrial Systems',
    'Hydraulic & Pneumatic Equipment',
    'Industrial Storage & Racking',
    'Metal Working Equipment',
    'Industrial Cleaning Equipment',
    'Welding & Fabrication Equipment'
  ];

  // Exactly 6 category images with their details
  const categoryImages = [
    {
      title: 'Material Handling',
      image: '/assets/category5.jpg',
      description: 'Equipment for moving and storing materials'
    },
    {
      title: 'Construction Equipment',
      image: '/assets/category1.jpg',
      description: 'Heavy machinery for construction'
    },
    {
      title: 'Processing Equipment',
      image: '/assets/category2.jpg',
      description: 'Industrial processing solutions'
    },
    {
      title: 'Power Generation',
      image: '/assets/category4.jpg',
      description: 'Power and electrical systems'
    },
    {
      title: 'Safety Equipment',
      image: '/assets/category3.png',
      description: 'Industrial safety solutions'
    },
    {
      title: 'Automation Systems',
      image: '/assets/category6.jpg',
      description: 'Automated control systems'
    }
  ];

  return (
    <section className="categories-section">
      <h2>Explore by Category</h2>
      <div className="category-container">
        <div className="category-filter">
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'active' : ''}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
        <div className="category-grid">
          {categoryImages.map((category, index) => (
            <div key={index} className="category-card">
              <img src={category.image} alt={category.title} />
              <div className="category-content">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;