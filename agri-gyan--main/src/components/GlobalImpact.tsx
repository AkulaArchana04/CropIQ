import React from 'react';
import { Card } from '@/components/ui/card';

const GlobalImpact = () => {
  const impactStats = [
    {
      number: '2.5M+',
      label: 'Hectares Optimized',
      description: 'Farm land using AI recommendations',
      icon: '🌾',
      color: 'primary'
    },
    {
      number: '45%',
      label: 'Average Yield Increase',
      description: 'Across all crop types and regions',
      icon: '📈',
      color: 'success'
    },
    {
      number: '30%',
      label: 'Water Conservation',
      description: 'Through smart irrigation systems',
      icon: '💧',
      color: 'accent'
    },
    {
      number: '₹180Cr',
      label: 'Farmer Savings',
      description: 'Collective cost reduction achieved',
      icon: '💰',
      color: 'cta'
    },
    {
      number: '15K+',
      label: 'Diseases Prevented',
      description: 'Early detection and treatment',
      icon: '🛡️',
      color: 'warning'
    },
    {
      number: '120+',
      label: 'Countries Served',
      description: 'Global farming community',
      icon: '🌍',
      color: 'primary'
    }
  ];

  const regions = [
    {
      name: 'Asia-Pacific',
      farmers: '35,000+',
      crops: 'Rice, Wheat, Cotton, Vegetables',
      highlight: 'Leading in disease detection accuracy'
    },
    {
      name: 'Americas',
      farmers: '12,000+',
      crops: 'Corn, Soybeans, Coffee, Fruits',
      highlight: 'Highest market prediction accuracy'
    },
    {
      name: 'Africa',
      farmers: '8,500+',
      crops: 'Maize, Cassava, Coffee, Cotton',
      highlight: 'Best water conservation results'
    },
    {
      name: 'Europe',
      farmers: '6,200+',
      crops: 'Wheat, Barley, Rapeseed, Potatoes',
      highlight: 'Most advanced precision farming'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Impact Statistics */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
            Global Farming 
            <span className="text-primary"> Revolution</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-body">
            Our AI platform is transforming agriculture worldwide, helping farmers increase productivity, 
            reduce environmental impact, and build sustainable food systems for the future.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
          {impactStats.map((stat, index) => (
            <Card 
              key={index}
              className="earth-card p-6 text-center hover-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-3 animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
                {stat.icon}
              </div>
              <div className={`text-3xl font-bold text-${stat.color} mb-2 font-display`}>
                {stat.number}
              </div>
              <div className="text-sm font-semibold text-foreground mb-1 font-display">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground font-body">
                {stat.description}
              </div>
            </Card>
          ))}
        </div>

        {/* Regional Impact */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12 font-display">
            Regional Impact & Success
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {regions.map((region, index) => (
              <Card 
                key={index}
                className="earth-card p-6 hover-glow"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="text-center mb-4">
                  <h4 className="text-xl font-semibold text-foreground mb-2 font-display">{region.name}</h4>
                  <div className="text-2xl font-bold text-primary font-display">{region.farmers}</div>
                  <div className="text-sm text-muted-foreground font-body">Active Farmers</div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-1 font-display">Main Crops:</h5>
                    <p className="text-xs text-muted-foreground font-body">{region.crops}</p>
                  </div>
                  
                  <div className="bg-success/10 p-3 rounded-lg">
                    <div className="text-xs font-medium text-success font-body">🏆 {region.highlight}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sustainability Goals */}
        <Card className="earth-card p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in-up">
              <h3 className="text-3xl font-bold text-foreground mb-6 font-display">
                Contributing to UN 
                <span className="text-primary">Sustainable Development Goals</span>
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🍽️</div>
                  <div>
                    <h4 className="font-semibold text-foreground font-display">Zero Hunger (SDG 2)</h4>
                    <p className="text-sm text-muted-foreground font-body">
                      Increasing crop yields and reducing food waste through predictive analytics
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🌱</div>
                  <div>
                    <h4 className="font-semibold text-foreground font-display">Life on Land (SDG 15)</h4>
                    <p className="text-sm text-muted-foreground font-body">
                      Promoting sustainable land use and reducing chemical fertilizer dependency
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">💧</div>
                  <div>
                    <h4 className="font-semibold text-foreground font-display">Clean Water (SDG 6)</h4>
                    <p className="text-sm text-muted-foreground font-body">
                      Optimizing water usage and preventing contamination through precision irrigation
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <h4 className="font-semibold text-foreground font-display">Climate Action (SDG 13)</h4>
                    <p className="text-sm text-muted-foreground font-body">
                      Reducing carbon footprint through optimized farming practices and reduced emissions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="slide-in-left text-center">
              <div className="bg-gradient-to-br from-primary/20 to-success/20 rounded-xl p-8 border border-primary/20">
                <div className="text-6xl mb-6 animate-float">🌍</div>
                <div className="text-4xl font-bold text-primary mb-2 font-display">2030 Goal</div>
                <div className="text-lg text-foreground mb-4 font-body">Feed 10 Billion People Sustainably</div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-card/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-success font-display">50%</div>
                    <div className="text-sm text-muted-foreground font-body">Less Water</div>
                  </div>
                  <div className="bg-card/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-cta font-display">40%</div>
                    <div className="text-sm text-muted-foreground font-body">Higher Yields</div>
                  </div>
                  <div className="bg-card/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-accent font-display">60%</div>
                    <div className="text-sm text-muted-foreground font-body">Less Chemicals</div>
                  </div>
                  <div className="bg-card/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-warning font-display">80%</div>
                    <div className="text-sm text-muted-foreground font-body">Profit Increase</div>
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

export default GlobalImpact;