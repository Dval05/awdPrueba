require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', date: new Date().toISOString() });
});

// Avoid favicon 404 noise
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Mount routes (students will be added later)
app.use('/api/students', require('./routes/students'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/grades', require('./routes/grades'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/guardians', require('./routes/guardians'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/observations', require('./routes/observations'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/users', require('./routes/users'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/permissions', require('./routes/permissions'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/invoices', require('./routes/invoices'));

// 404 fallback for API
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
