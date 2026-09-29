import React from 'react';
import { Button } from "@/components/ui/button";
import cropDiseaseImg from '@/assets/crop-disease.jpg';

const DiseaseDetection: React.FC = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              AI Crop Disease 
              <span className="text-primary"> Detection</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Simply upload a photo of your crop leaves or plants. Our advanced AI instantly detects diseases, 
              pests, and nutrient deficiencies, providing immediate treatment recommendations.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg text-foreground">Instant disease identification</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg text-foreground">Treatment recommendations</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg text-foreground">Prevention strategies</span>
              </div>
            </div>
            
            <Button className="btn-cta text-lg px-8 py-4">
              📸 Try Disease Scanner
            </Button>
          </div>
          
          {/* Image with Before/After Style */}
          <div className="relative slide-in-left">
            <div className="earth-card p-8 hover-glow">
              <div className="relative">
                <img 
                  src={cropDiseaseImg} 
                  alt="Crop disease detection example"
                  className="rounded-lg w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-lg" />
                
                {/* AI Detection Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 rounded-lg p-4 shadow-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-foreground">AI Analysis Complete</span>
                      <span className="text-xs bg-success text-white px-2 py-1 rounded-full">95% Accuracy</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-warning">Leaf Blight Detected</span> - Apply copper fungicide (low dose)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiseaseDetection;