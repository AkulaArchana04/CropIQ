-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  farm_size_hectares DECIMAL(10,2),
  primary_crops TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crops table
CREATE TABLE public.crops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  scientific_name TEXT,
  category TEXT NOT NULL, -- vegetables, grains, fruits, etc
  growing_season TEXT[], -- kharif, rabi, zaid
  min_temperature INTEGER,
  max_temperature INTEGER,
  water_requirement TEXT, -- high, medium, low
  soil_ph_min DECIMAL(3,1),
  soil_ph_max DECIMAL(3,1),
  growth_duration_days INTEGER,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crop recommendations table
CREATE TABLE public.crop_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  soil_ph DECIMAL(3,1),
  soil_type TEXT,
  irrigation_available BOOLEAN DEFAULT false,
  previous_crop TEXT,
  recommended_crops JSONB, -- array of crop objects with scores
  weather_data JSONB,
  market_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create disease detection table
CREATE TABLE public.disease_detections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  image_url TEXT,
  detected_disease TEXT,
  confidence_score DECIMAL(5,4),
  treatment_recommendations TEXT[],
  severity TEXT, -- mild, moderate, severe
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weather data table
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_lat DECIMAL(10,8) NOT NULL,
  location_lng DECIMAL(11,8) NOT NULL,
  temperature_min INTEGER,
  temperature_max INTEGER,
  humidity INTEGER,
  rainfall_mm DECIMAL(6,2),
  wind_speed_kmh DECIMAL(5,2),
  forecast_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for crops (public read)
CREATE POLICY "Crops are viewable by everyone" 
ON public.crops FOR SELECT 
USING (true);

-- Create policies for crop recommendations
CREATE POLICY "Users can view their own recommendations" 
ON public.crop_recommendations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations" 
ON public.crop_recommendations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for disease detections
CREATE POLICY "Users can view their own disease detections" 
ON public.disease_detections FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own disease detections" 
ON public.disease_detections FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for weather data (public read)
CREATE POLICY "Weather data is viewable by everyone" 
ON public.weather_data FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample crop data
INSERT INTO public.crops (name, scientific_name, category, growing_season, min_temperature, max_temperature, water_requirement, soil_ph_min, soil_ph_max, growth_duration_days) VALUES
('Rice', 'Oryza sativa', 'grains', ARRAY['kharif'], 20, 35, 'high', 5.5, 6.5, 120),
('Wheat', 'Triticum aestivum', 'grains', ARRAY['rabi'], 10, 25, 'medium', 6.0, 7.5, 120),
('Maize', 'Zea mays', 'grains', ARRAY['kharif', 'rabi'], 15, 35, 'medium', 5.8, 7.0, 90),
('Cotton', 'Gossypium', 'cash_crop', ARRAY['kharif'], 15, 35, 'medium', 5.8, 8.0, 180),
('Sugarcane', 'Saccharum officinarum', 'cash_crop', ARRAY['kharif'], 20, 35, 'high', 6.0, 7.5, 365),
('Tomato', 'Solanum lycopersicum', 'vegetables', ARRAY['kharif', 'rabi'], 15, 30, 'medium', 6.0, 7.0, 75),
('Potato', 'Solanum tuberosum', 'vegetables', ARRAY['rabi'], 10, 25, 'medium', 5.5, 6.5, 90),
('Onion', 'Allium cepa', 'vegetables', ARRAY['rabi'], 10, 30, 'medium', 6.0, 7.5, 120);