# Guía de Integración Supabase + JavaScript

Esta guía muestra cómo conectar tu proyecto a Supabase usando JavaScript, tanto para sitios estáticos como para backends en Node.js.

## 📋 Configuración del Proyecto

### Credenciales de Supabase

Tu proyecto está configurado con:

- **Project URL**: `https://dkfissjbxaevmxcqvpai.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZmlzc2pieGFldm14Y3F2cGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzQ3NjIsImV4cCI6MjA3ODY1MDc2Mn0.jvhYLRPvgkOa-Yx4So9-b3MfouLoRl9f-iHgkldxEcI`

> **⚠️ IMPORTANTE**: La `anon key` es segura para usar en el frontend. La `service_role key` **NUNCA** debe exponerse en código del frontend.

---

## 🌐 Opción A: Sitio Estático (HTML + JavaScript)

### Paso 1: Incluir Supabase desde CDN

Añade en tu archivo HTML:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mi App con Supabase</title>
</head>
<body>
    <h1>Conexión a Supabase</h1>
    <div id="resultado"></div>

    <!-- Cargar Supabase desde CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script>
        // Inicializar cliente Supabase
        const supabase = window.supabase.createClient(
            'https://dkfissjbxaevmxcqvpai.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZmlzc2pieGFldm14Y3F2cGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzQ3NjIsImV4cCI6MjA3ODY1MDc2Mn0.jvhYLRPvgkOa-Yx4So9-b3MfouLoRl9f-iHgkldxEcI'
        );

        console.log('✓ Supabase conectado');
    </script>
</body>
</html>
```

### Paso 2: Ejemplos de Operaciones CRUD

#### Leer datos (SELECT)
```javascript
async function obtenerEstudiantes() {
    const { data, error } = await supabase
        .from('student')
        .select('*')
        .limit(10);
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log('Estudiantes:', data);
    document.getElementById('resultado').innerHTML = JSON.stringify(data, null, 2);
}

obtenerEstudiantes();
```

#### Insertar datos (INSERT)
```javascript
async function crearEstudiante() {
    const { data, error } = await supabase
        .from('student')
        .insert({
            FirstName: 'Juan',
            LastName: 'Pérez',
            Email: 'juan.perez@example.com',
            GradeID: 1
        })
        .select();
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log('Estudiante creado:', data);
}
```

#### Actualizar datos (UPDATE)
```javascript
async function actualizarEstudiante(studentId) {
    const { data, error } = await supabase
        .from('student')
        .update({ 
            Email: 'nuevo.email@example.com',
            IsActive: true
        })
        .eq('StudentID', studentId)
        .select();
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log('Estudiante actualizado:', data);
}
```

#### Eliminar datos (DELETE)
```javascript
async function eliminarEstudiante(studentId) {
    const { error } = await supabase
        .from('student')
        .delete()
        .eq('StudentID', studentId);
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log('Estudiante eliminado');
}
```

### Paso 3: Autenticación de Usuarios

#### Registro (Sign Up)
```javascript
async function registrarUsuario(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });
    
    if (error) {
        console.error('Error en registro:', error);
        return;
    }
    
    console.log('Usuario registrado:', data);
}
```

#### Inicio de Sesión (Sign In)
```javascript
async function iniciarSesion(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) {
        console.error('Error en login:', error);
        return;
    }
    
    console.log('Sesión iniciada:', data);
    console.log('Token:', data.session.access_token);
}
```

#### Cerrar Sesión (Sign Out)
```javascript
async function cerrarSesion() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
        console.error('Error al cerrar sesión:', error);
        return;
    }
    
    console.log('Sesión cerrada');
}
```

#### Obtener Usuario Actual
```javascript
async function obtenerUsuarioActual() {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Usuario actual:', user);
    return user;
}
```

---

## 🖥️ Opción B: Backend Node.js (Web Service en Render)

### Paso 1: Instalación

```bash
npm install @supabase/supabase-js
```

### Paso 2: Configurar Variables de Entorno

En Render, añade estas variables:

```
SUPABASE_URL=https://dkfissjbxaevmxcqvpai.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZmlzc2pieGFldm14Y3F2cGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzQ3NjIsImV4cCI6MjA3ODY1MDc2Mn0.jvhYLRPvgkOa-Yx4So9-b3MfouLoRl9f-iHgkldxEcI
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### Paso 3: Inicializar Cliente Supabase

El proyecto ya incluye `server/supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

module.exports = { supabaseAdmin };
```

### Paso 4: Usar en tus Rutas

```javascript
const express = require('express');
const { supabaseAdmin } = require('./supabase');
const router = express.Router();

// GET - Listar estudiantes
router.get('/estudiantes', async (req, res) => {
    const { data, error } = await supabaseAdmin
        .from('student')
        .select('*')
        .limit(100);
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    res.json(data);
});

// POST - Crear estudiante
router.post('/estudiantes', async (req, res) => {
    const { FirstName, LastName, Email, GradeID } = req.body;
    
    const { data, error } = await supabaseAdmin
        .from('student')
        .insert({ FirstName, LastName, Email, GradeID })
        .select();
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json(data);
});

module.exports = router;
```

---

## 🔐 Autenticación en el Backend

### Verificar Token JWT

```javascript
const { supabaseAdmin } = require('./supabase');

async function verificarToken(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
        return res.status(401).json({ error: 'Token inválido' });
    }
    
    req.user = user;
    next();
}

module.exports = verificarToken;
```

---

## 📦 Despliegue en Render

### Para Sitio Estático:

1. En Render → New → Static Site
2. Conecta tu repositorio
3. Configuración:
   - **Build Command**: *(vacío)*
   - **Publish Directory**: `HTML` (o la carpeta con tus archivos estáticos)

### Para Web Service (Node.js):

1. En Render → New → Web Service
2. Conecta tu repositorio
3. Configuración:
   - **Runtime**: Node
   - **Build Command**: `npm install --production`
   - **Start Command**: `node server/index.js`
4. Añade las variables de entorno mencionadas arriba

---

## 🎯 Ejemplo Completo: Aplicación de Estudiantes

Ver archivo `HTML/supabase-example.html` para un ejemplo completo funcional.

---

## 🔍 Recursos Adicionales

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)

---

## ❓ FAQ

### ¿Cuándo usar `anon key` vs `service_role key`?

- **`anon key`**: Úsala en el frontend. Respeta las políticas RLS.
- **`service_role key`**: Solo en backend. Bypasea RLS. Nunca la expongas.

### ¿Cómo protejo mis datos?

1. Habilita Row Level Security (RLS) en tus tablas
2. Crea políticas que limiten el acceso
3. Usa autenticación para identificar usuarios

### ¿Puedo usar Supabase sin autenticación?

Sí, pero debes configurar políticas RLS que permitan acceso anónimo o usar el `service_role key` en el backend.

---

## 📝 Siguiente Pasos

1. ✅ Revisa el archivo `js/env.js` - ya contiene tus credenciales
2. ✅ Explora `server/supabase.js` - cliente configurado
3. ✅ Prueba el ejemplo en `HTML/supabase-example.html`
4. 📚 Lee la documentación de Supabase
5. 🔒 Configura políticas RLS en tu base de datos
