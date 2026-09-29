import React from 'react';
import HeroSection from '@/components/HeroSection';
import AboutPlatform from '@/components/AboutPlatform';
import AIFeatureShowcase from '@/components/AIFeatureShowcase';
import RealTimeVoiceAssistant from '@/components/RealTimeVoiceAssistant';
import HowItWorks from '@/components/HowItWorks';
import FarmingInsights from '@/components/FarmingInsights';
import TechnologyShowcase from '@/components/TechnologyShowcase';
import FarmersTestimonials from '@/components/FarmersTestimonials';
import GlobalImpact from '@/components/GlobalImpact';
import SuccessStories from '@/components/SuccessStories';
import CTAFooter from '@/components/CTAFooter';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutPlatform />
      <AIFeatureShowcase />
      <RealTimeVoiceAssistant />
      <HowItWorks />
      <FarmingInsights />
      <TechnologyShowcase />
      <FarmersTestimonials />
      <GlobalImpact />
      <SuccessStories />
      <CTAFooter />
    </div>
  );
};

export default Index;