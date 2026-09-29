import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Cloud, MapPin, AlertCircle, Thermometer, Droplets, Wind, Sun, 
  Calendar, Clock, Eye, Gauge, Mountain, Zap, Beaker, TestTube,
  TrendingUp, Activity, BarChart3, FlaskConical, Sprout, Settings,
  Download, Bell, Globe, Compass, CloudRain, CloudSnow, CloudLightning,
  Target, Leaf, Microscope, ChevronDown, ChevronUp, PieChart,
  LineChart, AreaChart, Filter, Search, MapPin as LocationIcon,
  Timer, Bookmark, Share2, RefreshCw, Database, Calculator, Building2,
  Truck, Users, Star, Award, Package
} from 'lucide-react';

interface SoilTestData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organic_matter: number;
  moisture: number;
  temperature: number;
}

interface SoilAnalysis {
  overall_health: string;
  recommendations: string[];
  suitable_crops: string[];
  fertilizer_needs: string;
  ph_status: string;
  nutrient_status: string;
}

interface MarketAlert {
  id: string;
  crop: string;
  price: string;
  targetPrice: number;
  location: string;
  created: string;
}

const WeatherIntelligenceDashboard: React.FC = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [alertLevel, setAlertLevel] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('New Delhi, India');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [soilModalOpen, setSoilModalOpen] = useState(false);
  const [soilTestResults, setSoilTestResults] = useState<SoilTestData | null>(null);
  const [soilAnalysis, setSoilAnalysis] = useState<SoilAnalysis | null>(null);
  const [soilInputs, setSoilInputs] = useState({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organic_matter: '',
    moisture: '',
    soil_type: '',
    field_size: '',
    crop_history: '',
    irrigation_type: '',
    fertilizer_used: ''
  });
  const [activeTab, setActiveTab] = useState('weather');
  const [showHourlyForecast, setShowHourlyForecast] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [alertPreferences, setAlertPreferences] = useState({
    rainfall: true,
    temperature: true,
    wind: false,
    frost: true
  });
  const [soilHealthScore, setSoilHealthScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedState, setSelectedState] = useState('All India');
  const [priceUpdateInterval, setPriceUpdateInterval] = useState(null);
  const [marketAlertDialogOpen, setMarketAlertDialogOpen] = useState(false);
  const [selectedMarketItem, setSelectedMarketItem] = useState<{ crop: string; price: string; location: string } | null>(null);
  const [marketAlertPrice, setMarketAlertPrice] = useState('');
  const [marketAlerts, setMarketAlerts] = useState<MarketAlert[]>(() => {
    try {
      const saved = localStorage.getItem('agri_weather_market_alerts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const openMarketAlert = (market: { crop: string; price: string; location: string }) => {
    const numericPrice = parseInt(market.price.replace(/[^0-9]/g, '')) || 0;
    setSelectedMarketItem(market);
    setMarketAlertPrice(String(numericPrice));
    setMarketAlertDialogOpen(true);
  };

  const confirmMarketAlert = () => {
    if (!selectedMarketItem || !marketAlertPrice) {
      toast({ title: t('market.enterTarget'), variant: 'destructive' });
      return;
    }
    const alert: MarketAlert = {
      id: crypto.randomUUID(),
      crop: selectedMarketItem.crop,
      price: selectedMarketItem.price,
      targetPrice: parseInt(marketAlertPrice),
      location: selectedMarketItem.location,
      created: new Date().toISOString(),
    };
    setMarketAlerts((prev) => {
      const updated = [...prev, alert];
      localStorage.setItem('agri_weather_market_alerts', JSON.stringify(updated));
      return updated;
    });
    toast({
      title: t('market.alertSet'),
      description: t('market.alertSetDesc')
        .replace('{crop}', selectedMarketItem.crop)
        .replace('{price}', marketAlertPrice)
        .replace('{mandi}', selectedMarketItem.location),
    });
    setMarketAlertDialogOpen(false);
    setSelectedMarketItem(null);
    setMarketAlertPrice('');
  };

  useEffect(() => {
    const alertInterval = setInterval(() => {
      setAlertLevel(prev => (prev + 1) % 3);
    }, 3000);
    
    // Update date/time every second
    const timeInterval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    // Real-time price simulation (updates every 30 seconds)
    const priceInterval = setInterval(() => {
      // Simulate small price fluctuations
      const currentData = stateWiseCropData[selectedState];
      if (currentData) {
        const updatedData = currentData.map(crop => {
          const basePrice = parseFloat(crop.price.replace(/[^0-9.]/g, ''));
          const fluctuation = (Math.random() - 0.5) * 0.05; // ±2.5% max change
          const newPrice = basePrice * (1 + fluctuation);
          const priceChange = ((newPrice - basePrice) / basePrice) * 100;
          
          return {
            ...crop,
            price: crop.price.includes('/qtl') ? `₹${Math.round(newPrice)}/qtl` : 
                   crop.price.includes('/kg') ? `₹${Math.round(newPrice)}/kg` :
                   crop.price.includes('/piece') ? `₹${Math.round(newPrice)}/piece` : crop.price,
            change: `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)}%`,
            trend: priceChange >= 0 ? 'up' : 'down'
          };
        });
        
        stateWiseCropData[selectedState] = updatedData;
      }
    }, 30000); // Update every 30 seconds
    
    return () => {
      clearInterval(alertInterval);
      clearInterval(timeInterval);
      clearInterval(priceInterval);
    };
  }, [selectedState]);

  const analyzeSoilData = useCallback((data: SoilTestData): SoilAnalysis => {
    const { ph, nitrogen, phosphorus, potassium, organic_matter } = data;
    
    // Analyze pH
    let phStatus = 'Neutral';
    if (ph < 6.0) phStatus = 'Acidic';
    else if (ph > 7.5) phStatus = 'Alkaline';
    
    // Analyze nutrients
    let nutrientStatus = 'Balanced';
    if (nitrogen < 20 || phosphorus < 15 || potassium < 150) {
      nutrientStatus = 'Deficient';
    } else if (nitrogen > 50 || phosphorus > 40 || potassium > 400) {
      nutrientStatus = 'Excess';
    }
    
    // Overall health assessment
    let overallHealth = 'Good';
    const issues = [];
    
    if (ph < 5.5 || ph > 8.5) {
      overallHealth = 'Poor';
      issues.push('pH imbalance');
    }
    if (organic_matter < 2) {
      overallHealth = overallHealth === 'Poor' ? 'Poor' : 'Fair';
      issues.push('Low organic matter');
    }
    if (nitrogen < 15) issues.push('Nitrogen deficiency');
    if (phosphorus < 10) issues.push('Phosphorus deficiency');
    if (potassium < 100) issues.push('Potassium deficiency');
    
    // Generate recommendations
    const recommendations = [];
    if (ph < 6.0) recommendations.push('Add lime to increase pH');
    if (ph > 7.5) recommendations.push('Add sulfur or organic matter to lower pH');
    if (nitrogen < 20) recommendations.push('Apply nitrogen-rich fertilizer (urea/DAP)');
    if (phosphorus < 15) recommendations.push('Apply phosphorus fertilizer (SSP/DAP)');
    if (potassium < 150) recommendations.push('Apply potassium fertilizer (MOP)');
    if (organic_matter < 3) recommendations.push('Add compost or well-decomposed manure');
    
    // Suitable crops based on soil conditions
    let suitableCrops = [];
    if (ph >= 6.0 && ph <= 7.5) {
      suitableCrops = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton'];
    } else if (ph < 6.0) {
      suitableCrops = ['Tea', 'Coffee', 'Potato', 'Blueberry'];
    } else {
      suitableCrops = ['Barley', 'Cauliflower', 'Cabbage'];
    }
    
    // Fertilizer recommendations
    let fertilizerNeeds = 'NPK 120:60:40 kg/ha';
    if (nutrientStatus === 'Deficient') {
      fertilizerNeeds = 'NPK 150:75:60 kg/ha + Micronutrients';
    } else if (nutrientStatus === 'Excess') {
      fertilizerNeeds = 'Reduce fertilizer application, focus on organic matter';
    }
    
    return {
      overall_health: overallHealth,
      recommendations,
      suitable_crops: suitableCrops,
      fertilizer_needs: fertilizerNeeds,
      ph_status: phStatus,
      nutrient_status: nutrientStatus
    };
  }, []);

  const calculateSoilHealthScore = (data: SoilTestData): number => {
    let score = 0;
    const { ph, nitrogen, phosphorus, potassium, organic_matter, moisture } = data;
    
    // pH Score (0-25 points)
    if (ph >= 6.0 && ph <= 7.5) score += 25;
    else if (ph >= 5.5 && ph <= 8.0) score += 15;
    else score += 5;
    
    // Nitrogen Score (0-20 points)
    if (nitrogen >= 20 && nitrogen <= 40) score += 20;
    else if (nitrogen >= 15 && nitrogen <= 50) score += 15;
    else score += 5;
    
    // Phosphorus Score (0-20 points)
    if (phosphorus >= 15 && phosphorus <= 30) score += 20;
    else if (phosphorus >= 10 && phosphorus <= 40) score += 15;
    else score += 5;
    
    // Potassium Score (0-20 points)
    if (potassium >= 150 && potassium <= 300) score += 20;
    else if (potassium >= 100 && potassium <= 400) score += 15;
    else score += 5;
    
    // Organic Matter Score (0-15 points)
    if (organic_matter >= 3) score += 15;
    else if (organic_matter >= 2) score += 10;
    else score += 3;
    
    return Math.min(score, 100);
  };

  const handleSoilAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const testData: SoilTestData = {
      ph: parseFloat(soilInputs.ph) || 7.0,
      nitrogen: parseFloat(soilInputs.nitrogen) || 25,
      phosphorus: parseFloat(soilInputs.phosphorus) || 20,
      potassium: parseFloat(soilInputs.potassium) || 200,
      organic_matter: parseFloat(soilInputs.organic_matter) || 3,
      moisture: parseFloat(soilInputs.moisture) || 25,
      temperature: 25 + Math.random() * 10
    };
    
    setSoilTestResults(testData);
    const analysis = analyzeSoilData(testData);
    setSoilAnalysis(analysis);
    const healthScore = calculateSoilHealthScore(testData);
    setSoilHealthScore(healthScore);
    setIsAnalyzing(false);
  };

  const weatherAlerts = [
    { 
      type: 'Heavy Rainfall', 
      severity: 'high', 
      message: 'Expected 80mm rainfall in next 24 hours. Prepare drainage systems.',
      action: 'Cover sensitive crops and ensure proper field drainage',
      icon: '🌧️',
      time: '2 hours'
    },
    { 
      type: 'Heat Wave', 
      severity: 'medium', 
      message: 'Temperature will exceed 42°C for next 3 days.',
      action: 'Increase irrigation frequency and provide shade cover',
      icon: '🌡️',
      time: '6 hours'
    },
    { 
      type: 'Frost Warning', 
      severity: 'critical', 
      message: 'Temperature may drop to 2°C tonight.',
      action: 'Apply protective measures immediately for tender crops',
      icon: '❄️',
      time: '12 hours'
    }
  ];

  const currentWeather = {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    rainfall: 2.5,
    uvIndex: 7,
    pressure: 1013,
    visibility: 10
  };

  const weeklyForecast = [
    { day: 'Today', icon: '🌤️', high: 32, low: 22, rain: 20, condition: 'Partly Cloudy' },
    { day: 'Tomorrow', icon: '🌧️', high: 28, low: 20, rain: 80, condition: 'Heavy Rain' },
    { day: 'Wed', icon: '⛈️', high: 25, low: 18, rain: 90, condition: 'Thunderstorm' },
    { day: 'Thu', icon: '🌥️', high: 30, low: 21, rain: 40, condition: 'Cloudy' },
    { day: 'Fri', icon: '☀️', high: 35, low: 24, rain: 10, condition: 'Sunny' },
    { day: 'Sat', icon: '🌤️', high: 33, low: 23, rain: 15, condition: 'Partly Cloudy' },
    { day: 'Sun', icon: '☀️', high: 36, low: 25, rain: 5, condition: 'Clear' }
  ];

  const hourlyForecast = [
    { time: '12 PM', temp: 28, icon: '🌤️', rain: 10, wind: 12 },
    { time: '1 PM', temp: 30, icon: '☀️', rain: 5, wind: 14 },
    { time: '2 PM', temp: 32, icon: '☀️', rain: 0, wind: 16 },
    { time: '3 PM', temp: 34, icon: '🌤️', rain: 15, wind: 18 },
    { time: '4 PM', temp: 32, icon: '⛅', rain: 25, wind: 20 },
    { time: '5 PM', temp: 30, icon: '🌧️', rain: 60, wind: 22 },
    { time: '6 PM', temp: 28, icon: '🌧️', rain: 70, wind: 20 },
    { time: '7 PM', temp: 26, icon: '⛈️', rain: 85, wind: 25 }
  ];

  // State-wise comprehensive crop market data with real-time simulation
  
  const stateWiseCropData = {
    'All India': [
      { crop: 'Rice (Basmati)', price: '₹3,200/qtl', change: '+5.2%', trend: 'up', demand: 'High', volume: '2.5K qtl', location: 'National Average', quality: 'Grade A' },
      { crop: 'Rice (Non-Basmati)', price: '₹2,200/qtl', change: '+3.8%', trend: 'up', demand: 'Medium', volume: '4.2K qtl', location: 'National Average', quality: 'Grade A' },
      { crop: 'Wheat (PBW-343)', price: '₹2,150/qtl', change: '-1.5%', trend: 'down', demand: 'High', volume: '3.8K qtl', location: 'National Average', quality: 'FAQ' },
      { crop: 'Wheat (HD-2967)', price: '₹2,080/qtl', change: '+2.1%', trend: 'up', demand: 'Medium', volume: '2.1K qtl', location: 'National Average', quality: 'FAQ' },
      { crop: 'Maize', price: '₹1,850/qtl', change: '+4.3%', trend: 'up', demand: 'High', volume: '5.6K qtl', location: 'National Average', quality: 'Grade A' },
      { crop: 'Cotton (Kapas)', price: '₹5,800/qtl', change: '+8.9%', trend: 'up', demand: 'Very High', volume: '1.2K qtl', location: 'National Average', quality: 'Grade A' },
      { crop: 'Sugarcane', price: '₹380/qtl', change: '+2.5%', trend: 'up', demand: 'Stable', volume: '8.9K qtl', location: 'National Average', quality: 'Grade A' },
      { crop: 'Onion', price: '₹28/kg', change: '+15.2%', trend: 'up', demand: 'Very High', volume: '12.5K kg', location: 'National Average', quality: 'Grade A' },
      { crop: 'Potato', price: '₹18/kg', change: '-3.8%', trend: 'down', demand: 'Medium', volume: '9.8K kg', location: 'National Average', quality: 'Grade A' },
      { crop: 'Tomato', price: '₹32/kg', change: '+22.5%', trend: 'up', demand: 'Very High', volume: '7.2K kg', location: 'National Average', quality: 'Grade A' }
    ],
    'Punjab': [
      { crop: 'Rice (Basmati)', price: '₹3,450/qtl', change: '+6.8%', trend: 'up', demand: 'Very High', volume: '890 qtl', location: 'Amritsar Mandi', quality: 'Grade A' },
      { crop: 'Wheat (PBW-343)', price: '₹2,280/qtl', change: '+1.2%', trend: 'up', demand: 'High', volume: '1.2K qtl', location: 'Ludhiana Mandi', quality: 'FAQ' },
      { crop: 'Maize', price: '₹1,920/qtl', change: '+3.5%', trend: 'up', demand: 'Medium', volume: '650 qtl', location: 'Bathinda Mandi', quality: 'Grade A' },
      { crop: 'Cotton (Kapas)', price: '₹6,200/qtl', change: '+12.3%', trend: 'up', demand: 'Very High', volume: '420 qtl', location: 'Fazilka Mandi', quality: 'Grade A' },
      { crop: 'Potato', price: '₹16/kg', change: '-2.1%', trend: 'down', demand: 'Medium', volume: '2.8K kg', location: 'Jalandhar Mandi', quality: 'Grade A' },
      { crop: 'Sugarcane', price: '₹410/qtl', change: '+4.2%', trend: 'up', demand: 'High', volume: '3.2K qtl', location: 'Gurdaspur Mandi', quality: 'Grade A' }
    ],
    'Haryana': [
      { crop: 'Wheat (HD-2967)', price: '₹2,190/qtl', change: '+2.8%', trend: 'up', demand: 'High', volume: '980 qtl', location: 'Karnal Mandi', quality: 'FAQ' },
      { crop: 'Rice (Non-Basmati)', price: '₹2,350/qtl', change: '+4.1%', trend: 'up', demand: 'Medium', volume: '760 qtl', location: 'Kurukshetra Mandi', quality: 'Grade A' },
      { crop: 'Mustard', price: '₹5,200/qtl', change: '+7.5%', trend: 'up', demand: 'High', volume: '340 qtl', location: 'Hisar Mandi', quality: 'Grade A' },
      { crop: 'Cotton (Kapas)', price: '₹5,950/qtl', change: '+9.8%', trend: 'up', demand: 'High', volume: '280 qtl', location: 'Sirsa Mandi', quality: 'Grade A' },
      { crop: 'Bajra', price: '₹1,680/qtl', change: '+2.3%', trend: 'up', demand: 'Medium', volume: '1.1K qtl', location: 'Rohtak Mandi', quality: 'FAQ' },
      { crop: 'Onion', price: '₹26/kg', change: '+18.7%', trend: 'up', demand: 'Very High', volume: '4.5K kg', location: 'Gurgaon Mandi', quality: 'Grade A' }
    ],
    'Uttar Pradesh': [
      { crop: 'Wheat (HD-2967)', price: '₹2,020/qtl', change: '-0.8%', trend: 'down', demand: 'Medium', volume: '2.1K qtl', location: 'Meerut Mandi', quality: 'FAQ' },
      { crop: 'Rice (Non-Basmati)', price: '₹2,180/qtl', change: '+2.9%', trend: 'up', demand: 'High', volume: '1.8K qtl', location: 'Varanasi Mandi', quality: 'Grade A' },
      { crop: 'Sugarcane', price: '₹365/qtl', change: '+1.8%', trend: 'up', demand: 'Stable', volume: '5.2K qtl', location: 'Muzaffarnagar Mandi', quality: 'Grade A' },
      { crop: 'Potato', price: '₹19/kg', change: '-1.2%', trend: 'down', demand: 'Medium', volume: '6.8K kg', location: 'Agra Mandi', quality: 'Grade A' },
      { crop: 'Onion', price: '₹29/kg', change: '+16.8%', trend: 'up', demand: 'Very High', volume: '3.9K kg', location: 'Allahabad Mandi', quality: 'Grade A' },
      { crop: 'Mustard', price: '₹4,980/qtl', change: '+6.2%', trend: 'up', demand: 'High', volume: '890 qtl', location: 'Mathura Mandi', quality: 'Grade A' }
    ],
    'Maharashtra': [
      { crop: 'Cotton (Kapas)', price: '₹5,650/qtl', change: '+7.8%', trend: 'up', demand: 'Very High', volume: '1.5K qtl', location: 'Akola Mandi', quality: 'Grade A' },
      { crop: 'Sugarcane', price: '₹395/qtl', change: '+3.2%', trend: 'up', demand: 'High', volume: '4.8K qtl', location: 'Pune Mandi', quality: 'Grade A' },
      { crop: 'Onion', price: '₹31/kg', change: '+19.5%', trend: 'up', demand: 'Very High', volume: '8.2K kg', location: 'Nashik Mandi', quality: 'Grade A' },
      { crop: 'Soybean', price: '₹3,800/qtl', change: '+5.8%', trend: 'up', demand: 'High', volume: '2.1K qtl', location: 'Nagpur Mandi', quality: 'Grade A' },
      { crop: 'Jowar', price: '₹2,150/qtl', change: '+1.8%', trend: 'up', demand: 'Medium', volume: '780 qtl', location: 'Aurangabad Mandi', quality: 'FAQ' },
      { crop: 'Tomato', price: '₹35/kg', change: '+28.2%', trend: 'up', demand: 'Very High', volume: '2.8K kg', location: 'Mumbai Mandi', quality: 'Grade A' }
    ],
    'Karnataka': [
      { crop: 'Rice (Non-Basmati)', price: '₹2,280/qtl', change: '+4.2%', trend: 'up', demand: 'High', volume: '1.2K qtl', location: 'Bangalore Mandi', quality: 'Grade A' },
      { crop: 'Maize', price: '₹1,780/qtl', change: '+2.8%', trend: 'up', demand: 'Medium', volume: '1.8K qtl', location: 'Mysore Mandi', quality: 'Grade A' },
      { crop: 'Cotton (Kapas)', price: '₹5,720/qtl', change: '+8.5%', trend: 'up', demand: 'High', volume: '680 qtl', location: 'Hubli Mandi', quality: 'Grade A' },
      { crop: 'Coffee (Arabica)', price: '₹18,500/qtl', change: '+12.8%', trend: 'up', demand: 'Very High', volume: '120 qtl', location: 'Chikmagalur Mandi', quality: 'Grade AA' },
      { crop: 'Ragi', price: '₹3,200/qtl', change: '+6.5%', trend: 'up', demand: 'High', volume: '450 qtl', location: 'Tumkur Mandi', quality: 'Grade A' },
      { crop: 'Onion', price: '₹24/kg', change: '+11.2%', trend: 'up', demand: 'High', volume: '2.1K kg', location: 'Belgaum Mandi', quality: 'Grade A' }
    ],
    'Tamil Nadu': [
      { crop: 'Rice (Ponni)', price: '₹2,450/qtl', change: '+5.2%', trend: 'up', demand: 'High', volume: '1.5K qtl', location: 'Thanjavur Mandi', quality: 'Grade A' },
      { crop: 'Sugarcane', price: '₹420/qtl', change: '+4.8%', trend: 'up', demand: 'High', volume: '3.8K qtl', location: 'Erode Mandi', quality: 'Grade A' },
      { crop: 'Cotton (Kapas)', price: '₹5,480/qtl', change: '+6.8%', trend: 'up', demand: 'Medium', volume: '520 qtl', location: 'Coimbatore Mandi', quality: 'Grade A' },
      { crop: 'Groundnut', price: '₹5,200/qtl', change: '+8.2%', trend: 'up', demand: 'High', volume: '890 qtl', location: 'Villupuram Mandi', quality: 'Grade A' },
      { crop: 'Turmeric', price: '₹8,500/qtl', change: '+15.8%', trend: 'up', demand: 'Very High', volume: '180 qtl', location: 'Salem Mandi', quality: 'Grade A' },
      { crop: 'Coconut', price: '₹25/piece', change: '+7.2%', trend: 'up', demand: 'High', volume: '15K pieces', location: 'Chennai Mandi', quality: 'Grade A' }
    ]
  };
  
  const cropMarketData = stateWiseCropData[selectedState] || stateWiseCropData['All India'];

  const cropCalendar = [
    { month: 'January', crops: ['Wheat', 'Mustard', 'Peas'], activity: 'Harvesting', stage: 'Rabi' },
    { month: 'February', crops: ['Wheat', 'Barley', 'Gram'], activity: 'Harvesting', stage: 'Rabi' },
    { month: 'March', crops: ['Summer Crops', 'Fodder'], activity: 'Land Preparation', stage: 'Summer' },
    { month: 'April', crops: ['Rice Nursery', 'Cotton'], activity: 'Sowing', stage: 'Kharif Prep' },
    { month: 'May', crops: ['Rice', 'Sugarcane'], activity: 'Transplanting', stage: 'Kharif' },
    { month: 'June', crops: ['Rice', 'Maize', 'Cotton'], activity: 'Sowing', stage: 'Kharif' }
  ];

  const farmingTips = [
    {
      category: 'Irrigation',
      tip: 'Use drip irrigation to save 40-50% water and improve crop yield',
      priority: 'high',
      season: 'All Year'
    },
    {
      category: 'Pest Control',
      tip: 'Apply neem oil spray early morning for effective organic pest control',
      priority: 'medium', 
      season: 'Monsoon'
    },
    {
      category: 'Soil Health',
      tip: 'Add compost and green manure to improve soil organic matter content',
      priority: 'high',
      season: 'Post-Harvest'
    },
    {
      category: 'Technology',
      tip: 'Use weather-based crop insurance to protect against climate risks',
      priority: 'medium',
      season: 'Before Sowing'
    }
  ];

  const cropGuidance = [
    {
      crop: 'Wheat',
      stage: 'Flowering',
      recommendation: 'Reduce watering due to expected heavy rainfall',
      priority: 'high',
      action: 'Create drainage channels immediately'
    },
    {
      crop: 'Rice',
      stage: 'Transplanting',
      recommendation: 'Perfect conditions for transplanting after rain',
      priority: 'optimal',
      action: 'Prepare seedlings for field transfer'
    },
    {
      crop: 'Maize',
      stage: 'Vegetative',
      recommendation: 'Monitor for fungal diseases due to high humidity',
      priority: 'medium',
      action: 'Apply preventive fungicide spray'
    }
  ];

  const severityColors = {
    low: 'text-success border-success/30 bg-success/10',
    medium: 'text-warning border-warning/30 bg-warning/10',
    high: 'text-destructive border-destructive/30 bg-destructive/10',
    critical: 'text-destructive border-destructive/50 bg-destructive/20 animate-pulse-glow'
  };

  return (
    <section className="py-24 bg-gradient-to-br from-card-soft to-background relative overflow-hidden">
      {/* Weather Animation Background */}
      <div className="absolute inset-0 opacity-20">
        {/* Animated Clouds */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-20 bg-primary/10 rounded-full animate-float"
            style={{
              left: `${10 + (i * 20)}%`,
              top: `${10 + Math.sin(i) * 20}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${4 + i}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center gap-2 bg-card-glass backdrop-blur-xl rounded-full px-6 py-3 border border-accent/30 mb-6">
            <Cloud className="w-5 h-5 text-accent animate-bounce-gentle" />
            <span className="font-mono text-sm font-medium text-foreground">Weather Intelligence</span>
          </div>
          
          {/* Real-time Date & Time */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-center gap-4 text-lg text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{currentDateTime.toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-primary">
                  {currentDateTime.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            Real-Time 
            <span className="electric-gradient bg-clip-text text-transparent block sm:inline"> Weather Analytics</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced meteorological analysis with crop-specific guidance, alert systems, 
            soil analysis, and precision agriculture recommendations.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-12">
          <Card className="brutalist-card">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full mb-6">
                  <TabsTrigger value="weather" className="flex items-center gap-2">
                    <Cloud className="w-4 h-4" />
                    <span className="hidden sm:inline">Weather</span>
                  </TabsTrigger>
                  <TabsTrigger value="soil" className="flex items-center gap-2">
                    <TestTube className="w-4 h-4" />
                    <span className="hidden sm:inline">Soil Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger value="market" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden sm:inline">Market Data</span>
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Crop Calendar</span>
                  </TabsTrigger>
                  <TabsTrigger value="tips" className="flex items-center gap-2">
                    <Leaf className="w-4 h-4" />
                    <span className="hidden sm:inline">Farming Tips</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </TabsTrigger>
                </TabsList>

                {/* Weather Tab Content */}
                <TabsContent value="weather" className="mt-0">
                  {/* Alert System */}
                  <div className="mb-8">
                    <Card className="brutalist-card">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-2xl font-display font-bold text-foreground">
                            Weather Alert System
                          </h3>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span className="font-medium text-foreground">{selectedLocation}</span>
                          </div>
                        </div>

                        {/* Active Alerts */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                          {weatherAlerts.map((alert, index) => (
                            <Card 
                              key={index}
                              className={`relative overflow-hidden border-2 transition-all duration-500 ${
                                severityColors[alert.severity as keyof typeof severityColors]
                              } ${index === alertLevel ? 'scale-105 shadow-electric' : ''}`}
                            >
                              <CardContent className="p-6">
                                {/* Ripple Effect */}
                                {index === alertLevel && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                                animate-pulse pointer-events-none" />
                                )}
                                
                                <div className="flex items-start space-x-4">
                                  <div className="text-3xl animate-bounce-gentle">{alert.icon}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-display font-bold text-foreground">{alert.type}</h4>
                                      <span className="text-xs font-mono bg-card/50 px-2 py-1 rounded">
                                        {alert.time}
                                      </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>
                                    <div className="bg-card/50 p-3 rounded-lg">
                                      <p className="text-xs font-medium text-foreground">
                                        💡 {alert.action}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Weather Data Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8 mb-8">
                    {/* Current Conditions */}
                    <div className="xl:col-span-2">
                      <Card className="brutalist-card">
                        <CardContent className="p-4 sm:p-6 lg:p-8">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-display font-bold text-foreground">
                              Current Weather Conditions
                            </h3>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowHourlyForecast(!showHourlyForecast)}
                              className="btn-glass"
                            >
                              {showHourlyForecast ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                              Hourly
                            </Button>
                          </div>

                          {/* Main Weather Display */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                            <div className="glass-card p-4 sm:p-6 text-center group">
                              <Thermometer className="w-8 h-8 sm:w-12 sm:h-12 text-destructive mx-auto mb-2 sm:mb-4 group-hover:animate-magnetic" />
                              <div className="text-xl sm:text-3xl font-display font-bold text-foreground mb-1 sm:mb-2">
                                {currentWeather.temperature}°C
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground">Temperature</div>
                            </div>

                            <div className="glass-card p-6 text-center group">
                              <Droplets className="w-12 h-12 text-primary mx-auto mb-4 group-hover:animate-magnetic" />
                              <div className="text-3xl font-display font-bold text-foreground mb-2">
                                {currentWeather.humidity}%
                              </div>
                              <div className="text-sm text-muted-foreground">Humidity</div>
                            </div>

                            <div className="glass-card p-6 text-center group">
                              <Wind className="w-12 h-12 text-accent mx-auto mb-4 group-hover:animate-magnetic" />
                              <div className="text-3xl font-display font-bold text-foreground mb-2">
                                {currentWeather.windSpeed}
                              </div>
                              <div className="text-sm text-muted-foreground">km/h Wind</div>
                            </div>

                            <div className="glass-card p-6 text-center group">
                              <Sun className="w-12 h-12 text-cta mx-auto mb-4 group-hover:animate-magnetic" />
                              <div className="text-3xl font-display font-bold text-foreground mb-2">
                                {currentWeather.uvIndex}
                              </div>
                              <div className="text-sm text-muted-foreground">UV Index</div>
                            </div>
                          </div>

                          {/* Hourly Forecast */}
                          {showHourlyForecast && (
                            <div className="mb-8">
                              <h4 className="text-lg font-display font-bold text-foreground mb-4">Hourly Forecast</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                                {hourlyForecast.map((hour, index) => (
                                  <div key={index} className="glass-card p-3 text-center">
                                    <div className="text-xs text-muted-foreground mb-2">{hour.time}</div>
                                    <div className="text-2xl mb-2">{hour.icon}</div>
                                    <div className="text-sm font-bold text-foreground">{hour.temp}°</div>
                                    <div className="flex items-center justify-center text-xs text-primary mt-1">
                                      <Droplets className="w-3 h-3 mr-1" />
                                      {hour.rain}%
                                    </div>
                                    <div className="flex items-center justify-center text-xs text-accent mt-1">
                                      <Wind className="w-3 h-3 mr-1" />
                                      {hour.wind}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 7-Day Forecast */}
                          <div className="space-y-4">
                            <h4 className="text-lg sm:text-xl font-display font-bold text-foreground">7-Day Forecast</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3 sm:gap-4">
                              {weeklyForecast.map((day, index) => (
                                <div key={index} className="glass-card p-4 text-center hover-electric">
                                  <div className="text-sm font-medium text-foreground mb-2">{day.day}</div>
                                  <div className="text-3xl mb-2">{day.icon}</div>
                                  <div className="space-y-1">
                                    <div className="text-lg font-bold text-foreground">{day.high}°</div>
                                    <div className="text-sm text-muted-foreground">{day.low}°</div>
                                    <div className="flex items-center justify-center text-primary text-xs">
                                      <Droplets className="w-3 h-3 mr-1" />
                                      {day.rain}%
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Crop Guidance */}
                    <div>
                      <Card className="brutalist-card">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-6">
                            <AlertCircle className="w-6 h-6 text-cta" />
                            <h3 className="text-xl font-display font-bold text-foreground">
                              Crop Guidance
                            </h3>
                          </div>

                          <div className="space-y-4">
                            {cropGuidance.map((guide, index) => (
                              <Card key={index} className="glass-card">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-display font-bold text-foreground">{guide.crop}</h4>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      guide.priority === 'high' ? 'bg-destructive/20 text-destructive' :
                                      guide.priority === 'optimal' ? 'bg-success/20 text-success' :
                                      'bg-warning/20 text-warning'
                                    }`}>
                                      {guide.stage}
                                    </span>
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground mb-3">{guide.recommendation}</p>
                                  
                                  <div className="bg-card/50 p-3 rounded-lg">
                                    <p className="text-xs font-medium text-foreground">
                                      🎯 {guide.action}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          {/* Quick Actions */}
                          <div className="mt-6 space-y-3">
                            <Button className="w-full btn-holographic">
                              📱 Get Weather Alerts
                            </Button>
                            <Button className="w-full btn-glass">
                              🗺️ View Radar Map
                            </Button>
                            <Button className="w-full btn-glass">
                              📊 Historical Data
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Interactive Map Placeholder */}
                  <Card className="brutalist-card">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-display font-bold text-foreground mb-6">
                        Live Weather Map
                      </h3>
                      
                      <div className="relative bg-muted-dark rounded-2xl overflow-hidden" style={{ height: '400px' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce-gentle" />
                            <h4 className="text-xl font-display font-bold text-foreground mb-2">
                              Interactive Weather Map
                            </h4>
                            <p className="text-muted-foreground max-w-md">
                              Real-time weather patterns with crop impact visualization and 
                              hyperlocal forecasting for precision agriculture.
                            </p>
                          </div>
                        </div>
                        
                        {/* Weather Markers */}
                        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-warning rounded-full animate-pulse-glow">
                          <div className="absolute -inset-2 border-2 border-warning rounded-full animate-ping" />
                        </div>
                        <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-primary rounded-full animate-pulse-glow">
                          <div className="absolute -inset-2 border-2 border-primary rounded-full animate-ping" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Soil Analysis Tab */}
                <TabsContent value="soil" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Soil Input Form */}
                    <Card className="brutalist-card">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <TestTube className="w-6 h-6 text-primary" />
                          <h3 className="text-2xl font-display font-bold text-foreground">
                            Soil Analysis Input
                          </h3>
                        </div>

                        <div className="space-y-6">
                          {/* Basic Soil Parameters */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="ph" className="text-sm font-medium text-foreground mb-2 block">
                                Soil pH (4.0 - 9.0)
                              </Label>
                              <Input
                                id="ph"
                                type="number"
                                placeholder="7.0"
                                step="0.1"
                                min="4.0"
                                max="9.0"
                                value={soilInputs.ph}
                                onChange={(e) => setSoilInputs({...soilInputs, ph: e.target.value})}
                                className="glass-input"
                              />
                            </div>
                            <div>
                              <Label htmlFor="moisture" className="text-sm font-medium text-foreground mb-2 block">
                                Moisture (%)
                              </Label>
                              <Input
                                id="moisture"
                                type="number"
                                placeholder="25"
                                min="0"
                                max="100"
                                value={soilInputs.moisture}
                                onChange={(e) => setSoilInputs({...soilInputs, moisture: e.target.value})}
                                className="glass-input"
                              />
                            </div>
                          </div>

                          {/* Nutrient Levels */}
                          <div>
                            <h4 className="text-lg font-display font-bold text-foreground mb-4">Nutrient Levels (kg/ha)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="nitrogen" className="text-sm font-medium text-foreground mb-2 block">
                                  Nitrogen (N)
                                </Label>
                                <Input
                                  id="nitrogen"
                                  type="number"
                                  placeholder="25"
                                  min="0"
                                  value={soilInputs.nitrogen}
                                  onChange={(e) => setSoilInputs({...soilInputs, nitrogen: e.target.value})}
                                  className="glass-input"
                                />
                              </div>
                              <div>
                                <Label htmlFor="phosphorus" className="text-sm font-medium text-foreground mb-2 block">
                                  Phosphorus (P)
                                </Label>
                                <Input
                                  id="phosphorus"
                                  type="number"
                                  placeholder="20"
                                  min="0"
                                  value={soilInputs.phosphorus}
                                  onChange={(e) => setSoilInputs({...soilInputs, phosphorus: e.target.value})}
                                  className="glass-input"
                                />
                              </div>
                              <div>
                                <Label htmlFor="potassium" className="text-sm font-medium text-foreground mb-2 block">
                                  Potassium (K)
                                </Label>
                                <Input
                                  id="potassium"
                                  type="number"
                                  placeholder="200"
                                  min="0"
                                  value={soilInputs.potassium}
                                  onChange={(e) => setSoilInputs({...soilInputs, potassium: e.target.value})}
                                  className="glass-input"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Additional Parameters */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="organic_matter" className="text-sm font-medium text-foreground mb-2 block">
                                Organic Matter (%)
                              </Label>
                              <Input
                                id="organic_matter"
                                type="number"
                                placeholder="3.0"
                                step="0.1"
                                min="0"
                                value={soilInputs.organic_matter}
                                onChange={(e) => setSoilInputs({...soilInputs, organic_matter: e.target.value})}
                                className="glass-input"
                              />
                            </div>
                            <div>
                              <Label htmlFor="soil_type" className="text-sm font-medium text-foreground mb-2 block">
                                Soil Type
                              </Label>
                              <Select value={soilInputs.soil_type} onValueChange={(value) => setSoilInputs({...soilInputs, soil_type: value})}>
                                <SelectTrigger className="glass-input">
                                  <SelectValue placeholder="Select soil type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="clay">Clay</SelectItem>
                                  <SelectItem value="loam">Loam</SelectItem>
                                  <SelectItem value="sandy">Sandy</SelectItem>
                                  <SelectItem value="silt">Silt</SelectItem>
                                  <SelectItem value="peat">Peat</SelectItem>
                                  <SelectItem value="chalk">Chalk</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Farm Information */}
                          <div>
                            <h4 className="text-lg font-display font-bold text-foreground mb-4">Farm Information</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="field_size" className="text-sm font-medium text-foreground mb-2 block">
                                  Field Size (acres)
                                </Label>
                                <Input
                                  id="field_size"
                                  type="number"
                                  placeholder="5.0"
                                  step="0.1"
                                  min="0"
                                  value={soilInputs.field_size}
                                  onChange={(e) => setSoilInputs({...soilInputs, field_size: e.target.value})}
                                  className="glass-input"
                                />
                              </div>
                              <div>
                                <Label htmlFor="irrigation_type" className="text-sm font-medium text-foreground mb-2 block">
                                  Irrigation Type
                                </Label>
                                <Select value={soilInputs.irrigation_type} onValueChange={(value) => setSoilInputs({...soilInputs, irrigation_type: value})}>
                                  <SelectTrigger className="glass-input">
                                    <SelectValue placeholder="Select irrigation" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="drip">Drip Irrigation</SelectItem>
                                    <SelectItem value="sprinkler">Sprinkler</SelectItem>
                                    <SelectItem value="flood">Flood Irrigation</SelectItem>
                                    <SelectItem value="furrow">Furrow Irrigation</SelectItem>
                                    <SelectItem value="none">Rain-fed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Label htmlFor="crop_history" className="text-sm font-medium text-foreground mb-2 block">
                                Previous Crop History
                              </Label>
                              <Textarea
                                id="crop_history"
                                placeholder="Rice -> Wheat -> Fallow (last 3 seasons)"
                                value={soilInputs.crop_history}
                                onChange={(e) => setSoilInputs({...soilInputs, crop_history: e.target.value})}
                                className="glass-input min-h-[80px]"
                              />
                            </div>
                          </div>

                          {/* Analysis Button */}
                          <Button 
                            onClick={handleSoilAnalysis}
                            disabled={isAnalyzing}
                            className="w-full btn-holographic h-12"
                          >
                            {isAnalyzing ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing Soil...
                              </>
                            ) : (
                              <>
                                <Microscope className="w-4 h-4 mr-2" />
                                Analyze Soil Health
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Soil Analysis Results */}
                    <Card className="brutalist-card">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <BarChart3 className="w-6 h-6 text-accent" />
                          <h3 className="text-2xl font-display font-bold text-foreground">
                            Soil Health Analysis
                          </h3>
                        </div>

                        {soilTestResults && soilAnalysis ? (
                          <div className="space-y-6">
                            {/* Soil Health Score */}
                            <div className="text-center">
                              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20" />
                                <div className="relative">
                                  <div className={`text-4xl font-display font-bold ${
                                    soilHealthScore >= 80 ? 'text-success' :
                                    soilHealthScore >= 60 ? 'text-warning' : 'text-destructive'
                                  }`}>
                                    {soilHealthScore}
                                  </div>
                                  <div className="text-sm text-muted-foreground">Health Score</div>
                                </div>
                              </div>
                              <Progress value={soilHealthScore} className="w-full" />
                              <p className={`mt-2 font-medium ${
                                soilHealthScore >= 80 ? 'text-success' :
                                soilHealthScore >= 60 ? 'text-warning' : 'text-destructive'
                              }`}>
                                {soilHealthScore >= 80 ? 'Excellent Soil Health' :
                                 soilHealthScore >= 60 ? 'Good Soil Health' : 'Needs Improvement'}
                              </p>
                            </div>

                            {/* Nutrient Analysis Chart */}
                            <div>
                              <h4 className="text-lg font-display font-bold text-foreground mb-4">Nutrient Analysis</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="glass-card p-4 text-center">
                                  <div className="text-2xl font-bold text-blue-500 mb-2">{soilTestResults.nitrogen}</div>
                                  <div className="text-sm text-muted-foreground mb-2">Nitrogen (kg/ha)</div>
                                  <Progress value={(soilTestResults.nitrogen / 50) * 100} className="h-2" />
                                </div>
                                <div className="glass-card p-4 text-center">
                                  <div className="text-2xl font-bold text-orange-500 mb-2">{soilTestResults.phosphorus}</div>
                                  <div className="text-sm text-muted-foreground mb-2">Phosphorus (kg/ha)</div>
                                  <Progress value={(soilTestResults.phosphorus / 40) * 100} className="h-2" />
                                </div>
                                <div className="glass-card p-4 text-center">
                                  <div className="text-2xl font-bold text-green-500 mb-2">{soilTestResults.potassium}</div>
                                  <div className="text-sm text-muted-foreground mb-2">Potassium (kg/ha)</div>
                                  <Progress value={(soilTestResults.potassium / 400) * 100} className="h-2" />
                                </div>
                              </div>
                            </div>

                            {/* Soil Characteristics */}
                            <div>
                              <h4 className="text-lg font-display font-bold text-foreground mb-4">Soil Characteristics</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="glass-card p-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">pH Level</span>
                                    <Badge variant={soilAnalysis.ph_status === 'Neutral' ? 'default' : 'secondary'}>
                                      {soilAnalysis.ph_status}
                                    </Badge>
                                  </div>
                                  <div className="text-2xl font-bold text-foreground mt-2">{soilTestResults.ph}</div>
                                </div>
                                <div className="glass-card p-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Organic Matter</span>
                                    <Badge variant={soilTestResults.organic_matter >= 3 ? 'default' : 'destructive'}>
                                      {soilTestResults.organic_matter >= 3 ? 'Good' : 'Low'}
                                    </Badge>
                                  </div>
                                  <div className="text-2xl font-bold text-foreground mt-2">{soilTestResults.organic_matter}%</div>
                                </div>
                                <div className="glass-card p-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Moisture</span>
                                    <Badge variant="outline">
                                      {soilTestResults.moisture >= 20 ? 'Adequate' : 'Low'}
                                    </Badge>
                                  </div>
                                  <div className="text-2xl font-bold text-foreground mt-2">{soilTestResults.moisture}%</div>
                                </div>
                                <div className="glass-card p-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Nutrient Status</span>
                                    <Badge variant={soilAnalysis.nutrient_status === 'Balanced' ? 'default' : 'secondary'}>
                                      {soilAnalysis.nutrient_status}
                                    </Badge>
                                  </div>
                                  <div className="text-lg font-bold text-foreground mt-2">{soilAnalysis.overall_health}</div>
                                </div>
                              </div>
                            </div>

                            {/* Recommendations */}
                            <div>
                              <h4 className="text-lg font-display font-bold text-foreground mb-4">Recommendations</h4>
                              <div className="space-y-3">
                                {soilAnalysis.recommendations.map((rec, index) => (
                                  <div key={index} className="glass-card p-4">
                                    <div className="flex items-start gap-3">
                                      <Target className="w-5 h-5 text-primary mt-0.5" />
                                      <p className="text-sm text-foreground">{rec}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Suitable Crops */}
                            <div>
                              <h4 className="text-lg font-display font-bold text-foreground mb-4">Suitable Crops</h4>
                              <div className="flex flex-wrap gap-2">
                                {soilAnalysis.suitable_crops.map((crop, index) => (
                                  <Badge key={index} variant="outline" className="px-3 py-1">
                                    <Sprout className="w-3 h-3 mr-1" />
                                    {crop}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Fertilizer Recommendation */}
                            <div className="glass-card p-4 bg-gradient-to-r from-primary/10 to-accent/10">
                              <h4 className="text-lg font-display font-bold text-foreground mb-2">Fertilizer Recommendation</h4>
                              <p className="text-sm text-muted-foreground">{soilAnalysis.fertilizer_needs}</p>
                            </div>

                            {/* Export Options */}
                            <div className="flex gap-3">
                              <Button variant="outline" className="flex-1 btn-glass">
                                <Download className="w-4 h-4 mr-2" />
                                Export Report
                              </Button>
                              <Button variant="outline" className="flex-1 btn-glass">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Results
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <FlaskConical className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h4 className="text-xl font-display font-bold text-foreground mb-2">
                              Ready for Analysis
                            </h4>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              Fill in your soil parameters on the left and click "Analyze Soil Health" 
                              to get comprehensive insights and recommendations.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Market Data Tab */}
                <TabsContent value="market" className="mt-0">
                  <div className="space-y-6">
                    {/* Market Controls */}
                    <Card className="brutalist-card">
                      <CardContent className="p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-success" />
                            <h3 className="text-2xl font-display font-bold text-foreground">
                              Real-Time Market Prices
                            </h3>
                            <Badge variant="outline" className="animate-pulse">
                              <div className="w-2 h-2 bg-success rounded-full mr-2 animate-ping"></div>
                              Live Updates
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                              <Label htmlFor="state-select" className="text-sm font-medium">State:</Label>
                              <Select value={selectedState} onValueChange={setSelectedState}>
                                <SelectTrigger className="w-48 glass-input">
                                  <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="All India">🇮🇳 All India</SelectItem>
                                  <SelectItem value="Punjab">🌾 Punjab</SelectItem>
                                  <SelectItem value="Haryana">🌾 Haryana</SelectItem>
                                  <SelectItem value="Uttar Pradesh">🌾 Uttar Pradesh</SelectItem>
                                  <SelectItem value="Maharashtra">🍅 Maharashtra</SelectItem>
                                  <SelectItem value="Karnataka">☕ Karnataka</SelectItem>
                                  <SelectItem value="Tamil Nadu">🥥 Tamil Nadu</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <Button variant="outline" size="sm" className="glass-button">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Refresh
                            </Button>
                          </div>
                        </div>
                        
                        {/* Market Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="text-center p-4 bg-card/50 rounded-lg">
                            <div className="text-2xl font-display font-bold text-success">{cropMarketData.filter(c => c.trend === 'up').length}</div>
                            <div className="text-sm text-muted-foreground">Prices Rising</div>
                          </div>
                          <div className="text-center p-4 bg-card/50 rounded-lg">
                            <div className="text-2xl font-display font-bold text-destructive">{cropMarketData.filter(c => c.trend === 'down').length}</div>
                            <div className="text-sm text-muted-foreground">Prices Falling</div>
                          </div>
                          <div className="text-center p-4 bg-card/50 rounded-lg">
                            <div className="text-2xl font-display font-bold text-warning">{cropMarketData.filter(c => c.demand === 'Very High').length}</div>
                            <div className="text-sm text-muted-foreground">High Demand</div>
                          </div>
                          <div className="text-center p-4 bg-card/50 rounded-lg">
                            <div className="text-2xl font-display font-bold text-primary">{cropMarketData.length}</div>
                            <div className="text-sm text-muted-foreground">Total Commodities</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Crop Market Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cropMarketData.map((market, index) => (
                        <Card key={index} className="glass-card hover-electric group">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-success/20 to-primary/20 rounded-full flex items-center justify-center">
                                  {market.crop.includes('Rice') && '🌾'}
                                  {market.crop.includes('Wheat') && '🌾'}
                                  {market.crop.includes('Cotton') && '🌿'}
                                  {market.crop.includes('Onion') && '🧅'}
                                  {market.crop.includes('Potato') && '🥔'}
                                  {market.crop.includes('Tomato') && '🍅'}
                                  {market.crop.includes('Maize') && '🌽'}
                                  {market.crop.includes('Sugarcane') && '🎋'}
                                  {market.crop.includes('Coffee') && '☕'}
                                  {market.crop.includes('Coconut') && '🥥'}
                                  {market.crop.includes('Mustard') && '🌻'}
                                  {market.crop.includes('Soybean') && '🫘'}
                                  {market.crop.includes('Groundnut') && '🥜'}
                                  {market.crop.includes('Turmeric') && '🟡'}
                                  {(!market.crop.match(/(Rice|Wheat|Cotton|Onion|Potato|Tomato|Maize|Sugarcane|Coffee|Coconut|Mustard|Soybean|Groundnut|Turmeric)/)) && '🌱'}
                                </div>
                                <div>
                                  <h4 className="text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors">{market.crop}</h4>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <LocationIcon className="w-3 h-3" />
                                    {market.location}
                                  </p>
                                </div>
                              </div>
                              <Badge variant={market.trend === 'up' ? 'default' : 'destructive'} className="animate-fade-in">
                                {market.trend === 'up' ? '📈' : '📉'} {market.change}
                              </Badge>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-2xl font-display font-bold text-foreground">{market.price}</div>
                                  <div className="text-sm text-muted-foreground">Current Price</div>
                                </div>
                                <div className="text-right">
                                  <Badge variant={market.quality === 'Grade AA' ? 'default' : 'outline'}>
                                    <Star className="w-3 h-3 mr-1" />
                                    {market.quality}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    Demand
                                  </span>
                                  <Badge variant={market.demand === 'Very High' ? 'default' : market.demand === 'High' ? 'secondary' : 'outline'} className="text-xs">
                                    {market.demand}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    Volume
                                  </span>
                                  <span className="font-medium text-foreground">{market.volume}</span>
                                </div>
                              </div>
                              
                              <div className="pt-4 border-t border-border/50">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Last updated: {currentDateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => openMarketAlert(market)}
                                  >
                                    <Bell className="w-3 h-3 mr-1" />
                                    {t('market.setAlert')}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {marketAlerts.length > 0 && (
                      <Card className="brutalist-card">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            {t('market.priceAlerts')} ({marketAlerts.length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {marketAlerts.map((alert) => (
                              <div key={alert.id} className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <div className="font-medium text-sm">{alert.crop}</div>
                                <div className="text-xs text-muted-foreground">{alert.location}</div>
                                <div className="text-xs mt-1">{t('market.target')}: ₹{alert.targetPrice}</div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Market Analytics */}
                    <Card className="brutalist-card">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <BarChart3 className="w-6 h-6 text-accent" />
                          <h3 className="text-xl font-display font-bold text-foreground">
                            Market Analytics for {selectedState}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-display font-bold text-foreground flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-success" />
                              Top Gainers
                            </h4>
                            {cropMarketData
                              .filter(c => c.trend === 'up')
                              .sort((a, b) => parseFloat(b.change.replace(/[^0-9.-]/g, '')) - parseFloat(a.change.replace(/[^0-9.-]/g, '')))
                              .slice(0, 3)
                              .map((crop, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                                  <span className="text-sm font-medium text-foreground">{crop.crop}</span>
                                  <Badge variant="default" className="text-xs">{crop.change}</Badge>
                                </div>
                              ))
                            }
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="font-display font-bold text-foreground flex items-center gap-2">
                              <Users className="w-4 h-4 text-warning" />
                              High Demand
                            </h4>
                            {cropMarketData
                              .filter(c => c.demand === 'Very High')
                              .slice(0, 3)
                              .map((crop, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                                  <span className="text-sm font-medium text-foreground">{crop.crop}</span>
                                  <Badge variant="outline" className="text-xs">{crop.demand}</Badge>
                                </div>
                              ))
                            }
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="font-display font-bold text-foreground flex items-center gap-2">
                              <Award className="w-4 h-4 text-primary" />
                              Premium Quality
                            </h4>
                            {cropMarketData
                              .filter(c => c.quality === 'Grade A' || c.quality === 'Grade AA')
                              .slice(0, 3)
                              .map((crop, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                                  <span className="text-sm font-medium text-foreground">{crop.crop}</span>
                                  <Badge variant="secondary" className="text-xs">{crop.quality}</Badge>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Crop Calendar Tab */}
                <TabsContent value="calendar" className="mt-0">
                  <div className="space-y-6">
                    <Card className="brutalist-card">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Calendar className="w-6 h-6 text-primary" />
                          <h3 className="text-2xl font-display font-bold text-foreground">
                            Agricultural Calendar
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {cropCalendar.map((month, index) => (
                            <Card key={index} className="glass-card">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-lg font-display font-bold text-foreground">{month.month}</h4>
                                  <Badge variant="outline">{month.stage}</Badge>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <div className="text-sm text-muted-foreground mb-2">Activity</div>
                                    <div className="font-medium text-foreground">{month.activity}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground mb-2">Crops</div>
                                    <div className="flex flex-wrap gap-1">
                                      {month.crops.map((crop, cropIndex) => (
                                        <Badge key={cropIndex} variant="secondary" className="text-xs">
                                          {crop}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Farming Tips Tab */}
                <TabsContent value="tips" className="mt-0">
                  <div className="space-y-6">
                    <Card className="brutalist-card">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Leaf className="w-6 h-6 text-success" />
                          <h3 className="text-2xl font-display font-bold text-foreground">
                            Smart Farming Tips
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {farmingTips.map((tip, index) => (
                            <Card key={index} className="glass-card">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-lg font-display font-bold text-foreground">{tip.category}</h4>
                                  <Badge variant={tip.priority === 'high' ? 'default' : 'outline'}>
                                    {tip.priority} Priority
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground mb-4">{tip.tip}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Best Season</span>
                                  <Badge variant="secondary">{tip.season}</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="mt-0">
                  <div className="space-y-6">
                    <Card className="brutalist-card">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Settings className="w-6 h-6 text-accent" />
                          <h3 className="text-2xl font-display font-bold text-foreground">
                            Analytics Preferences
                          </h3>
                        </div>

                        <div className="space-y-8">
                          {/* Location Settings */}
                          <div>
                            <h4 className="text-lg font-display font-bold text-foreground mb-4">Location Settings</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="location" className="text-sm font-medium text-foreground mb-2 block">
                                  Default Location
                                </Label>
                                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                  <SelectTrigger className="glass-input">
                                    <SelectValue placeholder="Select location" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="New Delhi, India">New Delhi, India</SelectItem>
                                    <SelectItem value="Mumbai, India">Mumbai, India</SelectItem>
                                    <SelectItem value="Bangalore, India">Bangalore, India</SelectItem>
                                    <SelectItem value="Pune, India">Pune, India</SelectItem>
                                    <SelectItem value="Chennai, India">Chennai, India</SelectItem>
                                    <SelectItem value="Hyderabad, India">Hyderabad, India</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-end">
                                <Button className="btn-glass w-full">
                                  <LocationIcon className="w-4 h-4 mr-2" />
                                  Use Current Location
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Alert Preferences */}
                          <div>
                            <h4 className="text-lg font-display font-bold text-foreground mb-4">Alert Preferences</h4>
                            <div className="space-y-4">
                              {Object.entries(alertPreferences).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between glass-card p-4">
                                  <div className="flex items-center gap-3">
                                    <Bell className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-foreground capitalize">{key.replace('_', ' ')} Alerts</span>
                                  </div>
                                  <Button
                                    variant={value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setAlertPreferences({...alertPreferences, [key]: !value})}
                                  >
                                    {value ? 'Enabled' : 'Disabled'}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Data Export */}
                          <div>
                            <h4 className="text-lg font-display font-bold text-foreground mb-4">Data Export</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Button variant="outline" className="btn-glass">
                                <Download className="w-4 h-4 mr-2" />
                                Export Weather Data
                              </Button>
                              <Button variant="outline" className="btn-glass">
                                <Download className="w-4 h-4 mr-2" />
                                Export Soil Reports
                              </Button>
                              <Button variant="outline" className="btn-glass">
                                <Download className="w-4 h-4 mr-2" />
                                Export Market Data
                              </Button>
                            </div>
                          </div>

                          {/* Advanced Settings */}
                          <div>
                            <h4 className="text-lg font-display font-bold text-foreground mb-4">Advanced Settings</h4>
                            <div className="space-y-4">
                              <div className="glass-card p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-foreground font-medium">Auto-Refresh Data</div>
                                    <div className="text-sm text-muted-foreground">Automatically update weather and market data</div>
                                  </div>
                                  <Button variant="default" size="sm">
                                    Enabled
                                  </Button>
                                </div>
                              </div>
                              <div className="glass-card p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-foreground font-medium">Historical Data Retention</div>
                                    <div className="text-sm text-muted-foreground">Keep data for analysis and trends</div>
                                  </div>
                                  <Select defaultValue="30days">
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="7days">7 Days</SelectItem>
                                      <SelectItem value="30days">30 Days</SelectItem>
                                      <SelectItem value="90days">90 Days</SelectItem>
                                      <SelectItem value="1year">1 Year</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={marketAlertDialogOpen} onOpenChange={setMarketAlertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('market.setAlert')} – {selectedMarketItem?.crop}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              {t('market.currentPrice')}: {selectedMarketItem?.price} | {selectedMarketItem?.location}
            </p>
            <div>
              <Label>{t('market.targetPrice')}</Label>
              <Input
                type="number"
                value={marketAlertPrice}
                onChange={(e) => setMarketAlertPrice(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setMarketAlertDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={confirmMarketAlert}>
              <Bell className="w-4 h-4 mr-2" />
              {t('market.confirmAlert')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WeatherIntelligenceDashboard;