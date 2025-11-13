const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const auth = require('../middleware/auth');

// List students (protected)
router.get('/', auth, async (req, res) => {
  if (!pool) return res.json({ data: [], warning: 'DB not configured' });
  try {
    const result = await pool.query('SELECT id, first_name, last_name, email FROM students ORDER BY id DESC LIMIT 200');
    res.json({ data: result.rows });
  } catch (e) {
    console.error('DB error', e);
    res.status(500).json({ error: 'DB query failed' });
  }
});

// Alias to support legacy frontend calls: /students/get_all.php
router.get('/get_all.php', auth, async (req, res) => {
  if (!pool) return res.json({ success: true, data: [] });
  try {
    const result = await pool.query('SELECT id, first_name, last_name, email FROM students ORDER BY id DESC LIMIT 200');
    res.json({ success: true, data: result.rows });
  } catch (e) {
    res.json({ success: false, message: 'DB query failed' });
  }
});

// Create student (protected)
router.post('/', auth, async (req, res) => {
  if (!pool) return res.status(500).json({ error: 'DB not configured' });
  const { first_name, last_name, email } = req.body || {};
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO students (first_name, last_name, email) VALUES ($1, $2, $3) RETURNING id, first_name, last_name, email',
      [first_name, last_name, email || null]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (e) {
    console.error('DB error', e);
    res.status(500).json({ error: 'Insert failed' });
  }
});

module.exports = router;
