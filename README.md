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

**Rutas de ejemplo**
- `GET /api/health` – estado del servicio.
- `GET /api/students` – lista de estudiantes (requiere token).
- `POST /api/students` – crear estudiante (requiere token).

Extiende el patrón para otras entidades migrando desde PHP.
