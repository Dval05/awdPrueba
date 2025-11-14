const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

// GET /api/employees
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT "EmpID","FirstName","LastName","Position","Email","PhoneNumber","IsActive" FROM employee ORDER BY "LastName"');
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('employees get_all error', e);
    res.status(500).json({ success: false, error: 'Error fetching employees' });
  }
});

// GET /api/employees/:empId/tasks
router.get('/:empId/tasks', auth, async (req, res) => {
  const empId = req.params.empId;
  if (!empId) return res.status(400).json({ success: false, error: 'empId required' });
  try {
    const { rows } = await pool.query('SELECT "TaskID","EmpID","TaskName","Description","DueDate","Status","Priority","CompletedDate" FROM employee_task WHERE "EmpID"=$1 ORDER BY COALESCE("DueDate", CURRENT_DATE)', [empId]);
    res.json({ success: true, data: rows });
  } catch (e) {
    console.error('employees get_tasks error', e);
    res.status(500).json({ success: false, error: 'Error fetching tasks' });
  }
});

module.exports = router;
