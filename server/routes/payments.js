const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

// Student payments list
router.get('/student', auth, async (req,res)=>{
  try { const { rows } = await pool.query('SELECT "StudentPaymentID","StudentID","ServiceType","TotalAmount","PaidAmount","BalanceRemaining","Status","DueDate","PaymentDate" FROM student_payment ORDER BY "DueDate" DESC, "StudentPaymentID" DESC LIMIT 500');
    res.json({ success:true, data: rows }); } catch(e){ console.error('student payments error', e); res.status(500).json({ success:false, error:'Error fetching student payments'}); }
});

router.get('/student/pending', auth, async (req,res)=>{
  try { const { rows } = await pool.query("SELECT \"StudentPaymentID\",\"StudentID\",\"TotalAmount\",\"PaidAmount\",\"BalanceRemaining\",\"Status\",\"DueDate\" FROM student_payment WHERE \"Status\" IN ('Pending','Partial','Overdue') ORDER BY \"DueDate\" ASC");
    res.json({ success:true, data: rows }); } catch(e){ console.error('student pending error', e); res.status(500).json({ success:false, error:'Error fetching pending payments'}); }
});

router.get('/student/by-student', auth, async (req,res)=>{
  const studentId = req.query.studentId; if(!studentId) return res.status(400).json({ success:false, error:'studentId required'});
  try { const { rows } = await pool.query('SELECT * FROM student_payment WHERE "StudentID"=$1 ORDER BY "DueDate" DESC',[studentId]);
    res.json({ success:true, data: rows }); } catch(e){ console.error('student payments by_student error', e); res.status(500).json({ success:false, error:'Error fetching payments'}); }
});

// Teacher payments list
router.get('/teacher', auth, async (req,res)=>{
  try { const { rows } = await pool.query('SELECT "TeacherPaymentID","EmpID","PaymentPeriod","TotalAmount","Status","PaymentDate" FROM teacher_payment ORDER BY "PaymentDate" DESC, "TeacherPaymentID" DESC LIMIT 500');
    res.json({ success:true, data: rows }); } catch(e){ console.error('teacher payments error', e); res.status(500).json({ success:false, error:'Error fetching teacher payments'}); }
});

module.exports = router;
