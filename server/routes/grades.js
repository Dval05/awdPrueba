const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

// GET /api/grades
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT "GradeID","GradeName","Description","AgeRangeMin","AgeRangeMax","MaxCapacity","IsActive" FROM grade ORDER BY "GradeName"');
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('grades get_all error', e);
    res.status(500).json({ success: false, error: 'Error fetching grades' });
  }
});

module.exports = router;
