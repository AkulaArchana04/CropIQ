import { Router } from 'express';
import db, { newId, now } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

function formatProfile(row) {
  if (!row) return null;
  return {
    ...row,
    primary_crops: row.primary_crops || [],
  };
}

router.get('/me', authMiddleware, (req, res) => {
  const data = db.read();
  const profile = data.profiles.find((p) => p.user_id === req.user.id);
  res.json(formatProfile(profile));
});

router.put('/me', authMiddleware, (req, res) => {
  const { full_name, phone, location, farm_size_hectares, primary_crops } = req.body;
  const data = db.read();
  const index = data.profiles.findIndex((p) => p.user_id === req.user.id);

  if (index >= 0) {
    const existing = data.profiles[index];
    data.profiles[index] = {
      ...existing,
      full_name: full_name ?? existing.full_name,
      phone: phone ?? existing.phone,
      location: location ?? existing.location,
      farm_size_hectares: farm_size_hectares ?? existing.farm_size_hectares,
      primary_crops: primary_crops ?? existing.primary_crops,
      updated_at: now(),
    };
  } else {
    data.profiles.push({
      id: newId(),
      user_id: req.user.id,
      full_name: full_name || null,
      phone: phone || null,
      location: location || null,
      farm_size_hectares: farm_size_hectares ?? null,
      primary_crops: primary_crops || [],
      created_at: now(),
      updated_at: now(),
    });
  }

  db.write(data);
  const profile = data.profiles.find((p) => p.user_id === req.user.id);
  res.json(formatProfile(profile));
});

router.get('/stats', authMiddleware, (req, res) => {
  const data = db.read();
  res.json({
    recommendations: data.crop_recommendations.filter((r) => r.user_id === req.user.id).length,
    scans: data.disease_detections.filter((d) => d.user_id === req.user.id).length,
  });
});

export default router;
