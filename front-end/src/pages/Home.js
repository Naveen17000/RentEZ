import React from 'react';
import HeroSection from '../components/HeroSection';
// import Categories from '../components/Categories';
import PopularProducts from '../components/PopularProducts';
import Benefits from '../components/Benefits';

const Home = () => {
  return (
    <div className="home-wrapper">
      <HeroSection />
      {/* <Categories /> */}
      <PopularProducts />
      <Benefits />
    </div>
  );
};


export default Home;
