import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, Volume2, VolumeX, Globe, Brain, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// TypeScript declarations for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
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

const RealTimeVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'assistant', text: string, timestamp: Date}>>([]);
  
  const recognition = useRef<SpeechRecognition | null>(null);
  const synthesis = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' }
  ];

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage;

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          handleUserInput(finalTranscript);
        }
      };

      recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        
        let errorMessage = "Please check your microphone and try again.";
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = "No speech detected. Please speak louder or check your microphone.";
            break;
          case 'audio-capture':
            errorMessage = "Audio capture failed. Please check microphone permissions.";
            break;
          case 'not-allowed':
            errorMessage = "Microphone access denied. Please enable microphone permissions.";
            break;
          case 'network':
            errorMessage = "Network error. Please check your internet connection.";
            break;
          case 'service-not-allowed':
            errorMessage = "Speech recognition service not available.";
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        toast({
          title: "Voice Recognition Issue",
          description: errorMessage,
          variant: "destructive",
        });
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthesis.current = window.speechSynthesis;

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      if (synthesis.current) {
        synthesis.current.cancel();
      }
    };
  }, [selectedLanguage]);

  const handleUserInput = async (userText: string) => {
    // Add user message to conversation
    const userMessage = { type: 'user' as const, text: userText, timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);

    // Generate AI response based on farming context
    const aiResponse = await generateFarmingResponse(userText, selectedLanguage);
    
    const assistantMessage = { type: 'assistant' as const, text: aiResponse, timestamp: new Date() };
    setConversation(prev => [...prev, assistantMessage]);
    setResponse(aiResponse);

    // Speak the response
    speakText(aiResponse);
  };

  const generateFarmingResponse = async (userText: string, language: string): Promise<string> => {
    // Mock AI farming assistant responses
    const responses: Record<string, Record<string, string[]>> = {
      en: {
        weather: [
          "Based on current weather data, I recommend checking soil moisture levels. The upcoming rain may affect your planting schedule.",
          "Weather conditions look favorable for planting. Temperature is optimal for seed germination at 22°C.",
          "Strong winds predicted tomorrow. Consider protecting young seedlings and checking irrigation systems."
        ],
        soil: [
          "Your soil analysis shows good pH levels. I recommend adding organic matter to improve nutrient retention.",
          "Soil moisture appears low. Consider increasing irrigation frequency by 20% for the next week.",
          "Nitrogen levels are adequate. Focus on phosphorus supplementation for better root development."
        ],
        crops: [
          "For this season, I suggest planting drought-resistant varieties. Corn and sorghum would be excellent choices.",
          "Your crop rotation plan looks good. Adding legumes next season will naturally fix nitrogen in the soil.",
          "Disease pressure is low this week. It's a good time for preventive treatments on vulnerable crops."
        ],
        general: [
          "I'm here to help with your farming questions. You can ask me about weather, soil, crops, or market prices.",
          "As your AI farming assistant, I can provide real-time advice on crop management, weather patterns, and best practices.",
          "Let me help you optimize your farming operations. What specific agricultural challenge are you facing?"
        ]
      },
      es: {
        weather: [
          "Basándome en los datos meteorológicos actuales, recomiendo revisar los niveles de humedad del suelo.",
          "Las condiciones climáticas se ven favorables para plantar. La temperatura es óptima para germinación.",
          "Se predicen vientos fuertes mañana. Considera proteger las plántulas jóvenes."
        ],
        soil: [
          "Tu análisis de suelo muestra buenos niveles de pH. Recomiendo agregar materia orgánica.",
          "La humedad del suelo parece baja. Considera aumentar la frecuencia de riego.",
          "Los niveles de nitrógeno son adecuados. Enfócate en la suplementación con fósforo."
        ],
        general: [
          "Estoy aquí para ayudarte con tus preguntas agrícolas. Como tu asistente de IA agrícola, puedo proporcionar consejos en tiempo real."
        ]
      }
    };

    const languageResponses = responses[language] || responses.en;
    
    // Simple keyword matching for demo
    const lowerText = userText.toLowerCase();
    let category = 'general';
    
    if (lowerText.includes('weather') || lowerText.includes('rain') || lowerText.includes('clima')) {
      category = 'weather';
    } else if (lowerText.includes('soil') || lowerText.includes('suelo') || lowerText.includes('tierra')) {
      category = 'soil';
    } else if (lowerText.includes('crop') || lowerText.includes('plant') || lowerText.includes('cultivo')) {
      category = 'crops';
    }

    const categoryResponses = languageResponses[category] || languageResponses.general;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const speakText = (text: string) => {
    if (synthesis.current) {
      synthesis.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesis.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
      setIsListening(false);
    } else {
      if (recognition.current) {
        recognition.current.start();
        setIsListening(true);
        setTranscript('');
      }
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking && synthesis.current) {
      synthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  const connectToAssistant = () => {
    setIsConnected(true);
    toast({
      title: "Voice Assistant Connected",
      description: `Ready to assist in ${languages.find(l => l.code === selectedLanguage)?.name || 'English'}`,
    });
  };

  const disconnectAssistant = () => {
    setIsConnected(false);
    setIsListening(false);
    if (recognition.current) recognition.current.stop();
    if (synthesis.current) synthesis.current.cancel();
    setTranscript('');
    setResponse('');
  };

  return (
    <section className="py-16 sm:py-20 bg-background relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 255, 183, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 184, 0, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16 fade-in-up">
          <div className="inline-flex items-center gap-2 bg-card-glass backdrop-blur-xl rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-primary/30 mb-4 sm:mb-6">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse-glow" />
            <span className="font-mono text-xs sm:text-sm font-medium text-foreground">Real-Time AI Assistant</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-6">
            Multilingual Voice
            <span className="electric-gradient bg-clip-text text-transparent block sm:inline"> Assistant</span>
            <span className="text-2xl sm:text-3xl md:text-4xl"> 🗣️</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Get instant farming advice in your preferred language with our AI-powered voice assistant.
            Real-time conversation, personalized recommendations, and expert guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Assistant Interface */}
          <div className="xl:col-span-2">
            <Card className="brutalist-card">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6">
                  {/* Language Selection */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                      AI Farming Assistant
                    </h3>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                <span className="flex items-center space-x-2">
                                  <span>{lang.flag}</span>
                                  <span>{lang.name}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="flex items-center justify-between p-4 glass-card">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-success animate-pulse-glow' : 'bg-muted'}`} />
                      <span className="text-sm font-medium text-foreground">
                        {isConnected ? 'Assistant Connected' : 'Assistant Disconnected'}
                      </span>
                    </div>
                    
                    {!isConnected ? (
                      <Button onClick={connectToAssistant} className="btn-holographic">
                        <Brain className="w-4 h-4 mr-2" />
                        Connect Assistant
                      </Button>
                    ) : (
                      <Button onClick={disconnectAssistant} variant="outline">
                        Disconnect
                      </Button>
                    )}
                  </div>

                  {/* Voice Controls */}
                  {isConnected && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={toggleListening}
                          className={`flex-1 ${isListening ? 'btn-magnetic animate-pulse-glow' : 'btn-holographic'}`}
                          disabled={!isConnected}
                        >
                          {isListening ? (
                            <>
                              <MicOff className="w-5 h-5 mr-2" />
                              Stop Listening
                            </>
                          ) : (
                            <>
                              <Mic className="w-5 h-5 mr-2" />
                              Start Voice Chat
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={toggleSpeaking}
                          variant="outline"
                          className="flex-1"
                          disabled={!isSpeaking}
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="w-5 h-5 mr-2" />
                              Stop Speaking
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-5 h-5 mr-2" />
                              Voice Ready
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Live Transcript */}
                      {(transcript || isListening) && (
                        <div className="glass-card p-4">
                          <div className="text-sm text-muted-foreground mb-2">
                            {isListening ? 'Listening...' : 'Last heard:'}
                          </div>
                          <div className="text-foreground">
                            {transcript || (isListening ? 'Say something...' : '')}
                          </div>
                        </div>
                      )}

                      {/* AI Response */}
                      {response && (
                        <div className="glass-card p-4 border-l-4 border-primary">
                          <div className="text-sm text-primary mb-2 flex items-center">
                            <Brain className="w-4 h-4 mr-2" />
                            AI Assistant Response:
                          </div>
                          <div className="text-foreground">{response}</div>
                          {isSpeaking && (
                            <div className="flex items-center mt-2 text-sm text-accent">
                              <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
                              Speaking...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversation History & Tips */}
          <div className="space-y-6">
            {/* Conversation History */}
            <Card className="brutalist-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  Conversation History
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {conversation.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Start a conversation to see history</p>
                    </div>
                  ) : (
                    conversation.slice(-5).map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-primary/10 ml-4' 
                            : 'bg-secondary/50 mr-4'
                        }`}
                      >
                        <div className="text-xs text-muted-foreground mb-1">
                          {message.type === 'user' ? 'You' : 'AI Assistant'} - {message.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="text-sm text-foreground">{message.text}</div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Voice Tips */}
            <Card className="brutalist-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  Voice Assistant Tips
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Speak clearly and at normal pace
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Ask about weather, soil, crops, or market prices
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Use your native language for better understanding
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Wait for response before asking next question
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supported Languages */}
            <Card className="brutalist-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  Supported Languages
                </h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <div
                      key={lang.code}
                      className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                        selectedLanguage === lang.code 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealTimeVoiceAssistant;