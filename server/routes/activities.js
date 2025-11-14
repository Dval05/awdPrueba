const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

function mapActivity(r){
  return {
    ActivityID: r.ActivityID,
    Name: r.Name,
    Description: r.Description,
    GradeID: r.GradeID,
    EmpID: r.EmpID,
    ScheduledDate: r.ScheduledDate,
    StartTime: r.StartTime,
    EndTime: r.EndTime,
    Category: r.Category,
    Status: r.Status,
    CreatedBy: r.CreatedBy
  };
}

// GET /api/activities
router.get('/', auth, async (req,res)=>{
  try {
    const { rows } = await pool.query('SELECT "ActivityID","Name","Description","GradeID","EmpID","ScheduledDate","StartTime","EndTime","Category","Status","CreatedBy" FROM activity ORDER BY COALESCE("ScheduledDate", CURRENT_DATE) DESC, "ActivityID" DESC LIMIT 500');
    res.json({ success:true, data: rows.map(mapActivity) });
  } catch(e){
    console.error('activities list error', e); res.status(500).json({ success:false, error:'Error fetching activities'});
  }
});

// GET /api/activities/:id
router.get('/:id', auth, async (req,res)=>{
  const id = req.params.id; if(!id) return res.status(400).json({success:false,error:'id required'});
  try { const { rows } = await pool.query('SELECT * FROM activity WHERE "ActivityID"=$1',[id]);
    res.json({ success:true, data: rows[0]? mapActivity(rows[0]) : null });
  } catch(e){ console.error('activity get_by_id error', e); res.status(500).json({ success:false, error:'Error fetching activity'}); }
});

// Media list /api/activities/:id/media
router.get('/:id/media', auth, async (req,res)=>{
  const activityId = req.params.id; if(!activityId) return res.status(400).json({success:false,error:'activityId required'});
  try { const { rows } = await pool.query('SELECT "MediaID","ActivityID","MediaType","FilePath","Caption","UploadedBy","CreatedAt" FROM activity_media WHERE "ActivityID"=$1 ORDER BY "CreatedAt" DESC',[activityId]);
    res.json({ success:true, data: rows });
  } catch(e){ console.error('activity media error', e); res.status(500).json({ success:false, error:'Error fetching media'}); }
});

// POST /api/activities
router.post('/', auth, async (req,res)=>{
  const { Name, Description, GradeID, EmpID, ScheduledDate, StartTime, EndTime, Category, Status } = req.body || {};
  if(!Name) return res.status(400).json({ success:false, error:'Name required'});
  try {
    const { rows } = await pool.query('INSERT INTO activity ("Name","Description","GradeID","EmpID","ScheduledDate","StartTime","EndTime","Category","Status","CreatedBy") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING "ActivityID","Name","Description","GradeID","EmpID","ScheduledDate","StartTime","EndTime","Category","Status","CreatedBy"',[
      Name, Description||null, GradeID||null, EmpID||null, ScheduledDate||null, StartTime||null, EndTime||null, Category||null, Status||'Planned', req.user?.id ? null : null
    ]);
    res.status(201).json({ success:true, data: mapActivity(rows[0]) });
  } catch(e){ console.error('activity create error', e); res.status(500).json({ success:false, error:'Insert failed'}); }
});

// PUT /api/activities/:id
router.put('/:id', auth, async (req,res)=>{
  const ActivityID = req.params.id;
  const { Name, Description, GradeID, EmpID, ScheduledDate, StartTime, EndTime, Category, Status } = req.body || {};
  try {
    const { rows } = await pool.query('UPDATE activity SET "Name"=COALESCE($2,"Name"), "Description"=COALESCE($3,"Description"), "GradeID"=$4, "EmpID"=$5, "ScheduledDate"=$6, "StartTime"=$7, "EndTime"=$8, "Category"=$9, "Status"=COALESCE($10,"Status"), "UpdatedAt"=now() WHERE "ActivityID"=$1 RETURNING *',[
      ActivityID, Name, Description, GradeID||null, EmpID||null, ScheduledDate||null, StartTime||null, EndTime||null, Category||null, Status
    ]);
    res.json({ success:true, data: rows[0]? mapActivity(rows[0]) : null });
  } catch(e){ console.error('activity update error', e); res.status(500).json({ success:false, error:'Update failed'}); }
});

// DELETE /api/activities/:id
router.delete('/:id', auth, async (req,res)=>{
  const ActivityID = req.params.id; if(!ActivityID) return res.status(400).json({ success:false, error:'ActivityID required'});
  try { await pool.query('DELETE FROM activity WHERE "ActivityID"=$1',[ActivityID]); res.json({ success:true }); }
  catch(e){ console.error('activity delete error', e); res.status(500).json({ success:false, error:'Delete failed'}); }
});

module.exports = router;
