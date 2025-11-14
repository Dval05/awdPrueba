const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const auth = require('../middleware/auth');

// Helper: map db row to frontend shape
function mapStudent(r) {
  return {
    StudentID: r.StudentID,
    FirstName: r.FirstName,
    LastName: r.LastName,
    Email: r.Email,
    GradeID: r.GradeID,
    IsActive: r.IsActive,
  };
}

// GET /api/students
router.get('/', auth, async (req, res) => {
  if (!pool) return res.json({ success: true, data: [] });
  try {
    const { rows } = await pool.query('SELECT "StudentID","FirstName","LastName","Email","GradeID","IsActive" FROM student ORDER BY "StudentID" DESC LIMIT 500');
    res.json({ success: true, data: rows.map(mapStudent) });
  } catch (e) {
    console.error('students list error', e);
    res.status(500).json({ success: false, error: 'Error fetching students' });
  }
});

// GET /api/students/:id
router.get('/:id', auth, async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ success: false, error: 'id required' });
  try {
    const { rows } = await pool.query('SELECT * FROM student WHERE "StudentID"=$1', [id]);
    res.json({ success: true, data: rows[0] ? mapStudent(rows[0]) : null });
  } catch (e) {
    console.error('student get_by_id error', e);
    res.status(500).json({ success: false, error: 'Error fetching student' });
  }
});

// GET /api/students/by-grade/:gradeId
router.get('/by-grade/:gradeId', auth, async (req, res) => {
  const gradeId = req.params.gradeId;
  if (!gradeId) return res.status(400).json({ success: false, error: 'gradeId required' });
  try {
    const { rows } = await pool.query('SELECT "StudentID","FirstName","LastName","Email","GradeID","IsActive" FROM student WHERE "GradeID"=$1 ORDER BY "LastName"', [gradeId]);
    res.json({ success: true, data: rows.map(mapStudent) });
  } catch (e) {
    console.error('students get_by_grade error', e);
    res.status(500).json({ success: false, error: 'Error fetching students' });
  }
});

// POST /api/students
router.post('/', auth, async (req, res) => {
  const { FirstName, LastName, Email, GradeID } = req.body || {};
  if (!FirstName || !LastName) return res.status(400).json({ success: false, error: 'FirstName and LastName required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO student ("FirstName","LastName","Email","GradeID") VALUES ($1,$2,$3,$4) RETURNING "StudentID","FirstName","LastName","Email","GradeID","IsActive"',
      [FirstName, LastName, Email || null, GradeID || null]
    );
    res.status(201).json({ success: true, data: mapStudent(rows[0]) });
  } catch (e) {
    console.error('student create error', e);
    res.status(500).json({ success: false, error: 'Insert failed' });
  }
});

// PUT /api/students/:id
router.put('/:id', auth, async (req, res) => {
  const StudentID = req.params.id;
  const { FirstName, LastName, Email, GradeID, IsActive } = req.body || {};
  if (!StudentID) return res.status(400).json({ success: false, error: 'StudentID required' });
  try {
    const { rows } = await pool.query(
      'UPDATE student SET "FirstName"=COALESCE($2,"FirstName"), "LastName"=COALESCE($3,"LastName"), "Email"=$4, "GradeID"=$5, "IsActive"=COALESCE($6,"IsActive"), "UpdatedAt"=now() WHERE "StudentID"=$1 RETURNING *',
      [StudentID, FirstName, LastName, Email || null, GradeID || null, IsActive]
    );
    res.json({ success: true, data: rows[0] ? mapStudent(rows[0]) : null });
  } catch (e) {
    console.error('student update error', e);
    res.status(500).json({ success: false, error: 'Update failed' });
  }
});

// DELETE /api/students/:id
router.delete('/:id', auth, async (req, res) => {
  const StudentID = req.params.id;
  if (!StudentID) return res.status(400).json({ success: false, error: 'StudentID required' });
  try {
    await pool.query('DELETE FROM student WHERE "StudentID"=$1', [StudentID]);
    res.json({ success: true });
  } catch (e) {
    console.error('student delete error', e);
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
});

module.exports = router;
