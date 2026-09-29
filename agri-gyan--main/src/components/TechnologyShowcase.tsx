import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TechnologyShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);

  const technologies = [
    {
      name: 'Computer Vision AI',
      description: 'Advanced image recognition for disease detection and crop health monitoring',
      features: [
        'Real-time plant disease identification',
        'Pest detection and classification',
        'Crop maturity assessment',
        'Yield prediction analysis'
      ],
      accuracy: '96%',
      icon: '👁️'
    },
    {
      name: 'Satellite & Drone Integration',
      description: 'Aerial monitoring and precision agriculture through remote sensing',
      features: [
        'NDVI crop health mapping',
        'Irrigation zone optimization',
        'Field boundary detection',
        'Growth pattern analysis'
      ],
      accuracy: '94%',
      icon: '🛰️'
    },
    {
      name: 'Weather Intelligence',
      description: 'Hyperlocal weather predictions with agricultural focus',
      features: [
        '10-day detailed forecasts',
        'Rainfall probability mapping',
        'Temperature stress alerts',
        'Frost warning system'
      ],
      accuracy: '91%',
      icon: '⛈️'
    },
    {
      name: 'Market Analytics',
      description: 'AI-powered market trend analysis and price predictions',
      features: [
        'Price trend forecasting',
        'Demand-supply analytics',
        'Best selling time recommendations',
        'Export opportunity identification'
      ],
      accuracy: '88%',
      icon: '📈'
    }
  ];

  return (
    <section className="py-20 earth-gradient">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 sm:mb-16 fade-in-up px-4 sm:px-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6 font-display">
            Cutting-Edge 
            <span className="text-primary block sm:inline"> Technology Stack</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-body">
            Our platform integrates the latest AI and remote sensing technologies to provide 
            farmers with unprecedented insights and precision in agricultural decision-making.
          </p>
        </div>

        {/* Technology Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4 sm:px-0">
          {technologies.map((tech, index) => (
            <Button
              key={index}
              variant={activeTab === index ? "default" : "outline"}
              onClick={() => setActiveTab(index)}
              className={`px-3 py-2 sm:px-6 sm:py-3 font-medium transition-all duration-300 text-xs sm:text-base ${
                activeTab === index 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'hover:bg-primary/10'
              }`}
            >
              <span className="mr-1 sm:mr-2 text-sm sm:text-lg">{tech.icon}</span>
              <span className="hidden sm:inline">{tech.name}</span>
              <span className="sm:hidden">{tech.name.split(' ')[0]}</span>
            </Button>
          ))}
        </div>

        {/* Active Technology Details */}
        <Card className="earth-card p-6 sm:p-8 lg:p-12 mx-4 sm:mx-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="fade-in-up">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-0 sm:mr-4">{technologies[activeTab].icon}</div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground font-display">
                    {technologies[activeTab].name}
                  </h3>
                  <div className="flex items-center mt-2">
                    <span className="text-xs sm:text-sm text-muted-foreground mr-2 sm:mr-3">Accuracy:</span>
                    <span className="bg-success/10 text-success px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      {technologies[activeTab].accuracy}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed font-body">
                {technologies[activeTab].description}
              </p>

              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-lg sm:text-xl font-semibold text-foreground font-display">Key Capabilities:</h4>
                {technologies[activeTab].features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-base text-foreground font-body">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="slide-in-left mt-8 lg:mt-0">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl p-6 sm:p-8 border border-primary/20">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-6xl sm:text-8xl mb-3 sm:mb-4 animate-float">{technologies[activeTab].icon}</div>
                    <div className="text-3xl sm:text-4xl font-bold text-primary font-display">{technologies[activeTab].accuracy}</div>
                    <div className="text-sm sm:text-base text-muted-foreground font-body">Average Accuracy</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                    <div className="bg-card/50 rounded-lg p-3 sm:p-4">
                      <div className="text-lg sm:text-2xl font-bold text-success">24/7</div>
                      <div className="text-xs sm:text-sm text-muted-foreground font-body">Monitoring</div>
                    </div>
                    <div className="bg-card/50 rounded-lg p-3 sm:p-4">
                      <div className="text-lg sm:text-2xl font-bold text-cta">Real-time</div>
                      <div className="text-xs sm:text-sm text-muted-foreground font-body">Analysis</div>
                    </div>
                    <div className="bg-card/50 rounded-lg p-3 sm:p-4">
                      <div className="text-lg sm:text-2xl font-bold text-accent">Multi-lingual</div>
                      <div className="text-xs sm:text-sm text-muted-foreground font-body">Support</div>
                    </div>
                    <div className="bg-card/50 rounded-lg p-3 sm:p-4">
                      <div className="text-lg sm:text-2xl font-bold text-warning">Cloud</div>
                      <div className="text-xs sm:text-sm text-muted-foreground font-body">Powered</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default TechnologyShowcase;