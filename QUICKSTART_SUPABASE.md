# 🚀 Guía Rápida de Inicio - Supabase + JavaScript

Esta guía te ayudará a empezar rápidamente con Supabase en tu proyecto.

## ✅ Paso 1: ¿Qué tipo de proyecto tienes?

### Opción A: Sitio Estático (solo HTML/CSS/JS)
- No necesitas servidor Node.js
- Perfecto para páginas simples
- Se despliega en Render como "Static Site"

### Opción B: Aplicación Node.js (backend + frontend)
- Necesitas un servidor Express
- Ideal para aplicaciones complejas
- Se despliega en Render como "Web Service"

---

## 🌐 OPCIÓN A: Sitio Estático

### 1. Abre tu archivo HTML y agrega:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mi App</title>
</head>
<body>
    <h1>Mi Aplicación con Supabase</h1>
    <button onclick="probarConexion()">Probar Conexión</button>
    <div id="resultado"></div>

    <!-- Cargar Supabase -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script>
        // Inicializar Supabase
        const supabase = window.supabase.createClient(
            'https://dkfissjbxaevmxcqvpai.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZmlzc2pieGFldm14Y3F2cGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzQ3NjIsImV4cCI6MjA3ODY1MDc2Mn0.jvhYLRPvgkOa-Yx4So9-b3MfouLoRl9f-iHgkldxEcI'
        );

        async function probarConexion() {
            const { data, error } = await supabase.from('student').select('*').limit(5);
            
            if (error) {
                document.getElementById('resultado').innerHTML = 
                    'Error: ' + error.message;
            } else {
                document.getElementById('resultado').innerHTML = 
                    'Conectado! Estudiantes: ' + data.length;
            }
        }
    </script>
</body>
</html>
```

### 2. Desplegar en Render

1. Sube tu código a GitHub
2. En Render → **New** → **Static Site**
3. Conecta tu repositorio
4. Configuración:
   - **Build Command**: (dejar vacío)
   - **Publish Directory**: `HTML` (o donde estén tus archivos)
5. Click en **Create Static Site**

¡Listo! Tu sitio estará en `https://tu-proyecto.onrender.com`

---

## 🖥️ OPCIÓN B: Backend Node.js

### 1. Instalar dependencias (si no lo has hecho)

```bash
npm install @supabase/supabase-js express cors dotenv
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz:

```env
PORT=8080
SUPABASE_URL=https://dkfissjbxaevmxcqvpai.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZmlzc2pieGFldm14Y3F2cGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzQ3NjIsImV4cCI6MjA3ODY1MDc2Mn0.jvhYLRPvgkOa-Yx4So9-b3MfouLoRl9f-iHgkldxEcI
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

### 3. Crear tu servidor (si no existe)

Archivo `server.js`:

```javascript
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Inicializar Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Ruta de prueba
app.get('/api/estudiantes', async (req, res) => {
    const { data, error } = await supabase
        .from('student')
        .select('*')
        .limit(10);
    
    if (error) {
        return res.status(400).json({ error: error.message });
    }
    
    res.json(data);
});

app.listen(process.env.PORT || 8080, () => {
    console.log('Servidor corriendo en puerto', process.env.PORT || 8080);
});
```

### 4. Ejecutar localmente

```bash
node server.js
```

Abre en tu navegador: `http://localhost:8080/api/estudiantes`

### 5. Desplegar en Render

1. Sube tu código a GitHub
2. En Render → **New** → **Web Service**
3. Conecta tu repositorio
4. Configuración:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. En **Environment Variables**, agrega:
   ```
   SUPABASE_URL=https://dkfissjbxaevmxcqvpai.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   ```
6. Click en **Create Web Service**

---

## 📚 Ejemplos Incluidos en este Proyecto

### 1. Archivo de ejemplo completo
- Abre: `HTML/supabase-example.html`
- Contiene ejemplos de CRUD y autenticación
- Funciona directamente en el navegador

### 2. Rutas de ejemplo en el backend
- Endpoint: `/api/supabase-examples/health`
- Ver: `server/routes/supabase-examples.js`

### 3. Cliente Supabase configurado
- Backend: `server/supabase.js`
- Frontend: `js/env.js`

---

## 🎯 Próximos Pasos

### Para Sitio Estático:
1. ✅ Abre `HTML/supabase-example.html` en tu navegador
2. ✅ Prueba las funciones de autenticación y CRUD
3. ✅ Copia el código a tu proyecto
4. ✅ Personaliza según tus necesidades

### Para Backend Node.js:
1. ✅ Corre el servidor: `npm run server:start`
2. ✅ Prueba: `http://localhost:8080/api/supabase-examples/health`
3. ✅ Revisa los ejemplos en `server/routes/supabase-examples.js`
4. ✅ Crea tus propias rutas basándote en los ejemplos

---

## 📖 Documentación Completa

Lee `README_SUPABASE.md` para:
- Ejemplos detallados de todas las operaciones
- Guía de autenticación
- Configuración de RLS (Row Level Security)
- Consultas avanzadas
- Mejores prácticas

---

## ❓ Problemas Comunes

### Error: "relation 'student' does not exist"
**Solución**: Debes crear las tablas en Supabase primero. Ejecuta los scripts SQL en `tools/schema_postgres.sql`

### Error: "Invalid API key"
**Solución**: Verifica que estás usando la clave correcta:
- Frontend: usa `SUPABASE_ANON_KEY`
- Backend: usa `SUPABASE_SERVICE_ROLE_KEY`

### No puedo insertar datos
**Solución**: Verifica las políticas RLS en Supabase. Si estás usando `anon key`, necesitas políticas que permitan inserciones.

---

## 🔗 Enlaces Útiles

- [Documentación Supabase](https://supabase.com/docs)
- [JavaScript Client Reference](https://supabase.com/docs/reference/javascript)
- [Render Deployment Guide](https://render.com/docs)

---

## 💡 Consejo Final

**¿No estás seguro qué opción elegir?**

- Si solo necesitas una página web simple → **Opción A (Sitio Estático)**
- Si necesitas autenticación compleja o lógica de servidor → **Opción B (Node.js)**

Para este proyecto NICEKIDS, ya tienes **Opción B** configurada. Solo necesitas:
1. Configurar las variables de entorno
2. Correr `npm run server:start`
3. ¡Empezar a desarrollar!
