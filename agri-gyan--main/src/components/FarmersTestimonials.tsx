import React from 'react';
import { Card } from '@/components/ui/card';

const FarmersTestimonials = () => {
  const testimonials = [
    {
      name: 'राजेश कुमार',
      location: 'उत्तर प्रदेश, भारत',
      crop: 'गेहूं और चावल',
      testimonial: 'इस AI प्लेटफॉर्म की वजह से मेरी फसल की पैदावार 35% बढ़ गई है। बीमारी का जल्दी पता लगाने से मुझे लाखों रुपए की बचत हुई।',
      savings: '₹2.5 लाख',
      yieldIncrease: '35%',
      photo: '👨‍🌾'
    },
    {
      name: 'Maria Santos',
      location: 'São Paulo, Brazil',
      crop: 'Coffee & Soybeans',
      testimonial: 'The weather predictions are incredibly accurate. I can now plan my irrigation and harvesting perfectly, reducing water usage by 40%.',
      savings: 'R$ 15,000',
      yieldIncrease: '28%',
      photo: '👩‍🌾'
    },
    {
      name: 'John Thompson',
      location: 'Iowa, USA',
      crop: 'Corn & Wheat',
      testimonial: 'Market price predictions helped me time my sales perfectly. The AI recommendations have transformed how I make farming decisions.',
      savings: '$8,500',
      yieldIncrease: '42%',
      photo: '👨‍🌾'
    },
    {
      name: 'Fatima Al-Zahra',
      location: 'Punjab, Pakistan',
      crop: 'Cotton & Rice',
      testimonial: 'Disease detection saved my entire cotton crop. The multilingual support makes it easy for farmers like me to use advanced technology.',
      savings: '₨ 180,000',
      yieldIncrease: '31%',
      photo: '👩‍🌾'
    },
    {
      name: 'Ahmed Hassan',
      location: 'Nile Delta, Egypt',
      crop: 'Vegetables & Fruits',
      testimonial: 'Water management recommendations reduced my irrigation costs by half while maintaining crop quality. Truly revolutionary for desert farming.',
      savings: '£E 25,000',
      yieldIncrease: '38%',
      photo: '👨‍🌾'
    },
    {
      name: 'Chen Wei',
      location: 'Shandong, China',
      crop: 'Vegetables',
      testimonial: 'The soil health monitoring helped me optimize fertilizer usage. My vegetables are now premium quality and I save 30% on inputs.',
      savings: '¥ 18,000',
      yieldIncrease: '33%',
      photo: '👨‍🌾'
    }
  ];

  return (
    <section className="py-20 warm-gradient">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
            Real Farmers, 
            <span className="text-primary"> Real Results</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-body">
            Hear from farmers around the world who are using AI to transform their agriculture, 
            increase yields, and build sustainable farming practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="earth-card p-8 hover-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Farmer Info */}
              <div className="flex items-center mb-6">
                <div className="text-5xl mr-4">{testimonial.photo}</div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground font-display">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground font-body">{testimonial.location}</p>
                  <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mt-1 font-body">
                    {testimonial.crop}
                  </p>
                </div>
              </div>

              {/* Testimonial */}
              <blockquote className="text-foreground mb-6 leading-relaxed font-body italic">
                "{testimonial.testimonial}"
              </blockquote>

              {/* Results */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success font-display">{testimonial.yieldIncrease}</div>
                  <div className="text-xs text-muted-foreground font-body">Yield Increase</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cta font-display">{testimonial.savings}</div>
                  <div className="text-xs text-muted-foreground font-body">Money Saved</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="earth-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4 font-display">
              Join 50,000+ Farmers Worldwide
            </h3>
            <p className="text-muted-foreground mb-6 font-body">
              Start your journey towards smarter, more profitable farming today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-cta font-body">
                🌾 Start Free Trial
              </button>
              <button className="btn-soft font-body">
                📞 Talk to Expert
              </button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FarmersTestimonials;