const { supabaseAdmin } = require('../supabase');

async function authMiddleware(req, res, next) {
  if (!supabaseAdmin) {
    return next();
  }
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = data.user;
    next();
  } catch (e) {
    console.error('Auth error', e);
    return res.status(500).json({ error: 'Auth verification failed' });
  }
}

module.exports = authMiddleware;
