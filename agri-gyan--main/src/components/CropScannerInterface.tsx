import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Scan, Leaf, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Disease {
  name: string;
  probability: number;
  severity: string;
  treatment: string;
}

interface Characteristic {
  name: string;
  value: string;
  score: number;
}

interface ScanResults {
  cropType: string;
  healthScore: number;
  growthStage: string;
  confidence: number;
  diseases: Disease[];
  recommendations: string[];
  characteristics: Characteristic[];
}

const CropScannerInterface: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const growthStages = [
    { name: 'Seedling', progress: 100, status: 'complete', icon: '🌱' },
    { name: 'Vegetative', progress: 85, status: 'current', icon: '🌿' },
    { name: 'Flowering', progress: 0, status: 'upcoming', icon: '🌸' },
    { name: 'Fruiting', progress: 0, status: 'upcoming', icon: '🍅' },
    { name: 'Maturity', progress: 0, status: 'upcoming', icon: '🌾' }
  ];

  const mockScanResults = {
    cropType: 'Tomato Plant',
    healthScore: 87,
    growthStage: 'Vegetative',
    confidence: 94,
    diseases: [
      { name: 'Early Blight', probability: 12, severity: 'low', treatment: 'Apply copper fungicide' },
      { name: 'Leaf Spot', probability: 5, severity: 'minimal', treatment: 'Monitor and maintain airflow' }
    ],
    recommendations: [
      'Increase nitrogen fertilizer by 10%',
      'Monitor for aphid presence',
      'Ensure adequate water drainage',
      'Consider pruning lower leaves'
    ],
    characteristics: [
      { name: 'Leaf Color', value: 'Healthy Green', score: 92 },
      { name: 'Stem Thickness', value: '8.2mm', score: 88 },
      { name: 'Node Spacing', value: 'Optimal', score: 90 },
      { name: 'Overall Vigor', value: 'Strong', score: 87 }
    ]
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setScanResults(null);
    
    // Simulate AI processing
    setTimeout(() => {
      setScanResults(mockScanResults);
      setIsScanning(false);
    }, 3500);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-background to-card-soft relative overflow-hidden">
      {/* AR Grid Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 183, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 183, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center gap-2 bg-card-glass backdrop-blur-xl rounded-full px-6 py-3 border border-accent/30 mb-6">
            <Camera className="w-5 h-5 text-accent animate-pulse" />
            <span className="font-mono text-sm font-medium text-foreground">Crop Scanner Interface</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            AI-Powered 
            <span className="harvest-gradient bg-clip-text text-transparent block sm:inline"> Crop Recognition</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced computer vision with augmented reality overlay for real-time plant detection, 
            growth stage identification, and disease diagnosis.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
          {/* Camera Interface */}
          <div className="xl:col-span-2">
            <Card className="brutalist-card overflow-hidden">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-display font-bold text-foreground">
                    Live Camera Feed
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button 
                      onClick={cameraActive ? stopCamera : startCamera}
                      className="btn-glass text-sm"
                    >
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="hidden sm:inline">{cameraActive ? 'Stop' : 'Start'} Camera</span>
                      <span className="sm:hidden">{cameraActive ? 'Stop' : 'Start'}</span>
                    </Button>
                    <Button 
                      onClick={startScan}
                      className="btn-holographic text-sm"
                      disabled={!cameraActive || isScanning}
                    >
                      <Scan className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">{isScanning ? 'Scanning...' : 'Scan Crop'}</span>
                      <span className="sm:hidden">{isScanning ? 'Scan...' : 'Scan'}</span>
                    </Button>
                  </div>
                </div>

                {/* Camera View */}
                <div className="relative bg-muted-dark rounded-2xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      
                      {/* AR Overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Scanning Grid */}
                        <div className={`absolute inset-4 border-2 border-primary rounded-lg ${isScanning ? 'animate-pulse-glow' : ''}`}>
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary" />
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary" />
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary" />
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary" />
                        </div>

                        {/* Scanning Animation */}
                        {isScanning && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-bounce-gentle" />
                          </div>
                        )}

                        {/* Detection Points */}
                        {scanResults && (
                          <>
                            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-success rounded-full animate-pulse-glow">
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-success text-white text-xs px-2 py-1 rounded">
                                Healthy Leaf
                              </div>
                            </div>
                            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-warning rounded-full animate-pulse-glow">
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-warning text-white text-xs px-2 py-1 rounded">
                                Monitor
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Camera not active</p>
                        <p className="text-sm text-muted-foreground mt-2">Click "Start Camera" to begin scanning</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Processing Animation */}
                {isScanning && (
                  <div className="glass-card p-6 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <Leaf className="absolute inset-0 m-auto w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-display font-bold text-foreground mb-2">AI Analysis in Progress</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse" />
                            Detecting plant species...
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <div className="w-2 h-2 bg-accent rounded-full mr-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
                            Analyzing growth stage...
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <div className="w-2 h-2 bg-cta rounded-full mr-3 animate-pulse" style={{ animationDelay: '1s' }} />
                            Checking for diseases...
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Scan Results */}
                {scanResults && (
                  <Card className="glass-card animate-grow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-success" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-display font-bold text-foreground">{scanResults.cropType}</h4>
                          <p className="text-muted-foreground">
                            Confidence: <span className="font-bold text-success">{scanResults.confidence}%</span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {scanResults.characteristics.map((char, index) => (
                          <div key={index} className="text-center">
                            <div className="text-2xl font-display font-bold text-primary mb-1">
                              {typeof char.score === 'number' ? `${char.score}%` : char.value}
                            </div>
                            <div className="text-xs text-muted-foreground">{char.name}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* Growth Timeline */}
            <Card className="brutalist-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-display font-bold text-foreground mb-6">
                  Growth Timeline
                </h3>
                
                <div className="space-y-4">
                  {growthStages.map((stage, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center
                        ${stage.status === 'complete' ? 'bg-success/20 text-success' :
                          stage.status === 'current' ? 'bg-primary/20 text-primary animate-pulse-glow' :
                          'bg-muted text-muted-foreground'}`}>
                        <span className="text-lg">{stage.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground">{stage.name}</span>
                          {stage.status === 'current' && (
                            <Clock className="w-4 h-4 text-primary animate-spin" />
                          )}
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              stage.status === 'complete' ? 'bg-success' :
                              stage.status === 'current' ? 'bg-primary' : 'bg-muted'
                            }`}
                            style={{ width: `${stage.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Disease Detection */}
            {scanResults && (
              <Card className="brutalist-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                    <h3 className="text-xl font-display font-bold text-foreground">
                      Disease Analysis
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {scanResults.diseases.map((disease, index) => (
                      <div key={index} className="glass-card p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">{disease.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            disease.severity === 'low' ? 'bg-warning/20 text-warning' :
                            disease.severity === 'minimal' ? 'bg-success/20 text-success' :
                            'bg-destructive/20 text-destructive'
                          }`}>
                            {disease.probability}% risk
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{disease.treatment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Recommendations */}
            {scanResults && (
              <Card className="brutalist-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-display font-bold text-foreground mb-4">
                    AI Recommendations
                  </h3>
                  
                  <div className="space-y-3">
                    {scanResults.recommendations.map((rec, index) => (
                      <div key={index} className="glass-card p-3">
                        <p className="text-sm text-foreground">
                          💡 {rec}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </section>
  );
};

export default CropScannerInterface;