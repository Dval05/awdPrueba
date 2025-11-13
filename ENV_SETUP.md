# Environment Variables Setup Guide

## Para Clever Cloud

Clever Cloud detecta automáticamente las variables de entorno cuando vinculas tu base de datos MySQL. Las siguientes variables se crearán automáticamente:

```
MYSQL_ADDON_HOST
MYSQL_ADDON_DB
MYSQL_ADDON_USER
MYSQL_ADDON_PORT
MYSQL_ADDON_PASSWORD
MYSQL_ADDON_URI
```

**No necesitas configurar nada manualmente** - solo vincula tu addon MySQL desde el panel de control.

## Para Render

Configura las siguientes variables de entorno en el dashboard de Render:

```
MYSQL_ADDON_HOST=bgugearxrbakootubsyl-mysql.services.clever-cloud.com
MYSQL_ADDON_DB=bgugearxrbakootubsyl
MYSQL_ADDON_USER=u9icnkoqpjazwzdb
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=phSXIq897qAaZQMzDhu0
```

### Cómo agregar variables de entorno en Render:

1. Ve a tu servicio web en Render
2. Haz clic en "Environment" en el menú lateral
3. Haz clic en "Add Environment Variable"
4. Agrega cada variable con su clave y valor
5. Guarda los cambios

## Para desarrollo local

### Opción 1: Usar variables de entorno del sistema

En Linux/Mac:
```bash
export MYSQL_ADDON_HOST=localhost
export MYSQL_ADDON_USER=admin
export MYSQL_ADDON_PASSWORD=admin
export MYSQL_ADDON_DB=nicekids1
export MYSQL_ADDON_PORT=3306
```

En Windows (PowerShell):
```powershell
$env:MYSQL_ADDON_HOST="localhost"
$env:MYSQL_ADDON_USER="admin"
$env:MYSQL_ADDON_PASSWORD="admin"
$env:MYSQL_ADDON_DB="nicekids1"
$env:MYSQL_ADDON_PORT="3306"
```

### Opción 2: No configurar nada

Si no configuras variables de entorno, el código usará automáticamente los valores por defecto para desarrollo local:
- Host: localhost
- Usuario: admin
- Contraseña: admin
- Base de datos: nicekids1
- Puerto: 3306

## Verificar las variables

Para verificar que las variables están configuradas correctamente, visita:
```
https://tu-dominio/tools/db_check.php
```

O en local:
```
http://localhost/awdPrueba/tools/db_check.php
```

Deberías ver:
```json
{
  "success": true,
  "message": "Conectado a MySQL ...",
  "query_ok": true
}
```

## Seguridad

⚠️ **IMPORTANTE**: 
- NUNCA subas el archivo `.env` al repositorio
- NUNCA hagas commit de tus credenciales de base de datos
- Usa variables de entorno en producción
- Las credenciales mostradas aquí son de ejemplo y deben mantenerse seguras
