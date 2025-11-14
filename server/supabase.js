const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Service role client - use for backend operations that bypass RLS
let supabaseAdmin = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log('✓ Supabase Admin client initialized');
} else {
  console.warn('⚠ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set. Admin features disabled.');
}

// Anon client - use for operations that respect RLS (less common in backend)
let supabaseAnon = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log('✓ Supabase Anon client initialized');
}

module.exports = {
  supabaseAdmin,
  supabaseAnon,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
};
