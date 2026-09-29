import React from 'react';
import WeatherIntelligenceDashboard from '@/components/WeatherIntelligenceDashboard';

const WeatherAnalytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">
        <WeatherIntelligenceDashboard />
      </div>
    </div>
  );
};

export default WeatherAnalytics;