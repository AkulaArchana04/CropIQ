import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  const data = db.read();
  const crops = [...data.crops].sort((a, b) => a.name.localeCompare(b.name));
  res.json(crops);
});

export default router;
