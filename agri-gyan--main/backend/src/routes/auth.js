import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db, { newId, now } from '../db.js';
import { authMiddleware, signToken } from '../middleware/auth.js';

const router = Router();

function formatUser(user) {
  const data = db.read();
  const profile = data.profiles.find((p) => p.user_id === user.id);
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    user_metadata: {
      full_name: profile?.full_name || null,
    },
  };
}

router.post('/signup', (req, res) => {
  const { email, password, full_name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const normalizedEmail = email.toLowerCase();
  const data = db.read();

  if (data.users.some((u) => u.email === normalizedEmail)) {
    return res.status(409).json({ error: 'User already registered with this email' });
  }

  const userId = newId();
  const user = {
    id: userId,
    email: normalizedEmail,
    password_hash: bcrypt.hashSync(password, 10),
    created_at: now(),
  };

  data.users.push(user);

  if (full_name) {
    data.profiles.push({
      id: newId(),
      user_id: userId,
      full_name,
      phone: null,
      location: null,
      farm_size_hectares: null,
      primary_crops: [],
      created_at: now(),
      updated_at: now(),
    });
  }

  db.write(data);

  const token = signToken(user);
  res.status(201).json({
    user: formatUser(user),
    session: { access_token: token, user: formatUser(user) },
  });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const data = db.read();
  const user = data.users.find((u) => u.email === email.toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = signToken(user);
  res.json({
    user: formatUser(user),
    session: { access_token: token, user: formatUser(user) },
  });
});

router.get('/session', authMiddleware, (req, res) => {
  const data = db.read();
  const user = data.users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const token = signToken(user);
  res.json({
    session: { access_token: token, user: formatUser(user) },
  });
});

router.post('/signout', (_req, res) => {
  res.json({ message: 'Signed out successfully' });
});

export default router;
