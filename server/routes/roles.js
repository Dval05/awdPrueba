const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

router.get('/', auth, async (req,res)=>{
  try { const { rows } = await pool.query('SELECT "RoleID","RoleName","Description","IsActive" FROM role ORDER BY "RoleName"');
    res.json({ success:true, data: rows }); } catch(e){ console.error('roles list error', e); res.status(500).json({ success:false, error:'Error fetching roles'}); }
});

router.post('/', auth, async (req,res)=>{
  const { RoleName, Description } = req.body || {}; if(!RoleName) return res.status(400).json({ success:false, error:'RoleName required'});
  try { const { rows } = await pool.query('INSERT INTO role ("RoleName","Description") VALUES ($1,$2) RETURNING "RoleID","RoleName","Description","IsActive"',[RoleName, Description||null]);
    res.status(201).json({ success:true, data: rows[0] }); } catch(e){ console.error('role create error', e); res.status(500).json({ success:false, error:'Insert failed'}); }
});

router.put('/:id', auth, async (req,res)=>{
  const RoleID = req.params.id; const { RoleName, Description, IsActive } = req.body || {}; if(!RoleID) return res.status(400).json({ success:false, error:'RoleID required'});
  try { const { rows } = await pool.query('UPDATE role SET "RoleName"=COALESCE($2,"RoleName"), "Description"=$3, "IsActive"=COALESCE($4,"IsActive"), "UpdatedAt"=now() WHERE "RoleID"=$1 RETURNING *',[RoleID, RoleName, Description||null, IsActive]);
    res.json({ success:true, data: rows[0] }); } catch(e){ console.error('role update error', e); res.status(500).json({ success:false, error:'Update failed'}); }
});

router.delete('/:id', auth, async (req,res)=>{
  const RoleID = req.params.id; if(!RoleID) return res.status(400).json({ success:false, error:'RoleID required'});
  try { await pool.query('DELETE FROM role WHERE "RoleID"=$1',[RoleID]); res.json({ success:true }); } catch(e){ console.error('role delete error', e); res.status(500).json({ success:false, error:'Delete failed'}); }
});

router.get('/:roleId/permissions', auth, async (req,res)=>{
  const roleId = req.params.roleId; if(!roleId) return res.status(400).json({ success:false, error:'roleId required'});
  try { const { rows } = await pool.query(`SELECT rp."RolePermissionID", p."PermissionID", p."PermissionName", p."Module", p."Action" FROM role_permission rp JOIN permission p ON p."PermissionID"=rp."PermissionID" WHERE rp."RoleID"=$1 ORDER BY p."Module", p."Action"`,[roleId]);
    res.json({ success:true, data: rows }); } catch(e){ console.error('role get_permissions error', e); res.status(500).json({ success:false, error:'Error fetching permissions'}); }
});

router.post('/assign', auth, async (req,res)=>{
  const { UserID, RoleID, AssignedBy } = req.body || {}; if(!UserID || !RoleID) return res.status(400).json({ success:false, error:'UserID and RoleID required'});
  try { const { rows } = await pool.query('INSERT INTO user_role ("UserID","RoleID","AssignedBy") VALUES ($1,$2,$3) ON CONFLICT ON CONSTRAINT unique_user_role DO NOTHING RETURNING "UserRoleID"',[UserID, RoleID, AssignedBy||null]);
    res.json({ success:true, data: rows[0]||null }); } catch(e){ console.error('assign_to_user error', e); res.status(500).json({ success:false, error:'Assign failed'}); }
});

module.exports = router;
