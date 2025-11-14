const express = require('express');
const router = express.Router();
const { supabaseAdmin, supabaseAnon } = require('../supabase');

/**
 * Example endpoints demonstrating Supabase integration
 * These are for demonstration purposes - real endpoints are in other route files
 */

// GET /api/supabase-examples/health - Check Supabase connection
router.get('/health', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ 
      success: false, 
      error: 'Supabase not configured' 
    });
  }
  
  try {
    // Try a simple query to verify connection
    const { error } = await supabaseAdmin.from('student').select('count', { count: 'exact', head: true });
    
    if (error) {
      return res.json({ 
        success: true, 
        message: 'Supabase connected but table access issue',
        error: error.message 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Supabase connection working perfectly' 
    });
  } catch (e) {
    res.status(500).json({ 
      success: false, 
      error: e.message 
    });
  }
});

// GET /api/supabase-examples/students - Example: List students
router.get('/students', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ success: false, error: 'Supabase not configured' });
  }
  
  try {
    const { data, error } = await supabaseAdmin
      .from('student')
      .select('StudentID, FirstName, LastName, Email, GradeID, IsActive')
      .limit(10);
    
    if (error) throw error;
    
    res.json({ 
      success: true, 
      count: data.length,
      data 
    });
  } catch (e) {
    console.error('Example students list error:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// POST /api/supabase-examples/students - Example: Create student
router.post('/students', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ success: false, error: 'Supabase not configured' });
  }
  
  const { FirstName, LastName, Email, GradeID } = req.body || {};
  
  if (!FirstName || !LastName) {
    return res.status(400).json({ 
      success: false, 
      error: 'FirstName and LastName are required' 
    });
  }
  
  try {
    const { data, error } = await supabaseAdmin
      .from('student')
      .insert({
        FirstName,
        LastName,
        Email: Email || null,
        GradeID: GradeID || null
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json({ 
      success: true, 
      message: 'Student created',
      data: data[0]
    });
  } catch (e) {
    console.error('Example student create error:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// PUT /api/supabase-examples/students/:id - Example: Update student
router.put('/students/:id', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ success: false, error: 'Supabase not configured' });
  }
  
  const studentId = req.params.id;
  const { FirstName, LastName, Email, GradeID, IsActive } = req.body || {};
  
  try {
    const updateData = {};
    if (FirstName !== undefined) updateData.FirstName = FirstName;
    if (LastName !== undefined) updateData.LastName = LastName;
    if (Email !== undefined) updateData.Email = Email;
    if (GradeID !== undefined) updateData.GradeID = GradeID;
    if (IsActive !== undefined) updateData.IsActive = IsActive;
    
    const { data, error } = await supabaseAdmin
      .from('student')
      .update(updateData)
      .eq('StudentID', studentId)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Student updated',
      data: data[0]
    });
  } catch (e) {
    console.error('Example student update error:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// DELETE /api/supabase-examples/students/:id - Example: Delete student
router.delete('/students/:id', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ success: false, error: 'Supabase not configured' });
  }
  
  const studentId = req.params.id;
  
  try {
    const { error } = await supabaseAdmin
      .from('student')
      .delete()
      .eq('StudentID', studentId);
    
    if (error) throw error;
    
    res.json({ 
      success: true, 
      message: 'Student deleted'
    });
  } catch (e) {
    console.error('Example student delete error:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// GET /api/supabase-examples/auth-demo - Example: Auth operations
router.get('/auth-demo', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ success: false, error: 'Supabase not configured' });
  }
  
  res.json({
    success: true,
    message: 'Auth demo endpoint',
    examples: {
      signup: {
        method: 'POST',
        endpoint: '/api/supabase-examples/auth/signup',
        body: { email: 'user@example.com', password: 'password123' }
      },
      login: {
        method: 'POST',
        endpoint: '/api/supabase-examples/auth/login',
        body: { email: 'user@example.com', password: 'password123' }
      }
    }
  });
});

// POST /api/supabase-examples/auth/signup - Example: User signup
router.post('/auth/signup', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(503).json({ success: false, error: 'Supabase not configured' });
  }
  
  const { email, password } = req.body || {};
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email and password are required' 
    });
  }
  
  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    
    if (error) throw error;
    
    res.status(201).json({ 
      success: true, 
      message: 'User created',
      user: {
        id: data.user.id,
        email: data.user.email
      }
    });
  } catch (e) {
    console.error('Example signup error:', e);
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
