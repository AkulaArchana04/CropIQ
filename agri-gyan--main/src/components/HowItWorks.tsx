import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '1',
      title: 'Input Field Details',
      description: 'Enter soil conditions and field details, or auto-detect from IoT sensors and satellite data',
      icon: '📍',
      color: 'primary'
    },
    {
      step: '2', 
      title: 'AI Analysis',
      description: 'Our AI analyzes soil health, weather patterns, and market trends to create personalized recommendations',
      icon: '🧠',
      color: 'accent'
    },
    {
      step: '3',
      title: 'Smart Recommendations',
      description: 'Receive crop suggestions with yield predictions, profit estimates, and sustainability scores',
      icon: '🎯',
      color: 'cta'
    }
  ];

  return (
    <section className="py-20 earth-gradient">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your farming decisions with AI-powered insights
          </p>
        </div>
        
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary via-accent to-cta rounded-full transform -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="text-center slide-in-left"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className={`relative mx-auto w-24 h-24 rounded-full bg-${step.color} text-white flex items-center justify-center text-2xl font-bold mb-8 shadow-glow hover:scale-110 transition-transform duration-300`}>
                  <span className="absolute -top-2 -right-2 text-4xl">
                    {step.icon}
                  </span>
                  {step.step}
                </div>
                
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;