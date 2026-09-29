import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi';

// Translation interface
interface Translations {
  en: Record<string, string>;
}

// Language context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
}

// English-only translations
const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.soil': 'Soil Analysis',
    'nav.disease': 'Disease Scanner',
    'nav.ai': 'AI Assistant',
    'nav.weather': 'Weather',
    'nav.market': 'Market',
    'nav.profile': 'Profile',
    'nav.signin': 'Sign In',
    'nav.signout': 'Sign Out',
    'nav.getStarted': 'Get Started',

    // AI Assistant
    'ai.title': 'AI Farm Assistant',
    'ai.subtitle': 'Your personal farming advisor - Ask questions in English',
    'ai.locationPlaceholder': 'Enter your location (e.g., Pune, Maharashtra)',
    'ai.quickAsk': 'Quick Ask',
    'ai.cropRecommendation': 'Crop Recommendation',
    'ai.diseaseHelp': 'Disease Help',
    'ai.weatherAdvice': 'Weather Advice',
    'ai.marketPrices': 'Market Prices',
    'ai.farmingTips': 'Farming Tips',
    'ai.seasonalCalendar': 'Seasonal Calendar',
    'ai.expert': 'AI Farm Expert',
    'ai.online': 'Online • Ready to help',
    'ai.typing': 'typing...',
    'ai.placeholder': 'Type your question or use microphone...',
    'ai.voiceInput': 'Voice Input',
    'ai.voiceOutput': 'Voice Output',
    'ai.hindiEnglish': 'English',
    'ai.quickActions': 'Quick Actions',
    'ai.send': 'Send',
    'ai.pressEnter': 'Press Enter to send',
    'ai.voiceSupported': 'Voice supported',

    // Crop Recommendations
    'crop.title': 'AI Crop Recommendations',
    'crop.subtitle': 'Get personalized crop suggestions based on your soil conditions, climate, and market trends',
    'crop.tellUs': 'Tell us about your field',
    'crop.details': 'Provide details for accurate recommendations',
    'crop.soilType': 'Soil Type',
    'crop.season': 'Select Season',
    'crop.waterSource': 'Water Source',
    'crop.cropInterests': 'Select Crops of Interest',
    'crop.additionalDetails': 'Additional Details',
    'crop.soilPH': 'Soil pH (optional)',
    'crop.previousCrop': 'Previous Crop (optional)',
    'crop.getLive': 'Get Live Recommendations',
    'crop.saveAI': 'Save AI Recommendations',
    'crop.analyzing': 'Analyzing...',
    'crop.saving': 'Saving...',
    'crop.selectCropsOfInterest': 'Select Crops of Interest',
    'crop.type': 'Select Crops',
    
    // Individual Crops
    'crop.rice': 'Rice',
    'crop.wheat': 'Wheat', 
    'crop.cotton': 'Cotton',
    'crop.sugarcane': 'Sugarcane',
    'crop.maize': 'Maize',
    'crop.soybean': 'Soybean',
    'crop.tomato': 'Tomato',
    'crop.potato': 'Potato',
    'crop.onion': 'Onion',
    
    // Crop Descriptions
    'crop.riceDesc': 'Staple food crop',
    'crop.wheatDesc': 'Winter wheat',
    'crop.cottonDesc': 'Cash crop',
    'crop.sugarcaneDesc': 'Sugar crop',
    'crop.maizeDesc': 'Corn crop',
    'crop.soybeanDesc': 'Oil seed',
    'crop.tomatoDesc': 'Vegetable crop',
    'crop.potatoDesc': 'Tuber crop',
    'crop.onionDesc': 'Bulb crop',
    
    // Crop Categories
    'crop.riceCategory': 'Cereal',
    'crop.wheatCategory': 'Cereal',
    'crop.cottonCategory': 'Cash Crop',
    'crop.sugarcaneCategory': 'Cash Crop',
    'crop.maizeCategory': 'Cereal',
    'crop.soybeanCategory': 'Oil Seed',
    'crop.tomatoCategory': 'Vegetable',
    'crop.potatoCategory': 'Vegetable',
    'crop.onionCategory': 'Vegetable',

    // Crop Recommendations Component
    'cropRec.intelligence': 'AI Crop Intelligence',
    'cropRec.smartAnalysis': 'Smart Crop Analysis',
    'cropRec.runAnalysis': 'Run AI Analysis',
    'cropRec.confidence': 'Confidence',
    'cropRec.expectedYield': 'Expected Yield',
    'cropRec.bestSeason': 'Best Season',
    'cropRec.recommendation': 'Recommendation',
    'cropRec.analysisFactors': 'Analysis Factors',
    'cropRec.marketInsights': 'Market Insights',
    'cropRec.wheatPrice': 'Wheat Price',
    'cropRec.demandForecast': 'Demand Forecast',
    'cropRec.competition': 'Competition',
    'cropRec.high': 'High',
    'cropRec.medium': 'Medium',
    'cropRec.optimalZone': 'Optimal Zone 7B',
    'cropRec.winterPlanting': 'Winter Planting',
    'cropRec.moisture': 'Moisture',
    'cropRec.moistureOptimal': '68% Optimal',
    'cropRec.sunlight': 'Sunlight',
    'cropRec.sunlightDaily': '8hrs Daily',
    'cropRec.wheatReason': 'Optimal soil pH and nitrogen levels',
    'cropRec.maizeReason': 'High moisture content and temperature match',
    'cropRec.soybeanReason': 'Nitrogen-fixing benefits for soil health',

    // Soil Types
    'soil.clay': 'Clay',
    'soil.sandy': 'Sandy',
    'soil.loamy': 'Loamy',
    'soil.black': 'Black Cotton',
    'soil.red': 'Red Soil',
    'soil.clayDesc': 'Heavy, water holding',
    'soil.sandyDesc': 'Light, well-draining',
    'soil.loamyDesc': 'Best for crops',
    'soil.blackDesc': 'Cotton soil',
    'soil.redDesc': 'Iron-rich soil',

    // Seasons
    'season.kharif': 'Kharif (Monsoon)',
    'season.rabi': 'Rabi (Winter)',
    'season.zaid': 'Zaid (Summer)',
    'season.kharifDesc': 'Monsoon crops',
    'season.rabiDesc': 'Winter crops',
    'season.zaidDesc': 'Summer crops',
    'season.kharifMonths': 'June-October',
    'season.rabiMonths': 'November-April',
    'season.zaidMonths': 'March-June',

    // Water Sources
    'water.source': 'Water Source',
    'water.none': 'Rain-fed',
    'water.well': 'Well',
    'water.borewell': 'Borewell',
    'water.canal': 'Canal',
    'water.drip': 'Drip System',
    'water.noneDesc': 'Monsoon water only',
    'water.wellDesc': 'Traditional well',
    'water.borewellDesc': 'Deep bore water',
    'water.canalDesc': 'Government canal',
    'water.dripDesc': 'Modern irrigation',

    // Location
    'location.title': 'Choose Location',
    'location.subtitle': 'Select your location for accurate weather information',
    'location.search': 'Search city name...',
    'location.gps': 'GPS',
    'location.popular': 'Popular Agricultural Regions',
    'location.majorStates': 'Major Agricultural States',
    'location.weather': 'Weather Info',
    'location.loading': 'Loading weather data...',
    'location.temperature': 'Temperature',
    'location.humidity': 'Humidity',
    'location.wind': 'Wind Speed',
    'location.visibility': 'Visibility',
    'weather.insights': 'Weather Insights',
    'weather.forecast': 'Weekly Forecast',
    'weather.farmingAlerts': 'Farming Alerts',
    'weather.farmingInsights': 'Farming Insights',
    'weather.currentWeather': 'Current Weather',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.optional': 'optional',
    'common.required': 'required',
    'common.selectLanguage': 'Select Language',
    'common.english': 'English',
    'common.hindi': 'Hindi',
    'common.highProfit': 'High Profit',
    'common.mediumProfit': 'Medium Profit', 
    'common.lowProfit': 'Low Profit',

    // Market
    'market.title': 'Market Insights',
    'market.setAlert': 'Set Alert',
    'market.contactTrader': 'Contact Trader',
    'market.priceAlerts': 'Price Alerts',
    'market.target': 'Target',
    'market.noAlerts': 'No active alerts. Set price alerts to get notified when your target price is reached.',
    'market.alertSet': 'Price Alert Set!',
    'market.alertSetDesc': 'You will be notified when {crop} reaches ₹{price} at {mandi}',
    'market.enterTarget': 'Please enter target price',
    'market.enterTargetDesc': 'Enter a target price to set up the alert',
    'market.currentPrice': 'Current Price',
    'market.targetPrice': 'Target Price (₹)',
    'market.confirmAlert': 'Confirm Alert',
    'market.traderName': 'Trader',
    'market.phone': 'Phone',
    'market.traders': 'Traders',
    'market.activeTraders': 'active traders',
    'market.contactNote': 'Contact the trader directly to negotiate price and arrange pickup.',
    'market.callNow': 'Call Now',
    'market.callingTrader': 'Connecting...',
    'market.callingTraderDesc': 'Opening phone dialer to contact trader',

    // Disease Scanner
    'disease.title': 'AI Disease Scanner',
    'disease.notPlant': 'Not a Plant Image',
    'disease.uploadPlant': 'Please upload a clear photo of a plant leaf or crop',
    'disease.scan': 'AI Disease Scan',
    'disease.analyzing': 'Analyzing Image...',
    'disease.capture': 'Capture Plant Image',
    'disease.healthScore': 'Health Score',
    'disease.damageFound': 'Damage Found',
    'disease.noDamage': 'No Damage',

    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.subtitle': 'Your farming dashboard with personalized insights',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.farmingTips': "Today's Farming Tips",
    'dashboard.getStarted': 'Get Started',
    'dashboard.cropRec': 'Crop Recommendations',
    'dashboard.diseaseScans': 'Disease Scans',
    'dashboard.getRecs': 'Get Crop Recommendations',
    'dashboard.scanDisease': 'Scan Plant Disease',
    'dashboard.marketInsights': 'Market Insights',
    'dashboard.weather': 'Weather Forecast',
  },
  hi: {
    'nav.home': 'होम',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.soil': 'मिट्टी विश्लेषण',
    'nav.disease': 'रोग स्कैनर',
    'nav.ai': 'AI सहायक',
    'nav.weather': 'मौसम',
    'nav.market': 'बाज़ार',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.signin': 'साइन इन',
    'nav.signout': 'साइन आउट',
    'nav.getStarted': 'शुरू करें',

    'ai.title': 'AI कृषि सहायक',
    'ai.subtitle': 'आपका व्यक्तिगत कृषि सलाहकार',
    'ai.placeholder': 'अपना प्रश्न लिखें...',
    'ai.send': 'भेजें',

    'crop.title': 'AI फसल सिफारिशें',
    'crop.subtitle': 'मिट्टी, जलवायु और बाज़ार के आधार पर फसल सुझाव',
    'crop.soilType': 'मिट्टी का प्रकार',
    'crop.season': 'मौसम चुनें',
    'crop.getLive': 'सिफारिशें प्राप्त करें',

    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.close': 'बंद करें',
    'common.yes': 'हाँ',
    'common.no': 'नहीं',
    'common.selectLanguage': 'भाषा चुनें',
    'common.english': 'English',
    'common.hindi': 'हिंदी',

    'market.title': 'बाज़ार जानकारी',
    'market.setAlert': 'अलर्ट सेट करें',
    'market.contactTrader': 'व्यापारी से संपर्क',
    'market.priceAlerts': 'मूल्य अलर्ट',
    'market.target': 'लक्ष्य',
    'market.noAlerts': 'कोई सक्रिय अलर्ट नहीं। लक्ष्य मूल्य पर सूचना पाने के लिए अलर्ट सेट करें।',
    'market.alertSet': 'मूल्य अलर्ट सेट!',
    'market.alertSetDesc': '{mandi} पर {crop} ₹{price} पर पहुँचने पर सूचित किया जाएगा',
    'market.enterTarget': 'कृपया लक्ष्य मूल्य दर्ज करें',
    'market.enterTargetDesc': 'अलर्ट सेट करने के लिए लक्ष्य मूल्य दर्ज करें',
    'market.currentPrice': 'वर्तमान मूल्य',
    'market.targetPrice': 'लक्ष्य मूल्य (₹)',
    'market.confirmAlert': 'अलर्ट पुष्टि करें',
    'market.traderName': 'व्यापारी',
    'market.phone': 'फ़ोन',
    'market.traders': 'व्यापारी',
    'market.activeTraders': 'सक्रिय व्यापारी',
    'market.contactNote': 'मूल्य तय करने और उठाने की व्यवस्था के लिए सीधे व्यापारी से संपर्क करें।',
    'market.callNow': 'अभी कॉल करें',
    'market.callingTrader': 'कनेक्ट हो रहा है...',
    'market.callingTraderDesc': 'व्यापारी को कॉल करने के लिए डायलर खोला जा रहा है',

    'disease.title': 'AI रोग स्कैनर',
    'disease.notPlant': 'यह पौधे की तस्वीर नहीं है',
    'disease.uploadPlant': 'कृपया पौधे की पत्ती या फसल की स्पष्ट तस्वीर अपलोड करें',
    'disease.scan': 'AI रोग स्कैन',
    'disease.analyzing': 'छवि का विश्लेषण...',
    'disease.capture': 'पौधे की तस्वीर लें',
    'disease.healthScore': 'स्वास्थ्य स्कोर',
    'disease.damageFound': 'क्षति मिली',
    'disease.noDamage': 'कोई क्षति नहीं',

    'dashboard.welcome': 'वापसी पर स्वागत',
    'dashboard.subtitle': 'आपका व्यक्तिगत कृषि डैशबोर्ड',
    'dashboard.quickActions': 'त्वरित कार्य',
    'dashboard.recentActivity': 'हाल की गतिविधि',
    'dashboard.farmingTips': 'आज के कृषि सुझाव',
    'dashboard.getStarted': 'शुरू करें',
    'dashboard.cropRec': 'फसल सिफारिशें',
    'dashboard.diseaseScans': 'रोग स्कैन',
    'dashboard.getRecs': 'फसल सिफारिशें प्राप्त करें',
    'dashboard.scanDisease': 'पौधे का रोग स्कैन करें',
    'dashboard.marketInsights': 'बाज़ार जानकारी',
    'dashboard.weather': 'मौसम पूर्वानुमान',

    'weather.farmingAlerts': 'कृषि अलर्ट',
    'weather.currentWeather': 'वर्तमान मौसम',
  }
};

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Language provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('agri_language');
    return saved === 'hi' ? 'hi' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('agri_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};