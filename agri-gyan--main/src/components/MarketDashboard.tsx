import React from 'react';

const MarketDashboard: React.FC = () => {
  const weatherData = [
    { day: 'Mon', temp: 28, rain: 15 },
    { day: 'Tue', temp: 32, rain: 5 },
    { day: 'Wed', temp: 29, rain: 40 },
    { day: 'Thu', temp: 26, rain: 65 },
    { day: 'Fri', temp: 30, rain: 20 },
  ];

  const marketPrices = [
    { crop: 'Wheat', price: 2150, change: 5.2, trending: 'up' },
    { crop: 'Rice', price: 1980, change: -2.1, trending: 'down' },
    { crop: 'Corn', price: 1750, change: 8.7, trending: 'up' },
    { crop: 'Soybean', price: 4200, change: 3.4, trending: 'up' },
  ];

  return (
    <section className="py-20 sky-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Market & Weather 
            <span className="text-primary block sm:inline"> Intelligence</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time data streams provide actionable insights for better farming decisions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Weather Forecast Card */}
          <div className="earth-card p-6 sm:p-8 hover-glow">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent flex items-center justify-center mr-3 sm:mr-4">
                <span className="text-xl sm:text-2xl">🌤️</span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Weather Forecast</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Next 5 days outlook</p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {weatherData.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-card-soft rounded-lg">
                  <span className="font-medium text-foreground text-sm sm:text-base">{day.day}</span>
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="text-base sm:text-lg font-semibold text-foreground">{day.temp}°C</span>
                    <div className="flex items-center text-accent">
                      <span className="text-xs sm:text-sm">☔</span>
                      <span className="ml-1 text-xs sm:text-sm">{day.rain}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Market Prices Card */}
          <div className="earth-card p-6 sm:p-8 hover-glow">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cta flex items-center justify-center mr-3 sm:mr-4">
                <span className="text-xl sm:text-2xl">📊</span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Market Prices</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Today's mandi rates (₹/quintal)</p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {marketPrices.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-card-soft rounded-lg">
                  <span className="font-medium text-foreground text-sm sm:text-base">{item.crop}</span>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-base sm:text-lg font-semibold text-foreground">₹{item.price}</span>
                    <div className={`flex items-center text-xs sm:text-sm ${
                      item.trending === 'up' ? 'text-success' : 'text-destructive'
                    }`}>
                      <span>{item.trending === 'up' ? '↗' : '↘'}</span>
                      <span className="ml-1">{Math.abs(item.change)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketDashboard;