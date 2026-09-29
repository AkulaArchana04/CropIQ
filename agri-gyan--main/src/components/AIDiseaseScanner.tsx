import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Zap, AlertTriangle, CheckCircle, XCircle, Scan } from 'lucide-react';

const AIDiseaseScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const diseases = [
    {
      name: "Leaf Spot",
      severity: "Medium",
      confidence: 94,
      treatment: "Apply copper-based fungicide",
      color: "text-warning",
      icon: "⚠️"
    },
    {
      name: "Healthy Plant",
      severity: "None",
      confidence: 87,
      treatment: "Continue current care routine",
      color: "text-success",
      icon: "✅"
    },
    {
      name: "Blight",
      severity: "High",
      confidence: 91,
      treatment: "Remove affected areas immediately",
      color: "text-destructive",
      icon: "🚨"
    }
  ];

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScanResult(diseases[Math.floor(Math.random() * diseases.length)]);
      setIsScanning(false);
    }, 3000);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-background relative overflow-hidden">
      {/* Scanning Animation Overlay */}
      {isScanning && (
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm z-30 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
            <p className="text-lg font-semibold text-foreground">AI Analyzing Plant...</p>
          </div>
        </div>
      )}

      {/* Scanning Grid Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 183, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 183, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          animation: 'scan 2s linear infinite'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16 fade-in-up">
          <div className="inline-flex items-center gap-2 bg-card-glass backdrop-blur-xl rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-primary/30 mb-4 sm:mb-6">
            <Scan className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse-glow" />
            <span className="font-mono text-xs sm:text-sm font-medium text-foreground">AI Vision Technology</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-6">
            AI Disease 
            <span className="electric-gradient bg-clip-text text-transparent block sm:inline"> Scanner</span>
            <span className="text-2xl sm:text-3xl md:text-4xl"> 🔍</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Advanced computer vision technology that identifies plant diseases in seconds, 
            providing instant diagnosis and treatment recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Scanner Interface */}
          <div className="xl:col-span-2">
            <Card className="brutalist-card overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-6 sm:mb-8">
                  Plant Disease Detection
                </h3>

                {/* Upload Area */}
                <div className="mb-8">
                  <div 
                    className="glass-card p-8 sm:p-12 text-center cursor-pointer hover-electric transition-all duration-300 border-2 border-dashed border-primary/30 hover:border-primary/60"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedImage ? (
                      <div className="relative">
                        <img 
                          src={selectedImage} 
                          alt="Selected plant" 
                          className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4"
                        />
                        <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="text-white font-semibold">Click to change image</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                          <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-2">Upload Plant Image</h4>
                          <p className="text-sm text-muted-foreground">
                            Click here or drag and drop your plant image for AI analysis
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    onClick={startScan}
                    className="btn-holographic flex-1"
                    disabled={!selectedImage || isScanning}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    {isScanning ? 'Scanning...' : 'Start AI Scan'}
                  </Button>
                  
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-magnetic flex-1"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload New Image
                  </Button>
                </div>

                {/* Scan Results */}
                {scanResult && (
                  <div className="glass-card p-6 animate-fade-in">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        scanResult.severity === 'None' ? 'bg-success/10' :
                        scanResult.severity === 'Medium' ? 'bg-warning/10' : 'bg-destructive/10'
                      }`}>
                        {scanResult.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <h4 className="text-xl font-display font-bold text-foreground mb-2 sm:mb-0">
                            {scanResult.name}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm text-muted-foreground">Confidence:</div>
                            <div className="text-lg font-bold text-primary">{scanResult.confidence}%</div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="text-sm text-muted-foreground mb-1">Severity Level</div>
                          <div className={`font-semibold ${scanResult.color}`}>
                            {scanResult.severity}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="text-sm text-muted-foreground mb-1">Recommended Treatment</div>
                          <div className="text-foreground">{scanResult.treatment}</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {scanResult.severity === 'None' ? (
                            <div className="flex items-center space-x-1 text-success text-sm">
                              <CheckCircle className="w-4 h-4" />
                              <span>Plant is healthy</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-warning text-sm">
                              <AlertTriangle className="w-4 h-4" />
                              <span>Treatment required</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Disease Database */}
          <div className="space-y-6">
            <Card className="brutalist-card">
              <CardContent className="p-6">
                <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-6">
                  Disease Database
                </h3>
                
                <div className="space-y-4">
                  {diseases.slice(0, 3).map((disease, index) => (
                    <div key={index} className="glass-card p-4 hover:bg-secondary transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{disease.icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground text-sm">{disease.name}</div>
                          <div className={`text-xs ${disease.color}`}>
                            Severity: {disease.severity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scanning Tips */}
            <Card className="brutalist-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-4">
                  Scanning Tips
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Ensure good lighting and clear focus
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Capture affected leaf or plant part
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Avoid blurry or distant shots
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Include surrounding healthy tissue
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

export default AIDiseaseScanner;