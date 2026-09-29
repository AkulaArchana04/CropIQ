import { Router } from 'express';
import db, { newId, now } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

function formatRecommendation(row) {
  return {
    ...row,
    irrigation_available: Boolean(row.irrigation_available),
    recommended_crops: row.recommended_crops || [],
  };
}

router.get('/', authMiddleware, (req, res) => {
  const data = db.read();
  const rows = data.crop_recommendations
    .filter((r) => r.user_id === req.user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(rows.map(formatRecommendation));
});

router.post('/', authMiddleware, (req, res) => {
  const {
    soil_ph,
    soil_type,
    irrigation_available,
    previous_crop,
    recommended_crops,
    location_lat,
    location_lng,
    weather_data,
    market_data,
  } = req.body;

  const row = {
    id: newId(),
    user_id: req.user.id,
    location_lat: location_lat ?? null,
    location_lng: location_lng ?? null,
    soil_ph: soil_ph ?? null,
    soil_type: soil_type ?? null,
    irrigation_available: Boolean(irrigation_available),
    previous_crop: previous_crop ?? null,
    recommended_crops: recommended_crops || [],
    weather_data: weather_data ?? null,
    market_data: market_data ?? null,
    created_at: now(),
  };

  const data = db.read();
  data.crop_recommendations.push(row);
  db.write(data);

  res.status(201).json(formatRecommendation(row));
});

export default router;
