const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

// GET /api/attendance
router.get('/', auth, async (req,res)=>{
  try {
    const { rows } = await pool.query(`SELECT a."AttendanceID", a."StudentID", s."FirstName", s."LastName", a."Date", a."Status", a."CheckInTime", a."CheckOutTime", a."IsLate", a."LateMinutes" FROM attendance a JOIN student s ON s."StudentID"=a."StudentID" ORDER BY a."Date" DESC, a."AttendanceID" DESC LIMIT 500`);
    res.json({ success:true, data: rows });
  } catch(e){ console.error('attendance list error', e); res.status(500).json({ success:false, error:'Error fetching attendance'}); }
});

// GET /api/attendance/by-date?date=YYYY-MM-DD
router.get('/by-date', auth, async (req,res)=>{
  const date = req.query.date; if(!date) return res.status(400).json({ success:false, error:'date required'});
  try { const { rows } = await pool.query('SELECT * FROM attendance WHERE "Date"=$1 ORDER BY "AttendanceID" DESC',[date]);
    res.json({ success:true, data: rows });
  } catch(e){ console.error('attendance get_by_date error', e); res.status(500).json({ success:false, error:'Error fetching attendance'}); }
});

// GET /api/attendance/students?gradeId=&date=
router.get('/students', auth, async (req,res)=>{
  const { gradeId, date } = req.query;
  if(!gradeId) return res.status(400).json({ success:false, error:'gradeId required'});
  try {
    const { rows } = await pool.query('SELECT "StudentID","FirstName","LastName" FROM student WHERE "GradeID"=$1 AND "IsActive"=1 ORDER BY "LastName"',[gradeId]);
    // Optionally include existing attendance for date
    let attendance = [];
    if(date){
      const a = await pool.query('SELECT * FROM attendance WHERE "Date"=$1 AND "StudentID" IN (SELECT "StudentID" FROM student WHERE "GradeID"=$2)',[date, gradeId]);
      attendance = a.rows;
    }
    res.json({ success:true, data:{ students:rows, attendance } });
  } catch(e){ console.error('attendance students error', e); res.status(500).json({ success:false, error:'Error fetching students'}); }
});

// POST /api/attendance/save  bulk save
router.post('/save', auth, async (req,res)=>{
  const entries = req.body?.entries; if(!Array.isArray(entries)) return res.status(400).json({ success:false, error:'entries array required'});
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for(const e of entries){
      const { StudentID, Date, Status, CheckInTime, CheckOutTime, Notes } = e;
      if(!StudentID || !Date) continue;
      await client.query(`INSERT INTO attendance ("StudentID","Date","Status","CheckInTime","CheckOutTime","Notes") VALUES ($1,$2,$3,$4,$5,$6)
        ON CONFLICT ("StudentID","Date") DO UPDATE SET "Status"=EXCLUDED."Status", "CheckInTime"=EXCLUDED."CheckInTime", "CheckOutTime"=EXCLUDED."CheckOutTime", "Notes"=EXCLUDED."Notes", "UpdatedAt"=now()`,
        [StudentID, Date, Status||'Present', CheckInTime||null, CheckOutTime||null, Notes||null]);
    }
    await client.query('COMMIT');
    res.json({ success:true });
  } catch(e){ await client.query('ROLLBACK'); console.error('attendance save error', e); res.status(500).json({ success:false, error:'Save failed'}); }
  finally { client.release(); }
});

module.exports = router;
