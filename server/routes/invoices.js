const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

router.get('/', auth, async (req,res)=>{
  try { const { rows } = await pool.query('SELECT "InvoiceID","InvoiceNumber","InvoiceType","ReferenceID","IssueDate","DueDate","FinalAmount","Status" FROM invoice ORDER BY "IssueDate" DESC, "InvoiceID" DESC LIMIT 500');
    res.json({ success:true, data: rows }); } catch(e){ console.error('invoices list error', e); res.status(500).json({ success:false, error:'Error fetching invoices'}); }
});

router.get('/:id', auth, async (req,res)=>{
  const id = req.params.id; if(!id) return res.status(400).json({ success:false, error:'id required'});
  try { const { rows } = await pool.query('SELECT * FROM invoice WHERE "InvoiceID"=$1',[id]);
    res.json({ success:true, data: rows[0]||null }); } catch(e){ console.error('invoice get_by_id error', e); res.status(500).json({ success:false, error:'Error fetching invoice'}); }
});

router.get('/by-reference/:referenceId', auth, async (req,res)=>{
  const refId = req.params.referenceId; if(!refId) return res.status(400).json({ success:false, error:'referenceId required'});
  try { const { rows } = await pool.query('SELECT * FROM invoice WHERE "ReferenceID"=$1 ORDER BY "IssueDate" DESC',[refId]);
    res.json({ success:true, data: rows }); } catch(e){ console.error('invoice by_reference error', e); res.status(500).json({ success:false, error:'Error fetching invoices'}); }
});

module.exports = router;
