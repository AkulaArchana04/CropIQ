import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, Languages, MessageCircle } from 'lucide-react';

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const languages = [
    { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  const sampleQuestions = [
    "What crops should I plant this season?",
    "How can I improve my soil health?",
    "When is the best time to harvest wheat?",
    "मेरे खेत के लिए कौन सी फसल सबसे अच्छी होगी?",
    "আমার মাটিতে কোন ফসল ভালো হবে?",
    "ਮੇਰੇ ਖੇਤ ਵਿੱਚ ਕੀ ਬੀਜਣਾ ਚਾਹੀਦਾ ਹੈ?"
  ];

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onstart = () => {
        setIsConnected(true);
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceQuery(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.lang = selectedLanguage;
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleVoiceQuery = async (query: string) => {
    try {
      // Simulate AI response based on language
      const responses = {
        'en': `Based on your query about "${query}", I recommend checking your soil pH levels and considering wheat or corn for this season. The weather conditions are favorable for winter crops.`,
        'hi': `आपके सवाल "${query}" के आधार पर, मैं सुझाता हूं कि आप अपनी मिट्टी का pH जांचें और इस सीजन के लिए गेहूं या मक्का का विचार करें।`,
        'pa': `ਤੁਹਾਡੇ ਸਵਾਲ "${query}" ਦੇ ਆਧਾਰ ਤੇ, ਮੈਂ ਸੁਝਾਅ ਦਿੰਦਾ ਹਾਂ ਕਿ ਤੁਸੀਂ ਆਪਣੀ ਮਿੱਟੀ ਦਾ pH ਜਾਂਚੋ।`,
        'bn': `আপনার প্রশ্ন "${query}" এর ভিত্তিতে, আমি সুপারিশ করি যে আপনি আপনার মাটির pH স্তর পরীক্ষা করুন।`,
        'te': `మీ ప్రశ్న "${query}" ఆధారంగా, మీ మట్టి pH స్థాయిలను తనిఖీ చేయాలని నేను సిఫార్సు చేస్తున్నాను।`,
        'ta': `உங்கள் கேள்வி "${query}" அடிப்படையில், உங்கள் மண்ணின் pH அளவை சரிபார்க்க பரிந்துரைக்கிறேன்।`
      };
      
      const responseText = responses[selectedLanguage] || responses['en'];
      setResponse(responseText);
      
      // Text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(responseText);
        utterance.lang = selectedLanguage;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error processing voice query:', error);
    }
  };

  const speakSampleQuestion = (question: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.lang = selectedLanguage;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-background relative overflow-hidden">
      {/* Voice Wave Animation */}
      {(isListening || isSpeaking) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 bg-primary rounded-full opacity-60"
                style={{
                  left: `${i * 8}px`,
                  height: `${20 + Math.sin(Date.now() * 0.01 + i) * 15}px`,
                  animation: `wave 1.5s ease-in-out infinite ${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16 fade-in-up">
          <div className="inline-flex items-center gap-2 bg-card-glass backdrop-blur-xl rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-primary/30 mb-4 sm:mb-6">
            <Languages className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse-glow" />
            <span className="font-mono text-xs sm:text-sm font-medium text-foreground">Multilingual AI Assistant</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-6">
            Voice 
            <span className="electric-gradient bg-clip-text text-transparent block sm:inline"> Assistant</span>
            <span className="text-2xl sm:text-3xl md:text-4xl"> 🎤</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Ask questions in your local language using voice commands. Get instant responses 
            with personalized farming advice in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Voice Interface */}
          <div className="xl:col-span-2">
            <Card className="brutalist-card overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-8">
                  {/* Voice Control Button */}
                  <div className="relative mb-6">
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full transition-all duration-300 flex items-center justify-center mx-auto ${
                        isListening 
                          ? 'bg-destructive hover:bg-destructive/90 animate-pulse-glow' 
                          : 'bg-primary hover:bg-primary/90 hover:scale-105'
                      }`}
                      disabled={!isConnected && !recognitionRef.current}
                    >
                      {isListening ? (
                        <MicOff className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                      ) : (
                        <Mic className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                      )}
                    </button>
                    
                    {isListening && (
                      <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2">
                      {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready to Help'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isListening 
                        ? 'Ask your farming question now' 
                        : isSpeaking 
                          ? 'AI is responding to your query'
                          : 'Click the microphone to start'}
                    </p>
                  </div>
                </div>

                {/* Language Selection */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-foreground mb-3">Select Language</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {languages.slice(0, 8).map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code)}
                        className={`glass-card p-3 text-center transition-all duration-200 hover:bg-secondary ${
                          selectedLanguage === lang.code ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <div className="text-lg mb-1">{lang.flag}</div>
                        <div className="text-xs font-medium text-foreground">{lang.name}</div>
                        <div className="text-xs text-muted-foreground">{lang.native}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transcript Display */}
                {transcript && (
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-foreground mb-2">You said:</h4>
                    <div className="glass-card p-4">
                      <p className="text-foreground">{transcript}</p>
                    </div>
                  </div>
                )}

                {/* AI Response */}
                {response && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-md font-semibold text-foreground">AI Response:</h4>
                      {isSpeaking ? (
                        <Volume2 className="w-5 h-5 text-primary animate-pulse" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="glass-card p-4">
                      <p className="text-foreground">{response}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Sample Questions */}
          <div className="space-y-6">
            <Card className="brutalist-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  Sample Questions
                </h3>
                
                <div className="space-y-3">
                  {sampleQuestions.slice(0, 6).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => speakSampleQuestion(question)}
                      className="glass-card p-3 w-full text-left hover:bg-secondary transition-colors text-sm"
                    >
                      <div className="flex items-start space-x-2">
                        <MessageCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{question}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Voice Tips */}
            <Card className="brutalist-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  Voice Tips
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Speak clearly and at normal pace
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Use your native language for better accuracy
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Ask specific farming questions
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Wait for the response before asking again
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VoiceAssistant;