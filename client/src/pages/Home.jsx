import React from 'react';
import AnimatedBackground from '../components/landing/AnimatedBackground';
import Hero from '../components/landing/Hero';
import Statistics from '../components/landing/Statistics';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import DiseaseCategories from '../components/landing/DiseaseCategories';
import ChatbotPreview from '../components/landing/ChatbotPreview';
import DashboardPreview from '../components/landing/DashboardPreview';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

const Home = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <AnimatedBackground />
      <Hero />
      <Statistics />
      <Features />
      <HowItWorks />
      <DiseaseCategories />
      <ChatbotPreview />
      <DashboardPreview />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
