# Integración Supabase + Express API

Este proyecto utiliza Supabase de dos formas:

## 1. Backend API (Express + Supabase)

El backend en `server/` usa Supabase para:
- **Autenticación**: Verificar tokens JWT en el middleware `server/middleware/auth.js`
- **Base de datos**: Consultas directas usando el cliente Supabase en `server/supabase.js`

### Flujo de Autenticación

```
Frontend → Supabase Auth (login) → Recibe JWT token
Frontend → API Backend (con token en header) → Middleware valida token → Ruta protegida
```

### Ejemplo de uso en rutas

```javascript
const { supabaseAdmin } = require('../supabase');

router.get('/students', async (req, res) => {
    const { data, error } = await supabaseAdmin
        .from('student')
        .select('*')
        .limit(10);
    
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});
```

## 2. Frontend (HTML + JavaScript)

El frontend puede usar Supabase de dos formas:

### Opción A: Llamadas directas a Supabase (recomendado para apps simples)

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/env.js"></script>
<script src="js/supabase-helper.js"></script>
<script>
    // Usar helpers
    const students = await SupabaseDB.select('student', { limit: 10 });
    console.log(students);
</script>
```

### Opción B: Llamadas a través del API Backend (actual)

```javascript
// Login a través de Supabase
const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
});
const { access_token } = await response.json();

// Luego llamar al backend con el token
const students = await fetch(`${API_BASE_URL}/students`, {
    headers: {
        'Authorization': `Bearer ${access_token}`
    }
});
```

## 3. ¿Cuándo usar cada método?

### Usar Supabase directamente desde frontend cuando:
- ✅ Tienes políticas RLS configuradas
- ✅ La lógica es simple (CRUD básico)
- ✅ Quieres reducir latencia
- ✅ No necesitas lógica de negocio compleja

### Usar API Backend cuando:
- ✅ Necesitas lógica de negocio compleja
- ✅ Quieres centralizar la seguridad
- ✅ Necesitas agregar validaciones adicionales
- ✅ Quieres abstraer la base de datos del frontend

## 4. Configuración de RLS (Row Level Security)

Para usar Supabase directamente desde el frontend, debes configurar RLS:

```sql
-- Habilitar RLS en la tabla
ALTER TABLE student ENABLE ROW LEVEL SECURITY;

-- Política para lectura (ejemplo: solo usuarios autenticados)
CREATE POLICY "Users can read students"
ON student FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Política para inserción
CREATE POLICY "Users can insert students"
ON student FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Política para actualización
CREATE POLICY "Users can update students"
ON student FOR UPDATE
USING (auth.uid() IS NOT NULL);
```

## 5. Archivos Importantes

- `server/supabase.js` - Cliente Supabase para backend
- `server/middleware/auth.js` - Middleware de autenticación
- `js/env.js` - Configuración frontend (URL y keys)
- `js/supabase-helper.js` - Helpers para usar Supabase en frontend
- `HTML/supabase-example.html` - Ejemplo completo funcional

## 6. Variables de Entorno Necesarias

### Backend (.env)
```env
SUPABASE_URL=https://dkfissjbxaevmxcqvpai.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Frontend (js/env.js)
```javascript
window.__ENV = {
  SUPABASE_URL: 'https://dkfissjbxaevmxcqvpai.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

## 7. Flujo Recomendado para este Proyecto

Actualmente el proyecto usa **Opción B** (API Backend), lo cual es correcto porque:

1. ✅ Centraliza la lógica de negocio en el backend
2. ✅ El middleware de autenticación valida todos los tokens
3. ✅ Las rutas están protegidas consistentemente
4. ✅ Se puede migrar la DB sin cambiar el frontend

Si quieres usar **Opción A** (Supabase directo):

1. Configura políticas RLS en Supabase
2. Usa `js/supabase-helper.js` en tus páginas
3. Elimina las llamadas al API backend
4. Usa directamente `SupabaseDB.select()`, etc.

## 8. Próximos Pasos

1. ✅ Revisa `HTML/supabase-example.html` - ejemplo completo
2. 📚 Lee `README_SUPABASE.md` - documentación detallada
3. ⚡ Lee `QUICKSTART_SUPABASE.md` - inicio rápido
4. 🔒 Configura RLS si vas a usar Supabase directamente
5. 🚀 Despliega en Render con las variables de entorno

## 9. Recursos

- [Documentación Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Render Deploy Guide](https://render.com/docs)
