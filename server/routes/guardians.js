const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

// GET /api/guardians
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT "GuardianID","FirstName","LastName","Relationship","PhoneNumber","Email","IsEmergencyContact","IsAuthorizedPickup" FROM guardian ORDER BY "LastName"');
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('guardians get_all error', e);
    res.status(500).json({ success: false, error: 'Error fetching guardians' });
  }
});

// GET /api/guardians/:id
router.get('/:id', auth, async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ success: false, error: 'id required' });
  try {
    const { rows } = await pool.query('SELECT * FROM guardian WHERE "GuardianID"=$1', [id]);
    res.json({ success: true, data: rows[0] || null });
  } catch (e) {
    console.error('guardian get_by_id error', e);
    res.status(500).json({ success: false, error: 'Error fetching guardian' });
  }
});

// GET /api/guardians/:guardianId/students
router.get('/:guardianId/students', auth, async (req, res) => {
  const guardianId = req.params.guardianId;
  if (!guardianId) return res.status(400).json({ success: false, error: 'guardianId required' });
  try {
    const { rows } = await pool.query(`SELECT s."StudentID", s."FirstName", s."LastName", g."GuardianID" FROM student s
      JOIN student_guardian sg ON sg."StudentID"=s."StudentID"
      JOIN guardian g ON g."GuardianID"=sg."GuardianID" WHERE g."GuardianID"=$1 ORDER BY s."LastName"`, [guardianId]);
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('students_by_guardian error', e);
    res.status(500).json({ success: false, error: 'Error fetching students' });
  }
});

// GET /api/guardians/by-student/:studentId
router.get('/by-student/:studentId', auth, async (req, res) => {
  const studentId = req.params.studentId;
  if (!studentId) return res.status(400).json({ success: false, error: 'studentId required' });
  try {
    const { rows } = await pool.query(`SELECT g.* FROM guardian g
      JOIN student_guardian sg ON sg."GuardianID"=g."GuardianID" WHERE sg."StudentID"=$1 ORDER BY g."LastName"`, [studentId]);
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('get_by_student error', e);
    res.status(500).json({ success: false, error: 'Error fetching guardians' });
  }
});

module.exports = router;
