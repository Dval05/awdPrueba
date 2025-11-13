const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn('DATABASE_URL not set. DB features will be disabled.');
}

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Required for Supabase/Render
      },
    })
  : null;

module.exports = {
  pool,
};
