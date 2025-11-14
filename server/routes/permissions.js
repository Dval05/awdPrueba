const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

router.get('/', auth, async (req,res)=>{
  try { const { rows } = await pool.query('SELECT "PermissionID","PermissionName","Module","Action","Link","Icon" FROM permission ORDER BY "Module","Action"');
    res.json({ success:true, data: rows }); } catch(e){ console.error('permissions list error', e); res.status(500).json({ success:false, error:'Error fetching permissions'}); }
});

router.post('/assign', auth, async (req,res)=>{
  const { RoleID, PermissionID } = req.body || {}; if(!RoleID || !PermissionID) return res.status(400).json({ success:false, error:'RoleID and PermissionID required'});
  try { const { rows } = await pool.query('INSERT INTO role_permission ("RoleID","PermissionID") VALUES ($1,$2) ON CONFLICT ON CONSTRAINT unique_role_permission DO NOTHING RETURNING "RolePermissionID"',[RoleID, PermissionID]);
    res.json({ success:true, data: rows[0]||null }); } catch(e){ console.error('assign_to_role error', e); res.status(500).json({ success:false, error:'Assign failed'}); }
});

router.post('/remove', auth, async (req,res)=>{
  const { RoleID, PermissionID } = req.body || {}; if(!RoleID || !PermissionID) return res.status(400).json({ success:false, error:'RoleID and PermissionID required'});
  try { await pool.query('DELETE FROM role_permission WHERE "RoleID"=$1 AND "PermissionID"=$2',[RoleID, PermissionID]); res.json({ success:true }); } catch(e){ console.error('remove_from_role error', e); res.status(500).json({ success:false, error:'Remove failed'}); }
});

module.exports = router;
