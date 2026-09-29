import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import cropRoutes from './routes/crops.js';
import recommendationRoutes from './routes/recommendations.js';
import diseaseRoutes from './routes/disease-detections.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'agri-gyan-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/disease-detections', diseaseRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`AgriGyan backend running on http://localhost:${PORT}`);
});
