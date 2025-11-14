**Migración a Node.js + PostgreSQL (Supabase) y despliegue en Render**

- **Backend**: Express en `server/` con rutas bajo `/api`.
- **Base de datos**: PostgreSQL gestionado por Supabase.
- **Despliegue**: Render Web Service usando `render.yaml`.

**Requisitos**
- Node.js 18+
- Cuenta y proyecto en Supabase
- Cuenta en Render

**Configuración**
- Copia `.env.example` a `.env` y rellena:
	- `DATABASE_URL` desde Supabase (Connection string > URI)
	- `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (Settings > API)
- Crea la tabla de ejemplo ejecutando `tools/supabase.sql` en el SQL editor de Supabase.

**Instalación y ejecución local**
```powershell
cd c:\AppServ\www\awdPrueba
npm install
npm run server:dev
```
Backend: `http://localhost:8080/api/health`

**Frontend**
- El frontend ahora usa `API_BASE_URL = '/api'`. Si despliegas el backend en otro host, expón `window.__ENV.API_BASE_URL` en tus páginas para sobreescribir.

**Despliegue en Render**
- Crea un Web Service desde el repo.
- Añade variables de entorno: `PORT`, `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Render usará `npm run server:start`.

**Autenticación (Supabase)**
- El middleware en `server/middleware/auth.js` valida tokens de Supabase con la Service Role Key.
- Protege rutas como `/api/students`. Envía `Authorization: Bearer <token>` generado por Supabase Auth.
**Rutas principales**
La sección con alias `.php` fue eliminada. Todos los endpoints usan estilo REST puro detallado abajo.

## Actualización REST sin sufijos .php (Nov 2025)

Ahora todos los endpoints siguen un estilo REST puro, usando parámetros de ruta y verbos HTTP estándar:

### Resumen rápido
- Listar: `GET /api/<recurso>`
- Obtener por ID: `GET /api/<recurso>/:id`
- Crear: `POST /api/<recurso>`
- Actualizar: `PUT /api/<recurso>/:id`
- Eliminar: `DELETE /api/<recurso>/:id`

### Endpoints finales
- Salud: `GET /api/health`
- Estudiantes: `GET /api/students`, `GET /api/students/:id`, `GET /api/students/by-grade/:gradeId`, `POST /api/students`, `PUT /api/students/:id`, `DELETE /api/students/:id`
- Grados: `GET /api/grades`
- Empleados: `GET /api/employees`, `GET /api/employees/:empId/tasks`
- Tutores (guardians): `GET /api/guardians`, `GET /api/guardians/:id`, `GET /api/guardians/:guardianId/students`, `GET /api/guardians/by-student/:studentId`, `POST /api/guardians`, `PUT /api/guardians/:id` (link a estudiante vía `POST /api/guardians/:id/students`)
- Actividades: `GET /api/activities`, `GET /api/activities/:id`, `GET /api/activities/:id/media`, `POST /api/activities`, `PUT /api/activities/:id`, `DELETE /api/activities/:id`
- Observaciones: `GET /api/observations`, `GET /api/observations/by-student/:studentId`, `POST /api/observations`, `PUT /api/observations/:id`, `DELETE /api/observations/:id`
- Asistencia: `GET /api/attendance`, `GET /api/attendance/by-date?date=YYYY-MM-DD`, `GET /api/attendance/students?gradeId=&date=`, `POST /api/attendance/save`
- Usuarios: `GET /api/users`, `GET /api/users/profile`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id`, `POST /api/users/change-password` (placeholder)
- Roles: `GET /api/roles`, `POST /api/roles`, `PUT /api/roles/:id`, `DELETE /api/roles/:id`, `GET /api/roles/:roleId/permissions`, `POST /api/roles/assign`
- Permisos: `GET /api/permissions`, `POST /api/permissions/assign`, `POST /api/permissions/remove`
- Pagos: `GET /api/payments/student`, `GET /api/payments/student/pending`, `GET /api/payments/student/by-student?studentId=`, `GET /api/payments/teacher`
- Facturas: `GET /api/invoices`, `GET /api/invoices/:id`, `GET /api/invoices/by-reference/:referenceId`

