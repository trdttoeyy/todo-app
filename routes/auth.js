const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const router = express.Router();

router.post('/register', async (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  if (!username || password.length < 6) return res.status(400).json({ error: 'Username is required and password must be at least 6 characters' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hash);
    req.session.userId = Number(result.lastInsertRowid);
    req.session.username = username;
    res.status(201).json({ username });
  } catch (err) {
    if (String(err.message).includes('UNIQUE')) return res.status(409).json({ error: 'Username already exists' });
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ error: 'Invalid username or password' });
  req.session.userId = user.id;
  req.session.username = user.username;
  res.json({ username: user.username });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => res.json({ username: req.session.username || null }));
module.exports = router;
