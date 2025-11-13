const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const auth = require('../middleware/auth');

function ok(res, payload) { res.json({ success: true, ...payload }); }
function fail(res, msg) { res.json({ success: false, message: msg }); }

router.get('/total_students', auth, async (req, res) => {
  if (!pool) return ok(res, { total: 0 });
  try {
    const q = await pool.query('select count(1) as total from students');
    ok(res, { total: Number(q.rows[0]?.total || 0) });
  } catch (e) {
    console.warn('dashboard total_students fallback:', e.message);
    ok(res, { total: 0 });
  }
});

router.get('/total_teachers', auth, async (req, res) => {
  if (!pool) return ok(res, { total: 0 });
  try {
    const q = await pool.query("select count(1) as total from employees where role = 'Teacher'");
    ok(res, { total: Number(q.rows[0]?.total || 0) });
  } catch (e) {
    ok(res, { total: 0 });
  }
});

router.get('/today_attendance', auth, async (req, res) => {
  if (!pool) return ok(res, { percent: 0 });
  try {
    const q = await pool.query("select coalesce(avg(case when status='Present' then 1 else 0 end)*100,0) as pct from attendance where date = current_date");
    ok(res, { percent: Math.round(Number(q.rows[0]?.pct || 0)) });
  } catch (e) {
    ok(res, { percent: 0 });
  }
});

router.get('/monthly_revenue', auth, async (req, res) => {
  if (!pool) return ok(res, { revenue: 0 });
  try {
    const q = await pool.query("select coalesce(sum(amount),0) as revenue from payments where date_trunc('month', paid_at) = date_trunc('month', now())");
    ok(res, { revenue: Number(q.rows[0]?.revenue || 0) });
  } catch (e) {
    ok(res, { revenue: 0 });
  }
});

router.get('/recent_activities', auth, async (req, res) => {
  if (!pool) return ok(res, { data: [] });
  try {
    const q = await pool.query('select id, name as "Name", category as "Category", scheduled_date as "ScheduledDate", status as "Status" from activities order by scheduled_date desc limit 10');
    ok(res, { data: q.rows });
  } catch (e) {
    ok(res, { data: [] });
  }
});

router.get('/pending_payments', auth, async (req, res) => {
  if (!pool) return ok(res, { data: [] });
  try {
    const q = await pool.query(`
      select s.first_name as "FirstName", s.last_name as "LastName", i.total_amount as "TotalAmount", i.due_date as "DueDate"
      from invoices i
      join students s on s.id = i.student_id
      where i.status = 'Pending'
      order by i.due_date asc
      limit 10`);
    ok(res, { data: q.rows });
  } catch (e) {
    ok(res, { data: [] });
  }
});

router.get('/upcoming_activities', auth, async (req, res) => {
  if (!pool) return ok(res, { data: [] });
  try {
    const q = await pool.query(`
      select name as "Name", scheduled_date as "ScheduledDate", status as "Status"
      from activities
      where scheduled_date >= current_date
      order by scheduled_date asc
      limit 10`);
    ok(res, { data: q.rows });
  } catch (e) {
    ok(res, { data: [] });
  }
});

router.get('/attendance_week', auth, async (req, res) => {
  if (!pool) return ok(res, { labels: [], data: [] });
  try {
    const q = await pool.query(`
      with days as (
        select generate_series(current_date - interval '6 days', current_date, interval '1 day') as d
      )
      select to_char(d,'Dy') as label,
             coalesce(avg(case when a.status='Present' then 1 else 0 end)*100,0) as pct
      from days left join attendance a on a.date = d
      group by d
      order by d`);
    ok(res, { labels: q.rows.map(r => r.label), data: q.rows.map(r => Math.round(Number(r.pct||0))) });
  } catch (e) {
    ok(res, { labels: [], data: [] });
  }
});

module.exports = router;
