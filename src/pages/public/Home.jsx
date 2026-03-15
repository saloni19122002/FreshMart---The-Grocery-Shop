import React from 'react';
import Hero from '../../components/home/Hero';
import BannerSlider from '../../components/home/BannerSlider';
import CategorySection from '../../components/home/CategorySection';
import FeaturedProducts from '../../components/home/FeaturedProducts';
import BenefitsSection from '../../components/home/BenefitsSection';

const Home = () => {
  return (
    <div className="pb-12">
      <Hero />
      <BannerSlider />
      <CategorySection />
      <FeaturedProducts />
      <BenefitsSection />
    </div>
  );
};

export default Home;
