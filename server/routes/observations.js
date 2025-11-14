const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

// GET /api/observations
router.get('/', auth, async (req,res)=>{
  try {
    const { rows } = await pool.query('SELECT "ObservationID","StudentID","EmpID","ObservationDate","Category","Observation","IsPositive","RequiresAction","IsPrivate" FROM student_observation ORDER BY "ObservationDate" DESC, "ObservationID" DESC LIMIT 500');
    res.json({ success:true, data: rows });
  } catch(e){ console.error('observations list error', e); res.status(500).json({ success:false, error:'Error fetching observations'}); }
});

// GET /api/observations/by-student/:studentId
router.get('/by-student/:studentId', auth, async (req,res)=>{
  const studentId = req.params.studentId; if(!studentId) return res.status(400).json({ success:false, error:'studentId required'});
  try { const { rows } = await pool.query('SELECT * FROM student_observation WHERE "StudentID"=$1 ORDER BY "ObservationDate" DESC',[studentId]);
    res.json({ success:true, data: rows });
  } catch(e){ console.error('observations get_by_student error', e); res.status(500).json({ success:false, error:'Error fetching observations'}); }
});

// POST /api/observations
router.post('/', auth, async (req,res)=>{
  const { StudentID, EmpID, ObservationDate, Category, Observation, IsPositive, RequiresAction, IsPrivate } = req.body || {};
  if(!StudentID || !EmpID || !ObservationDate || !Observation) return res.status(400).json({ success:false, error:'Required fields missing'});
  try { const { rows } = await pool.query('INSERT INTO student_observation ("StudentID","EmpID","ObservationDate","Category","Observation","IsPositive","RequiresAction","IsPrivate") VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',[
    StudentID, EmpID, ObservationDate, Category||null, Observation, IsPositive||null, RequiresAction||0, IsPrivate||0
  ]); res.status(201).json({ success:true, data: rows[0] }); }
  catch(e){ console.error('observation create error', e); res.status(500).json({ success:false, error:'Insert failed'}); }
});

// PUT /api/observations/:id
router.put('/:id', auth, async (req,res)=>{
  const ObservationID = req.params.id; if(!ObservationID) return res.status(400).json({ success:false, error:'ObservationID required'});
  const { Category, Observation, IsPositive, RequiresAction, ActionTaken, IsPrivate } = req.body;
  try { const { rows } = await pool.query('UPDATE student_observation SET "Category"=COALESCE($2,"Category"), "Observation"=COALESCE($3,"Observation"), "IsPositive"=$4, "RequiresAction"=$5, "ActionTaken"=$6, "IsPrivate"=$7, "UpdatedAt"=now() WHERE "ObservationID"=$1 RETURNING *',[
    ObservationID, Category, Observation, IsPositive||null, RequiresAction||0, ActionTaken||null, IsPrivate||0
  ]); res.json({ success:true, data: rows[0] }); }
  catch(e){ console.error('observation update error', e); res.status(500).json({ success:false, error:'Update failed'}); }
});

// DELETE /api/observations/:id
router.delete('/:id', auth, async (req,res)=>{
  const ObservationID = req.params.id; if(!ObservationID) return res.status(400).json({ success:false, error:'ObservationID required'});
  try { await pool.query('DELETE FROM student_observation WHERE "ObservationID"=$1',[ObservationID]); res.json({ success:true }); }
  catch(e){ console.error('observation delete error', e); res.status(500).json({ success:false, error:'Delete failed'}); }
});

module.exports = router;
