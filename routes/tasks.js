const express = require('express');
const db = require('../database');
const requireAuth = require('../middleware/auth');
const router = express.Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const tasks = db.prepare('SELECT id, title, completed FROM tasks WHERE user_id = ? ORDER BY id DESC').all(req.session.userId);
  res.json(tasks);
});

router.post('/', (req, res) => {
  const title = String(req.body.title || '').trim();
  if (!title) return res.status(400).json({ error: 'Task title is required' });
  const result = db.prepare('INSERT INTO tasks (user_id, title, completed) VALUES (?, ?, 0)').run(req.session.userId, title);
  res.status(201).json({ id: Number(result.lastInsertRowid), title, completed: 0 });
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = db.prepare('SELECT id FROM tasks WHERE id = ? AND user_id = ?').get(id, req.session.userId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const completed = req.body.completed ? 1 : 0;
  db.prepare('UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?').run(completed, id, req.session.userId);
  res.json({ id, completed });
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(Number(req.params.id), req.session.userId);
  if (!result.changes) return res.status(404).json({ error: 'Task not found' });
  res.json({ ok: true });
});
module.exports = router;
