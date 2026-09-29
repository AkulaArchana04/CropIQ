import React from 'react';
import { Button } from "@/components/ui/button";

const VoiceSupport: React.FC = () => {
  const languages = [
    { name: 'English', native: 'English', flag: '🇺🇸' },
    { name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
    { name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="fade-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Voice & Language 
              <span className="text-primary block sm:inline"> Support</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Ask questions in your local language using voice commands. Our AI understands and responds 
              in multiple Indian languages, making farming advice accessible to everyone.
            </p>
            
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-white text-base sm:text-lg">🎤</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Voice Commands</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">Speak naturally in your preferred language</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-white text-base sm:text-lg">💬</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Smart Chat</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">Text-based conversations with instant responses</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cta flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-white text-base sm:text-lg">🔊</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">Audio Responses</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">Listen to advice in your local accent</p>
                </div>
              </div>
            </div>
            
            <Button className="btn-earth text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 w-full sm:w-auto">
              🎤 Try Voice Assistant
            </Button>
          </div>
          
          {/* Languages Grid */}
          <div className="slide-in-left">
            <div className="earth-card p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6 text-center">
                Supported Languages
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {languages.map((lang, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 sm:p-4 bg-card-soft rounded-lg hover:bg-secondary transition-colors cursor-pointer group"
                  >
                    <span className="text-xl sm:text-2xl group-hover:animate-bounce">{lang.flag}</span>
                    <div>
                      <div className="font-medium text-foreground text-sm sm:text-base">{lang.name}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{lang.native}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Voice Demo */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 warm-gradient rounded-lg">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                    <span className="text-xl sm:text-2xl">🎤</span>
                  </div>
                  <div className="text-foreground">
                    <div className="font-medium text-sm sm:text-base">Try asking:</div>
                    <div className="text-xs sm:text-sm opacity-75">"मेरे खेत के लिए कौन सी फसल सबसे अच्छी होगी?"</div>
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

export default VoiceSupport;