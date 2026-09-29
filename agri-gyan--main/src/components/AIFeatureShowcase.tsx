import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, TrendingUp, Zap, MapPin, Calendar, Droplets, Sun, Microscope, CloudRain, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIFeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 'soil-analysis',
      icon: <Sparkles className="w-6 h-6" />,
      title: '🌱 AI Soil Analysis',
      description: 'Analyze soil composition, pH levels, and nutrient content with advanced AI algorithms.',
      stats: { accuracy: '96%', time: '< 30s', samples: '2M+' },
      color: 'from-green-500 to-emerald-600',
      link: '/soil-analysis'
    },
    {
      id: 'disease-scanner',
      icon: <Microscope className="w-6 h-6" />,
      title: '🔍 Disease Detection',
      description: 'Instantly identify plant diseases using computer vision and machine learning.',
      stats: { accuracy: '94%', diseases: '500+', speed: '2s' },
      color: 'from-red-500 to-pink-600',
      link: '/disease-scanner'
    },
    {
      id: 'weather-analytics',
      icon: <CloudRain className="w-6 h-6" />,
      title: '🌤️ Weather Intelligence',
      description: 'Hyperlocal weather forecasting with crop-specific insights and recommendations.',
      stats: { precision: '98%', forecast: '14 days', locations: '50K+' },
      color: 'from-blue-500 to-cyan-600',
      link: '/weather-analytics'
    },
    {
      id: 'market-analysis',
      icon: <BarChart3 className="w-6 h-6" />,
      title: '📈 Market Intelligence',
      description: 'Real-time market prices, demand forecasting, and profit optimization.',
      stats: { markets: '180+', updates: 'Real-time', accuracy: '92%' },
      color: 'from-amber-500 to-orange-600',
      link: '/market'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16 fade-in-up">
          <div className="inline-flex items-center gap-2 bg-card-glass backdrop-blur-xl rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-primary/30 mb-4 sm:mb-6">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse-glow" />
            <span className="font-mono text-xs sm:text-sm font-medium text-foreground">Powered by Advanced AI</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-6">
            Smart Agriculture
            <span className="electric-gradient bg-clip-text text-transparent block sm:inline"> AI Suite</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Experience the future of farming with our comprehensive AI-powered platform 
            designed to maximize yield, reduce costs, and ensure sustainable agriculture.
          </p>
        </div>

        {/* Main Feature Display */}
        <div className="mb-12">
          <Card className="brutalist-card overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Feature Info */}
                <div className="p-6 sm:p-8 lg:p-12">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${features[activeFeature].color} flex items-center justify-center text-white`}>
                      {features[activeFeature].icon}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                        {features[activeFeature].title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
                    {features[activeFeature].description}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {Object.entries(features[activeFeature].stats).map(([key, value], index) => (
                      <div key={index} className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-primary mb-1">{value}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                  
                  <Link to={features[activeFeature].link}>
                    <Button className="btn-holographic w-full sm:w-auto">
                      <Zap className="w-4 h-4 mr-2" />
                      Try {features[activeFeature].title.split(' ')[1]} Now
                    </Button>
                  </Link>
                </div>
                
                {/* Visual Demo */}
                <div className={`p-8 lg:p-12 bg-gradient-to-br ${features[activeFeature].color} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  <div className="relative z-10 text-white text-center">
                    <div className="text-6xl sm:text-8xl mb-6 animate-bounce-gentle">
                      {features[activeFeature].title.split(' ')[0]}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <div className="text-sm sm:text-base">AI Processing Active</div>
                      </div>
                      
                      <div className="bg-white/20 rounded-lg p-4">
                        <div className="text-xs sm:text-sm opacity-80">
                          Real-time analysis in progress...
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                          <div className="bg-white h-2 rounded-full animate-pulse" style={{width: '75%'}} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.id}
              className={`brutalist-card cursor-pointer transition-all duration-300 hover:scale-105 ${
                activeFeature === index ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setActiveFeature(index)}
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
                  {feature.icon}
                </div>
                
                <h4 className="text-sm sm:text-base font-display font-bold text-foreground mb-2">
                  {feature.title}
                </h4>
                
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description.split('.')[0]}...
                </p>
                
                <div className="mt-4">
                  <Link to={feature.link}>
                    <Button size="sm" className="btn-magnetic w-full text-xs">
                      Explore
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFeatureShowcase;