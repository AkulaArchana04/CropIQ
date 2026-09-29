import { Router } from 'express';
import db, { newId, now } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

function formatDetection(row) {
  const treatments = row.treatment_recommendations || [];
  return {
    ...row,
    treatment_recommendations: treatments,
    disease_name: row.detected_disease,
    treatment_suggestion: treatments.join(', '),
  };
}

router.get('/', authMiddleware, (req, res) => {
  const limit = parseInt(req.query.limit || '10', 10);
  const data = db.read();
  const rows = data.disease_detections
    .filter((d) => d.user_id === req.user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
  res.json(rows.map(formatDetection));
});

router.post('/', authMiddleware, (req, res) => {
  const {
    crop_name,
    image_url,
    detected_disease,
    confidence_score,
    treatment_recommendations,
    severity,
  } = req.body;

  const row = {
    id: newId(),
    user_id: req.user.id,
    crop_name: crop_name || 'Analyzed Crop',
    image_url: image_url ?? null,
    detected_disease: detected_disease ?? null,
    confidence_score: confidence_score ?? null,
    treatment_recommendations: treatment_recommendations || [],
    severity: severity ?? null,
    created_at: now(),
  };

  const data = db.read();
  data.disease_detections.push(row);
  db.write(data);

  res.status(201).json(formatDetection(row));
});

export default router;