### Formato de respuesta
Todas las rutas devuelven como mínimo: `{ success: boolean, data?: any, error?: string }`.

### Autenticación
Enviar siempre `Authorization: Bearer <token_supabase>` obtenido tras login (password grant) en Supabase Auth.

### Variables de entorno backend (Render)
| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto que escucha Express (Render inyecta) |
| `DATABASE_URL` | Cadena de conexión Postgres (Supabase) |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key para verificar tokens y bypass RLS |

### Configuración frontend

## Despliegue en Render (Docker)

Este proyecto ya no depende de PHP. La carpeta `PHP/` ha sido marcada para eliminación y todo el backend corre en Node.js / Express. Para despliegue en Render se provee un `Dockerfile` y el descriptor `render.yaml`.

### Pasos rápidos
1. Subir el repositorio a GitHub.
2. En Render crear un nuevo Web Service desde el repositorio.
3. Render detectará `render.yaml` y el servicio `env: docker`.
4. Definir variables de entorno requeridas:
	- `DATABASE_URL`
	- `SUPABASE_URL`
	- `SUPABASE_SERVICE_ROLE_KEY`
	- (Render inyecta `PORT` automáticamente)
5. Deploy automático.

### Docker local (opcional)
Si necesitas verificar la imagen antes de subir:

```powershell
docker build -t awdprueba .
docker run -p 8080:8080 -e PORT=8080 -e DATABASE_URL="postgres://..." -e SUPABASE_URL="https://xxxxx.supabase.co" -e SUPABASE_SERVICE_ROLE_KEY="service-role-key" awdprueba
```

### Estructura en la imagen
- `server/` código API.
- `HTML/`, `css/`, `js/`, `vendor/` sirven como assets estáticos si decides exponerlos (actualmente la API solo entrega JSON; servir HTML podría hacerse añadiendo middleware `express.static`).
- Queda excluida la carpeta `PHP/`.

### Eliminación completa de PHP
Para asegurar que no exista relación con PHP en el repositorio, puedes borrar la carpeta `PHP/`. Si necesitas conservarla por motivos históricos, mantenla fuera de la build usando `.dockerignore` (ya configurado).

### Salud y pruebas
Tras el deploy, prueba:
```powershell
curl https://<tu-servicio>.onrender.com/api/health
```
Debe responder `{"status":"ok",...}`.

### Notas
- Si agregas más rutas o sirves frontend estático, añade en `Dockerfile` una línea `app.use(express.static('HTML'))` dentro de tu servidor (código no incluido aún).
- Optimiza la imagen usando `npm prune --production` si agregas dependencias dev tras el build.

Archivo `js/env.js` expone:
```javascript
window.__ENV = {
	API_BASE_URL: '/api',
	SUPABASE_URL: 'https://<project>.supabase.co',
	SUPABASE_ANON_KEY: '<anon-key>'
};
```

### SQL a ejecutar en Supabase
1. `tools/schema_postgres.sql` (crea tablas, enums, triggers, mapeo con `auth.users`).
2. `tools/supabase_policies.sql` (habilita RLS y políticas iniciales).

### Migración desde versión legacy
1. Sustituir cualquier llamada `.../modulo/endpoint.php` por la ruta REST nueva.
2. Cambiar métodos de actualización/eliminación a `PUT` y `DELETE` donde se modificaron.
3. Eliminar scripts de reemplazo (`tools/replace_endpoints.js`) una vez verificada la migración.
4. Revisar consola del navegador para detectar llamadas obsoletas 404.

### Próximos pasos sugeridos
- Añadir tests automatizados (Jest/Supertest) para endpoints críticos.
- Implementar cambio real de contraseña mediante Supabase Admin API.
- Expandir políticas RLS para permitir lecturas directas desde frontend si se desea (actualmente se delega todo al backend service role).

---

**Estado actual**: Proyecto listo para operar sin dependencia de archivos PHP, usando Supabase + Render.
