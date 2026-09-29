import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'db.json');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const defaultData = {
  users: [],
  profiles: [],
  crops: [],
  crop_recommendations: [],
  disease_detections: [],
};

function loadDb() {
  if (!fs.existsSync(dbPath)) {
    const seeded = seedCrops({ ...defaultData });
    saveDb(seeded);
    return seeded;
  }
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  if (!data.crops?.length) {
    const seeded = seedCrops(data);
    saveDb(seeded);
    return seeded;
  }
  return data;
}

function saveDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function seedCrops(data) {
  const crops = [
    { id: 'crop-rice', name: 'Rice', scientific_name: 'Oryza sativa', category: 'grains', growing_season: ['kharif'], min_temperature: 20, max_temperature: 35, water_requirement: 'high', soil_ph_min: 5.5, soil_ph_max: 6.5, growth_duration_days: 120 },
    { id: 'crop-wheat', name: 'Wheat', scientific_name: 'Triticum aestivum', category: 'grains', growing_season: ['rabi'], min_temperature: 10, max_temperature: 25, water_requirement: 'medium', soil_ph_min: 6.0, soil_ph_max: 7.5, growth_duration_days: 120 },
    { id: 'crop-maize', name: 'Maize', scientific_name: 'Zea mays', category: 'grains', growing_season: ['kharif', 'rabi'], min_temperature: 15, max_temperature: 35, water_requirement: 'medium', soil_ph_min: 5.8, soil_ph_max: 7.0, growth_duration_days: 90 },
    { id: 'crop-cotton', name: 'Cotton', scientific_name: 'Gossypium', category: 'cash_crop', growing_season: ['kharif'], min_temperature: 15, max_temperature: 35, water_requirement: 'medium', soil_ph_min: 5.8, soil_ph_max: 8.0, growth_duration_days: 180 },
    { id: 'crop-sugarcane', name: 'Sugarcane', scientific_name: 'Saccharum officinarum', category: 'cash_crop', growing_season: ['kharif'], min_temperature: 20, max_temperature: 35, water_requirement: 'high', soil_ph_min: 6.0, soil_ph_max: 7.5, growth_duration_days: 365 },
    { id: 'crop-tomato', name: 'Tomato', scientific_name: 'Solanum lycopersicum', category: 'vegetables', growing_season: ['kharif', 'rabi'], min_temperature: 15, max_temperature: 30, water_requirement: 'medium', soil_ph_min: 6.0, soil_ph_max: 7.0, growth_duration_days: 75 },
    { id: 'crop-potato', name: 'Potato', scientific_name: 'Solanum tuberosum', category: 'vegetables', growing_season: ['rabi'], min_temperature: 10, max_temperature: 25, water_requirement: 'medium', soil_ph_min: 5.5, soil_ph_max: 6.5, growth_duration_days: 90 },
    { id: 'crop-onion', name: 'Onion', scientific_name: 'Allium cepa', category: 'vegetables', growing_season: ['rabi'], min_temperature: 10, max_temperature: 30, water_requirement: 'medium', soil_ph_min: 6.0, soil_ph_max: 7.5, growth_duration_days: 120 },
  ].map((crop) => ({ ...crop, image_url: null, created_at: new Date().toISOString() }));

  return { ...data, crops };
}

export function parseJsonField(value, fallback = null) {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function stringifyJsonField(value) {
  if (value == null) return null;
  return value;
}

export function newId() {
  return randomUUID();
}

export function now() {
  return new Date().toISOString();
}

const db = {
  read() {
    return loadDb();
  },
  write(data) {
    saveDb(data);
  },
  update(mutator) {
    const data = loadDb();
    const result = mutator(data);
    saveDb(data);
    return result;
  },
};

export default db;
