const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

function mapUser(r){
  return { UserID:r.UserID, UserName:r.UserName, Email:r.Email, FirstName:r.FirstName, LastName:r.LastName, IsActive:r.IsActive, LastLogin:r.LastLogin }; }

router.get('/', auth, async (req,res)=>{
  try { const { rows } = await pool.query('SELECT "UserID","UserName","Email","FirstName","LastName","IsActive","LastLogin" FROM "user" ORDER BY "UserID" DESC LIMIT 500');
    res.json({ success:true, data: rows.map(mapUser) }); } catch(e){ console.error('users list error', e); res.status(500).json({ success:false, error:'Error fetching users'}); }
});

router.get('/profile', auth, async (req,res)=>{
  // profile by token email or query userId
  const userId = req.query.userId;
  try {
    let rows;
    if(userId){ rows = (await pool.query('SELECT * FROM "user" WHERE "UserID"=$1',[userId])).rows; }
    else if(req.user?.email){ rows = (await pool.query('SELECT * FROM "user" WHERE "Email"=$1',[req.user.email])).rows; }
    else { return res.status(400).json({ success:false, error:'userId or auth email required'}); }
    res.json({ success:true, data: rows[0]? mapUser(rows[0]) : null });
  } catch(e){ console.error('user profile error', e); res.status(500).json({ success:false, error:'Error fetching profile'}); }
});

router.post('/', auth, async (req,res)=>{
  const { UserName, Email, FirstName, LastName } = req.body || {};
  if(!UserName || !Email) return res.status(400).json({ success:false, error:'UserName and Email required'});
  try { const { rows } = await pool.query('INSERT INTO "user" ("UserName","Email","FirstName","LastName","PasswordHash") VALUES ($1,$2,$3,$4,$5) RETURNING "UserID","UserName","Email","FirstName","LastName","IsActive"',[UserName, Email, FirstName||null, LastName||null, 'placeholder']);
    res.status(201).json({ success:true, data: mapUser(rows[0]) }); } catch(e){ console.error('user create error', e); res.status(500).json({ success:false, error:'Insert failed'}); }
});

router.put('/:id', auth, async (req,res)=>{
  const UserID = req.params.id;
  const { FirstName, LastName, IsActive } = req.body || {};
  try { const { rows } = await pool.query('UPDATE "user" SET "FirstName"=COALESCE($2,"FirstName"), "LastName"=COALESCE($3,"LastName"), "IsActive"=COALESCE($4,"IsActive"), "UpdatedAt"=now() WHERE "UserID"=$1 RETURNING *',[UserID, FirstName, LastName, IsActive]);
    res.json({ success:true, data: rows[0]? mapUser(rows[0]) : null }); } catch(e){ console.error('user update error', e); res.status(500).json({ success:false, error:'Update failed'}); }
});

router.post('/change-password', auth, async (req,res)=>{
  // Placeholder: requires integration with Supabase Auth for real password changes.
  return res.status(501).json({ success:false, error:'Password change not implemented. Use Supabase Auth.' });
});

router.delete('/:id', auth, async (req,res)=>{
  const UserID = req.params.id; if(!UserID) return res.status(400).json({ success:false, error:'UserID required'});
  try { await pool.query('DELETE FROM "user" WHERE "UserID"=$1',[UserID]); res.json({ success:true }); } catch(e){ console.error('user delete error', e); res.status(500).json({ success:false, error:'Delete failed'}); }
});

module.exports = router;
